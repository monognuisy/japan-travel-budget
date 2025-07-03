import type { TravelState, CostBreakdown, CostRange } from '../types/travel';
import {
  locationCosts,
  dailyHotelCosts,
  extraOptionCosts,
} from '../data/constants';

// 인원수에 따른 호텔 키 계산
export const getHotelPeopleKey = (people: number): 1 | 2 | 'default' => {
  if (people === 1) return 1;
  if (people === 2) return 2;
  return 'default';
};

// 실제 여행 일수 계산 (공항 출/도착일 합쳐서 하루로 계산)
export const getRealDays = (days: number): number => {
  return days === 1 ? 1 : days - 1;
};

// 일일 식비 계산
export const getDailyFoodCost = (days: number): number => {
  return days === 1 ? 30000 : 50000;
};

// 전체 비용 계산
export const calculateTravelCosts = (state: TravelState): CostBreakdown => {
  const { location, days, people, drink, busy } = state;

  // 기본 설정
  const hotelPeopleKey = getHotelPeopleKey(people);
  const locationCost = locationCosts[location];
  const dailyHotelCost = dailyHotelCosts[hotelPeopleKey];
  const realDays = getRealDays(days);

  // 고정 비용
  const airportFee = 30000; // 공항 - 도심간 왕복 이동 비용
  const flightPremium = busy ? extraOptionCosts.busy.total : 0;
  const alpha = 100000; // 기타 비용

  const fixedCosts = {
    flight: locationCost,
    flightPremium,
    airportTransport: airportFee,
    extra: alpha,
    total: locationCost.avg + flightPremium + airportFee + alpha,
  };

  // 숙박 비용
  const dailyBusyCost = busy ? extraOptionCosts.busy.daily : 0;
  const nights = days === 1 ? 0 : days - 1;
  const accommodation = {
    dailyCost: {
      min: dailyHotelCost.min + dailyBusyCost,
      max: dailyHotelCost.max + dailyBusyCost,
      avg: dailyHotelCost.avg + dailyBusyCost,
    },
    totalCost: (dailyHotelCost.avg + dailyBusyCost) * nights,
    nights,
  };

  // 일일 지출
  const dailyFoodCost = getDailyFoodCost(days);
  const dailyDrinkCost = drink ? extraOptionCosts.drink.daily : 0;
  const dailyExtraCost = 15000;
  const dailyTransportFee = 15000;

  const dailyExpenses = {
    food: dailyFoodCost,
    drink: dailyDrinkCost,
    transport: dailyTransportFee,
    extra: dailyExtraCost,
    total: dailyFoodCost + dailyDrinkCost + dailyTransportFee + dailyExtraCost,
    days: realDays,
    totalCost:
      (dailyFoodCost + dailyDrinkCost + dailyTransportFee + dailyExtraCost) *
      realDays,
  };

  // 총 비용 계산
  const totalCost: CostRange = {
    min:
      fixedCosts.flight.min +
      fixedCosts.flightPremium +
      fixedCosts.airportTransport +
      fixedCosts.extra +
      dailyExpenses.totalCost +
      accommodation.dailyCost.min * nights,
    max:
      fixedCosts.flight.max +
      fixedCosts.flightPremium +
      fixedCosts.airportTransport +
      fixedCosts.extra +
      dailyExpenses.totalCost +
      accommodation.dailyCost.max * nights,
    avg: fixedCosts.total + dailyExpenses.totalCost + accommodation.totalCost,
  };

  return {
    fixedCosts,
    accommodation,
    dailyExpenses,
    totalCost,
  };
};
