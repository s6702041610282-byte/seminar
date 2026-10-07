import React, { useState, useRef } from 'react';
import { getStudentProject, getStudentWeeklyScores, getStudentPresentations, getStudentFeedback, documents, instructors } from '../../data/mockData';
import { PROJECT_STEPS } from '../../types';
import {
  CheckCircle, Clock, User, FileText, Send, BookOpen, Calendar, ChevronRight, ChevronLeft, MessageSquare,
  Lock, Paperclip, Save, Undo2, CircleX, Hourglass, RotateCcw, X,
} from 'lucide-react';
import {
  useWorkflow, workflow, currentStepOf, STEP_CONFIG, formatFileSize, formatThaiDateTime,
  type StepFile, type StepRecord,
} from '../../data/workflowStore';
import { useAuth } from '../../contexts/AuthContext';

const TOTAL = PROJECT_STEPS.length;

const stateBadge: Record<string, { label: string; cls: string }> = {
  approved: { label: 'อนุมัติแล้ว', cls: 'bg-green-50 text-green-700' },
  pending: { label: 'รออาจารย์ตรวจ', cls: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'ส่งกลับให้แก้ไข', cls: 'bg-red-50 text-red-700' },
  draft: { label: 'กำลังดำเนินการ', cls: 'bg-brand-50 text-brand-700' },
  locked: { label: 'ยังไม่เปิด', cls: 'bg-slate-100 text-slate-500' },
};

const historyLabel: Record<string, string> = {
  save: 'บันทึกร่าง', submit: 'ส่งให้อาจารย์ตรวจ', withdraw: 'ดึงกลับมาแก้ไข',
  approve: 'อนุมัติ', reject: 'ส่งกลับให้แก้ไข', reset: 'เริ่มใหม่',
};

const MyProject = () => {
  const studentId = 's6501001';
  const { user } = useAuth();
  const actor = user?.name || 'นักศึกษา';
  const project = getStudentProject(studentId);
  const weeklyScores = getStudentWeeklyScores(studentId);
  const presentations = getStudentPresentations(studentId);
  const feedbacks = getStudentFeedback(studentId);
  const wf = useWorkflow(studentId);
  const currentStep = currentStepOf(wf);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const activeStep = selected ?? Math.min(currentStep, TOTAL);
  const approvedCount = wf.steps.filter(s => s.state === 'approved').length;
  const progress = Math.round((approvedCount / TOTAL) * 100);


  if (!project) return <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลโครงงาน</div>;

  // แสดงเฉพาะข้อมูลที่อาจารย์อนุมัติแล้ว
  const approvedTitle = wf.steps[0].state === 'approved' ? (wf.steps[0].fields.titleTh || project.title) : '';
  const approvedAdvisor = wf.steps[2].state === 'approved' ? (wf.steps[2].fields.advisor || project.advisorName) : '';

  const selectStep = (n: number) => {
    setSelected(n);
    requestAnimationFrame(() => workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="space-y-6 relative">
      <div className="page-hero">
        <h1 className="page-hero-title">โครงงานของฉัน</h1>
        <p className="page-hero-sub">My Project</p>
      </div>

      {/* Status Banner */}
      <div className="bg-brand-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-brand-200 text-sm mb-1">ขั้นตอนปัจจุบัน</p>
            <h2 className="text-2xl font-bold mb-1">{currentStep > TOTAL ? 'ดำเนินการครบทุกขั้นตอน' : PROJECT_STEPS[currentStep - 1]}</h2>
            <p className="text-brand-200 text-sm">อนุมัติแล้ว {approvedCount} จาก {TOTAL} ขั้นตอน</p>
            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-brand-200"><BookOpen className="w-4 h-4" />ชื่อโครงงาน</dt>
                <dd className="mt-0.5 font-semibold text-white min-h-[1.25rem]">{approvedTitle}</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-brand-200"><User className="w-4 h-4" />อาจารย์ที่ปรึกษา</dt>
                <dd className="mt-0.5 font-semibold text-white min-h-[1.25rem]">{approvedAdvisor}</dd>
              </div>
            </dl>
          </div>
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-brand-300" strokeWidth="8"
                strokeDasharray={`${(progress / 100) * 264} 264`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div ref={workspaceRef} className="lg:col-span-2 space-y-6 scroll-mt-6">
          <StepWorkspace
            key={`${activeStep}-${wf.steps[activeStep - 1].state}-${wf.steps[activeStep - 1].history.length}`}
            stepNo={activeStep}
            record={wf.steps[activeStep - 1]}
            studentId={studentId}
            actor={actor}
            onNavigate={selectStep}
            canNavigate={n => n >= 1 && n <= TOTAL}
            extras={<StepResults stepNo={activeStep} studentId={studentId} presentations={presentations} weeklyScores={weeklyScores} feedbacks={feedbacks} show={wf.steps[activeStep - 1].state === 'approved'} />}
          />

        </div>

        {/* Vertical Stepper */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6">ขั้นตอนการดำเนินงาน</h3>
          <div>
            {PROJECT_STEPS.map((step, index) => {
              const n = index + 1;
              const rec = wf.steps[index];
              const isActive = n === activeStep;
              const dot =
                rec.state === 'approved' ? 'bg-brand-500 border-brand-500 text-white'
                : rec.state === 'pending' ? 'bg-amber-50 border-amber-400 text-amber-600'
                : rec.state === 'rejected' ? 'bg-red-50 border-red-400 text-red-600'
                : rec.state === 'draft' ? 'bg-white border-brand-500 text-brand-700'
                : 'bg-white border-gray-200 text-gray-300';
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${dot}`}>
                      {rec.state === 'approved' ? <CheckCircle className="w-4 h-4" />
                        : rec.state === 'pending' ? <Hourglass className="w-4 h-4" />
                        : rec.state === 'rejected' ? <CircleX className="w-4 h-4" />
                        : rec.state === 'locked' ? <Lock className="w-3.5 h-3.5" />
                        : <span className="text-xs font-bold">{n}</span>}
                    </div>
                    {index < TOTAL - 1 && <div className={`w-0.5 flex-1 min-h-8 ${rec.state === 'approved' ? 'bg-brand-300' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => selectStep(n)}
                      aria-pressed={isActive}
                      className={`group w-full flex items-start justify-between gap-2 text-left rounded-lg -mx-2 px-2 py-1 ${isActive ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'}`}
                    >
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold leading-tight ${rec.state === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>{step}</span>
                        <span className={`text-xs ${rec.state === 'pending' ? 'text-amber-600' : rec.state === 'rejected' ? 'text-red-600' : 'text-gray-400'}`}>
                          {stateBadge[rec.state].label}
                        </span>
                      </span>
                      <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-brand-600' : 'text-gray-300 group-hover:text-gray-500'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {import.meta.env.DEV && <div className="mt-2 border-t border-slate-100 pt-4">
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
                <RotateCcw className="w-3.5 h-3.5" /> เริ่มขั้นตอนใหม่ตั้งแต่ขั้นที่ 1 (โหมดสาธิต)
              </button>
            ) : (
              <div className="text-xs text-slate-600 space-y-2">
                <p>ข้อมูลที่กรอกไว้ทุกขั้นจะถูกล้าง ยืนยันหรือไม่?</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { workflow.resetDemo(studentId); setSelected(null); setConfirmReset(false); }}
                    className="h-8 px-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">ล้างและเริ่มใหม่</button>
                  <button type="button" onClick={() => setConfirmReset(false)}
                    className="h-8 px-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50">ยกเลิก</button>
                </div>
              </div>
            )}
          </div>}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sub components ---------------- */

interface WorkspaceProps {
  stepNo: number;
  record: StepRecord;
  studentId: string;
  actor: string;
  onNavigate: (n: number) => void;
  canNavigate: (n: number) => boolean;
  extras?: React.ReactNode;
}

function StepWorkspace({ stepNo, record, studentId, actor, onNavigate, canNavigate, extras }: WorkspaceProps) {
  const cfg = STEP_CONFIG[stepNo - 1];
  const [fields, setFields] = useState<Record<string, string>>(record.fields);
  const [files, setFiles] = useState<StepFile[]>(record.files);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedMsg, setSavedMsg] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const isStudentStep = cfg.actor === 'student';
  const editable = isStudentStep && (record.state === 'draft' || record.state === 'rejected');
  const badge = cfg.actor === 'staff' && record.state === 'draft'
    ? { label: 'รออาจารย์ดำเนินการ', cls: 'bg-amber-50 text-amber-700' }
    : stateBadge[record.state];

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const added = Array.from(list).map(f => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name, size: f.size, uploadedAt: new Date().toISOString(),
    }));
    setFiles(prev => [...prev, ...added]);
  };

  const validate = () => {
    const errs: string[] = [];
    cfg.fields.forEach(f => { if (f.required && !(fields[f.key] || '').trim()) errs.push(`กรุณากรอก "${f.label}"`); });
    if (cfg.fileRequired && files.length === 0) errs.push(`กรุณาแนบ${cfg.fileLabel || 'ไฟล์'}`);
    return errs;
  };

  const onSave = () => {
    workflow.saveDraft(studentId, stepNo, fields, files, actor);
    setSavedMsg('บันทึกร่างแล้ว');
  };

  const onSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length === 0) workflow.submit(studentId, stepNo, fields, files, actor);
  };

  const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

  return (
    <>
    <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold ${record.state === 'approved' ? 'bg-brand-100 text-brand-700' : record.state === 'locked' ? 'bg-slate-100 text-slate-400' : 'bg-brand-600 text-white'}`}>
            {record.state === 'approved' ? <CheckCircle className="w-6 h-6" /> : stepNo}
          </div>
          <div>
            <p className="text-sm text-slate-500">ขั้นตอนที่ {stepNo} จาก {TOTAL}</p>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">{cfg.title}</h2>
            <span className={`mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium ${badge.cls}`}>{badge.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" disabled={!canNavigate(stepNo - 1)} onClick={() => onNavigate(stepNo - 1)}
            className="h-9 px-3 inline-flex items-center gap-1 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />ก่อนหน้า
          </button>
          <button type="button" disabled={!canNavigate(stepNo + 1)} onClick={() => onNavigate(stepNo + 1)}
            className="h-9 px-3 inline-flex items-center gap-1 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ถัดไป<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* State message */}
        {record.state === 'approved' && (
          <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">อนุมัติแล้ว{record.reviewer ? ` โดย ${record.reviewer}` : ''}</p>
              {record.reviewedAt && <p className="text-green-700">{formatThaiDateTime(record.reviewedAt)}</p>}
              {record.comment && record.comment !== 'อนุมัติ' && <p className="mt-1 text-green-800">ความเห็น: {record.comment}</p>}
            </div>
          </div>
        )}
        {record.state === 'pending' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <div className="flex gap-3">
              <Hourglass className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">ส่งแล้ว รออาจารย์ตรวจ</p>
                <p className="text-amber-700">ส่งเมื่อ {formatThaiDateTime(record.submittedAt)}</p>
              </div>
            </div>
            <button type="button" onClick={() => workflow.withdraw(studentId, stepNo, actor)}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white text-sm font-medium text-amber-800 hover:bg-amber-100">
              <Undo2 className="w-4 h-4" /> ดึงกลับมาแก้ไข
            </button>
          </div>
        )}
        {record.state === 'rejected' && (
          <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <CircleX className="w-5 h-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">อาจารย์ส่งกลับให้แก้ไข{record.reviewer ? ` (${record.reviewer})` : ''}</p>
              {record.comment && <p className="mt-1 text-red-800">“{record.comment}”</p>}
              <p className="mt-1 text-red-700">แก้ไขข้อมูลด้านล่างแล้วกดส่งอีกครั้ง</p>
            </div>
          </div>
        )}
        {record.state === 'locked' && (
          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <Lock className="w-5 h-5 shrink-0 text-slate-400" />
            <p>ขั้นตอนนี้จะเปิดให้ดำเนินการเมื่อขั้นตอนก่อนหน้าได้รับการอนุมัติแล้ว</p>
          </div>
        )}
        {cfg.actor === 'staff' && record.state === 'draft' && (
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <Clock className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-amber-800">ขั้นตอนนี้อาจารย์เป็นผู้ดำเนินการ เมื่ออาจารย์อนุมัติแล้ว ระบบจะเปิดขั้นตอนถัดไปให้อัตโนมัติ</p>
          </div>
        )}

        <p className="text-sm text-slate-600">{cfg.description}</p>

        {/* Form / read-only data */}
        {isStudentStep && record.state !== 'locked' && (
          <div className="space-y-5">
            {cfg.fields.map(f => (
              <div key={f.key}>
                <label htmlFor={`f-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {f.label}{f.required && editable && <span className="text-red-500"> *</span>}
                </label>
                {editable ? (
                  f.type === 'textarea' ? (
                    <textarea id={`f-${f.key}`} rows={4} className={inputCls} placeholder={f.placeholder}
                      value={fields[f.key] || ''} onChange={e => setFields({ ...fields, [f.key]: e.target.value })} />
                  ) : f.type === 'select-instructor' ? (
                    <select id={`f-${f.key}`} className={inputCls} value={fields[f.key] || ''} onChange={e => setFields({ ...fields, [f.key]: e.target.value })}>
                      <option value="">เลือกอาจารย์</option>
                      {instructors.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                    </select>
                  ) : (
                    <input id={`f-${f.key}`} type={f.type === 'date' ? 'date' : 'text'} className={inputCls} placeholder={f.placeholder}
                      value={fields[f.key] || ''} onChange={e => setFields({ ...fields, [f.key]: e.target.value })} />
                  )
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-800 whitespace-pre-wrap min-h-[2.5rem]">{record.fields[f.key] || <span className="text-slate-400">-</span>}</p>
                )}
              </div>
            ))}

            {cfg.fileLabel && (
              <div>
                <p className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {cfg.fileLabel}{cfg.fileRequired && editable && <span className="text-red-500"> *</span>}
                </p>
                {files.length > 0 ? (
                  <ul className="space-y-2 mb-2">
                    {files.map(f => (
                      <li key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2">
                        <span className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 shrink-0 text-brand-600" />
                          <span className="truncate text-sm text-slate-800">{f.name}</span>
                          <span className="shrink-0 text-xs text-slate-400">{formatFileSize(f.size)}</span>
                        </span>
                        {editable && (
                          <button type="button" aria-label={`ลบไฟล์ ${f.name}`} onClick={() => setFiles(files.filter(x => x.id !== f.id))}
                            className="p-1 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"><X className="w-4 h-4" /></button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : !editable && <p className="text-sm text-slate-400 mb-2">ไม่มีไฟล์แนบ</p>}
                {editable && (
                  <>
                    <input ref={fileInput} type="file" multiple className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
                    <button type="button" onClick={() => fileInput.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600 hover:border-brand-400 hover:bg-brand-50/40">
                      <Paperclip className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">คลิกเพื่อเลือกไฟล์</span>
                      <span className="text-xs text-slate-400">PDF, DOCX, PPTX หรือรูปภาพ</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {errors.length > 0 && (
          <ul className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 list-disc list-inside space-y-0.5">
            {errors.map(e => <li key={e}>{e}</li>)}
          </ul>
        )}

        {editable && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 border-t border-slate-100 pt-5">
            {savedMsg && <span className="text-sm text-green-700 sm:mr-auto">{savedMsg}</span>}
            <button type="button" onClick={onSave}
              className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Save className="w-4 h-4" /> บันทึกร่าง
            </button>
            <button type="button" onClick={onSubmit}
              className="h-10 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
              <Send className="w-4 h-4" /> {record.state === 'rejected' ? 'ส่งอีกครั้ง' : 'ส่งให้อาจารย์ตรวจ'}
            </button>
          </div>
        )}

        {extras}

        {/* History */}
        {record.history.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-2">ประวัติของขั้นตอนนี้</h3>
            <ol className="space-y-1.5 text-sm">
              {[...record.history].reverse().map((h, i) => (
                <li key={i} className="flex flex-wrap gap-x-2 text-slate-600">
                  <span className="text-slate-400 w-40 shrink-0">{formatThaiDateTime(h.at)}</span>
                  <span className="font-medium text-slate-800">{historyLabel[h.action]}</span>
                  <span>โดย {h.by}</span>
                  {h.note && <span className="text-slate-500">— {h.note}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>

    </>
  );
}

/* ผลการประเมินจากข้อมูลเดิม (แสดงเมื่อขั้นตอนอนุมัติแล้ว) */
function StepResults({ stepNo, studentId, presentations, weeklyScores, feedbacks, show }: {
  stepNo: number; studentId: string; show: boolean;
  presentations: ReturnType<typeof getStudentPresentations>;
  weeklyScores: ReturnType<typeof getStudentWeeklyScores>;
  feedbacks: ReturnType<typeof getStudentFeedback>;
}) {
  if (!show) return null;
  const docTypesByStep: Record<number, string[]> = {
    1: ['proposal'], 4: ['approval_doc'], 6: ['progress_report'], 9: ['prefinal_report'],
    11: ['revision_doc'], 12: ['final_report', 'project_book'], 13: ['approval_doc', 'assessment_form'],
  };
  const presStatusLabel: Record<string, string> = {
    passed_excellent: 'ผ่าน (ดีเยี่ยม)', passed: 'ผ่าน', passed_conditional: 'ผ่านแบบมีเงื่อนไข', failed: 'ไม่ผ่าน', not_assessed: 'ยังไม่ประเมิน',
  };
  const rubricLabels: Record<string, string> = { content: 'เนื้อหา', accuracy: 'ความถูกต้อง', analysis: 'การวิเคราะห์', qa: 'การตอบคำถาม', presentation: 'การนำเสนอ' };
  const weeklyStatusLabel: Record<string, string> = { on_time: 'ตรงเวลา', late: 'ล่าช้า', not_submitted: 'ไม่ได้ส่ง' };
  const docStatusLabel: Record<string, string> = { pending: 'รอตรวจ', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ', revision_needed: 'ต้องแก้ไข' };

  const docs = documents.filter(d => d.studentId === studentId && (docTypesByStep[stepNo] || []).includes(d.type));
  const pres = stepNo >= 7 && stepNo <= 10 ? presentations.find(p => p.presentationNumber === stepNo - 6) : undefined;
  const weekly = stepNo === 6 ? weeklyScores : [];
  const fb = pres ? feedbacks.filter(f => f.type === 'presentation' && f.presentationNumber === pres.presentationNumber)
    : stepNo === 6 ? feedbacks.filter(f => f.type === 'weekly') : [];
  if (!pres && weekly.length === 0 && docs.length === 0 && fb.length === 0) return null;

  return (
    <div className="space-y-6 border-t border-slate-100 pt-6">
      {pres && (
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-3">ผลการประเมินการนำเสนอ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">คะแนนรวม</p>
              <p className="text-4xl font-bold text-slate-900 mt-1">{pres.totalScore}<span className="text-lg font-medium text-slate-400">/25</span></p>
              <p className="text-sm text-slate-600 mt-1">{pres.percentage.toFixed(1)}% · {presStatusLabel[pres.status] || pres.status}</p>
            </div>
            <div className="md:col-span-2 rounded-xl border border-slate-200 p-5 space-y-3">
              {Object.entries(pres.rubric).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{rubricLabels[k] || k}</span><span className="font-semibold text-slate-900">{v}/5</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${(Number(v) / 5) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          {pres.feedback && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700"><span className="font-semibold">ความเห็นกรรมการ: </span>{pres.feedback}</p>}
        </section>
      )}

      {weekly.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-3">คะแนนความก้าวหน้ารายสัปดาห์</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-4 py-3 font-semibold">สัปดาห์</th><th className="px-4 py-3 font-semibold">การส่ง</th><th className="px-4 py-3 font-semibold text-right">คะแนน</th>
              </tr></thead>
              <tbody>
                {weekly.map(w => (
                  <tr key={w.id} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{w.week}</td>
                    <td className="px-4 py-2.5"><span className={`whitespace-nowrap text-xs font-medium rounded-md px-2 py-0.5 ${w.submissionStatus === 'on_time' ? 'bg-green-50 text-green-700' : w.submissionStatus === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{weeklyStatusLabel[w.submissionStatus]}</span></td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">{w.totalScore}/30 <span className="text-slate-400 font-normal">({w.percentage.toFixed(0)}%)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {docs.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-3">เอกสารในระบบเดิม</h3>
          <div className="space-y-2">
            {docs.map(d => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 shrink-0 text-brand-600" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{d.name}</p>
                    <p className="text-xs text-slate-500">ส่งเมื่อ {d.uploadDate} · {d.fileSize} · ฉบับที่ {d.version}</p>
                  </div>
                </div>
                <span className="text-xs font-medium rounded-md px-2 py-1 bg-slate-100 text-slate-700">{docStatusLabel[d.status] || d.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {fb.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-3">Feedback จากอาจารย์</h3>
          <div className="space-y-2">
            {fb.map(f => (
              <div key={f.id} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                <MessageSquare className="w-5 h-5 shrink-0 text-brand-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-800">{f.content}</p>
                  <p className="text-xs text-slate-400 mt-1">{f.instructorName} · {f.date}{f.week ? ` · สัปดาห์ที่ ${f.week}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyProject;
