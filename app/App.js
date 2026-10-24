import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client/react'

import AuthContextProvider from './context/authContext';
import RootStack from './navigations/root';
import client from './config/apollo';

export default function App() {
  return (
    <AuthContextProvider>
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </ApolloProvider>
    </AuthContextProvider>
  );
}
