const convoService = require("../../../server/src/services/convo.service")

describe("should Convo Service", () => {
	let strapi
	beforeEach(async function () {
	  strapi = {
		query: jest.fn().mockReturnValue({
		  create: jest.fn().mockReturnValue({
			data: {
			  name: 'test',
			  status: false,
			}
		  })
		})
	  }
	})

	it("handle update config", async () => {
		// const name = 'test'
		// const todo = await cacheService({ strapi }).updateConfig({ name })
		// expect(strapi.query('strapi').create).toHaveBeenCalledTimes(1)
		// expect(todo.data.name).toBe('test')
	})
})