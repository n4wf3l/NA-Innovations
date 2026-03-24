<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->string('nom_societe')->nullable()->change();
            $table->string('type_societe')->nullable()->change();
            $table->string('type_site')->nullable()->change();
            $table->string('lieu')->nullable()->change();
            $table->integer('jours_developpement')->nullable()->change();
            $table->string('langage_programmation')->nullable()->change();
            $table->string('etoiles')->nullable()->change();
            $table->integer('nombre_collaborateurs')->nullable()->change();
            $table->string('lien')->nullable()->change();
            $table->string('image')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->string('nom_societe')->nullable(false)->change();
            $table->string('type_societe')->nullable(false)->change();
            $table->string('type_site')->nullable(false)->change();
            $table->string('lieu')->nullable(false)->change();
            $table->integer('jours_developpement')->nullable(false)->change();
            $table->string('langage_programmation')->nullable(false)->change();
            $table->string('etoiles')->nullable(false)->change();
            $table->integer('nombre_collaborateurs')->nullable(false)->change();
            $table->string('lien')->nullable(false)->change();
            $table->string('image')->nullable(false)->change();
        });
    }
};
