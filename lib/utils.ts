export function formatToCurrency(
  amount: number | undefined | null,
  currencyCode: string = "USD",
  locale: string = "en-US",
): string {
  if (amount === undefined || amount === null) {
    return "$0.00";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
