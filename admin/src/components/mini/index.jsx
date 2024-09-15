import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { 
	Box, 
	Button, 
	Divider,
	Textarea,
	TextInput,
	Select, Option,
	NumberInput,
	Typography,
	Grid, GridItem,
	ModalLayout,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Tabs,
	Tab,
	TabGroup,
	TabPanels,
	TabPanel,
} from '@strapi/design-system';

import {Lock, Download, Trash, Duplicate} from '@strapi/icons';

const Mini = () => {
  const { formatMessage } = useIntl();
  const [isVisible, setIsVisible] = useState(false);

  const [prompt, setPrompt] = useState(undefined);
  const [completion, setCompletion] = useState(undefined);
  const [finishReason, setFinishReason] = useState(null);

  const [model, setModel] = useState();
  const [temperature, setTemperature] = useState();
  const [maxTokens, setMaxTokens] = useState();

  const [saveModelText, setSaveModelText] = useState(
    formatMessage({
      id: 'Modal.save-model.button.text.default',
      defaultMessage: 'Save model settings',
    })
  );
  const [downloadedModelsText, setDownloadedModelsText] = useState(
    formatMessage({
      id: 'Modal.tabs.settings.download.button.text.default',
      defaultMessage: 'Download models',
    })
  );
  const [generateCompletionText, setGenerateCompletionText] = useState(
    formatMessage({
      id: 'Modal.tabs.prompt.generate.button.text.default',
      defaultMessage: 'Generate',
    })
  );
  const [defaultSettings, setDefaultSettings] = useState(null);

  useEffect(() => {
    const fetchDefaultSettings = async () => {
      const tmpSettings = await settingsAPI.get();
      setDefaultSettings(tmpSettings);

      setModel(tmpSettings?.model);
      setTemperature(tmpSettings?.temperature);
      setMaxTokens(tmpSettings?.maxTokens);
    };
    fetchDefaultSettings();
  }, []);

  const handleSaveDefaultSettings = () => {
    settingsAPI
      .set({ model, temperature, maxTokens, models: defaultSettings.models })
      .then(async () => {
        setSaveModelText(
          formatMessage({
            id: 'Modal.save-model.button.text.after',
            defaultMessage: 'Saved!',
          })
        );
        await delay(2000);
        setSaveModelText(
          formatMessage({
            id: 'Modal.save-model.button.text.default',
            defaultMessage: 'Save model settings',
          })
        );
      });
  };

  const handleDownloadOpenAIModels = () => {
    setDownloadedModelsText(
      formatMessage({
        id: 'Modal.tabs.settings.download.button.text.pending',
        defaultMessage: 'Downloading...',
      })
    );
    modelsAPI.get().then((data) => {
      setDefaultSettings({ ...defaultSettings, models: data });
      settingsAPI.set({ ...defaultSettings, models: data }).then(async () => {
        setDownloadedModelsText(
          formatMessage({
            id: 'Modal.tabs.settings.download.button.text.default',
            defaultMessage: 'Download models',
          })
        );
      });
    });
  };

  const handlePromptSubmit = () => {
    if (model && prompt && temperature && maxTokens) {
      const messages = [{ role: 'user', content: prompt }];
      setGenerateCompletionText('Generating completion...');
      completionAPI
        .create({ model, messages, temperature, maxTokens })
        .then((data) => {
          setCompletion(data?.choices[0]?.text.trim());
          setFinishReason(data?.choices[0]?.finish_reason);
        })
        .finally(() => {
          setGenerateCompletionText('Generate');
        });
    }
  };

  const handleCopyToClipboard = () => {
    setIsVisible((prev) => !prev);
    navigator.clipboard.writeText(completion);
  };

  return (
    <Box
      as="aside"
      aria-labelledby="additional-informations"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      paddingBottom={4}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={6}
      shadow="tableShadow"
    >
      <Box>
        <Typography variant="sigma" textColor="neutral600" id="seo">
			SuperGPT
        </Typography>
        <Box paddingTop={2} paddingBottom={6}>
          <Divider />
        </Box>
        <Box paddingTop={1}>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {formatMessage({
              id: 'RightLinks.button',
              defaultMessage: 'Completion',
            })}
          </Button>
          {isVisible && (
            <ModalLayout
              onClose={() => setIsVisible((prev) => !prev)}
              labelledBy="title"
            >
              <ModalHeader>
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  as="h2"
                  id="title"
                >
                  {formatMessage({
                    id: 'Plugin.name',
                    defaultMessage: 'Open AI Completion',
                  })}
                </Typography>
              </ModalHeader>
              <ModalBody>
                <Box>
                  <TabGroup
                    label="Some stuff for the label"
                    id="tabs"
                    variant="simple"
                  >
                    <Tabs>
                      <Tab>
                        {formatMessage({
                          id: 'Modal.tabs.prompt',
                          defaultMessage: 'Prompt',
                        })}
                      </Tab>
                      <Tab>
                        {formatMessage({
                          id: 'Modal.tabs.settings',
                          defaultMessage: 'Settings',
                        })}
                      </Tab>
                    </Tabs>
                    <TabPanels>
                      <TabPanel>
                        <Box
                          color="neutral800"
                          paddingTop={8}
                          paddingLeft={4}
                          background="neutral0"
                        >
                          <TextInput
                            placeholder={formatMessage({
                              id: 'Modal.tabs.prompt.placeholder',
                              defaultMessage:
                                'Explain what is Strapi to a 5 years old',
                            })}
                            label="Prompt"
                            name="content"
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                          />
                        </Box>
                        <Box
                          color="neutral800"
                          paddingTop={3}
                          paddingLeft={4}
                          background="neutral0"
                        >
                          <Button onClick={() => handlePromptSubmit()}>
                            {generateCompletionText}
                          </Button>
                        </Box>

                        <Box
                          color="neutral800"
                          paddingTop={4}
                          paddingBottom={8}
                          paddingLeft={4}
                          background="neutral0"
                        >
                          <Textarea
                            label="Completion"
                            hint={
                              finishReason && completion
                                ? `${formatMessage({
                                    id: 
                                      'Modal.tabs.prompt.finish-reason.text'
                                    ,
                                    defaultMessage: 'Finish reason:',
                                  })} ${finishReason}`
                                : undefined
                            }
                            onChange={(e) => setCompletion(e.target.value)}
                            name="content"
                          >
                            {completion}
                          </Textarea>
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box
                          color="neutral800"
                          paddingTop={8}
                          paddingLeft={4}
                          background="neutral0"
                        >
                          <Grid
                            gap={{
                              desktop: 5,
                              tablet: 2,
                              mobile: 1,
                            }}
                          >
                            <GridItem col={6} s={12}>
                              <Box>
                                <Select
                                  id="select1"
                                  label="Models"
                                  hint="https://beta.openai.com/docs/models/overview"
                                  value={model}
                                  onChange={setModel}
                                  selectButtonTitle="Carret Down Button"
                                >
                                  {defaultSettings &&
                                    defaultSettings?.models?.map((model) => (
                                      <Option value={model}>{model}</Option>
                                    ))}
                                </Select>
                              </Box>
                            </GridItem>
                            <GridItem col={4} s={12}>
                              <Box paddingTop={5}>
                                <Button
                                  variant="primary"
                                  size="S"
                                  startIcon={<Download />}
                                  onClick={() => handleDownloadOpenAIModels()}
                                >
                                  {downloadedModelsText}
                                </Button>
                              </Box>
                            </GridItem>
                          </Grid>
                        </Box>
                        <Box
                          color="neutral800"
                          paddingTop={4}
                          paddingLeft={4}
                          paddingBottom={8}
                          background="neutral0"
                        >
                          <Grid
                            gap={{
                              desktop: 5,
                              tablet: 2,
                              mobile: 1,
                            }}
                          >
                            <GridItem padding={1} col={6} s={12}>
                              <Box color="neutral800">
                                <NumberInput
                                  label="Temperature"
                                  name="content"
                                  hint={formatMessage({
                                    id: 'Modal.tabs.settings.temperature.hint.text',
                                    defaultMessage:
                                      'Between 0 and 1 (default). Higher values means the model will take more risks. Try 0,9 for more creative applications, and 0 for ones with a well-defined answer.',
                                  })}
                                  onValueChange={(value) =>
                                    setTemperature(
                                      value >= 0 && value <= 1 ? value : 1
                                    )
                                  }
                                  value={temperature}
                                />
                              </Box>
                            </GridItem>
                            <GridItem padding={1} col={6} s={12}>
                              <Box color="neutral800">
                                <NumberInput
                                  label="Max tokens"
                                  name="content"
                                  hint={formatMessage({
                                    id: 'Modal.tabs.settings.maxTokens.hint.text',
                                    defaultMessage:
                                      "The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).",
                                  })}
                                  onValueChange={(value) =>
                                    setMaxTokens(
                                      value > 0 && value <= 4096 ? value : 16
                                    )
                                  }
                                  value={maxTokens}
                                />
                              </Box>
                            </GridItem>
                          </Grid>
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </Box>
              </ModalBody>
              <ModalFooter
                startActions={
                  <Button
                    onClick={() => setIsVisible((prev) => !prev)}
                    variant="tertiary"
                  >
                    {formatMessage({
                      id: 'Modal.cancel.button.text',
                      defaultMessage: 'Cancel',
                    })}
                  </Button>
                }
                endActions={
                  <>
                    {JSON.stringify({
                      model: defaultSettings.model,
                      temperature: defaultSettings.temperature,
                      maxTokens: defaultSettings.maxTokens,
                    }) !==
                      JSON.stringify({ model, temperature, maxTokens }) && (
                      <Button
                        variant="secondary"
                        startIcon={<Lock />}
                        onClick={() => handleSaveDefaultSettings()}
                      >
                        {saveModelText}
                      </Button>
                    )}

                    {completion && (
                      <Button
                        startIcon={<Trash />}
                        variant="secondary"
                        onClick={() => setCompletion(undefined)}
                      >
                        {formatMessage({
                          id: 'Modal.clear.button.text',
                          defaultMessage: 'Clear completion',
                        })}
                      </Button>
                    )}

                    {completion && (
                      <Button
                        startIcon={<Duplicate />}
                        onClick={() => handleCopyToClipboard()}
                      >
                        {formatMessage({
                          id: 'Modal.copy-to-clipboard.button.text',
                          defaultMessage: 'Copy to clipboard',
                        })}
                      </Button>
                    )}
                  </>
                }
              />
            </ModalLayout>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Mini;