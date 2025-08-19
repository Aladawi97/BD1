import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  styled,
  Button,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Box,
  Avatar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import Cart from './Cart';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled('header')({
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
});

const HeaderContent = styled('div')(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '0.5rem 1rem',
  }
}));

const Logo = styled('div')({
  '& h1': {
    margin: 0,
    fontSize: '1.8rem',
    color: '#333',
    cursor: 'pointer',
  },
  '& img': {
    height: '60px',
    width: 'auto',
    cursor: 'pointer',
    objectFit: 'contain',
    '@media (max-width: 768px)': {
      height: '50px',
    }
  }
});

const Nav = styled('nav')(({ theme }) => ({
  '& ul': {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const MobileNav = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }
}));

const NavButton = styled(Button)(({ active }) => ({
  color: '#333',
  '&:hover': {
    color: '#007bff',
  },
  ...(active && {
    color: '#007bff',
    fontWeight: 'bold',
  }),
  '&.special-offers': {
    color: '#e41e31',
    '&:hover': {
      color: '#ff1744',
    },
    ...(active && {
      color: '#ff1744',
      fontWeight: 'bold',
    }),
  }
}));

const CartDrawerContent = styled('div')({
  width: '100%',
  maxWidth: '400px',
  padding: '1rem',
});

const MobileDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: '250px',
    padding: '1rem',
  }
});

const MobileMenuItem = styled(ListItem)(({ active }) => ({
  color: active ? '#007bff' : '#333',
  fontWeight: active ? 'bold' : 'normal',
  '&:hover': {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  '&.special-offers': {
    color: active ? '#ff1744' : '#e41e31',
  }
}));

const Header = ({ 
  selectedProducts, 
  removeFromCart, 
  updateCartItem, 
  isCartOpen, 
  setIsCartOpen,
  onNavigate,
  currentPage,
  user,
  onLogout
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      setSuggestions(
        allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  }, [search, allProducts]);

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleMobileMenuClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo>
            <img 
              src={require('../images/Logo.png')} 
              alt="Store Logo" 
              onClick={() => onNavigate('/')}
            />
          </Logo>
          
          <Nav>
            <ul>
              <li>
                <NavButton 
                  {...(currentPage === 'home' ? {active: true} : {})}
                  onClick={() => onNavigate('/')}
                >
                  Home
                </NavButton>
              </li>
              <li>
                <NavButton 
                  {...(currentPage === 'products' ? {active: true} : {})}
                  onClick={() => onNavigate('/products')}
                >
                  Products
                </NavButton>
              </li>
              <li>
                <NavButton 
                  {...(currentPage === 'offers' ? {active: true} : {})}
                  className="special-offers"
                  onClick={() => onNavigate('offers')}
                >
                  Special Offers
                </NavButton>
              </li>
            </ul>
          </Nav>
          <div style={{ marginLeft: '1rem', minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                navigate(`/products${e.target.value.trim() ? `?search=${encodeURIComponent(e.target.value)}` : ''}`);
              }}
              placeholder="Search for products..."
              style={{
                width: '220px',
                padding: '8px 36px 8px 12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            />
            <SearchIcon style={{ position: 'absolute', right: 8, color: '#888' }} />
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                zIndex: 2000
              }}>
                {suggestions.map(s => (
                  <div
                    key={s.id}
                    style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
                    onClick={() => handleSuggestionClick(s.name)}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton className="cart-button" onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            {user && (
              <>
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#007bff' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </Menu>
              </>
            )}
            {!user && (
              <Button variant="contained" color="primary" onClick={() => onNavigate('login')}>
                Login
              </Button>
            )}
          </Box>
          <MobileNav>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </MobileNav>
        </HeaderContent>
      </HeaderContainer>

      <MobileDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List>
          <MobileMenuItem 
            button 
            {...(currentPage === 'home' ? {active: true} : {})}
            onClick={() => handleMobileMenuClick('home')}
          >
            <ListItemText primary="Home" />
          </MobileMenuItem>
          <MobileMenuItem 
            button 
            {...(currentPage === 'products' ? {active: true} : {})}
            onClick={() => handleMobileMenuClick('products')}
          >
            <ListItemText primary="Products" />
          </MobileMenuItem>
          <MobileMenuItem 
            button 
            {...(currentPage === 'offers' ? {active: true} : {}) && {className: 'special-offers'}}
            onClick={() => handleMobileMenuClick('offers')}
          >
            <ListItemText primary="Special Offers" />
          </MobileMenuItem>
        </List>
      </MobileDrawer>
    </>
  );
};

export default Header; 