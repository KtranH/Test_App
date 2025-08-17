<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo Super Admin
        User::updateOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Super Admin',
                'email' => 'super@admin.com',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        // Tạo Admin 1
        User::updateOrCreate(
            ['email' => 'admin1@test.com'],
            [
                'name' => 'Admin One',
                'email' => 'admin1@test.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Tạo Admin 2
        User::updateOrCreate(
            ['email' => 'admin2@test.com'],
            [
                'name' => 'Admin Two',
                'email' => 'admin2@test.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Tạo User thường 1
        User::updateOrCreate(
            ['email' => 'user1@test.com'],
            [
                'name' => 'User One',
                'email' => 'user1@test.com',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'active',
            ]
        );

        // Tạo User thường 2
        User::updateOrCreate(
            ['email' => 'user2@test.com'],
            [
                'name' => 'User Two',
                'email' => 'user2@test.com',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'active',
            ]
        );

        // Tạo User inactive để test
        User::updateOrCreate(
            ['email' => 'inactive@test.com'],
            [
                'name' => 'Inactive User',
                'email' => 'inactive@test.com',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'inactive',
            ]
        );

        echo "✅ Đã tạo test users:\n";
        echo "📧 Super Admin: super@admin.com / password123\n";
        echo "📧 Admin 1: admin1@test.com / password123\n";
        echo "📧 Admin 2: admin2@test.com / password123\n";
        echo "📧 User 1: user1@test.com / password123\n";
        echo "📧 User 2: user2@test.com / password123\n";
        echo "📧 Inactive User: inactive@test.com / password123\n";
    }
}
