import React from "react";
import { useIntl } from "react-intl";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  Typography,
  Divider,
  Box,
} from "@strapi/design-system";

import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Integration = ({ isOpen, onClose }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      {isOpen && (
        <ModalLayout onClose={() => onClose(!isOpen)} labelledBy="title">
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title-api-integration"
            >
              {formatMessage({id: "strapi-supergpt.homePage.API_Integration.button"})}
            </Typography>
          </ModalHeader>
          <ModalBody>
            {/* Add code block */}
            <Typography variant="omega">
              {formatMessage({id: "strapi-supergpt.integration.instructions"})}
            </Typography>

            <Box paddingTop={6} paddingBottom={6}>
              <Divider />
            </Box>

            <Typography variant="omega">{formatMessage({id: "strapi-supergpt.integration.sampleRequest"})}</Typography>
            <br />
            <SyntaxHighlighter
              language="bash"
              style={darcula}
              customStyle={{
                borderRadius: "12px",
                lineHeight: "1.5rem",
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
              {formatMessage({id: "strapi-supergpt.integration.openAiParams"})}
            </Typography>
            <br />
            <SyntaxHighlighter
              language="bash"
              style={darcula}
              customStyle={{
                borderRadius: "12px",
                lineHeight: "1.5rem",
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
              }}
            >
              {`{"response": "Sample response"}`}
            </SyntaxHighlighter>
          </ModalBody>
        </ModalLayout>
      )}
    </>
  );
};

export default Integration;
