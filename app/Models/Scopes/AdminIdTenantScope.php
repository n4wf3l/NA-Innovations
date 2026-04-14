<?php

namespace App\Models\Scopes;

use App\Support\CurrentAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Scope for models that carry their own `admin_id` column directly.
 */
class AdminIdTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $adminId = app(CurrentAdmin::class)->id();

        if ($adminId === null) {
            return;
        }

        $builder->where($model->getTable() . '.admin_id', $adminId);
    }
}
