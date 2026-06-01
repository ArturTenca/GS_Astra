import { View } from 'react-native';

type SkeletonProps = {
  className?: string;
  height?: number;
};

export function Skeleton({ className = '', height = 16 }: SkeletonProps) {
  return (
    <View
      className={`rounded-lg bg-astra-panel/80 ${className}`}
      style={{ height }}
    />
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="rounded-xl border border-astra-border bg-astra-surface/50 p-4">
          <Skeleton height={18} className="mb-2 w-3/4" />
          <Skeleton height={14} className="mb-2 w-full" />
          <Skeleton height={12} className="w-1/3" />
        </View>
      ))}
    </View>
  );
}

export function StatSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-3">
      <Skeleton height={72} className="min-w-[140px] flex-1" />
      <Skeleton height={72} className="min-w-[140px] flex-1" />
      <Skeleton height={72} className="min-w-[140px] flex-1" />
    </View>
  );
}
