import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

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

    // Register the first custom field
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
        defaultMessage: "A super input field",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./components/SuperInput"),
      },
    });

    // Register the second custom field
    app.customFields.register({
      name: "super-select",
      pluginId: pluginId,
      type: "string",
      intlLabel: {
        id: `${pluginId}.super-select.label`,
        defaultMessage: "Super Select",
      },
      intlDescription: {
        id: `${pluginId}.super-select.description`,
        defaultMessage: "A super select field",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./components/SuperSelect"),
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
