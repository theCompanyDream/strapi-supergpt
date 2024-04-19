// @ts-nocheck
"use strict";
const utils = require("../utils");

const convoObject = "plugin::strapi-supergpt.convo";

module.exports = ({ strapi }) => ({
  config: strapi.plugin("strapi-supergpt").service("cacheService").getConfig(),
  async createConvo(ctx) {
    const { name } = ctx.request.body;
    const convo = await strapi.db.query(convoObject).create({
      data: {
        name: name,
        content: ""
      },
    });
    return convo;
  },
  async readConvo(ctx) {
    const { id } = ctx.params;
    const convo = await strapi.db.query(convoObject).findOne({
      select: ["content"],
      where: {
        id: id,
      },
    });
    return utils.conversationToArray(convo.content)
  },
  async readConvoNames() {
    if (this.config.convoCount == 1) {
      const convo = this.readConvo({ query: { id: convos[0].id } });
      return [convo];
    }
    let convos = await strapi.db.query(convoObject).findMany({
      select: ["id", "name"],
      where: {
        $not: {
          name: null,
        },
      },
    });
    convos = convos.map((convo) => {
      return { ...convo, content: [] };
    });
    if (convos.length > 0) {
      const conversation = await this.readConvo({ params: { id: convos[0].id } });
      convos[0].content = conversation;
    }
    return convos;
  },
  async updateConvo(ctx) {
    const { id } = ctx.params;
    const { name, content } = ctx.request.body;
    const convo = await strapi.db.query(convoObject).update({
      where: {
        id,
      },
      data: {
        name,
        content: utils.condenseArray(content),
      },
    });
    return convo;
  },
  async deleteConvo(ctx) {
    const { id } = ctx.params;
    const convo = await strapi.db.query(convoObject).delete({
      where: {
        id,
      },
    });
    return convo;
  },
});
