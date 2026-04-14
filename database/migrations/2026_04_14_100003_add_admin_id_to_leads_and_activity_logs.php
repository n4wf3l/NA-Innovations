<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('leads', 'admin_id')) {
            Schema::table('leads', function (Blueprint $table) {
                $table->foreignId('admin_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
                $table->index('admin_id');
            });
        }

        if (Schema::hasTable('activity_log') && !Schema::hasColumn('activity_log', 'admin_id')) {
            Schema::table('activity_log', function (Blueprint $table) {
                $table->foreignId('admin_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
                $table->index('admin_id');
            });
        }

        $primaryAdmin = DB::table('users')->where('role', 'admin')->orderBy('id')->first();
        if (!$primaryAdmin) {
            return;
        }
        $adminId = $primaryAdmin->id;

        DB::statement("
            UPDATE leads
            SET admin_id = COALESCE(
                (SELECT u.admin_id FROM referral_partners rp JOIN users u ON u.id = rp.user_id WHERE rp.id = leads.referral_partner_id),
                (SELECT u.admin_id FROM users u WHERE u.id = leads.converted_client_id),
                ?
            )
            WHERE admin_id IS NULL
        ", [$adminId]);

        if (Schema::hasTable('activity_log')) {
            DB::statement("
                UPDATE activity_log
                SET admin_id = COALESCE(
                    (SELECT u.admin_id FROM users u WHERE u.id = activity_log.user_id),
                    (SELECT u.id FROM users u WHERE u.id = activity_log.user_id AND u.role = 'admin' LIMIT 1),
                    ?
                )
                WHERE admin_id IS NULL
            ", [$adminId]);
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('leads', 'admin_id')) {
            Schema::table('leads', function (Blueprint $table) {
                $table->dropForeign(['admin_id']);
                $table->dropIndex(['admin_id']);
                $table->dropColumn('admin_id');
            });
        }
        if (Schema::hasTable('activity_log') && Schema::hasColumn('activity_log', 'admin_id')) {
            Schema::table('activity_log', function (Blueprint $table) {
                $table->dropForeign(['admin_id']);
                $table->dropIndex(['admin_id']);
                $table->dropColumn('admin_id');
            });
        }
    }
};
