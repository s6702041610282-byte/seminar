import { RiskSummaryCard } from '../../components/common/RiskPanel';
import React, { useMemo } from 'react';
import { Activity, TrendingUp, ArrowUpRight, ArrowRight, ArrowDownRight, CheckCircle, Award, Calendar, Bell, Clock } from 'lucide-react';
import { students, getStudentWeeklyScores, getStudentProject, calendarEvents, notifications } from '../../data/mockData';
import { calculateWeeklyAverage, analyzeTrend } from '../../utils/calculations';
import LineChartComponent from '../../components/charts/LineChart';
import { PROJECT_STEPS } from '../../types';

const SummaryCard = ({ title, value, subtitle, icon: Icon, colorClass }: any) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 flex flex-col items-start gap-3">
    <div className={`p-3 rounded-xl ${colorClass} text-white flex-shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const StudentDashboard = () => {
  const studentId = 's6501001';
  const student = students.find(s => s.id === studentId);
  const weeklyScores = getStudentWeeklyScores(studentId);
  const project = getStudentProject(studentId);
  
  const weeklyAvg = useMemo(() => calculateWeeklyAverage(weeklyScores), [weeklyScores]);
  const trend = useMemo(() => analyzeTrend(weeklyScores.map(w => w.percentage)), [weeklyScores]);
  
  const chartData = useMemo(() => {
    return weeklyScores.map(w => ({
      week: `W${w.week}`,
      score: w.percentage
    }));
  }, [weeklyScores]);

  const recentNotifications = notifications
    .filter(n => n.targetRole === 'student')
    .slice(0, 3);
    
  const upcomingEvents = calendarEvents.slice(0, 3);

  const TrendIcon = trend === 'improving' ? ArrowUpRight : trend === 'declining' ? ArrowDownRight : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">ภาพรวมของฉัน</h1>
        <p className="page-hero-sub">Student Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard 
          title="ความก้าวหน้ารวม" 
          value={`${project?.progress || 0}%`} 
          icon={Activity} 
          colorClass="bg-brand-600" 
        />
        <SummaryCard 
          title="คะแนนเฉลี่ย 14 สัปดาห์" 
          value={`${weeklyAvg.toFixed(1)}%`} 
          icon={TrendingUp} 
          colorClass="bg-brand-600" 
        />
        <SummaryCard 
          title="แนวโน้ม" 
          value={trend === 'improving' ? 'ดีขึ้น' : trend === 'declining' ? 'ลดลง' : 'คงที่'} 
          icon={TrendIcon} 
          colorClass={trend === 'improving' ? 'bg-green-600' : trend === 'declining' ? 'bg-red-600' : 'bg-slate-500'} 
        />
        <SummaryCard 
          title="สถานะการส่งงาน" 
          value="ส่งตรงเวลา" 
          icon={CheckCircle} 
          colorClass="bg-green-600" 
        />
        <SummaryCard 
          title="อันดับในกลุ่ม" 
          value="1/32" 
          icon={Award} 
          colorClass="bg-yellow-500" 
        />
      </div>

      <RiskSummaryCard studentId={studentId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">คะแนนรายสัปดาห์</h3>
          <div className="h-80">
            <LineChartComponent data={chartData} xKey="week" lines={[{ key: 'score', name: 'คะแนน', color: 'var(--brand-500)' }]} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              กำหนดการเร็วๆ นี้
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="bg-brand-50 text-brand-700 p-2 rounded-lg text-center min-w-[60px]">
                    <div className="text-xs font-medium">{new Date(event.date).toLocaleDateString('th-TH', { month: 'short' })}</div>
                    <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-400" />
              การแจ้งเตือนล่าสุด
            </h3>
            <div className="space-y-4">
              {recentNotifications.map(notif => (
                <div key={notif.id} className="flex gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-gray-300' : 'bg-brand-500'}`} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
