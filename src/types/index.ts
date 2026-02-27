export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface SearchFilters {
  from: string;
  to: string;
  dateStart: string;
  dateEnd: string;
  nightsMin: number;
  nightsMax: number;
  adults: number;
  children: number;
  budget: number;
  stars: string;
  meals: string;
  currency: string;
  flightType: string;
  beachLine: string;
  rating: string;
  operator: string;
}
