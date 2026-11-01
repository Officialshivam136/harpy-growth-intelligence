import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BrandProvider } from './context/BrandContext';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <BrandProvider>
        <AppRoutes />
      </BrandProvider>
    </BrowserRouter>
  );
}

export default App;

