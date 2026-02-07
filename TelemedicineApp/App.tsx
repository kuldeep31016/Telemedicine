import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';
import { getFirebaseApp } from './src/services/firebase/config';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Firebase
    getFirebaseApp();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.primaryDark}
            />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
