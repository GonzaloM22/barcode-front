import React, { useRef, useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BarcodeForm = ({ setBarcode, barcode, setModalCarousel, handleSubmit }) => {
  const textInputRef = useRef(null);
  const [blur, setBlur] = useState(false);

  const handleBlur = () => setBlur(!blur);

  useEffect(() => {
    if (blur && barcode === '') setModalCarousel(false);
    if (textInputRef.current && barcode === '') textInputRef.current.focus()
  }, [barcode, blur]);

  /*const handleSubmit = async () => {     
    
    setBarcode(data);}*/


  return (
    <LinearGradient colors={['#182848', '#182848']}>
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
    </LinearGradient>
  );
};

export default BarcodeForm;
