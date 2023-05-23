import React, { useRef, useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BarcodeForm = ({ setBarcode, barcode }) => {
  const [ data, setData ] = useState({});
  const textInputRef = useRef(null);
  const [blur, setBlur]=useState(false)

  const handleBlur = () => setBlur(!blur);

  useEffect(() => {
    if (textInputRef.current && barcode === '') textInputRef.current.focus();
  }, [barcode, blur]);

  const handleSubmit = () => setBarcode(data);

  return (
    <LinearGradient colors={['#182848', '#182848']}>
      <TextInput
        ref={textInputRef}
        value={barcode}
        autoFocus={true}
        caretHidden={true}
        className="text-transparent"
        showSoftInputOnFocus={false}
        onChangeText={setData}
        onSubmitEditing={handleSubmit}
        onBlur={handleBlur}
      />
    </LinearGradient>
  );
};

export default BarcodeForm;
