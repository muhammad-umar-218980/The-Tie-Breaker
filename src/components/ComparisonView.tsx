import React from 'react';
import { ComparisonData } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: ComparisonData;
  options: string[];
}

export function ComparisonView({ data, options }: Props) {
  if (!data) return null;
  const { items = [] } = data;
  const displayOptions = options || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden h-full shadow-sm"
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
        <h2 className="text-sm font-semibold text-slate-800">Direct Comparison Matrix</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3 font-semibold bg-white sticky top-0 z-10">Criteria</th>
              {displayOptions?.map((opt, idx) => (
                <th key={idx} className={`px-6 py-3 font-semibold sticky top-0 z-10 ${idx % 2 === 0 ? 'bg-indigo-50/30' : 'bg-slate-50/50'}`}>
                  {opt || `Option ${idx + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {items?.map((item, i) => (
              <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap bg-white sticky left-0 shadow-[1px_0_0_0_rgb(241_245_249)]">
                  {item.criterion}
                </td>
                {displayOptions?.map((opt, idx) => {
                  let detailObj = item.details?.find(d => d.optionName === opt);
                  if (!detailObj) {
                     detailObj = item.details?.[idx];
                  }
                  return (
                    <td key={idx} className={`px-6 py-4 ${idx % 2 === 0 ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
                      {detailObj?.detail || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
