import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from '../../admin/src/pages/Settings'; // Adjust the import according to your file structure

// Mocking modules
jest.mock('axios');
jest.mock('@strapi/helper-plugin', () => ({
  auth: {
    get: jest.fn().mockReturnValue('mocked_token')
  }
}));
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: jest.fn(msg => msg.id) })
}));

describe("Setting Component", () => {
	it("", () => {

	})
})