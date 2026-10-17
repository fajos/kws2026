"use client";

import { useState } from "react";
import { Sparkles, Crown, ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface StrategyOption {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  blueprintTitle: string;
  actionItems: string[];
  keySessions: string[];
}

const STRATEGIES: StrategyOption[] = [
  {
    id: "debt-free",
    title: "Financial Freedom & Debt Elimination",
    subtitle: "For individuals looking to clean debt, build savings & create stability",
    iconName: "Zap",
    blueprintTitle: "Your Debt-Free & Wealth Foundation Roadmap",
    actionItems: [
      "Financial Reality Check audit with Dr. Temilola Adeyemi",
      "Debt restructuring & cash flow optimization blueprint",
      "Emergency reserve building & disciplined savings systems",
    ],
    keySessions: ["Financial Reality Check", "Financial Literacy & Wealth Teaching"],
  },
  {
    id: "multi-stream",
    title: "Multistream Business & Enterprise Building",
    subtitle: "For entrepreneurs & professionals launching or scaling businesses",
    iconName: "TrendingUp",
    blueprintTitle: "Your High-Yield Kingdom Enterprise Roadmap",
    actionItems: [
      "Strategic business model positioning & market penetration",
      "Interactive Money Game simulation for negotiation & risk",
      "Breakout sessions on capital allocation with Seyi Abiodun",
    ],
    keySessions: ["Interactive Money Game", "Ask the Experts Panel"],
  },
  {
    id: "investment-portfolio",
    title: "Capital Markets & Stock Investment",
    subtitle: "For investors wanting ₦4B+ asset management wisdom & portfolio scaling",
    iconName: "Crown",
    blueprintTitle: "Your Wealth Portfolio & Global Asset Roadmap",
    actionItems: [
      "Stockbroker masterclass on stocks, real estate & capital growth",
      "Sustainable investment principles & risk mitigation",
      "Prophetic session & journaling for divine investment direction",
    ],
    keySessions: ["Prophetic Session & Journaling", "Global Wealth Allocation"],
  },
];

export default function DominionInteractiveQuiz() {
  const [selectedId, setSelectedId] = useState<string>("debt-free");
  const selectedStrategy = STRATEGIES.find((s) => s.id === selectedId) || STRATEGIES[0];

  return (
    <div className="card-3d p-6 sm:p-10 rounded-3xl border border-amber-400/50 relative overflow-hidden space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-400/40">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>INTERACTIVE DOMINION BLUEPRINT</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Find Your KWS 2026 Dominion Assignment
        </h3>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          Select your primary financial target below to unlock your custom summit session map:
        </p>
      </div>

      {/* Selector Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STRATEGIES.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 relative ${
                isSelected
                  ? "bg-amber-400/20 border-amber-400 shadow-xl shadow-amber-400/10 text-white scale-[1.02]"
                  : "bg-emerald-950/80 border-emerald-800 text-emerald-200 hover:border-emerald-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    isSelected
                      ? "bg-amber-400 text-emerald-950 border-amber-300"
                      : "bg-emerald-900 text-emerald-300 border-emerald-700"
                  }`}
                >
                  {isSelected ? "Active Blueprint" : "Select Focus"}
                </span>
                {isSelected && <Sparkles className="w-4 h-4 text-amber-400" />}
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Activated Blueprint Display */}
      <div className="bg-emerald-950/90 border border-amber-400/40 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
          <div>
            <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest block mb-1">
              CUSTOM SUMMIT MAP
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              {selectedStrategy.blueprintTitle}
            </h4>
          </div>
          <Link
            href="/register"
            className="btn-gold-3d px-6 py-2.5 rounded-xl text-xs uppercase font-extrabold inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>Claim Your Seat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-emerald-100">
          <div className="space-y-3">
            <p className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Key Dominion Action Steps
            </p>
            <ul className="space-y-2">
              {selectedStrategy.actionItems.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4" /> Targeted KWS 2026 Sessions
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedStrategy.keySessions.map((session, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-amber-400/30 text-amber-200 font-bold text-xs"
                >
                  {session}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
