export abstract class SeedMetaRepository {
  abstract fueImportado(): Promise<boolean>;
  abstract marcarImportado(at?: Date): Promise<void>;
  abstract obtenerFechaImportacion(): Promise<Date | null>;
  abstract revisionEnCurso(): Promise<boolean>;
  abstract marcarRevisionEnCurso(): Promise<void>;
  abstract limpiarRevisionEnCurso(): Promise<void>;
}
