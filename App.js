import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import Article from './components/Article';
import FormCode from './components/FormCode';


export default function App() {
  const [article, setArticle] = useState({});
  const [barcode, setbarcode] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (barcode !== '') {
      getArticle();
    }
  }, [barcode]);

  const getArticle = async () => {
    setScanned(true);
    try {
      const url = `http://192.168.100.4:5008/api/article?barcode=${barcode}`; //IPV4 Address
      const response = await axios(url);
      setArticle(response.data.article[0]);
    } catch (error) {
      setArticle({});
    }
    setTimeout(() => {
      setScanned(false);
      setbarcode('');
    }, 3000);
  };

  const handleSubmit = async () => {
    await getArticle();
    setTimeout(() => {
      setScanned(false);
      setbarcode('');
    }, 3000);
  };

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  };
  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);
  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    //setScanned(true);
    setbarcode(data);
    console.log('Type: ' + type + '\nData: ' + data);
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-yellow-400 px-10">
        <Text className="text-center text-2xl font-bold mt-20">
          Consulta el precio aquí
        </Text>

        <StatusBar style="auto" />

        <FormCode
          handleSubmit={handleSubmit}
          barcode={barcode}
          setbarcode={setbarcode}
        />

        { scanned ?        
          <ActivityIndicator size="large" color="black" className="mt-10" />
        : article.DESCRIPCION ? (
          <Article article={article} />
        ) : (
          <Text className="text-center mt-10 text-xl">No hay Resultados</Text>
        )}
      </SafeAreaView>

      <View style={{backgroundColor: 'rgb(250, 204, 21)' }}>
        <View style={{ position: 'absolute', top: -1000 }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 1, width: 1 }}
          />
        </View>
      </View>
    </>
  );
}




