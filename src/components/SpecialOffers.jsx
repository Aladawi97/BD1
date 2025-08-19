import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Box,
  Chip,
  styled,
  CircularProgress
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimerIcon from '@mui/icons-material/Timer';
import SearchIcon from '@mui/icons-material/Search';

const OfferCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  position: 'relative',
  overflow: 'visible',
  borderRadius: '16px',
  backgroundColor: '#fff'
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  right: -15,
  backgroundColor: '#e41e31',
  color: 'white',
  borderRadius: '50%',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  zIndex: 1,
  boxShadow: '0 4px 8px rgba(228,30,49,0.3)',
  border: '2px solid white'
}));

const OfferImage = styled(CardMedia)({
  height: '200px',
  width: '100%',
  backgroundSize: 'contain',
  backgroundColor: '#f8f9fa',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    width: 'auto',
    height: 'auto'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px'
  }
});

const OfferContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  backgroundColor: '#fff',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px'
});

const PriceContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: 'auto',
  padding: '12px 0'
});

const OldPrice = styled(Typography)({
  textDecoration: 'line-through',
  color: '#999',
  fontStyle: 'italic'
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
});

const StyledChip = styled(Chip)({
  borderRadius: '8px',
  fontWeight: '500',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
});

const SpecialOffers = ({ addToCart, setIsCartOpen }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      console.log('Fetching offers...');
      const response = await fetch('http://localhost:5000/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      console.log('Received offers:', data);
      setOffers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers. Please try again later.');
      setLoading(false);
    }
  };

  // فلترة العروض حسب البحث
  const filteredOffers = search.trim() === "" ? offers : offers.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddToCart = (offer) => {
    addToCart({
      id: offer.product_id,
      name: offer.name,
      price: offer.discounted_price,
      image_url: offer.image_url,
      quantity: 1,
      stock: offer.stock
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Special Offers
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        Don't miss out on these amazing deals!
      </Typography>
      {/* شريط البحث */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for offers..."
            style={{
              width: '100%',
              padding: '10px 36px 10px 12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          />
          <SearchIcon style={{ position: 'absolute', right: 8, top: 10, color: '#888' }} />
        </Box>
      </Box>
      {filteredOffers.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No special offers available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {filteredOffers.map((offer) => (
            <Grid columns={12} key={offer.id}>
              <OfferCard>
                <DiscountBadge>
                  -{parseInt(offer.discount_percentage)}%
                </DiscountBadge>
                
                <OfferImage
                  component="div"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.name}
                    style={{
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </OfferImage>
                
                <OfferContent>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {offer.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                    {offer.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <StyledChip 
                      icon={<TimerIcon />} 
                      label={`Ends in ${offer.time_left}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <StyledChip 
                      icon={<LocalOfferIcon />} 
                      label={`${offer.stock} left`}
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <PriceContainer>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      ${offer.discounted_price}
                    </Typography>
                    <OldPrice variant="body1">
                      ${offer.original_price}
                    </OldPrice>
                  </PriceContainer>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    fullWidth
                    sx={{ 
                      mt: 2,
                      borderRadius: '8px',
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }
                    }}
                    onClick={() => handleAddToCart(offer)}
                    disabled={offer.stock <= 0}
                  >
                    {offer.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </OfferContent>
              </OfferCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SpecialOffers; 