import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  daysInMonth,
  parseISODate,
  startWeekday,
  toLocalISODate,
  todayLocalISODate,
} from '@/lib/dates/alert-dates';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

type CalendarPickerProps = {
  value: string | null;
  onChange: (isoDate: string) => void;
  minDate?: string;
};

export function CalendarPicker({ value, onChange, minDate }: CalendarPickerProps) {
  const min = minDate ?? todayLocalISODate();
  const initial = value ? parseISODate(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const cells = useMemo(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const leading = startWeekday(viewYear, viewMonth);
    const items: ({ day: number } | null)[] = [];
    for (let i = 0; i < leading; i++) items.push(null);
    for (let d = 1; d <= total; d++) items.push({ day: d });
    return items;
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <View className="rounded-2xl border border-astra-border bg-astra-panel/40 p-3">
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => goMonth(-1)}
          className="rounded-lg px-2 py-1 active:opacity-70"
          accessibilityLabel="Previous month"
        >
          <Text className="text-lg text-astra-muted">‹</Text>
        </Pressable>
        <Text className="text-sm font-semibold text-astra-text">{monthLabel}</Text>
        <Pressable
          onPress={() => goMonth(1)}
          className="rounded-lg px-2 py-1 active:opacity-70"
          accessibilityLabel="Next month"
        >
          <Text className="text-lg text-astra-muted">›</Text>
        </Pressable>
      </View>

      <View className="mb-1 flex-row">
        {WEEKDAYS.map((label, i) => (
          <View key={`${label}-${i}`} className="flex-1 items-center py-1">
            <Text className="text-[10px] font-semibold text-astra-muted">{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, index) => {
          if (!cell) {
            return <View key={`empty-${index}`} className="w-[14.28%] aspect-square" />;
          }

          const iso = toLocalISODate(new Date(viewYear, viewMonth, cell.day));
          const isSelected = value === iso;
          const isDisabled = iso < min;
          const isToday = iso === todayLocalISODate();

          return (
            <Pressable
              key={iso}
              disabled={isDisabled}
              onPress={() => onChange(iso)}
              className={`w-[14.28%] items-center justify-center py-2 active:opacity-80 ${
                isDisabled ? 'opacity-35' : ''
              }`}
            >
              <View
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  isSelected
                    ? 'bg-astra-primary'
                    : isToday
                      ? 'border border-astra-primary/50'
                      : ''
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'font-bold text-white'
                      : isToday
                        ? 'font-semibold text-astra-primary'
                        : 'text-astra-text'
                  }`}
                >
                  {cell.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
