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
  IconButton,
  ActionLayout,
  Tooltip,
  Stack,
  Divider,
} from "@strapi/design-system";
import { PaperPlane, Command, Trash, Cog, Picture } from "@strapi/icons";
import Response from "../Response";
import Help from "../Help";
import LoadingOverlay from "../Loading";
import ClearChatGPTResponse from "../ClearChatGPTResponse";
import Integration from "../Integration";

const imageFormats = [
  "1024x1024",
  "1024x1792",
  "1792x1024",
]

const Home = () => {
  const { formatMessage } = useIntl();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApiIntegrationModalVisible, setIsApiIntegrationModalVisible] =
    useState(false);
  const [
    isClearChatGPTResponseModalVisible,
    setIsClearChatGPTResponseModalVisible,
  ] = useState(false);

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.get("jwtToken")}`,
      "Content-Type": "application/json",
    },
  });

  const clearResponses = () => {
    setResponses([]);
    setIsClearChatGPTResponseModalVisible(false);
  };

  const handleInputChange = (e) => {
    setError(false);
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    if (!content) {
      setError("Prompt is required");
      return;
    }
    setLoading(true);

    let response;

    if (e.target.name === "picture") {
      const { data } = await instance.post("/strapi-chatgpt/generateImage", {
        prompt: content,
        size: "1792x1024",
      });
      response = data;
    } else {
      const { data } = await instance.post("/strapi-chatgpt/prompt", {
        prompt: content,
      });
      response = data
    }

    if (response.error || !response.response) {
      setLoading(false);
      setError(response.error);
      return;
    }

    setResponses([
      ...responses,
      {
        you: content,
        bot: response.response,
      },
    ]);

    setLoading(false);
    setContent("");
  };

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  return (
    <Layout>
      <Helmet title={"Strapi ChatGPT"} />
      <Main aria-busy={false}>
        <HeaderLayout
          title={"ChatGPT"}
          subtitle={formatMessage({
            id: "chatgpt-headder",
            defaultMessage: "ChatGPT plugin for Strapi",
          })}
        />

        <ActionLayout
          startActions={
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
              {/* <SingleSelect
                name="imageFormats">
                {imageFormats.map((format, idx) =>
                (<SingleSelectOption key={idx}>
                    {format}
                </SingleSelectOption>))}
              </SingleSelect> */}
            </Stack>
          }
          endActions={
            <Tooltip description="Clear chatGPT history" position="left">
              <IconButton
                disabled={loading || responses.length === 0}
                onClick={() => setIsClearChatGPTResponseModalVisible(true)}
                icon={<Trash />}
              />
            </Tooltip>
          }
        />

        <ContentLayout>
          <ClearChatGPTResponse
            isOpen={isClearChatGPTResponseModalVisible}
            setIsOpen={setIsClearChatGPTResponseModalVisible}
            onConfirm={clearResponses}
          />
          <Card style={{ position: "relative" }}>
            <CardBody
              style={{
                height: "64vh",
                overflowY: "scroll",
              }}
            >
              <CardContent>
                <LoadingOverlay isLoading={loading} />
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      overflow: "auto",
                      justifyContent: "flex-end",
                    }}
                  >
                    {responses.map((response, index) => (
                      <>
                        <Response key={index + "123"} data={response} />
                        <Box paddingTop={2} paddingBottom={4}>
                          <Divider />
                        </Box>
                      </>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </CardContent>
            </CardBody>
          </Card>

          <Box>
            <form>
              <Grid gap={2} paddingTop={4}>
                <GridItem col={10}>
                  <TextInput
                    id="chatInput"
                    placeholder="Enter your prompt here"
                    aria-label="Content"
                    name="content"
                    error={error}
                    onChange={handleInputChange}
                    value={content}
                    disabled={loading}
                    onpaste={(e) => {
                      e.preventDefault();
                      setError(false);
                    }}
                  />
                </GridItem>
                <GridItem>
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
                </GridItem>
                <GridItem>
                  <Button
                    size={"L"}
                    name="picture"
                    value="picture"
                    onClick={handleSubmit}
                    startIcon={<Picture />}>
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
