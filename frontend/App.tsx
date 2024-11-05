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
  EditCardScreen, SettingsScreen, CategoriesScreen, CatalogScreen, FilterScreen   } from './src/screens';
import {ItemDetails, Product} from './src/constants/types';

export type RouteStackParamList = {
  Onboarding: undefined;
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  Profile: undefined;
  Checkout: undefined;
  PlaceOrder: {itemDetails: ItemDetails};
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
};

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
            initialRouteName="Login">
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
                     
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

export default App;