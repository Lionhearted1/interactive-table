// src/components/products/FilterControls.tsx

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';


interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  label: string;
}

export function RangeSlider({ min, max, value, onChange, step = 1, label }: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleValueChange = (newValue: number[]) => {
    const [minVal, maxVal] = newValue;
    setLocalValue([minVal, maxVal]);
    onChange([minVal, maxVal]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {localValue[0]} - {localValue[1]}
        </span>
      </div>
      <div className="space-y-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={localValue}
          onValueChange={handleValueChange}
          className="w-full"
        />
      </div>
    </div>
  );
}