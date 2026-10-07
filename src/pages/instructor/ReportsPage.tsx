import React from 'react';
import { FileText, Download, Printer, FileSpreadsheet, Users, Activity, BarChart2, AlertTriangle, FileCheck } from 'lucide-react';

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

const ReportsPage: React.FC = () => {
  const reports = [
    {
      title: 'รายงานนักศึกษาทั้งหมด',
      description: 'รายชื่อนักศึกษาและข้อมูลพื้นฐานในความดูแลของคุณ',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'รายงานความก้าวหน้า (Weekly)',
      description: 'สรุปคะแนนความก้าวหน้ารายสัปดาห์ของทุกโครงงาน',
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: 'รายงาน Presentation',
      description: 'ผลคะแนนการนำเสนอแต่ละรอบพร้อมข้อเสนอแนะ',
      icon: <BarChart2 className="w-6 h-6" />
    },
    {
      title: 'รายงาน Risk Score',
      description: 'สรุปคะแนนความเสี่ยงและการประเมินสถานะของทุกกลุ่ม',
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      title: 'รายงานกลุ่มเสี่ยง',
      description: 'เฉพาะกลุ่มที่มีความเสี่ยงปานกลางถึงสูง เพื่อการติดตามพิเศษ',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />
    },
    {
      title: 'รายงานการส่งเอกสาร',
      description: 'สถานะการส่งเอกสารต่างๆ ของแต่ละกลุ่ม',
      icon: <FileCheck className="w-6 h-6" />
    },
    {
      title: 'รายงานผลการดำเนินโครงงาน',
      description: 'สรุปภาพรวมความคืบหน้าปลายเทอมของทุกโครงงาน',
      icon: <FileText className="w-6 h-6" />
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">รายงานและสถิติ (สำหรับอาจารย์)</h1>
        <p className="page-hero-sub">ส่งออกข้อมูลรายงานในรูปแบบต่างๆ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard key={index} title={report.title} description={report.description} icon={report.icon} />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
