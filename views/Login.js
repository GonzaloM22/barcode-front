import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image } from 'react-native';
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

const Login = () => {
  const [dataLogin, setDataLogin] = useState({
    ipAdress: '',
    userName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [userError, setUserError] = useState(false);
  //const image = require('../assets/logo.png');
  const navigation = useNavigation();
  const { ipAdress, userName, password } = dataLogin;
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (ipAdress === '' || userName === '' || password === '')
        return setFieldEmpty(true);

      const url = `http://${ipAdress}/api/auth`; //IPV4 Address
      const { data } = await axios.post(url, {
        userName,
        password,
      });
      if (data?.user) navigation.navigate('Main');
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

      <LinearGradient colors={['#4b6cb7', '#182848']} className="flex-1 pt-12">
        <Snackbar
          visible={networkError}
          onDismiss={() => setNetworkError(false)}
          duration={3000}
          style={{ bottom: 5 }}
        >
          Error de conexión con el servidor
        </Snackbar>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View
            className="bg-gray-100 px-8 pb-14 pt-6 rounded-xl shadow-xl mx-auto"
            style={{ width: 500 }}
          >
            <Headline className="text-4xl text-center mb-8">Iniciar Sesión</Headline>
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
                setDataLogin({ ...dataLogin, ipAdress: val })
              }
              value={ipAdress}
            />
            <HelperText type="error" visible={fieldEmpty && ipAdress === ''}>
              Dirección IP es obligatorio
            </HelperText>
            <TextInput
              mode="outlined"
              label="Usuario"
              placeholder="Nombre de Usuario ERP"
              onChangeText={(val) =>
                setDataLogin({ ...dataLogin, userName: val })
              }
              value={userName}
            />
            <HelperText type="error" visible={fieldEmpty && userName === ''}>
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
    </PaperProvider>
  );
};

export default Login;
