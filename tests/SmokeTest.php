<?php

use Illuminate\Support\Facades\Blade;
use MountainClans\LivewirePhoneInput\LivewirePhoneInputServiceProvider;

it('boots the service provider', function () {
    expect(app()->getLoadedProviders())
        ->toHaveKey(LivewirePhoneInputServiceProvider::class);
});

it('registers the x-ui.phone-input blade component alias', function () {
    $aliases = app('blade.compiler')->getClassComponentAliases();

    expect($aliases)->toHaveKey('ui.phone-input');
});

it('renders the x-ui.phone-input component', function () {
    $html = Blade::render(
        '<x-ui.phone-input label="Phone" name="phone" id="phone" wire:model="phone" />'
    );

    expect($html)
        ->toContain('Phone')
        ->toContain('id="phone"')
        ->toContain('name="phone"')
        ->toContain('type="tel"');
});
