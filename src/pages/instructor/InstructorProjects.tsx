import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader, Send, CheckCircle2, Search, Filter, Eye, Users } from 'lucide-react';
import { projects, students } from '../../data/mockData';

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  completed: { label: 'เสร็จสิ้น', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-l-emerald-500' },
  submitted: { label: 'ส่งเล่มแล้ว', bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-l-brand-500' },
  in_progress: { label: 'กำลังดำเนินการ', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
  revision: { label: 'แก้ไข', bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
};

const InstructorProjects: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  const summary = useMemo(() => ({
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    submitted: projects.filter(p => p.status === 'submitted').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }), []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesGroup = groupFilter === 'all' || project.group === groupFilter;
      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [searchTerm, statusFilter, groupFilter]);

  const groups = useMemo(() => [...new Set(projects.map(p => p.group))], []);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="page-hero">
        <h1 className="page-hero-title">โครงงานนักศึกษา</h1>
        <p className="page-hero-sub">รายการโครงงานทั้งหมดที่ดูแล</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'จำนวนโครงงานทั้งหมด', value: summary.total, color: 'bg-brand-600' },
          { icon: Loader, label: 'กำลังดำเนินการ', value: summary.inProgress, color: 'bg-amber-500' },
          { icon: Send, label: 'ส่งเล่มแล้ว', value: summary.submitted, color: 'bg-brand-500' },
          { icon: CheckCircle2, label: 'เสร็จสิ้น', value: summary.completed, color: 'bg-emerald-600' },
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

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงงาน, ชื่อนักศึกษา..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-700 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">ทุกสถานะ</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="submitted">ส่งเล่มแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="revision">แก้ไข</option>
            </select>
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="all">ทุกกลุ่ม</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">แสดง {filteredProjects.length} จาก {projects.length} โครงงาน</p>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const cfg = statusConfig[project.status] || statusConfig.in_progress;
          const student = students.find(s => s.id === project.studentId);

          return (
            <div
              key={project.id}
              className={`bg-white rounded-2xl shadow-card border border-slate-200/70 border-l-4 ${cfg.border} overflow-hidden transition-all duration-200 flex flex-col`}
            >
              <div className="p-5 flex-1 flex flex-col">
                {/* Status & Group badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    {project.group}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 leading-snug">{project.title}</h3>
                {project.titleEn && (
                  <p className="text-xs text-gray-400 line-clamp-1 mb-3">{project.titleEn}</p>
                )}

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{project.description}</p>

                {/* Student & Advisor */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{project.studentName}</span>
                    <span className="text-xs text-gray-400">({student?.studentId})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{project.advisorName}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">ความคืบหน้า</span>
                    <span className="font-semibold text-gray-700">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        project.progress >= 80 ? 'bg-emerald-500' :
                        project.progress >= 40 ? 'bg-brand-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/instructor/students/${project.studentId}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-700/5 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ไม่พบโครงงานที่ตรงกับเงื่อนไข</p>
        </div>
      )}
    </div>
  );
};

export default InstructorProjects;
