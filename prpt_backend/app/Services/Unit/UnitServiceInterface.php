<?php

namespace App\Services\Unit;

use App\Http\Requests\Unit\CreateUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\Request;

interface UnitServiceInterface
{
    public function getUnits(Request $request);

    public function getUnit(Unit $unit);

    public function createUnit(CreateUnitRequest $request);

    public function editUnit(Unit $unit, UpdateUnitRequest $request);

    public function deleteUnit(Unit $unit);
}
