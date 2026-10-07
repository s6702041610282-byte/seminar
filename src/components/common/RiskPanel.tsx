import { useMemo, useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Lightbulb, ArrowUp, ChevronDown } from 'lucide-react';
import { getStudentRiskScore, getStudentWeeklyScores, getStudentPresentations } from '../../data/mockData';
import { countConsecutiveDecline, getRiskLevel } from '../../utils/calculations';
import { RISK_FACTORS, RISK_RULES_INFO, LEVEL_TEXT } from '../../utils/riskExplain';
import { RiskScale } from './RiskExplainer';

type Audience = 'student' | 'instructor';

/** คำนวณข้อมูลที่ใช้แสดงผลของนักศึกษา 1 คน */
export function useRiskView(studentId: string) {
  const risk = getStudentRiskScore(studentId);
  const weeklyScores = getStudentWeeklyScores(studentId);
  const presentations = getStudentPresentations(studentId);

  return useMemo(() => {
    if (!risk) return null;
    const notSubmitted = weeklyScores.filter(w => w.submissionStatus === 'not_submitted').length;
    const decline = countConsecutiveDecline(weeklyScores.map(w => w.percentage).filter(p => p > 0));
    const failed = presentations.filter(p => p.status === 'failed').length;
    const feedbackHit = risk.appliedRules.some(r => r.includes('Feedback'));
    const ruleStatus: Record<string, { hit: boolean; value: string }> = {
      missed: { hit: notSubmitted >= 3, value: `ไม่ส่ง ${notSubmitted} ครั้ง` },
      decline: { hit: decline >= 3, value: `ลดลงติดต่อกันสูงสุด ${decline} สัปดาห์` },
      failedPres: { hit: failed >= 2, value: `ไม่ผ่าน ${failed} ครั้ง` },
      feedback: { hit: feedbackHit, value: feedbackHit ? 'มีความเห็นที่ยังไม่ได้แก้ไข' : 'แก้ไขครบแล้ว' },
    };
    const factors = RISK_FACTORS.map(f => {
      const raw = risk.breakdown[f.key] ?? 0;
      return { ...f, raw, points: raw * f.weight, max: f.weight * 100 };
    });
    const weakest = [...factors].sort((a, b) => (b.max - b.points) - (a.max - a.points))[0];
    const hitRules = RISK_RULES_INFO.filter(r => ruleStatus[r.id]?.hit);
    const scoreLevel = getRiskLevel(risk.totalScore);
    return { risk, ruleStatus, factors, weakest, hitRules, scoreLevel, level: risk.finalLevel };
  }, [risk, weeklyScores, presentations]);
}

const levelIcon = (level: string) => (level === 'low' ? ShieldCheck : level === 'medium' ? AlertTriangle : ShieldAlert);

/** รายละเอียดเต็ม: ที่มาของคะแนน สัญญาณเตือน คำแนะนำ */
export function RiskDetail({ studentId, audience = 'student' }: { studentId: string; audience?: Audience }) {
  const v = useRiskView(studentId);
  if (!v) return <p className="text-sm text-slate-500">ยังไม่มีข้อมูลการประเมินความเสี่ยง</p>;
  const { risk, ruleStatus, factors, weakest, hitRules, scoreLevel, level } = v;

  return (
    <div className="space-y-6">
      {scoreLevel !== level && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <ArrowUp className="w-5 h-5 shrink-0 text-amber-600" />
          <p className="text-amber-900">
            คะแนนอยู่ในช่วง <strong>{LEVEL_TEXT[scoreLevel].title}</strong> แต่ระบบปรับเป็น <strong>{LEVEL_TEXT[level].title}</strong> เพราะ{' '}
            {hitRules.map(r => r.label).join(' และ ')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <h4 className="font-bold text-slate-900">คะแนนมาจากไหน</h4>
          <p className="text-sm text-slate-500 mb-4">คะแนนแต่ละด้านคูณน้ำหนัก แล้วรวมเป็นคะแนนเต็ม 100</p>
          <div className="space-y-4">
            {factors.map(f => (
              <div key={f.key}>
                <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                  <span className="font-medium text-slate-800">
                    {f.label} <span className="font-normal text-slate-400">· {Math.round(f.weight * 100)}%</span>
                    {f.key === weakest.key && <span className="ml-2 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">ควรปรับก่อน</span>}
                  </span>
                  <span className="shrink-0 text-slate-900"><strong>{f.points.toFixed(1)}</strong><span className="text-slate-400">/{f.max}</span></span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${f.raw >= 80 ? 'bg-green-500' : f.raw >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, f.raw)}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">ได้ {f.raw.toFixed(1)}% · {f.source}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-slate-100 pt-3 text-sm">
            <span className="font-semibold text-slate-700">รวม</span>
            <span className="font-bold text-slate-900">{risk.totalScore.toFixed(1)}/100</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h4 className="font-bold text-slate-900">สัญญาณเตือน</h4>
            <p className="text-sm text-slate-500 mb-3">ถ้าพบข้อใด ระดับความเสี่ยงจะเพิ่มขึ้น 1 ขั้น</p>
            <ul className="space-y-3">
              {RISK_RULES_INFO.map(r => {
                const st = ruleStatus[r.id];
                return (
                  <li key={r.id} className="flex gap-3 text-sm">
                    {st.hit ? <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" /> : <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />}
                    <div>
                      <p className="font-medium text-slate-800">{r.label} <span className="font-normal text-slate-400">({r.condition})</span></p>
                      <p className={st.hit ? 'text-amber-700' : 'text-slate-500'}>{st.hit ? 'พบ' : 'ไม่พบ'} · {st.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />{audience === 'student' ? 'ทำอย่างไรให้คะแนนดีขึ้น' : 'แนวทางช่วยเหลือนักศึกษา'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="rounded-lg bg-slate-50 p-3"><span className="font-semibold text-slate-900">{weakest.label}:</span> {weakest.tip}</li>
              {hitRules.map(r => <li key={r.id} className="rounded-lg bg-amber-50 p-3 text-amber-900">แก้ปัญหา "{r.label}" เพื่อให้ระดับความเสี่ยงลดลง</li>)}
              {audience === 'instructor' && risk.recommendation.split(' | ').map(t => <li key={t} className="px-1">{t}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** การ์ดสรุป + กางดูรายละเอียดได้ */
export function RiskSummaryCard({ studentId, audience = 'student', defaultOpen = false }: { studentId: string; audience?: Audience; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const v = useRiskView(studentId);
  if (!v) return null;
  const { risk, level, weakest, hitRules } = v;
  const text = LEVEL_TEXT[level];
  const Icon = levelIcon(level);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-200">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-2 flex items-start gap-4">
            <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${text.tone.bg} ${text.tone.text}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">{audience === 'student' ? 'ระดับความเสี่ยงของคุณ' : 'ระดับความเสี่ยง'}</p>
              <h3 className={`text-xl font-bold ${text.tone.text}`}>{text.title}</h3>
              <p className="text-sm text-slate-600">{text.meaning}</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-sm text-slate-500">คะแนนผลการดำเนินงาน <span className="text-slate-400">(ยิ่งสูงยิ่งดี)</span></p>
              <p className="text-xl font-bold text-slate-900">{risk.totalScore.toFixed(1)}<span className="text-sm font-medium text-slate-400">/100</span></p>
            </div>
            <RiskScale score={risk.totalScore} />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
          <p className="text-slate-600">
            <span className="font-medium text-slate-800">ควรปรับ:</span> {weakest.label}
            {hitRules.length > 0 && <span className="text-amber-700"> · สัญญาณเตือน {hitRules.length} ข้อ</span>}
          </p>
          <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
            className="inline-flex items-center gap-1 self-start sm:self-auto font-medium text-brand-700 hover:text-brand-800">
            {open ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-100 p-6">
          <RiskDetail studentId={studentId} audience={audience} />
        </div>
      )}
    </div>
  );
}
