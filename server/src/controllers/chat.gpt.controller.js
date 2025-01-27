"use strict";

const chatGPTController = ({ strapi }) => ({
  async prompt(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getResponsefromChatGpt(ctx);
  },
  async createImage(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getImageResponsefromChatGpt(ctx);
  },
  async createAudio(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getAudioFromText(ctx);
  },
});

export default chatGPTController;