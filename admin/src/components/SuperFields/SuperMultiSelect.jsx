import React, { useEffect, useState } from 'react';
import { MultiSelect as Select, MultiSelectOption as Option } from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin';

const SuperMultiSelect = ({ name, value, onChange }) => {
  const { modifiedData } = useCMEditViewDataManager();
  const { get } = useFetchClient();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (modifiedData.relatedFieldName) {
      // Call OpenAI API to generate options based on related field value
      get('/strapi-supergpt/prompt', { prompt: relatedFieldValue })
        .then(response => setOptions(response.data.options))
        .catch(error => console.error(error));
    }
  }, [modifiedData]);

  return (
    <Select name={name} value={value} onChange={onChange}>
      {options.map((option, index) => (
        <Option key={index} value={option}>{option}</Option>
      ))}
    </Select>
  );
};

export default SuperMultiSelect;
