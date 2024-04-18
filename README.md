<div align="center">
  <img src="https://www.tbrantleyii.dev/strapi-supergpt/logo.png" width="200" alt="Super GPT Logo" />
</div>

# Strapi Supergpt | ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) ![EsLint](https://github.com/theCompanyDream/strapi-supergpt/actions/workflows/eslint.yml/badge.svg) [![GitHub package.json version](https://img.shields.io/github/package-json/v/theCompanyDream/strapi-supergpt?label=npm&logo=npm)](https://www.npmjs.com/package/strapi-supergpt) ![Monthly download on NPM](https://img.shields.io/npm/dm/strapi-supergpt.svg)

Integrate ChatGPT into your Strapi application. You get both a UI to interact with ChatGPT and an API end-points to integrate into your applications

![chatgpt-overview](https://www.tbrantleyii.dev/strapi-supergpt/howToUse.gif)

# ChatGPT plugin for Strapi

[OpenAI](https://openai.com/) ChatGPT is an AI chatbot auto-generative system created by Open AI for online customer care. It is a pre-trained generative chat, which makes use of (NLP) Natural Language Processing.

[Strapi](https://strapi.io/) is the leading open-source headless Content Management System. It’s 100% JavaScript, fully customizable and developer-first.

## Overview: Start using ChatGPT in your Strapi application

With this plugin, you can add ChatGPT-powered chatbots and other natural language processing functionality to your Strapi application with ease. The plugin provides a simple interface for configuring and deploying your ChatGPT models, as well as tools

Setting up the plugin is super easy and can be completed within 2 minutes.

1. Enter your OpenAI API credentials.
1. Optionally, select the model you want to use.

Thats it! You can now use ChatGPT in your Strapi application.

## ✨ Features

1. **Easy to use**: The plugin is easy to use and can be set up within 10 minutes.
1. **Customizable**: You can customize the model's parameters to suit your needs.
1. **Open Source**: The plugin is open source and can be found on [GitHub](https://github.com/theCompanyDream/strapi-supergpt).
1. **Generate Pictures** Can generate pictures based on the prompt given.

## 🖐 Requirements

1. [Node.js](https://nodejs.org/en/) version 18 or higher.
1. [Strapi](https://strapi.io/) version v4.x or higher.

> The ChatGPT plugin is designed for **Strapi v4.x**. It won't work with Strapi v3.x.
> working on support for **v5.0** when that officially comes out.

## ⏳ Installation

### 1. Install the plugin

<!-- use npm for installing plugin -->

```bash
npm install strapi-supergpt
```

or

```bash
yarn add strapi-supergpt
```

### 2. Enable the plugin

<!-- enable the plugin in the admin panel -->

Goto `<strapi app root>/config/plugins.js` Add the following code snippet.

```js
module.exports = ({ env }) => ({
  // ...
  "strapi-supergpt": {
    enabled: true,
  },
});
```

### 3. Build and start the Admin UI

Afterwards, you would need to build a fresh package that includes the ChatGPT plugin. For it, please execute the commands below:

<!-- build the admin UI -->

```bash
npm run build
npm run develop
```

or

```bash
yarn build
yarn develop
```

The ChatGPT plugin should appear in the Plugins section of the Strapi sidebar after you run the app again.

Now you are ready to integrate ChatGPT on your Strapi website.

## 🔧 Configuration

You can easily configure the ChatGPT plugin in the Strapi admin panel.

- Goto `Settings` -> `ChatGPT -> Configuration` in the sidebar.
- On the configiration page, Enter All the fields.
- Click on Save to save the configuration.

## RoadMap

- Custom [Field](https://docs.strapi.io/dev-docs/custom-fields#:~:text=☑%EF%B8%8F%20Prerequisites-,Registering%20a%20custom%20field%20through%20a%20plugin%20requires%20creating%20and,method%20on%20the%20StrapiApp%20instance.) that generates content.
- Click ChatGPT plugin in plugin section of the sidebar.
- Click on Integration to get sample code integration code.
- save chat's that it has with client

## 📖 Testing the plugin

- Click ChatGPT plugin in plugin section of the sidebar.
- Click on Integration to get sample code integration code.
- Copy the code and paste it in your terminal.

## 📝 License

[MIT License](LICENSE)
