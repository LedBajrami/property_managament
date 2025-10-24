<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Http\Requests\Unit\CreateUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
use App\Models\Unit;
use App\Services\Unit\UnitServiceInterface;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    protected $unitService;

    public function __construct(UnitServiceInterface $unitService) {
        $this->unitService = $unitService;
    }

    public function getUnits(Request $request) {
        return $this->unitService->getUnits($request);
    }

    public function getUnit(Unit $unit) {
        return $this->unitService->getUnit($unit);
    }

    public function createUnit(CreateUnitRequest $request) {
        return $this->unitService->createUnit($request);
    }

    public function editUnit(Unit $unit, UpdateUnitRequest $request) {
        return $this->unitService->editUnit($unit, $request);
    }

    public function deleteUnit(Unit $unit) {
        return $this->unitService->deleteUnit($unit);
    }
}
