'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '@/lib/translate';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  floating?: boolean;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export function LanguageSelector({ currentLanguage, onLanguageChange, floating = true }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div 
      ref={containerRef} 
      className={floating ? "fixed bottom-5 right-5 z-50" : "relative"}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur border border-zinc-200 hover:border-zinc-300 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95"
      >
        <span className="text-base" role="img" aria-label={activeLang.name}>
          {activeLang.flag}
        </span>
        <span className="text-xs font-semibold text-zinc-700 tracking-wide uppercase">
          {activeLang.code}
        </span>
        <Globe size={14} className="text-zinc-400" />
      </button>

      {isOpen && (
        <div className={`absolute ${floating ? 'bottom-12 right-0' : 'top-10 right-0'} mt-2 w-40 bg-white/95 backdrop-blur-md border border-zinc-100 rounded-xl shadow-xl overflow-hidden py-1 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-150`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base" role="img" aria-label={lang.name}>
                  {lang.flag}
                </span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check size={14} className="text-emerald-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
