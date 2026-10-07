import React from 'react';
import { FileText, Download, Printer, FileSpreadsheet, PieChart, Users, TrendingDown } from 'lucide-react';

const ReportCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 flex flex-col h-full">
    <div className="flex items-start mb-4 gap-4">
      <div className="p-3 rounded-lg bg-brand-50 text-brand-700">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="mt-auto pt-4 flex gap-2 border-t border-gray-100">
      <button className="flex-1 flex justify-center items-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
        <Download className="w-4 h-4 mr-1.5" /> PDF
      </button>
      <button className="flex-1 flex justify-center items-center px-3 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
        <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Excel
      </button>
      <button className="flex items-center justify-center px-3 py-2 text-gray-600 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors">
        <Printer className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const AdminReports: React.FC = () => {
  const reports = [
    {
      title: 'รายงานสรุปภาพรวมโครงงาน',
      description: 'สรุปสถานะ ความคืบหน้า และสถิติของโครงงานทั้งหมดในระบบ',
      icon: <PieChart className="w-6 h-6" />
    },
    {
      title: 'รายงานรายชื่อนักศึกษาและกลุ่ม',
      description: 'ข้อมูลรายชื่อนักศึกษา กลุ่มโครงงาน และอาจารย์ที่ปรึกษา',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'รายงานโครงงานที่มีความเสี่ยงสูง',
      description: 'สรุปรายชื่อโครงงานที่อยู่ในกลุ่มเสี่ยง พร้อมรายละเอียดคะแนนและปัญหา',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      title: 'รายงานคะแนนการนำเสนอ (รวม)',
      description: 'คะแนนการนำเสนอของทุกกลุ่มในแต่ละรอบการประเมิน',
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: 'รายงานการส่งเอกสาร',
      description: 'สถิติการส่งเอกสาร ความครบถ้วน และความตรงต่อเวลา',
      icon: <FileText className="w-6 h-6" />
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero flex justify-between items-end">
        <div>
          <h1 className="page-hero-title">รายงานและสถิติ (สำหรับผู้ดูแลระบบ)</h1>
          <p className="page-hero-sub">ออกรายงานภาพรวมทั้งหมดเพื่อการบริหารจัดการ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard key={index} title={report.title} description={report.description} icon={report.icon} />
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
