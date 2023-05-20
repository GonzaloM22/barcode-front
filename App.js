import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import {
  ArrowSmallDownIcon,
  ChevronDownIcon,
} from 'react-native-heroicons/solid';
import axios from 'axios';
import Item from './components/Item';
import BarcodeForm from './components/BarcodeForm';
import Carousel from './components/Carousel';

export default function App() {
  const [article, setArticle] = useState({});
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    let timeoutId;

    const resetState1 = () => setModal(true); // Mostrar modal cuando barcode no se ha modificado en x tiempo

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resetState1, 30000);
    };

    resetTimeout(); // Iniciar el timeout al principio o cuando barcode cambie

    return () => clearTimeout(timeoutId); // Limpiar el timeout cuando el componente se desmonte
  }, [barcode]);

  useEffect(() => {
    if (barcode !== '') {
      setModal(false);
      getArticle();
    }
  }, [barcode]);

  const getArticle = async () => {
    try {
      setLoading(true);
      const address = '192.168.100.4'; //10.254.253.38
      const url = `http://${address}:5008/api/article?barcode=${barcode}`; //IPV4 Address
      const response = await axios(url);
      setArticle(response.data.article[0]);
    } catch (error) {
      if (error.response.status === 404) setArticleNotFound(true);
      setArticle({});
      setBarcode('');
    } finally {
      setLoading(false);
      setBarcode('');

      setTimeout(() => {
        setArticle({});
        setArticleNotFound(false);
      }, 3000);
    }
  };

  return (
    <>
      <Carousel barcode={barcode} setBarcode={setBarcode} modal={modal} />

      <LinearGradient colors={['#757F9A', '#D7DDE8']} className="flex-1">
        <StatusBar style="auto" hidden={true} />
        <Text className="text-center text-6xl font-semibold mt-20 text-zinc-800">
          Verificador de Precios
        </Text>

        <BarcodeForm barcode={barcode} setBarcode={setBarcode} />
        <View className="mt-10">
          {loading ? (
            <ActivityIndicator
              size={55}
              color="#393939"
              style={{ marginTop: 10 }}
            />
          ) : (
            <>
              {Object.keys(article).length > 0 ? (
                <Item item={article} />
              ) : (
                <>
                  <Text className="text-4xl text-center text-zinc-800">
                    {articleNotFound
                      ? 'No hay resultados'
                      : 'Escanee su artículo aquí'}
                  </Text>
                  <View className="items-center mt-60">
                    <ChevronDownIcon fill="#393939" size={150} />
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    </>
  );
}
