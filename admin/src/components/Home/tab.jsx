import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  SimpleMenu,
  MenuItem,
  Tabs
} from '@strapi/design-system';
import { More } from '@strapi/icons';

const CustomTab = ({ children, onRename, onDelete, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(children);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRename = () => {
    const newName = prompt('Enter new tab name:', name);
    if (newName) {
      setName(newName);
      onRename(newName);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tab?')) {
      onDelete();
    }
    handleClose();
  };

  return (
    <Tabs.Trigger {...props}>
      <Box display="flex" width="100%">
        <StyledMenu side="top" align="center" label={<More />} onClick={handleClick} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleRename}>Rename</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </StyledMenu>
        <Typography variant="omega">{name}</Typography>
      </Box>
    </Tabs.Trigger>
  );
};

export default CustomTab;

const StyledMenu = styled(SimpleMenu)`
  z-index: 5;
  position: "relative";
`