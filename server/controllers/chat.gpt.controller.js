"use strict";

module.exports = ({ strapi }) => ({
  async prompt(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getResponsefromChatGpt(ctx);
    ctx.send(data);
  },
  async createImage(ctx) {
    const config = await strapi
      .plugin("strapi-supergpt")
      .service("superGptService")
      .getImageResponsefromChatGpt(ctx);
    ctx.send(config);
  },
});
