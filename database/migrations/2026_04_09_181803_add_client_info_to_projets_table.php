<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            // Admin-editable info shown to client on /client/projects/{id}
            $table->string('preview_url')->nullable()->after('lien');
            $table->string('staging_url')->nullable()->after('preview_url');
            $table->json('useful_links')->nullable()->after('staging_url'); // [{label, url, icon?}]
            $table->boolean('client_action_required')->default(false)->after('useful_links');
            $table->text('client_action_message')->nullable()->after('client_action_required');
            $table->string('current_phase')->nullable()->after('client_action_message'); // free text "Maquettes en cours", etc.
            $table->date('next_milestone_date')->nullable()->after('current_phase');
            $table->string('next_milestone_label')->nullable()->after('next_milestone_date');
        });
    }

    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->dropColumn(['preview_url', 'staging_url', 'useful_links', 'client_action_required', 'client_action_message', 'current_phase', 'next_milestone_date', 'next_milestone_label']);
        });
    }
};
