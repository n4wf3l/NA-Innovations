<?php

namespace App\Models\Scopes;

use App\Support\CurrentAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ProjetAdminTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $adminId = app(CurrentAdmin::class)->id();

        if ($adminId === null) {
            return;
        }

        $builder->whereExists(function ($query) use ($adminId, $model) {
            $query->select(\DB::raw(1))
                ->from('projet_admins')
                ->whereColumn('projet_admins.projet_id', $model->getTable() . '.id')
                ->where('projet_admins.user_id', $adminId);
        });
    }
}
