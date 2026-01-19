  import './css/index.css'
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App.tsx'
  import { BrowserRouter } from 'react-router-dom'
  import { CartProvider } from './context/CartContext.tsx'
  import { QueryClientProvider } from '@tanstack/react-query'
  import { getQueryClient } from './lib/react-query.ts'
import ThemeInit from './hooks/ThemeInit.tsx'


  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={getQueryClient()}>
        <BrowserRouter>
          <CartProvider>
            <ThemeInit></ThemeInit>
            <App />
          </CartProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
