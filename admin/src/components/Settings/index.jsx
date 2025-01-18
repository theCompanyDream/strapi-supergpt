import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { TextInput, Box, Grid, SingleSelect, SingleSelectOption, Typography, Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import axios from 'axios';
import { useNotification, useAuth} from '@strapi/strapi/admin';

const Settings = () => {
  const auth = useAuth(
    'Settings',
    (state) => state.refetchPermission
  );
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [chatGPTConfig, setChatGPTConfig] = useState({
    apiKey: '',
    modelName: 'gpt-4o',
    maxTokens: 2048,
    aiImageModelName: 'dall-e-3',
    ttsModelName: 'tts-1-hd',
  });

  useEffect(() => {
    const fetchChatGPTConfig = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/strapi-supergpt/cache', {
          headers: {
            Authorization: `Bearer ${localStorage.get("jwtToken")}`,
          },
        });
        setChatGPTConfig(data);
      } catch (error) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({ id: 'strapi-supergpt.settingsPage.notifications.fetch-error' }),
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
        message: formatMessage({ id: 'strapi-supergpt.settingsPage.notifications.api-key-required' }),
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post('/strapi-supergpt/cache/update', chatGPTConfig, {
        headers: {
          Authorization: `Bearer ${localStorage.get("jwtToken")}`,
        },
      });
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: 'strapi-supergpt.settingsPage.notifications.success' }),
      });
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: 'strapi-supergpt.settingsPage.notifications.saving-error' }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={4}>
      <Typography variant="h1">{formatMessage({ id: 'strapi-supergpt.settingsPage.title' })}</Typography>
      <Typography variant="h1">{formatMessage({ id: 'strapi-supergpt.settingsPage.description' })}</Typography>
      <Button startIcon={<Check />} onClick={handleSave} loading={loading}>
            {formatMessage({ id: 'strapi-supergpt.settingsPage.saveButton' })}
      </Button>
      <Grid gap={4}>
        <Grid.Item col={12}>
          <TextInput
            type="text"
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.api-key' })}
            name="apiKey"
            value={chatGPTConfig.apiKey}
            onChange={(e) => setChatGPTConfig({ ...chatGPTConfig, apiKey: e.target.value })}
          />
        </Grid.Item>
        <Grid.Item col={6}>
          <TextInput
            type="number"
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.max-tokens' })}
            name="maxTokens"
            value={chatGPTConfig.maxTokens}
            onChange={(e) => setChatGPTConfig({ ...chatGPTConfig, maxTokens: parseInt(e.target.value, 10) })}
          />
        </Grid.Item>
        <Grid.Item col={6}>
          <SingleSelect
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.text-model' })}
            placeholder={formatMessage({ id: 'strapi-supergpt.settingsPage.placeholder.text-model' })}
            value={chatGPTConfig.modelName}
            onChange={(value) => setChatGPTConfig({ ...chatGPTConfig, modelName: value })}
          >
            {/* Replace with your actual options */}
            <SingleSelectOption value="o3-mini">o3 mini</SingleSelectOption>
            <SingleSelectOption value="o1-mini">o1 mini</SingleSelectOption>
            <SingleSelectOption value="o1-preview">o1 preview</SingleSelectOption>
            <SingleSelectOption value="gpt-4o-mini">GPT 4o Mini</SingleSelectOption>
            <SingleSelectOption value="gpt-4o">GPT 4o</SingleSelectOption>
            <SingleSelectOption value="chatgpt-4o-latest">GPT 4 Latest</SingleSelectOption>
            <SingleSelectOption value="gpt-4">GPT 4</SingleSelectOption>
          </SingleSelect>
        </Grid.Item>
        <Grid.Item col={6}>
          <SingleSelect
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.image-model' })}
            placeholder={formatMessage({ id: 'strapi-supergpt.settingsPage.placeholder.image-model' })}
            value={chatGPTConfig.aiImageModelName}
            onChange={(value) => setChatGPTConfig({ ...chatGPTConfig, aiImageModelName: value })}
          >
            {/* Replace with your actual options */}
            <SingleSelectOption value="dall-e-3">DALL-E 3</SingleSelectOption>
            <SingleSelectOption value="dall-e-2">DALL-E 2</SingleSelectOption>
          </SingleSelect>
        </Grid.Item>
        <Grid.Item col={6}>
          <SingleSelect
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.tts-model' })}
            placeholder={formatMessage({ id: 'strapi-supergpt.settingsPage.placeholder.tts-model' })}
            value={chatGPTConfig.ttsModelName}
            onChange={(value) => setChatGPTConfig({ ...chatGPTConfig, ttsModelName: value })}
          >
            {/* Replace with your actual options */}
            <SingleSelectOption value="tts-1">TTS-1</SingleSelectOption>
            <SingleSelectOption value="tts-1-hd">TTS-1 HD</SingleSelectOption>
          </SingleSelect>
        </Grid.Item>
      </Grid>
    </Box>
  );
};

export default Settings;
