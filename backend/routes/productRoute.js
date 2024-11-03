const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Định tuyến lấy danh sách mainCategory
router.get('/main-categories', productController.getMainCategories);

// Route để lấy danh sách subCategory
router.get('/sub-categories', productController.getSubCategories);

// Route để lấy danh sách subSubCategory theo subCategory.name
// router.get('/sub-categories/:subCategoryName/sub-subcategories', productController.getSubSubCategories);

// Route để lấy subSubCategory dựa trên mainCategory và subCategoryName
router.get('/:mainCategory/:subCategoryName/sub-subcategories', productController.getSubSubCategories);

// Route để lấy danh sách sản phẩm dựa trên mainCategory, subCategoryName, và subSubCategory
router.get('/:mainCategory/:subCategoryName/:subSubCategory/products', productController.getProductsByCategory);

// Định tuyến lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Định tuyến lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Route để tạo nhiều sản phẩm
router.post('/multiple', productController.createMultipleProducts);

// Định tuyến tạo sản phẩm mới
router.post('/', productController.createProduct);

// Định tuyến cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Định tuyến xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;
