export type ConfigurationType = {
  createChildModel?: boolean;
  createEloquentModelsOnly?: boolean;
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
  public constructor(private $attributes: ConfigurationType) {}

  public directory() {
    return this.$attributes.directory || '.';
  }

  public reference() {
    return this.$attributes.reference || 'laravel-generathor';
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
    return typeof this.$attributes.createChildModel === 'undefined'
      ? true
      : this.$attributes.createChildModel;
  }

  public createEloquentModelsOnly() {
    return typeof this.$attributes.createEloquentModelsOnly === 'undefined'
      ? false
      : this.$attributes.createEloquentModelsOnly;
  }
}
