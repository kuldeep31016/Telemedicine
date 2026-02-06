import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import SplashScreen from './src/screens/SplashScreen';
import LandingScreen from './src/screens/LandingScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/patient/ProfileScreen';

const RootStack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Splash"
        >
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Landing" component={LandingScreen} />
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
          <RootStack.Screen name="Welcome" component={WelcomeScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen name="SignIn" component={SignInScreen} />
          {/* HomeScreen wraps the existing tab-based navigator */}
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Profile" component={ProfileScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

