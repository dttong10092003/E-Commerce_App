const Product = require('../models/productModel');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};

// Hàm tạo nhiều sản phẩm
exports.createMultipleProducts = async (req, res) => {
    try {
        const products = req.body;
        const savedProducts = await Product.insertMany(products);
        res.status(201).json(savedProducts);
    } catch (error) {
        console.error('Error creating multiple products:', error);
        res.status(400).json({ message: 'Error creating multiple products', error });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Lấy danh sách các mainCategory
exports.getMainCategories = async (req, res) => {
    try {
        const mainCategories = await Product.distinct('mainCategory');
        res.status(200).json(mainCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main categories' });
    }
};

// Lấy danh sách các subCategory (distinct name và image)

exports.getSubCategories = async (req, res) => {
    try {
        const subCategories = await Product.distinct("subCategory");
        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
};

// Lấy danh sách subSubCategory theo subCategory.name
// exports.getSubSubCategories = async (req, res) => {
//     try {
//         const { subCategoryName } = req.params;
//         const subSubCategories = await Product.distinct("subSubCategory", { "subCategory.name": subCategoryName });
//         res.status(200).json(subSubCategories);
//     } catch (error) {
//         console.error('Error fetching subSubCategories:', error);
//         res.status(500).json({ message: 'Error fetching subSubCategories', error: error.message });
//     }
// };

exports.getSubSubCategories = async (req, res) => {
    try {
        const { mainCategory, subCategoryName } = req.params;

        // Xây dựng điều kiện lọc dựa trên mainCategory
        const filter = { "subCategory.name": subCategoryName };
        if (mainCategory !== 'All') {
            filter.mainCategory = mainCategory; // Chỉ thêm mainCategory khi nó không phải là "All"
        }

        // Lấy danh sách subSubCategory dựa trên filter
        const subSubCategories = await Product.distinct("subSubCategory", filter);
        res.status(200).json(subSubCategories);
    } catch (error) {
        console.error('Error fetching subSubCategories:', error);
        res.status(500).json({ message: 'Error fetching subSubCategories', error: error.message });
    }
};