<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('github_token')->nullable()->after('signature');
            $table->string('github_username')->nullable()->after('github_token');
        });

        Schema::table('projets', function (Blueprint $table) {
            if (!Schema::hasColumn('projets', 'github_linked_by')) {
                $table->foreignId('github_linked_by')->nullable()->after('github_repo')->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            if (Schema::hasColumn('projets', 'github_linked_by')) {
                $table->dropConstrainedForeignId('github_linked_by');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_token', 'github_username']);
        });
    }
};
