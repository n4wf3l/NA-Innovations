<?php

namespace App\Models\Scopes;

use App\Support\CurrentAdmin;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ReferralPartnerAdminTenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $adminId = app(CurrentAdmin::class)->id();

        if ($adminId === null) {
            return;
        }

        $builder->whereExists(function ($query) use ($adminId, $model) {
            $query->select(\DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', $model->getTable() . '.user_id')
                ->where('users.admin_id', $adminId);
        });
    }
}
