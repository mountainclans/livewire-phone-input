# Phone input component for Livewire 3

## Установка

Установите пакет при помощи Composer:

```bash
composer require mountainclans/livewire-phone-input
```

Поскольку функциональность пакета основана на [пакете Intl Tel Input](https://github.com/jackocnr/intl-tel-input), установите его через npm:

```bash
npm install intl-tel-input --save
```

**Обязательно** опубликуйте ассеты:
```bash
php artisan vendor:publish --tag=livewire-phone-input-assets
```

Добавьте в файл проекта `resources/js/app.js` строки

```js
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import phoneInput from '/vendor/mountainclans/livewire-phone-input/resources/js/phoneInput'
```

Добавьте в файл проекта `resources/js/app.css` строку

```
@import 'intl-tel-input/build/css/intlTelInput.css';
```


Опционально, вы можете опубликовать view командой

```bash
php artisan vendor:publish --tag="livewire-phone-input-views"
```

## Использование

## Авторы

- [Vladimir Bazhenov](https://github.com/mountainclans)
- [Victory Osayi](https://github.com/victorybiz/laravel-tel-input)
- [Jack O'Connor](https://github.com/jackocnr/intl-tel-input)
- [All Contributors](../../contributors)

## Лицензия

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
