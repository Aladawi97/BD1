import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ImagePreview = styled('img')({
  maxWidth: '100%',
  height: '200px',
  objectFit: 'contain',
  marginTop: '10px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
});

const AdminOffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountPercentage: '',
    discountedPrice: '',
    stock: '',
    timeLeft: '',
    image_url: '',
    product_id: ''
  });
  const [products, setProducts] = useState([]); // This would be populated from your API

  useEffect(() => {
    // Here you would fetch your offers from the backend
    // For now using sample data
    setOffers([
      {
        id: 1,
        name: "Premium Headphones",
        description: "High-quality wireless headphones",
        originalPrice: 199.99,
        discountPercentage: 25,
        discountedPrice: 149.99,
        stock: 10,
        timeLeft: "2 days",
        image_url: "https://example.com/headphones.jpg",
        product_id: 1
      }
    ]);

    // Here you would fetch your products list
    setProducts([
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Automatically calculate discounted price when original price or discount changes
      if (name === 'originalPrice' || name === 'discountPercentage') {
        const originalPrice = parseFloat(name === 'originalPrice' ? value : prev.originalPrice) || 0;
        const discount = parseFloat(name === 'discountPercentage' ? value : prev.discountPercentage) || 0;
        const discountedPrice = originalPrice * (1 - discount / 100);
        return {
          ...newData,
          discountedPrice: discountedPrice.toFixed(2)
        };
      }
      
      return newData;
    });
  };

  const handleSubmit = () => {
    if (selectedOffer) {
      // Update existing offer
      setOffers(prev => prev.map(offer => 
        offer.id === selectedOffer.id ? { ...formData, id: offer.id } : offer
      ));
    } else {
      // Add new offer
      setOffers(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (offerId) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setFormData(offer);
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setSelectedOffer(null);
    setFormData({
      name: '',
      description: '',
      originalPrice: '',
      discountPercentage: '',
      discountedPrice: '',
      stock: '',
      timeLeft: '',
      image_url: '',
      product_id: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOffer(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Offers Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        sx={{ mb: 3 }}
      >
        Add New Offer
      </Button>

      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Original Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Time Left</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>{offer.name}</TableCell>
                <TableCell>${offer.originalPrice}</TableCell>
                <TableCell>{offer.discountPercentage}%</TableCell>
                <TableCell>${offer.discountedPrice}</TableCell>
                <TableCell>{offer.stock}</TableCell>
                <TableCell>{offer.timeLeft}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(offer)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(offer.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOffer ? 'Edit Offer' : 'Add New Offer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid columns={12}>
              <FormControl fullWidth>
                <InputLabel>Select Product</InputLabel>
                <Select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  label="Select Product"
                >
                  {products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid columns={12}>
              <TextField
                fullWidth
                label="Offer Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Original Price"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Discount Percentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Final Price"
                name="discountedPrice"
                value={formData.discountedPrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                disabled
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Time Left (e.g., '2 days')"
                name="timeLeft"
                value={formData.timeLeft}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid columns={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
              />
              {formData.image_url && (
                <ImagePreview src={formData.image_url} alt="Product preview" />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedOffer ? 'Update' : 'Add'} Offer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOffersManagement; 