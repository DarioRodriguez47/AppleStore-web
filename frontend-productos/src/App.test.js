import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './cart/context/CartContext';

test('renders the Apple Store landing page by default', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
  expect(screen.getByText(/Súper\. Mega\. Rápido\./i)).toBeInTheDocument();
});
