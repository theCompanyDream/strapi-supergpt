"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cache",
      handler: "cacheController.getConfig",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/cache/update",
      handler: "cacheController.updateConfig",
      config: {
        policies: [],
      },
    },
  ],
};
