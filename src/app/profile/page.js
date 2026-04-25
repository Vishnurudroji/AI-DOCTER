"use client";
import { useState, useEffect } from "react";
import { User, Activity, AlertCircle, ShieldCheck, HeartPulse, Loader2, ArrowLeft, ArrowRight, Shield, Stethoscope, Clock, Zap } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    age: "", gender: "", bloodGroup: "", weight: "", height: "",
    allergies: "", conditions: "", emergencyName: "", emergencyPhone: "", address: ""
  });

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(res => {
        if(res.success && res.data.profile) setFormData(prev => ({ ...prev, ...res.data.profile }));
        setInit(false);
      });
  }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update profile");
      setSuccess(true);
      setTimeout(() => window.location.href = "/", 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const fields = ['age', 'gender', 'bloodGroup', 'weight', 'height', 'allergies', 'conditions', 'emergencyName', 'emergencyPhone', 'address'];
    const filled = fields.filter(f => formData[f] && formData[f].toString().trim() !== "").length;
    if (filled === 0) return 20;
    if (filled < 5) return 60;
    return 100;
  };

  const progress = calculateProgress();

  if (init) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-sky-500" size={32}/></div>;

  return (
    <div className="min-h-screen bg-black sm:bg-slate-950 flex items-center justify-center sm:py-8 font-sans">
      <div className="w-full h-[100dvh] sm:h-[850px] sm:w-[414px] bg-slate-900 sm:rounded-[40px] shadow-2xl relative flex flex-col sm:border-[8px] border-slate-800 text-white overflow-hidden">
        
        <div className="bg-slate-900 z-20 px-4 py-4 border-b border-slate-800 flex items-center justify-between shadow-sm">
          <button onClick={() => window.location.href = "/"} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={18}/></button>
          <h1 className="font-bold text-white leading-tight">Complete Profile</h1>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6 scrollbar-hide">
          
          <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700/50 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-end mb-3">
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 shadow-sm">Profile Status</p>
                 <h3 className="text-3xl font-black text-white tracking-tighter">{progress}%</h3>
              </div>
              <div className="h-10 w-10 flex items-center justify-center bg-sky-500/20 text-sky-400 rounded-xl">
                 <ShieldCheck size={20}/>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-2 rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
            </div>
            
            <p className="text-xs text-slate-400 font-medium mb-3">Complete your health profile for better personalization and safety triggers.</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800"><Shield size={14} className="text-emerald-400 mb-1"/><p className="text-[10px] text-slate-300 font-bold uppercase">SOS Ready</p></div>
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800"><Zap size={14} className="text-orange-400 mb-1"/><p className="text-[10px] text-slate-300 font-bold uppercase">AI Support</p></div>
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800"><Stethoscope size={14} className="text-sky-400 mb-1"/><p className="text-[10px] text-slate-300 font-bold uppercase">Fast Docs</p></div>
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800"><Clock size={14} className="text-purple-400 mb-1"/><p className="text-[10px] text-slate-300 font-bold uppercase">Smart Meds</p></div>
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-start gap-2"><AlertCircle size={18} className="shrink-0 mt-0.5" /><p>{error}</p></div>}
            
            {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold flex items-start gap-2"><ShieldCheck size={18} className="shrink-0 mt-0.5" /><p>Profile securely updated.</p></div>}

            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Biological Data</h2>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium" placeholder="Age" />
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 appearance-none font-medium">
                  <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 appearance-none font-medium">
                  <option value="">Blood</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Wt (kg)" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 text-white focus:outline-none" />
                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Ht (cm)" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 text-white focus:outline-none" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Medical History</h2>
              <textarea name="conditions" value={formData.conditions || ''} onChange={handleChange} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium resize-none" placeholder="Existing conditions (Asthma, BP...)" />
              <textarea name="allergies" value={formData.allergies || ''} onChange={handleChange} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium resize-none" placeholder="Allergies (Peanuts, Penicillin...)" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14}/> Emergency Protocol</h2>
              <input type="text" name="emergencyName" value={formData.emergencyName || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium" placeholder="Emergency Contact Name" />
              <input type="tel" name="emergencyPhone" value={formData.emergencyPhone || ''} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium" placeholder="Emergency Contact Phone" maxLength={10} />
              <textarea name="address" value={formData.address || ''} onChange={handleChange} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium resize-none" placeholder="Residential Address / Ward" />
            </div>
            <div className="h-4"></div>
          </form>
        </div>

        <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pointer-events-none">
           <button form="profile-form" type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-sky-500/30 pointer-events-auto">
             {loading ? <Loader2 className="animate-spin" size={20} /> : <>{progress === 100 ? 'Update Record' : 'Save Progress'} <ArrowRight size={18} /></>}
           </button>
        </div>

      </div>
    </div>
  );
}
