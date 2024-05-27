import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import axios from "axios";
import { auth, useNotification } from "@strapi/helper-plugin";
import {
  Layout,
  Button,
  HeaderLayout,
  ContentLayout,
  Grid,
  GridItem,
  Box,
  TextInput,
  Main,
  SingleSelect,
  Typography,
  SingleSelectOption,
  Link,
} from "@strapi/design-system";

import { Check } from "@strapi/icons";

const AiModels = [
  { value: "gpt-4o", label: "Our most advanced, multimodal flagship model that’s cheaper and faster than GPT-4 Turbo. Currently points to gpt-4o-2024-05-13." },
  { value: "gpt-4-turbo", label: "The latest GPT-4 Turbo model with vision capabilities. Vision requests can now use JSON mode and function calling." },
  { value: "gpt-4", label: "A set of models that improve on GPT-3.5 and can understand as well as generate natural language or code" },
  { value: "gpt-3.5-turbo", label: "A set of models that improve on GPT-3.5 and can understand as well as generate natural language or code" },
];

const ImageAiModels = [
  { value: "dall-e-3", label: "The latest DALL·E model released in Nov 2023." },
  { value: "dall-e-2", label: "An earlier version of DALL·E model released in Nov 2022." },
];

const ttsAiModels = [
  { value: "tts-1", label: "The latest text to speech model, optimized for speed." },
  { value: "tts-1-hd", label: "The latest text to speech model, optimized for quality." },
];

const Settings = () => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const apiKeyRef = useRef("");
  const modelNameRef = useRef("gpt-4o");
  const imageModelNameRef = useRef("dall-e-3");
  const ttsModelNameRef = useRef("tts-1-hd");
  const maxTokensRef = useRef(2048);

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.get("jwtToken")}`,
      "Content-Type": "application/json",
    },
  });

  const [chatGPTConfig, setChatGPTConfig] = useState({
    apiKey: "",
    modelName: "gpt-4o",
    maxTokens: 2048,
    aiImageModelName: "dall-e-3",
    ttsModelName: "tts-1-hd",
  });

  const setData = (data) => {
    setChatGPTConfig(data);
    apiKeyRef.current = data.apiKey;
    modelNameRef.current = data.modelName;
    maxTokensRef.current = data.maxTokens;
    imageModelNameRef.current = data.aiImageModelName;
    ttsModelNameRef.current = data.ttsModelName;
  };

  const handleConfigChange = (key) => (e) => {
    const value = key === "modelName" || key === "aiImageModelName" || key === "ttsModelName" ? e : e.target.value;
    setChatGPTConfig((prevConfig) => ({
      ...prevConfig,
      [key]: value,
    }));

    switch (key) {
      case "apiKey":
        apiKeyRef.current = value;
        break;
      case "modelName":
        modelNameRef.current = value;
        break;
      case "maxTokens":
        maxTokensRef.current = value;
        break;
      case "aiImageModelName":
        imageModelNameRef.current = value;
        break;
      case "ttsModelName":
        ttsModelNameRef.current = value;
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchChatGPTConfig = async () => {
      setLoading(true);
      try {
        const { data } = await instance.get("/strapi-supergpt/cache");
        setData(data);
      } catch (error) {
        console.error(error);
        toggleNotification({
          type: "warning",
          message: {
            id: "chatgpt-config-fetch-error",
            defaultMessage: "Error while fetching the chatGPT configurations",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatGPTConfig();
  }, []);

  const handleSave = async () => {
    const config = {
      apiKey: apiKeyRef.current,
      modelName: modelNameRef.current,
      maxTokens: maxTokensRef.current,
      aiImageModelName: imageModelNameRef.current,
      ttsModelName: ttsModelNameRef.current,
    };

    if (!apiKeyRef.current) {
      toggleNotification({
        type: "warning",
        message: {
          id: "chatgpt-config-api-key-required",
          defaultMessage: "Please enter the API key",
        },
      });
      return;
    }
    if (!modelNameRef.current) {
      toggleNotification({
        type: "warning",
        message: {
          id: "chatgpt-config-ai-model-required",
          defaultMessage: "Please enter the API key",
        },
      });
      return;
    }
    if (!maxTokensRef.current) {
      toggleNotification({
        type: "warning",
        message: formatMessage({
          id: "chatgpt-config-ai-model-required",
          defaultMessage: "Please enter the API key",
        }),
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await instance.post("/strapi-supergpt/cache/update", chatGPTConfig);
      if (data && data.value) {
        setData(JSON.parse(data.value));
      }
      toggleNotification({
        type: "success",
        message: {
          id: "strapi-supergpt.settingsPage.notifications.success",
          defaultMessage: "ChatGPT configurations saved successfully",
        },
      });
    } catch (error) {
      console.error(error);
      toggleNotification({
        type: "warning",
        message: {
          id: "chatgpt-config-save-error",
          defaultMessage: "Error while saving the chatGPT configurations",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet title="SuperGPT Configuration" />
      <Main aria-busy={loading}>
        <HeaderLayout
          title="SuperGPT Configurations"
          subtitle={formatMessage({
            id: "chatgpt-config-header",
            defaultMessage: "Configure the API key, model name, and other parameters",
          })}
          primaryAction={
            <Button
              startIcon={<Check />}
              onClick={handleSave}
              loading={loading}
            >
              Save
            </Button>
          }
        />
        <ContentLayout>
          <Box
            shadow="tableShadow"
            background="neutral0"
            paddingTop={6}
            paddingLeft={7}
            paddingRight={7}
            paddingBottom={6}
            hasRadius
          >
            <Grid gap={6}>
              <GridItem col={12}>
                <TextInput
                  type="text"
                  id="apiKey"
                  name="apiKey"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  label="API Key"
                  ref={apiKeyRef}
                  value={chatGPTConfig.apiKey}
                  onChange={handleConfigChange("apiKey")}
                />
              </GridItem>
              <GridItem col={6}>
                <TextInput
                  type="text"
                  id="maxTokens"
                  name="maxTokens"
                  label="Max Tokens"
                  placeholder="2048"
                  ref={maxTokensRef}
                  value={chatGPTConfig.maxTokens}
                  onChange={handleConfigChange("maxTokens")}
                />
              </GridItem>
              <GridItem col={6}>
                <SingleSelect
                  name="modelName"
                  id="modelName"
                  label="Model Name"
                  placeholder="Select a model"
                  ref={modelNameRef}
                  value={chatGPTConfig.modelName}
                  onChange={handleConfigChange("modelName")}
                >
                  {AiModels.map((model) => (
                    <SingleSelectOption key={model.value} value={model.value}>
                      {model.value} - {model.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </GridItem>
              <GridItem col={6}>
                <SingleSelect
                  name="aiImageModelName"
                  id="aiImageModelName"
                  label="Image Model Name"
                  placeholder="Select an image model"
                  ref={imageModelNameRef}
                  value={chatGPTConfig.aiImageModelName}
                  onChange={handleConfigChange("aiImageModelName")}
                >
                  {ImageAiModels.map((model) => (
                    <SingleSelectOption key={model.value} value={model.value}>
                      {model.value} - {model.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </GridItem>
              <GridItem col={6}>
                <SingleSelect
                  name="ttsModelName"
                  id="ttsModelName"
                  label="Text To Speech Model Name"
                  placeholder="Select a text-to-speech model"
                  ref={ttsModelNameRef}
                  value={chatGPTConfig.ttsModelName}
                  onChange={handleConfigChange("ttsModelName")}
                >
                  {ttsAiModels.map((model) => (
                    <SingleSelectOption key={model.value} value={model.value}>
                      {model.value} - {model.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </GridItem>
            </Grid>
          </Box>
        </ContentLayout>
      </Main>
    </Layout>
  );
};

export default Settings;
