import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface VariantSelectorProps {
  variants: string[];
  label?: string;
  onSelect: (variant: string) => void;
  selectedVariant?: string;
}

export const VariantSelector = ({ 
  variants, 
  label = 'Selecciona una variante',
  onSelect,
  selectedVariant 
}: VariantSelectorProps) => {
  const [selected, setSelected] = useState<string>(selectedVariant || '');

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      <RadioGroup value={selected} onValueChange={handleSelect} className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Label
            key={variant}
            htmlFor={variant}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md border-2 cursor-pointer transition-all
              ${selected === variant 
                ? 'border-primary bg-primary/10' 
                : 'border-muted hover:border-primary/50'
              }
            `}
          >
            <RadioGroupItem value={variant} id={variant} className="sr-only" />
            <span className="text-sm font-medium">{variant}</span>
            {selected === variant && (
              <Badge variant="secondary" className="ml-2">✓</Badge>
            )}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
