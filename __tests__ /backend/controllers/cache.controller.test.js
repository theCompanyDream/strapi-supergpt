"use strict";
const cacheController = require("../../../server/src/controllers/cache.controller");

describe("Should Caching Controller", () => {
  let strapi;

  beforeEach(() => {
    // Mocking strapi.plugin().service() structure
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          updateConfig: jest.fn().mockResolvedValue("This didn't work"),
          // If more service methods are used, mock them similarly
          getConfig: jest.fn().mockResolvedValue("DO THE ROAR"),
        }),
      }),
    };
  });

  // Cleanup or setup resources if necessary
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks to clean state after each test
  });

  it("handle 'updateConfig' correctly", async () => {
    // Mocking the ctx object with send method
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await cacheController({ strapi }).updateConfig(ctx);

    // Check if getResponsefromChatGpt is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("cacheController").updateConfig,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("cacheController").updateConfig,
    ).toHaveBeenCalledTimes(1);

    // Check if the send method was called with the expected response
    expect(ctx.send).toHaveBeenCalledWith("This didn't work");
  });

  it("handle 'getConfig' correctly", async () => {
    // Mocking the ctx object with send method
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await cacheController({ strapi }).getConfig(ctx);

    // Check if getConfig is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("cacheController").getConfig,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("cacheController").getConfig,
    ).toHaveBeenCalledTimes(1);
  });
});
