import pluginPkg from "../../package.json";
import {PLUGIN_ID} from "./pluginId";
import PluginIcon from "./components/PluginIcon";
import Initializer from "./components/Initializer/index";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const App = await import('./pages/App');

        return App;
      },
    });

    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.name`,
          defaultMessage: `${pluginPkg.strapi.displayName} ${pluginPkg.strapi.kind}`,
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.configuration`,
            defaultMessage: "Configuration",
          },
          id: "strapi-supergpt.name",
          to: `/settings/${PLUGIN_ID}`,
          Component: async () => {
            const SettingsPage = await import(
              "./pages/Settings"
            );
            return SettingsPage;
          },
        },
      ],
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: true,
      name,
    });

    // Register custom fields with translations
    // const customFields = [
    //   { name: 'super-audio', type: 'json', component: import('./components/SuperFields/SuperAudio.jsx') },
    // ];

    // customFields.forEach(field => {
    //   app.customFields.register({
    //     name: field.name,
    //     pluginId: pluginId,
    //     type: field.type,
    //     intlLabel: {
    //       id: `${pluginId}.customFields.${field.name}.label`,
    //       defaultMessage: field.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    //     },
    //     intlDescription: {
    //       id: `${pluginId}.customFields.${field.name}.description`,
    //       defaultMessage: `A ${field.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} field powered by chatgpt`,
    //     },
    //     icon: PluginIcon,
    //     components: {
    //       Input: async () => await field.component,
    //     },
    //   });
    // });

  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
