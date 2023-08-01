import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  View,
  Text,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import BarcodeForm from './BarcodeForm';
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
} from 'react-native-paper';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Carousel = ({
  barcode,
  setBarcode,
  setModalCarousel,
  handleSubmit,
  images,
  loadingImages,
}) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);

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
      {!loadingImages ? (
        <PaperProvider>
          <Portal>
            <Modal visible={true} className="bg-gray-100 h-[650px]">
              <View className="h-screen">
                <FlatList
                  ref={flatListRef}
                  horizontal
                  showsHorizontalScrollIndicator
                  pagingEnabled
                  scrollEnabled={false}
                  bounces={false}
                  getItemLayout={getItemLayout}
                  data={images}
                  renderItem={({ item }) => {
                    if (item?.filename === 'logo') return null;
                    return (
                      <TouchableWithoutFeedback
                        onPressIn={() => setModalCarousel(false)}
                      >
                        <View style={{ width, flex: 1 }}>
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              //width,
                              height: '100%',
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  }}
                />
              </View>
              <View className="flex items-center space-y-2 justify-center bg-[#343434] h-[150px]">
                <View>
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={80}
                    color="#FFF"
                  />
                </View>
                <SimpleLineIcons name="arrow-down" size={40} color="#FFF"/>
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
            <ActivityIndicator
              color="#343434"
              size={50}
              animating={loadingImages}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default Carousel;
