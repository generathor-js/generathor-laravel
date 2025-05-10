import { ConfigurationAttributes } from './configuration';
import { LaravelGenerator } from './generator';

export class Laravel11 {
  public static jetstreamEloquentModels(
    configuration?: ConfigurationAttributes
  ) {
    configuration = configuration || {};
    configuration.createEloquentModelsOnly = true;
    configuration.createChildModel = true;
    configuration.createLaravel11UserModel = true;
    configuration.laravelVersion = 11;
    configuration.eloquent = configuration.eloquent || {};
    configuration.eloquent.customParents =
      configuration.eloquent.customParents || {};
    configuration.eloquent.customParents['users'] =
      'App\\Models\\LaravelUser as Model';

    return new LaravelGenerator(configuration);
  }

  public static eloquentModels(configuration?: ConfigurationAttributes) {
    configuration = configuration || {};
    configuration.createEloquentModelsOnly = true;
    configuration.createChildModel = true;

    return new LaravelGenerator(configuration);
  }

  public static jetstreamCrud(configuration?: ConfigurationAttributes) {
    configuration = configuration || {};
    configuration.createEloquentModelsOnly = false;
    configuration.createChildModel = true;
    configuration.createLaravel11UserModel = true;
    configuration.laravelVersion = 11;
    configuration.eloquent = configuration.eloquent || {};
    configuration.eloquent.customParents =
      configuration.eloquent.customParents || {};
    configuration.eloquent.customParents['users'] =
      'App\\Models\\LaravelUser as Model';
    configuration.layout = configuration.layout ?? 'app-layout';

    return new LaravelGenerator(configuration);
  }
}
