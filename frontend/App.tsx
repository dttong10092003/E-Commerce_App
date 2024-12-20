import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { HomeScreen, OnboardingScreen, LoginScreen, ForgotPasswordScreen, 
  SignupScreen, GetStartedScreen, ProductsDetailsScreen, RatingsReviewsScreen,
  CheckoutScreen, PaymentMethodsScreen, MyOrdersScreen, OrderDetailScreen,
  ShippingAddressesScreen, EditAddressScreen, AddNewAddressScreen, AddNewCardScreen,
  EditCardScreen, SettingsScreen, CategoriesScreen, CatalogScreen, FilterScreen, 
  PromocodesScreen,HomeScreenAdmin, ProductManagement, CustomerSupportAI, CustomerSupport,
  AddNewProductScreen, CustomerCareScreen, EditProductScreen, EditVariantProductScreen,
  ChatSocket, AdminOrderDetailScreen, AdminOrderScreen, CreateAccountAdminScreen} from './src/screens';

  
// import {ItemDetails, Product, CartItem} from './src/constants/types';

// export type RouteStackParamList = {
//   Onboarding: undefined;
//   GetStarted: undefined;
//   Login: undefined;
//   Signup: undefined;
//   HomeScreen: undefined;
//   Profile: undefined;
//   Checkout: {cartData: CartItem[], totalAmount: number};
//   ForgotPassword: undefined;
//   ProductDetails: { itemDetails: Product };
//   Cart: {
//     itemDetails: ItemDetails;
//     selectedColor: string;
//     selectedSize: number;
//     quantity: number;
//   };
//   PaymentMethods: undefined;
//   RatingsReviews: { itemDetails: Product };
//   EditProduct : { product: Product };
//   EditVariantProduct: { product: Product };
// };

const App = () => {
  const Stack = createNativeStackNavigator();

  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Onboarding">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />            
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ProductDetails" component={ProductsDetailsScreen} />
            <Stack.Screen name="RatingsReviews" component={RatingsReviewsScreen} />          
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="ShippingAddresses" component={ShippingAddressesScreen} />
            <Stack.Screen name="EditAddress" component={EditAddressScreen} />
            <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="AddNewCard" component={AddNewCardScreen} />
            <Stack.Screen name="EditCard" component={EditCardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Catalog" component={CatalogScreen} />
            <Stack.Screen name="Filter" component={FilterScreen} />
            <Stack.Screen name="Promocodes" component={PromocodesScreen} />
            <Stack.Screen name="HomeAdmin" component={HomeScreenAdmin} />
            <Stack.Screen name="ProductManagement" component={ProductManagement} />
            <Stack.Screen name="CustomerSupportAI" component={CustomerSupportAI} />
            <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
            <Stack.Screen name="AddProduct" component={AddNewProductScreen} />
            <Stack.Screen name="CustomerCare" component={CustomerCareScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
            <Stack.Screen name="EditVariantProduct" component={EditVariantProductScreen} />
            <Stack.Screen name="ChatSocket" component={ChatSocket} />
            <Stack.Screen name="AdminOrder" component={AdminOrderScreen} />
            <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountAdminScreen} />
            

                     
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

export default App;