import pluralize from 'pluralize';

class StringHelper {
  public fromSnakeToSingularPascal(text: string): string {
    return text
      .toLowerCase()
      .split('_')
      .map((part) => {
        return this.capitalize(pluralize.singular(part));
      })
      .join('');
  }

  public fromSnakeToPluralPascal(text: string): string {
    const parts = text.toLowerCase().split('_');

    return parts
      .map((part, index) => {
        return index === parts.length - 1
          ? this.capitalize(pluralize.plural(part))
          : this.capitalize(pluralize.singular(part));
      })
      .join('');
  }

  public fromSnakeToPascal(text: string): string {
    return text.toLowerCase().split('_').map(this.capitalize).join('');
  }

  public fromSnakeToSingularSnake(text: string): string {
    return text.toLowerCase().split('_').map(pluralize.singular).join('_');
  }

  public fromSnakeToPluralSnake(text: string): string {
    const parts = text.toLowerCase().split('_');

    return parts
      .map((part, index) => {
        return index === parts.length - 1
          ? pluralize.plural(part)
          : pluralize.singular(part);
      })
      .join('_');
  }

  public fromSnakeToSingularKebab(text: string): string {
    return text.toLowerCase().split('_').map(pluralize.singular).join('-');
  }

  public fromSnakeToPluralKebab(text: string): string {
    const parts = text.toLowerCase().split('_');

    return parts
      .map((part, index) => {
        return index === parts.length - 1
          ? pluralize.plural(part)
          : pluralize.singular(part);
      })
      .join('-');
  }

  public fromSnakeToKebab(text: string): string {
    return text.toLowerCase().split('_').join('-');
  }

  public fromSnakeToSingularCamel(text: string): string {
    return this.uncapitalize(this.fromSnakeToSingularPascal(text));
  }

  public fromSnakeToPluralCamel(text: string): string {
    return this.uncapitalize(this.fromSnakeToPluralPascal(text));
  }

  public fromSnakeToCamel(text: string): string {
    return this.uncapitalize(this.fromSnakeToPascal(text));
  }

  public fromSnakeToPluralLabel(text: string) {
    const parts: string[] = text.toLowerCase().split('_');

    return this.capitalize(
      parts
        .map((part, index) => {
          return index === parts.length - 1
            ? pluralize.plural(part)
            : pluralize.singular(part);
        })
        .join(' ')
    );
  }

  public fromSnakeToSingularLabel(text: string) {
    return this.capitalize(
      text.toLowerCase().split('_').map(pluralize.singular).join(' ')
    );
  }

  public fromSnakeToLabel(text: string) {
    return this.capitalize(text.toLowerCase().split('_').join(' '));
  }

  //Delete this comment
  //Helpers of helper
  public capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public uncapitalize(text: string): string {
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  //Delete this
  public className(text: string) {
    const name = this.fromSnakeToSingularPascal(text);

    return name === 'Class' ? name + 'Model' : name;
  }

  public classLabel(text: string) {
    return this.capitalize(text.toLowerCase().split('_').join(' '));
  }

  public columnLabel(text: string) {
    return this.capitalize(text.toLowerCase().split('_').join(' '));
  }

  public toPluralKebab(text: string) {
    const parts = text.toLowerCase().split('_');

    parts[parts.length - 1] = pluralize.plural(parts[parts.length - 1]);

    return parts.join('-');
  }

  public toPluralLabel(text: string) {
    const parts = text.toLowerCase().split('_');

    parts[parts.length - 1] = pluralize.plural(parts[parts.length - 1]);

    return this.capitalize(parts.join(' '));
  }

  public toSingularLabel(text: string) {
    return this.capitalize(
      text.toLowerCase().split('_').map(pluralize.singular).join(' ')
    );
  }

  public toSingularKebab(text: string) {
    return text.toLowerCase().split('_').map(pluralize.singular).join('-');
  }
}

export default new StringHelper();
