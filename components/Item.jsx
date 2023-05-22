import { View, Text, Modal, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Item = ({ item, modalItem, loading }) => {
  const image = require('../assets/img/logo.png');

  return (
    <Modal visible={modalItem} animationType="fade" statusBarTranslucent={true}>
      <LinearGradient
        colors={['#4b6cb7', '#182848']}
        className="flex-1 justify-between"
      >
        <>
          <View className="bg-gray-100 px-10">
            <Image
              source={image}
              style={{
                resizeMode: 'contain',
                width: 220,
                height: 150,
              }}
            />
          </View>

          <Text
            className="text-gray-100 px-20 py-24 "
            style={{ fontSize: 220 }}
          >
            ${item.PRECIOLISTA1}
          </Text>

          <Text className="text-7xl text-gray-800 bg-gray-100 px-10 py-10">
            {item.DESCRIPCION}
          </Text>
        </>
      </LinearGradient>
    </Modal>
  );
};

export default Item;
