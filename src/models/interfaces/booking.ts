import type { Contact } from "./contact";
import type { Pricing } from "./pricing";
import type { UnitItem } from "./unitItem";

export interface Booking {
    id?: string,
    productId: string,
    optionId: string,
    pricing: Pricing,
    unitItems: UnitItem[],
    contact?: Contact,
  }