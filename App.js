import React, {useEffect, useState} from 'react';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './views/Login';
import Main from './components/Main';
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Stack = createStackNavigator();
const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);



   useEffect(() => {
    const loadFonts = () => {
      Font.loadAsync({
        'nunito-regular': require('./assets/Nunito-Regular.ttf'),
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
    </NavigationContainer>
  );
};

export default App;
