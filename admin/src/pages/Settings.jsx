/**
*
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import {PLUGIN_ID} from "../pluginId";
import Settings from "../components/Settings";

const SettingsPage = () => {
  return (
    <Routes>
      <Route index path={`/settings/${PLUGIN_ID}`} element={Settings} />
    </Routes>
  );
};

export default SettingsPage;
