import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    
    primary: {
      light: '#80D197',
      main: '#589167',
    },
    
    secondary: {
      main: '#A64452',
    },
    
    background: {
      default: '#f5f5f5', // Цвет фона
      paper: '#ffffff',  // Цвет карточек
    },
    
    text: {
      primary: '#000000',
      secondary: '#555555',
    },

    button: {
     main: '#497756',
    }
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);