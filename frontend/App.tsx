import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { HomeScreen, OnboardingScreen, LoginScreen, ForgotPasswordScreen, 
  SignupScreen, GetStartedScreen, ProductsDetailsScreen, RatingsReviewsScreen,
  CheckoutScreen, PaymentMethodsScreen } from './src/screens';
import {ItemDetails} from './src/constants/types';
export type RouteStackParamList = {
  Onboarding: undefined;
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  Profile: undefined;
  Checkout: undefined;
  PlaceOrder: {itemDetails: ItemDetails} | undefined;
  ForgotPassword: undefined;
  ProductDetails: {itemDetails: ItemDetails} | undefined;
  Cart: {
    itemDetails: ItemDetails;
    selectedColor: string;
    selectedSize: number;
    quantity: number;
  };
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
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />            
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ProductDetails" component={ProductsDetailsScreen} />
            <Stack.Screen name="RatingsReviews" component={RatingsReviewsScreen} />           
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
                     
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

export default App;