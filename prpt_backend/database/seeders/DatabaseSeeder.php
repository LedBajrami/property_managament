<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles and Permissions for Spatie
        $this->createRolesAndPermissions();

        // Create sample users
        $this->createSampleUsers();
    }


    private function createRolesAndPermissions(): void
    {
        // Create permissions
        $permissions = [
            // Property Management
            'create-properties',
            'edit-properties',
            'view-properties',
            'delete-properties',

            // Unit Management
            'create-units',
            'edit-units',
            'view-units',
            'delete-units',

            // Resident Management
            'create-residents',
            'edit-residents',
            'view-residents',
            'delete-residents',

            // Lease Management
            'create-leases',
            'edit-leases',
            'view-leases',
            'delete-leases',

            // Payment Management
            'record-payments',
            'view-payments',
            'view-payment-reports',

            // Maintenance Management
            'create-maintenance-requests',
            'assign-maintenance-requests',
            'update-maintenance-status',
            'view-maintenance-requests',

            // Document Management
            'upload-documents',
            'view-documents',
            'manage-documents',

            // Team Management
            'invite-users',
            'manage-users',
            'view-users',

            // Reports
            'view-reports',

            // Profile Management
            'view-own-profile',
            'edit-own-profile',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Create roles and assign permissions
        $roles = [
            'super-admin' => [
                // All permissions for platform management
                'create-properties',
                'edit-properties',
                'view-properties',
                'delete-properties',
                'create-units',
                'edit-units',
                'view-units',
                'delete-units',
                'create-residents',
                'edit-residents',
                'view-residents',
                'delete-residents',
                'create-leases',
                'edit-leases',
                'view-leases',
                'delete-leases',
                'record-payments',
                'view-payments',
                'view-payment-reports',
                'create-maintenance-requests',
                'assign-maintenance-requests',
                'update-maintenance-status',
                'view-maintenance-requests',
                'upload-documents',
                'view-documents',
                'manage-documents',
                'invite-users',
                'manage-users',
                'view-users',
                'view-reports',
                'view-own-profile',
                'edit-own-profile',
            ],

            'company-admin' => [
                // Full company management (can create properties)
                'create-properties',
                'edit-properties',
                'view-properties',
                'delete-properties',
                'create-units',
                'edit-units',
                'view-units',
                'delete-units',
                'create-residents',
                'edit-residents',
                'view-residents',
                'delete-residents',
                'create-leases',
                'edit-leases',
                'view-leases',
                'delete-leases',
                'record-payments',
                'view-payments',
                'view-payment-reports',
                'create-maintenance-requests',
                'assign-maintenance-requests',
                'update-maintenance-status',
                'view-maintenance-requests',
                'upload-documents',
                'view-documents',
                'manage-documents',
                'invite-users',
                'manage-users',
                'view-users',
                'view-reports',
                'view-own-profile',
                'edit-own-profile',
            ],

            'property-manager' => [
                // Property operations (cannot create properties)
                'edit-properties',
                'view-properties',
                'create-units',
                'edit-units',
                'view-units',
                'delete-units',
                'create-residents',
                'edit-residents',
                'view-residents',
                'delete-residents',
                'create-leases',
                'edit-leases',
                'view-leases',
                'delete-leases',
                'record-payments',
                'view-payments',
                'view-payment-reports',
                'create-maintenance-requests',
                'assign-maintenance-requests',
                'update-maintenance-status',
                'view-maintenance-requests',
                'upload-documents',
                'view-documents',
                'manage-documents',
                'view-reports',
                'view-own-profile',
                'edit-own-profile',
            ],

            'maintenance' => [
                // Only maintenance-related permissions
                'view-maintenance-requests',
                'update-maintenance-status',
                'upload-documents',
                'view-documents',
                'view-own-profile',
                'edit-own-profile',
            ],

            'resident' => [
                // Resident portal access
                'view-leases',
                'view-units',
                'view-properties',
                'view-payments',
                'record-payments',
                'create-maintenance-requests',
                'view-maintenance-requests',
                'upload-documents',
                'view-documents',
                'view-own-profile',
                'edit-own-profile',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName, 'guard_name' => 'api']);
            $role->givePermissionTo($rolePermissions);
        }
    }

    private function createSampleUsers(): void
    {
        $superAdminUser = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Example',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $superAdminUser->assignRole('super-admin');

        $companyAdminUser = User::create([
            'first_name' => 'CompanyAdmin',
            'last_name' => 'Example',
            'email' => 'cadmin@example.com',
            'password' => Hash::make('password'),
        ]);

        $companyAdminUser->assignRole('company-admin');
    }
}
