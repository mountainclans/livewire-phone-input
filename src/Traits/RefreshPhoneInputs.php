<?php

namespace MountainClans\LivewirePhoneInput\Traits;

trait RefreshPhoneInputs
{
    public function refreshPhoneInputs(): void
    {
        $this->dispatch('telDOMChanged');
    }
}
