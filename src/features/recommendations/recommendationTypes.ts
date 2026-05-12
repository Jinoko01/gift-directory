import type { GiftPerson } from "../people/peopleTypes";

export type GiftOccasion =
  | "birthday"
  | "thanks"
  | "comfort"
  | "anniversary"
  | "cuteBoost";

export interface BudgetRange {
  min: number;
  max: number;
}

export interface GiftRecommendation {
  id: string;
  title: string;
  reason: string;
  cutePoint: string;
  caution: string;
  estimatedPrice: BudgetRange;
  matchedTags: string[];
}

export interface RecommendationRequest {
  person: GiftPerson;
  occasion: GiftOccasion;
  budget: BudgetRange;
}
