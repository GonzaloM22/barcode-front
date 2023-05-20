import React, { useRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';

const BarcodeForm = ({ setBarcode, barcode }) => {
  const textInputRef = useRef(null);
  let typingTimer = useRef(null);

  useEffect(() => {
    if (textInputRef.current && barcode === '') textInputRef.current.focus();
  }, [barcode]);

  const handleOnChange = (event) => {
    const data = event.nativeEvent.text;
    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      setBarcode(data);
    }, 100);
  };

  return (
    <View className="flex justify-center flex-row items-center gap-4 p-10 mt-10">
      <TextInput
        ref={textInputRef}
        value={barcode}
        autoFocus={true}
        caretHidden={true}
        onChange={handleOnChange}
        className="text-transparent"
        showSoftInputOnFocus={false}
      />
    </View>
  );
};

export default BarcodeForm;
