<?php

namespace App\Services\Property;

use App\Http\Resources\Property\PropertyResource;
use App\Models\Document;
use App\Models\Property;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertyService implements PropertyServiceInterface
{
    use ApiTrait;
    public function getProperties(Request $request)
    {
        try {
            $companyId = $request->header('X-Company-ID');

            $results = Property::with('documents')->where('company_id', $companyId)->get();

            $properties = $results->isEmpty()
                ? []
                : PropertyResource::collection($results);

            return $this->success(PropertyResource::collection($properties));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getProperty($property)
    {
        try {
            return $this->success(new PropertyResource($property->load('documents')));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createProperty($request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $company_id = $request->header('X-Company-ID');
            unset($data['thumbnail']);

            $property = Property::create(array_merge($data, ['company_id' => $company_id]));

            if ($request->hasFile('thumbnail')) {
                $this->storePropertyPhoto($property, $request->file('thumbnail'));
            }

            DB::commit();

            return $this->success(
                new PropertyResource($property->load('documents')),
                'Property created successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    private function storePropertyPhoto(Property $property, $file): void
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('photos/properties', $filename, 'documents');

        Document::create([
            'company_id' => $property->company_id,
            'documentable_id' => $property->id,
            'documentable_type' => Property::class,
            'file_path' => $path,
            'document_type' => 'property_photo',
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => Storage::disk('documents')->size($path),
        ]);
    }

    private function replacePropertyPhoto(Property $property, $file): void
    {
        $property->loadMissing('documents');

        foreach ($property->documents->where('document_type', 'property_photo') as $document) {
            Storage::disk('documents')->delete($document->file_path);
            $document->delete();
        }

        $this->storePropertyPhoto($property, $file);
    }

    public function editProperty($property, $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            unset($data['thumbnail']);

            $property->update($data);

            if ($request->hasFile('thumbnail')) {
                $this->replacePropertyPhoto($property, $request->file('thumbnail'));
            }

            DB::commit();

            return $this->success(new PropertyResource($property->fresh()->load('documents')), 'Property updated successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function deleteProperty($property)
    {
        try {
            $property->update([
                'email' => $property->email . '_deleted_' . now()->timestamp
            ]);
            $property->delete();

            return $this->success($property->id, 'Property deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
