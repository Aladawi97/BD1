import React, { useState } from 'react';
import './Cart.css';
import { IconButton, Box, TextField, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Snackbar from '@mui/material/Snackbar';

const Cart = ({ cartItems, onClose, updateCartItem, removeFromCart, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateCartItem({ ...item, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (item) => {
    if (removeFromCart) {
      removeFromCart(item);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setPhone(value);
    if (value) {
      setPhoneError(''); // Clear error when user starts typing
    }
  };

  const handleSendOrder = async () => {
    setSendResult(null); // Clear previous server/success messages
    if (!phone) {
      setPhoneError('Please enter your phone number to proceed.');
      return; // Stop the function
    }
    setPhoneError(''); // Ensure error is cleared if phone is provided

    setSending(true);
    try {
      const response = await fetch('/api/orders/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: user.full_name || user.name,
            email: user.email,
            phone: phone
          },
          items: cartItems
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send order');
      }
      setSendResult({ success: true, message: 'Order sent successfully!' });
      setSnackbarMsg('تم إرسال الطلب بنجاح');
      setSnackbarOpen(true);
    } catch (err) {
      setSendResult({ success: false, message: err.message });
      setSnackbarMsg('حدث خطأ أثناء إرسال الطلب');
      setSnackbarOpen(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="cart-container">
      <IconButton
        aria-label="Close cart"
        onClick={onClose}
        style={{ position: 'absolute', top: 12, right: 12, background: '#f5f5f5', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 40, height: 40, zIndex: 2 }}
        size="large"
      >
        <span style={{ fontSize: 28, fontWeight: 'bold', color: '#e41e31' }}>×</span>
      </IconButton>
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-price">Price: {item.price} JD</span>
            </div>
            <Box className="quantity-controls">
              <IconButton 
                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                inputProps={{ 
                  min: 1, 
                  max: item.stock,
                  style: { width: '50px', textAlign: 'center' }
                }}
                variant="outlined"
                size="small"
              />
              <IconButton 
                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                size="small"
              >
                <AddIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleRemoveItem(item)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </div>
        ))}
      </div>
      
      <div className="cart-total">
        <strong>Total Amount: {calculateTotal()} JD</strong>
      </div>

      <TextField
        fullWidth
        required
        label="Phone Number"
        variant="outlined"
        type="tel" // For numeric keypad on mobile
        value={phone}
        onChange={handlePhoneChange}
        error={!!phoneError}
        helperText={phoneError || "Please enter numbers only."}
        sx={{ mt: 2, mb: 2 }}
      />

      <button className="save-button" onClick={handleSendOrder} disabled={sending || cartItems.length === 0}>
        {sending ? 'Sending...' : 'Send Order'}
      </button>
      {sendResult && (
        <Alert severity={sendResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
          {sendResult.message}
        </Alert>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default Cart; 