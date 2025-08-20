import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bd1-bacend.onrender.com/api',  // تم التعديل هنا
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProducts = () => api.get('/products');
export const fetchCategories = () => api.get('/categories');
export const fetchUsers = () => api.get('/users');
export const fetchOrders = () => api.get('/orders');

export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getProductsByCategory = (categoryId) => api.get(`/products/category/${categoryId}`);

// Category operations
export const createCategory = (categoryData) => api.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export default api; 