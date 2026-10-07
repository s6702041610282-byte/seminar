import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, XCircle, TrendingUp, Presentation, Eye, Search, Calendar, Clock, Check, X, FileText
} from 'lucide-react';
import { 
  students, allPresentationAssessments,
  getPresentationAverageByRound, getPresentationSummary
} from '../../data/mockData';
import { calculatePresentationAverage, getScoreLevel } from '../../utils/calculations';
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

const ScoreLevelBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    'ดีมาก': 'bg-green-100 text-green-700',
    'ดี': 'bg-brand-100 text-brand-700',
    'พอใช้': 'bg-yellow-100 text-yellow-700',
    'ไม่ผ่าน': 'bg-red-100 text-red-700'
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[level] || 'bg-gray-100 text-gray-700'}`}>{level}</span>;
};

const PresentationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Grading Modal State
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Mock Requests State
  const [requests, setRequests] = useState([
    { id: '1', studentId: 's6501001', name: 'นายกิตติพงศ์ สุขสวัสดิ์', type: 'Progress Presentation', date: '2024-10-07', time: '13:00', status: 'pending' },
    { id: '2', studentId: 's6501002', name: 'นายธนพล เจริญยิ่ง', type: 'Proposal Presentation', date: '2024-10-08', time: '09:00', status: 'pending' }
  ]);

  const summary = getPresentationSummary();
  const presentationAverageData = getPresentationAverageByRound();
  
  const presentationLevelData = [
    { name: 'ดีมาก', value: 15, color: '#22c55e' },
    { name: 'ดี', value: 10, color: 'var(--brand-500)' },
    { name: 'พอใช้', value: 5, color: '#eab308' },
    { name: 'ไม่ผ่าน', value: 2, color: '#ef4444' }
  ];

  const scoreDistributionData = [
    { name: '0-49', '0-49': 1 },
    { name: '50-59', '50-59': 2 },
    { name: '60-69', '60-69': 5 },
    { name: '70-79', '70-79': 10 },
    { name: '80-89', '80-89': 12 },
    { name: '90-100', '90-100': 2 }
  ];

  const tableData = useMemo(() => {
    return students.map(student => {
      const proposal = 85;
      const progress = 82;
      const preFinal = 80;
      const averageScore = calculatePresentationAverage([
        { percentage: proposal } as any, 
        { percentage: progress } as any, 
        { percentage: preFinal } as any
      ]);
      const level = getScoreLevel(averageScore);
      const final = 0;
      
      return {
        id: student.id,
        studentName: student.name,
        proposal,
        progress,
        preFinal,
        final,
        averageScore,
        level,
        status: 'ผ่านเกณฑ์'
      };
    });
  }, []);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    alert('อนุมัติวันนำเสนอเรียบร้อยแล้ว');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('บันทึกคะแนนและส่งแจ้งเตือนให้นักศึกษาเรียบร้อยแล้ว');
    setShowGradeModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">Presentation Assessment</h1>
        <p className="page-hero-sub">จัดการและประเมินการนำเสนอโครงงาน</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          ภาพรวม
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          คำขอนำเสนอ
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter(r => r.status === 'pending').length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('assessment')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'assessment' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          รอประเมินคะแนน
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SummaryCard icon={Users} title="นักศึกษาทั้งหมด" value={summary.totalStudents} color="bg-brand-600" />
            <SummaryCard icon={Presentation} title="นำเสนอแล้ว" value={summary.presented} subtitle={`${Math.round((summary.presented / summary.totalStudents) * 100)}%`} color="bg-green-600" />
            <SummaryCard icon={XCircle} title="ยังไม่นำเสนอ" value={summary.notPresented} subtitle={`${Math.round((summary.notPresented / summary.totalStudents) * 100)}%`} color="bg-orange-500" />
            <SummaryCard icon={TrendingUp} title="คะแนนเฉลี่ยรวม" value={`${summary.averageScore}%`} color="bg-brand-500" />
            <SummaryCard icon={CheckCircle} title="ผ่านเกณฑ์" value={summary.passed} color="bg-green-500" />
            <SummaryCard icon={XCircle} title="ไม่ผ่านเกณฑ์" value={summary.failed} color="bg-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">คะแนนเฉลี่ยการนำเสนอแต่ละครั้ง</h2>
              <div className="h-64">
                <LineChartComponent data={presentationAverageData} xKey="round" lines={[{ key: 'averageScore', name: 'คะแนนเฉลี่ย', color: 'var(--brand-500)' }]} />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนระดับผลการนำเสนอ</h2>
              <div className="h-64">
                <DonutChart data={presentationLevelData} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">รายการผลการนำเสนอ</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                    <th className="p-4 font-medium">รหัสนักศึกษา</th>
                    <th className="p-4 font-medium">ชื่อ-สกุล</th>
                    <th className="p-4 font-medium">Proposal</th>
                    <th className="p-4 font-medium">Progress</th>
                    <th className="p-4 font-medium">Pre-Final</th>
                    <th className="p-4 font-medium">คะแนนเฉลี่ย</th>
                    <th className="p-4 font-medium">สถานะ</th>
                    <th className="p-4 font-medium text-center">ดูข้อมูล</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-brand-50/50">
                      <td className="p-4 text-sm font-medium text-gray-800">{item.id}</td>
                      <td className="p-4 text-sm text-gray-600">{item.studentName}</td>
                      <td className="p-4 text-sm text-gray-600">{item.proposal}</td>
                      <td className="p-4 text-sm text-gray-600">{item.progress}</td>
                      <td className="p-4 text-sm text-gray-600">{item.preFinal}</td>
                      <td className="p-4 text-sm text-gray-600 font-medium">{item.averageScore}%</td>
                      <td className="p-4">
                        <ScoreLevelBadge level={item.level.labelTh} />
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => navigate(`/instructor/students/${item.id}`)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">คำขอนัดหมายการนำเสนอ</h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">ไม่มีคำขอนัดหมายใหม่</p>
            ) : requests.map(req => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-brand-50/50 transition-colors">
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{req.name}</h3>
                    <p className="text-sm text-gray-500">{req.studentId} • {req.type}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                        <Calendar className="w-4 h-4 text-gray-400" /> {req.date}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                        <Clock className="w-4 h-4 text-gray-400" /> {req.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => alert('เปิดหน้าต่างเปลี่ยนวัน')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-slate-300 rounded-lg hover:bg-brand-50/50 transition-colors">
                        เปลี่ยนวัน
                      </button>
                      <button onClick={() => handleApprove(req.id)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        <Check className="w-4 h-4" /> อนุมัติ
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4" /> อนุมัติแล้ว
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assessment' && (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">รายการรอประเมิน (วันนี้)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.filter(r => r.status === 'approved').map(req => (
              <div key={req.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-brand-50 p-4 border-b border-brand-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-1 rounded">{req.type}</span>
                    <span className="text-sm font-medium text-gray-500 bg-white px-2 py-0.5 rounded">{req.time}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{req.name}</h3>
                  <p className="text-sm text-gray-500">{req.studentId}</p>
                </div>
                <div className="p-4 bg-white space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">เอกสารแนบ</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700 p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                        <FileText className="w-4 h-4 text-brand-500" />
                        <span className="truncate">Report_Draft.pdf</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                        <Presentation className="w-4 h-4 text-orange-500" />
                        <span className="truncate">Presentation_Slides.pdf</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedStudent(req); setShowGradeModal(true); }}
                    className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                  >
                    ประเมินให้คะแนน
                  </button>
                </div>
              </div>
            ))}
            {requests.filter(r => r.status === 'approved').length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                ไม่มีรายการรอประเมิน
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradeModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">ประเมินผล: {selectedStudent.type}</h2>
                <p className="text-sm text-gray-500">{selectedStudent.name} ({selectedStudent.studentId})</p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="gradeForm" onSubmit={handleGradeSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">เกณฑ์การให้คะแนน (Rubric)</h3>
                  <div className="space-y-4">
                    {['เนื้อหา (Content) - 40%', 'การนำเสนอ (Delivery) - 30%', 'สื่อประกอบ (Visuals) - 15%', 'การตอบคำถาม (Q&A) - 15%'].map((rubric, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                        <label className="font-medium text-gray-700">{rubric}</label>
                        <select className="w-full sm:w-32 border border-slate-300 rounded p-1.5 focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500">
                          <option value="5">5 - ดีมาก</option>
                          <option value="4">4 - ดี</option>
                          <option value="3">3 - ปานกลาง</option>
                          <option value="2">2 - พอใช้</option>
                          <option value="1">1 - ต้องปรับปรุง</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">ข้อเสนอแนะเพื่อการพัฒนา (Feedback)</h3>
                  <textarea 
                    rows={4} 
                    className="w-full border border-slate-300 rounded-lg p-3 focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
                    placeholder="พิมพ์ข้อเสนอแนะให้นักศึกษา..."
                    required
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl">
              <button onClick={() => setShowGradeModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                ยกเลิก
              </button>
              <button type="submit" form="gradeForm" className="px-5 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
                บันทึกคะแนน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PresentationDashboard;
