<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // Tạo 10 task cho user ID là 29
        for ($i = 0; $i < 10; $i++) {
            Task::create([
                'name' => 'Task ' . $i,
                'description' => 'Description ' . $i,
                'status' => 'pending',
                'user_id' => 29,
                'start_date' => now(),
                'end_date' => now()->addDays(10),
            ]);
        }
        // Tạo ngẫu nhiên 10 task cho user id random từ 12 đến 30
        for ($i = 0; $i < 10; $i++) {
            Task::create([
                'name' => 'Task ' . $i,
                'description' => 'Description ' . $i,
                'status' => 'pending',
                'user_id' => rand(12, 30),
                'start_date' => now(),
                'end_date' => now()->addDays(10),
            ]);
        }
    }
}
