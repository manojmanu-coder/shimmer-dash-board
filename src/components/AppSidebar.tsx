import { NavLink } from "react-router-dom";
import { 
  MdDashboard, 
  MdInventory, 
  MdShoppingCart, 
  MdPeople,
  MdCategory,
  MdBusiness,
  MdPercent
} from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: MdDashboard },
  { title: "Products", url: "/products", icon: MdInventory },
  { title: "Orders", url: "/orders", icon: MdShoppingCart },
  { title: "Users", url: "/users", icon: MdPeople },
];

const masterDataItems = [
  { title: "Categories", url: "/master/categories", icon: MdCategory },
  { title: "Brands", url: "/master/brands", icon: MdBusiness },
  { title: "GST Rates", url: "/master/gst-rates", icon: MdPercent },
];

export function AppSidebar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-admin"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="p-6">
          <h2 className="text-xl font-bold text-sidebar-primary-foreground">
            Admin Dashboard
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-semibold mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-semibold mb-2">
            Master Data
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
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
    </Sidebar>
  );
}