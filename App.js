import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './views/Login';
import Main from './components/Main';
import { View, Image, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Stack = createStackNavigator();
const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'plus-jakarta': require('./assets/PlusJakartaSans-Medium.ttf'),
      });
      setFontsLoaded(true);
    };

    if (!fontsLoaded) loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="h-screen flex justify-center bg-gray-100">
        <ActivityIndicator color="#343434" size={50} animating={fontsLoaded} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Iniciar Sesión',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            title: 'Main',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
      <View className="flex flex-row justify-end items-center bg-secondary-dark w-full p-1 pr-2">
        <Text className="text-gray-200" style={{ fontFamily: 'plus-jakarta' }}>
          Desarrollado por
        </Text>
        <Image
          source={require('./assets/Flexxus-Fondo-Negro.png')}
          style={{ width: 70, height: 14 }}
          resizeMode="contain"
        />
      </View>
    </NavigationContainer>
  );
};

export default App;
