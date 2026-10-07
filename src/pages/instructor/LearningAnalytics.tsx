import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart3, Clock, Award, Star,
  Search, ChevronLeft, ChevronRight, Eye, AlertTriangle, X
} from 'lucide-react';
import {
  students, allWeeklyScores, allPresentationAssessments,
  getWeeklyAverageByWeek, getSubmissionStatusByWeek,
  getPresentationAverageByRound, getScoreLevelDistribution,
  getStudentWeeklyScores, getStudentPresentations,
  getRiskDistribution, getRiskFactorsData
} from '../../data/mockData';
import {
  calculateWeeklyAverage, calculatePresentationAverage,
  getScoreLevel, analyzeTrend, SCORE_LEVELS
} from '../../utils/calculations';
import LineChart from '../../components/charts/LineChart';
import BarChartComponent from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import RiskExplainer from '../../components/common/RiskExplainer';

const LearningAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const itemsPerPage = 10;

  // Summary KPIs
  const kpis = useMemo(() => {
    const submittedScores = allWeeklyScores.filter(w => w.submissionStatus !== 'not_submitted');
    const weeklyAvg = submittedScores.length > 0
      ? Math.round(submittedScores.reduce((s, w) => s + w.percentage, 0) / submittedScores.length * 100) / 100
      : 0;

    const assessedPres = allPresentationAssessments.filter(p => p.status !== 'not_assessed');
    const presAvg = assessedPres.length > 0
      ? Math.round(assessedPres.reduce((s, p) => s + p.percentage, 0) / assessedPres.length * 100) / 100
      : 0;

    const onTimeCount = allWeeklyScores.filter(w => w.submissionStatus === 'on_time').length;
    const onTimeRate = Math.round((onTimeCount / allWeeklyScores.length) * 100);

    const passedPres = allPresentationAssessments.filter(p =>
      p.status === 'passed_excellent' || p.status === 'passed' || p.status === 'passed_conditional'
    ).length;

    const overallLearning = Math.round((weeklyAvg * 0.5 + presAvg * 0.3 + onTimeRate * 0.2) * 100) / 100;

    return { weeklyAvg, presAvg, onTimeRate, passedPres, totalPres: allPresentationAssessments.length, overallLearning };
  }, []);

  // Chart data
  const weeklyAvgData = useMemo(() => getWeeklyAverageByWeek(), []);
  const submissionData = useMemo(() => getSubmissionStatusByWeek(), []);
  const presRoundData = useMemo(() => getPresentationAverageByRound(), []);
  const scoreLevelData = useMemo(() =>
    getScoreLevelDistribution().map(d => ({ name: d.level, value: d.count, color: d.color })),
    []
  );

  // Student table data
  const tableData = useMemo(() => {
    return students.map(student => {
      const weeklyScores = getStudentWeeklyScores(student.id);
      const presentations = getStudentPresentations(student.id);
      const weeklyAvg = calculateWeeklyAverage(weeklyScores);
      const presAvg = calculatePresentationAverage(presentations);
      const onTime = weeklyScores.filter(w => w.submissionStatus === 'on_time').length;
      const submitted = weeklyScores.filter(w => w.submissionStatus !== 'not_submitted').length;
      const submissionRate = Math.round((onTime / 14) * 100);
      const overall = Math.round((weeklyAvg * 0.5 + presAvg * 0.3 + submissionRate * 0.2) * 100) / 100;
      const level = getScoreLevel(overall);
      const percentages = weeklyScores.map(w => w.percentage).filter(p => p > 0);
      const trend = analyzeTrend(percentages);

      return {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        weeklyAvg,
        presAvg,
        submissionRate,
        overall,
        level,
        trend,
      };
    });
  }, []);

  const filteredTable = useMemo(() => {
    if (!searchTerm) return tableData;
    const lower = searchTerm.toLowerCase();
    return tableData.filter(s =>
      s.studentId.includes(lower) || s.name.toLowerCase().includes(lower)
    );
  }, [searchTerm, tableData]);

  const sortedTable = useMemo(() =>
    [...filteredTable].sort((a, b) => b.overall - a.overall),
    [filteredTable]
  );

  const totalPages = Math.ceil(sortedTable.length / itemsPerPage);
  const currentData = sortedTable.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const highRiskStudents = useMemo(() => {
    return tableData.filter(s => s.overall < 50); // or based on your exact criteria
  }, [tableData]);

  const trendConfig: Record<string, { label: string; color: string; bg: string }> = {
    improving: { label: 'ดีขึ้น ↑', color: 'text-green-600', bg: 'bg-green-50' },
    stable: { label: 'คงที่ →', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    declining: { label: 'ลดลง ↓', color: 'text-red-600', bg: 'bg-red-50' },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="page-hero">
        <h1 className="page-hero-title">Learning Analytics</h1>
        <p className="page-hero-sub">สถิติภาพรวมการเรียนรู้และผลการดำเนินโครงงาน</p>
      </div>

      {/* Alert Banner */}
      {highRiskStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-red-800 font-bold">แจ้งเตือน: นักศึกษาที่ควรได้รับการติดตามด่วน</h3>
              <p className="text-sm text-red-600">พบนักศึกษา {highRiskStudents.length} คน ที่มีคะแนนภาพรวมอยู่ในเกณฑ์ "ต้องติดตาม" (ต่ำกว่า 50%)</p>
            </div>
          </div>
          <button 
            onClick={() => setShowRiskModal(true)}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
          >
            ดูรายชื่อ
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: TrendingUp, label: 'คะแนนเฉลี่ย Weekly', value: `${kpis.weeklyAvg}%`, color: 'bg-brand-600' },
          { icon: Award, label: 'คะแนนเฉลี่ย Presentation', value: `${kpis.presAvg}%`, color: 'bg-purple-600' },
          { icon: Clock, label: 'อัตราส่งงานตรงเวลา', value: `${kpis.onTimeRate}%`, color: 'bg-emerald-600' },
          { icon: Star, label: 'ผ่านการนำเสนอ', value: `${kpis.passedPres}/${kpis.totalPres}`, color: 'bg-amber-500' },
          { icon: BarChart3, label: 'Learning Score เฉลี่ย', value: `${kpis.overallLearning}`, color: 'bg-brand-600' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">คะแนนเฉลี่ยรายสัปดาห์</h2>
          <div className="h-64">
            <LineChart
              data={weeklyAvgData}
              xKey="week"
              lines={[{ key: 'average', name: 'คะแนนเฉลี่ย (%)', color: 'var(--brand-500)' }]}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สถานะการส่งงานรายสัปดาห์</h2>
          <div className="h-64">
            <BarChartComponent
              data={submissionData}
              xKey="week"
              bars={[
                { key: 'onTime', name: 'ตรงเวลา', color: '#22C55E' },
                { key: 'late', name: 'ล่าช้า', color: '#F97316' },
                { key: 'notSubmitted', name: 'ไม่ส่ง', color: '#EF4444' },
              ]}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">คะแนนเฉลี่ย Presentation แต่ละรอบ</h2>
          <div className="h-64">
            <BarChartComponent
              data={presRoundData}
              xKey="round"
              bars={[{ key: 'average', name: 'คะแนนเฉลี่ย (%)', color: '#8B5CF6' }]}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">การกระจายระดับคะแนน</h2>
          <div className="h-64">
            <DonutChart data={scoreLevelData} />
          </div>
        </div>
      </div>

      {/* Risk overview */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">ความเสี่ยงของนักศึกษา</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">สัดส่วนระดับความเสี่ยง</h3>
            <div className="h-64">
              <DonutChart data={getRiskDistribution().map(d => ({ name: d.level, value: d.count, color: d.color }))} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">ปัจจัยที่ส่งผลต่อความเสี่ยง (จำนวนนักศึกษา)</h3>
            <div className="h-64">
              <BarChartComponent data={getRiskFactorsData()} xKey="factor" bars={[{ key: 'count', name: 'จำนวนนักศึกษา', color: '#ef4444' }]} />
            </div>
          </div>
        </div>
        <RiskExplainer />
      </section>

      {/* Student Learning Outcomes Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Learning Outcomes รายบุคคล</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหารหัส, ชื่อ..."
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
                <th className="p-4 font-medium">Weekly Avg</th>
                <th className="p-4 font-medium">Pres. Avg</th>
                <th className="p-4 font-medium">Submission</th>
                <th className="p-4 font-medium">Overall</th>
                <th className="p-4 font-medium">ระดับ</th>
                <th className="p-4 font-medium">Trend</th>
                <th className="p-4 font-medium text-center">ดู</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const tc = trendConfig[item.trend] || trendConfig.stable;
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4 text-sm font-medium text-gray-800">{item.studentId}</td>
                    <td className="p-4 text-sm text-gray-700">{item.name}</td>
                    <td className="p-4 text-sm font-medium text-gray-800">{item.weeklyAvg.toFixed(1)}%</td>
                    <td className="p-4 text-sm font-medium text-gray-800">{item.presAvg.toFixed(1)}%</td>
                    <td className="p-4 text-sm text-gray-700">{item.submissionRate}%</td>
                    <td className="p-4 text-sm font-bold text-gray-900">{item.overall}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.level.bgColor} ${item.level.textColor}`}>
                        {item.level.emoji} {item.level.labelTh}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tc.bg} ${tc.color}`}>
                        {tc.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/instructor/students/${item.id}`)}
                        className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, sortedTable.length)} จาก {sortedTable.length} รายการ
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-brand-50/50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-600 px-2">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-brand-50/50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Risk Modal */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">รายชื่อนักศึกษาที่ต้องติดตามด่วน</h2>
              </div>
              <button onClick={() => setShowRiskModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {highRiskStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl">
                    <div>
                      <h3 className="font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.studentId}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-bold text-red-600">ภาพรวม: {student.overall}%</span>
                      <button 
                        onClick={() => navigate(`/instructor/students/${student.id}`)}
                        className="text-brand-600 hover:underline text-sm font-medium"
                      >
                        ดูข้อมูลโดยละเอียด
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
              <button onClick={() => setShowRiskModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningAnalytics;
