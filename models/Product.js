const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Electronics', 'Home', 'Sports']
  },
  subCategory: {
    type: String
  },
  brand: {
    type: String
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  featured: {
    type: Boolean,
    default: false
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add pagination plugin
productSchema.plugin(mongoosePaginate);

// Calculate discount price
productSchema.virtual('discountPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ salesCount: -1 });

module.exports = mongoose.model('Product', productSchema);