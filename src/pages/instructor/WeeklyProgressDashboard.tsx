import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, Clock, XCircle, TrendingUp, Eye, Search, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  students, allWeeklyScores, getStudentWeeklyScores,
  getWeeklyAverageByWeek, getSubmissionStatusByWeek, getScoreLevelDistribution,
  getWeeklyProgressSummary
} from '../../data/mockData';
import { getScoreLevel, analyzeTrend, calculateWeeklyAverage } from '../../utils/calculations';
import DonutChart from '../../components/charts/DonutChart';
import LineChartComponent from '../../components/charts/LineChart';
import BarChartComponent from '../../components/charts/BarChart';

import { X } from 'lucide-react';

const SummaryCard = ({ icon: Icon, title, value, subtitle, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 ${onClick ? 'cursor-pointer transition-all hover:-translate-y-1' : ''}`}
  >
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

const TrendBadge = ({ trend }: { trend: string }) => {
  const config = { improving: { label: 'Improving ↑', color: 'text-green-600 bg-green-50' }, stable: { label: 'Stable →', color: 'text-yellow-600 bg-yellow-50' }, declining: { label: 'Declining ↓', color: 'text-red-600 bg-red-50' } };
  const c = config[trend as keyof typeof config] || config.stable;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
};

const ScoreLevelBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    'ดีมาก': 'bg-green-100 text-green-700',
    'ดี': 'bg-brand-100 text-brand-700',
    'ควรปรับปรุง': 'bg-orange-100 text-orange-700',
    'ต้องติดตาม': 'bg-red-100 text-red-700'
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[level] || 'bg-gray-100 text-gray-700'}`}>{level}</span>;
};

export default function WeeklyProgressDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showListModal, setShowListModal] = useState<{title: string, data: any[]} | null>(null);
  const itemsPerPage = 10;
  
  const summary = useMemo(() => {
    const data = getWeeklyProgressSummary(14);
    const { totalStudents, onTime, late, notSubmitted, averageScore } = data;
    return {
      totalStudents,
      onTime,
      onTimePercentage: totalStudents ? ((onTime / totalStudents) * 100).toFixed(2) : '0',
      late,
      latePercentage: totalStudents ? ((late / totalStudents) * 100).toFixed(2) : '0',
      notSubmitted,
      missingPercentage: totalStudents ? ((notSubmitted / totalStudents) * 100).toFixed(2) : '0',
      averageScore
    };
  }, []);

  const weeklyAverageData = useMemo(() => getWeeklyAverageByWeek(), []);
  const submissionStatusData = useMemo(() => getSubmissionStatusByWeek(), []);

  const scoreLevelData = useMemo(() => {
    return getScoreLevelDistribution().map(d => ({
      name: d.level,
      value: d.count,
      color: d.color
    }));
  }, []);
  
  const tableData = useMemo(() => {
    let data = students.map(student => {
      const scores = getStudentWeeklyScores(student.id);
      const averageScore = calculateWeeklyAverage(scores);
      const levelInfo = getScoreLevel(averageScore);
      
      const onTime = scores.filter(s => s.submissionStatus === 'on_time').length;
      const late = scores.filter(s => s.submissionStatus === 'late').length;
      const missing = scores.filter(s => s.submissionStatus === 'not_submitted').length;
      
      const latestScore = scores.find(s => s.week === 14)?.percentage || 0;
      const trend = analyzeTrend(scores.filter(s => s.percentage > 0).map(s => s.percentage));

      return {
        id: student.id,
        studentId: student.studentId,
        studentName: student.name,
        averageScore,
        level: levelInfo.labelTh,
        trend,
        onTime,
        late,
        missing,
        latestScore
      };
    });

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.studentId.toLowerCase().includes(lowerSearch) || 
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
        <h1 className="page-hero-title">Weekly Progress Dashboard</h1>
        <p className="page-hero-sub">ติดตามความก้าวหน้ารายสัปดาห์</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <SummaryCard icon={Users} title="นักศึกษาทั้งหมด" value={summary.totalStudents} color="bg-brand-600" />
        <SummaryCard icon={CheckCircle} title="ส่งงานตรงเวลา" value={summary.onTime} subtitle={`${summary.onTimePercentage}%`} color="bg-green-600" />
        <SummaryCard 
          icon={Clock} 
          title="ส่งงานล่าช้า" 
          value={summary.late} 
          subtitle={`${summary.latePercentage}%`} 
          color="bg-yellow-500" 
          onClick={() => setShowListModal({ 
            title: 'รายชื่อนักศึกษาที่ส่งงานล่าช้า (มีประวัติส่งล่าช้า)', 
            data: tableData.filter(d => d.late > 0).sort((a,b) => b.late - a.late) 
          })}
        />
        <SummaryCard 
          icon={XCircle} 
          title="ยังไม่ส่งงาน" 
          value={summary.notSubmitted} 
          subtitle={`${summary.missingPercentage}%`} 
          color="bg-red-500" 
          onClick={() => setShowListModal({ 
            title: 'รายชื่อนักศึกษาที่ยังไม่ส่งงาน', 
            data: tableData.filter(d => d.missing > 0).sort((a,b) => b.missing - a.missing) 
          })}
        />
        <SummaryCard icon={TrendingUp} title="คะแนนเฉลี่ยสัปดาห์ล่าสุด" value={`${summary.averageScore}%`} color="bg-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">แนวโน้มคะแนนเฉลี่ยรายสัปดาห์</h2>
          <div className="h-64">
            <LineChartComponent 
              data={weeklyAverageData} 
              xKey="week"
              lines={[{ key: 'average', name: 'คะแนนเฉลี่ย', color: 'var(--brand-500)' }]} 
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">ความก้าวหน้าการส่งงานรายสัปดาห์</h2>
          <div className="h-64">
            <BarChartComponent 
              data={submissionStatusData}
              xKey="week"
              layout="horizontal"
              bars={[
                { key: 'onTime', name: 'ส่งตรงเวลา', color: '#22C55E', stackId: 'a' },
                { key: 'late', name: 'ส่งล่าช้า', color: '#EAB308', stackId: 'a' },
                { key: 'notSubmitted', name: 'ยังไม่ส่ง', color: '#EF4444', stackId: 'a' }
              ]} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนระดับคะแนนเฉลี่ย</h2>
          <div className="h-64">
            <DonutChart data={scoreLevelData} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">รายการความก้าวหน้านักศึกษา</h2>
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
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium">ลำดับ</th>
                <th className="p-4 font-medium">รหัสนักศึกษา</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium">คะแนนเฉลี่ย</th>
                <th className="p-4 font-medium">ระดับ</th>
                <th className="p-4 font-medium">Trend</th>
                <th className="p-4 font-medium">ส่งตรงเวลา</th>
                <th className="p-4 font-medium">ส่งล่าช้า</th>
                <th className="p-4 font-medium">ยังไม่ส่ง</th>
                <th className="p-4 font-medium">สัปดาห์ล่าสุด</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-4 text-sm font-medium text-gray-800">{item.studentId}</td>
                  <td className="p-4 text-sm text-gray-600">{item.studentName}</td>
                  <td className="p-4 text-sm text-gray-600">{item.averageScore}%</td>
                  <td className="p-4">
                    <ScoreLevelBadge level={item.level} />
                  </td>
                  <td className="p-4">
                    <TrendBadge trend={item.trend} />
                  </td>
                  <td className="p-4 text-sm text-green-600">{item.onTime}</td>
                  <td className="p-4 text-sm text-yellow-600">{item.late}</td>
                  <td className="p-4 text-sm text-red-600">{item.missing}</td>
                  <td className="p-4 text-sm text-gray-600">{item.latestScore}%</td>
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

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">{showListModal.title}</h2>
              <button onClick={() => setShowListModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {showListModal.data.length > 0 ? showListModal.data.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-brand-50/50">
                    <div>
                      <h3 className="font-bold text-gray-900">{student.studentName}</h3>
                      <p className="text-sm text-gray-500">{student.studentId}</p>
                    </div>
                    <div className="flex gap-4">
                      {showListModal.title.includes('ล่าช้า') ? (
                        <span className="text-sm text-yellow-600 font-medium">ส่งล่าช้า {student.late} ครั้ง</span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">ยังไม่ส่ง {student.missing} ครั้ง</span>
                      )}
                      <button 
                        onClick={() => navigate(`/instructor/students/${student.id}`)}
                        className="text-brand-600 hover:underline text-sm font-medium"
                      >
                        ดูข้อมูล
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">ไม่พบรายชื่อในหมวดหมู่นี้</div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
              <button onClick={() => setShowListModal(null)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
