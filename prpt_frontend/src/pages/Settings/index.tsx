import AdminLayout from "@/components/layouts/admin-layout";
import { useAuth } from "@/hooks/Auth/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyOption {
    id: number | string;
    name: string;
}

export default function SettingsPage() {
    const { user } = useAuth();
    const currentCompanyId = localStorage.getItem("current_company_id");
    const company = (user?.companies as CompanyOption[] | undefined)
        ?.find((item) => String(item.id) === String(currentCompanyId));

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground text-sm">Account and company context.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Your current signed-in profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <Info label="Name" value={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`} />
                            <Info label="Email" value={user?.email} />
                            <Info label="Role" value={<Badge variant="outline">{user?.role}</Badge>} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Company</CardTitle>
                            <CardDescription>Selected company for scoped data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <Info label="Company" value={company?.name ?? "No company selected"} />
                            <Info label="Company ID" value={currentCompanyId ?? "—"} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

const Info = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="flex justify-between gap-4 border-b pb-2 last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
);
