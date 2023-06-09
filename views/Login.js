import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, ActivityIndicator } from 'react-native';
import {
  TextInput,
  Headline,
  Button,
  Paragraph,
  DefaultTheme,
  HelperText,
  Dialog,
  Portal,
  Snackbar,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [dataLogin, setDataLogin] = useState({
    ipAddress: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingLS, setLoadingLs] = useState(false);
  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [sesionExpired, setSesionExpired] = useState(false);
  const [userError, setUserError] = useState(false);
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
        //setTokenLS(tknLS);
        //setIpAddressLS(ipAddressLS);

        if (tknLS && ipAddressLS) {
          const url = `http://${ipAddressLS}/api/profile`;

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tknLS}`,
            },
            timeout: 15000,
          };
          const response = await axios(url, config);
          if (response.data.status === 200)
            navigation.navigate('Main', { token: tknLS, ipAddress: ipAddressLS });
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

      const url = `http://${ipAddress}/api/auth`; //IPV4 Address
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
      if (error?.response?.status === 404) return setUserError(true);
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
          <ActivityIndicator color="#343434" size={50} />
        </View>
      ) : (
        <LinearGradient
          colors={['#4b6cb7', '#182848']}
          className="flex-1 pt-12"
        >
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
          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View
              className="bg-gray-100 px-8 pb-14 pt-6 rounded-xl shadow-xl mx-auto"
              style={{ width: 500 }}
            >
              <Headline className="text-4xl text-center mb-8 w-32 mx-auto">
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
                placeholder="Número de ip: puerto"
                keyboardType="url"
                onChangeText={(val) =>
                  setDataLogin({ ...dataLogin, ipAddress: val })
                }
                value={ipAddress}
              />
              <HelperText type="error" visible={fieldEmpty && ipAddress === ''}>
                Dirección IP es obligatorio
              </HelperText>
              <TextInput
                mode="outlined"
                label="Usuario"
                placeholder="Nombre de Usuario ERP"
                onChangeText={(val) =>
                  setDataLogin({ ...dataLogin, username: val })
                }
                value={username}
              />
              <HelperText type="error" visible={fieldEmpty && username === ''}>
                Usuario es obligatorio
              </HelperText>
              <TextInput
                mode="outlined"
                label="Contraseña"
                placeholder="Contraseña ERP"
                secureTextEntry
                onChangeText={(val) =>
                  setDataLogin({ ...dataLogin, password: val })
                }
                value={password}
              />
              <HelperText type="error" visible={fieldEmpty && password === ''}>
                Contraseña es obligatorio
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

              <Portal>
                <Dialog
                  visible={userError}
                  onDismiss={() => setUserError(false)}
                  style={{ width: 350, alignSelf: 'center' }}
                  className="rounded-2xl px-2 bg-gray-100"
                >
                  <Dialog.Title>Error</Dialog.Title>

                  <Dialog.Content>
                    <Text variant="bodyMedium">
                      Usuario o contraseña incorrectos
                    </Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => setUserError(false)}>Aceptar</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      )}
    </PaperProvider>
  );
};

export default Login;
