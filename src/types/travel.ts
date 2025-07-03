import type { LocationEntry } from '../data/constants';

export interface TravelState {
  location: LocationEntry['value'];
  days: number;
  people: number;
  drink: boolean;
  busy: boolean;
}

export interface CostRange {
  min: number;
  max: number;
  avg: number;
}

export interface CostBreakdown {
  fixedCosts: {
    flight: CostRange;
    flightPremium: number;
    airportTransport: number;
    extra: number;
    total: number;
  };
  accommodation: {
    dailyCost: CostRange;
    totalCost: number;
    nights: number;
  };
  dailyExpenses: {
    food: number;
    drink: number;
    transport: number;
    extra: number;
    total: number;
    days: number;
    totalCost: number;
  };
  totalCost: CostRange;
}

export interface DisplaySettings {
  isRange: boolean;
  sheetOpen: boolean;
}
