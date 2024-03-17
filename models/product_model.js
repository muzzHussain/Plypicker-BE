// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: String,
  productDescription: String,
  department: String,
  id: {
    type: String,
    unique: true,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
