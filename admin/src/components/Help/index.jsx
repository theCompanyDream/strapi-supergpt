import React from "react";
import { useIntl } from "react-intl";
import {
  Modal,
  Typography,
  Button,
  LinkButton
} from "@strapi/design-system";
import { Cog } from "@strapi/icons";

const Help = () => {
  const { formatMessage } = useIntl();
  return (
    <Modal.Root labelledBy="title">
      <Modal.Trigger>
        <Button
          variant="secondary"
          startIcon={<Cog />}
        >
        {formatMessage({ id: "homePage.API_Integration.button" })}
        </Button>
      </Modal.Trigger>
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
        <Modal.Body>
          <Typography variant="omega">
            {formatMessage({id: "helpModal.promptUse"})}
          </Typography>
          <br />
          <br />
          <Typography
            variant="omega"
            dangerouslySetInnerHTML={{ __html: formatMessage({id: "helpModal.promptList"})}}
          />

        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Close</Button>
          </Modal.Close>
          <Typography variant="omega">
            {formatMessage({id: "helpModal.morePrompts"})}
            <LinkButton href="https://prompts.chat">{formatMessage({id: "helpModal.clickHere"})}</LinkButton>
          </Typography>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default Help;