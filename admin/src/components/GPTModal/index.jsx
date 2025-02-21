// components/TabbedGPTModal/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from "react-intl";
import { unstable_useContentManagerContext as useCMEditViewDataManager } from '@strapi/strapi/admin';

import {
  Modal,
  Button,
  TextInput,
  Typography,
  Flex,
  Card,
  Checkbox,
  SingleSelect,
  SingleSelectOption,
  Box
} from '@strapi/design-system';

import PluginIcon from "../PluginIcon"
import Response from "../Home/response"

import instance from '../../utils/axiosInstance';

const GPTModal = () => {
  // State for Completion Tab
  const { formatMessage } = useIntl();
  const { id, form  } = useCMEditViewDataManager();
  const { initialValues, values, onChange } = form;
  // const { publish } = useDocumentActions()
  const imageFormats = [
    formatMessage({ id: "homePage.imageFormat" }),
    "1024x1024",
    "1024x1792",
    "1792x1024",
  ]
  const [modalForm, setPrompt] = useState({prompt:"", includeData: false, imageSize: imageFormats[0]});;
  const [conversation, setConversation] = useState('');
  const [loading, setLoading] = useState(false);

  // State for Image Tab
  const [Error, setError] = useState(null);

  useEffect(() => {
    if (id !== undefined) {
      instance.get(`/strapi-supergpt/convo/${id}`)
      .then(conversations => {
        if (conversations.length > 0) {
          setConversation(conversations)
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!modalForm) {
      setError(formatMessage({id: "homePage.error.promptRequired"}));
      return;
    }

    let prompt = modalForm.prompt;

    if (modalForm.includeData) {
      prompt += `\n${JSON.stringify(values)}`
    }

    prompt += `\n${formatMessage({ id: "homePage.prompt.format"})}`

    let response;

    if (e.target.name === "picture") {
      if (format === imageFormats[0]) {
        setError(formatMessage({id: "homePage.error.imageSizeRequired"}));
        return;
      }
      setLoading(true);
      const { data } = await instance.post("/strapi-supergpt/generateImage", {
        prompt: prompt,
        size: format,
      });
      response = data;
    } else {
      setLoading(true);
      const { data } = await instance.post("/strapi-supergpt/prompt", {
        prompt: prompt,
      });
      response = data;
    }

    if (response.error || !response.response) {
      setLoading(false);
      setError(response.error);
      return;
    }

    setConversation([
      ...conversation,
      {
        name: "you",
        message: form.prompt
      },
      {
        name: "chatgpt",
        message: response.response,
      }
    ]);

    setLoading(false);
    setPrompt("");
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
            <Flex>
              <StyledTextInput
                label="Prompt"
                placeholder={formatMessage({ id: "homePage.prompt.placeholder" })}
                value={modalForm.prompt}
                onChange={(e) => setPrompt({...modalForm, prompt: e.target.value})}
                error={Error}
              />
              <StyledButton
                  variant="secondary"
                  name="prompt"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {formatMessage({ id: "homePage.prompt.button" })}
                </StyledButton>
                <StyledButton
                  variant="secondary"
                  name="picture"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {formatMessage({ id: "homePage.image.button" })}
                </StyledButton>
            </Flex>
            {/* Checkbox placed just below the prompt */}
            <Flex direction="row">
              <SingleSelect onChange={(e) => setPrompt({...modalForm, imageSize: e})} value={modalForm.imageSize}>
                {imageFormats.map((format, idx) => (
                  <SingleSelectOption key={idx} value={format}>
                    {format}
                  </SingleSelectOption>
                ))}
              </SingleSelect>

              <Checkbox
                onCheckedChange={(e) => setPrompt({...modalForm , includeData: e})}
                checked={modalForm.includeData}
              >
              {formatMessage({
                id: "entity.includeStrapiData",
                defaultMessage: "Include Collection Data"
              })}
            </Checkbox>
            </Flex>
            <StyledCard>
              {conversation && <Response>
                {conversation}
              </Response>}
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

const StyledTextInput = styled(TextInput)`
  width: 80%;
  margin-right: 1rem;
`;

const StyledTrigger = styled(Button)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-right: 0.5rem;
`;

const StyledCard = styled(Card)`
  margin-top: 1rem;
  width: 100%;
  height: 45vh;
`;