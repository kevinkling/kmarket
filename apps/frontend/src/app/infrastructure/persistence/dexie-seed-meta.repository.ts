import { Injectable } from '@angular/core';
import { SeedMetaRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieSeedMetaRepository implements SeedMetaRepository {
  private readonly SEED_IMPORTED_KEY = 'seedImported';

  async fueImportado(): Promise<boolean> {
    const record = await db.meta.get(this.SEED_IMPORTED_KEY);
    return !!(record && record.value === true);
  }

  async marcarImportado(): Promise<void> {
    await db.meta.put({
      key: this.SEED_IMPORTED_KEY,
      value: true,
    });
  }
}
