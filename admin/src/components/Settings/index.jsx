import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { HeaderLayout, Button, TextInput, Box, Grid, GridItem, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Check } from '@strapi/icons';
import axios from 'axios';
import { auth, useNotification } from '@strapi/helper-plugin';

const Settings = () => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [chatGPTConfig, setChatGPTConfig] = useState({
    apiKey: '',
    modelName: 'gpt-4o',
    maxTokens: 2048,
    aiImageModelName: 'dall-e-3'
  });

  useEffect(() => {
    const fetchChatGPTConfig = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/strapi-supergpt/cache', {
          headers: {
            Authorization: `Bearer ${auth.get('jwtToken')}`,
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
          Authorization: `Bearer ${auth.get('jwtToken')}`,
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
      <HeaderLayout
        title={formatMessage({ id: 'strapi-supergpt.settingsPage.title' })}
        subtitle={formatMessage({ id: 'strapi-supergpt.settingsPage.description' })}
        primaryAction={
          <Button startIcon={<Check />} onClick={handleSave} loading={loading}>
            {formatMessage({ id: 'strapi-supergpt.settingsPage.saveButton' })}
          </Button>
        }
      />
      <Grid gap={4}>
        <GridItem col={12}>
          <TextInput
            type="text"
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.api-key' })}
            name="apiKey"
            value={chatGPTConfig.apiKey}
            onChange={(e) => setChatGPTConfig({ ...chatGPTConfig, apiKey: e.target.value })}
          />
        </GridItem>
        <GridItem col={6}>
          <TextInput
            type="number"
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.max-tokens' })}
            name="maxTokens"
            value={chatGPTConfig.maxTokens}
            onChange={(e) => setChatGPTConfig({ ...chatGPTConfig, maxTokens: parseInt(e.target.value, 10) })}
          />
        </GridItem>
        <GridItem col={6}>
          <TextInput
            type="text"
            label={formatMessage({ id: 'strapi-supergpt.settingsPage.labels.text-model' })}
            name="modelName"
            value={chatGPTConfig.modelName}
            onChange={(value) => setChatGPTConfig({ ...chatGPTConfig, modelName: value.target.value })}
          />
        </GridItem>
        <GridItem col={6}>
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
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Settings;
