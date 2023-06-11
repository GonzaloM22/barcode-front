const FormatNumber = (number) => {
  number = number ? number : 0.0;
  return number.toLocaleString('es-AR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export default FormatNumber;
