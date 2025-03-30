const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/categories', productController.getCategories);
router.get('/categories/:category/subcategories', productController.getSubCategories);
router.get('/brands', productController.getBrands);

module.exports = router;