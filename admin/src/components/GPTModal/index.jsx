import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from "react-intl";
import { unstable_useContentManagerContext as useCMEditViewDataManager } from '@strapi/strapi/admin';
import {
  Modal,
  Button,
  Field,
  TextInput,
  Typography,
  Flex,
  Card,
  Checkbox,
  SingleSelect,
  SingleSelectOption,
  Box
} from '@strapi/design-system';
import PluginIcon from "../PluginIcon";
import Response from "../Home/response";
import instance from '../../utils/axiosInstance';

const GPTModal = () => {
  const { formatMessage } = useIntl();
  const { id, form, model } = useCMEditViewDataManager();
  const { values } = form;
  const imageFormats = [
    formatMessage({ id: "homePage.imageFormat" }),
    "1024x1024",
    "1024x1792",
    "1792x1024",
  ];
  const [modalForm, setPrompt] = useState({ prompt: "", includeData: false, imageSize: imageFormats[0] });
  const [conversation, setConversation] = useState({ content: "" });
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);

  useEffect(() => {
    if (id !== undefined) {
      instance.get(`/strapi-supergpt/convo/${model}/${id}`)
        .then(conversations => {
          if (conversations.data) {
            setConversation(conversations.data);
          }
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!modalForm.prompt.trim()) {
      setError(formatMessage({ id: "homePage.error.promptRequired" }));
      return;
    }

    let promptText = modalForm.prompt;
    if (modalForm.includeData) {
      promptText += `\n${JSON.stringify(values)}`;
    }
    promptText += `\n${formatMessage({ id: "homePage.prompt.format" })}`;

    let response;
    try {
      if (e.currentTarget.name === "picture") {
        if (modalForm.imageSize === imageFormats[0]) {
          setError(formatMessage({ id: "homePage.error.imageSizeRequired" }));
          return;
        }
        setLoading(true);
        const { data } = await instance.post("/strapi-supergpt/generateImage", {
          prompt: promptText,
          size: modalForm.imageSize,
        });
        response = data;
      } else {
        setLoading(true);
        const { data } = await instance.post("/strapi-supergpt/prompt", {
          prompt: promptText,
        });
        response = data;
      }
    } catch (e) {
      const errorMessage = e.message || e.response?.data?.error || "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      return;
    }

    const newContent = `You: ${modalForm.prompt}\nChatGPT: ${response.response}`;
    setConversation((prevConvo) => ({
      ...prevConvo,
      content: newContent
    }));

    if (id) {
      if (conversation.id) {
        await instance.put(`/strapi-supergpt/convo/${conversation.id}`, {
          collectionTypeId: id,
          collectionTypeName: model,
          content: newContent
        });
      } else {
        const { data: newConvo } = await instance.post(`/strapi-supergpt/convo`, {
          collectionTypeId: id,
          collectionTypeName: model,
          content: newContent
        });
        setConversation(newConvo);
      }
    }
    setPrompt({ ...modalForm, prompt: "" });
    setLoading(false);
  };

  return (
    <Modal.Root>
      <Modal.Trigger>
        <StyledTrigger startIcon={<PluginIcon />}>GPT</StyledTrigger>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Typography variant="delta">
            Strapi SuperGPT
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Box>
            {/* Row for TextInput and Buttons */}
            <Flex alignItems="center">
              <StyledField error={Error}>
                <StyledTextInput
                  label="Prompt"
                  placeholder={formatMessage({ id: "homePage.prompt.placeholder" })}
                  value={modalForm.prompt}
                  onChange={(e) => setPrompt({ ...modalForm, prompt: e.target.value })}
                  hasError={Error !== ""}
                />
                <Field.Error />
              </StyledField>
              <StyledButton
                variant="secondary"
                name="prompt"
                size="L"
                error={Error}
                onClick={handleSubmit}
                disabled={loading}
              >
                {formatMessage({ id: "homePage.prompt.button" })}
              </StyledButton>
              <StyledButton
                variant="secondary"
                name="picture"
                size="L"
                error={Error}
                onClick={handleSubmit}
                disabled={loading}
              >
                {formatMessage({ id: "homePage.image.button" })}
              </StyledButton>
            </Flex>
            {/* Centered row for SingleSelect and Checkbox */}
            <Flex justifyContent="center" alignItems="center" gap={4} marginTop={4}>
              <SingleSelect
                onChange={(e) => setPrompt({ ...modalForm, imageSize: e })}
                value={modalForm.imageSize}
              >
                {imageFormats.map((format, idx) => (
                  <SingleSelectOption key={idx} value={format}>
                    {format}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
              <Checkbox
                onCheckedChange={(e) => setPrompt({ ...modalForm, includeData: e })}
                checked={modalForm.includeData}
              >
                {formatMessage({
                  id: "entity.includeStrapiData",
                  defaultMessage: "Include Collection Data"
                })}
              </Checkbox>
            </Flex>
            <StyledCard>
              {conversation && (
                <Response>
                  {conversation.content}
                </Response>
              )}
            </StyledCard>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">
              Cancel
            </Button>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default GPTModal;

// Styled components
const StyledField = styled(Field.Root)`
  width: 100%;
`;

const StyledTextInput = styled(TextInput)`
  width: 97%;
  margin-right: 1rem;
`;

const StyledTrigger = styled(Button)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: ${props => props.error ? "2rem" : "0"};
`;

const StyledCard = styled(Card)`
  margin-top: 1rem;
  width: 100%;
  height: 45vh;
  padding: 1rem;
  overflow: scroll;
`;
