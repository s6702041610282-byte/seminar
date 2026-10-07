import React from 'react';
import { notifications } from '../../data/mockData';
import { Bell, Check, Info, AlertCircle, FileText } from 'lucide-react';

const MyNotifications = () => {
  const studentNotifications = notifications.filter(n => n.targetRole === 'student');

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Info className="w-5 h-5 text-brand-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'submission': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-hero flex justify-between items-end">
        <div>
          <h1 className="page-hero-title">การแจ้งเตือน</h1>
          <p className="page-hero-sub">Notifications</p>
        </div>
        <button className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
          <Check className="w-4 h-4" />
          ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {studentNotifications.map((notif) => (
            <div key={notif.id} className={`p-4 sm:p-6 hover:bg-brand-50/50 transition-colors flex gap-4 ${notif.isRead ? 'opacity-70' : 'bg-brand-50/30'}`}>
              <div className="mt-1 flex-shrink-0">
                <div className={`p-2 rounded-full ${notif.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-semibold text-sm sm:text-base ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notif.date}</span>
                </div>
                <p className="text-sm text-gray-600">{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
          {studentNotifications.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              <Bell className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p>ไม่มีการแจ้งเตือน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNotifications;
