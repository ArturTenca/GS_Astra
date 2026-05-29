import { normalizeSupabaseError } from '@/lib/errors';

export abstract class BaseRepository {
  protected handleError(error: unknown): never {
    throw normalizeSupabaseError(error);
  }
}
