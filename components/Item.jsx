import { View, Text } from 'react-native';

const Item = ({ item }) => {
  return (
    <View className="flex items-center space-y-8">
      <Text className="text-4xl font-bold">{item.DESCRIPCION}</Text>
      <Text className="text-4xl">${item.PRECIOLISTA1}</Text>
    </View>
  );
};

export default Item;
