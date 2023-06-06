import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/solid';
import axios from 'axios';
import Item from "./Item";
import Carousel from "./Carousel";
import BarcodeForm from "./BarcodeForm";

const Main = () => {
  const [article, setArticle] = useState({});
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [modalCarousel, setModalCarousel] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [ipAddress, setIpAddress] = useState()
  


  useEffect(() => {
    const getDataLS = async () => {
      try {
        const ipAddressLS = await AsyncStorage.getItem('ipAddress');
        setIpAddress(ipAddressLS)
      } catch (error) {
        console.log(error);
      }
    };
    getDataLS();
  }, []);

  useEffect(() => {
    let timeoutId;
    const resetState = () => setModalCarousel(true); // Mostrar modal cuando barcode no se ha modificado en x tiempo

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resetState, 30000);
    };

    resetTimeout(); // Iniciar el timeout al principio o cuando barcode cambie

    return () => clearTimeout(timeoutId); // Limpiar el timeout cuando el componente se desmonte
  }, [barcode, modalCarousel]);

  /*useEffect(() => {
    if (barcode !== '') {
      getArticle();
    }
  }, [barcode]);*/

  const handleSubmit = async (data) => { 
    try {
      setLoading(true);
      const address = '192.168.100.4'; //'10.254.253.22'
      const url = `http://${ipAddress}/api/article?barcode=${data}`; //IPV4 Address
      const response = await axios(url);
      setArticle(response.data.article[0]);
      setModalCarousel(false);
      setModalItem(true);
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 404) setArticleNotFound(true);
      setModalCarousel(false);
      setArticle({});
      setBarcode('');
    } finally {
      setLoading(false);
      setBarcode('');

      setTimeout(() => {
        setModalItem(false);
        setArticle({});
        setArticleNotFound(false);
      }, 5000);
    }


  }

  const getArticle = async () => {
    /*try {
      setLoading(true);
      const address = '192.168.100.4'; //'10.254.253.22'
      const url = `http://${address}:5008/api/article?barcode=${barcode}`; //IPV4 Address
      const response = await axios(url);

      setArticle(response.data.article[0]);
      setModalCarousel(false);
      setModalItem(true);
    } catch (error) {
      if (error.response.status === 404) setArticleNotFound(true);
      setModalCarousel(false);
      setArticle({});
      setBarcode('');
    } finally {
      setLoading(false);
      setBarcode('');

      setTimeout(() => {
        setModalItem(false);
        setArticle({});
        setArticleNotFound(false);
      }, 5000);
    }*/
  };

  return (
    <>
      <StatusBar style="auto" hidden={true} />

      {Object.keys(article).length > 0 && (
        <Item loading={loading} item={article} modalItem={modalItem} />
      )}

      {!modalCarousel && !Object.keys(article).length > 0 ? (
        <>
          <LinearGradient colors={['#4b6cb7', '#182848']} className="flex-1">
            <View>
              <View>
                {!articleNotFound ? (
                  <View>
                    <Text className="text-9xl text-center text-gray-200 pt-52">
                      Escanee su producto aqui
                    </Text>
                    <View className="items-center mt-8">
                      <ChevronDownIcon fill="#FFFFFF" size={250} />
                    </View>
                  </View>
                ) : (
                  <Text className="text-9xl text-center text-gray-200 pt-52">
                    No hay resultados
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
          <BarcodeForm
            barcode={barcode}
            setBarcode={setBarcode}
            setModalCarousel={setModalCarousel}
            handleSubmit={handleSubmit}
          />
        </>
      ) : (
        modalCarousel && (
          <Carousel
            barcode={barcode}
            setBarcode={setBarcode}
            setModalCarousel={setModalCarousel}
            modalCarousel={modalCarousel}
            modalItem={modalItem}
            handleSubmit={handleSubmit}
            ipAddress={ipAddress}
          />
        )
      )}
    </>
  );
};

export default Main;
