import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, X, SlidersHorizontal, Check } from 'lucide-react';
import { students as mockStudents, instructors as mockInstructors, projects } from '../../data/mockData';
import type { Student, Instructor } from '../../types';

type Role = 'admin' | 'instructor' | 'student';
type RoleFilter = 'all' | Role;
type StudentGroup = 'CED' | 'TCT';
type GroupFilter = 'all' | StudentGroup;

interface Row {
  key: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  group?: string;
  projectTitle?: string;
  position?: string;
  advisingCount?: number;
}

const roleBadge: Record<Role, { label: string; cls: string }> = {
  admin: { label: 'ผู้ดูแลระบบ', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
  instructor: { label: 'อาจารย์', cls: 'bg-blue-50 text-blue-700 ring-blue-200' },
  student: { label: 'นักศึกษา', cls: 'bg-teal-50 text-teal-700 ring-teal-200' },
};

const groupBadge: Record<string, string> = {
  CED: 'bg-sky-50 text-sky-700 ring-sky-200',
  TCT: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const admins = [{ username: 'admin01', name: 'ผู้ดูแลระบบ 1', email: 'admin@kmutnb.ac.th' }];

const UserManagement: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const roleParam = params.get('role');
  const groupParam = params.get('group');
  const roleFilter: RoleFilter = roleParam === 'admin' || roleParam === 'instructor' || roleParam === 'student' ? roleParam : 'all';
  const groupFilter: GroupFilter = groupParam === 'CED' || groupParam === 'TCT' ? groupParam : 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [studentList, setStudentList] = useState<Student[]>(mockStudents);
  const [instructorList, setInstructorList] = useState<Instructor[]>(mockInstructors);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [filterOpen]);

  const setFilter = (role: RoleFilter, group: GroupFilter = 'all') => {
    const next = new URLSearchParams();
    if (role !== 'all') next.set('role', role);
    if (role === 'student' && group !== 'all') next.set('group', group);
    setParams(next, { replace: true });
  };

  const rows: Row[] = useMemo(() => [
    ...admins.map(a => ({ key: `a-${a.username}`, username: a.username, name: a.name, email: a.email, role: 'admin' as const })),
    ...instructorList.map(i => ({
      key: `i-${i.instructorId}`, username: i.instructorId, name: i.name, email: i.email, role: 'instructor' as const,
      position: i.position, advisingCount: projects.filter(p => p.advisorId === i.id).length,
    })),
    ...studentList.map(s => ({
      key: `s-${s.studentId}`, username: s.studentId, name: s.name, email: s.email, role: 'student' as const,
      group: s.group, projectTitle: projects.find(p => p.id === s.projectId)?.title,
    })),
  ], [studentList, instructorList]);

  const counts = {
    all: rows.length,
    admin: rows.filter(r => r.role === 'admin').length,
    instructor: rows.filter(r => r.role === 'instructor').length,
    student: rows.filter(r => r.role === 'student').length,
    CED: rows.filter(r => r.group === 'CED').length,
    TCT: rows.filter(r => r.group === 'TCT').length,
  };

  const q = searchTerm.trim().toLowerCase();
  const filtered = rows.filter(r =>
    (roleFilter === 'all' || r.role === roleFilter) &&
    (roleFilter !== 'student' || groupFilter === 'all' || r.group === groupFilter) &&
    (!q || r.name.toLowerCase().includes(q) || r.username.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
  );

  const showRole = roleFilter === 'all';
  const showStudentCols = roleFilter === 'student';
  const showInstructorCols = roleFilter === 'instructor';

  const activeCount = (roleFilter !== 'all' ? 1 : 0) + (roleFilter === 'student' && groupFilter !== 'all' ? 1 : 0);
  const roleOptions: [RoleFilter, string][] = [['all', 'ทั้งหมด'], ['admin', 'ผู้ดูแลระบบ'], ['instructor', 'อาจารย์'], ['student', 'นักศึกษา']];
  const groupOptions: [GroupFilter, string][] = [['all', 'ทุกกลุ่ม'], ['CED', 'CED'], ['TCT', 'TCT']];
  const optionCls = (active: boolean) =>
    `w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-left ${active ? 'bg-brand-50 text-brand-800 font-medium' : 'text-slate-700 hover:bg-slate-50'}`;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-hero-title">จัดการผู้ใช้งาน</h1>
          <p className="page-hero-sub">ผู้ดูแลระบบ อาจารย์ และนักศึกษา</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มผู้ใช้งาน
        </button>
      </div>

      {/* Search + hidden filter */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัส, อีเมล..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div ref={filterRef} className="relative">
            <button type="button" onClick={() => setFilterOpen(o => !o)} aria-expanded={filterOpen} aria-haspopup="true"
              className={`h-11 px-4 inline-flex items-center gap-2 rounded-lg border bg-white text-sm font-medium transition-colors ${
                activeCount > 0 || filterOpen ? 'border-brand-500 text-brand-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}>
              <SlidersHorizontal className="w-4 h-4" />
              ตัวกรอง
              {activeCount > 0 && <span className="min-w-5 h-5 px-1 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">{activeCount}</span>}
            </button>

            {filterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <p className="px-3 pt-1 pb-1.5 text-xs font-semibold text-slate-500">บทบาท</p>
                {roleOptions.map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setFilter(key, key === 'student' ? groupFilter : 'all')} className={optionCls(roleFilter === key)}>
                    <span className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${roleFilter === key ? 'text-brand-600' : 'invisible'}`} />{label}
                    </span>
                    <span className="text-xs text-slate-400">{counts[key]}</span>
                  </button>
                ))}

                {roleFilter === 'student' && (
                  <>
                    <div className="my-2 border-t border-slate-100" />
                    <p className="px-3 pb-1.5 text-xs font-semibold text-slate-500">กลุ่ม</p>
                    {groupOptions.map(([key, label]) => (
                      <button key={key} type="button" onClick={() => setFilter('student', key)} className={optionCls(groupFilter === key)}>
                        <span className="flex items-center gap-2">
                          <Check className={`w-4 h-4 ${groupFilter === key ? 'text-brand-600' : 'invisible'}`} />{label}
                        </span>
                        <span className="text-xs text-slate-400">{key === 'all' ? counts.student : counts[key]}</span>
                      </button>
                    ))}
                  </>
                )}

                {activeCount > 0 && (
                  <>
                    <div className="my-2 border-t border-slate-100" />
                    <button type="button" onClick={() => { setFilter('all'); setFilterOpen(false); }}
                      className="w-full rounded-lg px-3 py-2 text-sm text-left text-slate-600 hover:bg-slate-50">ล้างตัวกรอง</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 pl-3 pr-1 py-0.5 text-slate-700">
              {roleOptions.find(([k]) => k === roleFilter)?.[1]}
              <button type="button" onClick={() => setFilter('all')} aria-label="ล้างตัวกรองบทบาท" className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="w-3.5 h-3.5" /></button>
            </span>
            {roleFilter === 'student' && groupFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 pl-3 pr-1 py-0.5 text-slate-700">
                กลุ่ม {groupFilter}
                <button type="button" onClick={() => setFilter('student')} aria-label="ล้างตัวกรองกลุ่ม" className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium text-center w-16">ลำดับ</th>
                <th className="p-4 font-medium">{showStudentCols ? 'รหัสนักศึกษา' : showInstructorCols ? 'รหัสอาจารย์' : 'ชื่อผู้ใช้'}</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium">อีเมล</th>
                {showRole && <th className="p-4 font-medium">บทบาท</th>}
                {(showRole || showStudentCols) && <th className="p-4 font-medium">กลุ่ม</th>}
                {showStudentCols && <th className="p-4 font-medium">โครงงาน</th>}
                {showInstructorCols && <th className="p-4 font-medium">ตำแหน่ง</th>}
                {showInstructorCols && <th className="p-4 font-medium text-center">โครงงานที่ดูแล</th>}
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((r, index) => (
                <tr key={r.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-center text-slate-500">{index + 1}</td>
                  <td className="p-4 font-medium text-slate-900">{r.username}</td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">{r.name}</td>
                  <td className="p-4 text-slate-500">{r.email}</td>
                  {showRole && (
                    <td className="p-4">
                      <span className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium ring-1 ${roleBadge[r.role].cls}`}>{roleBadge[r.role].label}</span>
                    </td>
                  )}
                  {(showRole || showStudentCols) && (
                    <td className="p-4">
                      {r.group ? <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ring-1 ${groupBadge[r.group] || 'bg-slate-50 text-slate-700 ring-slate-200'}`}>{r.group}</span> : <span className="text-slate-300">-</span>}
                    </td>
                  )}
                  {showStudentCols && <td className="p-4 text-slate-600 max-w-[240px] truncate" title={r.projectTitle}>{r.projectTitle || '-'}</td>}
                  {showInstructorCols && <td className="p-4 text-slate-600">{r.position || 'อาจารย์'}</td>}
                  {showInstructorCols && <td className="p-4 text-center font-semibold text-slate-800">{r.advisingCount}</td>}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>ปกติ
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors" title="แก้ไข"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="p-10 text-center text-slate-500">ไม่พบผู้ใช้งานที่ตรงกับตัวกรอง</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 text-sm text-slate-500">แสดง {filtered.length} จาก {rows.length} รายการ</div>
      </div>

      {isAddOpen && (
        <AddUserModal
          defaultRole={roleFilter === 'all' ? 'student' : roleFilter}
          defaultGroup={groupFilter === 'all' ? 'CED' : groupFilter}
          onClose={() => setIsAddOpen(false)}
          onAddStudent={s => { mockStudents.push(s); setStudentList([...mockStudents]); }}
          onAddInstructor={i => { mockInstructors.push(i); setInstructorList([...mockInstructors]); }}
        />
      )}
    </div>
  );
};

function AddUserModal({ defaultRole, defaultGroup, onClose, onAddStudent, onAddInstructor }: {
  defaultRole: Role;
  defaultGroup: StudentGroup;
  onClose: () => void;
  onAddStudent: (s: Student) => void;
  onAddInstructor: (i: Instructor) => void;
}) {
  const [role, setRole] = useState<Role>(defaultRole);
  const [form, setForm] = useState({ id: '', name: '', email: '', group: defaultGroup as string, position: 'อาจารย์', phone: '' });
  const [error, setError] = useState('');
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = 'w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500';

  const save = () => {
    if (!form.id.trim() || !form.name.trim()) { setError('กรุณากรอกรหัสและชื่อ-สกุล'); return; }
    const email = form.email.trim() || `${form.id.trim()}@kmutnb.ac.th`;
    if (role === 'student') {
      onAddStudent({ id: `s${form.id.trim()}`, studentId: form.id.trim(), name: form.name.trim(), email, group: form.group, year: 4 });
    } else if (role === 'instructor') {
      onAddInstructor({ id: form.id.trim(), instructorId: form.id.trim(), name: form.name.trim(), email, phone: form.phone, department: 'วิศวกรรมคอมพิวเตอร์', position: form.position });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="add-user-title" className="text-lg font-bold text-slate-900">เพิ่มผู้ใช้งาน</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="ปิด"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="block text-sm font-medium text-slate-700 mb-1.5">บทบาท</p>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'instructor', 'admin'] as Role[]).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`h-10 rounded-lg border text-sm font-medium ${role === r ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                  {roleBadge[r].label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-id">{role === 'student' ? 'รหัสนักศึกษา' : role === 'instructor' ? 'รหัสอาจารย์' : 'ชื่อผู้ใช้'}</label>
              <input id="u-id" className={inputCls} value={form.id} onChange={e => set('id', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-name">ชื่อ-สกุล</label>
              <input id="u-name" className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-email">อีเมล</label>
            <input id="u-email" type="email" className={inputCls} placeholder="ว่างไว้เพื่อใช้ รหัส@kmutnb.ac.th" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-group">กลุ่ม</label>
              <select id="u-group" className={inputCls} value={form.group} onChange={e => set('group', e.target.value)}>
                <option value="CED">CED</option>
                <option value="TCT">TCT</option>
              </select>
            </div>
          )}
          {role === 'instructor' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-pos">ตำแหน่ง</label>
                <select id="u-pos" className={inputCls} value={form.position} onChange={e => set('position', e.target.value)}>
                  <option>อาจารย์</option><option>ผู้ช่วยศาสตราจารย์</option><option>รองศาสตราจารย์</option><option>ศาสตราจารย์</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="u-phone">โทรศัพท์</label>
                <input id="u-phone" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">ยกเลิก</button>
          <button onClick={save} className="h-10 px-5 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">บันทึก</button>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
