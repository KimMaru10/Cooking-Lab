<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // スタッフ 2名
        User::factory()->staff()->create([
            'name' => '管理者 太郎',
            'email' => 'admin@example.com',
        ]);
        User::factory()->staff()->create([
            'name' => 'スタッフ 花子',
            'email' => 'staff@example.com',
        ]);

        // 講師 3名
        User::factory()->instructor()->create([
            'name' => '山田 シェフ',
            'email' => 'instructor1@example.com',
        ]);
        User::factory()->instructor()->create([
            'name' => '佐藤 シェフ',
            'email' => 'instructor2@example.com',
        ]);
        User::factory()->instructor()->create([
            'name' => '田中 シェフ',
            'email' => 'instructor3@example.com',
        ]);

        // 生徒 10名
        User::factory()->student()->create([
            'name' => '生徒 一郎',
            'email' => 'student@example.com',
        ]);
        User::factory()->student()->count(9)->create();
    }
}
