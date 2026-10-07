// ==========================================
// USER & AUTHENTICATION TYPES
// ==========================================

export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  /** กลุ่มนักศึกษา: CED หรือ TCT */
  group: string;
  year: number;
  phone?: string;
  avatar?: string;
  projectId?: string;
}

export interface Instructor {
  id: string;
  instructorId: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  avatar?: string;
  position?: string;
}

// ==========================================
// ACADEMIC TYPES
// ==========================================

export interface AcademicTerm {
  id: string;
  semester: number;
  year: number;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ==========================================
// PROJECT TYPES
// ==========================================

export type ProjectStatus =
  | 'proposed'
  | 'topic_review'
  | 'advisor_assigned'
  | 'approved'
  | 'in_progress'
  | 'reporting'
  | 'proposal_presentation'
  | 'progress_presentation'
  | 'prefinal_presentation'
  | 'final_presentation'
  | 'revision'
  | 'submitted'
  | 'document_review'
  | 'completed';

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  studentId: string;
  studentName: string;
  advisorId: string;
  advisorName: string;
  coAdvisorId?: string;
  coAdvisorName?: string;
  status: ProjectStatus;
  progress: number;
  semester: number;
  year: number;
  group: string;
  startDate: string;
  submissionDate?: string;
  currentStep: number;
}

export const PROJECT_STEPS = [
  'เสนอหัวข้อ',
  'ตรวจสอบหัวข้อ',
  'แต่งตั้งอาจารย์ที่ปรึกษา',
  'อนุมัติโครงงาน',
  'ดำเนินโครงงาน',
  'รายงานความก้าวหน้า',
  'Proposal Presentation',
  'Progress Presentation',
  'Pre-Final Presentation',
  'Final Presentation',
  'แก้ไขโครงงาน',
  'ส่งเล่มฉบับสมบูรณ์',
  'ตรวจสอบเอกสาร',
  'อนุมัติสำเร็จการศึกษา',
];

export type StepStatus = 'completed' | 'in_progress' | 'pending' | 'rejected';

// ==========================================
// WEEKLY PROGRESS TYPES
// ==========================================

export interface WeeklyScore {
  id: string;
  studentId: string;
  week: number;
  progress: number;      // ความก้าวหน้าของโครงงาน (0-5)
  quality: number;        // คุณภาพของงาน (0-5)
  punctuality: number;    // ความตรงต่อเวลา (0-5)
  content: number;        // เนื้อหา (0-5)
  responsibility: number; // ความรับผิดชอบ (0-5)
  qa: number;             // การตอบคำถาม (0-5)
  totalScore: number;     // รวม (0-30)
  percentage: number;     // เปอร์เซ็นต์ (0-100)
  submissionStatus: 'on_time' | 'late' | 'not_submitted';
  submittedDate?: string;
  feedback?: string;
}

export type ScoreLevel = 'excellent' | 'good' | 'needs_improvement' | 'needs_attention';

export interface ScoreLevelInfo {
  level: ScoreLevel;
  label: string;
  labelTh: string;
  color: string;
  bgColor: string;
  textColor: string;
  min: number;
  max: number;
  emoji: string;
}

// ==========================================
// PRESENTATION ASSESSMENT TYPES
// ==========================================

export type PresentationType = 'proposal' | 'progress' | 'prefinal' | 'final';

export interface PresentationRubric {
  content: number;       // เนื้อหา (0-5)
  accuracy: number;      // ความถูกต้อง (0-5)
  analysis: number;      // การวิเคราะห์ (0-5)
  qa: number;            // การตอบคำถาม (0-5)
  presentation: number;  // การนำเสนอ (0-5)
}

export interface PresentationAssessment {
  id: string;
  studentId: string;
  type: PresentationType;
  presentationNumber: number; // 1-4
  week: number;
  rubric: PresentationRubric;
  totalScore: number;         // 0-25
  percentage: number;         // 0-100
  status: 'passed_excellent' | 'passed' | 'passed_conditional' | 'failed' | 'not_assessed';
  feedback?: string;
  assessedDate?: string;
  assessedBy?: string;
}

export interface PresentationLevelInfo {
  level: string;
  label: string;
  labelTh: string;
  color: string;
  bgColor: string;
  textColor: string;
  min: number;
  max: number;
  emoji: string;
}

// ==========================================
// RISK SCORE TYPES
// ==========================================

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskScoreBreakdown {
  weeklyScore: number;          // 0-100
  presentationScore: number;    // 0-100
  submissionScore: number;      // 0-100
  contentScore: number;         // 0-100
  communicationScore: number;   // 0-100
}

export interface RiskScore {
  id: string;
  studentId: string;
  totalScore: number;           // 0-100
  breakdown: RiskScoreBreakdown;
  calculatedLevel: RiskLevel;   // จาก score
  appliedRules: string[];       // rules ที่ trigger
  finalLevel: RiskLevel;        // หลังจาก apply rules
  trend: TrendType;
  recommendation: string;
  lastUpdated: string;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
}

// ==========================================
// TREND TYPES
// ==========================================

export type TrendType = 'improving' | 'stable' | 'declining';

export interface TrendInfo {
  type: TrendType;
  label: string;
  labelTh: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

// ==========================================
// DOCUMENT TYPES
// ==========================================

export type DocumentType =
  | 'proposal'
  | 'progress_report'
  | 'prefinal_report'
  | 'final_report'
  | 'project_book'
  | 'assessment_form'
  | 'revision_doc'
  | 'approval_doc';

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'revision_needed';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  projectId: string;
  studentId: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  status: DocumentStatus;
  version: number;
  reviewer?: string;
  reviewDate?: string;
  feedback?: string;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export type NotificationType = 'urgent' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  targetRole: UserRole;
  targetUserId?: string;
  link?: string;
}

// ==========================================
// FEEDBACK TYPES
// ==========================================

export interface Feedback {
  id: string;
  studentId: string;
  projectId: string;
  instructorId: string;
  instructorName: string;
  type: 'weekly' | 'presentation' | 'document' | 'general';
  week?: number;
  presentationNumber?: number;
  content: string;
  date: string;
  isAddressed: boolean;
}

// ==========================================
// SUMMARY / DASHBOARD TYPES
// ==========================================

export interface DashboardSummary {
  totalStudents: number;
  totalProjects: number;
  proposedTopics: number;
  inProgress: number;
  submitted: number;
  passed: number;
  underRevision: number;
  highRisk: number;
}

export interface WeeklyProgressSummary {
  totalStudents: number;
  onTime: number;
  late: number;
  notSubmitted: number;
  averageScore: number;
}

export interface PresentationSummary {
  totalStudents: number;
  presented: number;
  notPresented: number;
  averageScore: number;
  passed: number;
  failed: number;
}

export interface RiskSummary {
  totalStudents: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  averageRiskScore: number;
  urgentFollowUp: number;
}

// ==========================================
// CALENDAR / TIMELINE TYPES
// ==========================================

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'presentation' | 'meeting' | 'submission';
  status: 'upcoming' | 'completed' | 'overdue';
  description?: string;
}
