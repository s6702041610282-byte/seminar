import React from 'react';
import { getStudentFeedback } from '../../data/mockData';
import { MessageSquare, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const MyFeedback = () => {
  const studentId = 's6501001';
  const feedbacks = getStudentFeedback(studentId) || [];

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">Feedback จากอาจารย์</h1>
        <p className="page-hero-sub">Instructor Feedback</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
        <div className="space-y-6">
          {feedbacks.length > 0 ? feedbacks.map((fb) => (
            <div key={fb.id} className={`p-4 rounded-xl border ${fb.isAddressed ? 'border-gray-200 bg-gray-50' : 'border-brand-100 bg-brand-50/30'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fb.type === 'weekly' ? 'bg-brand-100 text-brand-800' : 'bg-purple-100 text-purple-800'}`}>
                    {fb.type === 'weekly' ? 'รายสัปดาห์' : 'การนำเสนอ'}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {fb.date}
                  </span>
                </div>
                {fb.isAddressed ? (
                  <span className="inline-flex items-center text-xs font-medium text-green-600 gap-1">
                    <CheckCircle className="w-4 h-4" /> รับทราบแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-orange-500 gap-1">
                    <AlertCircle className="w-4 h-4" /> รอการดำเนินการ
                  </span>
                )}
              </div>
              <p className="text-gray-800 mt-3 text-sm leading-relaxed">{fb.content}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                <MessageSquare className="w-4 h-4" />
                <span>โดย อ. {fb.instructorId}</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p>ยังไม่มีข้อเสนอแนะ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFeedback;
