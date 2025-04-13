
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Dumbbell, Calendar, Settings, LayoutDashboard, LogOut } from 'lucide-react';
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  const { user } = useUser();
  const { signOut } = useClerk();
  const userInitials = user?.firstName 
    ? user.firstName.substring(0, 1) + (user.lastName ? user.lastName.substring(0, 1) : '')
    : user?.emailAddresses[0]?.emailAddress
      ? user.emailAddresses[0].emailAddress.substring(0, 2).toUpperCase()
      : "UI";

  const primaryEmail = user?.emailAddresses[0]?.emailAddress;
  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`
    : primaryEmail 
      ? primaryEmail.split('@')[0] 
      : 'User';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
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
      <SidebarFooter className="px-3 py-4 border-t">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {primaryEmail}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
