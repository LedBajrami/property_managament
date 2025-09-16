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
            'manage-property-details',

            // Unit Management
            'create-units',
            'edit-units',
            'view-units',
            'delete-units',
            'manage-unit-availability',

            // Tenant Management
            'create-tenants',
            'edit-tenants',
            'view-tenants',
            'delete-tenants',
            'manage-tenant-accounts',

            // Lease Management
            'create-leases',
            'edit-leases',
            'view-leases',
            'delete-leases',
            'approve-leases',
            'terminate-leases',

            // Payment Management
            'record-payments',
            'view-payments',
            'generate-invoices',
            'manage-payment-methods',
            'view-payment-reports',

            // Maintenance Management
            'create-maintenance-requests',
            'assign-maintenance-requests',
            'update-maintenance-status',
            'view-maintenance-requests',
            'approve-maintenance-costs',

            // Document Management
            'upload-documents',
            'view-documents',
            'manage-documents',
            'verify-documents',

            // Communication
            'send-notices',
            'view-messages',
            'send-messages',

            // Reports & Analytics
            'view-financial-reports',
            'view-occupancy-reports',
            'view-maintenance-reports',
            'export-reports',

            // Profile Management
            'view-own-profile',
            'edit-own-profile',
            'view-user-profiles',
            'manage-user-profiles',

            // System Administration
            'manage-system-settings',
            'view-audit-logs',
            'manage-roles-permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // Create roles and assign permissions
        $roles = [
            'super-admin' => [
                // Full platform access - manages multiple companies
                'create-properties',
                'edit-properties',
                'view-properties',
                'delete-properties',
                'manage-property-details',
                'create-units',
                'edit-units',
                'view-units',
                'delete-units',
                'manage-unit-availability',
                'create-tenants',
                'edit-tenants',
                'view-tenants',
                'delete-tenants',
                'manage-tenant-accounts',
                'create-leases',
                'edit-leases',
                'view-leases',
                'delete-leases',
                'approve-leases',
                'terminate-leases',
                'record-payments',
                'view-payments',
                'generate-invoices',
                'manage-payment-methods',
                'view-payment-reports',
                'create-maintenance-requests',
                'assign-maintenance-requests',
                'update-maintenance-status',
                'view-maintenance-requests',
                'approve-maintenance-costs',
                'upload-documents',
                'view-documents',
                'manage-documents',
                'verify-documents',
                'send-notices',
                'view-messages',
                'send-messages',
                'view-financial-reports',
                'view-occupancy-reports',
                'view-maintenance-reports',
                'export-reports',
                'view-own-profile',
                'edit-own-profile',
                'view-user-profiles',
                'manage-user-profiles',
                'manage-system-settings',
                'view-audit-logs',
                'manage-roles-permissions',
            ],

            'company-admin' => [
                // Company-level management - manages own company's properties and tenants
                'create-properties',
                'edit-properties',
                'view-properties',
                'delete-properties',
                'manage-property-details',
                'create-units',
                'edit-units',
                'view-units',
                'delete-units',
                'manage-unit-availability',

                // Tenant and lease management within company
                'create-tenants',
                'edit-tenants',
                'view-tenants',
                'manage-tenant-accounts',
                'create-leases',
                'edit-leases',
                'view-leases',
                'approve-leases',
                'terminate-leases',

                // Payment management
                'record-payments',
                'view-payments',
                'generate-invoices',
                'manage-payment-methods',
                'view-payment-reports',

                // Maintenance management
                'create-maintenance-requests',
                'assign-maintenance-requests',
                'update-maintenance-status',
                'view-maintenance-requests',
                'approve-maintenance-costs',

                // Documents and communication
                'upload-documents',
                'view-documents',
                'manage-documents',
                'verify-documents',
                'send-notices',
                'view-messages',
                'send-messages',

                // Company reports
                'view-financial-reports',
                'view-occupancy-reports',
                'view-maintenance-reports',
                'export-reports',

                // Profile management
                'view-own-profile',
                'edit-own-profile',
                'view-user-profiles',
                'manage-user-profiles',
            ],

            'resident' => [
                // View own lease and unit information
                'view-leases',
                'view-units',
                'view-properties',

                // Payment capabilities
                'view-payments',
                'record-payments',

                // Maintenance requests
                'create-maintenance-requests',
                'view-maintenance-requests',

                // Documents (own documents only)
                'upload-documents',
                'view-documents',

                // Communication
                'view-messages',
                'send-messages',

                // Own profile only
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
        $user = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Example',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $user->assignRole('super-admin');
    }
}
