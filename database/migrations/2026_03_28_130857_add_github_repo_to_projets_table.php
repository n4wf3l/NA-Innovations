<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->string('github_repo', 255)->nullable()->after('lien');
            $table->boolean('show_commits_to_client')->default(false)->after('github_repo');
        });
    }

    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->dropColumn(['github_repo', 'show_commits_to_client']);
        });
    }
};
