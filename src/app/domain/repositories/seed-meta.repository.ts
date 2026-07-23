export abstract class SeedMetaRepository {
  abstract fueImportado(): Promise<boolean>;
  abstract marcarImportado(): Promise<void>;
}
