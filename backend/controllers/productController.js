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

exports.updateProductStock = async (req, res) => {
    const { productId } = req.params;
    const { color, size, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.find(v => v.color === color);
        if (!variant) {
            return res.status(404).json({ message: `Color ${color} not found` });
        }

        const sizeOption = variant.sizes.find(s => s.size === size);
        if (!sizeOption) {
            return res.status(404).json({ message: `Size ${size} not found for color ${color}` });
        }

        // Kiểm tra và trừ số lượng tồn kho
        if (sizeOption.stock >= quantity) {
            sizeOption.stock -= quantity;
        } else {
            return res.status(400).json({ message: `Not enough stock for size ${size} of color ${color}` });
        }

        await product.save();
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error("Error updating product stock:", error);
        res.status(500).json({ message: 'Error updating product stock', error });
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


exports.getSubSubCategories = async (req, res) => {
    try {
        const { mainCategory, subCategoryName } = req.params;

        const filter = {};

        // const filter = { "subCategory.name": subCategoryName };
        if (mainCategory !== 'All') {
            filter.mainCategory = mainCategory; // Chỉ thêm mainCategory khi nó không phải là "All"
        }

        if (subCategoryName !== 'New') { // New hoặc All
            filter["subCategory.name"] = subCategoryName;
        }

        // Lấy danh sách subSubCategory dựa trên filter
        const subSubCategories = await Product.distinct("subSubCategory", filter);
        res.status(200).json(subSubCategories);
    } catch (error) {
        console.error('Error fetching subSubCategories:', error);
        res.status(500).json({ message: 'Error fetching subSubCategories', error: error.message });
    }
};

// Lấy danh sách sản phẩm dựa trên mainCategory, subCategoryName, và subSubCategory
exports.getProductsByCategory = async (req, res) => {
    try {
        const { mainCategory, subCategoryName, subSubCategory } = req.params;

        const filter = {};

        if (mainCategory && mainCategory !== 'All') {
            filter.mainCategory = mainCategory;
        }

        if (subCategoryName && subCategoryName !== 'New') {
            filter["subCategory.name"] = subCategoryName;
        }

        if (subSubCategory && subSubCategory !== 'All') {
            filter.subSubCategory = subSubCategory;
        }

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
};
