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
        Schema::table('posts', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title');
            $table->text('content')->nullable()->after('description');
            $table->string('excerpt', 500)->nullable()->after('content');
            $table->string('category')->nullable()->after('excerpt');
            $table->json('tags')->nullable()->after('category');
            $table->string('status')->default('draft')->after('tags');
            $table->timestamp('published_at')->nullable()->after('status');
            $table->foreignId('author_id')->nullable()->after('published_at')->constrained('users')->nullOnDelete();
            $table->integer('reading_time')->nullable()->after('author_id');
            $table->string('cover_image')->nullable()->after('photo');
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['author_id']);
            $table->dropColumn([
                'slug', 'content', 'excerpt', 'category', 'tags',
                'status', 'published_at', 'author_id', 'reading_time',
                'cover_image', 'meta_title', 'meta_description',
            ]);
            $table->dropSoftDeletes();
        });
    }
};
