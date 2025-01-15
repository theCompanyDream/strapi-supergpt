"use strict"
const chatGPTController = require("../../../server/src/controllers/chat.gpt.controller");

describe("Should ChatGPT Controller", () => {
  let strapi;

  beforeEach(() => {
    // Mocking strapi.plugin().service() structure
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          getResponsefromChatGpt: jest.fn().mockResolvedValue("ChatGPT response"),
          // If more service methods are used, mock them similarly
          getImageResponsefromChatGpt: jest.fn().mockResolvedValue(""),
          getAudioFromText: jest.fn().mockResolvedValue(""),
        }),
      })
    }
  })

  // Cleanup or setup resources if necessary
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks to clean state after each test
  });

  it("handle 'prompt' correctly", async () => {
    // Mocking the ctx object with send method
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await chatGPTController({ strapi }).prompt(ctx);

    // Check if getResponsefromChatGpt is called correctly
    expect(strapi.plugin('strapi-supergpt').service('superGptService').getResponsefromChatGpt).toHaveBeenCalledWith(ctx);

    // Check if the send method was called with the expected response
    expect(strapi.plugin('strapi-supergpt').service('superGptService').getResponsefromChatGpt).toHaveBeenCalledTimes(1)
  });

  it("handle 'createImage' correctly", async () => {
    // Mocking the ctx object with send method
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await chatGPTController({ strapi }).createImage(ctx);

    // Check if createImage is called correctly
    expect(strapi.plugin('strapi-supergpt').service('superGptService').getImageResponsefromChatGpt).toHaveBeenCalledWith(ctx);


    expect(strapi.plugin('strapi-supergpt').service('superGptService').getImageResponsefromChatGpt).toHaveBeenCalledTimes(1);
  });

  it("handle 'createAudio' correctly ", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await chatGPTController({ strapi }).createAudio(ctx);

    // Check if createImage is called correctly
    expect(strapi.plugin('strapi-supergpt').service('superGptService').getAudioFromText).toHaveBeenCalledWith(ctx);


    expect(strapi.plugin('strapi-supergpt').service('superGptService').getAudioFromText).toHaveBeenCalledTimes(1);
  })
});
