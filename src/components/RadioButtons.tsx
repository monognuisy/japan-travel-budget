import { Button } from './ui/button';
import type { LocationEntry } from '../data/constants';

interface RadioButtonsProps {
  values: readonly LocationEntry[];
  selectedValue: LocationEntry['value'];
  onChange: (value: LocationEntry['value']) => void;
}

const RadioButtons = ({
  values,
  selectedValue,
  onChange,
}: RadioButtonsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {values.map((value) => (
        <Button
          key={value.value}
          onClick={() => onChange(value.value)}
          variant={selectedValue === value.value ? 'default' : 'outline'}
        >
          {value.label}
        </Button>
      ))}
    </div>
  );
};

export default RadioButtons;
