"use strict";
const { OpenAI } = require("openai");
const utils = require("../utils");

module.exports = ({ strapi }) => ({
  async getResponsefromChatGpt(ctx) {
    const config = await strapi.plugin("strapi-supergpt").service("cacheService").getConfig()
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
        max_tokens: config.maxTokens
          ? parseInt(config.maxTokens)
          : 2048,
        prompt: prompt.trim(),
      };

      // Add optional parameters from request body if present
      const data = await openai.chat.completions.create({
        messages: [{ role: "user", content: requestParams.prompt }],
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
    const config = await strapi.plugin("strapi-supergpt").service("cacheService").getConfig()

    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const { prompt, aiImageModelName, size, quality } = ctx.request.body;
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
        model: aiImageModelName
          ? aiImageModelName
          : requestParams.aiImageModelName,
        size,
      });

      const savedFile = await utils.saveFile(data.data[0].url, strapi);

      return { response: `<a href="${savedFile}">${savedFile}</a><a href="${data.data[0].url}">Original Location</a>` };
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
  async getAudioFromText(ctx) {
    const config = await strapi.plugin("strapi-supergpt").service("cacheService").getConfig()
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });
    const {
      prompt,
      title,
      voice,
    } = ctx.request.body;

    // 4096 is the character limit allowed to be processed
    const textChunks = utils.splitTextIntoChunks(prompt.trim(), 4096);
    let combinedAudioBuffer = Buffer.alloc(0);

    try {
      for (const chunk of textChunks) {
        const mp3 = await openai.audio.speech.create({
          model: config.ttsModelName,
          voice: voice,
          input: chunk,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        combinedAudioBuffer = Buffer.concat([combinedAudioBuffer, buffer]);
      }

      const savedFile = await utils.saveMp3FileFromBuffer(combinedAudioBuffer, strapi);
      return { response: `<p>Sure,</p><a href="${savedFile}">Download Audio</a>`, file: savedFile };
    } catch (error) {
      console.error('Error generating audio:', error);
      ctx.throw(500, 'Internal Server Error');
    }
  },
  async saveFiles(ctx) {
    const config = await strapi.plugin("strapi-supergpt").service("cacheService").getConfig()
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });
    openai.beta.assistants.
    openai.files.create({

    })
  }
});
