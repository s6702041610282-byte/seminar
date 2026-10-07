import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return <div className="flex h-screen items-center justify-center">กำลังโหลด...</div>;

  return (
    <div data-role={user.role} className="app-bg flex h-screen overflow-hidden font-sans text-slate-700">
      <Sidebar 
        role={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          userName={user.name}
          role={user.role}
          onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          notificationCount={3}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-300">
          <div key={location.pathname} className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
