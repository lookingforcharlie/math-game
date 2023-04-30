import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Game from './screens/Game';
import Login from './screens/Login';
import Main from './screens/Main';
import Result from './screens/Result';
import SignUp from './screens/SignUp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6f8fd3',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          component={Main}
          name='Main'
          options={{ headerShown: false }}
        />
        <Stack.Screen component={Login} name='Login' />
        <Stack.Screen
          component={SignUp}
          name='SignUp'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Game}
          name='Game'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Result}
          name='Result'
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
