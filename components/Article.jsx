import { Text, View } from 'react-native';

const Article = ({ article }) => {
  return (
    <View className="space-y-5 mt-10 flex items-center">
      <Text className="text-2xl font-bold">Descripción: {article.DESCRIPCION}</Text>
      <Text className="text-xl">Precio: ${article.PRECIOLISTA1}</Text>
    </View>
  );
};

export default Article;
