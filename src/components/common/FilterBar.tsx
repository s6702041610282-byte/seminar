import React from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: Filter[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, values, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-card border border-slate-200/70 font-sans">
      <span className="text-sm font-bold text-gray-700">ตัวกรอง:</span>
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center space-x-2">
          <label htmlFor={`filter-${filter.key}`} className="text-sm text-gray-500 whitespace-nowrap">
            {filter.label}
          </label>
          <select
            id={`filter-${filter.key}`}
            value={values[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-gray-50 min-w-[120px]"
          >
            <option value="">ทั้งหมด</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
