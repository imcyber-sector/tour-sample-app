import type { UnitID } from "../enums/unitID";
import type { Pricing } from "./pricing";

export interface Unit {
    id: UnitID, // enum
    name: string,
    pricing: Pricing[]
  }