"use client";

import { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";

export default function DominionCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-11-28T09:00:00+01:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-3d p-6 sm:p-8 rounded-3xl border border-amber-400/50 relative overflow-hidden my-8">
      {/* Background Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-400/40">
          <Clock className="w-3.5 h-3.5" />
          <span>COUNTDOWN TO DOMINION</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">
          28TH NOVEMBER 2026 • IKEJA, LAGOS &amp; GLOBAL STREAM
        </h3>

        {/* Countdown Digits Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto pt-2">
          <div className="bg-emerald-950/90 border-2 border-amber-400/60 p-2.5 sm:p-4 rounded-2xl shadow-xl shadow-black/60 text-center">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block font-mono">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-200 uppercase tracking-widest">
              Days
            </span>
          </div>

          <div className="bg-emerald-950/90 border-2 border-amber-400/60 p-2.5 sm:p-4 rounded-2xl shadow-xl shadow-black/60 text-center">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block font-mono">
              {timeLeft.hours}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-200 uppercase tracking-widest">
              Hours
            </span>
          </div>

          <div className="bg-emerald-950/90 border-2 border-amber-400/60 p-2.5 sm:p-4 rounded-2xl shadow-xl shadow-black/60 text-center">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block font-mono">
              {timeLeft.minutes}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-200 uppercase tracking-widest">
              Mins
            </span>
          </div>

          <div className="bg-emerald-950/90 border-2 border-amber-400/60 p-2.5 sm:p-4 rounded-2xl shadow-xl shadow-black/60 text-center">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block font-mono">
              {timeLeft.seconds}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold text-emerald-200 uppercase tracking-widest">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
