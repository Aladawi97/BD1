// src/components/AddProduct.jsx
import React, { useState } from 'react';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product added:', product);
    // هنا يمكنك إرسال بيانات المنتج إلى الخادم باستخدام `fetch` أو `axios`
  };

  return (
    <div>
      <h2>إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>اسم المنتج:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>وصف المنتج:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>السعر:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>صورة المنتج:</label>
          <input
            type="file"
            name="image"
            onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
          />
        </div>
        <button type="submit">إضافة المنتج</button>
      </form>
    </div>
  );
}

export default AddProduct;
