import * as React from 'react';
import { cn, debounce } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input, type InputProps } from '@/components/ui/input';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

interface DebouncedInputProps extends Omit<InputProps, 'onChange'> {
  containerClassName?: string;
  value: string;
  open: boolean;
  onChange: (value: string) => Promise<void>;
  onChangeStatusOpen: (value: boolean) => void;
  debounceTimeout?: number;
  maxLength?: number;
}

export function DebouncedInput({
  id = 'query',
  containerClassName,
  open,
  value,
  onChange,
  maxLength = 80,
  debounceTimeout = 300,
  onChangeStatusOpen,
  className,
  ...props
}: DebouncedInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useOnClickOutside(inputRef, () => {
    if (!value) onChangeStatusOpen(false);
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        void onChange('');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (!inputRef.current) return;
        e.preventDefault();
        onChangeStatusOpen(true);
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const debounceInput = React.useCallback(
    debounce((value) => {
      const strValue = value as string;
      void onChange(strValue);
    }, debounceTimeout),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceInput(event.target.value);
  };

  return (
    <div className={cn('relative', containerClassName)}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder="Titles, people, genres"
        className={cn(
          'h-8 rounded bg-[#141414] text-sm text-white transition-all duration-300',
          open
            ? 'w-48 border border-white/30 pl-9 pr-3'
            : 'w-8 border-transparent bg-transparent pl-8',
          className,
        )}
        defaultValue={value}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      <Button
        id="search-btn"
        aria-label="Search"
        variant="ghost"
        className={cn(
          'absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded p-0 text-white hover:bg-transparent',
        )}
        onClick={() => {
          if (!inputRef.current) return;
          inputRef.current.focus();
          onChangeStatusOpen(!open);
        }}>
        <Icons.search className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
