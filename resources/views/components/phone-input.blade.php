@props([
     'label' => null,
     'name',
     'id',
     'defaultClasses' => true,
     'initialCountry' => 'ES',
])

@php
    $wire = '';
    foreach ($attributes->getAttributes() as $key => $value) {
        if (str_contains($key, 'wire:model')) {
            $wire = $value;
            break;
        }
    }
@endphp

<div class="w-full">
    @teleport('body')
    <script>
        var laravelTelInputConfig = {
            "allowDropdown": true,
            "autoHideDialCode": true,
            "autoPlaceholder": "polite",
            "customContainer": "",
            "customPlaceholder": null,
            "dropdownContainer": null,
            "excludeCountries": [],
            "formatOnDisplay": true,
            "geoIpLookup": "ipinfo",
            "initialCountry": '{{ $initialCountry }}',
            "localizedCountries": [],
            "nationalMode": true,
            "onlyCountries": [],
            "placeholderNumberType": "MOBILE",
            "preferredCountries": ["ES", "DE", "RU", "US", "GB", "KZ"],
            "separateDialCode": false,
            "utilsScript": "./utils.js"
        }
    </script>
    @endteleport

    @if ($label)
        <div class="flex justify-between items-center">
            <label for="{{ $name }}"
                   class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >{{ $label }}</label>
        </div>
    @endif

    {{-- Hidden phone input --}}
    <input type="hidden"
           id="{{ $id }}"
           name="{{ $name }}"
           @if ($attributes->whereStartsWith('wire:model')->first())
               {{ $attributes->wire('model') }}
           @endif
           @if ($attributes->has('value'))
               value="{{ $attributes->get('value') }}"
           @endif
           autocomplete="off"
    />

    {{-- Tel input --}}
    <div class="w-full" wire:ignore>
        <input type="tel"
               class="{{ $defaultClasses
                    ? $attributes->get('class') . ' iti--laravel-tel-input bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                     : $attributes->get('class') . ' iti--laravel-tel-input'
                     }}"
               data-phone-input-id="{{ $id }}"
               data-phone-input-name="{{ $name }}"
               data-phone-input="#{{ $id }}"
               @if ($attributes->has('value'))
                   value="{{ $attributes->get('value') }}"
               @endif
               @if ($attributes->has('phone-country-input'))
                   data-phone-country-input="#{{ $attributes->get('phone-country-input') }}"
               @else
                   @dd($attributes->all())
               @endif
               @if ($attributes->has('placeholder'))
                   placeholder="{{ $attributes->get('placeholder') }}"
               @endif
               @if ($attributes->has('required'))
                   required
               @endif
               @if ($attributes->has('disabled'))
                   disabled
               @endif
               autocomplete="off"
        />
    </div>

    @if ($attributes->has('phone-country-input'))
        <input type="hidden"
               id="{{ $attributes->get('phone-country-input') }}"
               wire:model="{{ $attributes->get('phone-country-input') }}"
        />

        @error ($attributes->get('phone-country-input'))
        <p class="mt-2 text-sm text-red-600 dark:text-red-500">{{ $message }}</p>
        @enderror
    @endif

    @once
        <script>
            document.dispatchEvent(new Event('telDOMChanged'));
        </script>
    @endonce

    @error ($wire)
    <p class="mt-2 text-sm text-red-600 dark:text-red-500">{{ $message }}</p>
    @enderror

</div>
