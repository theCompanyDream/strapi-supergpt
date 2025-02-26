import React from 'react';
import { Box, Typography, Button } from '@strapi/design-system';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


function stripMarkdown(markdownText) {
  return markdownText
    // Remove code blocks (triple backticks)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code (single backticks)
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Replace links with their text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove remaining markdown symbols (headings, emphasis, lists, etc.)
    .replace(/[#>*_~\-]/g, '')
    .trim();
}

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

const MarkDownBox = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  padding: 2rem;
`

const CopyButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const CodeBlock = ({ inline, className, children, ...props }) => {
  const codeString = String(children).replace(/\n$/, '');
  // Extract language from className (e.g., "language-js")
  const languageMatch = /language-(\w+)/.exec(className || '');
  const language = languageMatch ? languageMatch[1] : '';

  const copyToClipboard = () => {
    if (language === 'markdown') {
      navigator.clipboard.writeText(stripMarkdown(codeString)).then(() => {
        alert('Code copied to clipboard!');
      });
      return;
    }
    navigator.clipboard.writeText(codeString).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  if (!inline && language === 'markdown') {
    return (
      <MarkDownBox position="relative">
        <ReactMarkdown>{codeString}</ReactMarkdown>
        <CopyButton variant="tertiary" onClick={copyToClipboard}>
          Copy
        </CopyButton>
      </MarkDownBox>
    );
  }

  if (!inline && language) {
    return (
      <Box position="relative">
        <SyntaxHighlighter language={language} style={oneDark} {...props}>
          {codeString}
        </SyntaxHighlighter>
        <CopyButton variant="tertiary" onClick={copyToClipboard}>
          Copy
        </CopyButton>
      </Box>
    );
  }
  return <code className={className} {...props}>{children}</code>;
};

const Response = ({ children }) => {
  return (
    <ChatContainer>
      <Typography variant="omega" as="div">
        <ReactMarkdown
          components={{
            code: CodeBlock, // our custom code block renderer
          }}
        >
          {children}
        </ReactMarkdown>
      </Typography>
    </ChatContainer>
  );
};

export default Response;
