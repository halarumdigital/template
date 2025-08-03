import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import {
  BarChart3,
  Users,
  Bus,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Get system settings
  const { logo, systemColor } = useSystemSettings();

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const isMenuExpanded = (menu: string) => expandedMenus.includes(menu);

  const adminMenuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Clientes",
      icon: Users,
      submenu: [
        { title: "Listar Clientes", href: "/admin/clients" },
        { title: "Novo Cliente", href: "/admin/clients/new" },
      ],
    },
    {
      title: "Equipe",
      icon: Bus,
      submenu: [
        { title: "Listar Equipe", href: "/admin/team" },
        { title: "Novo Membro", href: "/admin/team/new" },
      ],
    },
    {
      title: "Relatórios",
      href: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const clientMenuItems = [
    {
      title: "Dashboard",
      href: "/client",
      icon: BarChart3,
    },
    {
      title: "Faturas",
      href: "/client/invoices",
      icon: FileText,
    },
    {
      title: "Perfil",
      href: "/client/profile",
      icon: User,
    },
  ];

  const teamMenuItems = [
    {
      title: "Dashboard",
      href: "/team",
      icon: BarChart3,
    },
    {
      title: "Projetos",
      href: "/team/projects",
      icon: FolderOpen,
    },
    {
      title: "Perfil",
      href: "/team/profile",
      icon: User,
    },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return adminMenuItems;
      case "client":
        return clientMenuItems;
      case "team":
        return teamMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = async () => {
    try {
      // Make logout request to clear session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if logout request fails, redirect to login
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:fixed lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center justify-center">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo do Sistema"
                  className="max-h-12 max-w-full object-contain"
                  onError={(e) => {
                    // Fallback to default icon if logo fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback icon - only shown if logo fails to load or doesn't exist */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: systemColor,
                  display: logo ? 'none' : 'flex' 
                }}
              >
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <div>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal",
                          "hover:bg-gray-50"
                        )}
                        onClick={() => toggleMenu(item.title)}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </div>
                        {isMenuExpanded(item.title) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      {isMenuExpanded(item.title) && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link key={subItem.href} href={subItem.href}>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start text-left font-normal text-sm",
                                  location === subItem.href
                                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                )}
                                style={location === subItem.href ? {
                                  backgroundColor: `${systemColor}15`,
                                  color: systemColor
                                } : {}}
                                onClick={onClose}
                              >
                                {subItem.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href!}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          location === item.href
                            ? "text-gray-700 hover:bg-gray-50"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        style={location === item.href ? {
                          backgroundColor: `${systemColor}15`,
                          color: systemColor
                        } : {}}
                        onClick={onClose}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-left font-normal text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
