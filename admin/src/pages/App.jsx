/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import {PLUGIN_ID} from "../pluginId";
import Home from "../components/Home/index";

const App = () => {
  return (
    <Routes>
      <Route index path={`/plugins/${PLUGIN_ID}`} element={Home} />
    </Routes>
  );
};

export default App;
