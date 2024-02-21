<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('academic_projets', function (Blueprint $table) {
            $table->id();
            $table->string('nom_societe');
            $table->string('type_societe');
            $table->string('type_site');
            $table->string('lieu');
            $table->integer('jours_developpement');
            $table->string('langage_programmation');
            $table->string('etoiles');
            $table->integer('nombre_collaborateurs');
            $table->string('lien');
            $table->string('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_projets');
    }
};
