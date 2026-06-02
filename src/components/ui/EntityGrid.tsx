import { FlatList, View, type RefreshControlProps } from 'react-native';

type EntityGridProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
};

const GRID_GAP = 12;

export function EntityGrid<T>({
  data,
  keyExtractor,
  renderItem,
  refreshControl,
  ListHeaderComponent,
}: EntityGridProps<T>) {
  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => keyExtractor(item)}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      columnWrapperStyle={{ gap: GRID_GAP }}
      contentContainerStyle={{ gap: GRID_GAP, paddingBottom: 32 }}
      refreshControl={refreshControl}
      renderItem={({ item }) => <View className="flex-1">{renderItem(item)}</View>}
    />
  );
}

type EntityGridWrapProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};

/** Two-column grid inside a parent ScrollView. */
export function EntityGridWrap<T>({ data, keyExtractor, renderItem }: EntityGridWrapProps<T>) {
  return (
    <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
      {data.map((item) => (
        <View key={keyExtractor(item)} style={{ width: '48%' }}>
          {renderItem(item)}
        </View>
      ))}
    </View>
  );
}
