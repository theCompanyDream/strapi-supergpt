import React, { useEffect, useState } from 'react';
import { Textarea } from '@strapi/design-system';
import { useContentManagerEditViewDataManager } from '@strapi/helper-plugin';
import axios from 'axios';

const SuperTextarea = ({ name, value, onChange }) => {
  const { modifiedData } = useContentManagerEditViewDataManager();
  const relatedFieldValue = modifiedData.relatedFieldName; // Change 'relatedFieldName' to the actual name of the field you want to use

  const [text, setText] = useState(value);

  useEffect(() => {
    if (relatedFieldValue) {
      // Call OpenAI API to generate text based on related field value
      axios.post('/your-api-endpoint', { prompt: relatedFieldValue })
        .then(response => setText(response.data.text))
        .catch(error => console.error(error));
    }
  }, [relatedFieldValue]);

  return (
    <Textarea name={name} value={text} onChange={onChange} />
  );
};

export default SuperTextarea;
