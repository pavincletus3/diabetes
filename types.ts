
export enum LiteracyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum IncomeLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum LocationType {
  URBAN = 'urban',
  RURAL = 'rural',
}

export interface FormData {
  medicalAnalyses: string;
  weight: string; // Kept as string for input, convert to number later
  dietaryHabits: string;
  allergies: string;
  calorieTarget: string; // Kept as string for input
  incomeLevel: IncomeLevel;
  location: LocationType;
  educationLevel: string;
  literacyLevel: LiteracyLevel;
}

// For low literacy plan
export interface LowLiteracyMeal {
  description: string;
  visualFoodItems: string[];
}

export interface LowLiteracyDayPlan {
  day: string;
  meals: {
    breakfast: LowLiteracyMeal;
    lunch: LowLiteracyMeal;
    dinner: LowLiteracyMeal;
    snacks: LowLiteracyMeal;
  };
}

export interface LowLiteracyNutritionPlan {
  planTitle: string;
  days: LowLiteracyDayPlan[];
  generalTips: string[];
}

// For standard plan
export interface StandardDayPlan {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  micronutrientsFocus?: string[];
  notes?: string;
}

export interface StandardNutritionPlan {
  planTitle: string;
  days: StandardDayPlan[];
  generalRecommendations: string[];
  foodShoppingSuggestions?: {
    proteins: string[];
    vegetables: string[];
    grains: string[];
    notes: string;
  };
}

export type NutritionPlan = StandardNutritionPlan | LowLiteracyNutritionPlan;

export interface ApiKey {
  key: string | null;
}
