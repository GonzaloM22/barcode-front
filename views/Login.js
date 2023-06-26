import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image } from 'react-native';
import {
  TextInput,
  Headline,
  Button,
  HelperText,
  Snackbar,
  Provider as PaperProvider,
  ActivityIndicator,
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [dataLogin, setDataLogin] = useState({
    ipAddress: '',
    username: 'APPPRECIOS',
    password: 'APPPRECIOS',
  });
  const [loading, setLoading] = useState(false);
  const [loadingLS, setLoadingLs] = useState(false);
  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [sesionExpired, setSesionExpired] = useState(false);
  //const image = require('../assets/logo.png');
  const navigation = useNavigation();
  const { ipAddress, username, password } = dataLogin;

  useEffect(() => {
    const settIpAddress = async () => {
      const ipAddressLS = await AsyncStorage.getItem('ipAddress');
      if (ipAddressLS) setDataLogin({ ...dataLogin, ipAddress: ipAddressLS });
    };

    const getDataLS = async () => {
      try {
        setLoadingLs(true);

        const ipAddressLS = await AsyncStorage.getItem('ipAddress');
        const tknLS = await AsyncStorage.getItem('token');

        if (tknLS && ipAddressLS) {
          const url = `${ipAddressLS}/api/profile`;

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tknLS}`,
            },
            timeout: 15000,
          };
          const response = await axios(url, config);
          if (response.data.status === 200)
            navigation.navigate('Main', {
              token: tknLS,
              ipAddress: ipAddressLS,
            });
        }
        setTimeout(() => setLoadingLs(false), 10000);
      } catch (error) {
        if (error?.response?.status == 401) {
          setSesionExpired(true);
        } else {
          setNetworkError(true);
        }
        navigation.navigate('Login');
        setLoadingLs(false);
      }
    };
    settIpAddress();
    getDataLS();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (ipAddress === '' || username === '' || password === '')
        return setFieldEmpty(true);

      const url = `${ipAddress}/api/auth`; //IPV4 Address
      const { data } = await axios.post(
        url,
        {
          username,
          password,
        },
        {
          timeout: 10000,
        }
      );

      if (data?.token)
        navigation.navigate('Main', { token: data.token, ipAddress });
      await AsyncStorage.setItem('ipAddress', ipAddress);
      await AsyncStorage.setItem('token', data?.token);
    } catch (error) {
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <StatusBar style="auto" hidden={true} />
      {loadingLS ? (
        <View className="h-screen flex justify-center bg-gray-100">
          <ActivityIndicator color="#343434" size={70} animating={loadingLS} />
        </View>
      ) : (
        <LinearGradient colors={['#4b6cb7', '#182848']} className="flex-1">
          <Snackbar
            visible={networkError || sesionExpired}
            onDismiss={() => {
              setNetworkError(false);
              setSesionExpired(false);
            }}
            duration={3000}
            style={{ bottom: 5 }}
          >
            {networkError
              ? 'Error de conexión con el servidor'
              : 'Sesión vencida, inicie sesión nuevamente'}
          </Snackbar>
          <KeyboardAwareScrollView contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
            <View
              className="bg-gray-100 px-8 pb-14 pt-6 rounded-xl shadow-xl mx-auto"
              style={{ width: 500 }}
            >
              <Headline className="text-4xl text-center mb-8 mx-auto">
                Iniciar Sesión
              </Headline>
              {/*<Image
              source={image}
              className="mx-auto"
              style={{
                resizeMode: 'contain',
                width: 220,
                height: 150,
              }}
            />*/}
              <TextInput
                mode="outlined"
                label="Dirección IP"
                placeholder="Número de IP: puerto"
                keyboardType="url"
                onChangeText={(val) =>
                  setDataLogin({ ...dataLogin, ipAddress: val })
                }
                value={ipAddress}
              />
              <HelperText type="error" visible={fieldEmpty && ipAddress === ''}>
                Dirección IP es obligatorio
              </HelperText>
              <Button
                className="rounded-xl"
                buttonColor="#4b6cb7"
                mode="contained"
                disabled={loading}
                loading={loading}
                onPress={handleSubmit}
              >
                Ingresar
              </Button>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      )}
    </PaperProvider>
  );
};

export default Login;
