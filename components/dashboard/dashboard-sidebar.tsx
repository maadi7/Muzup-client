"use client";

import React, { useState, useEffect } from "react";
import { Home, Grid3X3, User, LogOut, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// Types for better TypeScript support
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface SidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "categories", label: "Categories", icon: Grid3X3, href: "/categories" },
    { id: "artists", label: "Artists", icon: User, href: "/artists" },
  ];

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavigationClick = (item: NavigationItem) => {
    router.push(item.href);
  };

  const handleLogoutClick = () => {
    console.log('Logging out...');
    // Add your logout logic here
    // router.push('/login');
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-muzupColor"
                    : "text-subTextColor hover:text-textColor"
                }`}
              >
                <IconComponent 
                  size={24} 
                  className={`transition-colors ${
                    isActive ? "text-muzupColor" : "text-current"
                  }`} 
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Logout button for mobile */}
          <button
            onClick={handleLogoutClick}
            className="flex flex-col items-center justify-center p-2 rounded-lg text-subTextColor hover:text-textColor transition-all duration-200"
          >
            <LogOut size={24} />
            <span className="text-xs mt-1 font-medium">Logout</span>
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
        className={`fixed lg:sticky top-0 left-0 bg-secondaryBg flex flex-col rounded-lg transition-all duration-300 z-40  ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-18'
        } ${className} h-[calc(100vh-18px)]`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muzupColor rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">🎵</span>
              </div>
              {isOpen && (
                <h1 className="text-textColor font-bold text-xl transition-opacity duration-200">
                  Muzzup
                </h1>
              )}
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
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group relative ${
                    isActive
                      ? "bg-muzupColor/10 text-muzupColor border border-muzupColor/20"
                      : "text-subTextColor hover:text-textColor hover:bg-accent/50"
                  } ${!isOpen ? 'justify-center' : ''}`}
                  aria-current={isActive ? "page" : undefined}
                  title={!isOpen ? item.label : undefined}
                >
                  <IconComponent 
                    size={20} 
                    className={`transition-colors flex-shrink-0 ${
                      isActive ? "text-muzupColor" : "text-current"
                    }`} 
                  />
                  {isOpen && (
                    <span className="font-medium transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-background text-textColor text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4">
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-subTextColor hover:text-textColor hover:bg-accent/50 transition-all duration-200 group relative ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && (
              <span className="font-medium transition-opacity duration-200">
                Logout
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-background text-textColor text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;