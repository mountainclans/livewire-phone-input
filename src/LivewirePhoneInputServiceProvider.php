<?php

namespace MountainClans\LivewirePhoneInput;

use Illuminate\Support\Facades\Blade;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class LivewirePhoneInputServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('livewire-phone-input')
            ->hasViews();
    }

    public function packageBooted(): void
    {
        Blade::component('livewire-phone-input::components/phone-input', 'ui.phone-input');
    }
}
