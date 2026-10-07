import React, { useState } from 'react';
import { Settings, Save, AlertCircle, Plus, Trash2, RotateCcw, Eye, Edit3 } from 'lucide-react';

interface Criterion { id: number; name: string; maxScore: number; weight: number; }

const initialWeeklyCriteria: Criterion[] = [
  { id: 1, name: 'ความเข้าใจในงานที่ทำ', maxScore: 5, weight: 16.67 },
  { id: 2, name: 'ความก้าวหน้าของงานเปรียบเทียบกับแผน', maxScore: 5, weight: 16.67 },
  { id: 3, name: 'การแก้ปัญหาเฉพาะหน้า', maxScore: 5, weight: 16.67 },
  { id: 4, name: 'ความรับผิดชอบต่องานที่ได้รับมอบหมาย', maxScore: 5, weight: 16.67 },
  { id: 5, name: 'การนำเสนอผลงาน (ความชัดเจน, เข้าใจง่าย)', maxScore: 5, weight: 16.67 },
  { id: 6, name: 'การตรงต่อเวลา', maxScore: 5, weight: 16.65 },
];

const initialPresCriteria: Criterion[] = [
  { id: 1, name: 'ความก้าวหน้าของระบบเทียบกับแผน', maxScore: 5, weight: 20 },
  { id: 2, name: 'ความสมบูรณ์ของระบบในส่วนที่นำเสนอ', maxScore: 5, weight: 20 },
  { id: 3, name: 'ความเข้าใจในระบบที่พัฒนา', maxScore: 5, weight: 20 },
  { id: 4, name: 'การตอบคำถาม', maxScore: 5, weight: 20 },
  { id: 5, name: 'การจัดทำเอกสาร/สไลด์นำเสนอ', maxScore: 5, weight: 20 },
];

const initialRiskWeights = [
  { id: 1, name: 'คะแนนความก้าวหน้า (Weekly)', weight: 40 },
  { id: 2, name: 'คะแนนการนำเสนอ (Presentation)', weight: 30 },
  { id: 3, name: 'การส่งเอกสารตรงเวลา', weight: 15 },
  { id: 4, name: 'คุณภาพเนื้อหา', weight: 10 },
  { id: 5, name: 'การสื่อสาร', weight: 5 },
];

const initialGradeThresholds = [
  { id: 1, label: 'ดีมาก (Excellent)', min: 85, max: 100, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-300' },
  { id: 2, label: 'ดี (Good)', min: 70, max: 84, color: 'bg-yellow-500', lightBg: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
  { id: 3, label: 'ควรปรับปรุง (Needs Improvement)', min: 60, max: 69, color: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-300' },
  { id: 4, label: 'ต้องติดตาม (Needs Attention)', min: 0, max: 59, color: 'bg-red-500', lightBg: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-300' },
];

type TabKey = 'weekly' | 'presentation' | 'risk' | 'grades';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'weekly', label: 'Weekly Progress' },
  { key: 'presentation', label: 'Presentation Rubric' },
  { key: 'risk', label: 'Risk Score Weights' },
  { key: 'grades', label: 'Grade Thresholds' },
];

const CriteriaManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('weekly');
  const [editMode, setEditMode] = useState(false);
  const [weeklyCriteria, setWeeklyCriteria] = useState(initialWeeklyCriteria);
  const [presCriteria, setPresCriteria] = useState(initialPresCriteria);
  const [riskWeights, setRiskWeights] = useState(initialRiskWeights);
  const [gradeThresholds, setGradeThresholds] = useState(initialGradeThresholds);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setWeeklyCriteria(initialWeeklyCriteria);
    setPresCriteria(initialPresCriteria);
    setRiskWeights(initialRiskWeights);
    setGradeThresholds(initialGradeThresholds);
  };

  const updateCriterion = (list: Criterion[], setList: React.Dispatch<React.SetStateAction<Criterion[]>>, id: number, field: keyof Criterion, value: number | string) => {
    setList(list.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCriterion = (list: Criterion[], setList: React.Dispatch<React.SetStateAction<Criterion[]>>) => {
    const newId = Math.max(...list.map(c => c.id), 0) + 1;
    setList([...list, { id: newId, name: 'เกณฑ์ใหม่', maxScore: 5, weight: 0 }]);
  };

  const removeCriterion = (list: Criterion[], setList: React.Dispatch<React.SetStateAction<Criterion[]>>, id: number) => {
    setList(list.filter(c => c.id !== id));
  };

  const totalWeight = (list: { weight: number }[]) => Math.round(list.reduce((s, c) => s + c.weight, 0) * 100) / 100;

  const renderCriteriaTable = (criteria: Criterion[], setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>, totalMaxLabel: string) => {
    const tw = totalWeight(criteria);
    const totalMax = criteria.reduce((s, c) => s + c.maxScore, 0);
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 text-slate-500 text-sm border-b border-brand-100">
                <th className="p-4 font-medium w-12">ลำดับ</th>
                <th className="p-4 font-medium">ชื่อเกณฑ์</th>
                <th className="p-4 font-medium w-28 text-center">คะแนนเต็ม</th>
                <th className="p-4 font-medium w-28 text-center">สัดส่วน (%)</th>
                {editMode && <th className="p-4 font-medium w-16 text-center">ลบ</th>}
              </tr>
            </thead>
            <tbody className="text-sm">
              {criteria.map((c, idx) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4">
                    {editMode ? (
                      <input
                        type="text"
                        value={c.name}
                        onChange={e => updateCriterion(criteria, setCriteria, c.id, 'name', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                      />
                    ) : (
                      <span className="text-gray-800">{c.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editMode ? (
                      <input
                        type="number"
                        value={c.maxScore}
                        onChange={e => updateCriterion(criteria, setCriteria, c.id, 'maxScore', Number(e.target.value))}
                        className="w-20 p-2 border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{c.maxScore}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={c.weight}
                        onChange={e => updateCriterion(criteria, setCriteria, c.id, 'weight', Number(e.target.value))}
                        className="w-20 p-2 border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                      />
                    ) : (
                      <span className="text-gray-700">{c.weight}%</span>
                    )}
                  </td>
                  {editMode && (
                    <td className="p-4 text-center">
                      <button onClick={() => removeCriterion(criteria, setCriteria, c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold text-sm">
                <td className="p-4" colSpan={2}>รวม</td>
                <td className="p-4 text-center">{totalMax} คะแนน</td>
                <td className="p-4 text-center">
                  <span className={tw !== 100 ? 'text-red-600' : 'text-emerald-600'}>
                    {tw}%
                  </span>
                </td>
                {editMode && <td className="p-4" />}
              </tr>
            </tfoot>
          </table>
        </div>
        {tw !== 100 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>สัดส่วนรวมไม่เท่ากับ 100% (ปัจจุบัน: {tw}%)</span>
          </div>
        )}
        {editMode && (
          <button
            onClick={() => addCriterion(criteria, setCriteria)}
            className="flex items-center gap-2 px-4 py-2 text-brand-700 border border-dashed border-brand-700/30 rounded-lg hover:bg-brand-700/5 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> เพิ่มเกณฑ์
          </button>
        )}
      </div>
    );
  };

  const renderRiskWeights = () => {
    const tw = totalWeight(riskWeights);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskWeights.map(item => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <span className="text-sm font-medium text-gray-700 block mb-3">{item.name}</span>
              {editMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.weight}
                    onChange={e => setRiskWeights(riskWeights.map(r => r.id === item.id ? { ...r, weight: Number(e.target.value) } : r))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                  <span className="text-sm font-bold text-gray-500">%</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-brand-700 h-2.5 rounded-full" style={{ width: `${item.weight}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 min-w-[40px] text-right">{item.weight}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {tw !== 100 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>น้ำหนักรวมไม่เท่ากับ 100% (ปัจจุบัน: {tw}%)</span>
          </div>
        )}
      </div>
    );
  };

  const renderGradeThresholds = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gradeThresholds.map(grade => (
        <div key={grade.id} className={`rounded-xl border ${grade.borderColor} ${grade.lightBg} p-5`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${grade.color}`} />
            <h3 className={`font-bold ${grade.textColor}`}>{grade.label}</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">คะแนนต่ำสุด</label>
              {editMode ? (
                <input
                  type="number"
                  value={grade.min}
                  onChange={e => setGradeThresholds(gradeThresholds.map(g => g.id === grade.id ? { ...g, min: Number(e.target.value) } : g))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              ) : (
                <div className="text-2xl font-bold text-gray-800 text-center">{grade.min}</div>
              )}
            </div>
            <span className="text-gray-400 font-bold text-lg mt-4">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">คะแนนสูงสุด</label>
              {editMode ? (
                <input
                  type="number"
                  value={grade.max}
                  onChange={e => setGradeThresholds(gradeThresholds.map(g => g.id === grade.id ? { ...g, max: Number(e.target.value) } : g))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              ) : (
                <div className="text-2xl font-bold text-gray-800 text-center">{grade.max}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="page-hero flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="page-hero-title">จัดการเกณฑ์ประเมิน</h1>
          <p className="page-hero-sub">ตั้งค่าเกณฑ์การให้คะแนนและคำนวณความเสี่ยง</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editMode ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {editMode ? <><Eye className="w-4 h-4" /> โหมดดู</> : <><Edit3 className="w-4 h-4" /> โหมดแก้ไข</>}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" /> รีเซ็ต
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" /> บันทึก
          </button>
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm font-medium flex items-center gap-2 animate-pulse">
          <Settings className="w-4 h-4" /> บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-brand-700 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-brand-50/50'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-700" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'weekly' && renderCriteriaTable(weeklyCriteria, setWeeklyCriteria, 'รวม 30 คะแนน')}
          {activeTab === 'presentation' && renderCriteriaTable(presCriteria, setPresCriteria, 'รวม 25 คะแนน')}
          {activeTab === 'risk' && renderRiskWeights()}
          {activeTab === 'grades' && renderGradeThresholds()}
        </div>
      </div>
    </div>
  );
};

export default CriteriaManagement;
