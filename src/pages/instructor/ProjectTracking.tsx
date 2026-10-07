import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { projects, students } from '../../data/mockData';
import { PROJECT_STEPS } from '../../types';

const ProjectTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const summary = useMemo(() => {
    const avgStep = Math.round(projects.reduce((sum, p) => sum + p.currentStep, 0) / projects.length * 10) / 10;
    const reachedFinal = projects.filter(p => p.currentStep >= 14).length;
    const needsFollowUp = projects.filter(p => p.currentStep <= 6).length;
    const completionRate = Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100);
    return { avgStep, reachedFinal, needsFollowUp, completionRate };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const lower = searchTerm.toLowerCase();
    return projects.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.studentName.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="page-hero">
        <h1 className="page-hero-title">การติดตามความก้าวหน้า</h1>
        <p className="page-hero-sub">ติดตาม 14 ขั้นตอนการดำเนินโครงงาน</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'ขั้นตอนเฉลี่ย', value: `${summary.avgStep}/14`, color: 'bg-brand-600' },
          { icon: CheckCircle, label: 'ถึงขั้นตอนสุดท้าย', value: summary.reachedFinal, color: 'bg-emerald-600' },
          { icon: AlertTriangle, label: 'ต้องติดตาม (≤ Step 6)', value: summary.needsFollowUp, color: 'bg-amber-500' },
          { icon: Clock, label: 'อัตราความสำเร็จ', value: `${summary.completionRate}%`, color: 'bg-brand-600' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อโครงงาน, ชื่อนักศึกษา..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-700 transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Project Timeline Cards */}
      <div className="space-y-4">
        {currentData.map((project) => {
          const step = project.currentStep;
          const progressPercent = Math.round((step / 14) * 100);

          return (
            <div key={project.id} className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden transition-shadow">
              {/* Project Info Header */}
              <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.studentName} • {project.advisorName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    Step {step}/14
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    progressPercent >= 90 ? 'bg-emerald-100 text-emerald-700' :
                    progressPercent >= 50 ? 'bg-brand-100 text-brand-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Timeline Stepper */}
              <div className="p-4 overflow-x-auto">
                <div className="flex items-center min-w-[700px]">
                  {PROJECT_STEPS.map((stepName, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = stepNum < step;
                    const isCurrent = stepNum === step;
                    const isPending = stepNum > step;

                    return (
                      <React.Fragment key={idx}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative group" style={{ minWidth: '40px' }}>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-200 animate-pulse'
                                : 'bg-white border-gray-200 text-gray-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              stepNum
                            )}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute top-full mt-1 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              {stepNum}. {stepName}
                            </div>
                          </div>
                        </div>
                        {/* Connector Line */}
                        {idx < PROJECT_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-0.5 rounded ${
                            stepNum < step ? 'bg-emerald-400' :
                            stepNum === step ? 'bg-brand-400' :
                            'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Current Step Label */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">ขั้นตอนปัจจุบัน:</span>
                  <span className={`font-semibold ${step >= 14 ? 'text-emerald-600' : 'text-brand-600'}`}>
                    {PROJECT_STEPS[step - 1] || 'สำเร็จ'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
          <span className="text-sm text-gray-500">
            แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredProjects.length)} จาก {filteredProjects.length} โครงงาน
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-brand-50/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-brand-50/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTracking;
