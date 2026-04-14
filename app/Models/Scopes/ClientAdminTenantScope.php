<?php

namespace App\Models\Scopes;

use App\Support\CurrentAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Scope that filters rows to those whose `client_id` belongs to the current admin's tenant.
 *
 * Applied on models that have a `client_id` column pointing to `users.id`.
 */
class ClientAdminTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $adminId = app(CurrentAdmin::class)->id();

        if ($adminId === null) {
            return;
        }

        $table = $model->getTable();

        $builder->whereExists(function ($query) use ($adminId, $table) {
            $query->select(\DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', $table . '.client_id')
                ->where('users.admin_id', $adminId);
        });
    }
}
