import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Globe, Save } from 'lucide-react';
import { students } from '../../data/mockData';

const StudentSettings = () => {
  const studentId = 's6501001';
  const student = students.find(s => s.id === studentId);
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [lineNotif, setLineNotif] = useState(false);
  const [systemNotif, setSystemNotif] = useState(true);
  
  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button 
      type="button" 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">ตั้งค่า</h1>
        <p className="page-hero-sub">Settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
            <div className="p-6 flex flex-col items-center border-b border-gray-100">
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{student?.name || 'Student Name'}</h3>
              <p className="text-sm text-gray-500">{student?.id || studentId}</p>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center text-sm py-2">
                <span className="text-gray-500">กลุ่มเรียน</span>
                <span className="font-medium text-gray-900">กลุ่มที่ 1</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2">
                <span className="text-gray-500">สถานะ</span>
                <span className="font-medium text-green-600">กำลังศึกษา</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-400" />
              การแจ้งเตือน
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">การแจ้งเตือนผ่านอีเมล</h4>
                  <p className="text-xs text-gray-500 mt-1">รับการแจ้งเตือนกำหนดส่งงานและข้อเสนอแนะทางอีเมล</p>
                </div>
                <Toggle checked={emailNotif} onChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">การแจ้งเตือนผ่านระบบ</h4>
                  <p className="text-xs text-gray-500 mt-1">แสดงการแจ้งเตือนบนหน้าเว็บ</p>
                </div>
                <Toggle checked={systemNotif} onChange={setSystemNotif} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">การแจ้งเตือนผ่าน LINE (Coming soon)</h4>
                  <p className="text-xs text-gray-500 mt-1">รับข้อความแจ้งเตือนผ่าน LINE Notify</p>
                </div>
                <Toggle checked={lineNotif} onChange={setLineNotif} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              การแสดงผล
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">ภาษา (Language)</h4>
                  <p className="text-xs text-gray-500 mt-1">เลือกภาษาที่ใช้แสดงผลในระบบ</p>
                </div>
                <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500 p-2 border">
                  <option value="th">ไทย</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
              <Save className="w-4 h-4" />
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
