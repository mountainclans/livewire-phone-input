<?php

namespace MountainClans\LivewirePhoneInput;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class LivewirePhoneInputServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('livewire-phone-input')
            ->hasConfigFile()
            ->hasViews();
    }
}
