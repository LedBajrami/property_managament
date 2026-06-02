<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Property\PropertyResource;
use App\Models\Property;
use App\Models\Unit;
use App\Services\Public\Resident\Properties\PublicPropertiesServiceInterface;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;

class PublicPropertyController extends Controller
{
    protected $publicPropertyService;

    public function __construct(PublicPropertiesServiceInterface $publicPropertyService) {
        $this->publicPropertyService = $publicPropertyService;
    }

    use ApiTrait;


    public function getPublicProperties(Request $request)
    {
        return $this->publicPropertyService->getPublicProperties($request);
    }


    public function getPublicProperty(int $id)
    {
        return $this->publicPropertyService->getPublicProperty($id);
    }


    public function getPublicPropertyUnit(int $propertyId, int $unitId)
    {
        return $this->publicPropertyService->getPublicPropertyUnit($propertyId, $unitId);
    }
}
