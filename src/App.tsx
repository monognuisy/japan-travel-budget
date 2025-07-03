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
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip';
import {
  CircleQuestionMarkIcon,
  Calculator,
  CopyrightIcon,
} from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { cn } from './lib/utils';

function App() {
  const [location, setLocation] = useState<LocationEntry['value']>('default');
  const [days, setDays] = useState<number>(1);
  const [people, setPeople] = useState<number>(1);
  const [drink, setDrink] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [isRange, setIsRange] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const hotelPeopleKey = people === 1 ? 1 : people === 2 ? 2 : 'default';

  const locationCost = locationCosts[location];
  const dailyHotelCost = dailyHotelCosts[hotelPeopleKey];

  const realDays = days === 1 ? 1 : days - 1;

  const airportFee = 30000; // 공항 - 도심간 왕복 이동 비용
  const flightPremium = busy ? extraOptionCosts.busy.total : 0;
  const dailyFoodCost = days === 1 ? 30000 : 50000; // 일일 식비
  const dailyDrinkCost = drink ? extraOptionCosts.drink.daily : 0;
  const dailyExtraCost = 15000;
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
      dailyExpense * realDays +
      (days === 1 ? 0 : dailyHotelCost.min + dailyBusyCost) * (days - 1),
    max:
      locationCost.max +
      airportFee +
      flightPremium +
      alpha +
      dailyExpense * realDays +
      (days === 1 ? 0 : dailyHotelCost.max + dailyBusyCost) * (days - 1),
  };

  const totalCost = (totalCostRange.max + totalCostRange.min) / 2;

  const handleLocationChange = (value: LocationEntry['value']) => {
    setLocation(value);
  };

  // 영수증 컴포넌트
  const ReceiptContent = () => (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col lg:flex-row items-center gap-2 justify-between mb-8">
        <h2 className="text-2xl font-bold">예상 경비 (1인당)</h2>
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            id="isRange"
            checked={isRange}
            onCheckedChange={(checked) =>
              setIsRange(checked === 'indeterminate' ? false : checked)
            }
          />
          <label htmlFor="isRange" className="flex items-center gap-1">
            범위 보기{' '}
            <Tooltip>
              <TooltipTrigger>
                <CircleQuestionMarkIcon className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  항공권과 숙박비 참고용입니다. 실제 계산은 평균가로 진행됩니다.
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-lg font-semibold">고정 지출</h3>
        <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
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

          <p className="flex items-center gap-1">
            기타 비용:
            <Tooltip>
              <TooltipTrigger>
                <CircleQuestionMarkIcon className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>쇼핑 등에 사용되는 비용이나, 예비 비용을 포함한 값입니다.</p>
              </TooltipContent>
            </Tooltip>
          </p>
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

        <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
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
          {((dailyHotelCost.avg + dailyBusyCost) * (days - 1)).toLocaleString()}
          원
        </span>
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-lg font-semibold flex items-center gap-1">
          일일 지출
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMarkIcon className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                공항 출/도착일을 합쳐 하루로 계산합니다.
                <br />
                즉, 당일치기가 아닌 이상, n-1 일로 계산됩니다.
              </p>
            </TooltipContent>
          </Tooltip>
        </h3>

        <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
          <p>식비:</p>
          <p className="text-right">{dailyFoodCost.toLocaleString()}원</p>

          {drink && (
            <>
              <p>술 값:</p>
              <p className="text-right">{dailyDrinkCost.toLocaleString()}원</p>
            </>
          )}

          <p>일일 교통비:</p>
          <p className="text-right">{dailyTransportFee.toLocaleString()}원</p>

          <p className="flex items-center gap-1">
            추가 비용:
            <Tooltip>
              <TooltipTrigger>
                <CircleQuestionMarkIcon className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>여행에 필요한 간단한 물, 간식 비용입니다. </p>
              </TooltipContent>
            </Tooltip>
          </p>
          <p className="text-right">{dailyExtraCost.toLocaleString()}원</p>
        </div>
      </div>

      <Separator className="my-2" />
      <p className="text-right text-sm">
        {dailyExpense.toLocaleString()}원{' '}
        <span className="text-gray-500 font-semibold">× {realDays}일</span>
        <span className="font-bold">
          = {(dailyExpense * realDays).toLocaleString()}원
        </span>
      </p>

      <div className="flex items-center gap-2 justify-between font-bold mt-8 text-lg">
        <p>총 비용:</p>
        <p className="text-right">{totalCost.toLocaleString()}원</p>
      </div>
    </div>
  );

  return (
    <div>
      <div
        className="mx-auto max-w-[1200px] min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-5rem)] 
      bg-white border border-gray-300 rounded-lg shadow-lg
      flex flex-col"
      >
        <header
          className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-6 
      rounded-lg rounded-b-none 
      flex flex-col gap-2"
        >
          <h1 className="text-2xl lg:text-3xl font-semibold">
            일본 단기여행 경비 계산기
          </h1>
          <p className="text-sm opacity-80">
            여행 장소, 일수에 따른 대략적인 일본 여행 경비를 계산해드립니다.
          </p>
        </header>

        <main
          className={cn(
            'p-6 flex-1',
            isLargeScreen ? 'grid grid-cols-[2fr_1fr] gap-6' : 'flex flex-col',
          )}
        >
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
              <h2 className="text-lg font-semibold">기간 (일)</h2>
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
                className="w-full lg:w-24"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">인원</h2>
              <Input
                type="number"
                value={people}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < 0) {
                    setPeople(1);
                  } else if (value > 10) {
                    setPeople(10);
                  } else {
                    setPeople(value);
                  }
                }}
                min={1}
                max={10}
                className="w-full lg:w-24"
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
                      setDrink(checked === 'indeterminate' ? false : checked)
                    }
                  />
                  <label htmlFor="drink">술을 자주 마실 예정입니다.</label>
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

          {/* 데스크톱에서 영수증 영역 */}
          {isLargeScreen && <ReceiptContent />}

          {/* 모바일에서 계산 결과 보기 버튼 */}
          {!isLargeScreen && (
            <div className="flex justify-center mt-auto">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="lg" className="w-full max-w-sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    계산 결과 보기
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[80vh] w-[95%] rounded-xl rounded-b-none mx-auto overflow-y-auto p-6"
                >
                  <ReceiptContent />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </main>
      </div>

      <Separator className="my-10 bg-gray-200 w-full max-w-[calc(100%-5rem)] mx-auto" />

      <p className="mx-auto text-center text-sm text-gray-400 flex items-center gap-1 justify-center">
        <span>
          <CopyrightIcon className="w-4 h-4 inline-block" /> All rights
          reserved. 2025. <br className="block sm:hidden" />
          <a href="https://github.com/monognuisy">Sungmin Yoo, monognuisy</a>
        </span>
      </p>
    </div>
  );
}

export default App;
