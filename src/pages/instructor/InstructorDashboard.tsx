import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, FileText, Activity, Send, CheckCircle, Edit, AlertTriangle, Eye, Search, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  students, projects, allRiskScores, 
  getProjectStatusDistribution, getWeeklyAverageByWeek, getRiskDistribution,
  getDashboardSummary
} from '../../data/mockData';
import { analyzeTrend, RISK_LEVEL_INFO } from '../../utils/calculations';
import { RISK_FACTORS, LEVEL_TEXT } from '../../utils/riskExplain';
import DonutChart from '../../components/charts/DonutChart';
import LineChartComponent from '../../components/charts/LineChart';
import BarChartComponent from '../../components/charts/BarChart';

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
  const colors = { low: 'bg-green-100 text-green-700', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700' };
  const labels = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}>{labels[level as keyof typeof labels] || level}</span>;
};

const TrendBadge = ({ trend }: { trend: string }) => {
  const config = { improving: { label: 'Improving ↑', color: 'text-green-600 bg-green-50' }, stable: { label: 'Stable →', color: 'text-yellow-600 bg-yellow-50' }, declining: { label: 'Declining ↓', color: 'text-red-600 bg-red-50' } };
  const c = config[trend as keyof typeof config] || config.stable;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
};

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const summary = getDashboardSummary();
  const projectStatusData = getProjectStatusDistribution();
  const weeklyAverageData = getWeeklyAverageByWeek();
  const riskDistributionData = getRiskDistribution();
  
  const projectProgressData = [
    { name: 'ความก้าวหน้าโครงการ', '0-25%': 5, '26-50%': 10, '51-75%': 12, '76-100%': 5 }
  ];

  const tableData = useMemo(() => {
    let data = projects.map(project => {
      const student = students.find(s => s.id === project.studentId) || students[0];
      const riskScore = allRiskScores.find(r => r.studentId === student.id);
      
      return {
        id: project.id,
        studentId: student.id,
        studentName: student.name,
        projectName: project.title,
        advisor: project.advisorId,
        progress: project.progress,
        averageScore: 82.5, // Mock calculated average
        riskScore: riskScore?.totalScore || 0,
        riskLevel: riskScore?.finalLevel || 'low',
        trend: 'stable', // Mock trend
        status: project.status
      };
    });

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.studentId.toLowerCase().includes(lowerSearch) || 
        item.studentName.toLowerCase().includes(lowerSearch) ||
        item.projectName.toLowerCase().includes(lowerSearch)
      );
    }
    
    return data;
  }, [searchTerm]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">ภาพรวม Dashboard</h1>
        <p className="page-hero-sub">Project Management Dashboard</p>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow-card border border-slate-200/70">
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
          <option>ภาคการศึกษา (1/2567)</option>
        </select>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
          <option>ทุกกลุ่ม</option>
          <option>CED</option>
          <option>TCT</option>
        </select>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
          <option>อาจารย์ที่ปรึกษาทุกคน</option>
        </select>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
          <option>สถานะโครงงานทั้งหมด</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard icon={Users} title="นักศึกษาทั้งหมด" value={summary.totalStudents} color="bg-brand-600" />
        <SummaryCard icon={BookOpen} title="โครงงานทั้งหมด" value={summary.totalProjects} color="bg-brand-600" />
        <SummaryCard icon={FileText} title="เสนอหัวข้อแล้ว" value={summary.proposedTopics} color="bg-green-600" />
        <SummaryCard icon={Activity} title="กำลังดำเนินการ" value={summary.inProgress} color="bg-yellow-500" />
        <SummaryCard icon={Send} title="ส่งเล่มแล้ว" value={summary.submitted} color="bg-brand-500" />
        <SummaryCard icon={CheckCircle} title="ผ่านการประเมิน" value={summary.passed} color="bg-green-500" />
        <SummaryCard icon={Edit} title="อยู่ระหว่างแก้ไข" value={summary.underRevision} color="bg-orange-500" />
        <SummaryCard icon={AlertTriangle} title="มีความเสี่ยงสูง" value={summary.highRisk} color="bg-red-500" />
      </div>

      {/* นักศึกษาที่ต้องติดตาม */}
      {(() => {
        const watch = allRiskScores
          .filter(r => r.finalLevel === 'high')
          .sort((a, b) => a.totalScore - b.totalScore);
        return (
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">นักศึกษาที่ต้องติดตาม</h2>
                <p className="text-sm text-slate-500">ความเสี่ยงสูง เรียงจากคะแนนต่ำสุด</p>
              </div>
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-700">{watch.length} คน</span>
            </div>
            {watch.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-500">ไม่มีนักศึกษาที่มีความเสี่ยงสูง</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {watch.slice(0, 5).map(r => {
                  const st = students.find(s => s.id === r.studentId);
                  const weakest = RISK_FACTORS
                    .map(f => ({ f, lost: f.weight * 100 - (r.breakdown[f.key] ?? 0) * f.weight }))
                    .sort((a, b) => b.lost - a.lost)[0].f;
                  return (
                    <li key={r.studentId}>
                      <button type="button" onClick={() => navigate(`/instructor/students/${r.studentId}`)}
                        className="w-full flex items-center gap-4 px-6 py-3.5 text-left hover:bg-slate-50">
                        <span className="w-14 shrink-0 text-center">
                          <span className="block text-lg font-bold text-red-600">{r.totalScore.toFixed(0)}</span>
                          <span className="block text-[11px] text-slate-400">/100</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-slate-900 truncate">{st?.name || r.studentId}</span>
                          <span className="block text-sm text-slate-500 truncate">
                            ควรปรับ: {weakest.label}{r.appliedRules.length > 0 ? ` · ${r.appliedRules.join(', ')}` : ''}
                          </span>
                        </span>
                        <span className={`hidden sm:inline-flex shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${LEVEL_TEXT.high.tone.bg} ${LEVEL_TEXT.high.tone.text}`}>{LEVEL_TEXT.high.title}</span>
                        <ChevronRight className="w-4 h-4 shrink-0 text-slate-300" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {watch.length > 5 && (
              <button type="button" onClick={() => navigate('/instructor/analytics')}
                className="w-full border-t border-slate-100 px-6 py-3 text-sm font-medium text-brand-700 hover:bg-slate-50">
                ดูทั้งหมด {watch.length} คนในหน้า Learning Analytics
              </button>
            )}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สถานะโครงงาน</h2>
          <div className="h-64">
            <DonutChart data={projectStatusData.map((d: any) => ({ name: d.status, value: d.count, color: d.color }))} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ความก้าวหน้าโครงงาน</h2>
          <div className="h-64">
            <BarChartComponent 
              data={projectProgressData} 
              xKey="name" 
              bars={[
                { key: '0-25%', name: '0-25%', color: '#ef4444' },
                { key: '26-50%', name: '26-50%', color: '#f97316' },
                { key: '51-75%', name: '51-75%', color: 'var(--brand-500)' },
                { key: '76-100%', name: '76-100%', color: '#22c55e' }
              ]} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">แนวโน้มคะแนนเฉลี่ยรายสัปดาห์</h2>
          <div className="h-64">
            <LineChartComponent data={weeklyAverageData} xKey="week" lines={[{ key: 'average', name: 'คะแนนเฉลี่ย', color: 'var(--brand-500)' }]} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">การกระจายความเสี่ยง</h2>
          <div className="h-64">
            <DonutChart data={riskDistributionData.map((d: any) => ({ name: d.level, value: d.count, color: d.color }))} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">รายการโครงงานนักศึกษา</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ, โครงงาน..." 
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
                <th className="p-4 font-medium">ชื่อโครงงาน</th>
                <th className="p-4 font-medium">Progress</th>
                <th className="p-4 font-medium">คะแนนเฉลี่ย</th>
                <th className="p-4 font-medium">Risk Score</th>
                <th className="p-4 font-medium">Trend</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-4 text-sm font-medium text-gray-800">{item.studentId}</td>
                  <td className="p-4 text-sm text-gray-600">{item.studentName}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={item.projectName}>{item.projectName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.progress >= 80 ? 'bg-green-500' : item.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{item.averageScore}%</td>
                  <td className="p-4">
                    <RiskBadge level={item.riskLevel} />
                  </td>
                  <td className="p-4">
                    <TrendBadge trend={item.trend} />
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => navigate(`/student/${item.studentId}`)}
                      className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
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

export default InstructorDashboard;
