import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  IconButton,
  Box,
  styled,
  CircularProgress
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { fetchProducts } from '../config/api';
import ProductModal from './ProductModal';
import { useLocation } from 'react-router-dom';

const ProductsContainer = styled('div')({
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
});

const ProductsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: '2rem',
  marginTop: '2rem',
  [theme.breakpoints.up('xs')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem'
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiCardContent-root': {
      padding: '8px',
    },
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
    },
    '& .MuiButton-root': {
      padding: '4px 8px',
      fontSize: '0.8rem',
    }
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: '250px',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  margin: '1rem',
  [theme.breakpoints.down('sm')]: {
    height: '180px',
    margin: '0.5rem',
  }
}));

const ProductDetails = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const ProductDescription = styled(Typography)(({ theme }) => ({
  marginBottom: '1rem',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
});

const Products = ({ selectedProducts, addToCart, updateCartItem, removeFromCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // استخراج قيمة البحث من الرابط
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      const productsWithDefaults = response.data.map(product => ({
        ...product,
        price: product.price || 0,
        weight: product.weight || null,
        manufacturer: product.manufacturer || null,
        stock: product.stock || 0,
        category_name: product.category_name || null
      }));
      setProducts(productsWithDefaults);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    const existingCartItem = selectedProducts.find(p => p.id === product.id);
    if (existingCartItem) {
      setSelectedProduct(existingCartItem);
    } else {
      setSelectedProduct(product);
    }
    setIsModalOpen(true);
  };

  const handleAddToCart = (productWithQuantity) => {
    const existingCartItem = selectedProducts.find(p => p.id === productWithQuantity.id);
    if (existingCartItem) {
      updateCartItem(productWithQuantity);
    } else {
      addToCart(productWithQuantity);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  let filteredProducts = products;
  if (searchParam && searchParam.trim() !== "") {
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchParam.toLowerCase()));
  }

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} thickness={5} color="primary" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Typography color="error">{error}</Typography>
      </LoadingContainer>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <ProductsContainer>
        <Typography variant="h6" align="center">
          No products available
        </Typography>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <Typography variant="h3" component="h2" align="center" gutterBottom>
        Our Products
      </Typography>
      <ProductsGrid>
        {filteredProducts.map(product => {
          const cartItem = selectedProducts.find(p => p.id === product.id);
          return (
            <ProductCard key={product.id} elevation={3}>
              <ProductImage
                component="img"
                height="250"
                image={product.image_url || ''}
                alt={product.name || 'Product image'}
                sx={{
                  objectFit: 'contain',
                  width: 'auto',
                  margin: '1rem'
                }}
              />
              <ProductDetails>
                <Typography variant="h6" component="h3" gutterBottom>
                  {product.name || 'Unnamed Product'}
                </Typography>
                <ProductDescription variant="body2" color="text.secondary">
                  {product.description || 'No description available'}
                </ProductDescription>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {product.weight > 0 && (
                    <Typography variant="body2">
                      Weight: {product.weight} kg
                    </Typography>
                  )}
                  {product.manufacturer && product.manufacturer.trim() !== '' && (
                    <Typography variant="body2">
                      Manufacturer: {product.manufacturer}
                    </Typography>
                  )}
                  {product.category_name && product.category_name.trim() !== '' && (
                    <Typography variant="body2">
                      Category: {product.category_name}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleProductClick(product)}
                    startIcon={<AddShoppingCartIcon />}
                    disabled={product.stock === 0}
                    fullWidth
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <IconButton 
                    color="secondary" 
                    aria-label="add to favorites"
                    sx={{ ml: 1 }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
              </ProductDetails>
            </ProductCard>
          );
        })}
      </ProductsGrid>
      <ProductModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </ProductsContainer>
  );
};

export default Products; 