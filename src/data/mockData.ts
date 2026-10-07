import {
  Student, Instructor, Project, WeeklyScore, PresentationAssessment,
  RiskScore, Notification, Document, Feedback, CalendarEvent,
  AcademicTerm, User, DashboardSummary, WeeklyProgressSummary,
  PresentationSummary, RiskSummary, RiskScoreBreakdown
} from '../types';
import {
  calculateWeeklyAverage, calculatePresentationAverage,
  calculateRiskScore, getRiskLevel, applyRiskRules,
  analyzeTrend, countConsecutiveDecline, generateRecommendation
} from '../utils/calculations';

// ==========================================
// ACADEMIC TERMS
// ==========================================
export const academicTerms: AcademicTerm[] = [
  { id: 'term-1', semester: 1, year: 2567, label: '1/2567', startDate: '2024-06-01', endDate: '2024-10-31', isActive: true },
  { id: 'term-2', semester: 2, year: 2566, label: '2/2566', startDate: '2024-01-01', endDate: '2024-05-31', isActive: false },
];

// ==========================================
// INSTRUCTORS
// ==========================================
export const instructors: Instructor[] = [
  { id: 'INS001', instructorId: 'INS001', name: 'ผศ.ดร.สมชาย วิทยาการ', email: 'somchai@kmutnb.ac.th', department: 'วิศวกรรมคอมพิวเตอร์', position: 'ผู้ช่วยศาสตราจารย์', phone: '02-555-2001' },
  { id: 'INS002', instructorId: 'INS002', name: 'รศ.ดร.วิภา เทคโนโลยี', email: 'wipa@kmutnb.ac.th', department: 'วิศวกรรมคอมพิวเตอร์', position: 'รองศาสตราจารย์', phone: '02-555-2002' },
  { id: 'INS003', instructorId: 'INS003', name: 'อ.ดร.ประเสริฐ นวัตกรรม', email: 'prasert@kmutnb.ac.th', department: 'วิศวกรรมคอมพิวเตอร์', position: 'อาจารย์', phone: '02-555-2003' },
  { id: 'INS004', instructorId: 'INS004', name: 'ผศ.ดร.นภา ซอฟต์แวร์', email: 'napa@kmutnb.ac.th', department: 'วิศวกรรมคอมพิวเตอร์', position: 'ผู้ช่วยศาสตราจารย์', phone: '02-555-2004' },
];

// ==========================================
// STUDENTS (32 คน)
// ==========================================
const studentNames = [
  'นายกิตติพงศ์ สุขสวัสดิ์', 'นายธนพล เจริญยิ่ง', 'นางสาวพิมพ์ชนก รัตนะ', 'นายวรเมธ ศรีสง่า',
  'นางสาวณัฐริกา พงศ์สุวรรณ', 'นายภูริพัฒน์ คำแก้ว', 'นางสาวอรพรรณ ทองดี', 'นายจิรวัฒน์ มงคลชัย',
  'นางสาวศิริลักษณ์ วงศ์ประเสริฐ', 'นายปรัชญา ใจกล้า', 'นายสุรเดช แสงอรุณ', 'นางสาวกนกวรรณ สายชล',
  'นายณัฐวุฒิ พิทักษ์ไทย', 'นางสาวชลธิชา บุญประเสริฐ', 'นายอนุชา ฤทธิ์เดช', 'นางสาวปิยะธิดา สมบูรณ์',
  'นายศักดิ์สิทธิ์ วัฒนกุล', 'นางสาวเกศินี ชัยนิมิตร', 'นายธีรภัทร ลิ้มสุวรรณ', 'นางสาวสุภาพร เพชรดี',
  'นายพีรพัฒน์ บุญส่ง', 'นางสาวนฤมล ทิพย์สุวรรณ', 'นายวิทวัส ชูศรี', 'นางสาวจุฑามาศ เมธีกุล',
  'นายเกียรติศักดิ์ อินทร์แก้ว', 'นางสาวธิดารัตน์ พรหมเดช', 'นายอภิสิทธิ์ กาญจนา', 'นางสาวพรพิมล ศรีนวล',
  'นายณัฐพงษ์ วรรณศิริ', 'นางสาวรัชนีกร สง่าศรี', 'นายสหรัฐ มุ่งมั่น', 'นางสาวอัจฉรา ดวงแก้ว',
];

const projectTitles = [
  'ระบบจัดการสินค้าคงคลังด้วย IoT', 'แอปพลิเคชันวิเคราะห์อารมณ์จากข้อความ', 'ระบบแนะนำเส้นทางท่องเที่ยวด้วย AI',
  'แพลตฟอร์มเรียนออนไลน์แบบ Adaptive', 'ระบบตรวจจับใบหน้าสำหรับเช็คชื่อ', 'แอปติดตามสุขภาพด้วย Machine Learning',
  'ระบบจองห้องประชุมอัจฉริยะ', 'แพลตฟอร์มซื้อขายสินค้ามือสองออนไลน์', 'ระบบวิเคราะห์คุณภาพอากาศ IoT',
  'แอปจัดการการเงินส่วนบุคคล', 'ระบบแจ้งเตือนภัยน้ำท่วมด้วย Sensor', 'แพลตฟอร์มจัดการโปรเจกต์ Agile',
  'ระบบวิเคราะห์พฤติกรรมผู้ใช้เว็บไซต์', 'แอปช่วยเหลือผู้พิการทางสายตา', 'ระบบจัดตารางเรียนอัตโนมัติ',
  'แพลตฟอร์มบริจาคอาหารส่วนเกิน', 'ระบบตรวจสอบคุณภาพผลไม้ด้วย Image Processing', 'แอปจัดการร้านกาแฟ POS',
  'ระบบ Chatbot บริการลูกค้าด้วย NLP', 'แพลตฟอร์มแชร์รถร่วมเดินทาง', 'ระบบติดตามพัสดุแบบ Real-time',
  'แอปแปลภาษามือด้วย Computer Vision', 'ระบบจัดการหอพักนักศึกษา', 'แพลตฟอร์มสอนดนตรีออนไลน์',
  'ระบบวิเคราะห์ข้อสอบด้วย AI', 'แอปนัดหมายแพทย์ Telemedicine', 'ระบบ Smart Farm อัตโนมัติ',
  'แพลตฟอร์มจัดการอีเวนท์มหาวิทยาลัย', 'ระบบจดจำป้ายทะเบียนรถ', 'แอปบริหารจัดการชมรมนักศึกษา',
  'ระบบแนะนำอาหารตามโภชนาการ', 'แพลตฟอร์มประเมินผลการเรียนรู้',
];

// Weekly score profiles for different risk categories
// Low Risk students (14) - high scores, improving or stable
// Medium Risk students (11) - moderate scores, some inconsistency
// High Risk students (7) - low scores, declining

type ScoreProfile = { base: number; variance: number; trend: 'up' | 'stable' | 'down' | 'fluctuate'; missingWeeks: number[]; lateWeeks: number[] };

const lowRiskProfiles: ScoreProfile[] = [
  { base: 90, variance: 3, trend: 'up', missingWeeks: [], lateWeeks: [] },
  { base: 88, variance: 4, trend: 'stable', missingWeeks: [], lateWeeks: [] },
  { base: 92, variance: 2, trend: 'up', missingWeeks: [], lateWeeks: [] },
  { base: 85, variance: 5, trend: 'up', missingWeeks: [], lateWeeks: [8] },
  { base: 87, variance: 3, trend: 'stable', missingWeeks: [], lateWeeks: [] },
  { base: 91, variance: 2, trend: 'up', missingWeeks: [], lateWeeks: [] },
  { base: 86, variance: 4, trend: 'stable', missingWeeks: [], lateWeeks: [5] },
  { base: 89, variance: 3, trend: 'up', missingWeeks: [], lateWeeks: [] },
  { base: 93, variance: 2, trend: 'stable', missingWeeks: [], lateWeeks: [] },
  { base: 88, variance: 3, trend: 'up', missingWeeks: [], lateWeeks: [] },
  { base: 90, variance: 2, trend: 'stable', missingWeeks: [], lateWeeks: [] },
  { base: 87, variance: 4, trend: 'up', missingWeeks: [], lateWeeks: [12] },
  { base: 91, variance: 3, trend: 'stable', missingWeeks: [], lateWeeks: [] },
  { base: 86, variance: 5, trend: 'up', missingWeeks: [], lateWeeks: [] },
];

const mediumRiskProfiles: ScoreProfile[] = [
  { base: 74, variance: 6, trend: 'fluctuate', missingWeeks: [], lateWeeks: [3, 7, 11] },
  { base: 72, variance: 5, trend: 'down', missingWeeks: [], lateWeeks: [2, 5, 9, 13] },
  { base: 76, variance: 4, trend: 'stable', missingWeeks: [10], lateWeeks: [4, 8] },
  { base: 70, variance: 7, trend: 'fluctuate', missingWeeks: [], lateWeeks: [1, 6, 11] },
  { base: 73, variance: 5, trend: 'down', missingWeeks: [14], lateWeeks: [3, 7] },
  { base: 75, variance: 6, trend: 'stable', missingWeeks: [], lateWeeks: [2, 8, 12] },
  { base: 71, variance: 5, trend: 'fluctuate', missingWeeks: [7], lateWeeks: [4, 10] },
  { base: 68, variance: 7, trend: 'down', missingWeeks: [], lateWeeks: [1, 5, 9, 13] },
  { base: 77, variance: 4, trend: 'stable', missingWeeks: [], lateWeeks: [6, 11] },
  { base: 69, variance: 6, trend: 'fluctuate', missingWeeks: [12], lateWeeks: [3, 8] },
  { base: 74, variance: 5, trend: 'down', missingWeeks: [], lateWeeks: [2, 7, 10, 14] },
];

const highRiskProfiles: ScoreProfile[] = [
  { base: 55, variance: 8, trend: 'down', missingWeeks: [5, 9, 13], lateWeeks: [2, 4, 7, 11] },
  { base: 52, variance: 7, trend: 'down', missingWeeks: [3, 8, 12], lateWeeks: [1, 6, 10, 14] },
  { base: 58, variance: 6, trend: 'down', missingWeeks: [7, 11, 14], lateWeeks: [2, 5, 9] },
  { base: 48, variance: 9, trend: 'down', missingWeeks: [4, 8, 10, 13], lateWeeks: [2, 6, 12] },
  { base: 53, variance: 7, trend: 'down', missingWeeks: [6, 9, 14], lateWeeks: [3, 7, 11] },
  { base: 50, variance: 8, trend: 'down', missingWeeks: [3, 7, 11, 14], lateWeeks: [1, 5, 9] },
  { base: 56, variance: 6, trend: 'down', missingWeeks: [8, 12, 14], lateWeeks: [2, 5, 10] },
];

function generateWeeklyScores(studentId: string, profile: ScoreProfile): WeeklyScore[] {
  const scores: WeeklyScore[] = [];
  const seed = studentId.charCodeAt(studentId.length - 1) + studentId.charCodeAt(studentId.length - 2);

  for (let week = 1; week <= 14; week++) {
    const isMissing = profile.missingWeeks.includes(week);
    const isLate = profile.lateWeeks.includes(week);

    if (isMissing) {
      scores.push({
        id: `ws-${studentId}-w${week}`,
        studentId,
        week,
        progress: 0, quality: 0, punctuality: 0, content: 0, responsibility: 0, qa: 0,
        totalScore: 0,
        percentage: 0,
        submissionStatus: 'not_submitted',
      });
      continue;
    }

    // Generate trend-adjusted base
    let adjustedBase = profile.base;
    if (profile.trend === 'up') adjustedBase = profile.base + (week - 1) * 0.8;
    if (profile.trend === 'down') adjustedBase = profile.base - (week - 1) * 1.2;
    if (profile.trend === 'fluctuate') adjustedBase = profile.base + Math.sin(week * 1.5 + seed) * profile.variance;

    // Add pseudo-random variance
    const pseudoRandom = Math.sin(seed * week * 13.7 + week * 7.3) * 0.5 + 0.5; // 0-1
    const variation = (pseudoRandom - 0.5) * profile.variance * 2;
    const targetPct = Math.max(10, Math.min(100, adjustedBase + variation));
    const targetTotal = Math.round((targetPct / 100) * 30);
    const clampedTotal = Math.max(3, Math.min(30, targetTotal));

    // Distribute across 6 criteria
    const distribute = (total: number): number[] => {
      const avg = total / 6;
      const result: number[] = [];
      let remaining = total;
      for (let i = 0; i < 5; i++) {
        const val = Math.max(0, Math.min(5, Math.round(avg + (Math.sin(seed + i * week) * 1))));
        result.push(val);
        remaining -= val;
      }
      result.push(Math.max(0, Math.min(5, remaining)));
      return result;
    };

    const [progress, quality, punctuality, content, responsibility, qa] = distribute(clampedTotal);
    const actualTotal = progress + quality + punctuality + content + responsibility + qa;
    const percentage = Math.round((actualTotal / 30) * 100 * 100) / 100;

    scores.push({
      id: `ws-${studentId}-w${week}`,
      studentId,
      week,
      progress, quality, punctuality, content, responsibility, qa,
      totalScore: actualTotal,
      percentage,
      submissionStatus: isLate ? 'late' : 'on_time',
      submittedDate: `2024-${String(6 + Math.floor(week / 5)).padStart(2, '0')}-${String(1 + ((week * 3 + (isLate ? 5 : 0)) % 28)).padStart(2, '0')}`,
      feedback: week % 3 === 0 ? 'ดำเนินงานได้ดี ควรเพิ่มรายละเอียดในส่วนของการวิเคราะห์' : undefined,
    });
  }
  return scores;
}

function generatePresentationScores(studentId: string, riskCategory: 'low' | 'medium' | 'high'): PresentationAssessment[] {
  const seed = studentId.charCodeAt(studentId.length - 1);
  const types: Array<{ type: 'proposal' | 'progress' | 'prefinal' | 'final'; week: number; num: number }> = [
    { type: 'proposal', week: 15, num: 1 },
    { type: 'progress', week: 16, num: 2 },
    { type: 'prefinal', week: 17, num: 3 },
    { type: 'final', week: 18, num: 4 },
  ];

  const basePct = riskCategory === 'low' ? 82 : riskCategory === 'medium' ? 68 : 52;

  return types.map(({ type, week, num }) => {
    const variance = Math.sin(seed * num * 5.7) * 8;
    const trendBonus = num * (riskCategory === 'low' ? 2 : riskCategory === 'medium' ? 1 : -1.5);
    const targetPct = Math.max(20, Math.min(100, basePct + variance + trendBonus));
    const targetTotal = Math.round((targetPct / 100) * 25);
    const clampedTotal = Math.max(5, Math.min(25, targetTotal));

    // Distribute across 5 rubrics
    const avg = clampedTotal / 5;
    const content = Math.max(1, Math.min(5, Math.round(avg + Math.sin(seed + 1) * 0.8)));
    const accuracy = Math.max(1, Math.min(5, Math.round(avg + Math.sin(seed + 2) * 0.6)));
    const analysis = Math.max(1, Math.min(5, Math.round(avg + Math.sin(seed + 3) * 0.7)));
    const qa = Math.max(1, Math.min(5, Math.round(avg + Math.sin(seed + 4) * 0.5)));
    const presentation = Math.max(1, Math.min(5, clampedTotal - content - accuracy - analysis - qa));
    const actualPresentation = Math.max(1, Math.min(5, presentation));
    const actualTotal = content + accuracy + analysis + qa + actualPresentation;
    const percentage = Math.round((actualTotal / 25) * 100 * 100) / 100;

    let status: PresentationAssessment['status'];
    if (percentage >= 85) status = 'passed_excellent';
    else if (percentage >= 70) status = 'passed';
    else if (percentage >= 60) status = 'passed_conditional';
    else status = 'failed';

    return {
      id: `pa-${studentId}-${num}`,
      studentId,
      type,
      presentationNumber: num,
      week,
      rubric: { content, accuracy, analysis, qa, presentation: actualPresentation },
      totalScore: actualTotal,
      percentage,
      status,
      assessedDate: `2024-09-${String(num * 7).padStart(2, '0')}`,
      assessedBy: instructors[seed % instructors.length].name,
      feedback: num === 4 ? 'ผลงานดี มีการพัฒนาจากครั้งที่แล้ว ควรเพิ่มการวิเคราะห์เชิงลึก' :
                num === 3 ? 'ควรปรับปรุงการนำเสนอให้กระชับ และเพิ่มข้อมูลสนับสนุน' : undefined,
    };
  });
}

// ==========================================
// GENERATE ALL STUDENTS AND DATA
// ==========================================

export const students: Student[] = [];
export const projects: Project[] = [];
export const allWeeklyScores: WeeklyScore[] = [];
export const allPresentationAssessments: PresentationAssessment[] = [];
export const allRiskScores: RiskScore[] = [];
export const allFeedback: Feedback[] = [];

const allProfiles = [
  ...lowRiskProfiles.map(p => ({ ...p, category: 'low' as const })),
  ...mediumRiskProfiles.map(p => ({ ...p, category: 'medium' as const })),
  ...highRiskProfiles.map(p => ({ ...p, category: 'high' as const })),
];

const projectStatuses: Project['status'][] = [
  'completed', 'completed', 'completed', 'completed', 'completed', 'completed',
  'completed', 'completed', 'completed', 'completed', 'completed', 'completed',
  'completed', 'completed', 'completed', 'completed', 'completed', 'completed',
  'submitted', 'submitted', 'submitted', 'submitted', 'submitted', 'submitted',
  'in_progress', 'in_progress', 'in_progress', 'in_progress', 'in_progress',
  'revision', 'revision', 'revision',
];

const projectProgress = [
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  90, 88, 85, 92, 87, 89,
  72, 68, 65, 60, 55,
  78, 70, 45,
];

for (let i = 0; i < 32; i++) {
  const studentId = `s${String(6501000 + i + 1)}`;
  const profile = allProfiles[i];
  const advisorIdx = i % instructors.length;
  const group = i < 16 ? 'CED' : 'TCT';

  // Create student
  students.push({
    id: studentId,
    studentId: String(6501000 + i + 1),
    name: studentNames[i],
    email: `student${i + 1}@kmutnb.ac.th`,
    group,
    year: 4,
    phone: `08${String(10000000 + i * 1234567).slice(0, 8)}`,
    projectId: `proj-${studentId}`,
  });

  // Create project
  const status = projectStatuses[i] || 'in_progress';
  const currentStep = status === 'completed' ? 14 :
    status === 'submitted' ? 12 :
    status === 'revision' ? 11 :
    status === 'in_progress' ? 6 + (i % 4) : 5;

  projects.push({
    id: `proj-${studentId}`,
    title: projectTitles[i],
    description: `โครงงาน ${projectTitles[i]} เป็นการพัฒนาระบบเพื่อแก้ปัญหาและพัฒนานวัตกรรมในด้านเทคโนโลยีสารสนเทศ`,
    studentId,
    studentName: studentNames[i],
    advisorId: instructors[advisorIdx].id,
    advisorName: instructors[advisorIdx].name,
    status,
    progress: projectProgress[i],
    semester: 1,
    year: 2567,
    group,
    startDate: '2024-06-01',
    currentStep,
  });

  // Generate weekly scores
  const weeklyScores = generateWeeklyScores(studentId, profile);
  allWeeklyScores.push(...weeklyScores);

  // Generate presentation scores
  const presentationScores = generatePresentationScores(studentId, profile.category);
  allPresentationAssessments.push(...presentationScores);

  // Calculate risk score
  const weeklyAvg = calculateWeeklyAverage(weeklyScores);
  const presAvg = calculatePresentationAverage(presentationScores);

  const onTimeCount = weeklyScores.filter(w => w.submissionStatus === 'on_time').length;
  const submissionRate = (onTimeCount / 14) * 100;
  const contentScores = weeklyScores.filter(w => w.submissionStatus !== 'not_submitted').map(w => (w.content / 5) * 100);
  const contentAvg = contentScores.length > 0 ? contentScores.reduce((a, b) => a + b, 0) / contentScores.length : 0;
  const communicationAvg = profile.category === 'low' ? 85 + Math.random() * 10 :
    profile.category === 'medium' ? 65 + Math.random() * 15 : 40 + Math.random() * 20;

  const breakdown: RiskScoreBreakdown = {
    weeklyScore: Math.round(weeklyAvg * 100) / 100,
    presentationScore: Math.round(presAvg * 100) / 100,
    submissionScore: Math.round(submissionRate * 100) / 100,
    contentScore: Math.round(contentAvg * 100) / 100,
    communicationScore: Math.round(communicationAvg * 100) / 100,
  };

  const riskScore = calculateRiskScore(breakdown);
  const calculatedLevel = getRiskLevel(riskScore);

  const weeklyPercentages = weeklyScores.map(w => w.percentage);
  const trend = analyzeTrend(weeklyPercentages.filter(p => p > 0));
  const notSubmittedCount = weeklyScores.filter(w => w.submissionStatus === 'not_submitted').length;
  const consecutiveDecline = countConsecutiveDecline(weeklyPercentages.filter(p => p > 0));
  const failedPres = presentationScores.filter(p => p.status === 'failed').length;

  const { finalLevel, appliedRules } = applyRiskRules(calculatedLevel, {
    notSubmittedCount,
    consecutiveDeclineWeeks: consecutiveDecline,
    failedPresentations: failedPres,
    hasUnaddressedFeedback: profile.category === 'high' && i % 2 === 0,
  });

  const lateCount = weeklyScores.filter(w => w.submissionStatus === 'late').length;
  const recommendation = generateRecommendation(finalLevel, trend, lateCount, appliedRules);

  allRiskScores.push({
    id: `risk-${studentId}`,
    studentId,
    totalScore: riskScore,
    breakdown,
    calculatedLevel,
    appliedRules,
    finalLevel,
    trend,
    recommendation,
    lastUpdated: '2024-09-30',
  });

  // Generate feedback
  if (i % 2 === 0) {
    allFeedback.push({
      id: `fb-${studentId}-1`,
      studentId,
      projectId: `proj-${studentId}`,
      instructorId: instructors[advisorIdx].id,
      instructorName: instructors[advisorIdx].name,
      type: 'weekly',
      week: 7,
      content: 'ควรเพิ่มรายละเอียดในส่วนของการวิเคราะห์ระบบ และอัพเดทความก้าวหน้าอย่างสม่ำเสมอ',
      date: '2024-08-15',
      isAddressed: profile.category !== 'high',
    });
  }
  if (i % 3 === 0) {
    allFeedback.push({
      id: `fb-${studentId}-2`,
      studentId,
      projectId: `proj-${studentId}`,
      instructorId: instructors[advisorIdx].id,
      instructorName: instructors[advisorIdx].name,
      type: 'presentation',
      presentationNumber: 2,
      content: 'การนำเสนอต้องปรับปรุงให้กระชับ เน้นประเด็นสำคัญ และเตรียมตอบคำถามให้มากขึ้น',
      date: '2024-09-14',
      isAddressed: profile.category === 'low',
    });
  }
}

// ==========================================
// HELPER: GET DATA BY STUDENT
// ==========================================

export function getStudentWeeklyScores(studentId: string): WeeklyScore[] {
  return allWeeklyScores.filter(w => w.studentId === studentId);
}

export function getStudentPresentations(studentId: string): PresentationAssessment[] {
  return allPresentationAssessments.filter(p => p.studentId === studentId);
}

export function getStudentRiskScore(studentId: string): RiskScore | undefined {
  return allRiskScores.find(r => r.studentId === studentId);
}

export function getStudentProject(studentId: string): Project | undefined {
  return projects.find(p => p.studentId === studentId);
}

export function getStudentFeedback(studentId: string): Feedback[] {
  return allFeedback.filter(f => f.studentId === studentId);
}

// ==========================================
// SUMMARY CALCULATIONS
// ==========================================

export function getDashboardSummary(): DashboardSummary {
  return {
    totalStudents: 32,
    totalProjects: 32,
    proposedTopics: 30,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    submitted: projects.filter(p => p.status === 'submitted').length,
    passed: projects.filter(p => p.status === 'completed').length,
    underRevision: projects.filter(p => p.status === 'revision').length,
    highRisk: allRiskScores.filter(r => r.finalLevel === 'high').length,
  };
}

export function getWeeklyProgressSummary(week?: number): WeeklyProgressSummary {
  const targetWeek = week || 14;
  const weekScores = allWeeklyScores.filter(w => w.week === targetWeek);
  return {
    totalStudents: 32,
    onTime: weekScores.filter(w => w.submissionStatus === 'on_time').length,
    late: weekScores.filter(w => w.submissionStatus === 'late').length,
    notSubmitted: weekScores.filter(w => w.submissionStatus === 'not_submitted').length,
    averageScore: Math.round(
      weekScores.filter(w => w.submissionStatus !== 'not_submitted')
        .reduce((sum, w) => sum + w.percentage, 0) / Math.max(1, weekScores.filter(w => w.submissionStatus !== 'not_submitted').length) * 100
    ) / 100,
  };
}

export function getPresentationSummary(): PresentationSummary {
  const uniqueStudents = new Set(allPresentationAssessments.map(p => p.studentId));
  const presented = new Set(
    allPresentationAssessments.filter(p => p.status !== 'not_assessed').map(p => p.studentId)
  );
  const allAvgs = students.map(s => {
    const pres = getStudentPresentations(s.id);
    return calculatePresentationAverage(pres);
  });
  const overallAvg = allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;

  return {
    totalStudents: 32,
    presented: presented.size,
    notPresented: uniqueStudents.size - presented.size,
    averageScore: Math.round(overallAvg * 100) / 100,
    passed: allAvgs.filter(a => a >= 60).length,
    failed: allAvgs.filter(a => a < 60).length,
  };
}

export function getRiskSummary(): RiskSummary {
  return {
    totalStudents: 32,
    lowRisk: allRiskScores.filter(r => r.finalLevel === 'low').length,
    mediumRisk: allRiskScores.filter(r => r.finalLevel === 'medium').length,
    highRisk: allRiskScores.filter(r => r.finalLevel === 'high').length,
    averageRiskScore: Math.round(allRiskScores.reduce((sum, r) => sum + r.totalScore, 0) / 32 * 100) / 100,
    urgentFollowUp: allRiskScores.filter(r => r.finalLevel === 'high').length,
  };
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export const notifications: Notification[] = [
  { id: 'n1', type: 'urgent', title: 'นักศึกษามีความเสี่ยงสูง', message: 'นักศึกษา 7 คนมีระดับความเสี่ยงสูง ควรติดตามโดยเร็ว', date: '2024-09-30', isRead: false, targetRole: 'instructor' },
  { id: 'n2', type: 'warning', title: 'ส่งงานล่าช้า', message: 'มีนักศึกษา 6 คนส่งงานล่าช้าในสัปดาห์ที่ 14', date: '2024-09-29', isRead: false, targetRole: 'instructor' },
  { id: 'n3', type: 'warning', title: 'คะแนนลดลงต่อเนื่อง', message: 'นักศึกษา 5 คนมีคะแนนลดลงต่อเนื่อง 3 สัปดาห์', date: '2024-09-28', isRead: false, targetRole: 'instructor' },
  { id: 'n4', type: 'info', title: 'กำหนดส่ง Final Report', message: 'กำหนดส่ง Final Report ภายในวันที่ 15 ตุลาคม 2567', date: '2024-09-27', isRead: true, targetRole: 'instructor' },
  { id: 'n5', type: 'urgent', title: 'Presentation ไม่ผ่าน', message: 'นักศึกษา 3 คนยังไม่ผ่านการนำเสนอครั้งที่ 2', date: '2024-09-26', isRead: true, targetRole: 'instructor' },
  { id: 'n6', type: 'success', title: 'อนุมัติโครงงาน', message: 'โครงงาน 18 ชิ้นได้รับการอนุมัติเรียบร้อยแล้ว', date: '2024-09-25', isRead: true, targetRole: 'instructor' },
  { id: 'n7', type: 'info', title: 'กำหนดส่งความก้าวหน้า', message: 'กำหนดส่งรายงานความก้าวหน้าสัปดาห์ที่ 15 ภายในวันศุกร์นี้', date: '2024-09-30', isRead: false, targetRole: 'student' },
  { id: 'n8', type: 'warning', title: 'นำเสนอครั้งที่ 1', message: 'กำหนดนำเสนอ Proposal ในวันที่ 7 ตุลาคม 2567', date: '2024-09-29', isRead: false, targetRole: 'student' },
  { id: 'n9', type: 'success', title: 'ผ่านการประเมิน', message: 'คุณผ่านการประเมินการนำเสนอครั้งที่ 3 ด้วยคะแนน 88%', date: '2024-09-28', isRead: true, targetRole: 'student' },
];

// ==========================================
// DOCUMENTS
// ==========================================

export const documents: Document[] = [
  { id: 'doc1', name: 'Proposal_IoT_Inventory.pdf', type: 'proposal', projectId: 'proj-s6501001', studentId: 's6501001', uploadedBy: 'นายกิตติพงศ์ สุขสวัสดิ์', uploadDate: '2024-07-15', fileSize: '2.4 MB', fileType: 'PDF', status: 'approved', version: 2, reviewer: 'ผศ.ดร.สมชาย วิทยาการ', reviewDate: '2024-07-20', feedback: 'อนุมัติ' },
  { id: 'doc2', name: 'Progress_Report_W7.pdf', type: 'progress_report', projectId: 'proj-s6501001', studentId: 's6501001', uploadedBy: 'นายกิตติพงศ์ สุขสวัสดิ์', uploadDate: '2024-08-15', fileSize: '3.1 MB', fileType: 'PDF', status: 'approved', version: 1, reviewer: 'ผศ.ดร.สมชาย วิทยาการ' },
  { id: 'doc3', name: 'Final_Report_Draft.pdf', type: 'final_report', projectId: 'proj-s6501002', studentId: 's6501002', uploadedBy: 'นายธนพล เจริญยิ่ง', uploadDate: '2024-09-25', fileSize: '5.8 MB', fileType: 'PDF', status: 'revision_needed', version: 1, reviewer: 'รศ.ดร.วิภา เทคโนโลยี', feedback: 'ควรเพิ่มบทที่ 5 การทดสอบระบบ' },
  { id: 'doc4', name: 'Proposal_Emotion_Analysis.pdf', type: 'proposal', projectId: 'proj-s6501002', studentId: 's6501002', uploadedBy: 'นายธนพล เจริญยิ่ง', uploadDate: '2024-07-10', fileSize: '1.8 MB', fileType: 'PDF', status: 'approved', version: 1 },
  { id: 'doc5', name: 'Assessment_Form_Presentation1.pdf', type: 'assessment_form', projectId: 'proj-s6501003', studentId: 's6501003', uploadedBy: 'ระบบ', uploadDate: '2024-09-07', fileSize: '0.5 MB', fileType: 'PDF', status: 'approved', version: 1 },
];

// ==========================================
// CALENDAR EVENTS
// ==========================================

export const calendarEvents: CalendarEvent[] = [
  { id: 'cal1', title: 'ส่งความก้าวหน้าสัปดาห์ที่ 15', date: '2024-10-04', type: 'deadline', status: 'upcoming', description: 'กำหนดส่งรายงานความก้าวหน้ารายสัปดาห์' },
  { id: 'cal2', title: 'นำเสนอ Proposal', date: '2024-10-07', type: 'presentation', status: 'upcoming', description: 'นำเสนอหัวข้อโครงงาน ห้อง 401' },
  { id: 'cal3', title: 'นำเสนอ Progress', date: '2024-10-14', type: 'presentation', status: 'upcoming', description: 'นำเสนอความก้าวหน้า ห้อง 401' },
  { id: 'cal4', title: 'ส่ง Pre-Final Report', date: '2024-10-18', type: 'submission', status: 'upcoming', description: 'กำหนดส่งรายงาน Pre-Final' },
  { id: 'cal5', title: 'นำเสนอ Pre-Final', date: '2024-10-21', type: 'presentation', status: 'upcoming', description: 'นำเสนอ Pre-Final ห้อง 401' },
  { id: 'cal6', title: 'นำเสนอ Final', date: '2024-10-28', type: 'presentation', status: 'upcoming', description: 'นำเสนอ Final ห้อง 401' },
  { id: 'cal7', title: 'กำหนดส่งเล่มฉบับสมบูรณ์', date: '2024-11-15', type: 'deadline', status: 'upcoming', description: 'ส่งรูปเล่มโครงงานฉบับสมบูรณ์' },
];

// ==========================================
// MOCK USERS FOR LOGIN
// ==========================================

export const users: User[] = [
  { id: 'u1', username: 'admin', password: 'admin123', role: 'admin', name: 'ผู้ดูแลระบบ', email: 'admin@kmutnb.ac.th' },
  { id: 'u2', username: 'instructor', password: 'inst123', role: 'instructor', name: 'ผศ.ดร.สมชาย วิทยาการ', email: 'somchai@kmutnb.ac.th' },
  { id: 'u3', username: 'student', password: 'stud123', role: 'student', name: 'นายกิตติพงศ์ สุขสวัสดิ์', email: 'student1@kmutnb.ac.th' },
];

// ==========================================
// CHART DATA HELPERS
// ==========================================

export function getWeeklyAverageByWeek(): { week: string; average: number }[] {
  const result = [];
  for (let w = 1; w <= 14; w++) {
    const weekScores = allWeeklyScores
      .filter(s => s.week === w && s.submissionStatus !== 'not_submitted');
    const avg = weekScores.length > 0
      ? weekScores.reduce((sum, s) => sum + s.percentage, 0) / weekScores.length
      : 0;
    result.push({ week: `W${w}`, average: Math.round(avg * 100) / 100 });
  }
  return result;
}

export function getSubmissionStatusByWeek(): { week: string; onTime: number; late: number; notSubmitted: number }[] {
  const result = [];
  for (let w = 1; w <= 14; w++) {
    const weekScores = allWeeklyScores.filter(s => s.week === w);
    result.push({
      week: `W${w}`,
      onTime: weekScores.filter(s => s.submissionStatus === 'on_time').length,
      late: weekScores.filter(s => s.submissionStatus === 'late').length,
      notSubmitted: weekScores.filter(s => s.submissionStatus === 'not_submitted').length,
    });
  }
  return result;
}

export function getPresentationAverageByRound(): { round: string; average: number }[] {
  return [1, 2, 3, 4].map(num => {
    const roundScores = allPresentationAssessments.filter(p => p.presentationNumber === num);
    const avg = roundScores.length > 0
      ? roundScores.reduce((sum, p) => sum + p.percentage, 0) / roundScores.length
      : 0;
    const labels = ['Proposal', 'Progress', 'Pre-Final', 'Final'];
    return { round: labels[num - 1], average: Math.round(avg * 100) / 100 };
  });
}

export function getRiskDistribution(): { level: string; count: number; color: string }[] {
  return [
    { level: 'Low Risk', count: allRiskScores.filter(r => r.finalLevel === 'low').length, color: '#22C55E' },
    { level: 'Medium Risk', count: allRiskScores.filter(r => r.finalLevel === 'medium').length, color: '#F97316' },
    { level: 'High Risk', count: allRiskScores.filter(r => r.finalLevel === 'high').length, color: '#EF4444' },
  ];
}

export function getScoreLevelDistribution(): { level: string; count: number; color: string }[] {
  const counts = { excellent: 0, good: 0, needs_improvement: 0, needs_attention: 0 };
  students.forEach(s => {
    const avg = calculateWeeklyAverage(getStudentWeeklyScores(s.id));
    if (avg >= 85) counts.excellent++;
    else if (avg >= 70) counts.good++;
    else if (avg >= 60) counts.needs_improvement++;
    else counts.needs_attention++;
  });
  return [
    { level: 'ดีมาก', count: counts.excellent, color: '#22C55E' },
    { level: 'ดี', count: counts.good, color: '#EAB308' },
    { level: 'ควรปรับปรุง', count: counts.needs_improvement, color: '#F97316' },
    { level: 'ต้องติดตาม', count: counts.needs_attention, color: '#EF4444' },
  ];
}

export function getProjectStatusDistribution(): { status: string; count: number; color: string }[] {
  return [
    { status: 'เสร็จสิ้น', count: projects.filter(p => p.status === 'completed').length, color: '#22C55E' },
    { status: 'ส่งเล่มแล้ว', count: projects.filter(p => p.status === 'submitted').length, color: '#3B82F6' },
    { status: 'กำลังดำเนินการ', count: projects.filter(p => p.status === 'in_progress').length, color: '#EAB308' },
    { status: 'แก้ไข', count: projects.filter(p => p.status === 'revision').length, color: '#F97316' },
  ];
}

export function getRiskFactorsData(): { factor: string; count: number }[] {
  const factors: Record<string, number> = {
    'การส่งงานช้า/ไม่ส่งงาน': 0,
    'คะแนนนำเสนอต่ำ': 0,
    'คะแนนแนวโน้มลดลง': 0,
    'ไม่แก้ไขงานตามข้อเสนอแนะ': 0,
    'การสื่อสาร': 0,
  };

  allRiskScores.forEach(r => {
    r.appliedRules.forEach(rule => {
      if (rule.includes('ไม่ส่งงาน')) factors['การส่งงานช้า/ไม่ส่งงาน']++;
      if (rule.includes('Presentation')) factors['คะแนนนำเสนอต่ำ']++;
      if (rule.includes('คะแนนลดลง')) factors['คะแนนแนวโน้มลดลง']++;
      if (rule.includes('Feedback')) factors['ไม่แก้ไขงานตามข้อเสนอแนะ']++;
    });
    if (r.breakdown.communicationScore < 60) factors['การสื่อสาร']++;
  });

  return Object.entries(factors).map(([factor, count]) => ({ factor, count }));
}
