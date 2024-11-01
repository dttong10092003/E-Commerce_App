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
};
