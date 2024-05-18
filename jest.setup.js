const { defaults } = require("jest-config");

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "mts", "cts"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    // Add if you have styles or assets imports in your components
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};

module.exports = config;
