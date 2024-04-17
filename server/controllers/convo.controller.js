"use strict";
module.exports = ({ strapi }) => ({
  async createConvo(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .createConvo(ctx);
    ctx.send(data);
  },
  async readConvo(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .readConvo(ctx);
    ctx.send(data);
  },
  async readConvoNames(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .readConvoNames(ctx);
    ctx.send(data);
  },
  async updateConvo(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .updateConvo(ctx);
    ctx.send(data);
  },
  async deleteConvo(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .deleteConvo(ctx);
    ctx.send(data);
  },
});
