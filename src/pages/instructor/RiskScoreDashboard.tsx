import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, AlertTriangle, ShieldCheck, AlertCircle, Eye, Search, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  students, allRiskScores, 
  getRiskDistribution, getRiskFactorsData, getRiskSummary 
} from '../../data/mockData';
import { RISK_LEVEL_INFO } from '../../utils/calculations';
import DonutChart from '../../components/charts/DonutChart';
import BarChartComponent from '../../components/charts/BarChart';
import RiskExplainer from '../../components/common/RiskExplainer';

// Inline Components
const SummaryCard = ({ icon: Icon, title, value, subtitle, color }: {icon: any, title: string, value: string|number, subtitle?: string, color: string}) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const RiskBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = { 
    low_risk: 'bg-green-100 text-green-700', 
    medium_risk: 'bg-orange-100 text-orange-700', 
    high_risk: 'bg-red-100 text-red-700' 
  };
  const labels: Record<string, string> = { 
    low_risk: 'Low Risk', 
    medium_risk: 'Medium Risk', 
    high_risk: 'High Risk' 
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[level] || 'bg-gray-100 text-gray-700'}`}>{labels[level] || level}</span>;
};

const TrendBadge = ({ trend }: { trend: string }) => {
  const config = { improving: { label: 'Improving ↑', color: 'text-green-600 bg-green-50' }, stable: { label: 'Stable →', color: 'text-yellow-600 bg-yellow-50' }, declining: { label: 'Declining ↓', color: 'text-red-600 bg-red-50' } };
  const c = config[trend as keyof typeof config] || config.stable;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
};

const RiskScoreDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const summary = getRiskSummary();
  const riskDistributionData = getRiskDistribution().map(d => ({ name: d.level, value: d.count, color: d.color }));
  const riskFactorsData = getRiskFactorsData();
  
  const tableData = useMemo(() => {
    let data = allRiskScores.map(risk => {
      const student = students.find(s => s.id === risk.studentId);
      return {
        id: risk.studentId,
        studentName: student ? `${student.name}` : 'Unknown',
        totalScore: risk.totalScore,
        finalLevel: risk.finalLevel,
        trend: risk.trend,
        factors: risk.appliedRules,
        weeklyScore: 80, // Mock
        presentationScore: 85, // Mock
        submissionStatus: 'Good' // Mock
      };
    });

    // Sort by highest risk score first
    data.sort((a, b) => b.totalScore - a.totalScore);

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.id.toLowerCase().includes(lowerSearch) || 
        item.studentName.toLowerCase().includes(lowerSearch)
      );
    }
    
    return data;
  }, [searchTerm]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">Learning Analytics Risk Score Dashboard</h1>
        <p className="page-hero-sub">การวิเคราะห์ความเสี่ยงนักศึกษา</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <SummaryCard icon={Users} title="นักศึกษาทั้งหมด" value={summary.totalStudents} color="bg-brand-600" />
        <SummaryCard icon={ShieldCheck} title="Low Risk" value={summary.lowRisk} subtitle={`${summary.totalStudents ? Math.round((summary.lowRisk/summary.totalStudents)*100) : 0}%`} color="bg-green-600" />
        <SummaryCard icon={AlertTriangle} title="Medium Risk" value={summary.mediumRisk} subtitle={`${summary.totalStudents ? Math.round((summary.mediumRisk/summary.totalStudents)*100) : 0}%`} color="bg-orange-500" />
        <SummaryCard icon={AlertCircle} title="High Risk" value={summary.highRisk} subtitle={`${summary.totalStudents ? Math.round((summary.highRisk/summary.totalStudents)*100) : 0}%`} color="bg-red-500" />
        <SummaryCard icon={Users} title="คะแนนเฉลี่ย" value={`${summary.averageRiskScore}/100`} subtitle="ยิ่งสูงยิ่งดี" color="bg-gray-600" />
      </div>

      <RiskExplainer />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนระดับความเสี่ยง</h2>
          <div className="h-64">
            <DonutChart data={riskDistributionData} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ปัจจัยที่ส่งผลต่อความเสี่ยง</h2>
          <div className="h-64">
            <BarChartComponent data={riskFactorsData} xKey="factor" bars={[{key: "count", name: "จำนวนนักศึกษา", color: "#ef4444"}]} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">รายชื่อนักศึกษาตามระดับความเสี่ยง</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-brand-500 w-full sm:w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium">ลำดับ</th>
                <th className="p-4 font-medium">รหัสนักศึกษา</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium whitespace-nowrap">คะแนน /100</th>
                <th className="p-4 font-medium">ระดับความเสี่ยง</th>
                <th className="p-4 font-medium">Trend</th>
                <th className="p-4 font-medium w-1/4">ปัจจัยเสี่ยง</th>
                <th className="p-4 font-medium">Weekly</th>
                <th className="p-4 font-medium">Presentation</th>
                <th className="p-4 font-medium">Submission</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors group" title="คลิกปุ่มดำเนินการเพื่อดูคำแนะนำ">
                  <td className="p-4 text-sm text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-4 text-sm font-medium text-gray-800">{item.id}</td>
                  <td className="p-4 text-sm text-gray-600">{item.studentName}</td>
                  <td className="p-4 text-sm font-bold text-gray-800">{item.totalScore}</td>
                  <td className="p-4">
                    <RiskBadge level={item.finalLevel} />
                  </td>
                  <td className="p-4">
                    <TrendBadge trend={item.trend} />
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    <ul className="list-disc pl-4">
                      {item.factors.slice(0, 2).map((factor: any, i: number) => (
                        <li key={i} className="truncate">{factor.ruleName}</li>
                      ))}
                      {item.factors.length > 2 && <li>และอื่นๆ...</li>}
                    </ul>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{item.weeklyScore}</td>
                  <td className="p-4 text-sm text-gray-600">{item.presentationScore}</td>
                  <td className="p-4 text-sm text-gray-600">{item.submissionStatus}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => navigate(`/instructor/students/${item.id}`)}
                      className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, tableData.length)} จาก {tableData.length} รายการ
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-50/50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 font-medium px-2">
                หน้า {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-50/50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskScoreDashboard;
