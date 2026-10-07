import { useState } from 'react';
import { CheckCircle, CircleX, FileText, Inbox, Hourglass, ClipboardCheck } from 'lucide-react';
import { useApprovalQueue, workflow, STEP_CONFIG, formatFileSize, formatThaiDateTime, type ApprovalItem } from '../../data/workflowStore';
import { useAuth } from '../../contexts/AuthContext';
import { PROJECT_STEPS } from '../../types';

export default function ApprovalCenter() {
  const { user } = useAuth();
  const reviewer = user?.name || 'อาจารย์';
  const queue = useApprovalQueue();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [doneMsg, setDoneMsg] = useState('');

  const keyOf = (i: ApprovalItem) => `${i.studentId}-${i.stepNo}`;
  const selected = queue.find(i => keyOf(i) === selectedKey) || queue[0];

  const select = (i: ApprovalItem) => {
    setSelectedKey(keyOf(i));
    setComment('');
    setError('');
    setDoneMsg('');
  };

  const approve = () => {
    if (!selected) return;
    workflow.approve(selected.studentId, selected.stepNo, reviewer, comment.trim() || undefined);
    setDoneMsg(`อนุมัติ "${PROJECT_STEPS[selected.stepNo - 1]}" ของ ${selected.studentName} แล้ว`);
    setSelectedKey(null);
    setComment('');
  };

  const reject = () => {
    if (!selected) return;
    if (!comment.trim()) {
      setError('กรุณาระบุสิ่งที่ต้องแก้ไข เพื่อให้นักศึกษาแก้ได้ตรงจุด');
      return;
    }
    workflow.reject(selected.studentId, selected.stepNo, reviewer, comment.trim());
    setDoneMsg(`ส่งกลับให้ ${selected.studentName} แก้ไขแล้ว`);
    setSelectedKey(null);
    setComment('');
    setError('');
  };

  const cfg = selected ? STEP_CONFIG[selected.stepNo - 1] : undefined;

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">คำขออนุมัติ</h1>
        <p className="page-hero-sub">ตรวจและอนุมัติขั้นตอนการดำเนินโครงงานของนักศึกษา</p>
      </div>

      {doneMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="w-4 h-4" /> {doneMsg}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-12 text-center">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-800">ไม่มีคำขอที่รออนุมัติ</p>
          <p className="text-sm text-slate-500 mt-1">เมื่อนักศึกษาส่งงานในแต่ละขั้นตอน คำขอจะแสดงที่นี่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden h-fit">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">รอดำเนินการ</h2>
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-sm font-semibold text-brand-700">{queue.length}</span>
            </div>
            <ul>
              {queue.map(i => {
                const active = selected && keyOf(i) === keyOf(selected);
                return (
                  <li key={keyOf(i)}>
                    <button type="button" onClick={() => select(i)}
                      className={`w-full text-left px-5 py-4 border-b border-slate-100 ${active ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
                      <p className="font-semibold text-slate-900">{i.studentName}</p>
                      <p className="text-sm text-slate-600">ขั้นที่ {i.stepNo}: {PROJECT_STEPS[i.stepNo - 1]}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-amber-700">
                        <Hourglass className="w-3.5 h-3.5" />
                        {i.kind === 'staff' ? 'รออาจารย์ดำเนินการ' : `ส่งเมื่อ ${formatThaiDateTime(i.record.submittedAt)}`}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          {selected && cfg && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <p className="text-sm text-slate-500">{selected.studentName} · {selected.projectTitle}</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">ขั้นที่ {selected.stepNo}: {cfg.title}</h2>
              </div>

              <div className="p-6 space-y-5">
                {selected.kind === 'staff' ? (
                  <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <ClipboardCheck className="w-5 h-5 shrink-0 text-brand-600" />
                    <p>ขั้นตอนนี้อาจารย์เป็นผู้ดำเนินการ ตรวจสอบข้อมูลของนักศึกษาแล้วกดอนุมัติเพื่อเปิดขั้นตอนถัดไป</p>
                  </div>
                ) : (
                  <>
                    {cfg.fields.map(f => (
                      <div key={f.key}>
                        <p className="text-sm font-semibold text-slate-700 mb-1">{f.label}</p>
                        <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-800 whitespace-pre-wrap">{selected.record.fields[f.key] || '-'}</p>
                      </div>
                    ))}
                    {cfg.fileLabel && (
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">{cfg.fileLabel}</p>
                        {selected.record.files.length === 0 ? <p className="text-sm text-slate-400">ไม่มีไฟล์แนบ</p> : (
                          <ul className="space-y-2">
                            {selected.record.files.map(f => (
                              <li key={f.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                <FileText className="w-4 h-4 text-brand-600" />
                                <span className="truncate text-slate-800">{f.name}</span>
                                <span className="ml-auto shrink-0 text-xs text-slate-400">{formatFileSize(f.size)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label htmlFor="review-comment" className="block text-sm font-semibold text-slate-700 mb-1.5">ความเห็นถึงนักศึกษา</label>
                  <textarea id="review-comment" rows={3} value={comment} onChange={e => { setComment(e.target.value); setError(''); }}
                    placeholder="ไม่บังคับเมื่ออนุมัติ / จำเป็นเมื่อส่งกลับให้แก้ไข"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                  {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-slate-100 pt-5">
                  {selected.kind === 'submission' && (
                    <button type="button" onClick={reject}
                      className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white text-sm font-semibold text-red-700 hover:bg-red-50">
                      <CircleX className="w-4 h-4" /> ส่งกลับให้แก้ไข
                    </button>
                  )}
                  <button type="button" onClick={approve}
                    className="h-10 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
                    <CheckCircle className="w-4 h-4" /> อนุมัติ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
