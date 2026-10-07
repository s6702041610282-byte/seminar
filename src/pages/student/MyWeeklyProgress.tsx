import React, { useMemo } from 'react';
import { students, getStudentWeeklyScores } from '../../data/mockData';
import { calculateWeeklyAverage, analyzeTrend, TREND_INFO } from '../../utils/calculations';
import LineChartComponent from '../../components/charts/LineChart';
import { Activity, TrendingUp, CheckCircle, Award, FileText, Clock, AlertCircle } from 'lucide-react';

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

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'on_time') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> ส่งตรงเวลา</span>;
  }
  if (status === 'late') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> ส่งล่าช้า</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> ไม่ส่ง</span>;
};

const MyWeeklyProgress = () => {
  const studentId = 's6501001';
  const weeklyScores = getStudentWeeklyScores(studentId);
  const weeklyAvg = useMemo(() => calculateWeeklyAverage(weeklyScores), [weeklyScores]);
  const trend = useMemo(() => analyzeTrend(weeklyScores.map(w => w.percentage)), [weeklyScores]);
  const trendInfo = TREND_INFO[trend];
  const TrendIcon = trendInfo.icon;
  
  const chartData = useMemo(() => {
    return weeklyScores.map(w => ({
      week: `W${w.week}`,
      score: w.percentage
    }));
  }, [weeklyScores]);

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">ความก้าวหน้ารายสัปดาห์</h1>
        <p className="page-hero-sub">My Weekly Progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="คะแนนเฉลี่ย" 
          value={`${weeklyAvg.toFixed(1)}%`} 
          icon={TrendingUp} 
          colorClass="bg-brand-600" 
        />
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium mb-2">แนวโน้ม</p>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${trendInfo.color} ${trendInfo.bgColor}`}>
            <span className="text-xl font-bold">{trendInfo.icon}</span>
            <span className="font-semibold">{trendInfo.label}</span>
          </div>
        </div>
        <SummaryCard 
          title="สถานะการส่งงานล่าสุด" 
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

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">กราฟคะแนนรายสัปดาห์</h3>
        <div className="h-80">
          <LineChartComponent data={chartData} xKey="week" lines={[{ key: 'score', name: 'คะแนน', color: 'var(--brand-700)' }]} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ประวัติการส่งความก้าวหน้า</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สัปดาห์ที่</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะการส่ง</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน (%)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ข้อเสนอแนะ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weeklyScores.map((record) => (
                <tr key={record.week}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Week {record.week}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={record.submissionStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {record.percentage}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {record.feedback || '-'}
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

export default MyWeeklyProgress;
