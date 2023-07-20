import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';

const BarcodeForm = ({
  setBarcode,
  barcode,
  setModalCarousel,
  handleSubmit,
}) => {
  const textInputRef = useRef(null);
  const [blur, setBlur] = useState(false);

  const handleBlur = () => setBlur(!blur);

  useEffect(() => {
    if (blur && barcode === '') setModalCarousel(false);
    if (textInputRef.current && barcode === '') textInputRef.current.focus();
  }, [barcode, blur]);

  return (
    <View className="bg-gray-100">
      <TextInput
        ref={textInputRef}
        value={barcode}
        autoFocus={true}
        caretHidden={true}
        className="text-transparent"
        showSoftInputOnFocus={false}
        onChangeText={setBarcode}
        onSubmitEditing={() => handleSubmit(barcode)}
        onBlur={handleBlur}
      />
    </View>
  );
};

export default BarcodeForm;
