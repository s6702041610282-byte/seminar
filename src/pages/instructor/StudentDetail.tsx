import { LEVEL_TEXT } from '../../utils/riskExplain';
import { RiskSummaryCard } from '../../components/common/RiskPanel';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, AlertTriangle, FileText, CheckCircle, XCircle,
  MessageSquare, Calendar, Activity, BarChart2, Download, Clock
} from 'lucide-react';
import { 
  students, projects, instructors, getStudentRiskScore,
  getStudentWeeklyScores, getStudentPresentations
} from '../../data/mockData';
import { getScoreLevel, getPresentationLevel } from '../../utils/calculations';

const StudentDetail: React.FC = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // If studentId is undefined, use mock
  const id = studentId || 's6501001'; 
  const student = students.find(s => s.id === id) || students[0];
  const project = projects.find(p => p.id === student.projectId);
  const advisor = instructors.find(i => i.id === project?.advisorId);
  const rawRiskData = getStudentRiskScore(id);
  const riskData = rawRiskData || { finalLevel: 'low', totalScore: 0, recommendation: '', breakdown: { weeklyScore: 0, presentationScore: 0, submissionScore: 0 }, appliedRules: [], trend: 'stable' };
  const weeklyScores = getStudentWeeklyScores(id);
  const presentations = getStudentPresentations(id);

  // Mock Data for Tabs
  const feedbacks = [
    { id: 1, type: 'Weekly Report', date: '2024-10-01', text: 'ควรเพิ่มรายละเอียดในส่วนของการทดสอบระบบ', author: advisor?.name || 'อาจารย์ที่ปรึกษา' },
    { id: 2, type: 'Presentation', date: '2024-09-15', text: 'สไลด์นำเสนอชัดเจนดี แต่ควรฝึกซ้อมการตอบคำถามเพิ่มเติม', author: 'กรรมการคุมสอบ' }
  ];

  const docs = [
    { id: 1, name: 'Proposal_Report_v2.pdf', type: 'รายงาน Proposal', date: '2024-09-10', status: 'approved' },
    { id: 2, name: 'Progress_Slides.pdf', type: 'สไลด์ Progress', date: '2024-10-06', status: 'pending' }
  ];

  const tabs = [
    { id: 'overview', name: 'ภาพรวม', icon: <Activity className="w-4 h-4 mr-2" /> },
    { id: 'weekly', name: 'Weekly Progress', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { id: 'presentation', name: 'Presentation', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { id: 'risk', name: 'Risk Score', icon: <AlertTriangle className="w-4 h-4 mr-2" /> },
    { id: 'docs', name: 'เอกสาร', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'feedback', name: 'Feedback', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6 animate-fadeIn">
      <button 
        onClick={() => navigate('/instructor/students')}
        className="flex items-center text-sm text-gray-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> กลับไปหน้ารายชื่อนักศึกษา
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-12 h-12" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-950 tracking-tight">{student.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                <span>รหัส: {student.studentId}</span>
                <span>กลุ่ม: {student.group}</span>
                <span>ปีการศึกษา: {student.year}</span>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">โครงงาน:</span>
                <span className="text-sm text-gray-600">{project?.title || '-'}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium mr-2">อาจารย์ที่ปรึกษา:</span> 
                {advisor?.name || '-'}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                riskData.finalLevel === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                riskData.finalLevel === 'medium' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                'bg-green-50 border-green-200 text-green-700'
              }`}>
                <AlertTriangle className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium opacity-80">ระดับความเสี่ยง</span>
                  <span className="font-bold">{LEVEL_TEXT[riskData.finalLevel as 'low' | 'medium' | 'high'].title} · {Number(riskData.totalScore).toFixed(1)}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-white rounded-t-xl px-2 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center whitespace-nowrap px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600 bg-brand-50/50 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800">ภาพรวมความก้าวหน้า</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 bg-brand-50 rounded-lg border border-brand-100">
                 <p className="text-sm text-brand-600 font-medium">ความคืบหน้าโครงงาน</p>
                 <p className="text-3xl font-bold text-brand-700 mt-1">{project?.progress || 0}%</p>
               </div>
               <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                 <p className="text-sm text-emerald-600 font-medium">ส่งรายงาน Weekly</p>
                 <p className="text-3xl font-bold text-emerald-700 mt-1">{weeklyScores.filter(w => w.submissionStatus !== 'not_submitted').length} / 14</p>
               </div>
               <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                 <p className="text-sm text-purple-600 font-medium">คะแนนเฉลี่ย Weekly</p>
                 <p className="text-3xl font-bold text-purple-700 mt-1">
                   {weeklyScores.length > 0 ? (weeklyScores.reduce((s,a) => s+a.percentage,0)/weeklyScores.length).toFixed(1) : 0}%
                 </p>
               </div>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-6">
               <h3 className="text-md font-bold text-gray-800 mb-4">สถานะปัจจุบัน</h3>
               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                 <p className="text-gray-700">กำลังอยู่ในขั้นตอน: <span className="font-bold text-brand-600">ดำเนินโครงงาน (In Progress)</span></p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ประวัติการส่งงานรายสัปดาห์</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                    <th className="p-3 font-medium">สัปดาห์ที่</th>
                    <th className="p-3 font-medium">คะแนน (%)</th>
                    <th className="p-3 font-medium">สถานะการส่ง</th>
                    <th className="p-3 font-medium">ความคืบหน้า</th>
                    <th className="p-3 font-medium">คุณภาพงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyScores.map(score => {
                    const statusColor = score.submissionStatus === 'on_time' ? 'text-green-600 bg-green-50' : 
                                      score.submissionStatus === 'late' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                    const statusText = score.submissionStatus === 'on_time' ? 'ตรงเวลา' : 
                                      score.submissionStatus === 'late' ? 'ล่าช้า' : 'ยังไม่ส่ง';
                    return (
                      <tr key={score.week} className="border-b border-gray-100 hover:bg-brand-50/50">
                        <td className="p-3 text-sm font-medium">สัปดาห์ที่ {score.week}</td>
                        <td className="p-3 text-sm font-bold text-gray-800">{score.percentage}%</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>{statusText}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{score.progress}/5</td>
                        <td className="p-3 text-sm text-gray-600">{score.quality}/5</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'presentation' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ผลการประเมินการนำเสนอ</h2>
            {presentations.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {presentations.map(p => {
                  const pLevelInfo = getPresentationLevel(p.percentage);
                  return (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{p.type}</h3>
                          <p className="text-sm text-gray-500">{p.assessedDate}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${pLevelInfo.bgColor} ${pLevelInfo.color}`}>
                          {p.percentage}% ({pLevelInfo.label})
                        </div>
                      </div>
                      <div className="space-y-2 mt-4 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">เนื้อหา (Content)</span><span className="font-medium">{p.rubric.content}/5</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">การนำเสนอ (Presentation)</span><span className="font-medium">{p.rubric.presentation}/5</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">การตอบคำถาม (Q&A)</span><span className="font-medium">{p.rubric.qa}/5</span></div>
                      </div>
                      {p.feedback && (
                        <div className="mt-4 p-3 bg-brand-50 text-brand-800 text-sm rounded-lg border border-brand-100">
                          <span className="font-bold">ข้อเสนอแนะ:</span> {p.feedback}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">ยังไม่มีประวัติการนำเสนอ</div>
            )}
          </div>
        )}

        {activeTab === 'risk' && (
          <RiskSummaryCard studentId={id} audience="instructor" defaultOpen />
        )}

        {activeTab === 'docs' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-4">เอกสารที่ส่งแล้ว</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                    <th className="p-3 font-medium">ชื่อไฟล์</th>
                    <th className="p-3 font-medium">ประเภท</th>
                    <th className="p-3 font-medium">วันที่ส่ง</th>
                    <th className="p-3 font-medium">สถานะ</th>
                    <th className="p-3 font-medium text-center">ดาวน์โหลด</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-brand-50/50">
                      <td className="p-3 text-sm font-medium text-brand-600">{doc.name}</td>
                      <td className="p-3 text-sm text-gray-600">{doc.type}</td>
                      <td className="p-3 text-sm text-gray-600">{doc.date}</td>
                      <td className="p-3 text-sm">
                        {doc.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3"/> อนุมัติแล้ว</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3"/> รอตรวจ</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"><Download className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ประวัติ Feedback</h2>
            <div className="space-y-4">
              {feedbacks.map(fb => (
                <div key={fb.id} className="p-4 border border-gray-200 rounded-xl hover:bg-brand-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded">{fb.type}</span>
                      <span className="text-sm text-gray-500 font-medium">{fb.author}</span>
                    </div>
                    <span className="text-xs text-gray-400">{fb.date}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed mt-2">{fb.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDetail;
