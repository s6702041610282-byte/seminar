import { useSyncExternalStore } from 'react';
import { PROJECT_STEPS } from '../types';
import { getStudentProject, students } from './mockData';

/* ==========================================================
   Workflow Store — ขั้นตอนการดำเนินโครงงานแบบ One-stop Service
   เก็บข้อมูลใน localStorage (ระหว่างยังไม่มี Back-end)
   ใช้ร่วมกันระหว่างหน้าของนักศึกษาและอาจารย์
   ========================================================== */

export type StepState = 'locked' | 'draft' | 'pending' | 'approved' | 'rejected';

export interface StepFile {
  id: string;
  name: string;
  size: number; // bytes
  uploadedAt: string; // ISO
}

export interface StepHistoryItem {
  at: string; // ISO
  by: string;
  action: 'save' | 'submit' | 'withdraw' | 'approve' | 'reject' | 'reset';
  note?: string;
}

export interface StepRecord {
  state: StepState;
  fields: Record<string, string>;
  files: StepFile[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewer?: string;
  comment?: string;
  history: StepHistoryItem[];
}

export interface StudentWorkflow {
  studentId: string;
  steps: StepRecord[]; // length 14
}

/* ---------- Step configuration ---------- */

export type FieldType = 'text' | 'textarea' | 'date' | 'select-instructor';

export interface StepField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
}

export interface StepConfig {
  title: string;
  /** student = นักศึกษากรอกข้อมูลแล้วส่งตรวจ, staff = อาจารย์ดำเนินการเอง */
  actor: 'student' | 'staff';
  description: string;
  fields: StepField[];
  fileLabel?: string;
  fileRequired?: boolean;
}

export const STEP_CONFIG: StepConfig[] = [
  {
    title: PROJECT_STEPS[0], actor: 'student',
    description: 'กรอกชื่อหัวข้อและรายละเอียดโครงงาน แนบไฟล์ข้อเสนอโครงงาน แล้วส่งให้อาจารย์พิจารณา',
    fields: [
      { key: 'titleTh', label: 'ชื่อหัวข้อโครงงาน (ภาษาไทย)', type: 'text', required: true },
      { key: 'titleEn', label: 'ชื่อหัวข้อโครงงาน (ภาษาอังกฤษ)', type: 'text', required: true },
      { key: 'abstract', label: 'ที่มาและรายละเอียดโดยย่อ', type: 'textarea', required: true, placeholder: 'ปัญหาที่ต้องการแก้ วัตถุประสงค์ และขอบเขตของโครงงาน' },
    ],
    fileLabel: 'ไฟล์ข้อเสนอโครงงาน (Proposal)', fileRequired: true,
  },
  {
    title: PROJECT_STEPS[1], actor: 'staff',
    description: 'อาจารย์ตรวจสอบความเหมาะสมของหัวข้อ ไม่ต้องส่งข้อมูลเพิ่มในขั้นนี้',
    fields: [],
  },
  {
    title: PROJECT_STEPS[2], actor: 'student',
    description: 'เลือกอาจารย์ที่ปรึกษาที่ต้องการ พร้อมเหตุผล แล้วส่งคำขอแต่งตั้ง',
    fields: [
      { key: 'advisor', label: 'อาจารย์ที่ปรึกษาที่ต้องการ', type: 'select-instructor', required: true },
      { key: 'reason', label: 'เหตุผล / ความเชี่ยวชาญที่เกี่ยวข้อง', type: 'textarea' },
    ],
  },
  {
    title: PROJECT_STEPS[3], actor: 'staff',
    description: 'อาจารย์พิจารณาอนุมัติโครงงาน ไม่ต้องส่งข้อมูลเพิ่มในขั้นนี้',
    fields: [],
  },
  {
    title: PROJECT_STEPS[4], actor: 'student',
    description: 'ส่งแผนการดำเนินงานของโครงงาน',
    fields: [
      { key: 'startDate', label: 'วันที่เริ่มดำเนินงาน', type: 'date', required: true },
      { key: 'plan', label: 'แผนการดำเนินงาน', type: 'textarea', required: true, placeholder: 'ขั้นตอนหลักและช่วงเวลาของแต่ละงาน' },
    ],
    fileLabel: 'ไฟล์แผนงาน (เช่น Gantt Chart)',
  },
  {
    title: PROJECT_STEPS[5], actor: 'student',
    description: 'สรุปความก้าวหน้าของโครงงานและแนบรายงานความก้าวหน้า',
    fields: [
      { key: 'summary', label: 'สรุปความก้าวหน้า', type: 'textarea', required: true },
      { key: 'issues', label: 'ปัญหาและอุปสรรค', type: 'textarea' },
    ],
    fileLabel: 'ไฟล์รายงานความก้าวหน้า', fileRequired: true,
  },
  ...[6, 7, 8, 9].map((i): StepConfig => ({
    title: PROJECT_STEPS[i], actor: 'student',
    description: 'ขอสอบนำเสนอ ระบุวันที่ต้องการและแนบสไลด์นำเสนอ',
    fields: [
      { key: 'requestDate', label: 'วันที่ต้องการสอบ', type: 'date', required: true },
      { key: 'note', label: 'หมายเหตุถึงอาจารย์', type: 'textarea' },
    ],
    fileLabel: 'ไฟล์สไลด์นำเสนอ', fileRequired: true,
  })),
  {
    title: PROJECT_STEPS[10], actor: 'student',
    description: 'ระบุรายการที่แก้ไขตามข้อเสนอแนะของกรรมการ และแนบไฟล์ฉบับแก้ไข',
    fields: [
      { key: 'changes', label: 'รายการที่แก้ไข', type: 'textarea', required: true },
    ],
    fileLabel: 'ไฟล์ฉบับแก้ไข', fileRequired: true,
  },
  {
    title: PROJECT_STEPS[11], actor: 'student',
    description: 'ส่งเล่มโครงงานฉบับสมบูรณ์',
    fields: [
      { key: 'note', label: 'หมายเหตุ', type: 'textarea' },
    ],
    fileLabel: 'ไฟล์เล่มฉบับสมบูรณ์ (PDF)', fileRequired: true,
  },
  {
    title: PROJECT_STEPS[12], actor: 'staff',
    description: 'อาจารย์ตรวจสอบความถูกต้องของเอกสาร ไม่ต้องส่งข้อมูลเพิ่มในขั้นนี้',
    fields: [],
  },
  {
    title: PROJECT_STEPS[13], actor: 'staff',
    description: 'อาจารย์อนุมัติการสำเร็จการศึกษา ไม่ต้องส่งข้อมูลเพิ่มในขั้นนี้',
    fields: [],
  },
];

/* ---------- Persistence ---------- */

const STORAGE_KEY = 'project_workflow_v1';
type Db = Record<string, StudentWorkflow>;

const emptyRecord = (state: StepState): StepRecord => ({ state, fields: {}, files: [], history: [] });

function load(): Db {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Db) : {};
  } catch {
    return {};
  }
}

let db: Db = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach(l => l());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => {
    if (e.key === STORAGE_KEY) {
      db = load();
      listeners.forEach(l => l());
    }
  });
}

/** สร้างข้อมูลเริ่มต้นจากข้อมูลจำลอง: ขั้นก่อนหน้าขั้นปัจจุบันถือว่าอนุมัติแล้ว */
function seed(studentId: string, fromStep?: number): StudentWorkflow {
  const project = getStudentProject(studentId);
  const current = fromStep ?? project?.currentStep ?? 1;
  const steps = STEP_CONFIG.map((_, i) => {
    const n = i + 1;
    if (n < current) {
      const r = emptyRecord('approved');
      r.reviewer = project?.advisorName;
      r.comment = 'อนุมัติ';
      if (n === 1 && project) r.fields = { titleTh: project.title, titleEn: project.titleEn || '', abstract: project.description };
      return r;
    }
    return emptyRecord(n === current ? 'draft' : 'locked');
  });
  return { studentId, steps };
}

function ensure(studentId: string): StudentWorkflow {
  if (!db[studentId]) {
    db = { ...db, [studentId]: seed(studentId) };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch { /* ignore */ }
  }
  return db[studentId];
}

function update(studentId: string, stepNo: number, fn: (r: StepRecord) => StepRecord, unlockNext = false) {
  const wf = ensure(studentId);
  const steps = wf.steps.map((r, i) => (i === stepNo - 1 ? fn(r) : r));
  if (unlockNext && stepNo < steps.length && steps[stepNo].state === 'locked') {
    steps[stepNo] = { ...steps[stepNo], state: 'draft' };
  }
  db = { ...db, [studentId]: { ...wf, steps } };
  persist();
}

const now = () => new Date().toISOString();

/* ---------- Public API ---------- */

export const workflow = {
  get: ensure,

  saveDraft(studentId: string, stepNo: number, fields: Record<string, string>, files: StepFile[], by: string) {
    update(studentId, stepNo, r => ({ ...r, fields, files, history: [...r.history, { at: now(), by, action: 'save' }] }));
  },

  submit(studentId: string, stepNo: number, fields: Record<string, string>, files: StepFile[], by: string) {
    update(studentId, stepNo, r => ({
      ...r, fields, files, state: 'pending', submittedAt: now(), comment: undefined,
      history: [...r.history, { at: now(), by, action: 'submit' }],
    }));
  },

  withdraw(studentId: string, stepNo: number, by: string) {
    update(studentId, stepNo, r => ({ ...r, state: 'draft', history: [...r.history, { at: now(), by, action: 'withdraw' }] }));
  },

  approve(studentId: string, stepNo: number, by: string, note?: string) {
    update(studentId, stepNo, r => ({
      ...r, state: 'approved', reviewedAt: now(), reviewer: by, comment: note || 'อนุมัติ',
      history: [...r.history, { at: now(), by, action: 'approve', note }],
    }), true);
  },

  reject(studentId: string, stepNo: number, by: string, note: string) {
    update(studentId, stepNo, r => ({
      ...r, state: 'rejected', reviewedAt: now(), reviewer: by, comment: note,
      history: [...r.history, { at: now(), by, action: 'reject', note }],
    }));
  },

  /** โหมดสาธิต: เริ่มขั้นตอนใหม่ตั้งแต่ขั้นที่ 1 */
  resetDemo(studentId: string) {
    db = { ...db, [studentId]: seed(studentId, 1) };
    persist();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/** ขั้นปัจจุบัน = ขั้นแรกที่ยังไม่อนุมัติ (15 = ครบทุกขั้น) */
export function currentStepOf(wf: StudentWorkflow): number {
  const i = wf.steps.findIndex(s => s.state !== 'approved');
  return i === -1 ? wf.steps.length + 1 : i + 1;
}

export function useWorkflow(studentId: string): StudentWorkflow {
  return useSyncExternalStore(workflow.subscribe, () => ensure(studentId));
}

/** รายการที่รออาจารย์ดำเนินการ ของนักศึกษาทุกคนที่มีข้อมูลในระบบ */
export interface ApprovalItem {
  studentId: string;
  studentName: string;
  projectTitle: string;
  stepNo: number;
  record: StepRecord;
  kind: 'submission' | 'staff';
}

export function useApprovalQueue(): ApprovalItem[] {
  // นักศึกษาตัวอย่างในระบบสาธิต (ยังไม่มี Back-end)
  ensure('s6501001');
  const snapshot = useSyncExternalStore(workflow.subscribe, () => db);
  const items: ApprovalItem[] = [];
  Object.values(snapshot).forEach(wf => {
    const st = students.find(s => s.id === wf.studentId || s.studentId === wf.studentId);
    const project = getStudentProject(wf.studentId);
    wf.steps.forEach((rec, i) => {
      const cfg = STEP_CONFIG[i];
      const isStaffTurn = cfg.actor === 'staff' && rec.state === 'draft';
      if (rec.state === 'pending' || isStaffTurn) {
        items.push({
          studentId: wf.studentId,
          studentName: st?.name || project?.studentName || wf.studentId,
          projectTitle: wf.steps[0].fields.titleTh || project?.title || '-',
          stepNo: i + 1,
          record: rec,
          kind: isStaffTurn ? 'staff' : 'submission',
        });
      }
    });
  });
  return items.sort((a, b) => (a.record.submittedAt || '').localeCompare(b.record.submittedAt || ''));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatThaiDateTime(iso?: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* ---------- กำหนดส่งและแบบฟอร์มของแต่ละขั้นตอน ---------- */

/** วันเริ่มนับกำหนดส่ง (ตัวอย่างสำหรับสาธิต: แต่ละขั้นห่างกัน 14 วัน) */
export const DEMO_SCHEDULE_START = '2026-10-01';

export function dueDateOf(stepNo: number): Date {
  const d = new Date(`${DEMO_SCHEDULE_START}T23:59:00`);
  d.setDate(d.getDate() + stepNo * 14);
  return d;
}

export function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export interface StepTemplate {
  fileName: string;
  label: string;
  content: string;
}

const outline = (title: string, items: string[]) =>
  `${title}\n${'='.repeat(40)}\n\n${items.map((t, i) => `${i + 1}. ${t}\n   ......................................................\n`).join('\n')}`;

export const STEP_TEMPLATES: Record<number, StepTemplate[]> = {
  1: [{ fileName: 'แบบฟอร์มข้อเสนอโครงงาน.txt', label: 'แบบฟอร์มข้อเสนอโครงงาน (Proposal)', content: outline('แบบฟอร์มข้อเสนอโครงงาน', ['ชื่อโครงงาน (ภาษาไทย / ภาษาอังกฤษ)', 'ที่มาและความสำคัญของปัญหา', 'วัตถุประสงค์', 'ขอบเขตของโครงงาน', 'ทฤษฎีและงานวิจัยที่เกี่ยวข้อง', 'วิธีการดำเนินงาน', 'ประโยชน์ที่คาดว่าจะได้รับ', 'เอกสารอ้างอิง']) }],
  3: [{ fileName: 'แบบคำร้องขอแต่งตั้งอาจารย์ที่ปรึกษา.txt', label: 'แบบคำร้องขอแต่งตั้งอาจารย์ที่ปรึกษา', content: outline('แบบคำร้องขอแต่งตั้งอาจารย์ที่ปรึกษา', ['ชื่อ-สกุล / รหัสนักศึกษา', 'ชื่อโครงงาน', 'อาจารย์ที่ปรึกษาที่ต้องการ', 'เหตุผลในการเลือก']) }],
  5: [{ fileName: 'แบบฟอร์มแผนการดำเนินงาน.txt', label: 'แบบฟอร์มแผนการดำเนินงาน', content: outline('แผนการดำเนินงาน', ['รายการงานหลัก', 'ระยะเวลาของแต่ละงาน (สัปดาห์ที่เริ่ม - สิ้นสุด)', 'ผู้รับผิดชอบ', 'ผลลัพธ์ที่ส่งมอบ']) }],
  6: [{ fileName: 'แบบรายงานความก้าวหน้า.txt', label: 'แบบรายงานความก้าวหน้า', content: outline('แบบรายงานความก้าวหน้า', ['งานที่ทำเสร็จแล้ว', 'งานที่กำลังดำเนินการ', 'ปัญหาและอุปสรรค', 'แนวทางแก้ไข', 'แผนงานช่วงถัดไป']) }],
  7: [{ fileName: 'โครงสไลด์นำเสนอ.txt', label: 'โครงสไลด์นำเสนอ', content: outline('โครงสไลด์นำเสนอ', ['ชื่อโครงงานและผู้จัดทำ', 'ที่มาและปัญหา', 'วัตถุประสงค์และขอบเขต', 'วิธีการ / สถาปัตยกรรมระบบ', 'ผลการดำเนินงาน', 'สรุปและงานต่อไป']) }],
  11: [{ fileName: 'แบบสรุปการแก้ไขตามข้อเสนอแนะ.txt', label: 'แบบสรุปการแก้ไขตามข้อเสนอแนะ', content: outline('แบบสรุปการแก้ไขตามข้อเสนอแนะของกรรมการ', ['ข้อเสนอแนะของกรรมการ', 'สิ่งที่แก้ไข', 'หน้า / ส่วนที่แก้ไขในเล่ม']) }],
  12: [{ fileName: 'โครงสร้างเล่มโครงงาน.txt', label: 'โครงสร้างเล่มโครงงานฉบับสมบูรณ์', content: outline('โครงสร้างเล่มโครงงานฉบับสมบูรณ์', ['ปก / บทคัดย่อ / กิตติกรรมประกาศ', 'บทที่ 1 บทนำ', 'บทที่ 2 ทฤษฎีและงานที่เกี่ยวข้อง', 'บทที่ 3 วิธีการดำเนินงาน', 'บทที่ 4 ผลการดำเนินงาน', 'บทที่ 5 สรุปและข้อเสนอแนะ', 'บรรณานุกรม / ภาคผนวก']) }],
};
STEP_TEMPLATES[8] = STEP_TEMPLATES[7];
STEP_TEMPLATES[9] = STEP_TEMPLATES[7];
STEP_TEMPLATES[10] = STEP_TEMPLATES[7];

export function downloadTemplate(t: StepTemplate) {
  const blob = new Blob(['﻿' + t.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = t.fileName;
  a.click();
  URL.revokeObjectURL(url);
}
