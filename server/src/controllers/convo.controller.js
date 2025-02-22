"use strict";
const convoController = ({ strapi }) => ({
  async createConvo(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .createConvo(ctx);
  },
  async readConvo(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .readConvo(ctx);
  },
  async readConvoNames(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .readConvoNames(ctx);
  },
  async updateConvo(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .updateConvo(ctx);
  },
  async deleteConvo(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("convoService")
      .deleteConvo(ctx);
  },
});

export default convoController;