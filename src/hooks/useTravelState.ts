import { useState, useMemo } from 'react';
import type { TravelState, DisplaySettings } from '../types/travel';
import type { LocationEntry } from '../data/constants';
import { calculateTravelCosts } from '../utils/costCalculation';

export const useTravelState = () => {
  // 여행 상태
  const [travelState, setTravelState] = useState<TravelState>({
    location: 'default' as LocationEntry['value'],
    days: 1,
    people: 1,
    drink: false,
    busy: false,
  });

  // 입력 상태 (문자열로 관리)
  const [inputState, setInputState] = useState({
    days: '1',
    people: '1',
  });

  // 표시 설정
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    isRange: false,
    sheetOpen: false,
  });

  // 비용 계산 (메모이제이션)
  const costBreakdown = useMemo(
    () => calculateTravelCosts(travelState),
    [travelState],
  );

  // 상태 업데이트 함수들
  const updateTravelState = (updates: Partial<TravelState>) => {
    setTravelState((prev) => ({ ...prev, ...updates }));
  };

  const updateDisplaySettings = (updates: Partial<DisplaySettings>) => {
    setDisplaySettings((prev) => ({ ...prev, ...updates }));
  };

  // 개별 상태 업데이트 함수들
  const setLocation = (location: LocationEntry['value']) => {
    updateTravelState({ location });
  };

  const setDaysInput = (value: string) => {
    setInputState((prev) => ({ ...prev, days: value }));
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      const validDays = Math.max(1, Math.min(12, numValue));
      updateTravelState({ days: validDays });
    }
  };

  const setPeopleInput = (value: string) => {
    setInputState((prev) => ({ ...prev, people: value }));
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      const validPeople = Math.max(1, Math.min(10, numValue));
      updateTravelState({ people: validPeople });
    }
  };

  const setDays = (days: number) => {
    const validDays = Math.max(1, Math.min(12, days));
    setInputState((prev) => ({ ...prev, days: validDays.toString() }));
    updateTravelState({ days: validDays });
  };

  const setPeople = (people: number) => {
    const validPeople = Math.max(1, Math.min(10, people));
    setInputState((prev) => ({ ...prev, people: validPeople.toString() }));
    updateTravelState({ people: validPeople });
  };

  const setDrink = (drink: boolean) => {
    updateTravelState({ drink });
  };

  const setBusy = (busy: boolean) => {
    updateTravelState({ busy });
  };

  const setIsRange = (isRange: boolean) => {
    updateDisplaySettings({ isRange });
  };

  const setSheetOpen = (sheetOpen: boolean) => {
    updateDisplaySettings({ sheetOpen });
  };

  return {
    // 상태
    travelState,
    displaySettings,
    costBreakdown,

    // 개별 상태 값들 (기존 코드와의 호환성을 위해)
    location: travelState.location,
    days: travelState.days,
    people: travelState.people,
    drink: travelState.drink,
    busy: travelState.busy,
    isRange: displaySettings.isRange,
    sheetOpen: displaySettings.sheetOpen,

    // 입력 상태 값들
    daysInput: inputState.days,
    peopleInput: inputState.people,

    // 상태 업데이트 함수들
    setLocation,
    setDays,
    setPeople,
    setDaysInput,
    setPeopleInput,
    setDrink,
    setBusy,
    setIsRange,
    setSheetOpen,
    updateTravelState,
    updateDisplaySettings,
  };
};
