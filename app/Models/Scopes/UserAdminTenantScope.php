<?php

namespace App\Models\Scopes;

use App\Support\CurrentAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class UserAdminTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $adminId = app(CurrentAdmin::class)->id();

        if ($adminId === null) {
            return;
        }

        $table = $model->getTable();

        $builder->where(function ($q) use ($adminId, $table) {
            $q->where($table . '.admin_id', $adminId)
              ->orWhere($table . '.id', $adminId);
        });
    }
}
