// models/Product.js

const mongoose = require('mongoose');

const Review = new mongoose.Schema({
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
  productName: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: String,
  productDescription: String,
  department: String,
  productId: {type: Number},
  status: {
    type: String,
    enum: ['accept', 'reject', 'pending'],
    default: 'pending'
  },
  adminId: {type: mongoose.Schema.ObjectId, ref: 'User'}
});



module.exports = mongoose.model('Review', Review);
