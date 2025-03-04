import React from "react";
import { useIntl } from "react-intl";
import {
  Modal,
  Typography,
  Divider,
  Box,
  Button
} from "@strapi/design-system";

import { Command} from "@strapi/icons";

import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Integration = () => {
  const { formatMessage } = useIntl();
  return (
    <Modal.Root onClose={() => onClose(!isOpen)} labelledBy="title">
      <Modal.Trigger>
        <Button
          variant="secondary"
          startIcon={<Command />}
          >
          {formatMessage({ id: "homePage.help.button" })}
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Typography
            fontWeight="bold"
            textColor="neutral800"
            as="h2"
            id="title-api-integration"
          >
            {formatMessage({id: "homePage.API_Integration.button"})}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Typography variant="omega">
            {formatMessage({id: "integration.instructions"})}
          </Typography>

          <Box paddingTop={6} paddingBottom={6}>
            <Divider />
          </Box>

          <Typography variant="omega">{formatMessage({id: "integration.sampleRequest"})}</Typography>
          <br />
          <SyntaxHighlighter
            language="bash"
            style={darcula}
            customStyle={{
              borderRadius: "16px",
              lineHeight: "1.5rem",
              fontSize: "15px"
            }}
          >
            {`curl --location --request POST '${process.env.STRAPI_ADMIN_BACKEND_URL}/api/strapi-supergpt/prompt' \\
                              --header 'Content-Type: application/json' \\
                              --header 'Authorization: Bearer YOUR_STRAPI_AUTH_TOKEN' \\
                              --data-raw '{"prompt": "Test prompt?"}'`}
          </SyntaxHighlighter>

          <Box paddingTop={6} paddingBottom={6}>
            <Divider />
          </Box>
          <Typography variant="omega">
            {formatMessage({id: "integration.openAiParams"})}
          </Typography>
          <br />
          <SyntaxHighlighter
            language="bash"
            style={darcula}
            customStyle={{
              borderRadius: "12px",
              lineHeight: "1.5rem",
              fontSize: "15px"
            }}
          >
            {`curl --location --request POST '${process.env.STRAPI_ADMIN_BACKEND_URL}/api/strapi-supergpt/prompt' \\
                              --header 'Content-Type: application/json' \\
                              --header 'Authorization: Bearer YOUR_STRAPI_AUTH_TOKEN' \\
                              --data-raw '{"prompt": "Test prompt?",
                                                      "model": "gpt-3.5-turbo",
                                                      "max_tokens": 100,
                                                      "temperature": 0.7,
                                                      "top_p": 1,
                                                      "frequency_penalty": 0,
                                                      "presence_penalty": 0,
                                                      "stop": ["\\n"] }'`}
          </SyntaxHighlighter>

          <Box paddingTop={6} paddingBottom={6}>
            <Divider />
          </Box>
          <Typography variant="omega">Sample response</Typography>
          <br />
          <SyntaxHighlighter
            language="json"
            style={darcula}
            customStyle={{
              borderRadius: "12px",
              lineHeight: "1.5rem",
              fontSize: "15px"
            }}
          >
            {`{"response": "Sample response"}`}
          </SyntaxHighlighter>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default Integration;
