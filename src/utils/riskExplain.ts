import type { RiskLevel, RiskScoreBreakdown } from '../types';

/* ==========================================================
   คำอธิบาย Risk Score (ใช้ร่วมกันทุกหน้า)
   สูตรจริงอยู่ที่ utils/calculations.ts → calculateRiskScore / getRiskLevel / applyRiskRules
   ========================================================== */

/** เกณฑ์แบ่งระดับ: คะแนนยิ่งสูง = ความเสี่ยงยิ่งต่ำ */
export const RISK_THRESHOLDS = { low: 80, medium: 60 };

export interface RiskFactor {
  key: keyof RiskScoreBreakdown;
  label: string;
  weight: number;
  source: string;
  tip: string;
}

export const RISK_FACTORS: RiskFactor[] = [
  { key: 'weeklyScore', label: 'ความก้าวหน้ารายสัปดาห์', weight: 0.40, source: 'ค่าเฉลี่ยคะแนนรายงานความก้าวหน้า 14 สัปดาห์', tip: 'ส่งรายงานความก้าวหน้าให้ครบทุกสัปดาห์ และระบุงานที่ทำเสร็จให้ชัดเจน' },
  { key: 'presentationScore', label: 'การนำเสนอ', weight: 0.30, source: 'ค่าเฉลี่ยคะแนน Presentation ที่ประเมินแล้ว', tip: 'ซ้อมนำเสนอล่วงหน้าและเตรียมคำตอบสำหรับคำถามที่คาดว่ากรรมการจะถาม' },
  { key: 'submissionScore', label: 'การส่งงานตรงเวลา', weight: 0.15, source: 'สัดส่วนสัปดาห์ที่ส่งงานตรงเวลา จาก 14 สัปดาห์', tip: 'ตั้งเตือนกำหนดส่ง และส่งงานก่อนกำหนดอย่างน้อย 1 วัน' },
  { key: 'contentScore', label: 'คุณภาพเนื้อหา', weight: 0.10, source: 'ค่าเฉลี่ยคะแนนด้านเนื้อหาในรายงานรายสัปดาห์', tip: 'อธิบายวิธีการและผลลัพธ์ให้ละเอียดขึ้น พร้อมหลักฐานประกอบ' },
  { key: 'communicationScore', label: 'การสื่อสารกับอาจารย์ที่ปรึกษา', weight: 0.05, source: 'การเข้าพบและการติดต่ออาจารย์ที่ปรึกษา', tip: 'นัดพบอาจารย์ที่ปรึกษาอย่างสม่ำเสมอ และแจ้งปัญหาตั้งแต่เนิ่น ๆ' },
];

export interface RiskRuleInfo {
  id: string;
  label: string;
  condition: string;
}

export const RISK_RULES_INFO: RiskRuleInfo[] = [
  { id: 'missed', label: 'ไม่ส่งงานรายสัปดาห์', condition: 'ตั้งแต่ 3 ครั้งขึ้นไป' },
  { id: 'decline', label: 'คะแนนลดลงติดต่อกัน', condition: 'ตั้งแต่ 3 สัปดาห์ขึ้นไป' },
  { id: 'failedPres', label: 'Presentation ไม่ผ่าน', condition: 'ตั้งแต่ 2 ครั้งขึ้นไป' },
  { id: 'feedback', label: 'ไม่แก้ไขงานตาม Feedback ของอาจารย์', condition: 'มีความเห็นที่ยังไม่ได้แก้ไข' },
];

export const LEVEL_TEXT: Record<RiskLevel, { title: string; meaning: string; range: string; tone: { bg: string; text: string; ring: string; bar: string } }> = {
  low: {
    title: 'ความเสี่ยงต่ำ',
    meaning: 'โครงงานเป็นไปตามแผน มีโอกาสสำเร็จตามกำหนดสูง',
    range: `${RISK_THRESHOLDS.low}–100 คะแนน`,
    tone: { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-200', bar: 'bg-green-500' },
  },
  medium: {
    title: 'ความเสี่ยงปานกลาง',
    meaning: 'มีบางด้านที่ต้องติดตาม หากปล่อยไว้อาจทำให้โครงงานล่าช้า',
    range: `${RISK_THRESHOLDS.medium}–${RISK_THRESHOLDS.low - 1} คะแนน`,
    tone: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', bar: 'bg-amber-500' },
  },
  high: {
    title: 'ความเสี่ยงสูง',
    meaning: 'มีโอกาสสูงที่โครงงานจะไม่สำเร็จตามกำหนด ควรได้รับการช่วยเหลือโดยเร็ว',
    range: `ต่ำกว่า ${RISK_THRESHOLDS.medium} คะแนน`,
    tone: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', bar: 'bg-red-500' },
  },
};
