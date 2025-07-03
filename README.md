# Phone input component for Livewire 3
Доработанная под использование с Vite версия компонента телефонного ввода 

## Установка

Установите пакет при помощи Composer:

```bash
composer require mountainclans/livewire-phone-input
```

Поскольку функциональность пакета основана на [пакете Intl Tel Input](https://github.com/jackocnr/intl-tel-input), установите его через npm:

```bash
npm install intl-tel-input --save
```

Добавьте в файл проекта `resources/js/app.js` строки

```js
import intlTelInput from 'intl-tel-input/intlTelInputWithUtils';
import '../../vendor/mountainclans/livewire-phone-input/resources/js/phoneInput';
window.intlTelInput = window.intlTelInputGlobals = intlTelInput;
```

Добавьте в файл проекта `resources/js/app.css` строки:

```
@import 'intl-tel-input/build/css/intlTelInput.css';
@import '../../vendor/mountainclans/livewire-phone-input/resources/css/phoneInput.css';
```
_Обратите внимание, что для корректной стилизации в вашем проекте должен использоваться TailwindCSS._

Добавьте в `tailwind.config.js` в секцию `content`:

```js
'./vendor/mountainclans/livewire-phone-input/resources/views/**/*.blade.php'
```

---

## Использование


```bladehtml
<x-ui.phone-input wire:model="phone"
                  value="{{ $phone }}"
                  phone-country-input="phoneCountry"
                  :label="__('Phone')"
                  id="phone"
                  name="phone"
                  id="phone"
                  class="additional-class-here"
/>
```

**Обратите внимание**, что для записи кода страны в родительском компоненте должно присутствовать поле `phoneCountry` (или любое другое, которые вы передадите в prop `phone-country-input`).

---

Если Вам необходимо обновить рендеринг компонента `phone-input` при действиях на бекэнде, воспользуйтесь трейтом `RefreshPhoneInputs`:

```php
class YourLivewireComponent extends Component
{
    use MountainClans\LivewirePhoneInput\Traits\RefreshPhoneInputs;
    
    // к примеру, после динамического появления телефонного поля в форме
    public function updatedAddPhone(): void
    {
        $this->refreshPhoneInputs();
    }
}
```

## Авторы

- [Vladimir Bazhenov](https://github.com/mountainclans)
- [Victory Osayi](https://github.com/victorybiz/laravel-tel-input)
- [Jack O'Connor](https://github.com/jackocnr/intl-tel-input)
- [All Contributors](../../contributors)

## Лицензия

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
