<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Check if the index exists before dropping
        $indexes = DB::select("SHOW INDEX FROM email_templates WHERE Key_name = 'email_templates_slug_unique'");
        if (count($indexes) > 0) {
            Schema::table('email_templates', function (Blueprint $table) {
                $table->dropUnique('email_templates_slug_unique');
            });
        }
    }

    public function down(): void
    {
        // Don't re-add the broken constraint
    }
};
