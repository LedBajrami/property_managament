import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useAuth} from "@/hooks/Auth/useAuth.ts";
import {Building2, CreditCard, FileChartColumn, FileText, FolderKanban, Users} from "lucide-react";
import {Link} from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();
    const current_company_id = localStorage.getItem("current_company_id");
    const company_name = user?.companies.find((company: any) =>
        company.id == current_company_id
    )?.name;

    const sidebarData = {
        user: {
            name: user?.first_name ?? "Guest",
            email: user?.email ?? "guest@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: IconDashboard,
            },
            {
                title: "Properties",
                url: "/properties/",
                icon: Building2,
            },
            {
                title: "Residents",
                url: "/residents",
                icon: Users,
            },
            {
                title: "Payments",
                url: "/payments",
                icon: CreditCard,
            },
            {
                title: "Team",
                url: "/team",
                icon: FolderKanban,
            },
        ],
        navClouds: [
            {
                title: "Capture",
                icon: IconCamera,
                isActive: true,
                url: "#",
                items: [
                    {
                        title: "Active Proposals",
                        url: "#",
                    },
                    {
                        title: "Archived",
                        url: "#",
                    },
                ],
            },
            {
                title: "Proposal",
                icon: IconFileDescription,
                url: "#",
                items: [
                    {
                        title: "Active Proposals",
                        url: "#",
                    },
                    {
                        title: "Archived",
                        url: "#",
                    },
                ],
            },
            {
                title: "Prompts",
                icon: IconFileAi,
                url: "#",
                items: [
                    {
                        title: "Active Proposals",
                        url: "#",
                    },
                    {
                        title: "Archived",
                        url: "#",
                    },
                ],
            },
        ],
        navSecondary: [
            {
                title: "Settings",
                url: "/settings",
                icon: IconSettings,
            },
        ],
        documents: [
            {
                name: "Documents",
                url: "/documents",
                icon: FileText,
            },
            {
                name: "Reports",
                url: "/reports",
                icon: FileChartColumn,
            },
        ],
    }


    return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{company_name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavDocuments items={sidebarData.documents} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
