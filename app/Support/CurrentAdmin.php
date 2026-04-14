<?php

namespace App\Support;

class CurrentAdmin
{
    protected ?int $id = null;

    public function set(?int $id): void
    {
        $this->id = $id;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function isSet(): bool
    {
        return $this->id !== null;
    }

    public function clear(): void
    {
        $this->id = null;
    }
}
