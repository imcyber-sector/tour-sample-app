import type { Option } from "./option";

export interface Product {
    id: string,
    name: string,
    options: Option[],
    defaultCurrency: string, // "EUR
    availableCurrencies: string[] // ["EUR", "USD"]
  }