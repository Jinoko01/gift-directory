export type Relationship =
  | "friend"
  | "partner"
  | "family"
  | "coworker"
  | "other";

export interface GiftPerson {
  id: string;
  name: string;
  relationship: Relationship;
  favoriteColors: string[];
  favoriteAnimals: string[];
  favoriteStyles: string[];
  hobbies: string[];
  avoidItems: string[];
  preferredBudgetMin: number;
  preferredBudgetMax: number;
  specialDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GiftPersonInput {
  name: string;
  relationship: Relationship;
  favoriteColors: string[];
  favoriteAnimals: string[];
  favoriteStyles: string[];
  hobbies: string[];
  avoidItems: string[];
  preferredBudgetMin: number;
  preferredBudgetMax: number;
  specialDates: string[];
}
