import { useEffect, useRef, useState } from 'react';
import { View, Image, Animated } from 'react-native';
import { Modal, Portal, Text, PaperProvider } from 'react-native-paper';
import FormatNumber from '../helpers/formatPrice';

const Item = ({ item, modalItem, productImages, logo }) => {
  const [productImagePath, setProductImagePath] = useState(null);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const {
    CODIGO_ARTICULO,
    DESCRIPCION,
    RUBRO,
    IMPORTE,
    IMPORTEOFERTA,
    PORC_DESCUENTO,
  } = item;

  const hasDiscount = IMPORTEOFERTA === 0;

  useEffect(() => {
    const imagePath = productImages.find(
      (product) =>
        product?.filename?.toLowerCase() === CODIGO_ARTICULO?.toLowerCase()
    );
    if (imagePath) {
      setProductImagePath(imagePath?.image);
    } else {
      setProductImagePath(null);
    }
  }, [CODIGO_ARTICULO]);

  useEffect(() => {
    if (modalItem) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalItem]);

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={modalItem}
          contentContainerStyle={{ flex: 1 }}
          animationType="none"
        >
          <Animated.View style={{ opacity: fadeAnimation, flex: 1 }}>
            <View className="bg-gray-100 h-full">
              <>
                <View className="items-end pt-10 pr-24">
                  <Image
                    source={{ uri: logo }}
                    style={{
                      resizeMode: 'contain',
                      width: 220,
                      height: 150,
                    }}
                  />
                </View>
                <View className="pl-20 h-[450px]">
                  <Text
                    className="text-6xl text-zinc-700 capitalize mb-8 w-[1100px]"
                    style={{ fontFamily: 'plus-jakarta' }}
                  >
                    {DESCRIPCION.toLowerCase()}
                  </Text>
                  <View className="flex flex-row items-center">
                    <View className="space-y-8 mr-28">
                      {!hasDiscount && (
                        <>
                          <Text
                            className="text-2xl text-gray-200 bg-zinc-700 w-60 py-2 text-center rounded-full shadow-md"
                            style={{ fontFamily: 'plus-jakarta' }}
                          >
                            OFERTA
                          </Text>

                          <View className="flex flex-row space-x-10 mt-10">
                            <Text
                              className="text-zinc-700 text-4xl line-through"
                              style={{ fontFamily: 'plus-jakarta' }}
                            >
                              $
                              {hasDiscount
                                ? FormatNumber(IMPORTEOFERTA)
                                : FormatNumber(IMPORTE)}
                            </Text>
                            <Text
                              className="text-[#008d36] text-4xl"
                              style={{ fontFamily: 'plus-jakarta' }}
                            >
                              {Math.ceil(PORC_DESCUENTO)} % OFF
                            </Text>
                          </View>
                        </>
                      )}
                      <Text
                        className="text-[#4877ff] text-[100px]"
                        style={{ fontFamily: 'plus-jakarta' }}
                      >
                        $
                        {!hasDiscount
                          ? FormatNumber(IMPORTEOFERTA)
                          : FormatNumber(IMPORTE)}
                      </Text>
                      <View>
                        <Text
                          className="text-zinc-700 text-lg capitalize"
                          style={{ fontFamily: 'plus-jakarta' }}
                        >
                          Rubro: {RUBRO.toLowerCase()}
                        </Text>
                        <Text
                          className="text-zinc-700 text-lg"
                          style={{ fontFamily: 'plus-jakarta' }}
                        >
                          SKU: {CODIGO_ARTICULO}
                        </Text>
                      </View>
                    </View>
                    {productImagePath && (
                      <View className="mx-auto">
                        <Image
                          source={{ uri: productImagePath }}
                          style={{
                            resizeMode: 'contain',
                            width: 400,
                            height: 480,
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </>
            </View>
          </Animated.View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

export default Item;
