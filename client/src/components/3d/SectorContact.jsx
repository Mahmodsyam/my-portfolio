import React, { useState } from 'react';
import { Float, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Text3DTitle } from './Text3DTitle';
import { socialLinks } from '../../data/portfolioData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SectorContact = ({ mouseRef, onHoverSound, onClickSound }) => {
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const c = t.contact || {};

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClickSound?.();
    setStatus({ state: 'sending', message: c.transmitting || 'Transmitting packet...' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          state: 'success',
          message: data.message || c.successMsg || 'Message received successfully!'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          state: 'error',
          message: data.error || c.errorMsg || 'Transmission failed.'
        });
      }
    } catch (err) {
      setStatus({
        state: 'error',
        message: c.networkError || 'Network error communicating with server.'
      });
    }
  };

  return (
    <group position={[0, 0, -440]}>
      {/* Sector Header */}
      <Text3DTitle
        text={c.title}
        subtitle={c.subtitle}
        position={[0, 4.2, 0]}
        size={isRTL ? 0.6 : 0.52}
        subtitleSize={isRTL ? 0.2 : 0.18}
        glowColor={theme3D.pointLight1}
        align="center"
        mouseRef={mouseRef}
      />

      {/* Cyber / Luxury Communication Terminal Anchor */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
        <group position={[0, 0, 0]}>
          {/* Glass 3D Terminal Backplate */}
          <RoundedBox args={[7.4, 5.4, 0.15]} radius={0.2} smoothness={4}>
            <meshPhysicalMaterial
              color={isBeige ? '#ffffff' : '#050d1e'}
              metalness={isBeige ? 0.3 : 0.9}
              roughness={0.15}
              transmission={isBeige ? 0.25 : 0.4}
              transparent
              opacity={isBeige ? 0.96 : 0.96}
              clearcoat={1}
            />
          </RoundedBox>

          {/* Glowing Terminal Border */}
          <lineSegments position={[0, 0, 0.08]}>
            <edgesGeometry args={[new THREE.BoxGeometry(7.4, 5.4, 0.02)]} />
            <lineBasicMaterial color={isBeige ? '#d97706' : '#38bdf8'} transparent opacity={isBeige ? 0.7 : 0.6} />
          </lineSegments>

          {/* Embedded 3D Interactive HTML Form directly in Three.js Space */}
          <Html
            transform
            distanceFactor={4.8}
            position={[0, 0, 0.12]}
            style={{ width: '640px', userSelect: 'none' }}
          >
            <div
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${
                isBeige
                  ? 'bg-[#fcfaf6]/90 border-amber-600/30 text-stone-900 shadow-[0_0_50px_rgba(217,119,6,0.15)] font-arabic'
                  : 'bg-slate-950/85 border-cyan-500/30 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)]'
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-mono mb-1 ${isBeige ? 'text-amber-700 font-bold' : 'text-cyan-400'}`}>
                      {c.nameLabel}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={c.namePlaceholder}
                      className={`w-full rounded-lg px-3 py-2 text-sm border focus:outline-none transition ${
                        isBeige
                          ? 'bg-amber-50/70 border-amber-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-mono mb-1 ${isBeige ? 'text-amber-700 font-bold' : 'text-cyan-400'}`}>
                      {c.emailLabel}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={c.emailPlaceholder}
                      className={`w-full rounded-lg px-3 py-2 text-sm border focus:outline-none transition ${
                        isBeige
                          ? 'bg-amber-50/70 border-amber-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:bg-white'
                          : 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-mono mb-1 ${isBeige ? 'text-amber-700 font-bold' : 'text-cyan-400'}`}>
                    {c.subjectLabel}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={c.subjectPlaceholder}
                    className={`w-full rounded-lg px-3 py-2 text-sm border focus:outline-none transition ${
                      isBeige
                        ? 'bg-amber-50/70 border-amber-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:bg-white'
                        : 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono mb-1 ${isBeige ? 'text-amber-700 font-bold' : 'text-cyan-400'}`}>
                    {c.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={c.messagePlaceholder}
                    className={`w-full rounded-lg px-3 py-2 text-sm border focus:outline-none transition resize-none ${
                      isBeige
                        ? 'bg-amber-50/70 border-amber-200 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:bg-white'
                        : 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                    }`}
                  ></textarea>
                </div>

                {status.message && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-mono ${
                      status.state === 'success'
                        ? isBeige ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                        : status.state === 'error'
                        ? isBeige ? 'bg-rose-100 text-rose-900 border border-rose-400' : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                        : isBeige ? 'bg-amber-100 text-amber-900 border border-amber-400 animate-pulse' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.state === 'sending'}
                  onMouseEnter={() => onHoverSound?.()}
                  className={`w-full py-3 font-semibold rounded-lg text-sm tracking-wider uppercase transition shadow-lg disabled:opacity-50 ${
                    isBeige
                      ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 hover:from-amber-500 hover:to-stone-700 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {status.state === 'sending' ? (c.transmitting || 'SENDING...') : c.submitBtn}
                </button>
              </form>

              {/* Social Channels Strip */}
              <div className={`mt-5 pt-4 border-t flex items-center justify-center gap-6 ${isBeige ? 'border-amber-200/80' : 'border-slate-800'}`}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => onHoverSound?.()}
                    className={`text-xs font-mono transition ${
                      isBeige ? 'text-stone-500 hover:text-amber-700' : 'text-slate-400 hover:text-cyan-300'
                    }`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </Html>
        </group>
      </Float>

      {/* Terminal Lighting */}
      <pointLight position={[0, 2, 3]} intensity={isBeige ? 6 : 8} distance={10} color={theme3D.pointLight1} />
    </group>
  );
};
