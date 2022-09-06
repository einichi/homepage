const roundToNearest = (value, step) => {
  return Math.round(value / step) * step
}

//TODO: If there's no differences between JPY and USD other than Yen not having the fractional amount, these could be simplified
export const formatJPY = (number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })
    .format(number)
    .slice(1) //To remove the curency symbol

export const formatUSD = (number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
    .format(number)
    .slice(1)

/***
 *
 * @param yen The value to convert in Yen
 * @param exchangeRate The exchange rate
 * @returns {string} The JPY value converted to USD
 */
export const jpyToUSD = (yen, exchangeRate) => {
  const STEP = 200
  return formatUSD(roundToNearest(yen * exchangeRate, STEP))
}
