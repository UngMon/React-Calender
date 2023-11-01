import { MutableRefObject } from "react";

type RefType = MutableRefObject<HTMLDivElement | null>;

export interface RefMap {
  [key: string]: RefType;
}

export interface ListOrMore {
  [key: string]: HTMLDivElement | null;
}

export interface ButtonRef {
  [key: string]: HTMLDivElement | HTMLButtonElement | HTMLTableRowElement | null;
}

export interface TableRef {
  [key: string]: HTMLTableRowElement | null;
}