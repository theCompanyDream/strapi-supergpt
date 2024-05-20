import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import { SuperSingleSelect, SuperMultiSelect, SuperInput, SuperTextArea, SuperImage} from './components/SuperFields'

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: pluginPkg.strapi.displayName,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */
          "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: `${pluginPkg.strapi.displayName} ${pluginPkg.strapi.kind}`,
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: "Configuration",
          },
          id: "strapi-supergpt",
          to: `/settings/${pluginId}`,
          // permissions: pluginPermissions.settingsRoles,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "stripe-page" */
              "./pages/Settings"
            );

            return component;
          },
        },
      ],
    );

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    // Register the input custom field
    app.customFields.register({
      name: "super-input",
      pluginId: pluginId,
      type: "string",
      intlLabel: {
        id: `${pluginId}.super-input.label`,
        defaultMessage: "Super Input",
      },
      intlDescription: {
        id: `${pluginId}.super-input.description`,
        defaultMessage: "A input field powered by chatgpt",
      },
      icon: PluginIcon,
      components: {
        Input: async () => SuperInput,
      },
    });

    // Register the select custom field
    app.customFields.register({
      name: "super-single-select",
      pluginId: pluginId,
      type: "string",
      intlLabel: {
        id: `${pluginId}.super-single-select.label`,
        defaultMessage: "Super Select",
      },
      intlDescription: {
        id: `${pluginId}.super-select.description`,
        defaultMessage: "A single select field powered by chatgpt",
      },
      icon: PluginIcon,
      components: {
        Input: async () => SuperSingleSelect,
      },
    });

    // Register SuperTextArea custom field
    app.customFields.register({
      name: "super-textarea",
      pluginId: pluginId,
      type: "text",
      intlLabel: {
        id: `${pluginId}.super-textarea.label`,
        defaultMessage: "Super Textarea",
      },
      intlDescription: {
        id: `${pluginId}.super-textarea.description`,
        defaultMessage: "A super textarea field",
      },
      icon: PluginIcon,
      components: {
        Input: async () => SuperTextArea,
      },
    });

    // Regist the Image custom field
    app.customFields.register({
      name: "super-image",
      pluginId: pluginId,
      type: "string",
      intlLabel: {
        id: `${pluginId}.super-image.label`,
        defaultMessage: "Super Image",
      },
      intlDescription: {
        id: `${pluginId}.super-image.description`,
        defaultMessage: "A super image field",
      },
      icon: PluginIcon,
      components: {
        Input: async () => SuperImage,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  bootstrap(app) {},

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */
          `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
