import React, { useState } from 'react';
import { FileText, Download, Upload, Search, X, AlertCircle, Trash2 } from 'lucide-react';

const MyDocuments = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ round: 'Proposal', type: 'report' });
  const [myDocs, setMyDocs] = useState([
    { id: '1', name: 'Proposal_Report.pdf', type: 'report', round: 'Proposal', uploadDate: '2024-09-25', status: 'approved', size: '2.4 MB' },
    { id: '2', name: 'Proposal_Slides.pdf', type: 'slide', round: 'Proposal', uploadDate: '2024-10-06', status: 'pending', size: '1.2 MB' }
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setMyDocs([{
      id: Date.now().toString(),
      name: `Mock_${uploadData.type}_${uploadData.round}.pdf`,
      type: uploadData.type,
      round: uploadData.round,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      size: '1.5 MB'
    }, ...myDocs]);
    setShowUpload(false);
  };

  const handleUnsubmit = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการส่งเอกสารนี้?')) {
      setMyDocs(myDocs.filter(d => d.id !== id));
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'approved') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">อนุมัติแล้ว</span>;
    if (status === 'pending') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">รอตรวจ</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">แก้ไข</span>;
  };

  return (
    <div className="space-y-6 relative">
      <div className="page-hero flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-hero-title">เอกสารของฉัน</h1>
          <p className="page-hero-sub">My Documents</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>อัปโหลดเอกสาร</span>
        </button>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">อัปโหลดเอกสารใหม่</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รอบการนำเสนอ</label>
                <select 
                  value={uploadData.round}
                  onChange={e => setUploadData({...uploadData, round: e.target.value})}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500"
                >
                  <option value="Proposal">Proposal</option>
                  <option value="Progress">Progress</option>
                  <option value="Pre-Final">Pre-Final</option>
                  <option value="Final">Final</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทไฟล์</label>
                <select 
                  value={uploadData.type}
                  onChange={e => setUploadData({...uploadData, type: e.target.value})}
                  className="w-full border-gray-300 rounded-lg p-2.5 border focus:border-brand-500 focus:ring-brand-500/30 focus:border-brand-500"
                >
                  <option value="report">เอกสารรายงาน</option>
                  <option value="slide">สไลด์นำเสนอ</option>
                </select>
                {uploadData.type === 'slide' && (
                  <p className="mt-2 text-xs text-orange-600 flex items-start gap-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>คำเตือน: ต้องอัปโหลดสไลด์นำเสนอก่อนวันนำเสนอจริงอย่างน้อย 1 วัน</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เลือกไฟล์</label>
                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">อัปโหลด</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="ค้นหาเอกสาร..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อไฟล์</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รอบนำเสนอ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ส่ง</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-brand-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">ขนาด: {doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {doc.round}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.type === 'report' ? 'เอกสารรายงาน' : 'สไลด์นำเสนอ'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-brand-600 hover:text-brand-900 p-1 bg-brand-50 hover:bg-brand-100 rounded" title="ดาวน์โหลด">
                        <Download className="w-4 h-4" />
                      </button>
                      {doc.status === 'pending' && (
                        <button 
                          onClick={() => handleUnsubmit(doc.id)}
                          className="text-red-600 hover:text-red-900 p-1 bg-red-50 hover:bg-red-100 rounded" 
                          title="ยกเลิกการส่ง"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {myDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                    ไม่พบเอกสาร
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
