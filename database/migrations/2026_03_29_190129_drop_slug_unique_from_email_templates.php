<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_templates', function (Blueprint $table) {
            // The slug-only unique index conflicts with slug+locale unique
            // We need slug to repeat across locales (same slug, different languages)
            try {
                $table->dropUnique('email_templates_slug_unique');
            } catch (\Exception $e) {
                // Already dropped
            }
        });
    }

    public function down(): void
    {
        // Don't re-add the broken constraint
    }
};
