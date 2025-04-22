<?php

namespace App\Imports;

use App\Models\Violations;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ViolationsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Violation::create([
                'code' => $row['code'] ?? null,
                'violation_name' => $row['violation_name'] ?? null,
                'category' => $row['category'] ?? null,
                'offence_type' => $row['offence_type'] ?? null,
                'demerit_points' => $row['demerit_points'] ?? null,
                'fine_birr' => $row['fine (birr)'] ?? 0, // match your Excel column
                'action_description' => $row['action_description'] ?? null,
            ]);
        }
    }
}
