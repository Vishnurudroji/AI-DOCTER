"use client";
import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("ErrorBoundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans relative">
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] max-w-sm w-full shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Oops! Something Broke</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">
          We encountered an unexpected rendering error. Your data is perfectly safe.
        </p>

        <button 
          onClick={() => reset()} 
          className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-sky-500/20"
        >
          <RotateCcw size={18} /> Reload View
        </button>
      </div>
    </div>
  );
}
