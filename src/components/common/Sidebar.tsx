import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Users, Activity, Calendar, Presentation, 
  BarChart2, ShieldAlert, Bell, FileText, Settings, LogOut, Menu, X, LayoutDashboard, CheckSquare, Database, GraduationCap, ClipboardCheck
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'instructor' | 'student';
  currentPath?: string;
  onNavigate?: (path: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onLogout?: () => void;
}

const instructorItems = [
  { path: '/instructor', label: 'ภาพรวม Dashboard', icon: Home },
  { path: '/instructor/projects', label: 'โครงงานนักศึกษา', icon: BookOpen },
  { path: '/instructor/approvals', label: 'คำขออนุมัติ', icon: ClipboardCheck },
  { path: '/instructor/students', label: 'นักศึกษาทั้งหมด', icon: Users },
  { path: '/instructor/presentations', label: 'Presentation Assessment', icon: Presentation },
  { path: '/instructor/analytics', label: 'Learning Analytics', icon: BarChart2 },
  { path: '/instructor/notifications', label: 'การแจ้งเตือน', icon: Bell },
  { path: '/instructor/documents', label: 'จัดการเอกสาร', icon: Database },
  { path: '/instructor/settings', label: 'ตั้งค่า', icon: Settings },
];

const studentItems = [
  { path: '/student', label: 'ภาพรวมของฉัน', icon: Home },
  { path: '/student/my-project', label: 'โครงงานของฉัน', icon: BookOpen },
  { path: '/student/weekly-progress', label: 'ความก้าวหน้ารายสัปดาห์', icon: Calendar },
  { path: '/student/presentations', label: 'การนำเสนอ', icon: Presentation },
  { path: '/student/documents', label: 'เอกสาร', icon: FileText },
  { path: '/student/feedback', label: 'Feedback จากอาจารย์', icon: CheckSquare },
  { path: '/student/calendar', label: 'ปฏิทินงาน', icon: Calendar },
  { path: '/student/notifications', label: 'การแจ้งเตือน', icon: Bell },
  { path: '/student/settings', label: 'ตั้งค่า', icon: Settings },
];

const adminItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'จัดการผู้ใช้งาน', icon: Users },
  { path: '/admin/projects', label: 'จัดการโครงงาน', icon: BookOpen },
  { path: '/admin/criteria', label: 'จัดการเกณฑ์ประเมิน', icon: CheckSquare },
  { path: '/admin/reports', label: 'รายงาน', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, isCollapsed = false, onToggle, onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = role === 'instructor' ? instructorItems : role === 'student' ? studentItems : adminItems;
  const bgColor = 'bg-brand-900';
  const hoverBg = 'mr-3 rounded-xl text-white/70 hover:bg-white/[0.08] hover:text-white';
  const activeBg = 'mr-0 rounded-l-xl rounded-r-none bg-[#F4F5F8] text-brand-900 font-semibold';
  const roleLabel = role === 'admin' ? 'ผู้ดูแลระบบ' : role === 'instructor' ? 'อาจารย์' : 'นักศึกษา';

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`relative flex flex-col h-screen ${bgColor} text-white transition-all duration-300 font-sans ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`relative flex items-center gap-3 px-4 py-5 border-b border-white/10 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-900">
              <GraduationCap size={22} />
            </span>
            <div className="min-w-0 leading-tight">
              <span className="block font-bold text-sm leading-snug">ระบบจัดการโครงงาน</span>
              <span className="mt-1 inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/85">{roleLabel}</span>
            </div>
          </div>
        )}
        {onToggle && (
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors focus:outline-none">
            {isCollapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        )}
      </div>

      <div className="relative flex-1 overflow-y-auto py-5 scrollbar-thin scrollbar-thumb-white/20">
        <nav className="space-y-1 pl-3">
          {items.map((item) => {
            const isRoot = item.path === `/${role}`;
            const isActive = location.pathname === item.path || (!isRoot && location.pathname.startsWith(`${item.path}/`));
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center p-3 text-left transition-colors duration-150 ${isCollapsed ? 'justify-center' : ''} ${isActive ? activeBg : hoverBg}`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className="min-w-[20px]" />
                {!isCollapsed && <span className="ml-3 truncate text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className={`w-full flex items-center p-3 rounded-xl text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors focus:outline-none ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "ออกจากระบบ" : undefined}
        >
          <LogOut size={20} className="min-w-[20px]" />
          {!isCollapsed && <span className="ml-3 text-sm">ออกจากระบบ</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
