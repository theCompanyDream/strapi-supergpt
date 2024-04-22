import React from 'react';
import { Box, Divider } from "@strapi/design-system";
import DOMPurify from 'dompurify';

const Response = ({ children }) => {
    const cleanHtml = DOMPurify.sanitize(children.message);
    const htmlContent = {
        __html: cleanHtml
    };

    return (
        <Box class="chat-container">
            {/* Safely render HTML content */}
            {children.name}: <span dangerouslySetInnerHTML={htmlContent} />
            <br />
            <br />
            {children.name == "chatgpt" && <Box paddingTop={2} paddingBottom={4}>
                <Divider />
            </Box>}
        </Box>
    );
};

export default Response;
