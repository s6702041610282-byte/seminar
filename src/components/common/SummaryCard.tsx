import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  color = 'blue'
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-brand-100 text-brand-700',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const iconColorClass = colorMap[color] || colorMap.blue;

  return (
    <div className="relative bg-white rounded-2xl shadow-card border border-slate-200 p-6 flex flex-col font-sans">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${iconColorClass}`}>
          <Icon size={24} />
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-lg ${
            changeType === 'positive' ? 'text-green-700 bg-green-50' :
            changeType === 'negative' ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-50'
          }`}>
            {changeType === 'positive' && <TrendingUp size={16} className="mr-1" />}
            {changeType === 'negative' && <TrendingDown size={16} className="mr-1" />}
            {changeType === 'neutral' && <Minus size={16} className="mr-1" />}
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-[26px] leading-tight font-bold tracking-tight text-slate-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
