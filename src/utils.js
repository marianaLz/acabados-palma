export const formatDate = (date, size) =>
  new Intl.DateTimeFormat(
    'es-MX',
    size === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } : {}
  ).format(new Date(date));

export const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    currencyDisplay: 'symbol',
  }).format(price);

export const calculateTotalPrice = (items) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return formatPrice(totalPrice);
};
