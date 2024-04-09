// @ts-nocheck
"use strict";
const utils = require('../utils')
const convoObject = "plugin::strapi-supergpt.convo"

module.exports = ({ strapi }) => ({
	async createConvo(ctx) {
		const {
			convoName
		} = ctx.request.body;
		const convo = await strapi.db.query(convoObject).create({
			data: {
				name: convoName
			}
		})
		return convo
	},
	async readConvo(ctx) {
		const {
			convoId
		} = ctx.request.query;
		const convo = await strapi.db.query(convoObject).findOne({
			select: ["id", "name", "content"],
			where: {
				id: convoId
			}
		});
		return convo.map(conversations => {
			return {
				...conversations,
				content: utils.conversationToArray(conversation.content)
			}
		})
	},
	async readConvoNames() {
		let convos = await strapi.db.query(convoObject).findMany({
			select: ["id", "name"],
			where: {
				$not: {
					name: null
				}
			}
		})
		convos = convos.map(convo => {
			return {...convo, content: []}
		})
		if (convos.length() > 0) {
			const firstConvo = this.readConvo({query: {convoId: convos[0].id}})
			convos[0] = firstConvo
		}

		return convos
	},
	async updateConvo(ctx) {
		const {
			id,
			name,
			context
		} = ctx.request.body;
		const convo = await strapi.db.query(convoObject).update({
			where:{
				id
			},
			data: {
				name,
				content: context
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
				id
			}
		})
		return convo
	}
})