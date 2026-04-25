"use client";
import { useState } from "react";
import { HeartPulse, ArrowRight, ShieldCheck, Loader2, AlertCircle, User, Globe } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) return setError("Please enter a valid phone number");
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Authentication failed");
      
      if (data.data.isNew) {
        setStep(3);
        setLoading(false);
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 2) return setError("Valid name is required");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name, language })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Setup failed");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black sm:bg-slate-950 flex items-center justify-center sm:py-8 font-sans">
      <div className="w-full h-[100dvh] sm:h-[850px] sm:w-[414px] bg-slate-900 sm:rounded-[40px] shadow-2xl relative flex flex-col sm:border-[8px] border-slate-800 text-white overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/30 mb-6">
              <HeartPulse size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">VitaCare</h1>
            <p className="text-sky-300 font-bold text-sm tracking-widest uppercase">Your Health, Simplified</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              {step === 1 && "Welcome"}
              {step === 2 && "Secure OTP"}
              {step === 3 && "Quick Setup"}
            </h2>
            <p className="text-slate-400 text-xs mb-6 font-medium">
              {step === 1 && "Enter phone number to continue safely."}
              {step === 2 && `We've sent a code to ${phone}.`}
              {step === 3 && "Almost there! Let's personalize your experience."}
            </p>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-6 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-700 pr-3">+91</div>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="Enter phone number" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-bold tracking-widest" maxLength={10} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={18} /></>}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter 4-digit code (1234)" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-4 text-center text-white focus:outline-none focus:border-sky-500 transition-colors text-2xl font-black tracking-[0.5em]" maxLength={4} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest mb-4">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify & Secure <ShieldCheck size={18} /></>}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 font-bold text-sm hover:text-white transition-colors">Change Phone Number</button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 flex gap-1 items-center"><User size={14}/> Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rajesh Kumar" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1.5 flex gap-1 items-center"><Globe size={14}/> App Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-sky-500 transition-colors font-medium appearance-none">
                    <option>English</option><option>Hindi</option><option>Telugu</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest mt-2 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Enter App <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>
          
          <p className="text-center text-slate-500 mt-8 text-[10px] font-bold uppercase tracking-widest">Secured exactly like a premium med-tech product.</p>
        </div>
      </div>
    </div>
  );
}
