import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../admin/src/components/Home'; // Adjust the import according to your file structure

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

describe('Home Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Home />);
    expect(getByPlaceholderText('Enter your prompt here')).toBeInTheDocument();
  });

  it('handles button click to submit prompt', async () => {
    const { getByText, getByRole } = render(<Home />);
    const promptButton = getByRole('button', { name: 'Text' });

    // Simulating user entering text and submitting
    fireEvent.change(getByPlaceholderText('Enter your prompt here'), { target: { value: 'Hello, world!' } });
    fireEvent.click(promptButton);

    await waitFor(() => {
      // Check if the loading indicator appears
      expect(getByText('Loading...')).toBeInTheDocument();
    });

    // More assertions can follow here
  });
});
