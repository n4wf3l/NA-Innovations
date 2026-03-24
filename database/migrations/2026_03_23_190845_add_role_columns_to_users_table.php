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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('email');
            $table->string('phone', 20)->nullable()->after('role');
            $table->string('company_name')->nullable()->after('phone');
            $table->string('vat_number', 30)->nullable()->after('company_name');
            $table->text('address')->nullable()->after('vat_number');
            $table->string('city', 100)->nullable()->after('address');
            $table->string('postal_code', 20)->nullable()->after('city');
            $table->string('country', 100)->default('Belgium')->after('postal_code');
            $table->string('avatar')->nullable()->after('country');
            $table->string('locale', 5)->default('fr')->after('avatar');
            $table->boolean('is_active')->default(true)->after('locale');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->softDeletes();

            $table->index(['role', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'is_active']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'role',
                'phone',
                'company_name',
                'vat_number',
                'address',
                'city',
                'postal_code',
                'country',
                'avatar',
                'locale',
                'is_active',
                'last_login_at',
            ]);
        });
    }
};
