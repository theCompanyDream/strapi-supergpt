import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Divider, Typography, Button } from '@strapi/design-system';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatContainer = styled(Box)`
  padding: 2.5rem;
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
  const cleanHtml = DOMPurify.sanitize(children.message);

  const htmlContent = cleanHtml.replace(
    /<code class="language-([a-z]+)">([\s\S]*?)<\/code>/g,
    (match, language, code) => {
      return `<div class="code-block" data-language="${language}">${code}</div>`;
    }
  );

  const renderHtmlContent = () => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    const codeBlocks = div.querySelectorAll('.code-block');
    codeBlocks.forEach((block) => {
      const language = block.getAttribute('data-language');
      const code = block.innerHTML;

      const container = document.createElement('div');
      block.replaceWith(container);
      ReactDOM.render(<CodeBlock language={language} value={code} />, container);
    });

    return <span dangerouslySetInnerHTML={{ __html: div.innerHTML }} />;
  };

  const messageClass = children.name === 'chatgpt' ? 'chatgpt-message' : 'user-message';

  return (
    <ChatContainer>
      <Typography variant="omega" as="p" className={messageClass}>
        {children.name}: <span dangerouslySetInnerHTML={{ __html:renderHtmlContent}} />
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
