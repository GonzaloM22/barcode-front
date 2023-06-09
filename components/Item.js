import { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Portal, Text, PaperProvider } from 'react-native-paper';

const Item = ({ item, modalItem, loading }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const { DESCRIPCION, NUMEROLISTA } = item;
  const price = `PRECIOLISTA${NUMEROLISTA}`;

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
            <LinearGradient
              colors={['#4b6cb7', '#182848']}
              className="flex-1 justify-between"
            >
              <>
                <View className="bg-gray-100 px-10">
                  <Image
                    //source={image}
                    style={{
                      resizeMode: 'contain',
                      width: 220,
                      height: 150,
                    }}
                  />
                </View>

                <Text
                  className="text-gray-100 px-20 py-24"
                  style={{ fontSize: 220 }}
                >
                  ${item[price]}
                </Text>

                <Text className="text-6xl text-gray-800 bg-gray-100 px-10 py-10">
                  {DESCRIPCION}
                </Text>
              </>
            </LinearGradient>
          </Animated.View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

export default Item;
