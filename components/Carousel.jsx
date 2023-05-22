import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  Modal,
  FlatList,
  Image,
  View,
  useWindowDimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import BarcodeForm from './BarcodeForm';

const Carousel = ({ barcode, setBarcode, modalCarousel }) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);
  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const data = [
    {
      id: 1,
      image: require('../assets/img/img1.jpg'),
    },
    {
      id: 2,
      image: require('../assets/img/img2.jpg'),
    },
    {
      id: 3,
      image: require('../assets/img/img3.jpg'),
    },
  ];
  useEffect(() => {
    const interval = setInterval(scrollToNextImage, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollToNextImage = () => {
    if (flatListRef.current) {
      const nextIndex = currentIndexRef.current + 1;

      flatListRef.current.scrollToIndex({
        index: nextIndex >= data.length ? 0 : nextIndex,
        animated: true,
      });

      currentIndexRef.current = nextIndex >= data.length ? 0 : nextIndex;
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={modalCarousel}
      statusBarTranslucent={true}
    >
      <StatusBar hidden={true} />
      <View>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator
          pagingEnabled
          //scrollEnabled={false}
          bounces={false}
          getItemLayout={getItemLayout}
          data={data}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Image
                source={item.image}
                style={{
                  width,
                  resizeMode: 'contain',
                  height: '100%',
                }}
              />
            </View>
          )}
        />
        <BarcodeForm barcode={barcode} setBarcode={setBarcode} />
      </View>
    </Modal>
  );
};

export default Carousel;
