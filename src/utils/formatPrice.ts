export const getFormatPrice = (price:number) => {
  if(typeof price === 'string') {
    return parseFloat(price).toLocaleString('vi', {style : 'currency', currency : 'VND'})
  }
  return price.toLocaleString('vi', {style : 'currency', currency : 'VND'})
};
