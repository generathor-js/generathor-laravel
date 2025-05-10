import { ConfigurationAttributes } from './configuration';
import { LaravelGenerator } from './generator';
import { Laravel11 } from './laravel11';

export class Laravel12 {
  public static starterKitEloquentModels(
    configuration?: ConfigurationAttributes
  ) {
    configuration = configuration || {};
    configuration.createEloquentModelsOnly = true;
    configuration.createChildModel = true;
    configuration.createLaravel12UserModel = true;
    configuration.laravelVersion = 12;
    configuration.eloquent = configuration.eloquent || {};
    configuration.eloquent.customParents =
      configuration.eloquent.customParents || {};
    configuration.eloquent.customParents['users'] =
      'App\\Models\\LaravelUser as Model';

    return new LaravelGenerator(configuration);
  }

  public static eloquentModels(configuration?: ConfigurationAttributes) {
    return Laravel11.eloquentModels(configuration);
  }

  public static starterKitCrud(configuration?: ConfigurationAttributes) {
    configuration = configuration || {};
    configuration.createEloquentModelsOnly = false;
    configuration.createChildModel = true;
    configuration.createLaravel12UserModel = true;
    configuration.laravelVersion = 12;
    configuration.eloquent = configuration.eloquent || {};
    configuration.eloquent.customParents =
      configuration.eloquent.customParents || {};
    configuration.eloquent.customParents['users'] =
      'App\\Models\\LaravelUser as Model';
    configuration.layout = configuration.layout ?? 'layouts.app';

    return new LaravelGenerator(configuration);
  }
}
