// components/TabbedGPTModal/index.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  TextInput,
  Typography,
  Box
} from '@strapi/design-system';

const TabbedGPTModal = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('completion'); // 'completion' or 'image'

  // State for Completion Tab
  const [prompt, setPrompt] = useState('');
  const [completionResponse, setCompletionResponse] = useState('');
  const [completionLoading, setCompletionLoading] = useState(false);
  const [completionError, setCompletionError] = useState(null);

  // State for Image Tab
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageResponse, setImageResponse] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Handler for Generating Text Completion
  const handleGenerateCompletion = async () => {
    if (!prompt.trim()) {
      setCompletionError('Prompt cannot be empty.');
      return;
    }
    setCompletionLoading(true);
    setCompletionError(null);
    try {
      // Replace with your GPT API call for text completion
      const res = await fetch('/api/generate-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setCompletionResponse(data.result);
    } catch (err) {
      setCompletionError('Failed to generate completion. Please try again.');
    } finally {
      setCompletionLoading(false);
    }
  };

  // Handler for Generating Image
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError('Prompt cannot be empty.');
      return;
    }
    setImageLoading(true);
    setImageError(null);
    try {
      // Replace with your GPT API call for image generation
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await res.json();
      setImageResponse(data.imageUrl); // Assuming the API returns an image URL
    } catch (err) {
      setImageError('Failed to generate image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  // Handler for Saving Data
  const handleSave = () => {
    // Pass both completion and image data back to the parent component
    onSave({
      completion: {
        prompt,
        response: completionResponse,
      },
      image: {
        prompt: imagePrompt,
        imageUrl: imageResponse,
      },
    });
    onClose();
  };

  return (
    <ModalLayout onClose={handleSave} labelledBy="gpt-tabbed-modal-title">
      <ModalHeader>
        <Typography variant="delta" id="gpt-tabbed-modal-title">
          Strapi SuperGPT
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TabGroup label="GPT Options" onTabChange={(tabId) => setActiveTab(tabId)}>
          <Tabs>
            <Tab id="completion">Text Completion</Tab>
            <Tab id="image">Image Generation</Tab>
          </Tabs>
          <TabPanels>
            {/* Text Completion Tab */}
            <TabPanel tabId="completion">
              <Box padding={4}>
                <TextInput
                  label="Your Prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  error={completionError}
                />
                <Button
                  variant="secondary"
                  onClick={handleGenerateCompletion}
                  disabled={completionLoading}
                  style={{ marginTop: '16px' }}
                >
                  {completionLoading ? 'Generating...' : 'Generate Completion'}
                </Button>
                {completionResponse && (
                  <Typography mt={2} style={{ whiteSpace: 'pre-wrap' }}>
                    {completionResponse}
                  </Typography>
                )}
                {completionError && (
                  <Typography color="danger" mt={2}>
                    {completionError}
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Image Generation Tab */}
            <TabPanel tabId="image">
              <Box padding={4}>
                <TextInput
                  label="Image Prompt"
                  placeholder="Describe the image you want..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  error={imageError}
                />
                <Button
                  variant="secondary"
                  onClick={handleGenerateImage}
                  disabled={imageLoading}
                  style={{ marginTop: '16px' }}
                >
                  {imageLoading ? 'Generating...' : 'Generate Image'}
                </Button>
                {imageResponse && (
                  <Box mt={2}>
                    <img src={imageResponse} alt="Generated by GPT" style={{ maxWidth: '100%' }} />
                  </Box>
                )}
                {imageError && (
                  <Typography color="danger" mt={2}>
                    {imageError}
                  </Typography>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSave} disabled={!completionResponse && !imageResponse}>
          Save
        </Button>
        <Button variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalLayout>
  );
};

TabbedGPTModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TabbedGPTModal;
