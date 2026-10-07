import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  userName: string;
  role: string;
  onToggleSidebar: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  userName,
  role,
  onToggleSidebar,
  notificationCount = 0
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-3.5 flex items-center justify-between font-sans z-10">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="mr-4 p-2 rounded-lg hover:bg-brand-50 lg:hidden text-slate-600 hover:text-brand-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div>
          {title && <h1 className="text-xl font-bold text-slate-800">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหา..." 
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 hover:border-brand-200 focus:outline-none focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 w-72 bg-slate-50 transition-all"
          />
        </div>
        
        <button className="relative p-2.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors focus:outline-none">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold ring-2 ring-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{userName}</p>
            <p className="mt-0.5 inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 capitalize">{role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold overflow-hidden">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
