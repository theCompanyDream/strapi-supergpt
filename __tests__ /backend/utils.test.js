const utils = require("../../server/src/utils");

describe("Utility Tests", () => {
  it("conversationToArray should convert to array", () => {
    const message = `
		you: Can you make it multifrom?
		chatgpt: Certainly! Here's an updated Dockerfile that uses a multi-stage build approach for a Next.js website:
		This updated Dockerfile uses two stages. In the first stage, it builds the Next.js app and generates the optimized production build. In the second stage, it serves the built app using a lightweight HTTP server.
		To use this Dockerfile, follow the same steps as before: place it in the root directory of your Next.js project, build the Docker image using the docker build command, and run the container using the docker run command.
		Again, ensure that you adjust the port number in the EXPOSE directive to match the port your Next.js app is configured to use.
		you: Hey ChatGPT,
		It's been a minute since we've talked about this. but I want you to make some concept art for me. I've peeped you pretty good at making black people. Can you humor me can you create a suppor with someone of a different race eating at a table? I want to see how good you are at drawing different races of people
		chatgpt:
		I'm sorry for any confusion, but as an AI language model, I don't have the ability to create visual art or images directly. My capabilities are focused on generating and understanding text. However, I can definitely help you brainstorm ideas for your concept art or provide descriptions of scenes and characters if that would be helpful to you. Let me know how else I can assist you!
		chatgpt: Certainly! Here's an updated Dockerfile that uses a multi-stage build approach for a Next.js website:
		This updated Dockerfile uses two stages. In the first stage, it builds the Next.js app and generates the optimized production build. In the second stage, it serves the built app using a lightweight HTTP server.
		To use this Dockerfile, follow the same steps as before: place it in the root directory of your Next.js project, build the Docker image using the docker build command, and run the container using the docker run command.
		Again, ensure that you adjust the port number in the EXPOSE directive to match the port your Next.js app is configured to use.
	`;

    const convert = utils.conversationToArray(message);
    expect(convert).not.toBeNull();
    expect(Array.isArray(convert)).toBe(true);
    expect(convert).toHaveLength(5);
    convert.forEach((item) => {
      expect(typeof item).toBe("object");
      expect(Object.keys(item).sort()).toEqual(["name", "message"].sort());
    });
    const revert = utils.condenseArray(convert).replace(/\s+/g, "").trim();
    expect(message.replace(/\s+/g, "").trim()).toBe(revert);
  });
});
