import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons  } from '@expo/vector-icons';
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
  const [images, setImages] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [sliderTime, setSliderTime] = useState(30000);
  const [logo, setLogo] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const getSliderImages = async () => {
      try {
        setLoadingImages(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        };

        const url = `${ipAddress}/api/images`; //IPV4 Address
        const { data } = await axios(url, config);
        setLogo(data?.logo);
        setImages(data?.carousel);
        setSliderTime(data?.slidertime);
        setLoadingImages(false);
        if (data?.carousel.length === 0) return setShowCarousel(false);
        setShowCarousel(true);
      } catch (error) {
        if (error?.response?.status === 404) return setShowCarousel(false);
        if (error?.response?.status === 401) return navigation.navigate('Login');
       
      }
    };

    const getProductImages = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        };

        const url = `${ipAddress}/api/productimages`; //IPV4 Address
        const { data } = await axios(url, config);

        setProductImages(data);
      } catch (error) {
        if (error?.response?.status === 401) return navigation.navigate('Login');
      }
    };
    if (token && ipAddress) {
      getProductImages();
      getSliderImages();
    }
  }, [token, ipAddress]);

  useEffect(() => {
    if (showCarousel) {
      let timeoutId;
      const resetState = () => setModalCarousel(true); // Mostrar modal cuando barcode no se ha modificado en x tiempo

      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, sliderTime);
      };

      resetTimeout(); // Iniciar el timeout al principio o cuando barcode cambie

      return () => clearTimeout(timeoutId); // Limpiar el timeout cuando el componente se desmonte
    }
  }, [barcode, modalCarousel, showCarousel]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setModalCarousel(false);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 8000,
      };
      const url = `${ipAddress}/api/article?barcode=${data}`;
      const response = await axios(url, config);
      setArticle(response.data);
      setModalItem(true);
      setTimeout(() => {
        setModalItem(false);
        setArticle({});
        setArticleNotFound(false);
      }, 5000);
    } catch (error) {
      if (!error?.response || error?.response?.status === 401) {
        setModalCarousel(false);
        return navigation.navigate('Login');
      } else {
        if (error?.response?.status === 404) {
          setArticleNotFound(true);

          setTimeout(() => {
            setModalItem(false);
            setArticle({});
            setArticleNotFound(false);
          }, 2500);
        }
        setModalCarousel(false);
        setArticle({});
        setBarcode('');
      }
    } finally {
      setLoading(false);
      setBarcode('');
    }
  };

  return (
    <>
      <StatusBar style="auto" hidden={true} />

      {Object.keys(article).length > 0 && (
        <Item
          loading={loading}
          item={article}
          modalItem={modalItem}
          productImages={productImages}
          logo={logo}
        />
      )}

      {!modalCarousel && !Object.keys(article).length > 0 ? (
        <>
          <View className="flex justify-center items-center h-full bg-primary-dark">
            <View>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  color="rgb(229 231 235)"
                  size={70}
                />
              ) : !articleNotFound ? (
                <View className="h-full flex justify-center">
                  <>
                    <Text
                      className="text-9xl text-center text-gray-200 w-[700px]"
                      style={{ fontFamily: 'plus-jakarta' }}
                    >
                      Escaneá tu producto
                    </Text>
                    <View className="mx-auto">
                      <MaterialCommunityIcons
                        name="barcode-scan"
                        size={200}
                        color="#FFF"
                      />
                    </View>
                  </>
                </View>
              ) : (
                <Text
                  className="text-9xl text-center text-gray-200"
                  style={{ fontFamily: 'plus-jakarta' }}
                >
                  No hay resultados
                </Text>
              )}
            </View>

            
          </View>

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
