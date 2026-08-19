export abstract class SeedMetaRepository {
  abstract fueImportado(): Promise<boolean>;
  abstract marcarImportado(at?: Date): Promise<void>;
  abstract obtenerFechaImportacion(): Promise<Date | null>;
}
