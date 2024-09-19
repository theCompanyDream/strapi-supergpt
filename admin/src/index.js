import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import TabbedGPT from "./components/TabbedGPT"

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `strapi-supergpt.name`,
        defaultMessage: pluginPkg.strapi.displayName,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */
          "./pages/App"
        );

        return component;
      },
      permissions: [],
    });
    app.injectContentManagerComponent('editView', 'right-links', {
      name: '${pluginId}.plugin.name',
      Component: TabbedGPT,
    });
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.name`,
          defaultMessage: `${pluginPkg.strapi.displayName} ${pluginPkg.strapi.kind}`,
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.configuration`,
            defaultMessage: "Configuration",
          },
          id: "strapi-supergpt.name",
          to: `/settings/${pluginId}`,
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

    // Register custom fields with translations
    const customFields = [
      { name: 'super-audio', type: 'json', component: import('./components/SuperFields/SuperAudio.jsx') },
    ];

    customFields.forEach(field => {
      app.customFields.register({
        name: field.name,
        pluginId: pluginId,
        type: field.type,
        intlLabel: {
          id: `${pluginId}.customFields.${field.name}.label`,
          defaultMessage: field.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        },
        intlDescription: {
          id: `${pluginId}.customFields.${field.name}.description`,
          defaultMessage: `A ${field.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} field powered by chatgpt`,
        },
        icon: PluginIcon,
        components: {
          Input: async () => await field.component,
        },
      });
    });

  },

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
