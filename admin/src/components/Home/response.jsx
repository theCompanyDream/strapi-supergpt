import React from 'react';
import { Box, Divider, Typography, Button } from '@strapi/design-system';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  pre {
    position: relative;
  }
`;

const CopyButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const CodeBlock = ({ language, value }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  return (
    <Box position="relative">
      <SyntaxHighlighter language={language} style={oneDark}>
        {value}
      </SyntaxHighlighter>
      <CopyButton variant="tertiary" onClick={copyToClipboard}>
        Copy Code
      </CopyButton>
    </Box>
  );
};

const Response = ({ children }) => {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const messageClass = children.name === 'chatgpt' ? 'chatgpt-message' : 'user-message';

  return (
    <ChatContainer>
      <Typography variant="omega" as="p" className={messageClass}>
        {children.name}:
        <ReactMarkdown components={components}>{children.message}</ReactMarkdown>
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
