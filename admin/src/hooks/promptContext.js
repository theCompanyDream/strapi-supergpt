import React, { createContext, useContext, useState } from 'react';

const PromptContext = createContext();

export const usePromptContext = () => useContext(PromptContext);

export const PromptProvider = ({ children }) => {
  const [prompts, setPrompts] = useState([]);

  const registerPrompt = (prompt) => {
    setPrompts((prevPrompts) => [...prevPrompts, prompt]);
  };

  const clearPrompts = () => setPrompts([]);

  return (
    <PromptContext.Provider value={{ prompts, registerPrompt, clearPrompts }}>
      {children}
    </PromptContext.Provider>
  );
};
