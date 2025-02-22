"use strict";

const cacheController = ({ strapi }) => ({
  async updateConfig(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .updateConfig(ctx);
  },
  async getConfig(ctx) {
    ctx.body = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .getConfig(ctx);
  },
});

export default cacheController;