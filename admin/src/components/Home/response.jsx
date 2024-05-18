import React from 'react';
import { Box, Divider, Typography } from '@strapi/design-system';
import DOMPurify from 'dompurify';
import styled from 'styled-components';

const ChatContainer = styled(Box)`
  padding: 0;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};

  .chatgpt-message {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.neutral600};
  }

  .user-message {
    color: ${({ theme }) => theme.colors.neutral800};
  }
`;

const Response = ({ children }) => {
  const cleanHtml = DOMPurify.sanitize(children.message);
  const htmlContent = {
    __html: cleanHtml,
  };

  const messageClass = children.name === 'chatgpt' ? 'chatgpt-message' : 'user-message';

  return (
    <ChatContainer>
      <Typography variant="omega" as="p" className={messageClass}>
        {children.name}: <span dangerouslySetInnerHTML={htmlContent} />
      </Typography>
      {children.name === 'chatgpt' && (
        <Box paddingTop={2} paddingBottom={4}>
          <Divider />
        </Box>
      )}
    </ChatContainer>
  );
};

export default Response;
