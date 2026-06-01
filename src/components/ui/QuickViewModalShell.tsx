import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

type QuickViewModalShellProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function QuickViewModalShell({
  visible,
  title,
  onClose,
  children,
}: QuickViewModalShellProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 p-4" onPress={onClose}>
        <Pressable
          className="max-h-[90%] w-full overflow-hidden rounded-2xl border border-astra-border bg-astra-bg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-astra-border px-4 py-3">
            <Text className="text-sm font-semibold text-astra-text">{title}</Text>
            <Pressable onPress={onClose} className="px-2 py-1">
              <Text className="text-sm font-semibold text-astra-muted">Close</Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
