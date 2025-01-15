const convoController = require("../../../server/src/controllers/convo.controller");

describe("Should Conversation Controller", () => {
  let strapi;
  beforeEach(() => {
    // Mocking strapi.plugin().service() structure
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          createConvo: jest.fn().mockResolvedValue("update response"),
          // If more service methods are used, mock them similarly
          readConvo: jest.fn().mockResolvedValue("DO THE ROAR"),
          readConvoNames: jest.fn().mockResolvedValue(""),
          updateConvo: jest.fn().mockResolvedValue(""),
          deleteConvo: jest.fn().mockResolvedValue(""),
        }),
      }),
    };
  });

  // Cleanup or setup resources if necessary
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks to clean state after each test
  });

  it("handle createConvo works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).createConvo(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").createConvo,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").createConvo,
    ).toHaveBeenCalledTimes(1);
  });

  it("handle test createConvo works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).createConvo(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").createConvo,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").createConvo,
    ).toHaveBeenCalledTimes(1);
  });

  it("handle test readConvo works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).readConvo(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").readConvo,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").readConvo,
    ).toHaveBeenCalledTimes(1);
  });

  it("test readConvoNames works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).readConvoNames(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").readConvoNames,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").readConvoNames,
    ).toHaveBeenCalledTimes(1);
  });

  it("test updateConvo works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).updateConvo(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").updateConvo,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").updateConvo,
    ).toHaveBeenCalledTimes(1);
  });

  it("test deleteConvo works correctly", async () => {
    const ctx = {
      send: jest.fn(), // Mocking the send function
    };

    // Calling the actual controller method
    await convoController({ strapi }).deleteConvo(ctx);
    // Check if Create is called correctly
    expect(
      strapi.plugin("strapi-supergpt").service("convoService").deleteConvo,
    ).toHaveBeenCalledWith(ctx);

    expect(
      strapi.plugin("strapi-supergpt").service("convoService").deleteConvo,
    ).toHaveBeenCalledTimes(1);
  });
});
