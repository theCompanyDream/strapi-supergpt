import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { TextInput, Grid, SingleSelect, SingleSelectOption, Button, Main } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { useNotification, Layouts } from '@strapi/strapi/admin';

import instance from '../../utils/axiosInstance';

const Settings = () => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [chatGPTConfig, setChatGPTConfig] = useState({
    apiKey: '',
    modelName: 'o3-mini',
    maxTokens: 2048,
    aiImageModelName: 'dall-e-3',
    ttsModelName: 'tts-1-hd',
  });

  useEffect(() => {
    const fetchChatGPTConfig = async () => {
      setLoading(true);
      try {
        const { data } = await instance.get('/strapi-supergpt/cache', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setChatGPTConfig(data);
      } catch (error) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({ id: 'settingsPage.notifications.fetch-error' }),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatGPTConfig();
  }, [formatMessage, toggleNotification]);

  const handleSave = async () => {
    if (!chatGPTConfig.apiKey) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: 'settingsPage.notifications.api-key-required' }),
      });
      return;
    }

    setLoading(true);
    try {
      await instance.post('/strapi-supergpt/cache/update', chatGPTConfig, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: 'settingsPage.notifications.success' }),
      });
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: 'settingsPage.notifications.saving-error' }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main padding={4}>
      <Layouts.Header
        title={formatMessage({ id: 'settingsPage.title' })}
        subtitle={formatMessage({ id: 'settingsPage.description' })}
        primaryAction={
          <Button startIcon={<Check />} onClick={handleSave} loading={loading}>
            {formatMessage({ id: 'settingsPage.saveButton' })}
          </Button>
        }
      />
      <Grid.Root gap={4}>
        <Grid.Item col={12}>
          <FieldWrapper>
            <FieldLabel>{formatMessage({ id: 'settingsPage.labels.api-key' })}</FieldLabel>
            <StyledTextInput
              type="text"
              label={formatMessage({ id: 'settingsPage.labels.api-key' })}
              name="apiKey"
              value={chatGPTConfig.apiKey}
              onChange={(e) => setChatGPTConfig({ ...chatGPTConfig, apiKey: e.target.value })}
            />
          </FieldWrapper>
        </Grid.Item>
        <Grid.Item col={6}>
          <FieldWrapper>
            <FieldLabel>{formatMessage({ id: 'settingsPage.labels.max-tokens' })}</FieldLabel>
            <StyledTextInput
              type="number"
              name="maxTokens"
              value={chatGPTConfig.maxTokens}
              onChange={(e) =>
                setChatGPTConfig({ ...chatGPTConfig, maxTokens: parseInt(e.target.value, 10) })
              }
            />
          </FieldWrapper>
        </Grid.Item>

        {/* Text Model select with separate label */}
        <Grid.Item col={6}>
          <FieldWrapper>
            <FieldLabel>{formatMessage({ id: 'settingsPage.labels.text-model' })}</FieldLabel>
            <StyledSelect
              placeholder={formatMessage({ id: 'settingsPage.placeholder.text-model' })}
              value={chatGPTConfig.modelName}
              onChange={(value) =>
                setChatGPTConfig({ ...chatGPTConfig, modelName: value })
              }
            >
              <SingleSelectOption value="o3-mini">o3 mini</SingleSelectOption>
              <SingleSelectOption value="o1-mini">o1 mini</SingleSelectOption>
              <SingleSelectOption value="o1-preview">o1 preview</SingleSelectOption>
              <SingleSelectOption value="chatgpt-4o-latest">GPT 4 Latest</SingleSelectOption>
            </StyledSelect>
          </FieldWrapper>
        </Grid.Item>

        {/* Image Model select with separate label */}
        <Grid.Item col={6}>
          <FieldWrapper>
            <FieldLabel>{formatMessage({ id: 'settingsPage.labels.image-model' })}</FieldLabel>
            <StyledSelect
              placeholder={formatMessage({ id: 'settingsPage.placeholder.image-model' })}
              value={chatGPTConfig.aiImageModelName}
              onChange={(value) =>
                setChatGPTConfig({ ...chatGPTConfig, aiImageModelName: value })
              }
            >
              <SingleSelectOption value="dall-e-3">DALL-E 3</SingleSelectOption>
              <SingleSelectOption value="dall-e-2">DALL-E 2</SingleSelectOption>
            </StyledSelect>
          </FieldWrapper>
        </Grid.Item>

        {/* TTS Model select with separate label */}
        <Grid.Item col={6}>
          <FieldWrapper>
            <FieldLabel>{formatMessage({ id: 'settingsPage.labels.tts-model' })}</FieldLabel>
            <StyledSelect
              placeholder={formatMessage({ id: 'settingsPage.placeholder.tts-model' })}
              value={chatGPTConfig.ttsModelName}
              onChange={(value) =>
                setChatGPTConfig({ ...chatGPTConfig, ttsModelName: value })
              }
            >
              <SingleSelectOption value="tts-1">TTS-1</SingleSelectOption>
              <SingleSelectOption value="tts-1-hd">TTS-1 HD</SingleSelectOption>
            </StyledSelect>
          </FieldWrapper>
        </Grid.Item>
      </Grid.Root>
    </Main>
  );
};

export default Settings;

// Styled components
const StyledTextInput = styled(TextInput)`
  width: 100%;
`;

const StyledSelect = styled(SingleSelect)`
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FieldLabel = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
`;
