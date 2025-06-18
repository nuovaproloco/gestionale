export interface Listitem {
  id: string;
  name: string;
  number: number;
  unit?: string;
}

export interface Product {
  label: string
  id: number
  price: number
  quantity: number
  category?: string
}

export type Tabs = "magazzino" | "carrello" | "incassi";
export type CashFlow = { [x: string]: Product[] };