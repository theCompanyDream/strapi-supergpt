/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
import { Page } from '@strapi/strapi/admin';
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home/index";

const App = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export default App;
