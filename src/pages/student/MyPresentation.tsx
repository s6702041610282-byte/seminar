import React, { useMemo } from 'react';
import { getStudentPresentations } from '../../data/mockData';
import { calculatePresentationAverage, getPresentationLevel } from '../../utils/calculations';
import LineChartComponent from '../../components/charts/LineChart';
import { Mic, Award, Star, BarChart2, Calendar, Clock, Plus, CheckCircle2, XCircle } from 'lucide-react';

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

const MyPresentation = () => {
  const studentId = 's6501001';
  const presentations = getStudentPresentations(studentId);
  const avgScore = useMemo(() => calculatePresentationAverage(presentations), [presentations]);
  const levelInfo = getPresentationLevel(avgScore);

  // Scheduling State
  const [showScheduleForm, setShowScheduleForm] = React.useState(false);
  const [requests, setRequests] = React.useState([
    { id: '1', type: 'Proposal Presentation', date: '2024-10-07', time: '13:00', status: 'pending' }
  ]);
  const [formData, setFormData] = React.useState({ type: 'Progress Presentation', date: '', time: '' });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests([...requests, { id: Date.now().toString(), ...formData, status: 'pending' }]);
    setShowScheduleForm(false);
    setFormData({ type: 'Progress Presentation', date: '', time: '' });
  };

  const chartData = useMemo(() => {
    return presentations.map(p => ({
      name: `ครั้งที่ ${p.presentationNumber}`,
      คะแนนนำเสนอ: p.percentage
    }));
  }, [presentations]);

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">คะแนนการนำเสนอ</h1>
        <p className="page-hero-sub">My Presentations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="คะแนนเฉลี่ยรวม" 
          value={`${avgScore.toFixed(1)}%`} 
          icon={Mic} 
          colorClass="bg-brand-600" 
        />
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-500 font-medium mb-2">ระดับความสามารถ</p>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${levelInfo.color} ${levelInfo.bgColor}`}>
            <Star className="w-5 h-5" />
            <span className="font-semibold">{levelInfo.label}</span>
          </div>
        </div>
        <SummaryCard 
          title="สถานะ" 
          value="ผ่านเกณฑ์" 
          icon={Award} 
          colorClass="bg-brand-600" 
        />
        <SummaryCard 
          title="อันดับในกลุ่ม" 
          value="2/32" 
          icon={BarChart2} 
          colorClass="bg-yellow-500" 
        />
      </div>

      {/* Scheduling Section */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">การนัดหมายนำเสนอ</h3>
          <button 
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
          >
            {showScheduleForm ? 'ยกเลิก' : <><Plus className="w-4 h-4" /> นัดวันนำเสนอ</>}
          </button>
        </div>

        {showScheduleForm && (
          <form onSubmit={handleScheduleSubmit} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รอบการนำเสนอ</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500 p-2.5 border"
                >
                  <option>Proposal Presentation</option>
                  <option>Progress Presentation</option>
                  <option>Pre-Final Presentation</option>
                  <option>Final Presentation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ต้องการ</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500 p-2.5 border text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลา</label>
                <input 
                  type="time" 
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500 p-2.5 border text-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
                ส่งคำขอนัดหมาย
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-slate-200/70 rounded-2xl shadow-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{req.type}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {req.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.time}</span>
                  </div>
                </div>
              </div>
              <div>
                {req.status === 'pending' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4 mr-1.5" /> รออาจารย์อนุมัติ
                  </span>
                ) : req.status === 'approved' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> อนุมัติแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1.5" /> ถูกปฏิเสธ
                  </span>
                )}
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-6 text-gray-500">ไม่มีคำขอนัดหมาย</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">กราฟคะแนนนำเสนอ</h3>
          <div className="h-80">
            <LineChartComponent data={chartData} xKey="name" lines={[{ key: 'คะแนนนำเสนอ', name: 'คะแนนนำเสนอ', color: 'var(--brand-500)' }]} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">สัดส่วนคะแนน (Rubric)</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">เนื้อหา (Content)</span>
                <span className="text-gray-900 font-bold">40%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">การนำเสนอ (Delivery)</span>
                <span className="text-gray-900 font-bold">30%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">สื่อประกอบ (Visuals)</span>
                <span className="text-gray-900 font-bold">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">การตอบคำถาม (Q&A)</span>
                <span className="text-gray-900 font-bold">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ประวัติการนำเสนอ</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ครั้งที่</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระดับ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ข้อเสนอแนะหลัก</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presentations.map((p) => {
                const pLevelInfo = getPresentationLevel(p.percentage);
                return (
                  <tr key={p.presentationNumber}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      นำเสนอครั้งที่ {p.presentationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.assessedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {p.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pLevelInfo.bgColor} ${pLevelInfo.color}`}>
                        {pLevelInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {p.feedback}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPresentation;
