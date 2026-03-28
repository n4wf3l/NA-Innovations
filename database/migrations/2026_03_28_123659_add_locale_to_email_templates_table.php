<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_templates', function (Blueprint $table) {
            $table->string('locale', 5)->default('en')->after('slug');
        });

        // Make slug+locale unique instead of just slug
        Schema::table('email_templates', function (Blueprint $table) {
            $table->dropIndex('email_templates_slug_index');
            $table->unique(['slug', 'locale'], 'email_templates_slug_locale_unique');
        });
    }

    public function down(): void
    {
        Schema::table('email_templates', function (Blueprint $table) {
            $table->dropUnique('email_templates_slug_locale_unique');
            $table->index('slug');
            $table->dropColumn('locale');
        });
    }
};
