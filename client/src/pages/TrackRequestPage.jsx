import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Search, FileText, Calendar, 
  CheckCircle2, Clock, AlertCircle, PlayCircle, Star, Globe, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { requestsService } from '../services/requestsService';

const TrackRequestPage = () => {
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const { isLight } = useTheme();
  const trk = t.trackRequest || {};
  const r = t.requestProject || {};

  const [referenceId, setReferenceId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [requestData, setRequestData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!referenceId.trim() || !email.trim()) {
      setErrorMsg(isRTL ? 'يرجى إدخال رقم المرجع والبريد الإلكتروني معاً.' : 'Please enter both reference number and email.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await requestsService.track(referenceId.trim(), email.trim());
      if (response.success && response.data) {
        setRequestData(response.data);
        setStatus('success');
      } else {
        setErrorMsg(response.error || trk.notFound || (isRTL ? 'لم يتم العثور على الطلب أو البريد غير متطابق.' : 'Request not found or email does not match.'));
        setStatus('error');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setErrorMsg(err.message || trk.notFound || (isRTL ? 'لم يتم العثور على طلب مطابق.' : 'Request not found. Please check your reference and email.'));
      setStatus('error');
    }
  };

  const statusSteps = [
    { id: 'new', label: trk.statuses?.new || (isRTL ? 'تم الاستلام' : 'Received'), icon: FileText },
    { id: 'reviewing', label: trk.statuses?.reviewing || (isRTL ? 'قيد المراجعة' : 'Under Review'), icon: Clock },
    { id: 'contacted', label: trk.statuses?.contacted || (isRTL ? 'تم التواصل' : 'Contacted'), icon: AlertCircle },
    { id: 'in_progress', label: trk.statuses?.in_progress || (isRTL ? 'قيد التنفيذ' : 'In Progress'), icon: PlayCircle },
    { id: 'completed', label: trk.statuses?.completed || (isRTL ? 'مكتمل' : 'Completed'), icon: CheckCircle2 }
  ];

  const getCurrentStepIndex = () => {
    if (!requestData) return -1;
    const s = requestData.status?.toLowerCase();
    const idx = statusSteps.findIndex((step) => step.id === s);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-500 pb-20 font-sans ${
        isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#040711] text-slate-100'
      }`}
    >
      {/* Top Header */}
      <header className="pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between mb-10">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold px-4 py-2 rounded-full border transition ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800 hover:border-sky-500 shadow-sm'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white'
          }`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{trk.backToPortfolio || (isRTL ? 'العودة للمعرض' : 'Back to Portfolio')}</span>
        </Link>

        <button
          onClick={toggleLanguage}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-full border transition ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              : 'bg-slate-900/80 border-slate-700 text-cyan-300 hover:border-cyan-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
        {/* Title Header */}
        <div className="text-center mb-10">
          <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-2 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
            02 // REQUEST TRACKING SYSTEM
          </div>
          <h1 className="text-responsive-h2 font-display font-extrabold mb-3">
            <span
              className={`bg-clip-text text-transparent ${
                isLight
                  ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900'
                  : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'
              }`}
            >
              {trk.pageTitle || (isRTL ? 'تتبع حالة طلبك' : 'Track Your Request')}
            </span>
          </h1>
          <p className={`text-xs sm:text-sm md:text-base font-sans max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {isRTL
              ? 'أدخل رقم المرجع الذي وصلك والبريد الإلكتروني للتحقق من مرحلة تنفيذ مشروعك.'
              : 'Enter your project reference number and email address to view the live milestone progress.'}
          </p>
        </div>

        {/* Search Card */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border backdrop-blur-2xl transition-all shadow-2xl relative overflow-hidden mb-8 ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/90 border-cyan-500/35 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.18)]'
          }`}
        >
          <form onSubmit={handleTrack} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold mb-1.5">
                  {trk.referenceLabel || (isRTL ? 'رقم المرجع' : 'Reference Number')} *
                </label>
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-4 h-4 text-slate-400`} />
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder={trk.referencePlaceholder || 'MJ-XXXX'}
                    className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition font-mono ${isRTL ? 'pr-11' : 'pl-11'} ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                        : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold mb-1.5">
                  {trk.emailLabel || (isRTL ? 'البريد الإلكتروني' : 'Email Address')} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={trk.emailPlaceholder || 'your@email.com'}
                  className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                  }`}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full min-h-[48px] py-3.5 rounded-xl font-display font-extrabold text-sm uppercase transition shadow-xl flex items-center justify-center gap-2 transform active:scale-95 ${
                isLight
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.35)]'
                  : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.5)]'
              }`}
            >
              {status === 'loading' ? (
                <span>{trk.tracking || (isRTL ? 'جارٍ البحث...' : 'Searching...')}</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{trk.trackBtn || (isRTL ? 'تتبع الطلب' : 'Track Request')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results View */}
        <AnimatePresence>
          {status === 'success' && requestData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 sm:p-10 rounded-3xl border backdrop-blur-2xl transition-all shadow-2xl relative overflow-hidden ${
                isLight
                  ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
                  : 'bg-slate-950/90 border-cyan-500/35 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.18)]'
              }`}
            >
              {/* Request Summary Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-display font-bold">
                    {requestData.project_name || (isRTL ? 'طلب مشروع برمجى' : 'Project Request')}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      {r.projectTypes?.[requestData.project_type] || requestData.project_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(requestData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-center ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Reference</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm sm:text-base">
                    {requestData.reference_number}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="pt-8">
                <h4 className="text-sm font-display font-bold mb-6 text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{trk.statusFlow || (isRTL ? 'مراحل تنفيذ الطلب' : 'Request Milestone Progress')}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {statusSteps.map((step, idx) => {
                    const isPast = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const isFuture = idx > currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-2xl border flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 transition-all ${
                          isCurrent
                            ? isLight
                              ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-md ring-2 ring-sky-500/20'
                              : 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/30'
                            : isPast
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : isPast
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isPast ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                        </div>

                        <div className="flex flex-col sm:items-center">
                          <span className="text-xs font-display font-bold">{step.label}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {isRTL ? 'الحالة الحالية' : 'Current Stage'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TrackRequestPage;
