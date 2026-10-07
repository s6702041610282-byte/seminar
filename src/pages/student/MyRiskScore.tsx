import { useMemo } from 'react';
import { getStudentRiskScore, getStudentWeeklyScores, getStudentPresentations } from '../../data/mockData';
import { countConsecutiveDecline, getRiskLevel } from '../../utils/calculations';
import { RISK_FACTORS, RISK_RULES_INFO, LEVEL_TEXT } from '../../utils/riskExplain';
import RiskExplainer, { RiskScale } from '../../components/common/RiskExplainer';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Lightbulb, ArrowUp } from 'lucide-react';

const MyRiskScore = () => {
  const studentId = 's6501001';
  const risk = getStudentRiskScore(studentId);
  const weeklyScores = getStudentWeeklyScores(studentId);
  const presentations = getStudentPresentations(studentId);

  const ruleStatus = useMemo(() => {
    const notSubmitted = weeklyScores.filter(w => w.submissionStatus === 'not_submitted').length;
    const decline = countConsecutiveDecline(weeklyScores.map(w => w.percentage).filter(p => p > 0));
    const failed = presentations.filter(p => p.status === 'failed').length;
    const feedbackHit = !!risk?.appliedRules.some(r => r.includes('Feedback'));
    return {
      missed: { hit: notSubmitted >= 3, value: `ไม่ส่ง ${notSubmitted} ครั้ง` },
      decline: { hit: decline >= 3, value: `ลดลงติดต่อกันสูงสุด ${decline} สัปดาห์` },
      failedPres: { hit: failed >= 2, value: `ไม่ผ่าน ${failed} ครั้ง` },
      feedback: { hit: feedbackHit, value: feedbackHit ? 'มีความเห็นที่ยังไม่ได้แก้ไข' : 'แก้ไขครบแล้ว' },
    } as Record<string, { hit: boolean; value: string }>;
  }, [weeklyScores, presentations, risk]);

  if (!risk) return <div className="p-6 text-center text-gray-500">ยังไม่มีข้อมูลการประเมินความเสี่ยง</div>;

  const level = risk.finalLevel;
  const text = LEVEL_TEXT[level];
  const scoreLevel = getRiskLevel(risk.totalScore);
  const adjusted = scoreLevel !== level;
  const LevelIcon = level === 'low' ? ShieldCheck : level === 'medium' ? AlertTriangle : ShieldAlert;

  const factors = RISK_FACTORS.map(f => {
    const raw = risk.breakdown[f.key];
    return { ...f, raw, points: raw * f.weight, max: f.weight * 100 };
  });
  // ด้านที่เสียคะแนนมากที่สุด = จุดที่ควรปรับก่อน
  const weakest = [...factors].sort((a, b) => (b.max - b.points) - (a.max - a.points))[0];
  const hitRules = RISK_RULES_INFO.filter(r => ruleStatus[r.id]?.hit);

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <h1 className="page-hero-title">การประเมินความเสี่ยง</h1>
        <p className="page-hero-sub">My Risk Assessment</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 flex items-start gap-4">
            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${text.tone.bg} ${text.tone.text}`}>
              <LevelIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500">ระดับความเสี่ยงของคุณ</p>
              <h2 className={`text-2xl font-bold ${text.tone.text}`}>{text.title}</h2>
              <p className="mt-1 text-slate-700">{text.meaning}</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-sm text-slate-500">คะแนนผลการดำเนินงาน <span className="text-slate-400">(ยิ่งสูงยิ่งดี)</span></p>
              <p className="text-2xl font-bold text-slate-900">{risk.totalScore.toFixed(1)}<span className="text-base font-medium text-slate-400">/100</span></p>
            </div>
            <RiskScale score={risk.totalScore} />
          </div>
        </div>

        {adjusted && (
          <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <ArrowUp className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-amber-900">
              คะแนนของคุณอยู่ในช่วง <strong>{LEVEL_TEXT[scoreLevel].title}</strong> แต่ระบบปรับเป็น <strong>{text.title}</strong> เพราะ{' '}
              {hitRules.map(r => r.label).join(' และ ')}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Breakdown */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">คะแนนมาจากไหน</h3>
          <p className="text-sm text-slate-500 mb-5">คะแนนแต่ละด้านคูณน้ำหนัก แล้วรวมกันเป็นคะแนนเต็ม 100</p>
          <div className="space-y-5">
            {factors.map(f => (
              <div key={f.key}>
                <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                  <span className="font-medium text-slate-800">
                    {f.label} <span className="font-normal text-slate-400">· น้ำหนัก {Math.round(f.weight * 100)}%</span>
                    {f.key === weakest.key && <span className="ml-2 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">ควรปรับก่อน</span>}
                  </span>
                  <span className="shrink-0 text-slate-900">
                    <strong>{f.points.toFixed(1)}</strong><span className="text-slate-400">/{f.max}</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${f.raw >= 80 ? 'bg-green-500' : f.raw >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, f.raw)}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">ได้ {f.raw.toFixed(1)}% · {f.source}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-slate-100 pt-4 text-sm">
            <span className="font-semibold text-slate-700">รวม</span>
            <span className="font-bold text-slate-900">{risk.totalScore.toFixed(1)}/100</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Rules */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900">สัญญาณเตือน</h3>
            <p className="text-sm text-slate-500 mb-4">ถ้าพบข้อใด ระดับความเสี่ยงจะเพิ่มขึ้น 1 ขั้น</p>
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

          {/* Tips */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />ทำอย่างไรให้คะแนนดีขึ้น</h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="rounded-lg bg-slate-50 p-3">
                <span className="font-semibold text-slate-900">{weakest.label}:</span> {weakest.tip}
              </li>
              {hitRules.map(r => (
                <li key={r.id} className="rounded-lg bg-amber-50 p-3 text-amber-900">แก้ปัญหา "{r.label}" เพื่อให้ระดับความเสี่ยงลดลง</li>
              ))}
              {risk.recommendation.split(' | ').map(t => <li key={t} className="px-1">{t}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <RiskExplainer />
    </div>
  );
};

export default MyRiskScore;
