const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.color) query.colors = req.query.color;
  if (req.query.size) query.sizes = req.query.size;
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Build sort
  let sort = {};
  if (req.query.sort) {
    switch(req.query.sort) {
      case 'price_asc': sort = { price: 1 }; break;
      case 'price_desc': sort = { price: -1 }; break;
      case 'rating': sort = { rating: -1 }; break;
      case 'newest': sort = { createdAt: -1 }; break;
    }
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const products = await Product.find({ featured: true }).limit(limit);
  res.json(products);
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const limit = parseInt(req.query.limit) || 4;
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category
  }).limit(limit);

  res.json(relatedProducts);
});

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc    Get subcategories for a category
// @route   GET /api/products/categories/:category/subcategories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await Product.distinct('subCategory', {
    category: req.params.category
  });
  res.json(subCategories.filter(Boolean)); // Remove null/undefined
});

// @desc    Get all brands
// @route   GET /api/products/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands.filter(Boolean)); // Remove null/undefined
});