import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MdMenu } from "react-icons/md";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden">
                <MdMenu className="h-6 w-6" />
              </SidebarTrigger>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}