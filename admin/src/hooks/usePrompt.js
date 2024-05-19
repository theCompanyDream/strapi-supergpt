import { useContext, useEffect } from 'react';
import { PromptProvider } from './promptContext';
import { useFetchClient } from '@strapi/helper-plugin';

const usePrompt = (fieldName, relatedFieldValue) => {
  const { prompts, registerPrompt, clearPrompts } = useContext(PromptContext);
  const { post } = useFetchClient();

  useEffect(() => {
    if (relatedFieldValue) {
      registerPrompt({ name: fieldName, prompt: relatedFieldValue });
    }
  }, [relatedFieldValue, fieldName, registerPrompt]);

  const makeBatchRequest = async () => {
    if (prompts.length > 0) {
      try {
        const response = await post('/your-api-endpoint', { prompts });
        return response.data; // Return the response data to be handled by the caller
      } catch (error) {
        console.error('Error generating content:', error);
        return null;
      } finally {
        clearPrompts();
      }
    }
  };

  return {
    makeBatchRequest,
  };
};

export default usePrompt;
