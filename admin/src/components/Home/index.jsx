import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import {
  Layouts
} from '@strapi/strapi/admin';
import {
  Button,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Main,
  Box,
  Grid,
  Tabs,
  Typography
} from "@strapi/design-system";
import { PaperPlane, Palette, PlusCircle } from "@strapi/icons";
import CustomTab from "./tab";
import Response from "./response";
import Help from "../Help";
import LoadingOverlay from "../Loading";
import Integration from "../Integration";

import instance from '../../utils/axiosInstance';

const Home = () => {
  const { formatMessage } = useIntl();
  const imageFormats = [
    formatMessage({ id: "homePage.imageFormat" }),
    "1024x1024",
    "1024x1792",
    "1792x1024",
  ];
  const [prompt, setPrompt] = useState("");
  const [highlightedId, setHighlighted] = useState(0);
  const [convos, setConvos] = useState([]);
  const [error, setError] = useState("");
  const [format, setFormat] = useState(imageFormats[0]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handlePromptChange = (e) => {
    setError("");
    setPrompt(e.target.value);
  };

  const handleImageSizeChange = (e) => {
    setFormat(e);
  };

  const setSelectedTab = (index) => {
    if (index >= convos.length) {
      setError(formatMessage({id: "homePage.error.unselectableTab"}));
      return;
    }
    console.log(index)
    const selectedConvo = convos[index];
    if (!selectedConvo.content.length) {
      instance.get(`/strapi-supergpt/convo/${selectedConvo.id}`)
        .then(content => {
          console.log(content)
          const updatedConvos = [...convos];
          updatedConvos[index] = { ...selectedConvo, content: content.data };
          setConvos(updatedConvos);
        });
    }
    setHighlighted(index);
  };

  const handleCreateTab = async () => {
    const defaultConvoName = formatMessage({id: "homePage.convo.new.name"})
    const { data: newConvo } = await instance.post(`/strapi-supergpt/convo`, {
      name: `${defaultConvoName} ${convos.length + 1}`
    });
    setConvos(prevConvos => [...prevConvos, newConvo]);
    setHighlighted(convos.length - 1);
  };

  const handleRenameTab = async (name) => {
    const convo = convos[highlightedId]
    await instance.put(`/strapi-supergpt/convo/${convo.id}`, {
      name: name,
      content: convo.content,
    })
  };

  const handleDeleteTab = async (id) => {
    if (convos.length > 1) {
      await instance.delete(`/strapi-supergpt/convo/${id}`);
      setConvos(prevConvos => {
        const updatedConvos = prevConvos.filter(convo => convo.id !== id);
        const newHighlightedId = updatedConvos.length > 0 ? updatedConvos[0].id : null;
        setHighlighted(newHighlightedId);
        return updatedConvos;
      });
    } else {
      await instance.put(`/strapi-supergpt/convo/${id}`, {
        name: formatMessage({ id: "homePage.convo.default.name" }),
        content: [],
      });
      setConvos([{
        id,
        name: formatMessage({ id: "homePage.convo.default.name" }),
        content: [],
      }]);
      setHighlighted(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!prompt) {
      setError(formatMessage({id: "homePage.error.promptRequired"}));
      return;
    }

    let response;

    try {
      if (e.currentTarget.name === "picture") {
        if (format === imageFormats[0]) {
          setError(formatMessage({id: "homePage.error.imageSizeRequired"}));
          return;
        }
        setLoading(true);
        const data = await instance.post("/strapi-supergpt/generateImage", {
          prompt: prompt,
          size: format,
        })
        setLoading(false);
        response = data.data;
      } else {
        setLoading(true);
        const format = formatMessage({ id: "homePage.prompt.format"})
        const data = await instance.post("/strapi-supergpt/prompt", {
          prompt: `${prompt} ${format}?`,
        })
        setLoading(false);
        response = data.data;
      }
    } catch (e) {
      const errorMessage =  e.message || e.response?.data?.error || "An unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      return;
    }

    let highlightedConvo = convos[highlightedId];

    highlightedConvo.content += `\n\nYou: ${prompt}\n\nChatGPT: ${response.response}`;

    await instance.put(`/strapi-supergpt/convo/${highlightedConvo.id}`, {
      name: highlightedConvo.name,
      content: highlightedConvo.content
    });

    setPrompt("");
  };

  useEffect(() => {
    if (convos.length === 0) {
      instance.get('/strapi-supergpt/convos')
        .then(conversations => {
          if (conversations.data.length > 0) {
            setConvos(conversations.data)
          } else {
            handleCreateTab();
          }
        });
    }
  }, [setConvos]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Main aria-busy={false}>
      <Helmet title={"strapi-supergpt"} />
      <Layouts.Header
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="alpha" as="h1">
              SuperGPT
            </Typography>
          </Box>
        }
        subtitle={formatMessage({
          id: "homePage.header",
        })}
      />

      <Layouts.Action
        startActions={
          <SingleSelect onChange={handleImageSizeChange} value={format}>
            {imageFormats.map((format, idx) => (
              <SingleSelectOption key={idx} value={format}>
                {format}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        }
          endActions={
            <Box horizontal gap={2}>
              <Help />
              <Integration />
            </Box>
          }
      />
      <Layouts.Content>
        <Tabs.Root defaultValue={highlightedId}>
          <Tabs.List>
            {convos.length > 0 && convos.map((convo, idx) => (
              <CustomTab
                key={convo.id}
                value={idx}
                onRename={handleRenameTab}
                onDelete={() => handleDeleteTab(convo.id)}
                onClick={() => setSelectedTab(idx)}
              >
                {convo.name}
              </CustomTab>
            ))}
            <Tabs.Trigger onClick={handleCreateTab}><PlusCircle /></Tabs.Trigger>
          </Tabs.List>
          {convos.length > 0 && convos.map((convo, idx) => (
        <Tabs.Content
          style={{
            "margin-top": "0.5rem",
            height: "62vh",
            overflow: "scroll",
            width: "100%",
            position: "relative",
            padding: "3rem",
            zIndex: 1
          }}
          key={convo.id}
          value={idx}>
          <LoadingOverlay isLoading={loading} />
          <Response>{convo.content}</Response>
        </Tabs.Content>
        ))}
        </Tabs.Root>
        <Grid.Root spacing={1} gap={2} paddingTop={4}>
          <Grid.Item col={12}>
            <StyledTextInput
              id="chatInput"
              placeholder={formatMessage({ id: "homePage.prompt.placeholder" })}
              aria-label="Content"
              name="prompt"
              error={error}
              onChange={handlePromptChange}
              value={prompt}
              disabled={loading}
              onPaste={handlePromptChange}
            />
            <StyledButton
              size="L"
              name="prompt"
              startIcon={<PaperPlane />}
              value="prompt"
              loading={loading}
              onClick={handleSubmit}
            >
              {formatMessage({ id: "homePage.prompt.button" })}
            </StyledButton>
            <StyledButton
              size="L"
              name="picture"
              value="picture"
              onClick={handleSubmit}
              startIcon={<Palette />}
            >
              {formatMessage({ id: "homePage.image.button" })}
            </StyledButton>
          </Grid.Item>
        </Grid.Root>
      </Layouts.Content>
    </Main>
  );
};

export default Home;

const StyledTextInput = styled(TextInput)`
  width: 83vw
`
const StyledButton = styled(Button)`
  margin-left: 1rem;
`