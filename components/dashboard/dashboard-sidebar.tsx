"use client";

import React, { useState, useEffect } from "react";
import { Home, Grid3X3, User, LogOut, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import muzupLogo from "/assets/logo1.png";
import useSocket from "@/hooks/socket";
import { useNotificationCount } from "@/store/notification";

// Types for better TypeScript support
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface SidebarProps {
  className?: string;
  unreadCount?: number;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
  className = "",
  unreadCount = 0,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { notificationCount, setNotificationCount } = useNotificationCount();

  useEffect(() => {
    setNotificationCount(unreadCount);
  }, [unreadCount]);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/Muzup/home" },
    { id: "profile", label: "Profile", icon: Grid3X3, href: "/Muzup/profile" },
    { id: "artists", label: "Artists", icon: User, href: "/Muzup/artists" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/Muzup/notification",
    },
  ];

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { on } = useSocket();
  useEffect(() => {
    on("notification", (payload) => {
      console.log("data", payload);
      setNotificationCount(notificationCount + 1);
    });
  }, [on]);

  const handleNavigationClick = (item: NavigationItem) => {
    router.push(item.href);
  };

  const handleLogoutClick = () => {
    console.log("Logging out...");
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  // Helper function to render icon with badge for notifications
  const renderIconWithBadge = (
    IconComponent: React.ComponentType<any>,
    itemId: string,
    isActive: boolean,
    size: number = 20
  ) => {
    const showBadge = itemId === "notifications" && notificationCount > 0;

    return (
      <div className="relative flex-shrink-0">
        <IconComponent
          size={size}
          className={`transition-colors ${
            isActive ? "text-muzupColor" : "text-current"
          }`}
        />
        {showBadge && notificationCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {notificationCount > 99 ? "99+" : notificationCount}
          </div>
        )}
      </div>
    );
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-secondaryBg border-t border-border/20 z-50">
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-muzupColor"
                    : "text-secondary hover:text-textColor"
                }`}
              >
                {renderIconWithBadge(IconComponent, item.id, isActive, 24)}
                <span className="mt-1 text-secondary">{item.label}</span>
              </button>
            );
          })}

          {/* Logout button for mobile */}
          <button
            onClick={handleLogoutClick}
            className="flex flex-col items-center justify-center p-2 rounded-lg text-secondary hover:text-textColor transition-all duration-200 cursor-pointer"
          >
            <LogOut size={24} />
            <span className="mt-1 text-secondary">Logout</span>
          </button>
        </div>
      </nav>
    );
  }

  // Desktop Sidebar
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bg-secondaryBg flex flex-col rounded-lg transition-all duration-300 z-40 w-64 ${className} h-[calc(100vh-18px)]`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border/10">
          <div className="flex items-center justify-center">
            <div className="w-full h-16 px-2">
              <Image
                src={muzupLogo}
                alt="Muzup Logo"
                width={200}
                height={64}
                className="object-cover w-full h-full rounded-sm"
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group relative cursor-pointer ${
                    isActive
                      ? "text-muzupColor border border-muzupColor/20"
                      : "text-secondary hover:text-textColor hover:bg-accent/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {renderIconWithBadge(IconComponent, item.id, isActive)}
                  <span className="transition-opacity duration-200 text-secondary">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-secondary hover:text-textColor hover:bg-accent/50 transition-all duration-200 group relative cursor-pointer"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="transition-opacity duration-200 text-secondary">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
