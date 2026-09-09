import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const SoundController = ({
  isEnabled,
  onToggle,
  onHoverSound,
  onClickSound
}) => {
  const { t, isRTL } = useLanguage();
  const { isBeige } = useTheme();

  return (
    <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-40 flex items-center gap-2`}>
      <button
        onClick={() => {
          onClickSound?.();
          onToggle();
        }}
        onMouseEnter={() => onHoverSound?.()}
        className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
          isEnabled
            ? isBeige
              ? 'bg-amber-100/90 border-amber-500 text-amber-900 shadow-[0_0_20px_rgba(217,119,6,0.25)]'
              : 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            : isBeige
            ? 'bg-[#fcfaf6]/80 border-amber-300/80 text-stone-600 hover:text-stone-900'
            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
        }`}
        title={isEnabled ? t.common.audioOn : t.common.audioOff}
      >
        {isEnabled ? (
          <>
            <Volume2 className={`w-4 h-4 animate-pulse ${isBeige ? 'text-amber-700' : 'text-cyan-400'}`} />
            <div className="flex items-center gap-0.5 h-3">
              <span className={`w-0.5 h-3 animate-[pulse_0.8s_ease-in-out_infinite] ${isBeige ? 'bg-amber-600' : 'bg-cyan-400'}`} />
              <span className={`w-0.5 h-2 animate-[pulse_0.6s_ease-in-out_infinite_0.2s] ${isBeige ? 'bg-amber-600' : 'bg-cyan-400'}`} />
              <span className={`w-0.5 h-3.5 animate-[pulse_0.9s_ease-in-out_infinite_0.4s] ${isBeige ? 'bg-amber-600' : 'bg-cyan-400'}`} />
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="text-[11px] font-mono tracking-wider hidden sm:inline">{t.common.audioOff}</span>
          </>
        )}
      </button>
    </div>
  );
};
