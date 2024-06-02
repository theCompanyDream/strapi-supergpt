import React from "react";
import { useIntl } from "react-intl";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  Typography,
} from "@strapi/design-system";

const Help = ({ isOpen, onClose }) => {
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
              id="title"
            >
              Help
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Typography variant="omega">
              {formatMessage({id: "strapi-supergpt.helpModal.promptUse"})}
            </Typography>
            <br />
            <br />
            <Typography
              variant="omega"
              dangerouslySetInnerHTML={{ __html: formatMessage({id: "strapi-supergpt.helpModal.promptList"})}}
            />
            <br />
            <Typography variant="omega">
              <a href="https://prompts.chat" target="_blank">
                {formatMessage({id: "strapi-supergpt.helpModal.clickHere"})}
              </a>{" "}
              {formatMessage({id: "strapi-supergpt.helpModal.morePrompts"})}
            </Typography>
          </ModalBody>
        </ModalLayout>
      )}
    </>
  );
};

export default Help;
