import { Injectable } from '@angular/core';
import { SeedMetaRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieSeedMetaRepository implements SeedMetaRepository {
  private readonly SEED_IMPORTED_KEY = 'seedImported';
  private readonly SEED_IMPORTED_AT_KEY = 'seedImportedAt';
  private readonly REVISION_EN_CURSO_KEY = 'revisionEnCurso';

  async fueImportado(): Promise<boolean> {
    const record = await db.meta.get(this.SEED_IMPORTED_KEY);
    return !!(record && record.value === true);
  }

  async marcarImportado(at: Date = new Date()): Promise<void> {
    await db.meta.put({
      key: this.SEED_IMPORTED_KEY,
      value: true,
    });
    await db.meta.put({
      key: this.SEED_IMPORTED_AT_KEY,
      value: at.toISOString(),
    });
  }

  async obtenerFechaImportacion(): Promise<Date | null> {
    const record = await db.meta.get(this.SEED_IMPORTED_AT_KEY);
    if (!record || typeof record.value !== 'string') {
      return null;
    }
    const parsed = new Date(record.value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  async revisionEnCurso(): Promise<boolean> {
    const record = await db.meta.get(this.REVISION_EN_CURSO_KEY);
    return record?.value === true;
  }

  async marcarRevisionEnCurso(): Promise<void> {
    await db.meta.put({
      key: this.REVISION_EN_CURSO_KEY,
      value: true,
    });
  }

  async limpiarRevisionEnCurso(): Promise<void> {
    await db.meta.delete(this.REVISION_EN_CURSO_KEY);
  }
}
