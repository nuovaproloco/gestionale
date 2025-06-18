export function currencyFormatter(x: number): string {
  return new Intl.NumberFormat("it-IT", {
    currency: "EUR",
    style: "currency",
  }).format(x);
}
