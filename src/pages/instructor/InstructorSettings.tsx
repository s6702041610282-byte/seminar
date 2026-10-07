import React from 'react';
import { User, Bell, Shield, Eye, Save } from 'lucide-react';

const Toggle: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-700"></div>
  </label>
);

const InstructorSettings: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto font-sans space-y-6">
      <div className="page-hero flex justify-between items-end">
        <div>
          <h1 className="page-hero-title">ตั้งค่า</h1>
          <p className="page-hero-sub">จัดการข้อมูลส่วนตัวและการตั้งค่าการใช้งานระบบ</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors">
          <Save className="w-5 h-5 mr-2" />
          บันทึกการตั้งค่า
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <User className="w-5 h-5 mr-2 text-brand-700" />
            <h2 className="font-bold text-gray-800">ข้อมูลส่วนตัว</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-สกุล</label>
                <input type="text" defaultValue="อ.สมชาย ใจดี" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input type="email" defaultValue="somchai.j@kmutnb.ac.th" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                <input type="text" defaultValue="081-234-5678" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ห้องพักอาจารย์</label>
                <input type="text" defaultValue="อาคาร 81 ชั้น 6 ห้อง 605" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-brand-700" />
            <h2 className="font-bold text-gray-800">การแจ้งเตือน (Notifications)</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">แจ้งเตือนเมื่อนักศึกษาส่งงาน</p>
                <p className="text-xs text-gray-500 mt-0.5">รับการแจ้งเตือนทุกครั้งที่มีการอัปโหลดไฟล์หรือส่งรายงาน</p>
              </div>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">แจ้งเตือนความเสี่ยงโครงงาน</p>
                <p className="text-xs text-gray-500 mt-0.5">รับการแจ้งเตือนเมื่อโครงงานมี Risk Score อยู่ในระดับสูง</p>
              </div>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">แจ้งเตือนผ่านอีเมล</p>
                <p className="text-xs text-gray-500 mt-0.5">รับสรุปสถานะโครงงานประจำสัปดาห์ทางอีเมล</p>
              </div>
              <Toggle defaultChecked={false} />
            </div>
          </div>
        </div>

        {/* Assessment Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-brand-700" />
            <h2 className="font-bold text-gray-800">การประเมินและการแสดงผล</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">แสดงคะแนนแก่นักศึกษา</p>
                <p className="text-xs text-gray-500 mt-0.5">อนุญาตให้นักศึกษาเห็นคะแนน Weekly Progress ทันทีที่ประเมินเสร็จ</p>
              </div>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">แสดงความคิดเห็น (Feedback) เสมอ</p>
                <p className="text-xs text-gray-500 mt-0.5">บังคับให้ต้องกรอกข้อเสนอแนะทุกครั้งที่ประเมินคะแนนน้อยกว่า 50%</p>
              </div>
              <Toggle defaultChecked={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettings;
