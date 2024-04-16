"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/convo",
      handler: "convoController.readConvo",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/convos",
      handler: "convoController.readConvoNames",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/convo",
      handler: "convoController.createConvo",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/convo",
      handler: "convoController.updateConvo",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/convo",
      handler: "convoController.deleteConvo",
      config: {
        policies: [],
      },
    },
  ],
};
