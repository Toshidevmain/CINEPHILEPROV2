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
        onChangeStatusOpen(false);
        inputRef.current?.blur();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onChangeStatusOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChangeStatusOpen]);

  const debounceInput = React.useCallback(
    debounce((value) => {
      void onChange(value as string);
    }, debounceTimeout),
    [onChange, debounceTimeout],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceInput(event.target.value);
  };

  return (
    <div className={cn('relative flex items-center', containerClassName)}>
      <div
        className={cn(
          'flex items-center overflow-hidden transition-all duration-300',
          open
            ? 'w-48 border border-white/30 rounded-lg bg-[#141414]'
            : 'w-8 border-transparent',
        )}
      >
        <Button
          id="search-btn"
          aria-label="Search"
          variant="ghost"
          className={cn(
            'h-8 w-8 shrink-0 rounded p-0 text-white hover:bg-transparent',
          )}
          onClick={() => {
            if (open) {
              inputRef.current?.focus();
            } else {
              onChangeStatusOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }}
        >
          <Icons.search className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Input
          ref={inputRef}
          id={id}
          type="text"
          placeholder="Titles, people, genres"
          className={cn(
            'h-8 border-0 bg-transparent px-0 text-sm text-white placeholder:text-[#777] focus-visible:ring-0 focus-visible:ring-offset-0',
            open ? 'w-[calc(100%-2rem)] pr-2' : 'w-0 p-0',
            className,
          )}
          defaultValue={value}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
      </div>
      {!open && (
        <kbd className="pointer-events-none absolute -right-1 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[#777] md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
}
