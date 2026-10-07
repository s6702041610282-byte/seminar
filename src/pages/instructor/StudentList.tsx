import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { students, projects, getStudentRiskScore } from '../../data/mockData';
import { getScoreLevel, analyzeTrend } from '../../utils/calculations';

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  switch(level) {
    case 'Low': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">เสี่ยงต่ำ</span>;
    case 'Medium': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">เสี่ยงปานกลาง</span>;
    case 'High': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">เสี่ยงสูง</span>;
    default: return null;
  }
};

const TrendBadge: React.FC<{ trend: 'improving' | 'declining' | 'stable' }> = ({ trend }) => {
  switch(trend) {
    case 'declining': return <span className="text-red-500 font-bold" title="ความเสี่ยงเพิ่มขึ้น">↓</span>;
    case 'improving': return <span className="text-green-500 font-bold" title="ความเสี่ยงลดลง">↑</span>;
    case 'stable': return <span className="text-gray-400 font-bold" title="คงที่">-</span>;
  }
};

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data mapping
  const studentData = students.map(student => {
    const project = projects.find(p => p.id === student.projectId);
    const riskData = getStudentRiskScore(student.id);
    return {
      ...student,
      projectTitle: project?.title || 'ไม่ระบุ',
      avgScore: 85, // Mock value
      riskLevel: riskData?.finalLevel || 'low',
      riskTrend: riskData?.trend || 'stable'
    };
  });

  const filteredStudents = studentData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">นักศึกษาที่ดูแลทั้งหมด</h1>
        <p className="page-hero-sub">รายชื่อนักศึกษาและกลุ่มที่อยู่ในการดูแลของคุณ</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ-สกุล..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
              <option value="all">ทุกระดับความเสี่ยง</option>
              <option value="high">เสี่ยงสูง</option>
              <option value="medium">เสี่ยงปานกลาง</option>
              <option value="low">เสี่ยงต่ำ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium text-center w-16">ลำดับ</th>
                <th className="p-4 font-medium">รหัส</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium">กลุ่ม</th>
                <th className="p-4 font-medium min-w-[200px]">โครงงาน</th>
                <th className="p-4 font-medium text-center">Risk Level</th>
                <th className="p-4 font-medium text-center">Trend</th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStudents.map((student, index) => {
                const rawRiskData = getStudentRiskScore(student.id);
                const riskData = rawRiskData || { finalLevel: 'low' };
                return (
                  <tr 
                    key={student.id} 
                    className="border-b border-gray-50 hover:bg-brand-50/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/instructor/students/${student.id}`)}
                  >
                    <td className="p-4 text-center text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{student.studentId}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{student.group}</span></td>
                    <td className="p-4 text-gray-600 line-clamp-1">{student.projectTitle}</td>
                    <td className="p-4 text-center"><RiskBadge level={student.riskLevel} /></td>
                    <td className="p-4 text-center text-lg"><TrendBadge trend={student.riskTrend} /></td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button className="p-1.5 text-brand-600 hover:bg-brand-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>แสดง {filteredStudents.length} รายการ</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-brand-50/50 disabled:opacity-50">ก่อนหน้า</button>
            <button className="px-3 py-1 bg-brand-700 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-brand-50/50 disabled:opacity-50">ถัดไป</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
