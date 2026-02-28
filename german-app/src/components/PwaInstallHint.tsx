"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "pwa-install-hint-seen";

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
  return mobileKeywords.test(ua) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function PwaInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobile() || isStandalone()) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    } catch {
      return;
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  const ios = isIOS();

  return (
    <div
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-hint-title"
      aria-describedby="pwa-hint-desc"
    >
      <div
        className="absolute inset-0 bg-stone-900/60 dark:bg-stone-950/70"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-700 p-5 animate-in slide-in-from-bottom-4 fade-in duration-300 sm:slide-in-from-bottom-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 id="pwa-hint-title" className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Add to Home Screen
          </h2>
        </div>
        <p id="pwa-hint-desc" className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          {ios ? (
            <>
              Tap the <strong>Share</strong> button
              <span className="inline-block mx-1 align-middle w-4 h-4 rounded bg-stone-300 dark:bg-stone-600" aria-hidden /> at the bottom of the browser, then choose{" "}
              <strong>Add to Home Screen</strong> to open the app like a native app and use it offline.
            </>
          ) : (
            <>
              Tap the <strong>menu</strong> (⋮) in your browser and choose{" "}
              <strong>Add to Home screen</strong> or <strong>Install app</strong> to open German Learning like an app and use it offline.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium py-3 px-4 transition-colors touch-manipulation min-h-[44px]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
