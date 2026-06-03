import { PaymentSchedule } from "@/types/payment.ts";
import {useState} from "react";
import {ChevronDown} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

function fmt(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function groupByProperty(schedules: PaymentSchedule[]) {
    const map: Record<number, {
        property: NonNullable<NonNullable<PaymentSchedule["unit"]>["property"]>;
        units: Record<number, {
            unit: NonNullable<PaymentSchedule["unit"]>;
            resident: NonNullable<PaymentSchedule["resident"]>;
            schedules: PaymentSchedule[];
        }>;
    }> = {};

    for (const s of schedules) {
        const pid = s.unit?.property?.id;
        const uid = s.unit?.id;
        const property = s.unit?.property;
        const unit = s.unit;
        const resident = s.resident;

        if (!pid || !uid || !property || !unit || !resident) {
            continue;
        }

        if (!map[pid]) map[pid] = { property, units: {} };
        if (!map[pid].units[uid]) map[pid].units[uid] = { unit, resident, schedules: [] };
        map[pid].units[uid].schedules.push(s);
    }
    return Object.values(map);
}

export function PaymentOverview({ schedules }: { schedules: PaymentSchedule[] }) {
    const [openIds, setOpenIds] = useState<Set<number>>(new Set());
    const groups = groupByProperty(schedules);

    const total = schedules.reduce((s, x) => s + x.total_due, 0);
    const collected = schedules.filter(x => x.status === "paid")
        .reduce((s, x) => s + Number(x.latest_transaction?.amount_paid ?? 0), 0);
    const overdue = schedules.filter(x => x.status === "overdue").reduce((s, x) => s + x.total_due, 0);
    const collectionRate = total > 0 ? Math.round((collected / total) * 100) : 0;

    const toggle = (id: number) =>
        setOpenIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    return (
        <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: "Total scheduled", value: fmt(total), sub: `${schedules.length} payments` },
                    { label: "Collected", value: fmt(collected), sub: `${collectionRate}% collection rate` },
                    { label: "Overdue", value: fmt(overdue), sub: `${schedules.filter(x => x.status === "overdue").length} payments` },
                    { label: "Pending", value: fmt(schedules.filter(x => x.status === "pending").reduce((s, x) => s + x.total_due, 0)), sub: `${schedules.filter(x => x.status === "pending").length} payments` },
                ].map(c => (
                    <div key={c.label} className="bg-muted rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                        <p className="text-xl font-medium">{c.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Property cards */}
            <div className="space-y-3">
                {groups.map(({ property, units }) => {
                    const allSchedules = Object.values(units).flatMap(u => u.schedules);
                    const propTotal = allSchedules.reduce((s, x) => s + x.total_due, 0);
                    const paid = allSchedules.filter(x => x.status === "paid").length;
                    const pending = allSchedules.filter(x => x.status === "pending").length;
                    const overdueCount = allSchedules.filter(x => x.status === "overdue").length;
                    const isOpen = openIds.has(property.id);

                    return (
                        <div key={property.id} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-left"
                                onClick={() => toggle(property.id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{property.name}</p>
                                    <p className="text-xs text-muted-foreground">{property.address}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {paid > 0 && <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">{paid} paid</Badge>}
                                    {pending > 0 && <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">{pending} pending</Badge>}
                                    {overdueCount > 0 && <Badge variant="destructive">{overdueCount} overdue</Badge>}
                                    <span className="text-sm font-medium w-24 text-right">{fmt(propTotal)}</span>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border-t divide-y">
                                    {Object.values(units).map(({ unit, resident, schedules: us }) => {
                                        const unitTotal = us.reduce((s, x) => s + x.total_due, 0);
                                        const uc = {
                                            paid: us.filter(x => x.status === "paid").length,
                                            pending: us.filter(x => x.status === "pending").length,
                                            overdue: us.filter(x => x.status === "overdue").length,
                                        };
                                        return (
                                            <div key={unit.id} className="flex items-center gap-3 px-4 py-2.5 pl-10 text-sm">
                                                <span className="font-medium w-20 text-xs">{unit.unit_number}</span>
                                                <span className="text-muted-foreground flex-1 text-xs">
                                                    {resident.first_name} {resident.last_name}
                                                </span>
                                                <div className="flex gap-4 items-center text-xs text-muted-foreground">
                                                    {uc.paid > 0 && <span><strong className="text-foreground">{uc.paid}</strong> paid</span>}
                                                    {uc.pending > 0 && <span><strong className="text-foreground">{uc.pending}</strong> pending</span>}
                                                    {uc.overdue > 0 && <span className="text-destructive"><strong>{uc.overdue}</strong> overdue</span>}
                                                    <span className="font-medium text-foreground">{fmt(unitTotal)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
