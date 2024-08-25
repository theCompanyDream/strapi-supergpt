import React, { useState } from 'react';
import {
  Box,
  Typography,
  SimpleMenu,
  MenuItem,
  Tab
} from '@strapi/design-system';
import { More } from '@strapi/icons';

const CustomTab = ({ children, onRename, onSave, onDelete, ...props }) => {
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

  const handleSave = () => {
    if (window.confirm('Are you sure you want to save this conversation?')) {
      onSave();
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
    <Tab {...props}>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box alignItems="left">
          <SimpleMenu label={<More />} onClick={handleClick} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleRename}>Rename</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </SimpleMenu>
        </Box>
        <Typography variant="omega">{name}</Typography>
      </Box>
    </Tab>
  );
};

export default CustomTab;
