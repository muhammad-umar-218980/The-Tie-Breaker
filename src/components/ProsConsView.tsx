import React from 'react';
import { ProsConsItem } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: ProsConsItem[];
}

export function ProsConsView({ data }: Props) {
  if (!Array.isArray(data)) return null;
  return (
    <div className="flex flex-col gap-6 overflow-y-auto pr-2 h-full">
      {data.map((item, idx) => (
        <motion.div
          key={item.optionName || idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm shrink-0"
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-800">{item.optionName || 'Option'}</h2>
          </div>
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex-1 p-6">
               <div className="text-[10px] uppercase text-emerald-600 font-bold tracking-wider mb-4">Pros</div>
               <ul className="space-y-3 shrink-0">
                 {item.pros?.map((pro, i) => (
                   <li key={i} className="flex gap-3 text-sm text-slate-700">
                     <span className="text-emerald-500 mt-0.5 font-bold shrink-0">+</span>
                     <span>{pro}</span>
                   </li>
                 ))}
               </ul>
            </div>
            <div className="flex-1 p-6 bg-slate-50/30">
               <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-4">Cons</div>
               <ul className="space-y-3 shrink-0">
                 {item.cons?.map((con, i) => (
                   <li key={i} className="flex gap-3 text-sm text-slate-600">
                     <span className="text-rose-400 mt-0.5 font-bold shrink-0">-</span>
                     <span>{con}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
