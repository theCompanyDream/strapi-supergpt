"use strict";

const convoObject = "plugin::strapi-supergpt.convo"

module.exports = ({ strapi }) => ({

	async createConvo(ctx) {
		const {
			convoName,
			context
		} = ctx.request.body;
		const convo = await strapi.db.query(convoObject).create({
			data: {
				name: convoName,
				content: context,
			}
		})
		return convo
	},
	async readConvo(ctx) {
		const {
			convoId
		} = ctx.request.query;
		const convo = await strapi.db.query(convoObject).findOne({
			where: {
				id: convoId
			}
		});
		return convo
	},
	async readConvoNames(ctx) {
		const convo = await strapi.db.query(convoObject).findMany({
			select: ["name"],
			where: {
				$not: {
					name: null
				}
			}
		})
		return convo.map(convo => convo.name)
	},
	async updateConvo(ctx) {
		const {
			id,
			name,
			context
		} = ctx.request.body;
		const convo = await strapi.db.query(convoObject).update({
			where:{
				id: id
			},
			data: {
				name: name,
				conent: context
			}
		})
		return convo
	},
	async deleteConvo(ctx) {
		const {
			id
		} = ctx.request.query;
			const convo = await strapi.db.query(convoObject).delete({
			where:{
				id: id
			}
		})
		return convo
	}
})