// turbopack-flush
"use client";
import { useState, useEffect } from "react";
import { 
  Home, Pill, FileText, MessageSquare, Heart, User, Bell, 
  ChevronRight, CheckCircle2, AlertCircle, Phone, Plus, 
  Activity, Upload, Search, ShoppingCart, Mic, Send, Star, 
  Sun, Moon, Sunrise, ShieldAlert, BadgeCheck, Flame, 
  Droplets, Lock, HelpCircle, LogOut, Sparkles, ShieldCheck,
  Shield, Zap, Stethoscope, Clock
} from "lucide-react";

export default function VitaCare() {
  const [tab, setTab] = useState("home");
  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);
  const [sos, setSos] = useState({ act: false, time: 5 });
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch('/api/medicines').then(r => r.json()).then(res => setMedicines(res.data || []));
    fetch('/api/reports').then(r => r.json()).then(res => setReports(res.data || []));
    fetch('/api/profile').then(r => r.json()).then(res => setUser(res.data || {}));
  }, []);

  const toggleMedicine = async (med) => {
    const updated = { ...med, isMarked: !med.isMarked };
    setMedicines(prev => prev.map(m => m.id === med.id ? updated : m));
    await fetch('/api/medicines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: med.id, action: 'mark', isMarked: updated.isMarked })
    });
  };

  const triggerSos = () => setSos({ act: true, time: 5 });

  useEffect(() => {
    let t;
    if (sos.act && sos.time > 0) t = setInterval(()=>setSos(p=>({...p, time: p.time-1})), 1000);
    return () => clearInterval(t);
  }, [sos.act, sos.time]);

  const HomeTab = () => (
    <div className="p-5 flex flex-col gap-6 pb-28 overflow-y-auto h-full scrollbar-hide">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm font-medium">Good Morning,</p>
          <h2 className="text-2xl font-bold text-white">{user?.name || 'Guest'} 👋</h2>
        </div>
        <div className="relative">
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full z-10"></div>
          <Bell className="text-slate-300" size={24} />
        </div>
      </div>

      {user?.profile && !user.profile.completed && (
        <button onClick={() => window.location.href = '/profile'} className="bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition-colors rounded-2xl p-4 flex items-center justify-between text-left group">
          <div className="flex items-center gap-3">
             <div className="bg-sky-500/20 p-2.5 rounded-xl"><ShieldCheck size={20} className="text-sky-400 group-hover:scale-110 transition-transform"/></div>
             <div>
               <h3 className="text-white font-bold text-sm">Complete your profile</h3>
               <p className="text-slate-400 text-xs mt-0.5">Unlock personalized SOS & AI support.</p>
             </div>
          </div>
          <ChevronRight size={18} className="text-sky-400" />
        </button>
      )}

      <div className="relative bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 rounded-3xl p-6 shadow-xl shadow-pink-900/30 overflow-hidden flex items-center justify-between">
        <Flame className="absolute -right-6 -bottom-6 text-white/20 -rotate-12 pointer-events-none" size={130} fill="currentColor" />
        
        <div className="relative z-10 flex flex-col justify-center">
          <p className="text-pink-100 text-xs font-bold uppercase tracking-widest mb-1 drop-shadow-sm flex items-center gap-1.5"><Activity size={14}/> Heart Target</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-white drop-shadow-md tracking-tighter">7</h3>
            <span className="text-2xl font-black text-pink-200 drop-shadow-sm">Days</span>
          </div>
        </div>
        
        <div className="h-16 w-16 rounded-[24px] bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg relative z-10 shrink-0">
          <Flame size={32} className="text-white animate-pulse" fill="currentColor" />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Pill size={20} className="text-sky-400" /> Today's Medicines
        </h3>
        <div className="space-y-3">
          {medicines.map(m => (
            <div key={m.id} className={`flex items-center justify-between p-3 rounded-2xl transition-all ${m.isMarked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-700/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${m.isMarked ? 'bg-emerald-500/20 text-emerald-400' : (m.timeOfDay==='Morning'?'text-amber-400 bg-amber-400/10': m.timeOfDay==='Afternoon'?'text-sky-400 bg-sky-400/10':'text-indigo-400 bg-indigo-400/10')}`}>
                  {m.timeOfDay === 'Morning' ? <Sunrise size={20}/> : m.timeOfDay === 'Afternoon' ? <Sun size={20}/> : <Moon size={20}/>}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${m.isMarked ? 'text-emerald-50' : 'text-white'}`}>{m.name} <span className="text-slate-400 font-normal ml-1">{m.dosage}</span></h4>
                  <p className="text-xs text-slate-400 mt-0.5">{m.time}</p>
                </div>
              </div>
              <button onClick={() => toggleMedicine(m)} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${m.isMarked ? 'bg-emerald-500 text-white' : 'bg-slate-600'}`}>
                {m.isMarked ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-slate-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { t: "AI Chat", i: MessageSquare, bg: "from-purple-500 to-fuchsia-600", act: () => setTab('chat') },
          { t: "Upload Report", i: Upload, bg: "from-sky-500 to-blue-600", act: () => setTab('reports') },
          { t: "SOS Alert", i: ShieldAlert, bg: "from-red-500 to-rose-600", act: triggerSos },
          { t: "Order Meds", i: ShoppingCart, bg: "from-amber-500 to-orange-500", act: () => setTab('care') }
        ].map((a, i) => (
          <button key={i} onClick={a.act} className="bg-slate-800 p-4 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-3 active:scale-95 transition-transform">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${a.bg} shadow-lg`}><a.i size={24} className="text-white" /></div>
            <span className="text-sm font-semibold text-slate-200">{a.t}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><BadgeCheck size={18} className="text-emerald-500"/> Upcoming Target</h3>
        </div>
        <div className="flex items-center gap-4">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Priya" className="h-14 w-14 rounded-2xl bg-slate-700" alt="Doctor" />
          <div>
            <h4 className="font-bold text-white text-sm">Dr. Priya Sharma</h4>
            <p className="text-xs text-sky-400 font-medium">Cardiology</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Tomorrow • 10:00 AM</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
        <Sparkles size={20} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-emerald-400 mb-1">Health Tip from AI</h4>
          <p className="text-xs text-slate-300 leading-relaxed">Walking 15 mins after dinner helps lower blood sugar spikes.</p>
        </div>
      </div>
    </div>
  );

  const MedicinesTab = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [medForm, setMedForm] = useState({ name: '', dosage: '', time: '', timeOfDay: 'Morning', frequency: 'Once daily', daysLeft: 30 });

    const handleAdd = async (e) => {
      e.preventDefault();
      if (!medForm.name || !medForm.dosage) return;
      setLoading(true);
      try {
        const res = await fetch('/api/medicines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(medForm) });
        const data = await res.json();
        if(data.success) {
           setMedicines([data.data, ...medicines]);
           setIsAdding(false);
           setMedForm({ name: '', dosage: '', time: '', timeOfDay: 'Morning', frequency: 'Once daily', daysLeft: 30 });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const res = await fetch('/api/medicines', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...medForm, id: isEditing, action: 'update' }) });
        const data = await res.json();
        if(data.success) {
           setMedicines(prev => prev.map(m => m.id === isEditing ? data.data : m));
           setIsEditing(null);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
      if(!window.confirm("Delete this medicine?")) return;
      try {
        const res = await fetch('/api/medicines', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const data = await res.json();
        if(data.success) setMedicines(prev => prev.filter(m => m.id !== id));
      } catch (err) { console.error(err); }
    };

    const handleToggle = async (id) => {
      try {
        const res = await fetch('/api/medicines', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'toggle' }) });
        const data = await res.json();
        if(data.success) setMedicines(prev => prev.map(m => m.id === id ? data.data : m));
      } catch (err) { console.error(err); }
    };

    if (isAdding || isEditing) return (
      <div className="p-5 flex flex-col gap-6 pb-28 h-full overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center sticky top-0 bg-slate-900 z-10 py-2">
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Medicine' : 'Add Medicine'}</h1>
          <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="bg-slate-800 text-slate-400 p-2 rounded-xl border border-slate-700 text-xs font-bold uppercase tracking-wider">Cancel</button>
        </div>
        <form onSubmit={isEditing ? handleUpdate : handleAdd} className="space-y-4">
          <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Medicine Name</label><input type="text" required placeholder="Dolo 650" value={medForm.name} onChange={e=>setMedForm({...medForm, name:e.target.value})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 font-bold"/></div>
          <div className="grid grid-cols-2 gap-3">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dosage</label><input type="text" required placeholder="1 tablet" value={medForm.dosage} onChange={e=>setMedForm({...medForm, dosage:e.target.value})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 font-bold"/></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time</label><input type="text" placeholder="08:00 AM" value={medForm.time} onChange={e=>setMedForm({...medForm, time:e.target.value})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 font-bold"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time of Day</label><select value={medForm.timeOfDay} onChange={e=>setMedForm({...medForm, timeOfDay:e.target.value})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 font-bold appearance-none"><option>Morning</option><option>Afternoon</option><option>Night</option></select></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Stock</label><input type="number" required value={medForm.daysLeft} onChange={e=>setMedForm({...medForm, daysLeft:e.target.value})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-sky-500 font-bold"/></div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-sky-500 mt-4 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-sky-500/30 active:scale-95 transition-transform">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    );

    return (
      <div className="p-5 flex flex-col gap-6 pb-28 h-full overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center sticky top-0 bg-slate-900 z-10 py-2">
        <h1 className="text-2xl font-bold text-white">My Medicines</h1>
        <button onClick={() => { setMedForm({ name: '', dosage: '', time: '', timeOfDay: 'Morning', frequency: 'Once daily', daysLeft: 30 }); setIsAdding(true); }} className="bg-sky-500/20 text-sky-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold"><Plus size={16}/> Add</button>
      </div>
      <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-300">7-Day Adherence</h3>
          <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">92%</span>
        </div>
        <div className="flex justify-between items-end h-24 gap-2">
          {['M','T','W','T','F','S','S'].map((day, i) => {
            const h = [60, 100, 80, 100, 40, 100, 60][i];
            const color = h < 50 ? 'bg-red-500' : h < 80 ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-slate-700 rounded-full h-full relative overflow-hidden flex items-end">
                  <div className={`w-full rounded-full ${color}`} style={{height: `${h}%`}} />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
      {medicines.length === 0 && (
         <div className="text-center bg-slate-800/50 p-6 rounded-3xl border border-dashed border-slate-700">
           <Pill size={32} className="mx-auto text-slate-500 mb-3" />
           <h3 className="text-slate-300 font-bold mb-1">No medicines tracking</h3>
           <p className="text-xs text-slate-500 font-medium">Add your daily dosage to track adherence and receive automated smart alerts.</p>
         </div>
      )}
      <div className="space-y-3">
        {medicines.map((m, i) => (
          <div key={m.id} className="bg-slate-800 rounded-3xl p-4 border border-slate-700/50 relative overflow-hidden group transition-all">
            {!m.isActive && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] z-10 pointer-events-none" />}
            
            <div className="flex justify-between items-start mb-3 relative z-20">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.timeOfDay==='Morning'?'bg-amber-400/20 text-amber-400':m.timeOfDay==='Afternoon'?'bg-sky-400/20 text-sky-400':'bg-indigo-400/20 text-indigo-400'}`}><Pill size={24}/></div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-white text-base max-w-[120px] truncate">{m.name}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${m.isActive ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 shadow-sm shadow-black'}`}>{m.isActive ? 'Active' : 'Paused'}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">{m.dosage} • {m.time}</p>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-700/50 flex justify-between items-center relative z-20">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${m.daysLeft <= 5 ? 'text-amber-400' : 'text-slate-400'}`}>{m.daysLeft <= 5 ? '⚠️ Low stock' : `${m.daysLeft} days stock`}</p>
              <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                 <button disabled={loading} onClick={() => handleToggle(m.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${m.isActive ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'}`}>{m.isActive ? 'Pause' : 'Resume'}</button>
                 <button disabled={loading} onClick={() => { setIsEditing(m.id); setMedForm({ name: m.name, dosage: m.dosage, time: m.time, timeOfDay: m.timeOfDay, frequency: 'Once daily', daysLeft: m.daysLeft }); }} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-700 hover:bg-sky-500/20 hover:text-sky-400 transition-colors text-slate-300">Edit</button>
                 <button disabled={loading} onClick={() => handleDelete(m.id)} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  };

  const ReportsTab = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('Blood Test');
    const [aiSummary, setAiSummary] = useState(null);
    const [rForm, setRForm] = useState({ title: '', doctorName: '', fileUrl: '', reportDate: '', notes: '', meta: {} });

    const handleAISummary = (report) => {
        let sum = "AI Analysis: Your report appears normal. Ensure active hydration.";
        if(report.type === 'Blood Test' && report.metadata?.hemoglobin) sum = `AI Analysis: Hemoglobin is ${report.metadata.hemoglobin}. Slightly low. Enhance diet with iron-rich foods.`;
        setAiSummary({ id: report.id, text: sum });
    };

    const handleFile = (e) => {
        setRForm({...rForm, fileUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200&auto=format&fit=crop'});
    };

    const handleAdd = async (e) => {
      e.preventDefault();
      if(!rForm.title || !reportType) return;
      setLoading(true);
      try {
        const payload = {
            title: rForm.title, type: reportType, fileUrl: rForm.fileUrl, doctorName: rForm.doctorName, reportDate: rForm.reportDate, notes: rForm.notes, metadata: rForm.meta
        };
        const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if(data.success) {
           setReports([data.data, ...reports]);
           setIsAdding(false);
           setRForm({ title: '', doctorName: '', fileUrl: '', reportDate: '', notes: '', meta: {} });
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
      if(!window.confirm("Delete this report?")) return;
      try {
        const res = await fetch('/api/reports', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        const data = await res.json();
        if(data.success) setReports(prev => prev.filter(r => r.id !== id));
      } catch (err) { console.error(err); }
    };

    const renderDynamicFields = () => {
        if(reportType === 'Blood Test') return (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hemoglobin</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, hemoglobin:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WBC</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, wbc:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platelets</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, platelets:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fasting Sugar</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, fastingSugar:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
            </div>
        );
        if(reportType === 'ECG') return (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heart Rate</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, heartRate:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rhythm</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, rhythm:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
            </div>
        );
        if(reportType === 'X-Ray') return (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Body Part</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, bodyPart:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finding</label><input type="text" onChange={e=>setRForm({...rForm, meta:{...rForm.meta, finding:e.target.value}})} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
            </div>
        );
        return null;
    };

    if (isAdding) return (
      <div className="p-5 flex flex-col gap-6 pb-28 h-full overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center sticky top-0 bg-slate-900 z-10 py-2">
          <h1 className="text-2xl font-bold text-white">Add Report</h1>
          <button onClick={() => setIsAdding(false)} className="bg-slate-800 text-slate-400 p-2 rounded-xl border border-slate-700 text-[10px] font-black uppercase tracking-widest">Cancel</button>
        </div>
        <form onSubmit={handleAdd} className="space-y-5 flex flex-col gap-1">
           <div>
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Report Category</label>
             <select value={reportType} onChange={e=>{setReportType(e.target.value); setRForm({...rForm, meta:{}})}} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white font-bold outline-none appearance-none"><option>Blood Test</option><option>Urine Test</option><option>ECG</option><option>X-Ray</option><option>MRI</option></select>
           </div>
           <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Title</label><input type="text" required placeholder="CBC Report" value={rForm.title} onChange={e=>setRForm({...rForm, title:e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
           <div className="grid grid-cols-2 gap-3">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Doctor</label><input type="text" placeholder="Dr. XYZ" value={rForm.doctorName} onChange={e=>setRForm({...rForm, doctorName:e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-sky-500 outline-none font-bold"/></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Date</label><input type="date" value={rForm.reportDate} onChange={e=>setRForm({...rForm, reportDate:e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm pr-2 focus:border-sky-500 outline-none block font-bold" style={{colorScheme:'dark'}}/></div>
           </div>

           <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700 mt-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Diagnostic Fields</h3>
              {renderDynamicFields() || <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No fields mapped.</p>}
           </div>

           <div className="mt-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Attachment</label>
             {rForm.fileUrl ? (
                <div className="h-28 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative shadow-lg shadow-black/20"><img src={rForm.fileUrl} className="object-cover w-full h-full opacity-50" alt="attachment"/><div className="absolute inset-0 flex items-center justify-center"><div className="bg-emerald-500/20 p-3 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-500/30"><CheckCircle2 className="text-emerald-400" size={32}/></div></div></div>
             ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-colors">
                   <Upload size={24} className="text-slate-500 mb-1.5"/>
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tap to Upload File</span>
                   <input type="file" className="hidden" onChange={handleFile}/>
                </label>
             )}
           </div>

           <button disabled={loading} type="submit" className="w-full bg-emerald-500 mt-6 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform">{loading ? 'Processing...' : 'Upload Record'}</button>
        </form>
      </div>
    );

    return (
      <div className="p-5 flex flex-col gap-6 pb-28 h-full overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center sticky top-0 bg-slate-900 z-10 py-2">
          <h1 className="text-2xl font-bold text-white">Records</h1>
          <button onClick={() => setIsAdding(true)} className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"><Plus size={18}/></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', 'Blood Test', 'ECG', 'X-Ray'].map((f, i) => (
            <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${i===0 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>{f}</button>
          ))}
        </div>
        {reports.length === 0 && (
           <div className="text-center bg-slate-800/50 p-6 pt-10 pb-10 rounded-3xl border border-dashed border-slate-700 mt-6">
             <FileText size={32} className="mx-auto text-slate-500 mb-3" />
             <h3 className="text-slate-300 font-bold mb-1">No medical reports</h3>
             <p className="text-xs text-slate-500 font-medium px-4">Upload blood tests and prescriptions to get AI health recommendations.</p>
           </div>
        )}
        <div className="space-y-4 my-2">
          {reports.map((r) => (
            <div key={r.id} className="bg-slate-800 border border-slate-700/50 rounded-3xl overflow-hidden flex flex-col shadow-lg shadow-black/20">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 py-0.5 rounded px-2">{r.type}</span>
                    <h3 className="font-bold text-white text-md mt-2">{r.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">{r.reportDate || 'Date: Unknown'} • {r.doctorName || 'Self Upload'}</p>
                  </div>
                  {r.fileUrl && <img src={r.fileUrl} alt="doc" className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700 shadow-sm shadow-black"/>}
                </div>
                {r.metadata && Object.keys(r.metadata).length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-5 bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                     {Object.entries(r.metadata).map(([k,v]) => (
                        <div key={k} className="flex flex-col gap-0.5">
                           <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">{k}</span>
                           <span className="text-xs font-bold text-white max-w-[120px] truncate">{v}</span>
                        </div>
                     ))}
                  </div>
                )}
                {aiSummary?.id === r.id && (
                  <div className="mt-5 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in zoom-in slide-in-from-top-2 duration-300">
                    <Sparkles size={16} className="text-sky-400 shrink-0 mt-0.5"/>
                    <p className="text-[11px] text-sky-100 font-bold leading-relaxed">{aiSummary.text}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-700/50 border-t border-slate-700/50 bg-slate-800/80">
                <button onClick={() => handleAISummary(r)} className="py-3.5 text-[9px] font-black uppercase tracking-widest text-sky-400 hover:bg-sky-500/10 flex items-center justify-center gap-1.5 transition-colors"><Sparkles size={12} className="text-sky-400"/> Summary</button>
                <button onClick={() => window.open(r.fileUrl)} disabled={!r.fileUrl} className={`py-3.5 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors ${!r.fileUrl && 'opacity-50'}`}>Preview</button>
                <button onClick={() => handleDelete(r.id)} className="py-3.5 text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ChatTab = () => {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
       if(history.length === 0) {
           setHistory([{ role: 'model', data: { responseText: `Hello ${user?.name || ''}! How are you feeling today?`, followUpQuestions: ['I have a fever', 'Explain my recent blood test', 'I need a medicine refill'], urgencyLevel: 'LOW', confidenceScore: 100, escalateToDoctor: false } }]);
       }
    }, [history, user]);

    const handleSend = async (textOveride) => {
        const msg = typeof textOveride === 'string' ? textOveride : input;
        if(!msg.trim() || loading) return;
        
        setInput('');
        setLoading(true);
        const newHistory = [...history, { role: 'user', text: msg }];
        setHistory(newHistory);

        try {
            const rawHistory = history.map(h => ({ role: h.role, text: h.role==='user' ? h.text : h.data.responseText }));
            
            const res = await fetch('/api/ai/chat', { 
               method: 'POST', 
               headers: {'Content-Type':'application/json'}, 
               body: JSON.stringify({ message: msg, history: rawHistory }) 
            });
            const data = await res.json();
            if(data.success) {
                setHistory(prev => [...prev, { role: 'model', data: data.data }]);
            } else {
                setHistory(prev => [...prev, { role: 'model', data: { responseText: data.error, urgencyLevel: 'LOW', confidenceScore: 0, escalateToDoctor: false } }]);
            }
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="flex flex-col h-full relative">
      <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center gap-3 shrink-0 relative z-20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center relative shadow-lg">
          <Sparkles size={18} className="text-white" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
        </div>
        <div>
          <h2 className="font-bold text-white text-sm">VitaCare AI</h2>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-40">
        <div className="text-center"><span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">Secure Health Tunnel</span></div>
        {history.map((msg, i) => {
           if(msg.role === 'user') {
               return (
                  <div key={i} className="flex justify-end">
                    <div className="bg-sky-600 text-white p-4 rounded-3xl rounded-tr-sm max-w-[85%] shadow-lg shadow-black/20">
                      <p className="text-[13px] font-bold leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
               );
           } else {
               const r = msg.data;
               return (
                  <div key={i} className="flex flex-col gap-2 max-w-[85%]">
                     <div className={`p-4 rounded-3xl rounded-tl-sm shadow-lg shadow-black/20 ${r.urgencyLevel === 'HIGH' ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800 border border-slate-700/50'}`}>
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                           <Sparkles size={14} className={r.urgencyLevel === 'HIGH' ? 'text-red-400' : 'text-sky-400'}/>
                           <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${r.urgencyLevel === 'HIGH' ? 'bg-red-500 text-white' : r.urgencyLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'}`}>{r.urgencyLevel} RISK</span>
                           {r.confidenceScore && <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${r.confidenceScore > 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>CONFIDENCE {r.confidenceScore}%</span>}
                        </div>
                        <p className="text-[13px] text-white font-medium leading-relaxed whitespace-pre-wrap">{r.responseText}</p>
                        
                        {r.escalateToDoctor && (
                            <button onClick={()=>window.alert('SOS Triggered! Dispatching to contacts...')} className="w-full mt-4 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"><Phone size={14}/> SOS Emergency</button>
                        )}
                        {!r.escalateToDoctor && r.clarificationNeeded && (
                            <div className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex gap-2 items-center"><HelpCircle size={14} className="text-purple-400 shrink-0"/><span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">AI Needs Clarification</span></div>
                        )}
                     </div>
                     {r.followUpQuestions && r.followUpQuestions.length > 0 && i === history.length - 1 && (
                         <div className="flex flex-wrap gap-2 mt-1">
                            {r.followUpQuestions.map((q, idx) => (
                               <button key={idx} onClick={() => handleSend(q)} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sky-400 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-colors text-left leading-tight">{q}</button>
                            ))}
                         </div>
                     )}
                  </div>
               );
           }
        })}
        {loading && <div className="flex flex-col gap-2 max-w-[85%]"><div className="bg-slate-800 border border-slate-700/50 p-4 rounded-3xl rounded-tl-sm flex items-center gap-3"><Sparkles size={16} className="animate-spin text-sky-500"/><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyzing clinical vectors...</span></div></div>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 z-20 pb-[85px] shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800 rounded-full p-1.5 flex items-center pr-2 border border-slate-700">
            <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors"><Plus size={18}/></button>
            <input disabled={loading} type="text" placeholder="Explain your symptoms..." value={input} onChange={e=>setInput(e.target.value)} className="flex-1 bg-transparent text-white text-sm px-2 focus:outline-none focus:ring-0 font-bold" />
            <button type="button" className="p-2 text-sky-400 hover:text-sky-300 transition-colors"><Mic size={18}/></button>
          </div>
          <button disabled={loading} type="submit" className="h-11 w-11 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/30 transition-transform active:scale-95"><Send size={18} className="mr-0.5 mt-0.5" /></button>
        </form>
      </div>
    </div>
  )};

  const CareTab = () => {
    const [sec, setSec] = useState('doc');
    return (
      <div className="p-5 flex flex-col gap-5 h-full overflow-y-auto pb-28 scrollbar-hide">
        <div className="flex bg-slate-800 p-1 rounded-2xl sticky top-0 z-10 border border-slate-700">
          <button onClick={()=>setSec('doc')} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${sec==='doc'?'bg-slate-600 text-white':'text-slate-400'}`}>Doctors</button>
          <button onClick={()=>setSec('rx')} className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${sec==='rx'?'bg-slate-600 text-white':'text-slate-400'}`}>Pharmacy</button>
        </div>
        {sec === 'doc' ? (
          <div className="space-y-4">
            {[1,2].map(i =>(
               <div key={i} className="bg-slate-800 rounded-3xl p-4 border border-slate-700/50 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img src={i===1 ? "https://api.dicebear.com/7.x/notionists/svg?seed=P" : "https://api.dicebear.com/7.x/notionists/svg?seed=A"} className="w-16 h-16 rounded-2xl bg-slate-700" alt="doc"/>
                      {i===1 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-800 rounded-full" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{i===1 ? "Dr. Priya Sharma" : "Dr. Arun Kumar"}</h3>
                      <p className="text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">{i===1 ? "Cardiology" : "General"}</p>
                      <p className="text-slate-400 text-[10px] font-bold tracking-widest flex items-center gap-1"><Star size={10} className="text-amber-400" fill="currentColor"/> {i===1?"4.8":"4.6"} • {i===1?"12":"8"} YRS EXP</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-500/20">Consult ₹{i===1?"199":"149"}</button>
                    <button className="flex-1 bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-600">Book Slot</button>
                  </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center gap-2">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search medicines..." className="bg-transparent text-sm text-white focus:outline-none w-full"/>
              </div>
              <button className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center relative">
                <ShoppingCart size={20}/><div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"/>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{n:"Dolo 650", p:"₹30"}, {n:"Vitamin D3", p:"₹180"}, {n:"BP Monitor", p:"₹1200"}, {n:"Paracetamol", p:"₹25"}].map((p,i)=>(
                <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full bg-emerald-500/10 text-[8px] font-black text-emerald-400 text-center py-1 uppercase tracking-widest">Partner</div>
                  <div className="mt-5 mb-2 h-12 w-12 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                    {i===2 ? <Activity size={20} className="text-slate-400"/> : <Pill size={20} className="text-slate-400" />}
                  </div>
                  <h4 className="font-bold text-white text-xs mb-1 text-center line-clamp-1">{p.n}</h4>
                  <p className="text-sky-400 font-black text-sm mb-3">{p.p}</p>
                  <button className="w-full bg-slate-700 text-white text-[10px] font-black uppercase tracking-wider py-2 rounded-lg hover:bg-sky-500 transition-colors">Add</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };



  const ProfileTab = () => (
    <div className="p-5 flex flex-col gap-6 pb-28 h-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col items-center mt-4">
        <div className="h-24 w-24 rounded-full bg-slate-800 border-4 border-slate-700 p-1 relative mb-3">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}`} className="rounded-full" alt="profile"/>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg"><User size={14} className="text-white"/></div>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{user?.name || 'Guest'}</h2>
        <p className="text-sm text-slate-400 font-bold mt-1">{user?.phoneNumber}</p>
      </div>
      <div className="flex gap-2">
         <button onClick={() => window.location.href='/profile'} className="flex-1 bg-sky-500 hover:bg-sky-600 transition-colors py-3 rounded-2xl text-white font-black text-sm shadow-[0_0_15px_rgba(14,165,233,0.3)]">Edit Health Data</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[ {t:"Blood", v:user?.profile?.bloodGroup || '-', i:Droplets, c:"text-red-400 bg-red-400/10"}, {t:"Age", v:user?.profile?.age || '-', i:User, c:"text-sky-400 bg-sky-400/10"}, {t:"Weight", v:user?.profile?.weight ? `${user.profile.weight}kg` : '-', i:Activity, c:"text-emerald-400 bg-emerald-400/10"}, {t:"Allergies", v:user?.profile?.allergies || 'None', i:AlertCircle, c:"text-amber-400 bg-amber-400/10"} ].map((d,i)=>(
           <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
             <div className={`p-2.5 rounded-xl ${d.c}`}><d.i size={18}/></div>
             <div><p className="text-[9px] uppercase tracking-widest font-black text-slate-500">{d.t}</p><p className="font-bold text-white text-sm line-clamp-1">{d.v}</p></div>
           </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-3xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/50">
        {[ {n:"Notifications", i:Bell}, {n:"Privacy", i:Lock}, {n:"Help", i:HelpCircle}, {n:"Logout", i:LogOut, d:true} ].map((s,i)=>(
          <button key={i} onClick={() => { if(s.d) { fetch('/api/auth',{method:'DELETE'}).then(()=>window.location.href='/login') } }} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
            <div className="flex gap-3 items-center">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.d?'bg-red-500/10 text-red-500':'bg-slate-700 text-slate-400'}`}><s.i size={16}/></div>
              <p className={`font-bold text-sm ${s.d?'text-red-500':'text-white'}`}>{s.n}</p>
            </div>
            {!s.d && <ChevronRight size={16} className="text-slate-500"/>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black sm:bg-slate-950 flex justify-center sm:py-8 font-sans">
      <div className="w-full h-[100dvh] sm:h-[850px] sm:w-[414px] bg-slate-900 sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] border-slate-800 text-white">
        
        <div className="flex-1 relative overflow-hidden bg-slate-900">
          {tab==='home' && <HomeTab />}
          {tab==='medicines' && <MedicinesTab />}
          {tab==='reports' && <ReportsTab />}
          {tab==='chat' && <ChatTab />}
          {tab==='care' && <CareTab />}
          {tab==='profile' && <ProfileTab />}
        </div>

        {tab !== 'chat' && (
          <button onClick={triggerSos} className="absolute bottom-[90px] right-5 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] z-20 hover:scale-105 active:scale-95 transition-transform border-4 border-slate-900">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50"></div>
            <ShieldAlert size={24} className="text-white animate-pulse" />
          </button>
        )}

        <div className={`absolute inset-0 z-50 transition-opacity duration-300 ${sos.act ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-red-600/95 backdrop-blur-md flex flex-col p-6 items-center justify-center text-center">
            <div className="relative mb-12 flex items-center justify-center">
               <div className="absolute w-64 h-64 bg-red-500/80 rounded-full animate-ping [animation-duration:1.5s]" />
               <div className="absolute w-44 h-44 bg-red-400/80 rounded-full animate-ping [animation-duration:1.5s] [animation-delay:0.3s]" />
               <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl z-10"><ShieldAlert size={56} className="text-red-600"/></div>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">{sos.time>0 ? 'Emergency' : 'Alert Sent'}</h2>
            <p className="text-red-200 font-bold mb-8">{sos.time>0 ? 'Calling contacts in...' : 'Help is on the way.'}</p>
            {sos.time>0 ? <div className="text-8xl font-black text-white mb-12">{sos.time}</div> : <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-12"><CheckCircle2 size={48} className="text-white"/></div>}
            
            <div className="bg-red-950/50 border border-red-500/30 rounded-3xl w-full p-5 text-left mb-8">
              <p className="text-red-300 text-[10px] font-black uppercase tracking-widest mb-3">ICE Profile ({user?.profile?.bloodGroup || 'Not Set'})</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-red-400/70 text-[10px] font-bold">Allergies</p><p className="font-bold line-clamp-1">{user?.profile?.allergies || 'None'}</p></div>
                <div><p className="text-red-400/70 text-[10px] font-bold">Conditions</p><p className="font-bold line-clamp-1">{user?.profile?.conditions || 'None'}</p></div>
              </div>
            </div>

            <div className="w-full space-y-3">
              {sos.time>0 && <button className="w-full bg-white text-red-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-900/50 uppercase tracking-widest">Call Ambulance</button>}
              <button onClick={()=>{setSos(p=>({...p, act:false})); setTimeout(()=>setSos({act:false, time:5}), 300)}} className="w-full bg-red-800/50 border border-red-500/30 text-white font-bold py-4 rounded-2xl uppercase tracking-wider">{sos.time>0 ? 'Cancel' : 'Close'}</button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe pt-2 px-2 z-30 flex justify-around items-center h-[76px] pb-2">
          {[ {id:'home', i:Home, l:'Home'}, {id:'medicines', i:Pill, l:'Meds'}, {id:'reports', i:FileText, l:'Reports'}, {id:'chat', i:MessageSquare, l:'Chat'}, {id:'care', i:Heart, l:'Care'}, {id:'profile', i:User, l:'Profile'} ].map(n => {
            const act = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} className="flex flex-col items-center w-14 relative">
                {act && <div className="absolute -top-4 w-6 h-1 bg-sky-500 rounded-b-full shadow-[0_0_10px_rgba(14,165,233,1)]" />}
                <n.i size={24} className={`mb-1 transition-all ${act ? 'text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-500'}`} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${act ? 'text-sky-400' : 'text-slate-500'}`}>{n.l}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
