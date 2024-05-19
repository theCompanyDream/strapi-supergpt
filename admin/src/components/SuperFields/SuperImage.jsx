import React, { useState, useEffect } from 'react';
import { Box, Button, TextInput, Typography } from '@strapi/design-system';
import { useContentManagerEditViewDataManager, useFetchClient } from '@strapi/helper-plugin';

const SuperImage = ({ name, value, onChange }) => {
  const { modifiedData } = useContentManagerEditViewDataManager();
  const relatedFieldValue = modifiedData.relatedFieldName; // Change 'relatedFieldName' to the actual name of the field you want to use
  const { post } = useFetchClient();
  const [imageUrl, setImageUrl] = useState(value);

  const generateImage = async () => {
    try {
      const response = await post('/your-api-endpoint', { prompt: relatedFieldValue });
      setImageUrl(response.data.imageUrl);
      onChange({ target: { name, value: response.data.imageUrl } });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  useEffect(() => {
    if (relatedFieldValue) {
      generateImage();
    }
  }, [relatedFieldValue]);

  return (
    <Box>
      <Typography variant="beta">Generated Image</Typography>
      {imageUrl ? (
        <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', marginTop: '10px' }} />
      ) : (
        <Typography variant="pi">No image generated yet.</Typography>
      )}
      <TextInput
        type="text"
        name={name}
        value={imageUrl}
        onChange={(e) => onChange(e)}
        placeholder="Generated image URL"
      />
      <Button onClick={generateImage}>Generate Image</Button>
    </Box>
  );
};

export default SuperImage;
