import { View } from 'react-native';
import { Button } from '@/components/ui/Button';

type CrudActionBarProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  isDeleting?: boolean;
};

export function CrudActionBar({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  isDeleting = false,
}: CrudActionBarProps) {
  if (!onEdit && !onDelete) {
    return null;
  }

  return (
    <View className="mt-4 flex-row gap-2">
      {onEdit ? (
        <View className="flex-1">
          <Button title={editLabel} onPress={onEdit} variant="ghost" />
        </View>
      ) : null}
      {onDelete ? (
        <View className="flex-1">
          <Button
            title={deleteLabel}
            onPress={onDelete}
            variant="danger"
            loading={isDeleting}
          />
        </View>
      ) : null}
    </View>
  );
}
