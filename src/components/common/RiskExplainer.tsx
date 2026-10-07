import { useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { RISK_FACTORS, RISK_RULES_INFO, LEVEL_TEXT, RISK_THRESHOLDS } from '../../utils/riskExplain';
import type { RiskLevel } from '../../types';

/** แถบสเกล 3 ช่วง พร้อมตัวชี้ตำแหน่งคะแนน */
export function RiskScale({ score }: { score?: number }) {
  const zones: { level: RiskLevel; from: number; to: number }[] = [
    { level: 'high', from: 0, to: RISK_THRESHOLDS.medium },
    { level: 'medium', from: RISK_THRESHOLDS.medium, to: RISK_THRESHOLDS.low },
    { level: 'low', from: RISK_THRESHOLDS.low, to: 100 },
  ];
  return (
    <div>
      <div className="relative pt-7">
        {score !== undefined && (
          <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${Math.min(100, Math.max(0, score))}%` }}>
            <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-xs font-bold text-white">{score.toFixed(1)}</span>
            <span className="h-2 w-0.5 bg-slate-900" />
          </div>
        )}
        <div className="flex h-3 overflow-hidden rounded-full">
          {zones.map(z => (
            <div key={z.level} className={`${LEVEL_TEXT[z.level].tone.bar} opacity-80`} style={{ width: `${z.to - z.from}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-2 flex text-xs text-slate-500">
        {zones.map(z => (
          <div key={z.level} style={{ width: `${z.to - z.from}%` }} className={z.level === 'high' ? 'text-left' : z.level === 'low' ? 'text-right' : 'text-center'}>
            <span className={`font-semibold ${LEVEL_TEXT[z.level].tone.text}`}>{LEVEL_TEXT[z.level].title.replace('ความเสี่ยง', '')}</span>
            <span className="block">{z.level === 'high' ? `0–${z.to - 1}` : `${z.from}–${z.level === 'low' ? 100 : z.to - 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** กล่องอธิบายวิธีคำนวณ (กดเปิด/ปิดได้) */
export default function RiskExplainer({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-200">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left">
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <CircleHelp className="w-5 h-5 text-brand-600" /> Risk Score คำนวณอย่างไร?
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-6 text-sm">
          <p className="text-slate-700">
            Risk Score คือคะแนนผลการดำเนินโครงงาน <strong>เต็ม 100 คะแนน ยิ่งสูงยิ่งดี</strong> ใช้บอกว่านักศึกษามีโอกาสทำโครงงานไม่สำเร็จตามกำหนดมากน้อยแค่ไหน
          </p>

          <div>
            <p className="font-semibold text-slate-900 mb-3">1. ระดับความเสี่ยงตามคะแนน</p>
            <RiskScale />
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-2">2. คะแนนมาจาก 5 ด้าน (ถ่วงน้ำหนัก)</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500">
                    <th className="px-4 py-2.5 font-semibold">ด้าน</th>
                    <th className="px-4 py-2.5 font-semibold text-center">น้ำหนัก</th>
                    <th className="px-4 py-2.5 font-semibold">วัดจาก</th>
                  </tr>
                </thead>
                <tbody>
                  {RISK_FACTORS.map(f => (
                    <tr key={f.key} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{f.label}</td>
                      <td className="px-4 py-2.5 text-center font-semibold text-slate-900">{Math.round(f.weight * 100)}%</td>
                      <td className="px-4 py-2.5 text-slate-600">{f.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">3. กฎปรับระดับ</p>
            <p className="text-slate-600 mb-2">ถ้าเข้าเงื่อนไขข้อใด ระดับความเสี่ยงจะ<strong>เพิ่มขึ้น 1 ขั้นต่อข้อ</strong> แม้คะแนนรวมจะดี</p>
            <ul className="space-y-1.5">
              {RISK_RULES_INFO.map(r => (
                <li key={r.id} className="flex gap-2 text-slate-700">
                  <span className="text-slate-400">•</span>
                  <span><span className="font-medium">{r.label}</span> {r.condition}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
