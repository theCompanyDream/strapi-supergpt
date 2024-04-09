"use strict";

module.exports = ({ strapi }) => ({
  async updateConfig(ctx) {
    const config = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .updateConfig(ctx);
    ctx.send(config);
  },
  async getConfig(ctx) {
    const config = await strapi
      .plugin("strapi-supergpt")
      .service("cacheService")
      .getConfig();
    ctx.send(config);
  }
});
