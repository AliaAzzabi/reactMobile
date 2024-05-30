import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import { AuthContextProvider } from './context/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
  <ThemeProvider>
    <AuthContextProvider> 
      <App />
    </AuthContextProvider>
  </ThemeProvider>
</Router>
);
