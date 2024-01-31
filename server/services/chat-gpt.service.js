"use strict";
const https = require('https');
const fs = require('fs');
const crypto =  require("crypto");
const { OpenAI } = require("openai");
const mime = require('mime-types'); //used to detect file's mime type

module.exports = ({ strapi }) => ({
  async getResponsefromChatGpt(ctx) {
    const config = await this.getConfig();
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const {
      prompt,
      model,
      max_tokens,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      stop,
    } = ctx.request.body;
    try {
      const requestParams = {
        model: config.modelName,
        max_tokens: config.maxTokens ? parseInt(config.maxTokens) : 2048,
        prompt: prompt.trim(),
      };

      // Add optional parameters from request body if present
      const data = await openai.chat.completions.create({
        messages: [{role: 'user', content: requestParams.prompt}],
        temperature,
        model: model ? model : requestParams.model,
        max_tokens: max_tokens
          ? parseInt(max_tokens)
          : requestParams.max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
        stop,
      });
      return { response: data.choices[0].message.content.trim() };
    } catch (error) {
      if (error.response) {
        strapi.log.error(error.response.data.error.message);
        return { error: error.response.data.error.message };
      }
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while fetching the chat response. Please try after some time",
      };
    }
  },

  async getImageResponsefromChatGpt(ctx) {
    const config = await this.getConfig();

    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const {
      prompt,
      aiImageModelName,
      size,
      quality,
    } = ctx.request.body;
    try {
      const requestParams = {
        aiImageModelName: config.aiImageModelName,
        size,
        quality,
        prompt: prompt.trim(),
      };

      // Add optional parameters from request body if present
      const data = await openai.images.generate({
        prompt: requestParams.prompt,
        model: aiImageModelName ? aiImageModelName : requestParams.aiImageModelName,
        size,
      });

      const savedFile = await saveFile(data.data[0].url)

      return { response: [savedFile, data.data[0].url]};
    } catch (error) {
      if (error.response) {
        strapi.log.error(error.response.data.error.message);
        return { error: error.response.data.error.message };
      }
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while fetching the chat response. Please try after some time",
      };
    }
  },

  getConfig() {
    try {
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "strapi-supergpt",
      });

      return pluginStore.get({ key: "strapiChatGPTConfig" });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while fetching chatGPT config. Please try after some time",
      };
    }
  },

  updateConfig(ctx) {
    try {
      const reqBody = ctx.request.body;
      const data = {
        apiKey: reqBody.apiKey,
        modelName: reqBody.modelName || "gpt-3.5-turbo",
        aiImageModelName: reqBody.aiImageModelName || "dall-e-3",
        temperature: reqBody.temperature || 0.0,
        maxTokens: reqBody.maxTokens || 2048,
        topP: reqBody.topP,
        frequencyPenalty: reqBody.frequencyPenalty || 0.0,
        presencePenalty: reqBody.presencePenalty || 0.0,
        stop: reqBody.stop || "",
      };
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "strapi-supergpt",
      });

      return pluginStore.set({
        key: "strapiChatGPTConfig",
        value: data,
      });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while updting the chatGPT config. Please try after some time",
      };
    }
  },
});

async function saveFile(url) {
  return new Promise((resolve, reject) => {
    strapi.log.info(`Saving the picture ${url}`);
    const fileName = crypto.randomUUID();
    const rootDir = process.cwd();
    const filePath = `${rootDir}/public/uploads/${fileName}.png`;
    const file = fs.createWriteStream(filePath);
    const request = https.get(url, function(response) {
      response.pipe(file);

      file.on("finish", async () => {
        file.close();
        strapi.log.info("Download Completed");

        // Ensure the file is closed before accessing its stats
        fs.stat(filePath, async (err, stats) => {
          if (err) {
            reject(strapi.log.error('Error getting file stats'));
          }

          // Now that the download is complete and file is closed, upload it
          const upload = await strapi.plugins.upload.services.upload.upload({
            data: {}, // mandatory declare the data (can be empty)
            files: {
              path: filePath,
              name: `${fileName}.png`,
              type: mime.lookup(filePath), // mime type of the file
              size: stats.size,
            },
          });
          strapi.log.info('Upload Completed');
          resolve(upload[0].formats['medium'].url)
        });
      });
    });

    request.on('error', (e) => {
      reject(strapi.log.error(`Request error: ${e.message}`));
    });
  })
}