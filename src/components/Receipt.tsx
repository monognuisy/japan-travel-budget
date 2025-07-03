import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { CircleQuestionMarkIcon } from 'lucide-react';
import type { CostBreakdown } from '../types/travel';

interface ReceiptProps {
  costBreakdown: CostBreakdown;
  isRange: boolean;
  setIsRange: (isRange: boolean) => void;
  drink: boolean;
}

export const Receipt = ({
  costBreakdown,
  isRange,
  setIsRange,
  drink,
}: ReceiptProps) => {
  const { fixedCosts, accommodation, dailyExpenses, totalCost } = costBreakdown;

  return (
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
              {(
                fixedCosts.flight.min + fixedCosts.flightPremium
              ).toLocaleString()}
              원 ~{' '}
              {(
                fixedCosts.flight.max + fixedCosts.flightPremium
              ).toLocaleString()}
              원
            </p>
          ) : (
            <p className="text-right">
              {(
                fixedCosts.flight.avg + fixedCosts.flightPremium
              ).toLocaleString()}
              원
            </p>
          )}

          <p>공항 왕복 교통비:</p>
          <p className="text-right">
            {fixedCosts.airportTransport.toLocaleString()}원
          </p>

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
          <p className="text-right">{fixedCosts.extra.toLocaleString()}원</p>
        </div>
      </div>

      <Separator className="my-2" />
      <p className="text-right text-sm font-bold">
        {fixedCosts.total.toLocaleString()}원
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-lg font-semibold">숙박 비용</h3>

        <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
          <p>숙박 비용:</p>
          {isRange ? (
            <p className="text-right">
              {accommodation.dailyCost.min.toLocaleString()}원 ~{' '}
              {accommodation.dailyCost.max.toLocaleString()}원{' '}
              <span className="text-gray-500 font-semibold">
                × {accommodation.nights}박
              </span>
            </p>
          ) : (
            <p className="text-right">
              {accommodation.dailyCost.avg.toLocaleString()}원{' '}
              <span className="text-gray-500 font-semibold">
                × {accommodation.nights}박
              </span>
            </p>
          )}
        </div>
      </div>

      <Separator className="my-2" />
      <p className="text-right text-sm">
        <span className="font-bold">
          {accommodation.totalCost.toLocaleString()}원
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
          <p className="text-right">{dailyExpenses.food.toLocaleString()}원</p>

          {drink && (
            <>
              <p>술 값:</p>
              <p className="text-right">
                {dailyExpenses.drink.toLocaleString()}원
              </p>
            </>
          )}

          <p>일일 교통비:</p>
          <p className="text-right">
            {dailyExpenses.transport.toLocaleString()}원
          </p>

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
          <p className="text-right">{dailyExpenses.extra.toLocaleString()}원</p>
        </div>
      </div>

      <Separator className="my-2" />
      <p className="text-right text-sm">
        {dailyExpenses.total.toLocaleString()}원{' '}
        <span className="text-gray-500 font-semibold">
          × {dailyExpenses.days}일
        </span>
        <span className="font-bold">
          = {dailyExpenses.totalCost.toLocaleString()}원
        </span>
      </p>

      <div className="flex items-center gap-2 justify-between font-bold mt-8 text-lg">
        <p>총 비용:</p>
        <p className="text-right">{totalCost.avg.toLocaleString()}원</p>
      </div>
    </div>
  );
};
