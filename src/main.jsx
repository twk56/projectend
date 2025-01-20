import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  shadows: Array(25).fill('0px 4px 10px rgba(0, 0, 0, 0.2)'), // เพิ่มค่า shadows
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* รีเซ็ต CSS ให้สวยงามตามมาตรฐาน MUI */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
