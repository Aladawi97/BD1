import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductImage = styled('img')({
  width: '100%',
  maxHeight: '300px',
  objectFit: 'contain',
  marginBottom: '1rem',
});

const QuantityControl = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  margin: '1rem 0',
  '& .MuiTextField-root': {
    width: '70px',
  }
});

const ProductDetails = styled(Box)({
  marginTop: '1rem',
  '& > div': {
    marginBottom: '0.5rem',
  }
});

const ProductModal = ({ open, onClose, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    onClose();
    setQuantity(1);
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{product.name}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <ProductImage src={product.image_url} alt={product.name} />
        <ProductDetails>
          <Typography variant="body1" gutterBottom>
            {product.description}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${Number(product.price).toFixed(2)}
          </Typography>
          {product.manufacturer && (
            <Typography variant="body2" color="text.secondary">
              Manufacturer: {product.manufacturer}
            </Typography>
          )}
          {product.weight > 0 && (
            <Typography variant="body2" color="text.secondary">
              Weight: {product.weight} kg
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Available: {product.stock} pieces
          </Typography>
          <QuantityControl>
            <IconButton 
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: product.stock }}
              variant="outlined"
              size="small"
            />
            <IconButton 
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <AddIcon />
            </IconButton>
          </QuantityControl>
        </ProductDetails>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleAddToCart}
          variant="contained" 
          color="primary"
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal; 