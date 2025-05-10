<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        $projects = [
            [
                'name' => 'Web Redesign',
                'description' => 'Complete redesign of the company website with modern UI/UX principles',
                'estimated_budget' => 15000.00,
                'actual_expenditure' => 0.00,
                'status' => 'pending',
                'start_date' => $now,
                'end_date' => $now->copy()->addMonths(3),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Mobile App Development',
                'description' => 'Development of a new mobile application for both iOS and Android platforms',
                'estimated_budget' => 25000.00,
                'actual_expenditure' => 0.00,
                'status' => 'pending',
                'start_date' => $now,
                'end_date' => $now->copy()->addMonths(6),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Database Migration',
                'description' => 'Migration of legacy database systems to a new cloud-based solution',
                'estimated_budget' => 10000.00,
                'actual_expenditure' => 0.00,
                'status' => 'pending',
                'start_date' => $now,
                'end_date' => $now->copy()->addMonths(2),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('projects')->insert($projects);
    }
} 