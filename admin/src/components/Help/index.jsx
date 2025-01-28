import React from "react";
import { useIntl } from "react-intl";
import {
  Modal,
  Typography,
} from "@strapi/design-system";

const Help = ({ isOpen, onClose }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      {isOpen && (
        <Modal.Root onClose={() => onClose(!isOpen)} labelledBy="title">
          <Modal.Content>
          <Modal.Header>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              Help
            </Typography>
          </Modal.Header>
            <Typography variant="omega">
              {formatMessage({id: "helpModal.promptUse"})}
            </Typography>
            <br />
            <br />
            <Typography
              variant="omega"
              dangerouslySetInnerHTML={{ __html: formatMessage({id: "helpModal.promptList"})}}
            />
            <br />
            <Typography variant="omega">
              <a href="https://prompts.chat" target="_blank">
                {formatMessage({id: "helpModal.clickHere"})}
              </a>{" "}
              {formatMessage({id: "helpModal.morePrompts"})}
            </Typography>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
};

export default Help;
