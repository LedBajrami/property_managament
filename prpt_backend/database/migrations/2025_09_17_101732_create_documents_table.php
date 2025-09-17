<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->morphs('documentable'); // creates documentable_id and documentable_type
            $table->string('file_path');
            $table->enum('document_type', ['lease_agreement', 'receipt', 'id_document', 'other'])->default('other');
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->integer('file_size')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('document_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('documents');
    }
};
