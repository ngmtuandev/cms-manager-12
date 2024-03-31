export const FormatMoney = (money: number) => {
  return Number(money).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
