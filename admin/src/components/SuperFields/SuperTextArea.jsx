import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Textarea } from '@strapi/design-system';
import { auth } from '@strapi/helper-plugin'

export default function SuperTextArea({
  name,
  error,
  description,
  onChange,
  value,
  intlLabel,
  attribute,
}) {
  const { formatMessage } = useIntl();
  const [prompt, setPrompt] = useState('');
  const [err, setErr] = useState('');

  const generateText = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch(`/strapi-supergpt/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`
        },
        body: JSON.stringify({
          'prompt': `${prompt}`,
        })
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      const parsedResult = result.choices[0].text.replace(/(?:\r\n|\r|\n)/g, '');

      onChange({ target: { name, value: parsedResult, type: attribute.type } })
    } catch (err) {
      setErr(err.message);
    }
  }

  const clearGeneratedText = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    onChange({ target: { name, value: '', type: attribute.type } })
  }

  return (
    <Stack spacing={1}>
      <TextInput
        placeholder="Please write a prompt for content to generate"
        label="Prompt"
        name="Prompt"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <Stack padding={4} spacing={2}>
        <Textarea
          placeholder="Generated text"
          label="Content"
          name="content"
          onChange={(e) =>
            onChange({
              target: { name, value: e.target.value, type: attribute.type },
            })
          }
        >
          {value}
        </Textarea>
        <Stack horizontal spacing={4}>
          <Button onClick={(e) => generateText(e)}>Generate</Button>
          <Button onClick={(e) => clearGeneratedText(e)}>Clear</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
