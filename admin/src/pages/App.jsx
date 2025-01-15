/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import {PLUGIN_ID} from "../pluginId";
import HomePage from "./HomePage";

const App = () => {
  return (
    <main>
      <Switch>
        <Route path={`/plugins/${PLUGIN_ID}`} component={HomePage} exact />
      </Switch>
    </main>
  );
};

export default App;
