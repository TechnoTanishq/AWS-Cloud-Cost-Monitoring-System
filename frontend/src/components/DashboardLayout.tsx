import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3, LayoutDashboard, PieChart, Brain, Wallet, Settings, LogOut, Shield, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/costs", label: "Cost Breakdown", icon: PieChart },
  { to: "/dashboard/ml", label: "ML Insights", icon: Brain },
  { to: "/dashboard/budgets", label: "Budgets", icon: Wallet },
  { to: "/dashboard/iam", label: "IAM Integration", icon: Shield },
  { to: "/dashboard/settings", label: "Account Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === path : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <BarChart3 className="h-6 w-6 text-sidebar-primary" />
          <span className="text-sidebar-accent-foreground">FinSight</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.to)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-sidebar-foreground/60">Signed in as</p>
        <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user?.email || localStorage.getItem("email")}
</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground hover:text-destructive hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 flex flex-col bg-sidebar shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 h-14 flex items-center gap-3 border-b bg-card/80 backdrop-blur-md px-4 lg:px-6">
          <button className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-muted-foreground">
            {navItems.find((i) => isActive(i.to))?.label || "Dashboard"}
          </h1>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
