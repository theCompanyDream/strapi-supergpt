/**
*
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Settings from "../components/Settings";

const SettingsPage = () => {
  return (
    <Routes>
      <Route index element={<Settings />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export default SettingsPage;
