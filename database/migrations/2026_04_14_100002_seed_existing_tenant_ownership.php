<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $primaryAdmin = DB::table('users')
            ->where('role', 'admin')
            ->orderBy('id')
            ->first();

        if (!$primaryAdmin) {
            return;
        }

        $adminId = $primaryAdmin->id;
        $now = now();

        $projectIds = DB::table('projets')->pluck('id');

        if ($projectIds->isNotEmpty()) {
            $pivotRows = $projectIds->map(fn ($pid) => [
                'projet_id'  => $pid,
                'user_id'    => $adminId,
                'role'       => 'owner',
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();

            DB::table('projet_admins')->insertOrIgnore($pivotRows);
        }

        DB::table('users')
            ->whereIn('role', ['client', 'developer', 'referral_partner'])
            ->whereNull('admin_id')
            ->update(['admin_id' => $adminId]);
    }

    public function down(): void
    {
        DB::table('projet_admins')->truncate();
        DB::table('users')->update(['admin_id' => null]);
    }
};
