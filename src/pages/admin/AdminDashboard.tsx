import React from 'react';
import { 
  Users, User, UserCheck, BookOpen, AlertTriangle, CheckCircle, Activity, 
  TrendingUp, Calendar
} from 'lucide-react';
import { students, instructors, projects } from '../../data/mockData';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend, color = "text-brand-600" }) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend.startsWith('+') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const totalUsers = 3 + instructors.length + students.length;
  
  // Calculate mock stats
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const highRiskCount = 2; // Mock value
  
  const statusData = [
    { name: 'กำลังดำเนินการ', value: activeProjects, color: 'var(--brand-500)' },
    { name: 'เสร็จสิ้น', value: completedProjects, color: '#10b981' },
    { name: 'ล่าช้า', value: 2, color: '#f59e0b' },
    { name: 'พักโครงการ', value: 1, color: '#ef4444' }
  ];
  
  const riskData = [
    { name: 'เสี่ยงต่ำ', count: projects.length - 4 },
    { name: 'เสี่ยงปานกลาง', count: 2 },
    { name: 'เสี่ยงสูง', count: 2 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="page-hero flex justify-between items-end">
        <div>
          <h1 className="page-hero-title">Dashboard ผู้ดูแลระบบ</h1>
          <p className="page-hero-sub">ภาพรวมระบบและสถิติทั้งหมด</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 mr-2" />
          อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <SummaryCard title="ผู้ใช้งานทั้งหมด" value={totalUsers} icon={<Users className="w-6 h-6" />} trend="+12" />
        <SummaryCard title="นักศึกษา" value={students.length} icon={<User className="w-6 h-6" />} color="text-green-600" />
        <SummaryCard title="อาจารย์" value={instructors.length} icon={<UserCheck className="w-6 h-6" />} color="text-purple-600" />
        <SummaryCard title="โครงงาน" value={projects.length} icon={<BookOpen className="w-6 h-6" />} color="text-brand-600" />
        <SummaryCard title="ความเสี่ยงสูง" value={highRiskCount} icon={<AlertTriangle className="w-6 h-6" />} color="text-red-600" trend="-2" />
        <SummaryCard title="สำเร็จแล้ว" value={completedProjects} icon={<CheckCircle className="w-6 h-6" />} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200/70">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-brand-700" />
            สถานะโครงงาน
          </h2>
          <div className="h-64">
            <DonutChart data={statusData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200/70">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-brand-700" />
            ระดับความเสี่ยงของโครงงาน
          </h2>
          <div className="h-64">
            <BarChart data={riskData} xKey="name" bars={[{key: 'count', name: 'จำนวนโครงงาน', color: 'var(--brand-700)'}]} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">กิจกรรมล่าสุดในระบบ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium">เวลา</th>
                <th className="p-4 font-medium">ผู้ใช้</th>
                <th className="p-4 font-medium">กิจกรรม</th>
                <th className="p-4 font-medium">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                <td className="p-4 text-gray-500">10:45 น.</td>
                <td className="p-4 font-medium text-gray-900">อ.สมชาย ใจดี</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                    เข้าสู่ระบบ
                  </span>
                </td>
                <td className="p-4 text-gray-600">เข้าสู่ระบบจาก IP 192.168.1.5</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                <td className="p-4 text-gray-500">09:30 น.</td>
                <td className="p-4 font-medium text-gray-900">นายเรียนดี ขยันยิ่ง</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ส่งงาน
                  </span>
                </td>
                <td className="p-4 text-gray-600">ส่งรายงานความก้าวหน้าครั้งที่ 4</td>
              </tr>
              <tr className="hover:bg-brand-50/50 transition-colors">
                <td className="p-4 text-gray-500">08:15 น.</td>
                <td className="p-4 font-medium text-gray-900">System</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    ประมวลผล
                  </span>
                </td>
                <td className="p-4 text-gray-600">คำนวณ Risk Score ประจำสัปดาห์สำเร็จ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
