import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, CheckCircle, XCircle } from 'lucide-react';

// Mock documents data since it wasn't explicitly imported
const documents = [
  { id: '1', name: 'Proposal_Group1.pdf', type: 'Proposal', student: 'นายสมชาย ใจดี', date: '2023-10-15', size: '2.4 MB', status: 'approved', version: 'v1.0' },
  { id: '2', name: 'Progress_Report_1_G2.pdf', type: 'Progress', student: 'นางสาวเรียนดี ขยัน', date: '2023-10-18', size: '1.1 MB', status: 'pending', version: 'v1.0' },
  { id: '3', name: 'Chapter_1_3_Draft.docx', type: 'Chapter 1-3', student: 'นายตั้งใจ ศึกษา', date: '2023-10-20', size: '5.6 MB', status: 'rejected', version: 'v1.2' },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'approved': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> อนุมัติ</span>;
    case 'pending': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center w-fit">รอตรวจ</span>;
    case 'rejected': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center w-fit"><XCircle className="w-3 h-3 mr-1" /> แก้ไข</span>;
    default: return null;
  }
};

const DocumentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">จัดการเอกสาร</h1>
        <p className="page-hero-sub">ตรวจสอบและจัดการเอกสารของนักศึกษา</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อไฟล์, ชื่อนักศึกษา..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">ทุกประเภท</option>
              <option value="Proposal">Proposal</option>
              <option value="Progress">Progress Report</option>
              <option value="Chapter 1-3">Chapter 1-3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium">ชื่อไฟล์</th>
                <th className="p-4 font-medium">ประเภท</th>
                <th className="p-4 font-medium">นักศึกษา (ผู้ส่ง)</th>
                <th className="p-4 font-medium">วันที่ส่ง</th>
                <th className="p-4 font-medium text-center">ขนาด</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium text-center">เวอร์ชัน</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center text-gray-900 font-medium">
                      <FileText className="w-4 h-4 mr-2 text-brand-500" />
                      {doc.name}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{doc.type}</td>
                  <td className="p-4 text-gray-600">{doc.student}</td>
                  <td className="p-4 text-gray-600">{doc.date}</td>
                  <td className="p-4 text-center text-gray-500">{doc.size}</td>
                  <td className="p-4"><StatusBadge status={doc.status} /></td>
                  <td className="p-4 text-center text-gray-500">{doc.version}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="ดูไฟล์">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="ดาวน์โหลด">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
