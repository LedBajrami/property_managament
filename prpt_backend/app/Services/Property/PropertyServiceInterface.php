<?php

namespace App\Services\Property;

use App\Http\Requests\Property\CreatePropertyRequest;
use App\Http\Resources\Property\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;

interface PropertyServiceInterface
{
    public function getProperties(Request $request);

    public function getProperty(Property $property);

    public function createProperty(CreatePropertyRequest $request);

    public function editProperty(Property $property, CreatePropertyRequest $request);

    public function deleteProperty(Property $property);
}
