import Handlebars from 'handlebars';

let configured = false;

export class HandlebarsHelper {
  public static configure() {
    if (configured) {
      return;
    }
    Handlebars.registerHelper('eq', (arg1, arg2) => arg1 == arg2);
    Handlebars.registerHelper('not', (val) => !val);
    Handlebars.registerHelper('concat', (arg1, arg2) => arg1 + arg2);
    configured = true;
  }
}
