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
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4b6cb7',
    secondary: '#182848',
  },
};

const Login = () => {
  const [dataLogin, setDataLogin] = useState({
    ipAdress: '',
    userName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const image = require('../assets/logo.png');

  const { ipAdress, userName, password } = dataLogin;
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (ipAdress === '' || userName === '' || password === '')
        return setError(true);

      const address = '192.168.100.4'; //'10.254.253.22'
      const url = `http://${ipAdress}:5008/api/auth`; //IPV4 Address
      const {data} = await axios.post(url, {
        userName,
        password,
      });
      console.log(data.user);
    } catch (error) {
      //setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <StatusBar style="auto" hidden={true} />
      <LinearGradient
        colors={['#4b6cb7', '#182848']}
        className="flex-1 justify-center"
      >
        <View
          className="bg-gray-100 px-8 pb-14 pt-6 rounded-xl shadow-xl mx-auto"
          style={{ width: 500 }}
        >
          {/*<Headline className="text-4xl text-center mb-8">Iniciar Sesión</Headline>*/}
          <Image
            source={image}
            className="mx-auto"
            style={{
              resizeMode: 'contain',
              width: 220,
              height: 150,
            }}
          />
          <TextInput
            mode="outlined"
            label="Dirección IP"
            placeholder="Número de IP"
            keyboardType="numeric"
            onChangeText={(val) =>
              setDataLogin({ ...dataLogin, ipAdress: val })
            }
            value={ipAdress}
          />
          <HelperText type="error" visible={error && ipAdress === ''}>
            Dirección IP es obligatorio
          </HelperText>
          <TextInput
            mode="outlined"
            label="Usuario"
            placeholder="Nombre de Usuario"
            onChangeText={(val) =>
              setDataLogin({ ...dataLogin, userName: val })
            }
            value={userName}
          />
          <HelperText type="error" visible={error && userName === ''}>
            Usuario es obligatorio
          </HelperText>
          <TextInput
            mode="outlined"
            label="Contraseña"
            //placeholder=""
            secureTextEntry
            onChangeText={(val) =>
              setDataLogin({ ...dataLogin, password: val })
            }
            value={password}
          />
          <HelperText type="error" visible={error && password === ''}>
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

          {/*<Portal>
          <Dialog visible={error} onDismiss={() => setError(false)}>
            <Dialog.Content>
              <Paragraph>Usuario o contraseña incorrectos</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setError(false)}>Aceptar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>*/}
        </View>
      </LinearGradient>
    </PaperProvider>
  );
};

export default Login;
