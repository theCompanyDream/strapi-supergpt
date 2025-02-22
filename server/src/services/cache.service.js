"use strict";
module.exports = ({ strapi }) => ({
  getConfig() {
    try {
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "strapi-supergpt",
      });

      return pluginStore.get({ key: "supergpt" });
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
      const body = ctx.request.body;
      const data = {
        apiKey: body.apiKey,
        modelName: body.modelName || "gpt-4o",
        aiImageModelName: body.aiImageModelName || "dall-e-3",
        temperature: body.temperature || 0.0,
        maxTokens: body.maxTokens || 2048,
        topP: body.topP,
        frequencyPenalty: body.frequencyPenalty || 0.0,
        presencePenalty: body.presencePenalty || 0.0,
        stop: body.stop || "",
        convoCount: body.Count || "",
        ttsModelName: body.ttsModelName || ""
      };
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "strapi-supergpt",
      });
      return pluginStore.set({
        key: "supergpt",
        value: data,
      });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          "An error occurred while updating the chatGPT config. Please try after some time",
      };
    }
  },
});
