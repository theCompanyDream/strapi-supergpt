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
  const [generateCompletionText, setGenerateCompletionText] = useState(
    formatMessage({
      id: 'Modal.tabs.prompt.generate.button.text.default',
      defaultMessage: 'Generate',
    })
  );

  const [model, setModel] = useState();
  const [temperature, setTemperature] = useState();
  const [maxTokens, setMaxTokens] = useState();

  const [defaultSettings, setDefaultSettings] = useState(null);

  const handlePromptSubmit = () => {

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
                    {/* {JSON.stringify({
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
                    )} */}
                      <Button
                        startIcon={<Trash />}
                        variant="secondary"
                        onClick={() => setCompletion(undefined)}
                      >
                        {formatMessage({
                          id: 'Modal.clear.button.text',
                          defaultMessage: 'Clear Completion',
                        })}
                      </Button>
                       <Button
                        startIcon={<Duplicate />}
                        onClick={() => handleCopyToClipboard()}
                      >
                        {formatMessage({
                          id: 'Modal.copy-to-clipboard.button.text',
                          defaultMessage: 'Copy to clipboard',
                        })}
                      </Button>
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