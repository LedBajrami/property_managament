<?php

namespace App\Services\Public\Resident\Properties;

use Illuminate\Http\Request;

interface PublicPropertiesServiceInterface
{
    public function getPublicProperties(Request $request);

    public function getPublicProperty(int $id);

    public function getPublicPropertyUnit(int $propertyId, int $unitId);
}
