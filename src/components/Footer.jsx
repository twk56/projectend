import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000',
  textAlign: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const Footer = ({ role }) => (
  <FooterContainer>
    <Typography variant="body2">ผู้ใช้: {role}</Typography>
  </FooterContainer>
);

export default Footer;
