/**
 * The `formatDate` function takes a date string in the format 'YYYY-MM-DD' and returns a formatted
 * date string based on the specified size.
 * @param date - The `date` parameter is a string representing a date in the format "YYYY-MM-DD".
 * @param [size=short] - The `size` parameter in the `formatDate` function is used to specify the size
 * or format of the month in the formatted date. It has a default value of `'short'`, which means that
 * the month will be displayed as a short abbreviation (e.g., Jan, Feb, Mar).
 * @returns The function `formatDate` returns a formatted date string based on the input `date` and
 * `size` parameters.
 */
export const formatDate = (date, size = 'short') => {
  const [year, month, day] = date.split('-');
  const formattedDate = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: size,
    day: 'numeric',
  }).format(formattedDate);
};

/**
 * The formatPrice function formats a given price value as a currency in Mexican Pesos (MXN).
 * @param price - The `price` parameter is the numerical value that you want to format as a price.
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    currencyDisplay: 'symbol',
  }).format(price);

/**
 * The function calculates the total price of items by multiplying the price of each item by its
 * quantity and then formats the total price.
 * @param items - An array of objects representing items. Each item object should have a "price"
 * property representing the price of the item, and a "quantity" property representing the quantity of
 * the item.
 * @returns the total price of the items, formatted as a string.
 */
export const calculateTotalPrice = (items) => {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return totalPrice;
};
