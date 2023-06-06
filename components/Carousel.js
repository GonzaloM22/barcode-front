import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  Image,
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import BarcodeForm from './BarcodeForm';
import { Modal, Portal, PaperProvider } from 'react-native-paper';

const Carousel = ({
  ipAddress,
  barcode,
  setBarcode,
  setModalCarousel,
  modalCarousel,
  handleSubmit,
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);
  

  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);
        const url = `http://${ipAddress}/api/images`; //IPV4 Address
        const { data } = await axios(url);
        setImages(data);
        setLoading(false);
      } catch (error) {
       // console.log(error?.data);
      }
    };

    getImages();
  }, []);

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  useEffect(() => {
    const interval = setInterval(scrollToNextImage, 8000);

    return () => clearInterval(interval);
  }, [images]);

  const scrollToNextImage = () => {
    if (flatListRef.current) {
      const nextIndex = currentIndexRef.current + 1;

      flatListRef.current.scrollToIndex({
        index: nextIndex >= images.length ? 0 : nextIndex,
        animated: true,
      });

      currentIndexRef.current = nextIndex >= images.length ? 0 : nextIndex;
    }
  };

  return (
    <>
      {!loading ? (
        <PaperProvider>
          <Portal>
            <Modal visible={true} className="bg-gray-100 flex-1">
              <View>
                <FlatList
                  ref={flatListRef}
                  horizontal
                  showsHorizontalScrollIndicator
                  pagingEnabled
                  scrollEnabled={false}
                  bounces={false}
                  getItemLayout={getItemLayout}
                  data={images}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                      onPressIn={() => setModalCarousel(false)}
                    >
                      <View style={{ width, flex: 1 }}>
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width,
                            resizeMode: 'contain',
                            height: '100%',
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
              </View>
            </Modal>
          </Portal>
          <BarcodeForm
            barcode={barcode}
            setBarcode={setBarcode}
            setModalCarousel={setModalCarousel}
            handleSubmit={handleSubmit}
          />
        </PaperProvider>
      ) : (
        <TouchableWithoutFeedback onPressIn={() => setModalCarousel(false)}>
          <View className="h-screen flex justify-center bg-gray-100">
            <ActivityIndicator color="#343434" size={50} />
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default Carousel;
