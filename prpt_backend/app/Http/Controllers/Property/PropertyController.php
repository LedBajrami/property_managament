<?php

namespace App\Http\Controllers\Property;

use App\Http\Controllers\Controller;
use App\Http\Requests\Property\CreatePropertyRequest;
use App\Models\Property;
use App\Services\Property\PropertyServiceInterface;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    protected $propertyService;

    public function __construct(PropertyServiceInterface $propertyService) {
        $this->propertyService = $propertyService;
    }

    public function getProperties(Request $request) {
        return $this->propertyService->getProperties($request);
    }

    public function getProperty(Property $property) {
        return $this->propertyService->getProperty($property);
    }

    public function createProperty(CreatePropertyRequest $request) {
        return $this->propertyService->createProperty($request);
    }

    public function editProperty(Property $property ,CreatePropertyRequest $request) {
        return $this->propertyService->editProperty($property, $request);
    }

    public function deleteProperty(Property $property) {
        return $this->propertyService->deleteProperty($property);
    }
}
