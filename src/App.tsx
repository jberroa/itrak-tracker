/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Hospital as HospitalIcon, 
  BarChart3, 
  Info, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  QrCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Calendar,
  Download,
  Monitor,
  FileText,
  Lock,
  Settings,
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { MODULES, HOSPITALS, DIVISIONS, ROLLOUT_STEPS } from './constants';
import { RolloutProgress } from './types';

// Initial empty progress data
const EMPTY_PROGRESS: RolloutProgress[] = HOSPITALS.map(h => ({
  hospitalId: h.id,
  moduleId: "qr-care-exp",
  completedSteps: 0,
  stepStatus: Array(12).fill(false),
  stepCompletionDates: Array(12).fill(null),
  stepComments: Array(12).fill(""),
  lastUpdated: new Date().toISOString()
}));

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'modules' | 'progress' | 'analytics' | 'timeline' | 'admin'>('intro');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [progress, setProgress] = useState<RolloutProgress[]>(EMPTY_PROGRESS);
  const progressRef = useRef(progress);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const saveProgressToServer = useCallback(async (data: RolloutProgress[]) => {
    try {
      await fetch('/api/progress/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, []);

  const triggerSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveProgressToServer(progressRef.current);
      saveTimeoutRef.current = null;
    }, 500);
  }, [saveProgressToServer]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/progress')
      .then((res) => res.ok ? res.json() : [])
      .then((data: RolloutProgress[]) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setProgress(data);
        } else {
          saveProgressToServer(EMPTY_PROGRESS);
          setProgress(EMPTY_PROGRESS);
        }
      })
      .catch(() => {
        if (!cancelled) {
          saveProgressToServer(EMPTY_PROGRESS);
          setProgress(EMPTY_PROGRESS);
        }
      });
    return () => { cancelled = true; };
  }, [saveProgressToServer]);

  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [rolloutStartDate, setRolloutStartDate] = useState<string>('2026-03-16');

  useEffect(() => {
    setExpandedSteps(new Set());
  }, [selectedHospitalId]);

  const toggleComment = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleStep = (hospitalId: string, index: number) => {
    setProgress(prev => prev.map(p => {
      if (p.hospitalId === hospitalId) {
        const newStatus = [...p.stepStatus];
        const newDates = [...p.stepCompletionDates];
        const now = new Date().toISOString();
        
        newStatus[index] = !newStatus[index];
        newDates[index] = newStatus[index] ? now : null;

        return { 
          ...p, 
          stepStatus: newStatus,
          stepCompletionDates: newDates,
          completedSteps: newStatus.filter(Boolean).length,
          lastUpdated: now 
        };
      }
      return p;
    }));
    triggerSave();
  };

  const updateComment = (hospitalId: string, index: number, comment: string) => {
    setProgress(prev => prev.map(p => {
      if (p.hospitalId === hospitalId) {
        const newComments = [...p.stepComments];
        newComments[index] = comment;
        return { ...p, stepComments: newComments, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
    triggerSave();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1518') {
      setIsAdminAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setAdminPin('');
    }
  };

  const resetAllProgress = () => {
    setProgress(EMPTY_PROGRESS);
    setShowResetConfirm(false);
    triggerSave();
  };

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDivision = selectedDivisionFilter === 'all' || h.divisionId === selectedDivisionFilter;
      return matchesSearch && matchesDivision;
    });
  }, [searchQuery, selectedDivisionFilter]);

  const selectedHospital = HOSPITALS.find(h => h.id === selectedHospitalId);
  const hospitalProgress = progress.find(p => p.hospitalId === selectedHospitalId);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-black/5 z-50 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tighter text-[#141414] flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            ITRAK
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mt-1">Medama Technology</p>
        </div>

        <div className="space-y-1 flex-1">
          <NavButton 
            active={activeTab === 'intro'} 
            onClick={() => setActiveTab('intro')} 
            icon={<Info size={18} />} 
            label="Introduction" 
          />
          <NavButton 
            active={activeTab === 'modules'} 
            onClick={() => setActiveTab('modules')} 
            icon={<ClipboardList size={18} />} 
            label="Modules" 
          />
          <NavButton 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
            icon={<HospitalIcon size={18} />} 
            label="Rollout Progress" 
          />
          <NavButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
            icon={<BarChart3 size={18} />} 
            label="Division Analytics" 
          />
          <NavButton 
            active={activeTab === 'timeline'} 
            onClick={() => setActiveTab('timeline')} 
            icon={<Calendar size={18} />} 
            label="30-Day Plan" 
          />
          <div className="pt-4 mt-4 border-t border-black/5">
            <NavButton 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')} 
              icon={<Lock size={18} />} 
              label="Admin Panel" 
            />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-black/5">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              HCA
            </div>
            <div>
              <p className="text-xs font-bold">HCA Healthcare</p>
              <p className="text-[10px] opacity-50">Enterprise Client</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-64 p-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <section className="space-y-6">
                <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded">
                  Welcome to Medama
                </div>
                <h2 className="text-6xl font-light tracking-tight leading-none">
                  Precision Rollout <br />
                  <span className="font-bold italic">Management.</span>
                </h2>
                <p className="text-xl text-black/60 max-w-2xl leading-relaxed">
                  Medama ITRAK is our proprietary platform designed to streamline the implementation of cutting-edge healthcare technology. We bridge the gap between IT approval and operational excellence.
                </p>
              </section>

              <div className="grid grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<ShieldCheck className="text-emerald-600" />}
                  title="IT Approved"
                  description="Pre-vetted security and infrastructure protocols for rapid hospital deployment."
                />
                <FeatureCard 
                  icon={<Users className="text-blue-600" />}
                  title="Collaborative"
                  description="Unified tracking for Division Leaders, Unit Managers, and IT Teams."
                />
                <FeatureCard 
                  icon={<BarChart3 className="text-purple-600" />}
                  title="Data Driven"
                  description="Real-time dashboards showing exactly where each unit stands in the rollout."
                />
              </div>

              <div className="bg-white p-12 rounded-3xl border border-black/5 shadow-sm">
                <div className="flex items-start gap-12">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-bold">Current Focus: HCA Healthcare</h3>
                    <p className="text-black/60 leading-relaxed">
                      We are currently rolling out the <strong>QR Code Care Experience</strong> across HCA divisions. This module empowers patients and staff to communicate directly with housekeeping, ensuring a cleaner, safer environment with delegated request management.
                    </p>
                    <button 
                      onClick={() => setActiveTab('progress')}
                      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black/80 transition-colors"
                    >
                      View HCA Progress <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="w-1/3 aspect-square bg-[#F0F0F0] rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <QrCode size={120} className="opacity-10 absolute -right-10 -bottom-10 rotate-12" />
                    <QrCode size={80} className="text-black/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">Technology Modules</h2>
                <p className="text-black/50">Explore our suite of healthcare optimization tools.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {MODULES.map(module => (
                  <div key={module.id} className="bg-white p-8 rounded-2xl border border-black/5 hover:border-black/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        {module.id === 'qr-care-exp' ? <QrCode size={24} /> : <Zap size={24} />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Module ID: {module.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
                    <p className="text-black/60 text-sm mb-6 leading-relaxed">{module.description}</p>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Key Benefits</p>
                      <ul className="space-y-2">
                        {module.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-black/80">
                            <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Rollout Progress</h2>
                  <p className="text-black/50">Tracking HCA Healthcare: QR Code Care Experience</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase opacity-40">Overall Completion</p>
                    <p className="text-2xl font-bold">
                      {Math.round((progress.reduce((acc, p) => acc + p.completedSteps, 0) / (progress.length * 12)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Hospital List */}
                <div className="col-span-4 space-y-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Filter & Search</p>
                    <input 
                      type="text"
                      placeholder="Search hospitals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:border-black/20"
                    />
                    <select 
                      value={selectedDivisionFilter}
                      onChange={(e) => setSelectedDivisionFilter(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:border-black/20"
                    >
                      <option value="all">All Divisions</option>
                      {DIVISIONS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">
                      Results ({filteredHospitals.length})
                    </p>
                    {filteredHospitals.map(hospital => {
                      const hospProgress = progress.find(p => p.hospitalId === hospital.id);
                      const isSelected = selectedHospitalId === hospital.id;
                      const percent = Math.round(((hospProgress?.completedSteps || 0) / 12) * 100);
                      
                      return (
                        <button
                          key={hospital.id}
                          onClick={() => setSelectedHospitalId(hospital.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                            isSelected 
                              ? 'bg-black border-black text-white shadow-lg' 
                              : 'bg-white border-black/5 hover:border-black/20'
                          }`}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-white/60' : 'text-black/40'}`}>
                              {DIVISIONS.find(d => d.id === hospital.divisionId)?.name}
                            </p>
                            <p className="font-bold text-sm truncate">{hospital.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold">{percent}%</p>
                            <div className={`w-12 h-1 rounded-full mt-1 overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-black/5'}`}>
                              <div 
                                className={`h-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-black'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {filteredHospitals.length === 0 && (
                      <div className="text-center py-10 opacity-30 text-sm italic">
                        No hospitals found matching your criteria
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Tracker */}
                <div className="col-span-8">
                  {selectedHospitalId ? (
                    <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm min-h-[600px]">
                      <div className="mb-8 flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-bold">{selectedHospital?.name}</h3>
                          <p className="text-sm text-black/50">Implementation Roadmap</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                          Step {hospitalProgress ? hospitalProgress.completedSteps + 1 : 1} of 12
                        </div>
                      </div>

                      <div className="space-y-4">
                        {ROLLOUT_STEPS.map((step, index) => {
                          const isCompleted = hospitalProgress?.stepStatus[index];
                          
                          return (
                            <div 
                              key={index}
                              className={`p-4 rounded-xl border transition-all ${
                                isCompleted ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-black/5'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <button 
                                  onClick={() => toggleStep(selectedHospitalId, index)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-black/5 text-black/20 hover:bg-black/10'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-4">
                                    <div>
                                      <p className={`text-sm font-medium ${!isCompleted ? 'text-black/60' : 'text-black'}`}>
                                        {step}
                                      </p>
                                      {isCompleted && hospitalProgress?.stepCompletionDates[index] && (
                                        <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                          Completed on {new Date(hospitalProgress.stepCompletionDates[index]!).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    <button 
                                      onClick={() => toggleComment(index)}
                                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                        expandedSteps.has(index) 
                                          ? 'bg-black text-white' 
                                          : 'bg-black/5 text-black/40 hover:bg-black/10'
                                      }`}
                                    >
                                      <MessageSquare size={12} />
                                      {expandedSteps.has(index) ? 'Hide Comment' : 'Add Comment'}
                                      {expandedSteps.has(index) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                  </div>

                                  <AnimatePresence>
                                    {expandedSteps.has(index) && (
                                      <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-3">
                                          <textarea
                                            placeholder="Add a comment (e.g., who approved this step)..."
                                            value={hospitalProgress?.stepComments[index] || ''}
                                            onChange={(e) => updateComment(selectedHospitalId, index, e.target.value)}
                                            className="w-full p-3 text-xs bg-black/5 border-none rounded-xl focus:ring-1 focus:ring-black/10 resize-none h-24 placeholder:opacity-30"
                                          />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white/50 border border-dashed border-black/10 rounded-2xl p-12 text-center">
                      <HospitalIcon size={48} className="text-black/10 mb-4" />
                      <h3 className="text-xl font-bold opacity-30">Select a hospital to view its rollout roadmap</h3>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">Division Analytics</h2>
                <p className="text-black/50">Aggregated rollout performance across HCA divisions.</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {DIVISIONS.map(division => {
                  const divisionHospitals = HOSPITALS.filter(h => h.divisionId === division.id);
                  const divisionProgress = progress.filter(p => divisionHospitals.some(h => h.id === p.hospitalId));
                  const avgSteps = divisionProgress.reduce((acc, p) => acc + p.completedSteps, 0) / divisionProgress.length;
                  const percent = Math.round((avgSteps / 12) * 100);

                  return (
                    <div key={division.id} className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Division</p>
                      <h3 className="text-xl font-bold mb-6">{division.name}</h3>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-3xl font-bold">{percent}%</p>
                            <p className="text-xs text-black/40">Average Completion</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{divisionHospitals.length}</p>
                            <p className="text-xs text-black/40">Hospitals</p>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-black"
                          />
                        </div>

                        <div className="pt-4 border-t border-black/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">Hospital Status</p>
                          <div className="space-y-2">
                            {divisionHospitals.map(h => {
                              const p = progress.find(pr => pr.hospitalId === h.id);
                              const pPercent = Math.round(((p?.completedSteps || 0) / 12) * 100);
                              return (
                                <div key={h.id} className="flex justify-between items-center text-xs">
                                  <span className="text-black/60 truncate mr-4">{h.name}</span>
                                  <span className={`font-bold ${pPercent === 100 ? 'text-emerald-600' : 'text-black'}`}>
                                    {pPercent}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">30-Day Rollout Plan</h2>
                  <p className="text-black/50">Generate and download a custom implementation timeline.</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Start Date</label>
                    <input 
                      type="date"
                      value={rolloutStartDate}
                      onChange={(e) => setRolloutStartDate(e.target.value)}
                      className="p-3 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Division</label>
                    <select 
                      value={selectedDivisionId || ''}
                      onChange={(e) => {
                        setSelectedDivisionId(e.target.value || null);
                        setSelectedHospitalId(null);
                      }}
                      className="p-3 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:border-black/20"
                    >
                      <option value="">Select Division</option>
                      {DIVISIONS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Hospital</label>
                    <select 
                      value={selectedHospitalId || ''}
                      onChange={(e) => {
                        setSelectedHospitalId(e.target.value || null);
                        setSelectedDivisionId(null);
                      }}
                      className="p-3 rounded-xl border border-black/5 bg-white text-sm focus:outline-none focus:border-black/20"
                    >
                      <option value="">Select Hospital</option>
                      {HOSPITALS.filter(h => !selectedDivisionId || h.divisionId === selectedDivisionId).map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {(selectedHospitalId || selectedDivisionId) ? (
                <TimelineGenerator 
                  entityName={selectedHospitalId ? HOSPITALS.find(h => h.id === selectedHospitalId)?.name || '' : DIVISIONS.find(d => d.id === selectedDivisionId)?.name || ''}
                  isDivision={!!selectedDivisionId}
                  hospitalCount={selectedDivisionId ? HOSPITALS.filter(h => h.divisionId === selectedDivisionId).length : 1}
                  startDate={rolloutStartDate}
                />
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center bg-white/50 border border-dashed border-black/10 rounded-2xl p-12 text-center">
                  <Calendar size={48} className="text-black/10 mb-4" />
                  <h3 className="text-xl font-bold opacity-30">Select a hospital or division to generate your 30-day plan</h3>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {!isAdminAuthenticated ? (
                <div className="bg-white p-12 rounded-3xl border border-black/5 shadow-xl text-center max-w-md mx-auto mt-20">
                  <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-black" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Admin Access</h2>
                  <p className="text-black/50 text-sm mb-8">Please enter your security PIN to continue.</p>
                  
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <input 
                      type="password"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter PIN"
                      maxLength={4}
                      className={`w-full p-4 text-center text-2xl tracking-[1em] font-bold rounded-2xl border ${
                        pinError ? 'border-red-500 bg-red-50' : 'border-black/5 bg-black/5'
                      } focus:outline-none focus:ring-2 focus:ring-black/10`}
                      autoFocus
                    />
                    {pinError && (
                      <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Invalid PIN. Please try again.</p>
                    )}
                    <button 
                      type="submit"
                      className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:bg-black/80 transition-all shadow-lg"
                    >
                      Unlock Panel
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tight">Admin Panel</h2>
                      <p className="text-black/50">System management and data controls.</p>
                    </div>
                    <button 
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black"
                    >
                      Logout
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                          <RefreshCcw className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-bold">Reset Progress</h3>
                          <p className="text-xs text-black/50">Clear all completion data.</p>
                        </div>
                      </div>
                      <p className="text-sm text-black/60 leading-relaxed">
                        This action will reset all hospital rollout progress to 0%. All completion dates and comments will be permanently deleted.
                      </p>
                      
                      {!showResetConfirm ? (
                        <button 
                          onClick={() => setShowResetConfirm(true)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-md"
                        >
                          <Trash2 size={18} />
                          Reset All Progress
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-red-500 text-center uppercase tracking-widest">Are you absolutely sure?</p>
                          <div className="flex gap-3">
                            <button 
                              onClick={resetAllProgress}
                              className="flex-1 bg-red-600 text-white p-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-md"
                            >
                              Yes, Reset
                            </button>
                            <button 
                              onClick={() => setShowResetConfirm(false)}
                              className="flex-1 bg-black/5 text-black p-4 rounded-2xl font-bold hover:bg-black/10 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <Settings className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold">System Configuration</h3>
                          <p className="text-xs text-black/50">Manage divisions and hospitals.</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-black/5 rounded-xl text-xs">
                          <span className="font-medium">Total Divisions</span>
                          <span className="font-bold">{DIVISIONS.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-black/5 rounded-xl text-xs">
                          <span className="font-medium">Total Hospitals</span>
                          <span className="font-bold">{HOSPITALS.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-black/5 rounded-xl text-xs">
                          <span className="font-medium">Rollout Steps</span>
                          <span className="font-bold">{ROLLOUT_STEPS.length}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-black/30 italic">
                        Note: Structural changes currently require code updates in constants.ts
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Monitor className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Developer Information</h3>
                        <p className="text-white/40 text-xs">Source code and export options.</p>
                      </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl space-y-6">
                      <p className="text-sm text-white/70 leading-relaxed">
                        The full source code for this application can be exported directly from the platform.
                      </p>
                      
                      <button 
                        onClick={async () => {
                          const zip = new JSZip();
                          const files = [
                            "package.json",
                            "server.ts",
                            "vite.config.ts",
                            "tsconfig.json",
                            "index.html",
                            "src/App.tsx",
                            "src/constants.ts",
                            "src/types.ts",
                            "src/main.tsx",
                            "src/index.css"
                          ];
                          
                          for (const file of files) {
                            try {
                              const response = await fetch(`/api/source/${file}`);
                              if (!response.ok) throw new Error(`Failed to fetch ${file}`);
                              const content = await response.text();
                              zip.file(file, content);
                            } catch (err) {
                              console.error(`Error downloading ${file}:`, err);
                            }
                          }
                          
                          const zipBlob = await zip.generateAsync({ type: 'blob' });
                          const url = URL.createObjectURL(zipBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'Medama-ITRAK-Source.zip';
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black p-4 rounded-2xl font-bold hover:bg-white/90 transition-all shadow-md"
                      >
                        <Download size={18} />
                        Download Full Source ZIP
                      </button>

                      <p id="download-hint" className="text-[10px] text-center text-emerald-400 font-bold uppercase tracking-widest opacity-0 transition-opacity duration-500">
                        Use the "Export" option in the AI Studio Settings menu (top right)
                      </p>

                      <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Framework</p>
                          <p className="text-sm font-bold">React + Vite</p>
                        </div>
                        <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Styling</p>
                          <p className="text-sm font-bold">Tailwind CSS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TimelineGenerator({ entityName, isDivision, hospitalCount, startDate }: { entityName: string, isDivision: boolean, hospitalCount: number, startDate: string }) {
  const timelineRef = React.useRef<HTMLDivElement>(null);

  const formatDate = (dateStr: string, daysToAdd: number = 0, includeYear: boolean = true) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: includeYear ? 'numeric' : undefined 
    });
  };

  const formatShortDate = (dateStr: string, daysToAdd: number = 0) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatMonthDay = (dateStr: string, daysToAdd: number = 0) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  const downloadImage = async () => {
    if (!timelineRef.current) return;
    const canvas = await html2canvas(timelineRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });
    const link = document.createElement('a');
    link.download = `Medama-ITRAK-${entityName.replace(/\s+/g, '-')}-Rollout.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={downloadImage}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black/80 transition-colors shadow-lg"
        >
          <Download size={16} /> Download Timeline Image
        </button>
      </div>

      <div 
        ref={timelineRef}
        className="bg-white p-10 rounded-xl border border-black/5 shadow-2xl overflow-hidden min-w-[1000px] font-sans"
        style={{ width: '100%' }}
      >
        {/* Header */}
        <div className="bg-[#1e3a8a] p-6 -mx-10 -mt-10 mb-8 border-b-4 border-[#f97316]">
          <h1 className="text-4xl font-bold text-white text-center tracking-tight">
            Medama <span className="text-[#f97316]">ITRAK</span> {entityName} Rollout Timeline
          </h1>
          <p className="text-white/80 text-center mt-2 font-medium">
            30-Day QR Code Implementation: {formatDate(startDate)} – {formatDate(startDate, 27)}
          </p>
        </div>

        {/* Timeline Arrow */}
        <div className="relative mb-16 px-10">
          <div className="h-1 bg-blue-200 w-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 border-l-[12px] border-l-blue-500 border-y-[8px] border-y-transparent"></div>
            
            {/* Dates */}
            <TimelinePoint date={formatMonthDay(startDate)} position="0%" color="bg-emerald-500" />
            <TimelinePoint date={formatMonthDay(startDate, 4)} position="22%" color="bg-emerald-600" />
            <TimelinePoint date={formatMonthDay(startDate, 7)} position="40%" color="bg-orange-500" />
            <TimelinePoint date={formatMonthDay(startDate, 14)} position="60%" color="bg-blue-500" />
            <TimelinePoint date={formatMonthDay(startDate, 18)} position="75%" color="bg-blue-600" />
            <TimelinePoint date={formatMonthDay(startDate, 21)} position="90%" color="bg-amber-500" />
          </div>
        </div>

        {/* Week Blocks */}
        <div className="grid grid-cols-5 gap-1 mb-12">
          <WeekBlock 
            week="Week 1" 
            dates={`${formatMonthDay(startDate)}–${formatShortDate(startDate, 4)}`} 
            color="bg-emerald-500" 
            icon={<Calendar size={20} />} 
            isFirst
          />
          <WeekBlock 
            week="Week 2" 
            dates={`${formatMonthDay(startDate, 7)}–${formatShortDate(startDate, 11)}`} 
            color="bg-orange-500" 
            icon={<QrCode size={20} />} 
          />
          <WeekBlock 
            week="Week 3" 
            dates={`${formatMonthDay(startDate, 14)}–${formatShortDate(startDate, 18)}`} 
            color="bg-blue-500" 
            icon={<Monitor size={20} />} 
          />
          <WeekBlock 
            week="Week 3" 
            dates={`${formatMonthDay(startDate, 14)}–${formatMonthDay(startDate, 18)}`} 
            color="bg-blue-600" 
            icon={<BarChart3 size={20} />} 
          />
          <WeekBlock 
            week="Week 4" 
            dates={`${formatMonthDay(startDate, 21)}–${formatMonthDay(startDate, 27)}`} 
            color="bg-amber-500" 
            icon={<FileText size={20} />} 
            isLast
          />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          <TimelineDetail 
            title="Week 1 – Leadership Alignment & System Setup"
            dates={`${formatMonthDay(startDate)} – ${formatMonthDay(startDate, 4)}`}
            color="text-emerald-700"
            bullets={[
              "Division Kickoff Call",
              "Collect Hospital Excel Setup Data",
              "IT Security Review & Approval",
              "ITRAK Platform Configuration"
            ]}
          />
          <TimelineDetail 
            title="Hospital Rollout: Install QR Co- & Train Staff"
            dates={`${formatMonthDay(startDate, 7)} – ${formatMonthDay(startDate, 11)}`}
            color="text-orange-700"
            bullets={[
              "Install QR signs",
              "Train Managers & Employees",
              "Launch Facility Go-Lives",
              "Enable Live Dashboard Monitoring"
            ]}
          />
          <TimelineDetail 
            title="Initial Data Review & Optimization"
            dates={`${formatMonthDay(startDate, 14)} – ${formatMonthDay(startDate, 18)}`}
            color="text-blue-700"
            bullets={[
              "Monitor QR Code Usage",
              "Track Cleanings & Service Times",
              "Review Alerts & Escalations"
            ]}
          />
          <TimelineDetail 
            title="Week 4 – Executive Review & Optimization"
            dates={`${formatMonthDay(startDate, 21)} – ${formatMonthDay(startDate, 27)}`}
            color="text-amber-700"
            bullets={[
              "Review Compliance Data",
              "Track Escalation Responses",
              "Conduct Regional Optimization Meeting",
              "Set Ongoing Monitoring KPIs"
            ]}
          />
        </div>

        {/* Go Live Banner */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-8 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
              All Hospitals Go Live: {formatMonthDay(startDate, 7)} – {formatMonthDay(startDate, 11)}
            </div>
            <div className="flex-1">
              <ul className="grid grid-cols-3 gap-4">
                <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Weeklong deployment to <strong>{isDivision ? hospitalCount : 1} hospitals</strong>
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Employees trained to scan QR codes
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-blue-900">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Executive dashboard tracks performance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Monitoring */}
        <div className="bg-slate-900 p-4 -mx-10 -mb-10 flex justify-between items-center px-10">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
            Ongoing Monitoring
          </div>
          <div className="flex gap-8 text-white/60 text-[10px] font-bold uppercase tracking-widest">
            <span>Weekly regional performance review</span>
            <span>•</span>
            <span>Executive dashboard insights</span>
            <span>•</span>
            <span>Compliance and escalation analysis</span>
            <span>•</span>
            <span>Optimization</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelinePoint({ date, position, color }: { date: string, position: string, color: string }) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: position }}>
      <p className="text-[10px] font-bold text-black/40 mb-2 absolute -top-6 whitespace-nowrap">{date}</p>
      <div className={`w-3 h-3 rounded-full ${color} border-2 border-white shadow-sm`}></div>
    </div>
  );
}

function WeekBlock({ week, dates, color, icon, isFirst, isLast }: { week: string, dates: string, color: string, icon: React.ReactNode, isFirst?: boolean, isLast?: boolean }) {
  return (
    <div className={`relative flex items-center p-4 ${color} text-white overflow-hidden ${isFirst ? 'rounded-l-xl' : ''} ${isLast ? 'rounded-r-xl' : ''}`}>
      <div className="mr-3 opacity-80">{icon}</div>
      <div>
        <p className="text-xs font-bold opacity-80">{week}</p>
        <p className="text-[10px] font-medium whitespace-nowrap">{dates}</p>
      </div>
      {!isLast && (
        <div className="absolute right-0 top-0 bottom-0 w-4 overflow-hidden">
          <div className="h-full w-full bg-white/10 skew-x-[30deg] translate-x-2"></div>
        </div>
      )}
    </div>
  );
}

function TimelineDetail({ title, dates, color, bullets }: { title: string, dates: string, color: string, bullets: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className={`text-sm font-bold leading-tight ${color}`}>{title}</h4>
      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{dates}</p>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-black/70 leading-tight">
            <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${color.replace('text', 'bg')}`}></div>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-black text-white shadow-md' 
          : 'text-black/50 hover:bg-black/5 hover:text-black'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
      <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-xs text-black/50 leading-relaxed">{description}</p>
    </div>
  );
}
