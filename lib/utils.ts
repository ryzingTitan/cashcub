export function formatToCurrency(
  amount: number | undefined,
  currencyCode: string = "USD",
  locale: string = "en-US",
): string {
  if (amount === undefined) {
    return "$0.00";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
