import React, { useState, useEffect, forwardRef } from 'react';
import { TextInput } from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import axios from 'axios';

const SuperInput = ({ name, value, onChange }) => {
  const { modifiedData } = useCMEditViewDataManager();
  const [text, setText] = useState(value);

  useEffect(() => {
    if (modifiedData.relatedFieldValue) {
      // Call OpenAI API to generate text based on related field value
      axios.post('/your-api-endpoint', { prompt: modifiedData.relatedFieldValue })
        .then(response => setText(response.data.text))
        .catch(error => console.error(error));
    }
  }, [modifiedData]);

  return (
    <TextInput
      ref={ref}
      name={name}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange(e);
      }}
      placeholder="Generated input"
    />
  );
};

export default SuperInput;
