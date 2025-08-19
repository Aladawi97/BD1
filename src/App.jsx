import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Products from './components/Products';
import Footer from './components/Footer';
import Cart from './components/Cart';
import SpecialOffers from './components/SpecialOffers';
import Login from './components/Login';
import Register from './components/Register';
import Hero from './components/Hero';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

function App() {
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
    setSelectedProducts([]);
    navigate('/login');
  };
  
  const addToCart = (product) => {
    if (!user) {
      alert('Please log in first');
      navigate('/login');
      return;
    }
    setSelectedProducts(prevProducts => {
      const existingProduct = prevProducts.find(p => p.id === product.id);
      if (existingProduct) {
        setSnackbarMsg('تم تحديث الكمية في السلة');
        setSnackbarOpen(true);
        return prevProducts.map(p => 
          p.id === product.id 
            ? { ...p, quantity: (p.quantity || 1) + (product.quantity || 1) } 
            : p
        );
      }
      setSnackbarMsg('تمت الإضافة إلى السلة بنجاح');
      setSnackbarOpen(true);
      return [...prevProducts, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productToRemove) => {
    if (!productToRemove) return;
    setSelectedProducts(prevProducts => 
      prevProducts.filter(product => product.id !== productToRemove.id)
    );
  };

  const updateCartItem = (updatedItem) => {
    if (!updatedItem) return;
    setSelectedProducts(prevProducts => 
      prevProducts.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header 
        selectedProducts={selectedProducts}
        removeFromCart={removeFromCart}
        updateCartItem={updateCartItem}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<><Hero /><main><Products addToCart={addToCart} selectedProducts={selectedProducts} updateCartItem={updateCartItem} removeFromCart={removeFromCart} /></main></>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/special-offers" element={<SpecialOffers addToCart={addToCart} selectedProducts={selectedProducts} setIsCartOpen={setIsCartOpen} />} />
        <Route path="/offers" element={<SpecialOffers addToCart={addToCart} selectedProducts={selectedProducts} setIsCartOpen={setIsCartOpen} />} />
        <Route path="/products" element={<Products addToCart={addToCart} selectedProducts={selectedProducts} updateCartItem={updateCartItem} removeFromCart={removeFromCart} />} />
      </Routes>
      <Footer />
      {isCartOpen && user && (
        <div className="cart-overlay" onClick={handleCloseCart}>
          <div onClick={e => e.stopPropagation()}>
            <Cart 
              cartItems={selectedProducts}
              onClose={handleCloseCart}
              updateCartItem={updateCartItem}
              removeFromCart={removeFromCart}
              user={user}
            />
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper; 