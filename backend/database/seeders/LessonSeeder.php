<?php

namespace Database\Seeders;

use App\Models\Lesson;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $lessons = [
            [
                'title' => '基本の出汁の取り方',
                'description' => '和食の基本となる出汁の取り方を学びます。昆布と鰹節を使った一番出汁、二番出汁の作り方をマスターしましょう。',
                'category' => 'japanese',
                'difficulty' => 'beginner',
            ],
            [
                'title' => '本格パスタ講座',
                'description' => 'イタリアンの基本、パスタの茹で方からソース作りまで。アーリオオーリオ、カルボナーラ、ペペロンチーノを作ります。',
                'category' => 'western',
                'difficulty' => 'intermediate',
            ],
            [
                'title' => '中華炒め物マスター',
                'description' => '強火で仕上げる本格中華炒め。青椒肉絲、回鍋肉、麻婆豆腐など人気メニューを学びます。',
                'category' => 'chinese',
                'difficulty' => 'intermediate',
            ],
            [
                'title' => 'フレンチの基礎',
                'description' => 'フランス料理の基本テクニック。ソースの作り方、肉の焼き方、盛り付けの基本を習得します。',
                'category' => 'western',
                'difficulty' => 'advanced',
            ],
            [
                'title' => 'スイーツ入門',
                'description' => 'お菓子作りの基本を学びます。計量、混ぜ方、オーブンの使い方など基礎からしっかり。',
                'category' => 'sweets',
                'difficulty' => 'beginner',
            ],
        ];

        foreach ($lessons as $lesson) {
            Lesson::create($lesson);
        }
    }
}
