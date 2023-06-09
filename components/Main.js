import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, ActivityIndicator } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/solid';
import axios from 'axios';
import Item from './Item';
import Carousel from './Carousel';
import BarcodeForm from './BarcodeForm';

const Main = () => {
  const route = useRoute();
  const { token, ipAddress } = route?.params ?? {};
  const [article, setArticle] = useState({});
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [modalCarousel, setModalCarousel] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  
  /*useEffect(() => {
    const loadFonts = () => {
      Font.loadAsync({
        'outfit-regular': require('../assets/Outfit-Regular.ttf'),
      });
      setFontsLoaded(true);
    };

    if (!fontsLoaded) loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="h-screen flex justify-center bg-gray-100">
        <ActivityIndicator color="#343434" size={50} />
      </View>
    );
  }*/


  useEffect(() => {
    const getImages = async () => {
      try {
        setLoadingImages(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        };

        const url = `http://${ipAddress}/api/images`; //IPV4 Address
        const { data } = await axios(url, config);
        setImages(data);
        setLoadingImages(false);
        setShowCarousel(true);
      } catch (error) {
        if (error?.response?.status === 404) return setShowCarousel(false);

        navigation.navigate('Login');
      }
    };
    if (token && ipAddress) getImages();
  }, [token, ipAddress]);


  useEffect(() => {
    if (showCarousel) {
      let timeoutId;
      const resetState = () => setModalCarousel(true); // Mostrar modal cuando barcode no se ha modificado en x tiempo

      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, 30000);
      };

      resetTimeout(); // Iniciar el timeout al principio o cuando barcode cambie

      return () => clearTimeout(timeoutId); // Limpiar el timeout cuando el componente se desmonte
    }
  }, [barcode, modalCarousel, showCarousel]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);     
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 8000,
      };
      const url = `http://${ipAddress}/api/article?barcode=${data}`;
      const response = await axios(url, config);
      setArticle(response.data);
      setModalCarousel(false);
      setModalItem(true);

    } catch (error) {
      if (!error?.response) {
        setModalCarousel(false);
        return navigation.navigate('Login');
      } else {
        if (error?.response?.status === 404) setArticleNotFound(true);
        setModalCarousel(false);
        setArticle({});
        setBarcode('');
      }
    } finally {
      setLoading(false);
      setBarcode('');
      setTimeout(() => {
        setModalItem(false);
        setArticle({});
        setArticleNotFound(false);
      }, 5000);
    }
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
                    <Text className="text-9xl text-center text-gray-200 pt-52" 
                    /*</View>style={{fontFamily: 'outfit-regular'}}*/>
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
            setShowCarousel={setShowCarousel}
            images={images}
            loadingImages={loadingImages}
          />
        )
      )}
    </>
  );
};

export default Main;
