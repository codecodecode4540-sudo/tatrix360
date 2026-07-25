'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: cn('flex flex-col gap-4 sm:flex-row', classNames?.months),
        month: cn('w-full space-y-4', classNames?.month),
        month_caption: cn(
          'relative mx-10 flex h-7 items-center justify-center',
          classNames?.month_caption
        ),
        caption_label: cn('truncate text-sm font-medium', classNames?.caption_label),
        nav: cn('flex items-center gap-1', classNames?.nav),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 [&_svg]:fill-foreground',
          classNames?.button_next
        ),
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 [&_svg]:fill-foreground',
          classNames?.button_previous
        ),
        weekdays: cn('flex flex-row', classNames?.weekdays),
        weekday: cn('w-8 text-sm font-normal text-muted-foreground', classNames?.weekday),
        month_grid: cn('mx-auto mt-4', classNames?.month_grid),
        week: cn('mt-2 flex w-max items-start', classNames?.week),
        day: cn('flex size-8 flex-1 items-center justify-center p-0 text-sm', classNames?.day),
        day_button: cn(
          'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100',
          classNames?.day_button
        ),
        range_start: cn('day-range-start', classNames?.range_start),
        range_end: cn('day-range-end', classNames?.range_end),
        selected: cn(
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          classNames?.selected
        ),
        today: cn('bg-accent text-accent-foreground', classNames?.today),
        outside: cn(
          'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          classNames?.outside
        ),
        disabled: cn('text-muted-foreground opacity-50', classNames?.disabled),
        hidden: cn('invisible', classNames?.hidden),
        ...classNames,
      }}
      components={({
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
      } as any)}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };