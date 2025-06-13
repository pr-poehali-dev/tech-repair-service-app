import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!session) {
    return null;
  }

  const { user } = session;

  const navigation = [
    {
      name: "Дашборд",
      href: "/",
      icon: "LayoutDashboard",
      roles: ["client", "technician"],
    },
    {
      name: "Заявки на ремонт",
      href: "/repair-requests",
      icon: "Wrench",
      roles: ["client", "technician"],
    },
    {
      name: "Создать заявку",
      href: "/create-request",
      icon: "Plus",
      roles: ["client"],
    },
    {
      name: "Комплектующие",
      href: "/components",
      icon: "HardDrive",
      roles: ["technician"],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItems = () => (
    <div className="space-y-2">
      {filteredNavigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon name={item.icon} size={20} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Icon name="Wrench" className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">ТехРемонт</span>
          </div>

          <nav className="flex flex-1 flex-col">
            <NavItems />
          </nav>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge
                variant={user.role === "technician" ? "default" : "secondary"}
              >
                {user.role === "technician" ? "Техник" : "Клиент"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Icon name="Menu" size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex items-center mb-6">
              <Icon name="Wrench" className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">ТехРемонт</span>
            </div>

            <nav className="mb-6">
              <NavItems />
            </nav>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant={user.role === "technician" ? "default" : "secondary"}
                >
                  {user.role === "technician" ? "Техник" : "Клиент"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex items-center justify-between">
          <Badge variant={user.role === "technician" ? "default" : "secondary"}>
            {user.role === "technician" ? "Техник" : "Клиент"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <Icon name="LogOut" className="mr-2 h-4 w-4" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72">
        <main className="py-6 px-4 md:px-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
