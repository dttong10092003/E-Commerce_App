import {ImageSourcePropType} from 'react-native';

type SplashTypes = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

type FeaturesTypes = {
  image: string;
  title: string;
};
type ItemDetails = ProductTypes;

type Ratings = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  importPrice: number;
  salePrice: number;
  discount: number;
  mainCategory: string;
  subCategory: {
    name: string;
    image: string;
  };
  subSubCategory: string;
  images: string[]; // Mảng gồm tối đa 5 ảnh đại diện chính của sản phẩm
  variants: {
    size: string;
    colors: {
      color: string;
      stock: number;
      image: string; // Chỉ 1 ảnh duy nhất cho mỗi màu
    }[];
  }[];
  reviews: number;
  ratings: Ratings;
  createdAt: string;
};

type ProductTypes = {
  image: string;
  title: string;
  description: string;
  price: number;
  priceBeforeDeal: number;
  priceOff: number;
  stars: number;
  numberOfReview: number;
  category: string;
  subcategory: string;
  size: string;
  quantity: number;
};
type TabBarTypes = {
  title?: string;
  image: string;
  link: string;
  inActiveColor: string;
  activeColor: string;
  inActiveBGColor?: string;
  activeBGColor?: string;
};

export type {
  SplashTypes,
  FeaturesTypes,
  ProductTypes,
  TabBarTypes,
  ItemDetails,
  Product,
  Ratings,
};
