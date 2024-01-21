"use strict";
const { OpenAI } = require("openai");

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
        prompt: prompt,
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

  getConfig() {
    try {
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "strapi-chatgpt",
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
        name: "strapi-chatgpt",
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
