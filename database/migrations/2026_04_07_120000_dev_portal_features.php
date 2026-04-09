<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'hourly_rate')) {
                $table->decimal('hourly_rate', 8, 2)->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'skills')) {
                $table->json('skills')->nullable()->after('hourly_rate');
            }
            if (!Schema::hasColumn('users', 'specialties')) {
                $table->json('specialties')->nullable()->after('skills');
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('specialties');
            }
        });

        Schema::table('projets', function (Blueprint $table) {
            if (!Schema::hasColumn('projets', 'estimated_hours')) {
                $table->decimal('estimated_hours', 8, 2)->nullable()->after('budget');
            }
            if (!Schema::hasColumn('projets', 'project_credentials')) {
                $table->text('project_credentials')->nullable()->after('estimated_hours');
            }
            if (!Schema::hasColumn('projets', 'project_env')) {
                $table->text('project_env')->nullable()->after('project_credentials');
            }
        });

        if (!Schema::hasTable('project_milestones')) {
            Schema::create('project_milestones', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
                $table->string('label');
                $table->text('description')->nullable();
                $table->date('due_date')->nullable();
                $table->string('status')->default('pending');
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        Schema::table('time_entries', function (Blueprint $table) {
            if (!Schema::hasColumn('time_entries', 'approval_status')) {
                $table->string('approval_status')->default('approved')->after('is_billable');
            }
            if (!Schema::hasColumn('time_entries', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approval_status');
            }
            if (!Schema::hasColumn('time_entries', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('time_entries', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable();
            }
        });

        if (!Schema::hasTable('dev_messages')) {
            Schema::create('dev_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
                $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
                $table->string('recipient_role')->default('admin');
                $table->text('content');
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('dev_messages');
        Schema::dropIfExists('project_milestones');

        Schema::table('time_entries', function (Blueprint $table) {
            foreach (['approval_status', 'approved_at', 'approved_by', 'rejection_reason'] as $col) {
                if (Schema::hasColumn('time_entries', $col)) {
                    if ($col === 'approved_by') {
                        $table->dropConstrainedForeignId('approved_by');
                    } else {
                        $table->dropColumn($col);
                    }
                }
            }
        });

        Schema::table('projets', function (Blueprint $table) {
            foreach (['estimated_hours', 'project_credentials', 'project_env'] as $col) {
                if (Schema::hasColumn('projets', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('users', function (Blueprint $table) {
            foreach (['hourly_rate', 'skills', 'specialties', 'bio'] as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
