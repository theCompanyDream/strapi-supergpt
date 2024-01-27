"use strict";

module.exports = ({ strapi }) => ({
  async prompt(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getResponsefromChatGpt(ctx);
    ctx.send(data);
  },

  async getConfig(ctx) {
    const config = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getConfig();
    ctx.send(config);
  },

  async updateConfig(ctx) {
    const config = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .updateConfig(ctx);
    ctx.send(config);
  },

  async createImage(ctx) {
    const config = await strapi
    .plugin("strapi-supergpt")
    .service("superGptService")
    .getImageResponsefromChatGpt(ctx);
    ctx.send(config);
  },
});
