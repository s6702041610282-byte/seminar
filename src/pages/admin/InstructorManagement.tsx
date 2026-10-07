import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { instructors as mockInstructors, projects } from '../../data/mockData';
import { Instructor } from '../../types';

const InstructorManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInstructor, setNewInstructor] = useState<Partial<Instructor>>({
    instructorId: '',
    name: '',
    email: '',
    phone: '',
    department: 'วิศวกรรมคอมพิวเตอร์',
    position: 'อาจารย์'
  });

  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    instructor.instructorId.includes(searchTerm)
  );

  const handleAddInstructor = () => {
    if (!newInstructor.instructorId || !newInstructor.name) return;

    const instructorToAdd: Instructor = {
      id: `i${newInstructor.instructorId}`,
      instructorId: newInstructor.instructorId,
      name: newInstructor.name,
      email: newInstructor.email || `${newInstructor.instructorId}@kmutnb.ac.th`,
      phone: newInstructor.phone,
      department: newInstructor.department || 'วิศวกรรมคอมพิวเตอร์',
      position: newInstructor.position || 'อาจารย์'
    };

    mockInstructors.push(instructorToAdd);
    setInstructors([...mockInstructors]);
    setIsAddModalOpen(false);
    setNewInstructor({ instructorId: '', name: '', email: '', phone: '', department: 'วิศวกรรมคอมพิวเตอร์', position: 'อาจารย์' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="page-hero flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-hero-title">จัดการอาจารย์</h1>
          <p className="page-hero-sub">จัดการข้อมูลอาจารย์ที่ปรึกษาและผู้สอน</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มอาจารย์
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ค้นหารหัสอาจารย์, ชื่อ-สกุล..." 
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
                <th className="p-4 font-medium">รหัสอาจารย์</th>
                <th className="p-4 font-medium">ชื่อ-สกุล</th>
                <th className="p-4 font-medium">ตำแหน่ง</th>
                <th className="p-4 font-medium">อีเมล</th>
                <th className="p-4 font-medium">โทรศัพท์</th>
                <th className="p-4 font-medium text-center">โครงงานที่ดูแล</th>
                <th className="p-4 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredInstructors.map((instructor, index) => {
                const managedProjects = projects.filter(p => p.advisorId === instructor.id).length;
                return (
                  <tr key={instructor.id} className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors">
                    <td className="p-4 text-center text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{instructor.instructorId}</td>
                    <td className="p-4">{instructor.name}</td>
                    <td className="p-4 text-gray-600">{instructor.position || 'อาจารย์ประจำ'}</td>
                    <td className="p-4 text-gray-500">{instructor.email}</td>
                    <td className="p-4 text-gray-500">{instructor.phone || '-'}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-medium">
                        {managedProjects}
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
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-700">เพิ่มอาจารย์ใหม่</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสอาจารย์</label>
                <input 
                  type="text" 
                  value={newInstructor.instructorId}
                  onChange={e => setNewInstructor({...newInstructor, instructorId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-สกุล</label>
                <input 
                  type="text" 
                  value={newInstructor.name}
                  onChange={e => setNewInstructor({...newInstructor, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                <input 
                  type="text" 
                  value={newInstructor.position}
                  onChange={e => setNewInstructor({...newInstructor, position: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input 
                  type="email" 
                  value={newInstructor.email}
                  onChange={e => setNewInstructor({...newInstructor, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์</label>
                <input 
                  type="text" 
                  value={newInstructor.phone}
                  onChange={e => setNewInstructor({...newInstructor, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                />
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
                onClick={handleAddInstructor}
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

export default InstructorManagement;
