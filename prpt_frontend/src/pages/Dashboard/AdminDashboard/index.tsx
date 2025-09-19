import AdminLayout from "@/components/layouts/admin-layout.tsx";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "../data.json";

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <SectionCards />
            <ChartAreaInteractive />
            <DataTable data={data} />
        </AdminLayout>
    );
}