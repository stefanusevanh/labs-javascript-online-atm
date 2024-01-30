function numberInRupiahFormat(number) {
  let rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return rupiah.format(number).replace("Rp", "Rp.");
}
export default numberInRupiahFormat;
