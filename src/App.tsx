import { locationEntries, type LocationEntry } from './data/constants';
import RadioButtons from './components/RadioButtons';
import { Receipt } from './components/Receipt';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Calculator, CopyrightIcon } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useTravelState } from './hooks/useTravelState';
import { cn } from './lib/utils';

function App() {
  const {
    location,
    drink,
    busy,
    isRange,
    sheetOpen,
    costBreakdown,
    daysInput,
    peopleInput,
    setLocation,
    setDays,
    setPeople,
    setDaysInput,
    setPeopleInput,
    setDrink,
    setBusy,
    setIsRange,
    setSheetOpen,
  } = useTravelState();

  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const handleLocationChange = (value: LocationEntry['value']) => {
    setLocation(value);
  };

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
                value={daysInput}
                onChange={(e) => setDaysInput(e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === '' || Number(value) < 1) {
                    setDays(1);
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
                value={peopleInput}
                onChange={(e) => setPeopleInput(e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === '' || Number(value) < 1) {
                    setPeople(1);
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
          {isLargeScreen && (
            <Receipt
              costBreakdown={costBreakdown}
              isRange={isRange}
              setIsRange={setIsRange}
              drink={drink}
            />
          )}

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
                  <Receipt
                    costBreakdown={costBreakdown}
                    isRange={isRange}
                    setIsRange={setIsRange}
                    drink={drink}
                  />
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
