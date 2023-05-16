import React from 'react';
import { Text, View, TextInput, Pressable } from 'react-native';

const FormCode = ({ setbarcode, barcode, handleSubmit }) => {
  return (
    <View className="flex justify-center flex-row items-center gap-4 p-10 mt-10">
      <TextInput
        placeholder="Código de Barras"
        value={barcode}
        onChangeText={setbarcode}
        className="rounded-md px-2 py-1 w-full bg-gray-100 shadow-md"
      />
      <Pressable
        onPress={handleSubmit}
        className="bg-zinc-800 rounded-md py-2 px-3 shadow-md"
      >
        <Text className="text-white">Buscar</Text>
      </Pressable>
    </View>
  );
};

export default FormCode;
