import React from 'react';
import { SWOTItem } from '../types';
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  data: SWOTItem[];
}

export function SWOTView({ data }: Props) {
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
            <h2 className="text-sm font-semibold text-slate-800">{item.optionName || 'Option'} - SWOT</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100">
            <div className="p-6">
              <div className="text-[10px] uppercase text-emerald-600 font-bold tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Strengths
              </div>
              <ul className="space-y-3">
                {item.strengths?.map((str, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <span className="text-emerald-500 mt-0.5 font-bold shrink-0">+</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-slate-50/30">
              <div className="text-[10px] uppercase text-rose-500 font-bold tracking-wider mb-4 flex items-center gap-2">
                 <TrendingDown className="w-3.5 h-3.5" /> Weaknesses
              </div>
              <ul className="space-y-3">
                {item.weaknesses?.map((wk, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="text-rose-400 mt-0.5 font-bold shrink-0">-</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="p-6 bg-indigo-50/30">
              <div className="text-[10px] uppercase text-indigo-600 font-bold tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Opportunities
              </div>
              <ul className="space-y-3">
                {item.opportunities?.map((opp, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <span className="text-indigo-400 mt-0.5 font-bold shrink-0">↑</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-amber-50/20">
              <div className="text-[10px] uppercase text-amber-600 font-bold tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Threats
              </div>
              <ul className="space-y-3">
                {item.threats?.map((threat, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="text-amber-500 mt-0.5 font-bold shrink-0">!</span>
                    <span>{threat}</span>
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
