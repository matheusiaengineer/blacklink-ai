import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { NovaChat } from "@/components/dashboard/NovaChat";
import { CommandPalette } from "@/components/dashboard/CommandPalette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <NovaChat />
      <CommandPalette />
    </div>
  );
}
