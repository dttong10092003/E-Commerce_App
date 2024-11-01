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

type Product = {
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
  image: string;
  variants: {
    size: string;
    colors: {
      color: string;
      stock: number;
      images: string[];
    }[];
  }[];
  isHeart: boolean;
  reviews: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
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
};
