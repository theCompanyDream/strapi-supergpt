import React, { useState, useEffect } from 'react';
import { Button } from '@strapi/design-system';
import { Star } from '@strapi/icons';

const GitHubButton = () => {
  const [stars, setStars] = useState(1);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/theCompanyDream/strapi-supergpt');
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching the star count from GitHub:', error);
      }
    };

    fetchStars();
  }, []);

  return (
      <CustomButton
        as="a"
        href="https://github.com/theCompanyDream/strapi-supergpt"
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<Star />}
      >
        {`${stars}`}
      </CustomButton>
  );
};

export default GitHubButton;

const CustomButton = styled(GitHubButton)`
`