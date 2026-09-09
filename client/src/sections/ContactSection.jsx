import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Phone, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useInView } from '../hooks/useInView';

// ─── Floating label input ─────────────────────────────────────────────────────
const FloatingField = ({ label, name, type = 'text', value, onChange, onFocus, isLight, required }) => (
  <div className="relative group">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      required={required}
      placeholder=" "
      className={`peer w-full px-4 pt-6 pb-2.5 rounded-2xl border text-sm font-sans outline-none transition-all duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]'
          : 'bg-slate-900/70 border-slate-700/80 text-white focus:border-cyan-500 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)]'
      }`}
    />
    <label
      htmlFor={name}
      className={`absolute start-4 top-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider
        ${isLight
          ? 'text-sky-600 peer-placeholder-shown:text-slate-400'
          : 'text-cyan-400 peer-placeholder-shown:text-slate-500'
        }`}
    >
      {label}
    </label>
  </div>
);

// ─── Floating label textarea ──────────────────────────────────────────────────
const FloatingTextarea = ({ label, name, value, onChange, onFocus, isLight, rows = 4, required }) => (
  <div className="relative group">
    <textarea
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      required={required}
      rows={rows}
      placeholder=" "
      className={`peer w-full px-4 pt-6 pb-2.5 rounded-2xl border text-sm font-sans outline-none transition-all duration-200 resize-none ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)]'
          : 'bg-slate-900/70 border-slate-700/80 text-white focus:border-cyan-500 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)]'
      }`}
    />
    <label
      htmlFor={name}
      className={`absolute start-4 top-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
        peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider
        ${isLight
          ? 'text-sky-600 peer-placeholder-shown:text-slate-400'
          : 'text-cyan-400 peer-placeholder-shown:text-slate-500'
        }`}
    >
      {label}
    </label>
  </div>
);

export const ContactSection = ({ onHoverSound, onClickSound }) => {
  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();
  const c = t.contact || {};
  const [headerRef, headerVisible] = useInView();
  const [bodyRef, bodyVisible] = useInView();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClickSound?.();
    setStatus({ state: 'sending', message: c.submitting || 'Transmitting...' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ state: 'success', message: data.message || c.successMsg || 'Message sent!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ state: 'error', message: data.error || c.errorMsg || 'Failed to send.' });
      }
    } catch {
      setStatus({ state: 'error', message: c.networkError || 'Network error.' });
    }
  };

  const contactInfoItems = [
    {
      icon: Mail,
      label: isRTL ? 'البريد الإلكتروني' : 'Email',
      value: c.email || 'mahmoud@example.com',
      href: `mailto:${c.email || 'mahmoud@example.com'}`,
    },
    {
      icon: Phone,
      label: isRTL ? 'الهاتف / واتساب' : 'Phone / WhatsApp',
      value: c.phone || '+970 59 000 0000',
      href: `tel:${c.phone || '+97059000000'}`,
    },
    {
      icon: MapPin,
      label: isRTL ? 'الموقع الجغرافي' : 'Location',
      value: c.location || (isRTL ? 'فلسطين' : 'Palestine'),
      href: null,
    },
    {
      icon: Clock,
      label: isRTL ? 'وقت الرد' : 'Response Time',
      value: isRTL ? 'خلال 24 ساعة' : 'Within 24 hours',
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Ambient blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className={`absolute bottom-0 ${isRTL ? '-left-40' : '-right-40'} w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${isLight ? 'bg-sky-400' : 'bg-cyan-600'}`} />
        <div className={`absolute top-20 ${isRTL ? '-right-40' : '-left-40'} w-[400px] h-[400px] rounded-full blur-3xl opacity-10 ${isLight ? 'bg-indigo-400' : 'bg-indigo-700'}`} />
      </div>

      <div className="max-w-7xl w-full mx-auto z-10">

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className={`mb-14 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
        >
          <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-3 flex items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-2 ${isLight ? 'text-sky-700' : 'text-cyan-400'} ${headerVisible ? 'animate-slideUp' : 'opacity-0'}`}>
            <span className={`w-6 h-px ${isLight ? 'bg-sky-400' : 'bg-cyan-500'}`} />
            {c.sectionTag || '08 // التواصل'}
          </div>
          <h2 className={`text-responsive-h2 font-display font-extrabold mb-3 bg-clip-text text-transparent animate-gradient-text ${isLight ? 'bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900' : 'bg-gradient-to-r from-white via-cyan-100 to-sky-400'} ${headerVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}>
            {c.title || "لنبني شيئًا استثنائياً"}
          </h2>
          <p className={`text-sm sm:text-base font-sans font-medium max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-400'} ${headerVisible ? 'animate-slideUp-d2' : 'opacity-0'}`}>
            {c.subtitle || 'تواصل معي لأي مشروع أو استفسار'}
          </p>
        </div>

        {/* ── Split body ── */}
        <div ref={bodyRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left: Contact Info Panel */}
          <div className={`lg:col-span-4 space-y-4 ${bodyVisible ? 'animate-slideUp-d1' : 'opacity-0'}`}>

            {/* Intro card */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden ${
              isLight
                ? 'bg-gradient-to-br from-sky-600 via-sky-600 to-indigo-700 border-sky-500 text-white'
                : 'bg-gradient-to-br from-cyan-950/80 via-slate-950 to-indigo-950/80 border-cyan-500/20 text-white'
            }`}>
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              <Sparkles className="w-7 h-7 mb-3 opacity-80" />
              <h3 className="text-lg font-display font-bold mb-2">
                {isRTL ? 'هل لديك مشروع؟' : 'Have a project in mind?'}
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {isRTL
                  ? 'أنا متاح للمشاريع الجديدة، التعاون المهني، والتعيينات الدوام الكامل.'
                  : "I'm open to new projects, collaborations, and full-time positions."}
              </p>
            </div>

            {/* Contact items */}
            {contactInfoItems.map(({ icon: Icon, label, value, href }, i) => (
              <div
                key={i}
                className={`bento-card flex items-center gap-4 p-4 rounded-2xl border ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
                onMouseEnter={() => onHoverSound?.()}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-sky-50 text-sky-600' : 'bg-cyan-950/60 text-cyan-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    {label}
                  </div>
                  {href ? (
                    <a href={href} className={`text-sm font-semibold hover:underline truncate block ${isLight ? 'text-slate-800 hover:text-sky-600' : 'text-slate-200 hover:text-cyan-400'}`}>
                      {value}
                    </a>
                  ) : (
                    <div className={`text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{value}</div>
                  )}
                </div>
                {href && <ExternalLink className={`w-3.5 h-3.5 ms-auto shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />}
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <div
            className={`lg:col-span-8 bento-card p-7 sm:p-8 rounded-3xl border relative overflow-hidden ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
                : 'bg-slate-950/80 border-white/[0.07] shadow-[0_8px_40px_rgba(6,182,212,0.06)]'
            } ${bodyVisible ? 'animate-slideUp-d2' : 'opacity-0'}`}
          >
            {/* Subtle corner glow */}
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-72 h-72 rounded-full blur-3xl opacity-8 pointer-events-none ${isLight ? 'bg-sky-300' : 'bg-cyan-700'}`} />

            <h3 className={`text-xl font-display font-bold mb-7 relative ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {c.formTitle || (isRTL ? 'أرسل رسالة' : 'Send a Message')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingField
                  label={c.name || (isRTL ? 'الاسم' : 'Your Name')}
                  name="name" value={formData.name} onChange={handleChange}
                  onFocus={() => onHoverSound?.()}
                  isLight={isLight} required
                />
                <FloatingField
                  label={c.email || (isRTL ? 'البريد الإلكتروني' : 'Email Address')}
                  name="email" type="email" value={formData.email} onChange={handleChange}
                  onFocus={() => onHoverSound?.()}
                  isLight={isLight} required
                />
              </div>

              <FloatingField
                label={c.subject || (isRTL ? 'الموضوع' : 'Subject')}
                name="subject" value={formData.subject} onChange={handleChange}
                onFocus={() => onHoverSound?.()}
                isLight={isLight} required
              />

              <FloatingTextarea
                label={c.message || (isRTL ? 'الرسالة' : 'Your Message')}
                name="message" value={formData.message} onChange={handleChange}
                onFocus={() => onHoverSound?.()}
                isLight={isLight} rows={5} required
              />

              {/* Status message */}
              {status.state !== 'idle' && (
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-sans border ${
                  status.state === 'success'
                    ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                    : status.state === 'error'
                    ? isLight ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-950/50 border-red-500/30 text-red-400'
                    : isLight ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400'
                }`}>
                  {status.state === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {status.state === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
                  {status.state === 'sending' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status.state === 'sending'}
                onClick={() => onClickSound?.()}
                onMouseEnter={() => onHoverSound?.()}
                className={`group relative w-full sm:w-auto min-h-[50px] px-10 py-3 rounded-2xl font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed ${
                  isLight
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-[0_4px_20px_rgba(2,132,199,0.4)] hover:shadow-[0_6px_30px_rgba(2,132,199,0.6)] hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_4px_20px_rgba(6,182,212,0.45)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.65)] hover:-translate-y-0.5'
                }`}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {status.state === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{c.submitting || (isRTL ? 'جارٍ الإرسال...' : 'Sending...')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 relative" />
                    <span className="relative">{c.send || (isRTL ? 'إرسال الرسالة' : 'Send Message')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
