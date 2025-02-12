import pluginPkg from "../../package.json";
import {PLUGIN_ID} from "./pluginId";
import PluginIcon from "./components/PluginIcon";
import Initializer from "./components/Initializer";
import TabbedGPT from "./components/GPTModal"

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const App = await import('./components/Home');
        return App;
      },
    });

    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'GPT-Link',
      Component: TabbedGPT,
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
              "./components/Settings"
            );
            return SettingsPage;
          },
        },
      ],
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

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
