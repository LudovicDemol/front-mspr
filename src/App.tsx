import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Auth0Provider } from '@auth0/auth0-react';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { CartIcon } from './components/CartIcon';
import { LoginButton } from './components/LoginButton';
import { ProfileButton } from './components/ProfileButton';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OrderDetails } from './components/OrderDetails';

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email read:users read:roles'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <CartProvider>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  PayeTonKaWa
                </Link>
              </Typography>
              <CartIcon />
              <ProfileButton />
              <LoginButton />
            </Toolbar>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route 
                path="/order/:id" 
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Router>
      </CartProvider>
    </Auth0Provider>
  );
}

export default App;