"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Language, uiTranslations } from "@/lib/translate";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function Home() {
  const [lang, setLang] = useState<Language>("es");
  const t = uiTranslations[lang];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="border-b border-zinc-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center text-center -space-y-1">
          <Image src="/logo.svg" alt="Meniva" width={85} height={85} />
        </div>
        <LanguageSelector currentLanguage={lang} onLanguageChange={setLang} floating={false} />
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {t.slogan}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-tight">
          {t.title1}<br />
          <span className="text-emerald-600">{t.title2}</span>
        </h1>
        
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className={buttonVariants({ variant: "default", className: "bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-600/20" })}>
            {t.registerBtn}
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", className: "h-14 px-10 text-lg font-semibold rounded-2xl border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm" })}>
            {t.loginBtn}
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-100 pt-12 w-full">
          <div>
            <p className="font-bold text-zinc-900 mb-1">{t.feature1Title}</p>
            <p className="text-sm text-zinc-500">{t.feature1Desc}</p>
          </div>
          <div>
            <p className="font-bold text-zinc-900 mb-1">{t.feature2Title}</p>
            <p className="text-sm text-zinc-500">{t.feature2Desc}</p>
          </div>
          <div>
            <p className="font-bold text-zinc-900 mb-1">{t.feature3Title}</p>
            <p className="text-sm text-zinc-500">{t.feature3Desc}</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-50 text-center">
        <p className="text-zinc-400 text-xs">© {new Date().getFullYear()} Meniva. {t.footerText}</p>
      </footer>
    </div>
  );
}

