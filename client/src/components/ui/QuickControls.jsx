import React from 'react';
import { Sparkles, Compass, ChevronDown } from 'lucide-react';
import { SECTORS } from '../3d/CameraRig';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const QuickControls = ({
  activeSectorIndex = 0,
  scrollProgress = 0,
  enablePostProcessing = true,
  onToggleQuality,
  onHoverSound,
  onClickSound,
  onNavigate
}) => {
  const { t, isRTL } = useLanguage();
  const { theme3D, isBeige } = useTheme();

  const currentSector = SECTORS[activeSectorIndex] || SECTORS[0];
  const sectorNav = t.nav?.[activeSectorIndex] || { label: currentSector.name };

  return (
    <>
      {/* Sector Telemetry HUD */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-40 hidden sm:flex items-center gap-3 backdrop-blur-xl px-4 py-2.5 rounded-2xl border text-xs font-mono shadow-2xl transition-all duration-300 ${
          isBeige
            ? 'bg-[#fcfaf6]/85 border-amber-600/30 text-stone-800 shadow-[0_0_30px_rgba(217,119,6,0.15)]'
            : 'bg-slate-950/70 border-slate-800 text-slate-300 shadow-2xl'
        }`}
      >
        <Compass className={`w-4 h-4 animate-spin-slow ${isBeige ? 'text-amber-700' : 'text-cyan-400'}`} />
        <div>
          <div className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-slate-400'}`}>
            {t.common.sector} {activeSectorIndex + 1} {t.common.of} 10
          </div>
          <div className={`font-bold tracking-wider uppercase ${isBeige ? 'text-amber-800' : 'text-cyan-300'}`}>
            {sectorNav.label}
          </div>
        </div>
        <div className={`w-px h-6 mx-1 ${isBeige ? 'bg-amber-300/60' : 'bg-slate-800'}`} />
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <div className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-slate-400'}`}>{t.common.depth}</div>
          <div className={isBeige ? 'text-stone-900 font-semibold' : 'text-slate-200'}>
            {Math.round(currentSector.z)}M
          </div>
        </div>
      </div>

      {/* Quality Setting & Scroll Helper */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex items-center gap-2`}
      >
        <button
          onClick={() => {
            onClickSound?.();
            onToggleQuality?.();
          }}
          onMouseEnter={() => onHoverSound?.()}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-xl border text-[11px] font-mono transition shadow-lg ${
            isBeige
              ? 'bg-[#fcfaf6]/85 border-amber-600/30 text-stone-700 hover:text-amber-800 hover:border-amber-500'
              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-cyan-300'
          }`}
          title={t.common.fxQuality}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isBeige ? 'text-amber-700' : 'text-cyan-400'}`} />
          <span className="hidden md:inline">FX:</span>
          <span>{enablePostProcessing ? t.common.fxCinematic : t.common.fxFast}</span>
        </button>

        {activeSectorIndex < 9 && (
          <button
            onClick={() => {
              onClickSound?.();
              onNavigate?.(activeSectorIndex + 1);
            }}
            onMouseEnter={() => onHoverSound?.()}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl backdrop-blur-xl border text-[11px] font-mono transition shadow-lg ${
              isBeige
                ? 'bg-[#fcfaf6]/85 border-amber-600/30 text-stone-700 hover:text-amber-900'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={t.common.next}
          >
            <span>{t.common.next}</span>
            <ChevronDown className={`w-3.5 h-3.5 animate-bounce ${isBeige ? 'text-amber-700' : 'text-cyan-400'}`} />
          </button>
        )}
      </div>
    </>
  );
};
