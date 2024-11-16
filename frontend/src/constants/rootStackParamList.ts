import {ItemDetails, Product, CartItem} from './types';
export type RootStackParamList = {
    Onboarding: undefined;
    GetStarted: undefined;
    Login: undefined;
    Signup: undefined;
    HomeScreen: undefined;
    Profile: undefined;
    Checkout: {cartData: CartItem[], totalAmount: number};
    ForgotPassword: undefined;
    ProductDetails: { itemDetails: Product };
    Cart: {
      itemDetails: ItemDetails;
      selectedColor: string;
      selectedSize: number;
      quantity: number;
    };
    PaymentMethods: undefined;
    RatingsReviews: { itemDetails: Product };
    EditProduct : { product: Product };
    EditVariantProduct: { product: Product };
    AddProduct: undefined;
  };