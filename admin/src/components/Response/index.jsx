import React from 'react';
import { Box, Typography } from "@strapi/design-system";
import DOMPurify from 'dompurify';


const Response = ({ children }) => {
    const cleanHtml = DOMPurify.sanitize(children.message);
    const htmlContent = {
        __html: cleanHtml
    };

    return (
        <Box>
            {/* Safely render HTML content */}
            {children.name}: <span dangerouslySetInnerHTML={htmlContent} />
        </Box>
    );
};

export default Response;
