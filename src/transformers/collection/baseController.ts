import { BaseTransformer, TransformedItem } from './base';

export class BaseController extends BaseTransformer {
  public transform(): TransformedItem[] {
    return [
      {
        namespace: 'App\\Http\\Controllers\\Generathor',
      },
    ];
  }
}
