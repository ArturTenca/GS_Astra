import { ForbiddenError, normalizeSupabaseError } from '@/lib/errors';

export abstract class BaseRepository {
  protected handleError(error: unknown): never {
    throw normalizeSupabaseError(error);
  }

  /** RLS-blocked deletes return no error — verify at least one row was removed. */
  protected assertDeleted(
    rows: { id: string }[] | null,
    error: unknown,
  ): void {
    if (error) {
      this.handleError(error);
    }

    if (!rows?.length) {
      throw new ForbiddenError(
        'Unable to delete this record. You may not have permission, or it no longer exists.',
      );
    }
  }
}
