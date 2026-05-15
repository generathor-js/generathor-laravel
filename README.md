<p align="center">
  <img src="https://cldup.com/U-06c9VkSH.png" alt="Generathor Logo" width="130">
  <svg xmlns="http://www.w3.org/2000/svg" width="130" preserveAspectRatio="xMidYMid" viewBox="0 0 256 264">
    <path d="m255.9 59.6.1 1.1v56.6c0 1.4-.8 2.8-2 3.5l-47.6 27.4v54.2c0 1.4-.7 2.8-2 3.5l-99.1 57-.7.4-.3.1c-.7.2-1.4.2-2.1 0l-.4-.1-.6-.3L2 206c-1.3-.8-2.1-2.2-2.1-3.6V32.7l.1-1.1.2-.4.3-.6.2-.4.4-.5.4-.3c.2 0 .3-.2.5-.3L51.6.6c1.3-.8 2.9-.8 4.1 0L105.3 29c.2 0 .3.2.4.3l.5.3c0 .2.2.4.3.5l.3.4.3.6.1.4.2 1v106l41.2-23.7V60.7c0-.4 0-.7.2-1l.1-.4.3-.7.3-.3.3-.5.5-.3.4-.4 49.6-28.5c1.2-.7 2.8-.7 4 0L254 57l.5.4.4.3.4.5.2.3c.2.2.2.5.3.7l.2.3Zm-8.2 55.3v-47l-17.3 10-24 13.7v47l41.3-23.7Zm-49.5 85v-47l-23.6 13.5-67.2 38.4v47.5l90.8-52.3ZM8.2 39.9V200l90.9 52.3v-47.5l-47.5-26.9-.4-.4c-.2 0-.3-.1-.4-.3l-.4-.4-.3-.4-.2-.5-.2-.5v-.6l-.2-.5V63.6L25.6 49.8l-17.3-10Zm45.5-31L12.4 32.8l41.3 23.7 41.2-23.7L53.7 8.9ZM75 157.3l24-13.8V39.8l-17.3 10-24 13.8v103.6l17.3-10ZM202.3 36.9 161 60.7l41.3 23.8 41.3-23.8-41.3-23.8Zm-4.1 54.7-24-13.8-17.3-10v47l24 13.9 17.3 10v-47Zm-95 106 60.6-34.5 30.2-17.3-41.2-23.8-47.5 27.4L62 174.3l41.2 23.3Z" fill="#FF2D20"/>
  </svg>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/generathor-laravel">
    <img src="https://img.shields.io/npm/v/generathor-laravel.svg" alt="NPM Version">
  </a>
  <a href="https://npmcharts.com/compare/generathor-laravel?minimal=true">
    <img src="https://img.shields.io/npm/dt/generathor-laravel.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/generathor-laravel">
    <img src="https://img.shields.io/npm/l/generathor-laravel.svg" alt="License">
  </a>
</p>

# Generathor Laravel

**Generathor Laravel** allows you to automatically generate Eloquent models and Livewire CRUDs (using Flux UI) based on your database structure.

---

## Installation

Install the core dependencies:

```bash
$ npm i -D generathor generathor-db generathor-laravel
```

Depending on your database, install the driver you need:
```bash
# For MySQL
$ npm i -D mysql2

# For PostgreSQL
$ npm i -D pg
```

Create the configuration file:

```bash
$ touch generathor.config.cjs
```

Add the following script to your `package.json`:

```json
"scripts": {
  "generathor": "generathor -c generathor.config.cjs"
}
```

---

## Configuration

In your `generathor.config.cjs`, set up the connection to your database and specify the generator configuration. 

You can choose to generate only **Eloquent** models, or **Livewire** components with their corresponding views.

### Generating Livewire CRUDs

This will generate Eloquent models, Livewire components, and views for the CRUD interface.

```javascript
const { Source } = require('generathor-db');
const { livewire } = require('generathor-laravel');

const dbSource = new Source({
  type: 'mysql', // or 'postgres'
  configuration: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'my_database'
  },
  excludes: ['migrations']
});

module.exports = {
  sources: {
    db: dbSource,
  },
  generators: livewire()
};
```

### Generating Eloquent Models Only

If you only need the models without the CRUD UI:

```javascript
const { Source } = require('generathor-db');
const { eloquent } = require('generathor-laravel');

const dbSource = new Source({
  type: 'mysql', // or 'postgres'
  configuration: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'my_database'
  },
  excludes: ['migrations']
});

module.exports = {
  sources: {
    db: dbSource,
  },
  generators: eloquent()
};
```

---

## Generating Files

Once configured, execute the script to generate your files:

```bash
$ npm run generathor
```

**Requirements:**
The generated UI components use [Flux UI](https://fluxui.dev/) primitives and [Livewire](https://livewire.laravel.com/). Make sure they are installed and configured in your Laravel application before using the generated views.

You must also install the required PHP dependencies in your Laravel project:

```bash
$ composer require tucker-eric/eloquentfilter kyslik/column-sortable
```

### Expose the routes

Add generathor routes to `routes/web.php`:

```php
Route::prefix('manage')->group(function () {
    require __DIR__.'/generathor.php';
});
```

### Set up your 'home' route

You need to set up your home route. You can change the home route reference in the `generathor.config.cjs` file.

```php
Route::get('/', function () {
    return view('welcome');
})->name('home');
```

---

## Configuration Options

When calling `eloquent(options)` or `livewire(options)`, you can pass an object with the following optional settings:

| Variable                   | Type                   | Default                              | Description                                                                         |
|----------------------------|------------------------|--------------------------------------|-------------------------------------------------------------------------------------|
| `directory`                | string                 | '.'                                  | Directory path for the Laravel project.                                             |
| `reference`                | string                 | 'laravel'                            | Reference name used in templates.                                                   |
| `laravelVersion`           | 13                     | 13                                   | Laravel application version.                                                        |
| `createLaravelUserModel`   | boolean                | false                                 | Check if a custom Laravel user model is required.                                   |
| `onlyEloquentModels`       | boolean                | true (eloquent) / false (livewire)   | Creates only Eloquent models, skipping the generation of other files.               |
| `source`                   | string                 | 'db'                                 | Reference to the Generathor source for database structure.                          |
| `homeRoute`                | string                 | 'home'                               | Initial base route, used for redirection.                                           |
| `eloquent.parent`          | string                 | 'Illuminate\Database\Eloquent\Model' | General parent class for models.                                                    |
| `eloquent.customParents`   | Record<string, string> | {}                                   | Custom parent class by table, e.g. `{ users: 'App\\Models\\User' }`.                |
