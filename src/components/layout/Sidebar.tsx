
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Dumbbell, Calendar, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/"
  },
  {
    title: "Workouts",
    icon: Dumbbell,
    path: "/workouts"
  },
  {
    title: "Progress",
    icon: BarChart2,
    path: "/progress"
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

const Sidebar = () => {
  return (
    <SidebarComponent>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-gym-purple" />
          <span className="font-bold text-xl">IronScribe</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn("flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors", 
                          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
