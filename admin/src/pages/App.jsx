/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export default App;
