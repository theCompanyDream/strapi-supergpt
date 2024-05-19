import React, { useEffect, useState } from 'react';
import { SingleSelect as Select, SingleSelectOption as Option } from '@strapi/design-system';
import { useContentManagerEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin';

const SuperSelect = ({ name, value, onChange }) => {
  const { modifiedData } = useContentManagerEditViewDataManager();
  const { get } = useFetchClient();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (modifiedData.relatedFieldName) {
      // Call OpenAI API to generate options based on related field value
      get('/strapi-supergpt/prompt', { prompt: relatedFieldValue })
        .then(response => setOptions(response.data.options))
        .catch(error => console.error(error));
    }
  }, [relatedFieldValue]);

  return (
    <Select name={name} value={value} onChange={onChange}>
      {options.map((option, index) => (
        <Option key={index} value={option}>{option}</Option>
      ))}
    </Select>
  );
};

export default SuperSelect;
