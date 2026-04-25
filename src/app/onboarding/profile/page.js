"use client";
import { useState } from "react";
import { User, Activity, AlertCircle, HeartPulse, Loader2, LogOut, ArrowRight } from "lucide-react";

export default function OnboardingProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", age: "", gender: "Male", bloodGroup: "O+",
    weight: "", height: "", allergies: "", conditions: "",
    emergencyName: "", emergencyPhone: "", language: "English"
  });

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save profile");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black sm:bg-slate-950 flex items-center justify-center sm:py-8 font-sans">
      <div className="w-full h-[100dvh] sm:h-[850px] sm:w-[414px] bg-slate-900 sm:rounded-[40px] shadow-2xl relative flex flex-col sm:border-[8px] border-slate-800 text-white overflow-hidden">
        
        <div className="bg-slate-900 z-20 px-6 py-5 border-b border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
             <div className="bg-sky-500/20 p-2 rounded-xl text-sky-400"><HeartPulse size={20}/></div>
             <div>
               <h1 className="font-bold text-white leading-tight">Complete Setup</h1>
               <p className="text-[10px] uppercase tracking-widest text-sky-400 font-bold">Step 2 of 2</p>
             </div>
          </div>
          <button onClick={handleLogout} className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><User size={16}/> Basic Details</h2>
            
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Full Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium" placeholder="E.g. Rajesh Kumar" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Age *</label>
                <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium" placeholder="E.g. 32" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 appearance-none font-medium">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Blood *</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 appearance-none font-medium">
                  <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Weight</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="kg" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Height</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="cm" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 text-white focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Activity size={16}/> Medical Data</h2>
            
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Existing Conditions</label>
              <textarea name="conditions" value={formData.conditions} onChange={handleChange} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium resize-none" placeholder="Asthma, Diabetes, etc. (Optional)" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Allergies</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 font-medium resize-none" placeholder="Penicillin, Peanuts, etc. (Optional)" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={16}/> Emergency Contact</h2>
            
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Contact Name *</label>
              <input type="text" name="emergencyName" required value={formData.emergencyName} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium" placeholder="E.g. Priya Sharma" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">Contact Phone *</label>
              <input type="tel" name="emergencyPhone" required value={formData.emergencyPhone} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium" placeholder="Mobile Number" maxLength={10} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1.5 block">App Language *</label>
              <select name="language" value={formData.language} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 appearance-none font-medium">
                  <option>English</option><option>Hindi</option><option>Telugu</option>
              </select>
            </div>
          </div>

        </form>

        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pointer-events-none">
           <button onClick={handleSubmit} disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-sky-500/30 pointer-events-auto relative z-10 box-border">
             {loading ? <Loader2 className="animate-spin" size={20} /> : <>Save Profile <ArrowRight size={18} /></>}
           </button>
        </div>

      </div>
    </div>
  );
}
