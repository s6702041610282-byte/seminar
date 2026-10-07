import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Edit, BookOpen, Clock, CheckCircle, AlertTriangle, X, RefreshCw, Users } from 'lucide-react';
import { projects, students, instructors } from '../../data/mockData';

const statusOptions = [
  { value: 'proposed', label: 'เสนอหัวข้อ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'revision', label: 'แก้ไข' },
  { value: 'submitted', label: 'ส่งเล่มแล้ว' },
  { value: 'completed', label: 'เสร็จสิ้น' },
];

const statusBadge: Record<string, { label: string; bg: string; text: string }> = {
  proposed: { label: 'เสนอหัวข้อ', bg: 'bg-gray-100', text: 'text-gray-700' },
  topic_review: { label: 'ตรวจสอบหัวข้อ', bg: 'bg-gray-100', text: 'text-gray-700' },
  advisor_assigned: { label: 'แต่งตั้งที่ปรึกษา', bg: 'bg-gray-100', text: 'text-gray-700' },
  approved: { label: 'อนุมัติแล้ว', bg: 'bg-brand-100', text: 'text-brand-700' },
  in_progress: { label: 'กำลังดำเนินการ', bg: 'bg-brand-100', text: 'text-brand-800' },
  reporting: { label: 'รายงานความก้าวหน้า', bg: 'bg-brand-100', text: 'text-brand-800' },
  revision: { label: 'แก้ไข', bg: 'bg-orange-100', text: 'text-orange-800' },
  submitted: { label: 'ส่งเล่มแล้ว', bg: 'bg-brand-100', text: 'text-brand-800' },
  completed: { label: 'เสร็จสิ้น', bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

const ProjectManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusModal, setStatusModal] = useState<{ id: string; currentStatus: string } | null>(null);
  const [advisorModal, setAdvisorModal] = useState<{ id: string; currentAdvisorId: string } | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newAdvisorId, setNewAdvisorId] = useState('');

  const summary = useMemo(() => ({
    total: projects.length,
    pending: projects.filter(p => ['in_progress', 'revision', 'reporting'].includes(p.status)).length,
    approved: projects.filter(p => ['completed', 'submitted'].includes(p.status)).length,
    revision: projects.filter(p => p.status === 'revision').length,
  }), []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const title = (project as any).titleTh || project.title;
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const openStatusModal = (id: string, currentStatus: string) => {
    setNewStatus(currentStatus);
    setStatusModal({ id, currentStatus });
  };

  const openAdvisorModal = (id: string, currentAdvisorId: string) => {
    setNewAdvisorId(currentAdvisorId);
    setAdvisorModal({ id, currentAdvisorId });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="page-hero flex justify-between items-end">
        <div>
          <h1 className="page-hero-title">จัดการโครงงาน</h1>
          <p className="page-hero-sub">ศูนย์กลางจัดการโครงงานทั้งหมด (Admin)</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'โครงงานทั้งหมด', value: summary.total, color: 'bg-brand-600' },
          { icon: Clock, label: 'รออนุมัติ/ดำเนินการ', value: summary.pending, color: 'bg-amber-500' },
          { icon: CheckCircle, label: 'อนุมัติแล้ว/ส่งแล้ว', value: summary.approved, color: 'bg-emerald-600' },
          { icon: AlertTriangle, label: 'ต้องแก้ไข', value: summary.revision, color: 'bg-red-500' },
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

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-brand-800">เลือก {selectedIds.size} โครงงาน</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors">
              อนุมัติโครงงาน
            </button>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
              เปลี่ยนสถานะ
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหารหัส, ชื่อโครงงาน, ชื่อนักศึกษา..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredProjects.length && filteredProjects.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 font-medium">รหัส</th>
                <th className="p-4 font-medium min-w-[200px]">ชื่อโครงงาน</th>
                <th className="p-4 font-medium">นักศึกษา</th>
                <th className="p-4 font-medium">อาจารย์ที่ปรึกษา</th>
                <th className="p-4 font-medium w-40">ความคืบหน้า</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProjects.map((project) => {
                const student = students.find(s => s.id === project.studentId);
                const badge = statusBadge[project.status] || statusBadge.in_progress;
                const progress = project.progress || 0;

                return (
                  <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900 text-xs">{project.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{project.title}</div>
                    </td>
                    <td className="p-4 text-gray-600">{project.studentName}</td>
                    <td className="p-4 text-gray-600">{project.advisorName}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${progress >= 80 ? 'bg-green-500' : progress >= 40 ? 'bg-brand-500' : 'bg-orange-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 min-w-[32px]">{progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => openStatusModal(project.id, project.status)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="เปลี่ยนสถานะ"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openAdvisorModal(project.id, project.advisorId)}
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="สับเปลี่ยนอาจารย์"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setStatusModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">เปลี่ยนสถานะโครงงาน</h3>
              <button onClick={() => setStatusModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สถานะปัจจุบัน</label>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${(statusBadge[statusModal.currentStatus] || statusBadge.in_progress).bg} ${(statusBadge[statusModal.currentStatus] || statusBadge.in_progress).text}`}>
                  {(statusBadge[statusModal.currentStatus] || statusBadge.in_progress).label}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สถานะใหม่</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  {statusOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setStatusModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  ยกเลิก
                </button>
                <button onClick={() => setStatusModal(null)} className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisor Change Modal */}
      {advisorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setAdvisorModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">สับเปลี่ยนอาจารย์ที่ปรึกษา</h3>
              <button onClick={() => setAdvisorModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อาจารย์ที่ปรึกษาปัจจุบัน</label>
                <p className="text-sm font-semibold text-brand-700">
                  {instructors.find(i => i.id === advisorModal.currentAdvisorId)?.name || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อาจารย์ที่ปรึกษาใหม่</label>
                <select
                  value={newAdvisorId}
                  onChange={e => setNewAdvisorId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  {instructors.map(ins => (
                    <option key={ins.id} value={ins.id}>
                      {ins.name} {ins.id === advisorModal.currentAdvisorId ? '(ปัจจุบัน)' : ''} - {ins.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setAdvisorModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  ยกเลิก
                </button>
                <button onClick={() => setAdvisorModal(null)} className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors">
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
