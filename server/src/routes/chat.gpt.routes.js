"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/prompt",
      handler: "chatGptController.prompt",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/generateImage",
      handler: "chatGptController.createImage",
      config: {
        policies: [],
      },
    },
    // {
    //   method: "POST",
    //   path: "/generateAudio",
    //   handler: "chatGptController.createAudio",
    //   config: {
    //     policies: [],
    //   },
    // },
  ],
};
