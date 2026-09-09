import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, 
  Monitor, FileText, UploadCloud, X, CheckCircle2, 
  Calendar, DollarSign, List, ShieldCheck, Sparkles, Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { requestsService } from '../services/requestsService';

const RequestProjectPage = () => {
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const { isLight } = useTheme();
  const r = t.requestProject || {};
  const c = t.common || {};

  // Step State (0: Personal, 1: Project, 2: Budget & Deadline, 3: Files & Review)
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionState, setSubmissionState] = useState('idle'); // idle, submitting, success, error
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    projectName: '',
    projectType: '',
    description: '',
    budget: '',
    deadline: '',
    additionalRequirements: ''
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        newErrors.fullName = r.validation?.nameMin || (isRTL ? 'يجب أن يكون الاسم حرفين على الأقل' : 'Name must be at least 2 characters');
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        newErrors.email = r.validation?.emailInvalid || (isRTL ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
        isValid = false;
      }
    } else if (step === 1) {
      if (!formData.projectType) {
        newErrors.projectType = r.validation?.typeRequired || (isRTL ? 'يرجى اختيار نوع المشروع' : 'Please select a project type');
        isValid = false;
      }
      if (!formData.description || formData.description.trim().length < 20) {
        newErrors.description = r.validation?.descriptionMin || (isRTL ? 'يجب أن يكون الوصف 20 حرفًا على الأقل' : 'Description must be at least 20 characters');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const allowedTypes = [
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed', 'image/jpeg', 'image/png', 'image/webp'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = newFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const validExts = ['pdf', 'doc', 'docx', 'zip', 'jpg', 'jpeg', 'png', 'webp'];
      if (!validExts.includes(ext)) {
        alert(r.validation?.invalidFileType || (isRTL ? `نوع الملف غير مسموح: ${file.name}` : `File type not allowed: ${file.name}`));
        return false;
      }
      if (file.size > maxSize) {
        alert(r.validation?.fileTooLarge || (isRTL ? `الملف يتجاوز 10 ميجابايت: ${file.name}` : `File exceeds 10MB: ${file.name}`));
        return false;
      }
      return true;
    });

    setFiles((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > 5) {
        alert(r.validation?.tooManyFiles || (isRTL ? 'الحد الأقصى 5 ملفات فقط' : 'Maximum 5 files allowed'));
        return combined.slice(0, 5);
      }
      return combined;
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) return;

    setSubmissionState('submitting');
    setErrorMessage('');

    const submitData = new FormData();
    submitData.append('full_name', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('country', formData.country);
    submitData.append('project_name', formData.projectName);
    submitData.append('project_type', formData.projectType);
    submitData.append('description', formData.description);
    submitData.append('budget', formData.budget);
    submitData.append('deadline', formData.deadline);
    submitData.append('additional_requirements', formData.additionalRequirements);

    files.forEach((file) => {
      submitData.append('attachments', file);
    });

    try {
      const result = await requestsService.submit(submitData);
      if (result.success) {
        setReferenceId(result.data?.referenceNumber || 'MJ-SUCCESS');
        setSubmissionState('success');
      } else {
        setSubmissionState('error');
        setErrorMessage(result.error || (isRTL ? 'حدث خطأ أثناء إرسال الطلب' : 'Failed to submit request'));
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmissionState('error');
      setErrorMessage(err.message || (isRTL ? 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً' : 'Could not connect to server'));
    }
  };

  const projectTypeOptions = [
    { value: 'website', label: r.projectTypes?.website || (isRTL ? 'موقع إلكتروني' : 'Website') },
    { value: 'ecommerce', label: r.projectTypes?.ecommerce || (isRTL ? 'متجر إلكتروني' : 'E-Commerce') },
    { value: 'web_application', label: r.projectTypes?.web_application || (isRTL ? 'تطبيق ويب' : 'Web Application') },
    { value: 'management_system', label: r.projectTypes?.management_system || (isRTL ? 'نظام إدارة' : 'Management System') },
    { value: 'pos_system', label: r.projectTypes?.pos_system || (isRTL ? 'نظام نقاط بيع' : 'POS System') },
    { value: 'database_system', label: r.projectTypes?.database_system || (isRTL ? 'نظام قواعد بيانات' : 'Database System') },
    { value: 'ui_ux_design', label: r.projectTypes?.ui_ux_design || (isRTL ? 'تصميم واجهات UI/UX' : 'UI/UX Design') },
    { value: 'wordpress', label: r.projectTypes?.wordpress || (isRTL ? 'ووردبريس' : 'WordPress') },
    { value: 'other', label: r.projectTypes?.other || (isRTL ? 'أخرى' : 'Other') }
  ];

  const budgetOptions = [
    { value: 'under_100', label: r.budgetOptions?.under_100 || '< $100' },
    { value: '100_300', label: r.budgetOptions?.['100_300'] || '$100 – $300' },
    { value: '300_500', label: r.budgetOptions?.['300_500'] || '$300 – $500' },
    { value: '500_1000', label: r.budgetOptions?.['500_1000'] || '$500 – $1,000' },
    { value: '1000_plus', label: r.budgetOptions?.['1000_plus'] || '$1,000+' },
    { value: 'not_sure', label: r.budgetOptions?.not_sure || (isRTL ? 'غير متأكد بعد' : 'Not sure yet') }
  ];

  const deadlineOptions = [
    { value: 'asap', label: r.deadlineOptions?.asap || (isRTL ? 'في أقرب وقت' : 'ASAP') },
    { value: '1_2_weeks', label: r.deadlineOptions?.['1_2_weeks'] || (isRTL ? '1–2 أسابيع' : '1–2 Weeks') },
    { value: '1_month', label: r.deadlineOptions?.['1_month'] || (isRTL ? 'شهر واحد' : '1 Month') },
    { value: '1_3_months', label: r.deadlineOptions?.['1_3_months'] || (isRTL ? '1–3 أشهر' : '1–3 Months') },
    { value: 'flexible', label: r.deadlineOptions?.flexible || (isRTL ? 'مرن' : 'Flexible') }
  ];

  const stepTitles = r.steps || [
    isRTL ? 'المعلومات الشخصية' : 'Personal Info',
    isRTL ? 'تفاصيل المشروع' : 'Project Details',
    isRTL ? 'الميزانية والجدول الزمني' : 'Budget & Timeline',
    isRTL ? 'الملفات والمراجعة' : 'Files & Review'
  ];

  const stepIcons = [User, Monitor, DollarSign, ShieldCheck];

  // Success Screen View
  if (submissionState === 'success') {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 ${
          isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#040711] text-slate-100'
        }`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-lg w-full rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden backdrop-blur-2xl shadow-2xl ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.25)]'
          }`}
        >
          {/* Animated 3D Check Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${
              isLight
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-cyan-950/70 text-cyan-300 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
            }`}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-3">
            {r.success?.title || (isRTL ? 'تم استلام طلبك بنجاح!' : 'Request Received!')}
          </h2>

          <p className={`text-sm sm:text-base font-sans mb-8 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {r.success?.message || (isRTL ? 'سنقوم بمراجعة متطلبات مشروعك والتواصل معك في أقرب وقت.' : 'We will review your request and get back to you soon.')}
          </p>

          {/* Reference Number Glass Card */}
          <div
            className={`p-5 rounded-2xl border mb-8 flex flex-col items-center justify-center ${
              isLight
                ? 'bg-sky-50/80 border-sky-200 text-sky-900'
                : 'bg-slate-900/80 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            }`}
          >
            <span className={`text-xs font-mono uppercase tracking-wider mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {r.success?.reference || (isRTL ? 'رقم المرجع الخاص بك' : 'Your Reference Number')}
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-cyan-400">
              {referenceId}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/track-request"
              className={`flex-1 min-h-[48px] py-3 px-6 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                isLight
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                  : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.5)]'
              }`}
            >
              <span>{r.success?.trackBtn || (isRTL ? 'تتبع طلبك' : 'Track Your Request')}</span>
            </Link>

            <Link
              to="/"
              className={`min-h-[48px] py-3 px-6 rounded-2xl font-display font-bold text-sm border flex items-center justify-center gap-2 transition active:scale-95 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white'
              }`}
            >
              <span>{r.success?.homeBtn || (isRTL ? 'العودة للمعرض' : 'Back to Portfolio')}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-500 pb-20 font-sans ${
        isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#040711] text-slate-100'
      }`}
    >
      {/* Top Bar Navigation */}
      <header className="pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between mb-8">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold px-4 py-2 rounded-full border transition ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800 hover:border-sky-500 shadow-sm'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white'
          }`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{r.backToPortfolio || (isRTL ? 'العودة للمعرض' : 'Back to Portfolio')}</span>
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        {/* Title Header */}
        <div className="text-center mb-10">
          <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-2 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
            01 // CLIENT WORK REQUEST SYSTEM
          </div>
          <h1 className="text-responsive-h2 font-display font-extrabold mb-3">
            <span
              className={`bg-clip-text text-transparent ${
                isLight
                  ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-slate-900'
                  : 'bg-gradient-to-r from-white via-cyan-200 to-sky-400'
              }`}
            >
              {r.pageTitle || (isRTL ? 'اطلب مشروعًا هندسيًا' : 'Request a Project')}
            </span>
          </h1>
          <p className={`text-xs sm:text-sm md:text-base font-sans max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {isRTL
              ? 'أدخل تفاصيل مشروعك ومواصفاته التقنية لنقوم بدراسته وتقديم الحلول الهندسية المناسبة.'
              : 'Provide your project specifications, budget, and files so we can engineer the optimal digital solution.'}
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-10 px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-2 relative">
            {stepTitles.map((title, idx) => {
              const StepIcon = stepIcons[idx] || User;
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-display font-bold text-xs sm:text-sm transition-all duration-300 mb-2 border ${
                      isPast
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : isActive
                        ? isLight
                          ? 'bg-sky-600 border-sky-500 text-white shadow-[0_0_20px_rgba(2,132,199,0.4)]'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-display font-semibold line-clamp-1 ${
                      isActive
                        ? isLight ? 'text-sky-700' : 'text-cyan-300 font-bold'
                        : isPast
                        ? isLight ? 'text-slate-700' : 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border backdrop-blur-2xl transition-all shadow-2xl relative overflow-hidden ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
              : 'bg-slate-950/90 border-cyan-500/35 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.18)]'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 0: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      <span>{stepTitles[0]}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.fullName || (isRTL ? 'الاسم الكامل' : 'Full Name')} *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder={r.fullNamePlaceholder || (isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name')}
                          className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                              : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                          } ${errors.fullName ? 'border-rose-500' : ''}`}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.email || (isRTL ? 'البريد الإلكتروني' : 'Email Address')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={r.emailPlaceholder || 'your@email.com'}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                            : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                        } ${errors.email ? 'border-rose-500' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.phone || (isRTL ? 'الهاتف / واتساب' : 'Phone / WhatsApp')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={r.phonePlaceholder || '+970 xxx xxx xxxx'}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                            : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.country || (isRTL ? 'الدولة' : 'Country')}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder={r.countryPlaceholder || (isRTL ? 'مثال: فلسطين، السعودية، الإمارات...' : 'Your country')}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                            : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Project Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-cyan-400" />
                      <span>{stepTitles[1]}</span>
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold mb-1.5">
                      {r.projectName || (isRTL ? 'اسم المشروع' : 'Project Name')}
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder={r.projectNamePlaceholder || (isRTL ? 'مثال: منصة متجر إلكتروني، نظام إدارة مخزون...' : 'e.g. Online Store, CRM System')}
                      className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold mb-1.5">
                      {r.projectType || (isRTL ? 'نوع المشروع' : 'Project Type')} *
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700 text-white focus:border-cyan-400 focus:bg-slate-900'
                      } ${errors.projectType ? 'border-rose-500' : ''}`}
                    >
                      <option value="">{r.selectType || (isRTL ? '-- اختر نوع المشروع --' : 'Select project type')}</option>
                      {projectTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.projectType}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold mb-1.5">
                      {r.description || (isRTL ? 'وصف المشروع بالتفصيل' : 'Project Description')} *
                    </label>
                    <textarea
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={r.descriptionPlaceholder || (isRTL ? 'اشرح فكرة المشروع، الميزات المطلوبة، والهدف العام...' : 'Describe your project in detail...')}
                      className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition resize-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                      } ${errors.description ? 'border-rose-500' : ''}`}
                    />
                    {errors.description && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.description}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Timeline */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-cyan-400" />
                      <span>{stepTitles[2]}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.budget || (isRTL ? 'الميزانية المتوقعة' : 'Budget Range')}
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 focus:bg-white'
                            : 'bg-slate-900/90 border-slate-700 text-white focus:border-cyan-400 focus:bg-slate-900'
                        }`}
                      >
                        <option value="">{r.selectBudget || (isRTL ? '-- اختر الميزانية --' : 'Select budget range')}</option>
                        {budgetOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold mb-1.5">
                        {r.deadline || (isRTL ? 'الموعد النهائي المتوقع' : 'Expected Deadline')}
                      </label>
                      <select
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 focus:bg-white'
                            : 'bg-slate-900/90 border-slate-700 text-white focus:border-cyan-400 focus:bg-slate-900'
                        }`}
                      >
                        <option value="">{r.selectDeadline || (isRTL ? '-- اختر الموعد النهائي --' : 'Select deadline')}</option>
                        {deadlineOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold mb-1.5">
                      {r.additionalRequirements || (isRTL ? 'متطلبات أو ملاحظات إضافية' : 'Additional Requirements')}
                    </label>
                    <textarea
                      name="additionalRequirements"
                      rows={4}
                      value={formData.additionalRequirements}
                      onChange={handleInputChange}
                      placeholder={r.additionalPlaceholder || (isRTL ? 'أي روابط لمواقع مشابهة، تقنيات تفضلها، إلخ...' : 'Any extra details, preferred technologies, references...')}
                      className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none transition resize-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:bg-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Files & Summary Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      <span>{stepTitles[3]}</span>
                    </h3>
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-mono font-bold mb-2">
                      {r.attachments || (isRTL ? 'المرفقات وملفات المشروع (اختياري)' : 'Project Files (Optional)')}
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition ${
                        isLight
                          ? 'border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-slate-50'
                          : 'border-slate-700 hover:border-cyan-400 bg-slate-900/40 hover:bg-slate-900/80'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 mx-auto text-cyan-400 mb-3" />
                      <p className="text-sm font-semibold mb-1">
                        {r.dragDrop || (isRTL ? 'انقر لاختيار الملفات أو اسحبها هنا' : 'Click to browse or drag & drop files here')}
                      </p>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {r.allowedTypes || 'PDF, DOC, DOCX, ZIP, JPG, PNG, WEBP'} • {r.maxFiles || 'Max 5 files, 10MB each'}
                      </p>
                    </div>

                    {/* Uploaded Files List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl border ${
                              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="text-xs sm:text-sm font-mono truncate">{file.name}</span>
                              <span className="text-[11px] text-slate-500 shrink-0">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-400 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary Card */}
                  <div
                    className={`p-5 rounded-2xl border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <h4 className="text-sm font-display font-bold mb-3 text-cyan-400 flex items-center gap-2">
                      <List className="w-4 h-4" />
                      <span>{r.reviewTitle || (isRTL ? 'ملخص تفاصيل الطلب' : 'Request Summary')}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400 block text-[11px]">{r.fullName || 'Name'}</span>
                        <span className="font-semibold">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{r.email || 'Email'}</span>
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{r.projectType || 'Type'}</span>
                        <span className="font-semibold">{projectTypeOptions.find(o => o.value === formData.projectType)?.label || formData.projectType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">{r.budget || 'Budget'}</span>
                        <span className="font-semibold">{budgetOptions.find(o => o.value === formData.budget)?.label || (isRTL ? 'غير محدد' : 'Not specified')}</span>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                      {errorMessage}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0 || submissionState === 'submitting'}
              className={`min-h-[44px] px-6 py-2.5 rounded-xl font-display font-bold text-xs uppercase border transition flex items-center gap-2 ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400'
              }`}
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{r.previous || (isRTL ? 'السابق' : 'Previous')}</span>
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`min-h-[44px] px-7 py-2.5 rounded-xl font-display font-bold text-xs uppercase transition shadow-xl flex items-center gap-2 transform active:scale-95 ${
                  isLight
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)]'
                    : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                }`}
              >
                <span>{r.next || (isRTL ? 'التالي' : 'Next')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submissionState === 'submitting'}
                className={`min-h-[44px] px-8 py-2.5 rounded-xl font-display font-bold text-xs uppercase transition shadow-xl flex items-center gap-2 disabled:opacity-50 transform active:scale-95 ${
                  isLight
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{submissionState === 'submitting' ? (r.submitting || 'جارٍ الإرسال...') : (r.submit || (isRTL ? 'إرسال الطلب' : 'Submit Request'))}</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestProjectPage;
