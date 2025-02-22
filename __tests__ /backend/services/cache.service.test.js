const cacheService = require("../../../server/src/services/cache.service")

describe("Should Caching Service", () => {
	let strapi
	beforeEach(async function () {
		strapi = {
			config: {
				environment: 'test'  // or 'test'
			},
			log: {
			  error: jest.fn()
			},
			store: jest.fn().mockReturnValue({
			  get: jest.fn().mockResolvedValue({ some: 'value' }),
			  set: jest.fn(),
			  delete: jest.fn().mockResolvedValue(true)
			})
		};
	})

	afterEach(() => {
		jest.resetAllMocks(); // Reset mocks to clean state after each test
	});

	it("handle config errors", async () => {
		let ctx = {}
		await cacheService({ strapi }).updateConfig(ctx)
		expect(strapi.store).toHaveBeenCalledTimes(0)
		expect(strapi.log.error).toHaveBeenCalledTimes(1)

		await cacheService({ strapi }).getConfig()
		expect(strapi.store).toHaveBeenCalledTimes(1)
	})

	it('should handle update config correctly', async () => {
		const ctx = {
			request: {
				body: {
					apiKey: "yourApiKey",
					modelName: "gpt-3.5-turbo",
					aiImageModelName: "dall-e-3",
					temperature: 0.0,
					maxTokens: 2048,
					topP: undefined,  // simulate missing optional fields
					frequencyPenalty: 0.0,
					presencePenalty: 0.0,
					stop: "",
					convoCount: ""
				}
			},
			response: {
				body: {}
			}
		};

		await cacheService({ strapi }).updateConfig(ctx);

		// Check for any error logs if the implementation logs them
		expect(strapi.log.error).toHaveBeenCalledTimes(0);
		expect(strapi.store().set).toHaveBeenCalledTimes(1);

		const newconfig = await cacheService({strapi}).getConfig(ctx)
		expect(strapi.log.error).toHaveBeenCalledTimes(0);
		expect(strapi.store().get).toHaveBeenCalledTimes(1);
	});

})