"use strict";

const chatGptRoutes = require("./chat.gpt.routes");
const convoRoutes = require("./convo.routes");
const cacheRoutes = require("./cache.routes");

module.exports = {
  cacheRoutes,
  chatGptRoutes,
  convoRoutes,
};
