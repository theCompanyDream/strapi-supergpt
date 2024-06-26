import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import axios from "axios";
import { auth } from "@strapi/helper-plugin";
import {
  Button,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Layout,
  HeaderLayout,
  ContentLayout,
  Main,
  Box,
  Card,
  CardBody,
  CardContent,
  Grid,
  GridItem,
  ActionLayout,
  Tab,
  Stack,
  Tabs,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@strapi/design-system";
import { PaperPlane, Command, Cog, Picture, Plus } from "@strapi/icons";

import CustomTab from "./tab";
import Response from "./response";
import Help from "../Help";
import LoadingOverlay from "../Loading";
import Integration from "../Integration";

const imageFormats = [
  "Pick an image format",
  "1024x1024",
  "1024x1792",
  "1792x1024",
]

const Home = () => {
  const { formatMessage } = useIntl();
  const [prompt, setPrompt] = useState("");
  const [highlightedId, setHighlighted] = useState(0)
  const [convos, setConvos] = useState([]);
  const [error, setError] = useState("");
  const [format, setFormat] = useState(imageFormats[0])
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApiIntegrationModalVisible, setIsApiIntegrationModalVisible] =
    useState(false);

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.get("jwtToken")}`,
      "Content-Type": "application/json",
    },
  });

  const setSelectedResponse = (e) => {
    if (e >= convos.length) {
      setError("This Tab is unselectable")
      return
    }
    const selectedConvo = convos[e]
    if (selectedConvo.content.length === 0) {
      instance.get(`/strapi-supergpt/convo/${selectedConvo.id}`)
      .then(content => {
        const newConvos = [...convos]
        newConvos[selectedConvo] = content.data
        setConvos(newConvos)
      })
    }
    setHighlighted(selectedConvo.id)
  }

  const handlePromptChange = (e) => {
    setError("");
    setPrompt(e.target.value);
  };

  const handleImageSizeChange = (e) => {
    setFormat(e)
  }

  const handleCreateTab = async (e) => {
    await instance.post(`/strapi-supergpt/convo`, {
      name: `New Convo ${convos.length + 1}`
    })
    .then(convo => setConvos([...convos, convo.data]))
    setHighlighted(convos.length-1)
  }

  const handleSaveTab = async (e) => {
    await instance.put(`/strapi-supergpt/convo`, {
      name: e,
      content: convos[highlightedId],
    })
    .then(convo => setConvos([...convos, convo.data]))
  }

  const handleDeleteTab = async (e) => {
    if (convos.length > 1) {
      await instance.delete(`/strapi-supergpt/convo/${highlightedId}`).then( convo => {
        const filteredlist = convos.filter(convo => convo.id !== highlightedId)
        setConvos(filteredlist)
      })
    } else {
      instance.put(`/strapi-supergpt/convo/${highlightedId}`, {
        name: "Default Convo",
        content: []
      }).then( convo => setConvos([convo]))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    let response;

    if (e.target.name === "picture") {
      if (format === imageFormats[0]) {
        setError("Image size is required")
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
        prompt: `${prompt}\nCan format your response in html? Please encase the human responses in <p></p>`,
      });
      response = data
    }

    if (response.error || !response.response) {
      setLoading(false);
      setError(response.error);
      return;
    }

    let highlightedConvo = convos[highlightedId]

    highlightedConvo.content = [
      ...highlightedConvo.content,
      {
        name: "you",
        message: prompt
      },
      {
        name: "chatgpt",
        message: response.response,
      }
    ]

    instance.put(`/strapi-supergpt/convo/${highlightedConvo.id}`, {
      name: highlightedConvo.name,
      content: highlightedConvo.content
    })

    setLoading(false);
    setPrompt("");
  };

  useEffect(() => {
    if(convos.length === 0) {
      instance.get('/strapi-supergpt/convos')
          .then(conversations => {
            if (conversations.data.length > 0) {
              setConvos(conversations.data)
            } else {
              return handleCreateTab(null)
            }
          })
    }
  }, [convos, setConvos]);

  useEffect(() => {
      // Scrolling logic that depends on messagesEndRef
      if (!messagesEndRef.current) return;
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, []); // This could potentially be adjusted based on when you need to scroll


  return (
    <Layout>
      <Helmet title={"strapi-supergpt"} />
      <Main aria-busy={false}>
        <HeaderLayout
          title={"SuperGPT"}
          subtitle={formatMessage({
            id: "supergpt-header",
            defaultMessage: "ChatGPT plugin for Strapi",
          })}
        />

        <ActionLayout
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
            <Stack horizontal gap={2}>
              <Button
                variant="secondary"
                startIcon={<Command />}
                onClick={() => setIsModalVisible(true)}
              >
                Prompt
              </Button>
              <Button
                variant="secondary"
                startIcon={<Cog />}
                onClick={() => setIsApiIntegrationModalVisible(true)}
              >
                API Integration
              </Button>
            </Stack>
          }
        />

        <ContentLayout>
          <TabGroup onTabChange={setSelectedResponse}>
            <Tabs>
              {convos.length > 0 && convos.map(convo => (
                <CustomTab
                  key={convo.id}
                  value={convo.id}
                  onRename={handleSaveTab}
                  onDelete={handleDeleteTab}
                  >
                  {convo.name}
                </CustomTab>
              ))}
              <Tab onClick={handleCreateTab}><Plus /></Tab>
            </Tabs>
            <TabPanels>
              {convos.length > 0 && convos.map(
                convo => <TabPanel>
                <Card style={{ position: "relative" }}>
                  <CardBody
                    style={{
                      height: "64vh",
                      overflowY: "scroll",
                    }}
                  >
                <CardContent>
                  <LoadingOverlay isLoading={loading} />
                   <section>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "auto",
                        justifyContent: "flex-end",
                      }}
                    >
                      {convo.content.map((response, index) => (
                        <Response key={index + "123"}>
                          {response}
                        </Response>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </section>
                </CardContent>
              </CardBody>
              </Card>
            </TabPanel>
              )}
            </TabPanels>
          </TabGroup>
          <Box>
            <form>
              <Grid spacing={1} gap={2} paddingTop={4}>
                <GridItem col={11}>
                  <TextInput
                    id="chatInput"
                    placeholder="Enter your prompt here"
                    aria-label="Content"
                    name="prompt"
                    error={error}
                    onChange={handlePromptChange}
                    value={prompt}
                    disabled={loading}
                    onpaste={(e) => {
                      e.preventDefault();
                      setError("");
                    }}
                  />
                </GridItem>
                <GridItem style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <Button
                    size="L"
                    name="prompt"
                    startIcon={<PaperPlane />}
                    value="prompt"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    Text
                  </Button>
                  <Button
                    size="L"
                    name="picture"
                    value="picture"
                    onClick={handleSubmit}
                    startIcon={<Picture />}
                  >
                    Image
                  </Button>
                </GridItem>
              </Grid>
            </form>
          </Box>
        </ContentLayout>
        <Help
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <Integration
          isOpen={isApiIntegrationModalVisible}
          onClose={() => setIsApiIntegrationModalVisible(false)}
        />
      </Main>
    </Layout>
  );
};

export default Home;
