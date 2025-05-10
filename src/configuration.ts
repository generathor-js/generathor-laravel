export type ConfigurationAttributes = {
  laravelVersion?: 11 | 12;
  createChildModel?: boolean;
  createEloquentModelsOnly?: boolean;
  createLaravel12UserModel?: boolean;
  createLaravel11UserModel?: boolean;
  reference?: string;
  source?: string;
  directory?: string;
  homeRoute?: string;
  layout?: string;
  eloquent?: {
    parent?: string;
    customParents?: Record<string, string>;
  };
};

export class Configuration {
  public constructor(private $attributes: ConfigurationAttributes) {}

  public directory() {
    return this.$attributes.directory || '.';
  }

  public reference() {
    return this.$attributes.reference || 'laravel-generathor';
  }

  public laravelVersion() {
    return this.$attributes.laravelVersion || 12;
  }

  public createLaravel12UserModel() {
    return this.$attributes.createLaravel12UserModel ?? false;
  }

  public createLaravel11UserModel() {
    return this.$attributes.createLaravel11UserModel ?? false;
  }

  public source() {
    return this.$attributes.source || 'db';
  }

  public homeRoute() {
    return this.$attributes.homeRoute || 'home';
  }

  public layout() {
    return this.$attributes.layout || 'layout';
  }

  public eloquentParent(table: string): string {
    const map = this.$attributes.eloquent?.customParents || {};

    if (map[table]) {
      return map[table];
    }

    return (
      this.$attributes.eloquent?.parent ||
      'Illuminate\\Database\\Eloquent\\Model'
    );
  }

  public createChildModel() {
    return this.$attributes.createChildModel ?? true;
  }

  public createEloquentModelsOnly() {
    return this.$attributes.createEloquentModelsOnly ?? false;
  }
}
