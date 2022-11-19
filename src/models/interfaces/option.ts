import type { ContactField } from "../enums/contactField";
import type { Unit } from "./unit";

export interface Option {
    id: string,
    default: boolean,
    name: string,
    requiredContactFields: ContactField[], // enum
    units: Unit[]
  }