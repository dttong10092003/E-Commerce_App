// models/productModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Các giá trị enum cho từng danh mục con
const CLOTHES_SUBCATEGORIES = ['Blazers', 'Pants', 'Jeans', 'Shorts', 'Shirts', 'Dresses'];
const SHOES_SUBCATEGORIES = ['Sneakers', 'Boots', 'Sandals', 'Formal Shoes'];
const ACCESSORIES_SUBCATEGORIES = ['Bags', 'Belts', 'Hats', 'Jewelry'];
const NEW_SUBCATEGORIES = ['New Arrivals', 'Trending', 'Limited Edition'];

// Định nghĩa Product Schema
const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    importPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    mainCategory: {
        type: String,
        enum: ['Men', 'Women', 'Kids'],
        required: true
    },
    subCategory: {
        name: {
            type: String,
            enum: ['New', 'Clothes', 'Shoes', 'Accessories'],
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    subSubCategory: {
        type: String,
        validate: {
            validator: function (value) {
                switch (this.subCategory.name) {
                    case 'Clothes':
                        return CLOTHES_SUBCATEGORIES.includes(value);
                    case 'Shoes':
                        return SHOES_SUBCATEGORIES.includes(value);
                    case 'Accessories':
                        return ACCESSORIES_SUBCATEGORIES.includes(value);
                    case 'New':
                        return NEW_SUBCATEGORIES.includes(value);
                    default:
                        return false;
                }
            },
            message: props => `${props.value} is not a valid subSubCategory for subCategory ${props.instance.subCategory.name}`
        },
        required: function () { return this.subCategory.name !== 'New'; }
    },
    image: { type: String, required: true }, // Ảnh đại diện cho sản phẩm
    variants: [{
        size: { type: String, required: true },
        colors: [{
            color: { type: String, required: true },
            stock: { type: Number, default: 0 },
            images: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 5'] }
        }]
    }],
    isHeart: { type: Boolean, default: false },
    reviews: { type: Number, default: 0 },
    ratings: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

// Giới hạn số lượng ảnh trong mỗi màu
function arrayLimit(val) {
    return val.length <= 5;
}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
