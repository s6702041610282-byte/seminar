import React from 'react';
import { Check } from 'lucide-react';

type StepStatus = 'completed' | 'in_progress' | 'pending' | 'rejected';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
  stepStatuses?: StepStatus[];
  direction?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  stepStatuses,
  direction = 'horizontal' 
}) => {
  const getStatus = (index: number): StepStatus => {
    if (stepStatuses && stepStatuses[index]) return stepStatuses[index];
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'in_progress';
    return 'pending';
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-green-500';
      case 'in_progress': return 'bg-brand-600 text-white border-brand-600 ring-4 ring-brand-100';
      case 'rejected': return 'bg-red-500 text-white border-red-500';
      case 'pending': default: return 'bg-white text-gray-400 border-gray-300';
    }
  };

  const getLineColor = (index: number) => {
    const status = getStatus(index);
    if (status === 'completed' || index < currentStep) return 'bg-green-500';
    return 'bg-gray-200';
  };

  if (direction === 'vertical') {
    return (
      <div className="flex flex-col font-sans">
        {steps.map((step, index) => {
          const status = getStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <div key={index} className="flex relative">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 transition-colors ${getStatusColor(status)}`}>
                  {status === 'completed' ? <Check size={16} /> : index + 1}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-12 my-1 ${getLineColor(index)}`}></div>
                )}
              </div>
              <div className="pt-1 pb-8">
                <p className={`font-bold text-sm ${status === 'pending' ? 'text-gray-500' : 'text-gray-800'}`}>
                  {step}
                </p>
                {status === 'in_progress' && <p className="text-xs font-medium text-brand-600 mt-1">กำลังดำเนินการ</p>}
                {status === 'rejected' && <p className="text-xs font-medium text-red-500 mt-1">ต้องแก้ไข</p>}
                {status === 'completed' && <p className="text-xs font-medium text-green-600 mt-1">เสร็จสิ้น</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full font-sans">
      {steps.map((step, index) => {
        const status = getStatus(index);
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex-1 flex items-center relative">
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${getStatusColor(status)}`}>
                {status === 'completed' ? <Check size={20} /> : index + 1}
              </div>
              <div className="absolute top-12 w-32 text-center">
                <p className={`text-xs font-bold ${status === 'pending' ? 'text-gray-500' : 'text-gray-800'}`}>
                  {step}
                </p>
                {status === 'in_progress' && <p className="text-[10px] font-medium text-brand-600 mt-0.5">กำลังดำเนินการ</p>}
                {status === 'rejected' && <p className="text-[10px] font-medium text-red-500 mt-0.5">ต้องแก้ไข</p>}
              </div>
            </div>
            
            {!isLast && (
              <div className={`flex-1 h-1 mx-2 -mt-6 rounded ${getLineColor(index)}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
