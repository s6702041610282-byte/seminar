import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { students as mockStudents, projects } from '../../data/mockData';
import { Student } from '../../types';

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    studentId: '',
    name: '',
    email: '',
    group: 'กลุ่ม A',
    year: 4
  });

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.studentId.includes(searchTerm)
  );

  const handleAddStudent = () => {
    if (!newStudent.studentId || !newStudent.name) return;

    const studentToAdd: Student = {
      id: `s${newStudent.studentId}`,
      studentId: newStudent.studentId,
      name: newStudent.name,
      email: newStudent.email || `${newStudent.studentId}@kmutnb.ac.th`,
      group: newStudent.group || 'กลุ่ม A',
      year: newStudent.year || 4
    };

    mockStudents.push(studentToAdd);
    setStudents([...mockStudents]);
    setIsAddModalOpen(false);
    setNewStudent({ studentId: '', name: '', email: '', group: 'กลุ่ม A', year: 4 });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-hero-title">จัดการนักศึกษา</h1>
          <p className="page-hero-sub">จัดการข้อมูลนักศึกษาในระบบ</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-brand-50/50 transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            นำเข้า (Excel)
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            เพิ่มนักศึกษา
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ค้นหารหัสนักศึกษา, ชื่อ-สกุล..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium text-center w-16">ลำดับ</th>
                <th className="p-4 font-medium">รหัสนักศึกษา</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium">อีเมล</th>
                <th className="p-4 font-medium">กลุ่ม</th>
                <th className="p-4 font-medium">โครงงาน</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStudents.map((student, index) => {
                const project = projects.find(p => p.id === student.projectId);
                return (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                    <td className="p-4 text-center text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{student.studentId}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4 text-gray-500">{student.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                        {student.group}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {project ? <span className="truncate max-w-[150px] block" title={project.title}>{project.title}</span> : '-'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        ปกติ
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="แก้ไข">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>แสดง {filteredStudents.length} รายการ</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-brand-50/50 disabled:opacity-50">ก่อนหน้า</button>
            <button className="px-3 py-1 bg-brand-700 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-brand-50/50 disabled:opacity-50">ถัดไป</button>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-700">เพิ่มนักศึกษาใหม่</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักศึกษา</label>
                <input 
                  type="text" 
                  value={newStudent.studentId}
                  onChange={e => setNewStudent({...newStudent, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-สกุล</label>
                <input 
                  type="text" 
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input 
                  type="email" 
                  value={newStudent.email}
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">กลุ่ม</label>
                <select 
                  value={newStudent.group}
                  onChange={e => setNewStudent({...newStudent, group: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                >
                  <option value="กลุ่ม A">กลุ่ม A</option>
                  <option value="กลุ่ม B">กลุ่ม B</option>
                  <option value="กลุ่ม C">กลุ่ม C</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-gray-700 rounded-lg hover:bg-brand-50/50"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleAddStudent}
                className="px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
