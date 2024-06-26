"use strict";

// eslint-disable-next-line no-unused-vars
module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'super-single-select',
    plugin: 'strapi-supergpt',
    type: 'string',
  });
  strapi.customFields.register({
    name: 'super-multi-select',
    plugin: 'strapi-supergpt',
    type: 'string',
  });
  strapi.customFields.register({
    name: 'super-textarea',
    plugin: 'strapi-supergpt',
    type: 'text',
  });
  strapi.customFields.register({
    name: 'super-image',
    plugin: 'strapi-supergpt',
    type: 'string',
  });
  strapi.customFields.register({
    name: 'super-audio',
    plugin: 'strapi-supergpt',
    type: 'string',
  });
};
