<?php

namespace App\Services\Unit;

use App\Http\Resources\Unit\UnitResource;
use App\Models\Document;
use App\Models\Unit;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UnitService implements UnitServiceInterface
{
    use ApiTrait;
    public function getUnits(Request $request)
    {
        try {
            $propertyId = $request->input('property_id');
            $results = Unit::with('documents')->where('property_id', $propertyId)->get();

            $units = $results->isEmpty()
                ? []
                : UnitResource::collection($results);

            return $this->success(UnitResource::collection($units));
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getUnit($unit)
    {
        try {
            $unit->load(['leases', 'documents']);
            return $this->success(new UnitResource($unit));
        } catch (\Throwable $th) {
            return $this->error($th);
        }
    }

    public function createUnit($request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            unset($data['thumbnail'], $data['gallery_photos']);

            $unit = Unit::create($data);

            if ($request->hasFile('thumbnail')) {
                $this->storeUnitPhoto($unit, $request->file('thumbnail'));
            }

            foreach ($request->file('gallery_photos', []) as $file) {
                $this->storeUnitPhoto($unit, $file);
            }

            DB::commit();

            return $this->success(
                new UnitResource($unit->load('documents')),
                'Unit created successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    private function storeUnitPhoto(Unit $unit, $file): void
    {
        $unit->loadMissing('property');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('photos/units', $filename, 'documents');

        Document::create([
            'company_id' => $unit->property->company_id,
            'documentable_id' => $unit->id,
            'documentable_type' => Unit::class,
            'file_path' => $path,
            'document_type' => 'unit_photo',
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => Storage::disk('documents')->size($path),
        ]);
    }

    private function replaceUnitThumbnail(Unit $unit, $file): void
    {
        $unit->loadMissing('documents');

        $thumbnail = $unit->documents
            ->where('document_type', 'unit_photo')
            ->sortBy('id')
            ->first();

        if ($thumbnail) {
            Storage::disk('documents')->delete($thumbnail->file_path);

            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('photos/units', $filename, 'documents');

            $thumbnail->update([
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => Storage::disk('documents')->size($path),
            ]);

            return;
        }

        $this->storeUnitPhoto($unit, $file);
    }

    public function editUnit($unit, $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            unset($data['thumbnail'], $data['gallery_photos']);

            $unit->update($data);

            if ($request->hasFile('thumbnail')) {
                $this->replaceUnitThumbnail($unit, $request->file('thumbnail'));
            }

            foreach ($request->file('gallery_photos', []) as $file) {
                $this->storeUnitPhoto($unit, $file);
            }

            DB::commit();

            return $this->success(
                new UnitResource($unit->fresh()->load('documents')),
                'Unit updated successfully'
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function deleteUnit($unit)
    {
        try {
            $unit->update([
                'email' => $unit->email . '_deleted_' . now()->timestamp
            ]);
            $unit->delete();

            return $this->success($unit->id, 'Unit deleted successfully');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
