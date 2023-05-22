import React, { useRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    }, 300);
  };

  return (
    <LinearGradient colors={['#182848', '#182848']}>
      <TextInput
        ref={textInputRef}
        value={barcode}
        autoFocus={true}
        caretHidden={true}
        onChange={handleOnChange}
        className="text-transparent"
        showSoftInputOnFocus={false}
      />
    </LinearGradient>
  );
};

export default BarcodeForm;
