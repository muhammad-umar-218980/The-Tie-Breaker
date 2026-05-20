import React, { useState } from 'react';
import { Format, AnalysisResponse, ProsConsItem, SWOTItem, ComparisonData } from './types';
import { ProsConsView } from './components/ProsConsView';
import { SWOTView } from './components/SWOTView';
import { ComparisonView } from './components/ComparisonView';
import { Loader2, Dice5 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [decision, setDecision] = useState('');
  const [format, setFormat] = useState<Format>('pros-cons');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');
  
  const [randomWinner, setRandomWinner] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);
    setRandomWinner(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, format })
      });

      if (!res.ok) {
        let errorMsg = 'Failed to analyze decision';
        try {
          const errorData = await res.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = () => {
    if (!response || !response.options || response.options.length === 0) return;
    
    setIsRandomizing(true);
    setRandomWinner(null);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 15) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * response.options.length);
        setRandomWinner(response.options[randomIndex]);
        setIsRandomizing(false);
      }
    }, 100);
  };

  const renderAnalysis = () => {
    if (!response) return null;

    if (format === 'pros-cons') {
      return <ProsConsView data={response.analysis as ProsConsItem[]} />;
    }
    if (format === 'swot') {
      return <SWOTView data={response.analysis as SWOTItem[]} />;
    }
    if (format === 'comparison') {
      return <ComparisonView data={response.analysis as ComparisonData} options={response.options} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center">
            <div className="w-1 h-4 bg-white rotate-12"></div>
            <div className="w-1 h-4 bg-white -rotate-12"></div>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-slate-800">The Tie Breaker</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 hidden sm:inline-block">Decision Assistant</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="shrink-0 space-y-2">
          <label htmlFor="decision" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Decision
          </label>
          <div className="flex flex-col md:flex-row gap-4">
             <input
               id="decision"
               type="text"
               value={decision}
               onChange={(e) => setDecision(e.target.value)}
               placeholder="e.g., Should I move to New York or San Francisco?"
               className="flex-1 bg-white border border-slate-200 rounded-lg px-6 py-4 text-lg font-light focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-slate-800 placeholder-slate-300"
               required
             />
             <div className="flex gap-4">
                 <select
                   value={format}
                   onChange={(e) => setFormat(e.target.value as Format)}
                   className="bg-white border border-slate-200 rounded-lg px-4 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-slate-700 h-full"
                 >
                   <option value="pros-cons">Pros & Cons</option>
                   <option value="comparison">Comparison Table</option>
                   <option value="swot">SWOT Analysis</option>
                 </select>
                 
               <button
                 type="submit"
                 disabled={loading || !decision.trim()}
                 className="px-6 py-4 h-full bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
               </button>
             </div>
          </div>
          {error && (
            <div className="text-rose-600 text-sm font-medium pt-2">
              {error}
            </div>
          )}
        </form>

        {loading && !response && (
           <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
             <div className="relative w-12 h-12">
               <div className="absolute inset-0 rounded-full border-[3px] border-slate-200"></div>
               <div className="absolute inset-0 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin"></div>
             </div>
             <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">Analyzing Options...</p>
           </div>
        )}

        {response && !loading && (
          <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
             <div className="lg:col-span-8 flex flex-col min-h-0">
                 {renderAnalysis()}
             </div>

             <div className="lg:col-span-4 flex flex-col gap-6">
                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">AI Recommendation</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-500">
                        <p className="text-sm italic text-slate-600 leading-relaxed">
                          "Analysis complete. Review the detailed breakdown to weigh your options across the key dimensions identified."
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-3 border border-slate-100 rounded text-center">
                          <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Options Found</div>
                          <div className="text-xl font-semibold text-slate-800">{response.options?.length || 0}</div>
                        </div>
                        <div className="p-3 border border-slate-100 rounded text-center">
                          <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Data Points</div>
                            <div className="text-xl font-semibold text-slate-800">
                             {(() => {
                               if (!response || !response.analysis) return 0;
                               if (format === 'comparison') {
                                 return ((response.analysis as ComparisonData).items?.length || 0) * (response.options?.length || 0);
                               }
                               if (Array.isArray(response.analysis)) {
                                 if (format === 'pros-cons') {
                                   return (response.analysis as ProsConsItem[]).reduce((acc, curr) => acc + (curr.pros?.length || 0) + (curr.cons?.length || 0), 0);
                                 }
                                 if (format === 'swot') {
                                   return (response.analysis as SWOTItem[]).reduce((acc, curr) => acc + (curr.strengths?.length || 0) + (curr.weaknesses?.length || 0) + (curr.opportunities?.length || 0) + (curr.threats?.length || 0), 0);
                                 }
                               }
                               return 0;
                             })()}
                          </div>
                        </div>
                      </div>
                      {randomWinner && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-4 border border-indigo-100 bg-indigo-50 rounded-lg text-center"
                        >
                          <div className="text-[10px] text-indigo-400 mb-1 uppercase font-bold tracking-wider">Random Selection</div>
                          <div className="text-2xl font-bold text-indigo-700">{randomWinner}</div>
                        </motion.div>
                      )}
                    </div>
                 </div>

                 {response.options && response.options.length > 1 && (
                    <button
                      onClick={handleRandomize}
                      disabled={isRandomizing}
                      className="group min-h-[120px] bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                        <Dice5 className={`w-8 h-8 text-indigo-400 group-hover:rotate-180 transition-transform duration-500 ${isRandomizing ? 'animate-spin' : ''}`} />
                        <div className="text-center">
                            <span className="block text-sm font-bold uppercase tracking-widest text-slate-50">Feeling Stuck?</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRandomizing ? 'Rolling...' : 'Roll the Dice'}</span>
                        </div>
                    </button>
                 )}
             </div>
          </section>
        )}
      </main>
    </div>
  );
}
