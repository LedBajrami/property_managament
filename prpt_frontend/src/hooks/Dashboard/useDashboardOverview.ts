import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/library/http/backendHelpers";
import { APIResponse } from "@/types/API";
import { DashboardOverview } from "@/types/dashboard";

export const useDashboardOverview = () => {
    return useQuery<APIResponse<DashboardOverview>>({
        queryKey: ["dashboard", "overview"],
        queryFn: getDashboardOverview,
    });
};
