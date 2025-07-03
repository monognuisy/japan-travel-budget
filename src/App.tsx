import { useState } from 'react';
import {
  locationEntries,
  type LocationEntry,
  locationCosts,
  dailyHotelCosts,
  extraOptionCosts,
} from './data/constants';
import RadioButtons from './components/RadioButtons';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Separator } from './components/ui/separator';

function App() {
  const [location, setLocation] = useState<LocationEntry['value']>('default');
  const [days, setDays] = useState<number>(1);
  const [people, setPeople] = useState<number>(1);
  const [drink, setDrink] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [isRange, setIsRange] = useState<boolean>(false);

  const hotelPeopleKey = people === 1 ? 1 : people === 2 ? 2 : 'default';

  const locationCost = locationCosts[location];
  const dailyHotelCost = dailyHotelCosts[hotelPeopleKey];

  const airportFee = 30000; // 공항 - 도심간 왕복 이동 비용
  const flightPremium = busy ? extraOptionCosts.busy.total : 0;
  const dailyFoodCost = 50000; // 일일 식비
  const dailyDrinkCost = drink ? extraOptionCosts.drink.daily : 0;
  const dailyExtraCost = 5000;
  const dailyTransportFee = 15000;
  const dailyBusyCost = busy ? extraOptionCosts.busy.daily : 0;
  const dailyExpense =
    dailyFoodCost + dailyDrinkCost + dailyTransportFee + dailyExtraCost;

  const alpha = 100000;

  const totalCostRange = {
    min:
      locationCost.min +
      airportFee +
      flightPremium +
      alpha +
      (dailyExpense + dailyHotelCost.min + dailyBusyCost) * (days - 1),
    max:
      locationCost.max +
      airportFee +
      flightPremium +
      alpha +
      (dailyExpense + dailyHotelCost.max + dailyBusyCost) * (days - 1),
  };

  const totalCost = (totalCostRange.max + totalCostRange.min) / 2;

  const handleLocationChange = (value: LocationEntry['value']) => {
    setLocation(value);
  };

  return (
    <div className="mx-auto max-w-[1200px] border border-gray-300 rounded-lg mt-10 shadow-lg">
      <header
        className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-6 
      rounded-lg rounded-b-none 
      flex flex-col gap-2"
      >
        <h1 className="text-3xl font-semibold">일본 단기여행 경비 계산기</h1>
        <p className="text-sm opacity-80">
          여행 장소, 일수에 따른 대략적인 일본 여행 경비를 계산해드립니다.
        </p>
      </header>

      <main className="p-6 grid grid-cols-[2fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">장소</h2>
            <RadioButtons
              values={locationEntries}
              selectedValue={location}
              onChange={handleLocationChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">기간</h2>
            <Input
              type="number"
              value={days}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) {
                  setDays(1);
                } else if (value > 12) {
                  setDays(12);
                } else {
                  setDays(value);
                }
              }}
              min={1}
              max={12}
              className="w-24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">인원</h2>
            <Input
              type="number"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              min={1}
              className="w-24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">추가 옵션</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="drink"
                  checked={drink}
                  onCheckedChange={(checked) =>
                    setDrink(checked === 'indeterminate' ? true : checked)
                  }
                />
                <label htmlFor="drink">술을 마실 예정입니다.</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="busy"
                  checked={busy}
                  onCheckedChange={(checked) =>
                    setBusy(checked === 'indeterminate' ? false : checked)
                  }
                />
                <label htmlFor="busy">성수기에 여행할 예정입니다.</label>
              </div>
            </div>
          </div>
        </div>

        {/* 영수증 영역 */}
        <div className="flex flex-col mt-4">
          <div className="flex items-center gap-2 justify-between mb-8">
            <h2 className="text-2xl font-bold">예상 경비</h2>
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="isRange"
                checked={isRange}
                onCheckedChange={(checked) =>
                  setIsRange(checked === 'indeterminate' ? false : checked)
                }
              />
              <label htmlFor="isRange">범위 보기</label>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-lg font-semibold">고정 지출</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>항공권 비용:</p>
              {isRange ? (
                <p className="text-right">
                  {(locationCost.min + flightPremium).toLocaleString()}원 ~{' '}
                  {(locationCost.max + flightPremium).toLocaleString()}원
                </p>
              ) : (
                <p className="text-right">
                  {(locationCost.avg + flightPremium).toLocaleString()}원
                </p>
              )}

              <p>공항 왕복 교통비:</p>
              <p className="text-right">{airportFee.toLocaleString()}원</p>

              <p>기타 비용:</p>
              <p className="text-right">{alpha.toLocaleString()}원</p>
            </div>
          </div>

          <Separator className="my-2" />
          <p className="text-right text-sm font-bold">
            {(
              locationCost.avg +
              flightPremium +
              airportFee +
              alpha
            ).toLocaleString()}
            원
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-lg font-semibold">숙박 비용</h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>숙박 비용:</p>
              {isRange ? (
                <p className="text-right">
                  {(dailyHotelCost.min + dailyBusyCost).toLocaleString()}원 ~{' '}
                  {(dailyHotelCost.max + dailyBusyCost).toLocaleString()}원{' '}
                  <span className="text-gray-500 font-semibold">
                    × {days - 1}박
                  </span>
                </p>
              ) : (
                <p className="text-right">
                  {(dailyHotelCost.avg + dailyBusyCost).toLocaleString()}원{' '}
                  <span className="text-gray-500 font-semibold">
                    × {days - 1}박
                  </span>
                </p>
              )}
            </div>
          </div>

          <Separator className="my-2" />
          <p className="text-right text-sm">
            <span className="font-bold">
              {(
                (dailyHotelCost.avg + dailyBusyCost) *
                (days - 1)
              ).toLocaleString()}
              원
            </span>
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-lg font-semibold">일일 지출</h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>식비:</p>
              <p className="text-right">{dailyFoodCost.toLocaleString()}원</p>

              {drink && (
                <>
                  <p>술 값:</p>
                  <p className="text-right">
                    {dailyDrinkCost.toLocaleString()}원
                  </p>
                </>
              )}

              <p>일일 교통비:</p>
              <p className="text-right">
                {dailyTransportFee.toLocaleString()}원
              </p>

              <p>추가 비용:</p>
              <p className="text-right">{dailyExtraCost.toLocaleString()}원</p>
            </div>
          </div>

          <Separator className="my-2" />
          <p className="text-right text-sm">
            {dailyExpense.toLocaleString()}원{' '}
            <span className="text-gray-500 font-semibold">× {days - 1}일</span>
            <span className="font-bold">
              = {(dailyExpense * (days - 1)).toLocaleString()}원
            </span>
          </p>

          <div className="flex items-center gap-2 justify-between font-bold mt-8 text-lg">
            <p>총 비용:</p>
            <p className="text-right">{totalCost.toLocaleString()}원</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
