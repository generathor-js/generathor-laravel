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

**Generathor Laravel** allows you to automatically generate Eloquent models and CRUD operations based on your database structure.

---

## Table of Contents

1. [Installation](#installation)
2. [Generating Files](#generating-files)
    1. [Generating Eloquent Models](#generating-eloquent-models)
    2. [Generating Eloquent Models and CRUDs](#generating-eloquent-models-and-cruds)
3. [Additional Settings](#additional-settings)
4. [Files](#files)
5. [TODO](#todo)

---

## Installation

To begin using Generathor Laravel, install the necessary dependencies:

```bash
$ npm i -D generathor generathor-db generathor-laravel mysql2
```

Then, create the generathor configuration file:

```bash
$ touch generathor.config.cjs
```

> The content of the configuration file will depend on what you want to generate.

Add the following script to your `package.json`:

```json
"scripts": {
  "generathor": "generathor -c generathor.config.cjs"
}
```

---

## Generating Files

Whether you need to generate Eloquent models or CRUDs, you must install the PHP dependencies by running the following command:

```bash
$ composer require tucker-eric/eloquentfilter kyslik/column-sortable
```

Next, follow one of the steps below.

---

### Generating Eloquent Models

Your `generathor.config.cjs` file should look like this:

```js
const { Source } = require('generathor-db');
const { LaravelGenerator } = require('generathor-laravel');

const laravel = new LaravelGenerator({
  createEloquentModelsOnly: true
});
const dbSource = new Source({
  type: 'mysql',
  configuration: {
    host: 'localhost',
    port: '3306',
    user: 'my_user',
    password: 'my_password',
    database: 'my_database'
  },
  excludes: ['migrations']
}, [
  laravel.transformer.bind(laravel)
]);

module.exports = {
  sources: {
    db: dbSource,
  },
  generators: laravel.generators()
};
```

Then, run the following command:

```bash
$ npm run generathor
```

---

### Generating Eloquent Models and CRUDs

Your `generathor.config.cjs` file should look like this:

```js
const { Source } = require('generathor-db');
const { LaravelGenerator } = require('generathor-laravel');

const laravel = new LaravelGenerator();
const dbSource = new Source({
  type: 'mysql',
  configuration: {
    host: 'localhost',
    port: '3306',
    user: 'my_user',
    password: 'my_password',
    database: 'my_database'
  },
  excludes: ['migrations']
}, [
  laravel.transformer.bind(laravel)
]);

module.exports = {
  sources: {
    db: dbSource,
  },
  generators: laravel.generators()
};
```

Then, run the following command:

```bash
$ npm run generathor
```

To make everything work, it's necessary to set up other things in your project:

#### Installing frontend dependencies

You need to install TailwindCSS:
[https://tailwindcss.com/docs/guides/laravel](https://tailwindcss.com/docs/guides/laravel)

Also, you need to install the following packages:

* alpinejs
* @alpinejs/collapse
* laravel-precognition-alpine
* sweetalert2

```bash
npm i -D alpinejs @alpinejs/collapse laravel-precognition-alpine sweetalert2
```

File `app.js` must contain:

```js
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse'
import Precognition from 'laravel-precognition-alpine';
import Swal from 'sweetalert2';

window.Alpine = Alpine;
window.Swal = Swal;

Alpine.plugin(Precognition);
Alpine.plugin(collapse);
Alpine.start();
```

File `app.css` must contain:

```css
@import "@fortawesome/fontawesome-free/css/all.css";
```

#### Expose the routes

Add generatehor routes to `routes/web.php`:

```php
Route::prefix('manage')->group(function () {
    require __DIR__.'/generathor.php';
});
```

#### Set up your 'home' route

You neet to set up your `home` route. You can change the home route reference in the `generathor.config.cjs` file.

```php
Route::get('/', function () {
    return view('welcome');
})->name('home');
```

#### Set up datepickers (optional)

Install the following package:

```bash
npm i -D flatpickr
```

Add the following code to `app.js`:

```js
import flatpickr from 'flatpickr';

flatpickr('.input-datetime', {
  enableTime: true,
  enableSeconds: true,
  dateFormat: 'Y-m-d H:i:S',
});
flatpickr('.input-date', {
  dateFormat: 'Y-m-d',
});
flatpickr('.input-time', {
  noCalendar: true,
  enableTime: true,
  enableSeconds: true,
  dateFormat: 'H:i:S',
});
```

Add the following code to `app.css`:

```css
@import "flatpickr/dist/flatpickr.css";
```

#### Set up loading spinner (optional)

Add the following code to `app.js`:

```js
const loader = document.getElementById('generathor-loader');
window.showLoading = () => {
  if (loader) {
    loader.classList.remove('hidden');
    loader.classList.add('flex');
  }
};
window.hideLoading = () => {
  if (loader) {
    loader.classList.remove('flex');
    loader.classList.add('hidden');
  }
};

const forms = document.getElementsByTagName('form');
for (const form of forms) {
  form.addEventListener('submit', window.showLoading);
}

// Only for Livewire
if (typeof Livewire !== undefined) {
  Livewire.hook('commit', ({ succeed, fail }) => {
    succeed(() => {
      window.hideLoading();
    });
    fail(() => {
      window.hideLoading();
    });
  });
}
```

Add the following code in `layout.blade.php` or in your layout:

```blade
<x-generathor.loader />
```

#### Set up header (optional)

You can define a header in your layout. For example, in `layout.blade.php` or in your layout:

```blade
@if(isset($header))
<div>
    {{$header}}
</div>
@endif
```

---

## Additional settings

You can modify settings in the `generathor.config.cjs` file.

| Variable                   | Required | Type                   | Default                              | Description                                                                         |
|----------------------------|----------|------------------------|--------------------------------------|-------------------------------------------------------------------------------------|
| `createChildModel`         | `No`     | boolean                | true                                 | Prevents overwriting the child class of a model, so you retain your custom changes. |
| `createEloquentModelsOnly` | `No`     | boolean                | false                                | Creates only Eloquent models, skipping the generation of other files.               |
| `reference`                | `No`     | string                 | 'laravel-generathor'                 | Reference name used in templates.                                                   |
| `source`                   | `No`     | string                 | 'db'                                 | Reference to the Generathor source for database structure.                          |
| `directory`                | `No`     | string                 | '.'                                  | Directory path for the Laravel project.                                             |
| `homeRoute`                | `No`     | string                 | 'home'                               | Initial base route, used for redirection to the home page.                          |
| `layout`                   | `No`     | string                 | 'layout'                             | Main layout of your project.                                                        |
| `eloquent`                 | `No`     | object                 |                                      | Object for defining parent classes for models.                                      |
| `eloquent.parent`          | `No`     | string                 | 'Illuminate\Database\Eloquent\Model' | General parent class for models.                                                    |
| `eloquent.customParents`   | `No`     | Record<string, string> | {}                                   | Parent class by table, allowing custom parent classes for specific tables.          |

Example

```js
const { Source } = require('generathor-db');
const { LaravelGenerator }= require('generathor-laravel-testing');

const laravel = new LaravelGenerator({
  ccreateChildModel: true,
  createEloquentModelsOnly: false,
  reference: 'laravel',
  source: 'db2',
  directory: './project',
  homeRoute: 'index',
  layout: 'app',
  eloquent: {
    parent: 'App\\Models\\Model',
    customParents: {
      users: 'App\\Models\\Jetstream\\User as Model',
    }
  };
});
const dbSource = new Source({
  type: 'mysql',
  configuration: {
    host: 'localhost',
    port: '3306',
    user: 'my_user',
    password: 'my_password',
    database: 'my_database'
  },
  excludes: ['migrations']
}, [
  laravel.transformer.bind(laravel)
]);

module.exports = {
  sources: {
    db: dbSource,
  },
  generators: laravel.generators()
};
```

---

## Files

* `app/Models/Generathor/[model].php` (for each table)
* `app/Models/[model].php` (for each table)
* `app/ModelFilters/[filter].php` (for each table)
* `app/Http/Requests/Generathor/[create-request].php` (for each table)
* `app/Http/Requests/Generathor/[update-request].php` (for each table)
* `app/Http/Requests/Generathor/[filter-request].php` (for each table)
* `app/Http/Requests/Generathor/[attach-request].php` (for each 'has-many' relationship in each table)
* `resources/views/generathor/menu.blade.php`
* `routes/generathor.php`
* `app/Http/Controllers/Generathor/Controller.php`
* `app/Http/Controllers/Generathor/[controller].php` (for each table)
* `resources/views/generathor/[table-context]/index.blade.php` (for each table)
* `resources/views/generathor/[table-context]/edit.blade.php` (for each table)
* `resources/views/generathor/[table-context]/show.blade.php` (for each table)
* `resources/views/generathor/[table-context]/[relation].blade.php` (for each relationship in each table)
* `resources/views/components/generathor/[table-context]/create-form.blade.php` (for each table)
* `resources/views/components/generathor/[table-context]/filter-form.blade.php` (for each table)
* `resources/views/components/generathor/[table-context]/update-form.blade.php` (for each table)
* `resources/views/components/generathor/[table-context]/[attach-form].blade.php` (for each 'has-many' relationship in each table)
* `resources/views/components/generathor/[table-context]/[create-form].blade.php` (for each relationship in each table)
* `resources/views/components/generathor/[table-context]/[filter-form].blade.php` (for each 'has-many' relationship in each table)
* `app/Models/Generathor/GenerathorKey.php`
* `resources/views/components/generathor/record-input.blade.php`
* `resources/views/components/generathor/breadcrumbs.blade.php`
* `resources/views/components/generathor/tabs.blade.php`
* `resources/views/components/generathor/modal.blade.php`
* `resources/views/components/generathor/loader.blade.php`
* `resources/views/components/generathor/icon-check-circle.blade.php`
* `resources/views/components/generathor/icon-chevron-right.blade.php`
* `resources/views/components/generathor/icon-computer.blade.php`
* `resources/views/components/generathor/icon-eye.blade.php`
* `resources/views/components/generathor/icon-funnel.blade.php`
* `resources/views/components/generathor/icon-home.blade.php`
* `resources/views/components/generathor/icon-pencil.blade.php`
* `resources/views/components/generathor/icon-plus.blade.php`
* `resources/views/components/generathor/icon-trash.blade.php`
* `resources/views/components/generathor/icon-x-circle.blade.php`
* `resources/views/components/generathor/icon-x.blade.php`
* `resources/views/components/generathor/icon-chevron-down.blade.php`
* `resources/views/components/generathor/icon-list-bullet.blade.php`
* `resources/views/components/generathor/icon-link.blade.php`
* `resources/views/components/generathor/icon-unlink.blade.php`

---

## TODO

- [ ] Separate inputs into components.
- [ ] Customize inputs based on prefix or specific logic.
- [ ] TBD
