"use strict";

module.exports = ({ strapi }) => ({
  async updateConfig(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .updateConfig(ctx);
    ctx.send(data);
  },
  async getConfig(ctx) {
    const data = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .getConfig(ctx);
    ctx.send(data);
  },
});
