"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Sun,
  Briefcase,
  Coins,
  Users,
  HandHeart,
  Palmtree,
  Calendar,
  ChevronDown,
  CheckCircle2,
  PieChart,
  LayoutGrid,
  Layers,
  Compass,
  Clock,
  Bell,
  LogOut,
  User,
  Save,
  Check,
  Plus,
  Trash2,
  Send,
  Loader2,
  X,
  HelpCircle,
  ArrowRight,
  SunMoon,
  BookOpen,
} from "lucide-react";

// -------------------------------------------------------------
// Types & Constants
// -------------------------------------------------------------
export type LifeArea =
  | "Personal growth"
  | "Health and wellbeing"
  | "Spiritual life"
  | "Career or business"
  | "Financial"
  | "Family and relationships"
  | "Community and impact"
  | "Rest and joy";

export const LIFE_AREAS: { key: LifeArea; label: string; icon: any; defaultPlaceholder: string }[] = [
  {
    key: "Personal growth",
    label: "Personal growth",
    icon: Sparkles,
    defaultPlaceholder: "e.g. Read 12 books, learn conversational Spanish, practice daily mindfulness",
  },
  {
    key: "Health and wellbeing",
    label: "Health and wellbeing",
    icon: Heart,
    defaultPlaceholder: "e.g. Run 3x per week, prioritize 7.5 hours of sleep, cook balanced meals",
  },
  {
    key: "Spiritual life",
    label: "Spiritual life",
    icon: Sun,
    defaultPlaceholder: "e.g. Morning prayer or meditation, gratitude journal, weekend retreat",
  },
  {
    key: "Career or business",
    label: "Career or business",
    icon: Briefcase,
    defaultPlaceholder: "e.g. Launch new portfolio project, step into leadership, attend 2 conferences",
  },
  {
    key: "Financial",
    label: "Financial",
    icon: Coins,
    defaultPlaceholder: "e.g. Build 6-month emergency reserve, invest $500/mo, eliminate credit card balance",
  },
  {
    key: "Family and relationships",
    label: "Family and relationships",
    icon: Users,
    defaultPlaceholder: "e.g. Weekly family dinner, quarterly couple getaway, call parents every Sunday",
  },
  {
    key: "Community and impact",
    label: "Community and impact",
    icon: HandHeart,
    defaultPlaceholder: "e.g. Mentor a young professional, volunteer monthly at community garden",
  },
  {
    key: "Rest and joy",
    label: "Rest and joy",
    icon: Palmtree,
    defaultPlaceholder: "e.g. Unplugged Sundays, annual summer cottage trip, pottery workshop",
  },
];

export interface CheckItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeekPlan {
  weekIndex: number;
  weekOf: string;
  topPriorities: CheckItem[];
  days: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  carryForward: string;
}

export interface MonthReview {
  whatIAchieved: string;
  whatWasLeftUndone: string;
  whatGotInTheWay: string;
  carryForwardItems: CheckItem[];
  reflection: {
    oneWin: string;
    oneLesson: string;
    gratefulFor: string;
  };
}

export interface MonthPlan {
  monthIndex: number;
  monthName: string;
  keyGoals: CheckItem[];
  todos: CheckItem[];
  notes: string;
  review: MonthReview;
  weeks: Record<number, WeekPlan>;
}

export interface QuarterPlan {
  quarter: 1 | 2 | 3 | 4;
  theme: string;
  month1: CheckItem[];
  month2: CheckItem[];
  month3: CheckItem[];
}

export interface GoalEntry {
  area: LifeArea;
  text: string;
  priority: 1 | 2 | 3;
  isTopThree: boolean;
  whyItMatters: string;
  milestones: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  supportNeeded: string;
  quarterPlans: Record<1 | 2 | 3 | 4, QuarterPlan>;
  monthPlans: Record<number, MonthPlan>;
}

export interface JournalState {
  year: number;
  goals: Record<LifeArea, GoalEntry>;
  yearsData?: Record<number, Record<LifeArea, GoalEntry>>;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function createDefaultGoalEntry(area: LifeArea): GoalEntry {
  const quarterPlans: Record<1 | 2 | 3 | 4, QuarterPlan> = {
    1: { quarter: 1, theme: "", month1: [], month2: [], month3: [] },
    2: { quarter: 2, theme: "", month1: [], month2: [], month3: [] },
    3: { quarter: 3, theme: "", month1: [], month2: [], month3: [] },
    4: { quarter: 4, theme: "", month1: [], month2: [], month3: [] },
  };

  const monthPlans: Record<number, MonthPlan> = {};
  for (let m = 1; m <= 12; m++) {
    monthPlans[m] = {
      monthIndex: m,
      monthName: MONTH_NAMES[m - 1],
      keyGoals: [],
      todos: [],
      notes: "",
      review: {
        whatIAchieved: "",
        whatWasLeftUndone: "",
        whatGotInTheWay: "",
        carryForwardItems: [],
        reflection: { oneWin: "", oneLesson: "", gratefulFor: "" },
      },
      weeks: {
        1: {
          weekIndex: 1,
          weekOf: "Week 1",
          topPriorities: [],
          days: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
          carryForward: "",
        },
      },
    };
  }

  return {
    area,
    text: "",
    priority: 2,
    isTopThree: false,
    whyItMatters: "",
    milestones: { q1: "", q2: "", q3: "", q4: "" },
    supportNeeded: "",
    quarterPlans,
    monthPlans,
  };
}

function createDefaultJournalState(year: number): JournalState {
  const goals: Record<LifeArea, GoalEntry> = {} as any;
  LIFE_AREAS.forEach((item) => {
    goals[item.key] = createDefaultGoalEntry(item.key);
  });
  return {
    year,
    goals,
    yearsData: { [year]: goals },
  };
}

// -------------------------------------------------------------
// Main Journal Web App Component
// -------------------------------------------------------------
export default function JournalPage() {
  const [themeMode, setThemeMode] = useState<"linen" | "dark">("linen");
  const [activeTab, setActiveTab] = useState<"year" | "breakdown" | "quarter" | "month" | "week" | "review">("year");
  const [selectedArea, setSelectedArea] = useState<LifeArea>("Health and wellbeing");
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"cards" | "wheel">("cards");

  // State & Multi-Year
  const [journalState, setJournalState] = useState<JournalState>(() => createDefaultJournalState(2026));
  const [availableYears, setAvailableYears] = useState<number[]>([2025, 2026, 2027, 2028]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [customYearInput, setCustomYearInput] = useState("");

  // Auth & Cloud Sync
  const [user, setUser] = useState<{ id: number; email: string; full_name: string } | null>(null);
  const [token, setToken] = useState<string>("");
  const [authChecking, setAuthChecking] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline">("offline");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Email Reminders Modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderFreq, setReminderFreq] = useState<"weekly" | "daily" | "monthly" | "disabled">("weekly");
  const [reminderDay, setReminderDay] = useState("Monday");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderMsg, setReminderMsg] = useState("");

  // AI Decomposition Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTargetArea, setAiTargetArea] = useState<LifeArea>("Health and wellbeing");
  const [aiGoalText, setAiGoalText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [decomposedPreview, setDecomposedPreview] = useState<any | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load: Check token & require authentication
  useEffect(() => {
    const savedToken = localStorage.getItem("kws_journal_token") || "";

    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken).finally(() => setAuthChecking(false));
      fetchCloudJournal(savedToken, 2026);
    } else {
      setAuthChecking(false);
    }
  }, []);

  // 2. Fetch User Profile
  async function fetchUserProfile(jwt: string) {
    try {
      const res = await fetch("/api/journal/auth/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setReminderEmail(data.user.email);
        setSyncStatus("synced");
      } else {
        setUser(null);
        setToken("");
        localStorage.removeItem("kws_journal_token");
      }
    } catch {
      setSyncStatus("offline");
    }
  }

  // 3. Fetch Cloud Journal
  async function fetchCloudJournal(jwt: string, year: number) {
    try {
      setSyncStatus("saving");
      const res = await fetch(`/api/journal/state?year=${year}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state && data.state.goals) {
          setJournalState(data.state);
        }
        if (data.availableYears) {
          setAvailableYears(data.availableYears);
        }
        setSyncStatus("synced");
      }
    } catch {
      setSyncStatus("offline");
    }
  }

  // 4. Auto-save to cloud with debounce
  function triggerSave(newState: JournalState) {
    setJournalState(newState);
    localStorage.setItem("kws_journal_local_state", JSON.stringify(newState));

    if (!token) {
      setSyncStatus("offline");
      return;
    }

    setSyncStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/journal/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            year: newState.year,
            state: newState,
          }),
        });
        if (res.ok) {
          setSyncStatus("synced");
        } else {
          setSyncStatus("offline");
        }
      } catch {
        setSyncStatus("offline");
      }
    }, 1200);
  }

  // Handlers for Auth
  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const endpoint = authMode === "login" ? "/api/journal/auth/login" : "/api/journal/auth/register";
    const payload =
      authMode === "login"
        ? { email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword, full_name: authFullName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed");
        setAuthLoading(false);
        return;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("kws_journal_token", data.token);
      setShowAuthModal(false);
      setSyncStatus("synced");
      // Push existing local state or fetch cloud state
      await fetchCloudJournal(data.token, journalState.year);
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("kws_journal_token");
    setSyncStatus("offline");
    fetch("/api/journal/auth/login", { method: "DELETE" }).catch(() => {});
  }

  // AI Decomposition
  async function handleRunDecomposition() {
    setAiLoading(true);
    setDecomposedPreview(null);

    try {
      const res = await fetch("/api/journal/ai-decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: aiTargetArea,
          goalText: aiGoalText,
          year: journalState.year,
        }),
      });

      const data = await res.json();
      if (res.ok && data.plan) {
        setDecomposedPreview(data.plan);
      } else {
        alert(data.error || "Decomposition failed");
      }
    } catch (err) {
      alert("Error contacting AI decomposition service");
    } finally {
      setAiLoading(false);
    }
  }

  function handleApplyDecomposition() {
    if (!decomposedPreview) return;

    const currentGoal = journalState.goals[aiTargetArea] || createDefaultGoalEntry(aiTargetArea);

    // Populate milestones, why, support
    const updatedGoal: GoalEntry = {
      ...currentGoal,
      text: aiGoalText,
      whyItMatters: decomposedPreview.whyItMatters || currentGoal.whyItMatters,
      supportNeeded: decomposedPreview.supportNeeded || currentGoal.supportNeeded,
      milestones: {
        q1: decomposedPreview.milestones?.q1 || currentGoal.milestones.q1,
        q2: decomposedPreview.milestones?.q2 || currentGoal.milestones.q2,
        q3: decomposedPreview.milestones?.q3 || currentGoal.milestones.q3,
        q4: decomposedPreview.milestones?.q4 || currentGoal.milestones.q4,
      },
      quarterPlans: { ...currentGoal.quarterPlans },
      monthPlans: { ...currentGoal.monthPlans },
    };

    // Apply Quarters
    if (decomposedPreview.quarterPlans) {
      for (const q of [1, 2, 3, 4] as const) {
        const qp = decomposedPreview.quarterPlans[q];
        if (qp) {
          updatedGoal.quarterPlans[q] = {
            quarter: q,
            theme: qp.theme || updatedGoal.quarterPlans[q]?.theme || "",
            month1: (qp.month1 || []).map((t: string, i: number) => ({ id: `m1-${i}`, text: t, completed: false })),
            month2: (qp.month2 || []).map((t: string, i: number) => ({ id: `m2-${i}`, text: t, completed: false })),
            month3: (qp.month3 || []).map((t: string, i: number) => ({ id: `m3-${i}`, text: t, completed: false })),
          };
        }
      }
    }

    // Apply Months
    if (decomposedPreview.monthPlans) {
      for (let m = 1; m <= 12; m++) {
        const mp = decomposedPreview.monthPlans[m];
        if (mp) {
          updatedGoal.monthPlans[m] = {
            ...updatedGoal.monthPlans[m],
            keyGoals: (mp.keyGoals || []).map((t: string, i: number) => ({ id: `kg-${m}-${i}`, text: t, completed: false })),
            todos: (mp.todos || []).map((t: string, i: number) => ({ id: `td-${m}-${i}`, text: t, completed: false })),
            notes: mp.notes || updatedGoal.monthPlans[m]?.notes || "",
          };
        }
      }
    }

    // Apply Sample Week to Week 1
    if (decomposedPreview.sampleWeek && updatedGoal.monthPlans[1]?.weeks[1]) {
      updatedGoal.monthPlans[1].weeks[1] = {
        ...updatedGoal.monthPlans[1].weeks[1],
        topPriorities: (decomposedPreview.sampleWeek.topPriorities || []).map((t: string, i: number) => ({
          id: `wp-${i}`,
          text: t,
          completed: false,
        })),
        days: {
          ...updatedGoal.monthPlans[1].weeks[1].days,
          ...decomposedPreview.sampleWeek.days,
        },
        carryForward: decomposedPreview.sampleWeek.carryForward || "",
      };
    }

    const nextState: JournalState = {
      ...journalState,
      goals: {
        ...journalState.goals,
        [aiTargetArea]: updatedGoal,
      },
    };

    triggerSave(nextState);
    setShowAiModal(false);
    setDecomposedPreview(null);
  }

  // Email Reminders Save & Test Send
  async function handleSaveReminders(sendTest: boolean = false) {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setReminderLoading(true);
    setReminderMsg("");

    try {
      await fetch("/api/journal/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          frequency: reminderFreq,
          day_of_week: reminderDay,
          time_of_day: reminderTime,
          email: reminderEmail,
        }),
      });

      if (sendTest) {
        const testRes = await fetch("/api/journal/reminders/send", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const testData = await testRes.json();
        setReminderMsg(testData.message || "Test reminder dispatched!");
      } else {
        setReminderMsg("Reminder preferences saved!");
      }
    } catch {
      setReminderMsg("Failed to update reminder settings.");
    } finally {
      setReminderLoading(false);
    }
  }

  // Year Switcher
  function handleSelectYear(yr: number) {
    if (yr === journalState.year) {
      setShowYearPicker(false);
      return;
    }
    const yearsData = journalState.yearsData || {};
    const newYearsData = { ...yearsData, [journalState.year]: journalState.goals };

    let targetGoals = newYearsData[yr];
    if (!targetGoals) {
      targetGoals = {} as any;
      LIFE_AREAS.forEach((item) => {
        targetGoals[item.key] = createDefaultGoalEntry(item.key);
      });
      newYearsData[yr] = targetGoals;
    }

    const nextState: JournalState = {
      year: yr,
      goals: targetGoals,
      yearsData: newYearsData,
    };

    triggerSave(nextState);
    if (!availableYears.includes(yr)) {
      setAvailableYears([...availableYears, yr].sort((a, b) => a - b));
    }
    setShowYearPicker(false);
  }

  // Active Theme Styles
  const isDark = themeMode === "dark";
  const bgMain = isDark ? "bg-[#121216] text-[#F4F0E8]" : "bg-[#FBF8F3] text-[#2B1C22]";
  const cardBg = isDark ? "bg-[#1C1C24] border-[#2E2E3A]" : "bg-[#FFFDF9] border-[#E8DFD8]";
  const primaryText = isDark ? "text-[#E5B8C2]" : "text-[#7A283C]";
  const primaryBg = isDark ? "bg-[#E5B8C2] text-[#121216]" : "bg-[#7A283C] text-white";
  const pillLight = isDark ? "bg-[#2B1C22] text-[#E5B8C2] border-[#44232C]" : "bg-[#FAF4EB] text-[#7A283C] border-[#F0E4D8]";

  const currentGoal = journalState.goals[selectedArea] || createDefaultGoalEntry(selectedArea);
  const currentMonthPlan = currentGoal.monthPlans[selectedMonth] || currentGoal.monthPlans[1];
  const currentWeekPlan = currentMonthPlan.weeks[selectedWeek] || currentMonthPlan.weeks[1];
  const currentQuarterPlan = currentGoal.quarterPlans[selectedQuarter] || currentGoal.quarterPlans[1];

  const topThreeCount = Object.values(journalState.goals).filter((g) => g.isTopThree).length;

  // -------------------------------------------------------------
  // Mandatory Auth Gate: Screen rendered when user is not logged in
  // -------------------------------------------------------------
  if (authChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgMain}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-semibold opacity-70">Securing your journal access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${bgMain} flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-emerald-950`}>
        {/* Simple Top Bar */}
        <header className="p-4 sm:p-6 flex items-center justify-between max-w-5xl mx-auto w-full">
          <Link
            href="/"
            className="text-xs font-bold tracking-wider px-3 py-1.5 rounded-lg border border-amber-400/40 text-amber-500 hover:bg-amber-400/10 transition-colors uppercase inline-flex items-center gap-1.5"
          >
            ← KWS 2026 Home
          </Link>
          <button
            onClick={() => setThemeMode(isDark ? "linen" : "dark")}
            className={`p-1.5 rounded-full border transition-all ${pillLight}`}
            title="Toggle Theme"
          >
            <SunMoon className="w-4 h-4" />
          </button>
        </header>

        {/* Main Auth Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${cardBg}`}>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-500 mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 mb-1">
                Kingdom Wealth Summit 2026
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
                Reflective E-Journal
              </h2>
              <p className="text-xs sm:text-sm opacity-70 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Please log in or create an account to access your private annual journal and start planning your year.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className={`flex rounded-xl p-1 mb-5 border ${isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"}`}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === "login" ? primaryBg : "opacity-60"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === "register" ? primaryBg : "opacity-60"
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl text-xs font-semibold bg-red-500/15 border border-red-500/40 text-red-500 mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="e.g. Samuel Adeyemi"
                    className={`w-full p-3 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A] text-white" : "bg-[#FAF8F5] border-[#E8DFD8] text-[#2B1C22]"
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full p-3 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A] text-white" : "bg-[#FAF8F5] border-[#E8DFD8] text-[#2B1C22]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full p-3 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A] text-white" : "bg-[#FAF8F5] border-[#E8DFD8] text-[#2B1C22]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2 transition-all shadow-md ${primaryBg}`}
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{authMode === "login" ? "Sign In & Open Journal" : "Create Account & Enter Journal"}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[11px] opacity-60 leading-normal">
                🔒 All journal reflections, finances, and goals are stored privately in your personal account and synced between web and mobile.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 text-center text-xs opacity-50">
          Kingdom Wealth Summit 2026 • Finish Rich Africa
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} font-sans transition-colors duration-300 pb-20`}>
      {/* ------------------------------------------------------------- */}
      {/* Top Navigation & App Header                                   */}
      {/* ------------------------------------------------------------- */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDark ? "bg-[#121216]/90 border-[#2E2E3A]" : "bg-[#FBF8F3]/90 border-[#E8DFD8]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Summit Home */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold tracking-wider px-2.5 py-1 rounded-md border border-amber-400/40 text-amber-500 hover:bg-amber-400/10 transition-colors uppercase"
            >
              ← KWS 2026 Home
            </Link>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight hidden sm:block">
              Reflective E-Journal
            </h1>
          </div>

          {/* Controls: Year Picker, Reminders, Theme, Cloud Sync & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Year Picker Pill */}
            <button
              onClick={() => setShowYearPicker(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${pillLight} hover:scale-105`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{journalState.year}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Email Reminders Button */}
            <button
              onClick={() => setShowReminderModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${pillLight} hover:opacity-90`}
              title="Configure Email Reminders"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reminders</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setThemeMode(isDark ? "linen" : "dark")}
              className={`p-1.5 rounded-full border transition-all ${pillLight} hover:opacity-90`}
              title="Toggle Light / Dark Theme"
            >
              <SunMoon className="w-4 h-4" />
            </button>

            {/* User Account / Sync Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    syncStatus === "synced"
                      ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                      : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === "synced" ? "bg-emerald-500" : "bg-amber-500 animate-ping"}`} />
                  <span>{syncStatus === "synced" ? "Cloud Synced" : "Saving..."}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="hidden sm:inline font-semibold">{user.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full hover:bg-red-500/15 text-red-500 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${primaryBg} hover:opacity-90`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Sub-Header & Navigation Tabs                                  */}
      {/* ------------------------------------------------------------- */}
      <div className={`border-b ${isDark ? "border-[#2E2E3A] bg-[#17171F]" : "border-[#E8DFD8] bg-[#FAF6F0]"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              {[
                { id: "year", label: "Year Goals", icon: LayoutGrid },
                { id: "breakdown", label: "Goal Breakdown", icon: Layers },
                { id: "quarter", label: "Quarter Plan", icon: Compass },
                { id: "month", label: "Month Plan", icon: Calendar },
                { id: "week", label: "Weekly Planner", icon: Clock },
                { id: "review", label: "Month in Review", icon: CheckCircle2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? `${primaryBg} shadow-sm`
                        : `opacity-70 hover:opacity-100 ${isDark ? "hover:bg-[#252532]" : "hover:bg-[#F2ECE4]"}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Life Area Quick Dropdown for sub-views */}
            {activeTab !== "year" && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-300 dark:border-slate-700">
                <span className="text-xs opacity-60 hidden md:inline">Life Area:</span>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value as LifeArea)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none ${cardBg}`}
                >
                  {LIFE_AREAS.map((a) => (
                    <option key={a.key} value={a.key}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ----------------------------------------------------------- */}
        {/* TAB 1: YEAR GOALS                                            */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "year" && (
          <div className="space-y-6">
            {/* Header Quote Banner */}
            <div className={`p-5 rounded-2xl border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
              <div>
                <h2 className="font-serif font-bold text-2xl tracking-tight">My goals for the year</h2>
                <p className="text-xs sm:text-sm opacity-70 mt-0.5">
                  Circle your top three priorities for {journalState.year}. Each life area cascades into quarterly, monthly, and weekly plans.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${pillLight}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Top 3 Selected: {topThreeCount}/3</span>
                </div>

                {/* View Mode Toggle: Cards vs Life Wheel */}
                <div className={`flex items-center p-1 rounded-xl border ${cardBg}`}>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      viewMode === "cards" ? primaryBg : "opacity-60"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode("wheel")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      viewMode === "wheel" ? primaryBg : "opacity-60"
                    }`}
                  >
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Life Wheel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Render 8 Life Area Cards */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {LIFE_AREAS.map((item) => {
                  const goal = journalState.goals[item.key] || createDefaultGoalEntry(item.key);
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.key}
                      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${cardBg} ${
                        goal.isTopThree ? "ring-2 ring-amber-400/80 shadow-md" : "hover:border-slate-400/50"
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl border ${pillLight}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-serif font-bold text-base sm:text-lg">{item.label}</span>
                          </div>

                          {/* Priority Star / Top 3 Toggle */}
                          <button
                            onClick={() => {
                              const updatedGoal: GoalEntry = {
                                ...goal,
                                isTopThree: !goal.isTopThree,
                              };
                              triggerSave({
                                ...journalState,
                                goals: {
                                  ...journalState.goals,
                                  [item.key]: updatedGoal,
                                },
                              });
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-transform active:scale-95 ${
                              goal.isTopThree
                                ? "bg-amber-400/20 text-amber-500 border-amber-400/50"
                                : "opacity-50 hover:opacity-100"
                            }`}
                          >
                            <span>★</span>
                            <span>{goal.isTopThree ? "Top 3 Priority" : "Make Top 3"}</span>
                          </button>
                        </div>

                        {/* Goal Input Area */}
                        <div className="relative mb-3">
                          <textarea
                            value={goal.text}
                            onChange={(e) => {
                              const text = e.target.value;
                              const updatedGoal: GoalEntry = { ...goal, text };
                              triggerSave({
                                ...journalState,
                                goals: {
                                  ...journalState.goals,
                                  [item.key]: updatedGoal,
                                },
                              });
                            }}
                            rows={3}
                            placeholder={item.defaultPlaceholder}
                            className={`w-full p-3 rounded-xl border text-sm outline-none resize-none font-sans transition-all ${
                              isDark
                                ? "bg-[#15151C] border-[#2E2E3A] text-white focus:border-[#E5B8C2]"
                                : "bg-[#FAF8F5] border-[#E8DFD8] text-[#2B1C22] focus:border-[#7A283C]"
                            }`}
                          />
                        </div>

                        {/* ✨ Intelligent Auto-Decompose Button */}
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={() => {
                              setAiTargetArea(item.key);
                              setAiGoalText(goal.text);
                              setShowAiModal(true);
                              setDecomposedPreview(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-500 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-all"
                            title="Auto-decompose into quarters, months, and weekly planner"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span>✨ Auto-Decompose with AI</span>
                          </button>

                          {/* Priority Selector 1, 2, 3 */}
                          <div className="flex items-center gap-1 text-xs opacity-70">
                            <span>Priority:</span>
                            {[1, 2, 3].map((p) => (
                              <button
                                key={p}
                                onClick={() => {
                                  const updatedGoal: GoalEntry = { ...goal, priority: p as any };
                                  triggerSave({
                                    ...journalState,
                                    goals: { ...journalState.goals, [item.key]: updatedGoal },
                                  });
                                }}
                                className={`w-5 h-5 rounded-full text-[10px] font-bold border ${
                                  goal.priority === p ? primaryBg : "opacity-50"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cascading Navigation Pills */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedArea(item.key);
                            setActiveTab("breakdown");
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors ${pillLight}`}
                        >
                          Breakdown
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArea(item.key);
                            setActiveTab("quarter");
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors ${pillLight}`}
                        >
                          Quarters
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArea(item.key);
                            setActiveTab("month");
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors ${pillLight}`}
                        >
                          Months
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArea(item.key);
                            setActiveTab("week");
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-colors ${pillLight}`}
                        >
                          Weeks
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Life Wheel View */
              <div className={`p-8 rounded-2xl border text-center ${cardBg}`}>
                <h3 className="font-serif font-bold text-xl mb-2">Life Balance Wheel</h3>
                <p className="text-xs sm:text-sm opacity-70 max-w-lg mx-auto mb-6">
                  Review the balance across your 8 life areas. Tap any life area to focus and edit its breakdown.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {LIFE_AREAS.map((item) => {
                    const g = journalState.goals[item.key];
                    const hasGoal = Boolean(g && g.text.trim());
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setSelectedArea(item.key);
                          setActiveTab("breakdown");
                        }}
                        className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${
                          hasGoal ? "border-emerald-500/50 bg-emerald-500/10" : cardBg
                        }`}
                      >
                        <div className="font-bold text-sm mb-1">{item.label}</div>
                        <div className="text-[11px] opacity-70">
                          {hasGoal ? "✓ Goal Defined" : "Pending Goal"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 2: GOAL BREAKDOWN                                       */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "breakdown" && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Goal Breakdown</span>
                  <h2 className="font-serif font-bold text-2xl">{selectedArea}</h2>
                </div>
                <button
                  onClick={() => {
                    setAiTargetArea(selectedArea);
                    setAiGoalText(currentGoal.text);
                    setShowAiModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-500 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>✨ Auto-Decompose with AI</span>
                </button>
              </div>

              {/* Goal Statement */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Yearly Goal Statement
                </label>
                <input
                  type="text"
                  value={currentGoal.text}
                  onChange={(e) => {
                    const updated: GoalEntry = { ...currentGoal, text: e.target.value };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="What is your primary goal in this area for the year?"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Why It Matters */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Why It Matters (Core Motivation)
                </label>
                <textarea
                  rows={3}
                  value={currentGoal.whyItMatters}
                  onChange={(e) => {
                    const updated: GoalEntry = { ...currentGoal, whyItMatters: e.target.value };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Why is achieving this essential to your life and purpose this year?"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Support & Resources Needed */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Support &amp; Resources Needed
                </label>
                <input
                  type="text"
                  value={currentGoal.supportNeeded}
                  onChange={(e) => {
                    const updated: GoalEntry = { ...currentGoal, supportNeeded: e.target.value };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Mentors, books, apps, habits, accountability partner..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* 4 Quarterly Milestones */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider mb-3 opacity-70">
                  Quarterly Milestones (Timeline Roadmap)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["q1", "q2", "q3", "q4"] as const).map((qKey, idx) => (
                    <div key={qKey} className={`p-4 rounded-xl border ${cardBg}`}>
                      <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
                        Quarter {idx + 1} Milestone
                      </div>
                      <textarea
                        rows={2}
                        value={currentGoal.milestones[qKey]}
                        onChange={(e) => {
                          const updated: GoalEntry = {
                            ...currentGoal,
                            milestones: {
                              ...currentGoal.milestones,
                              [qKey]: e.target.value,
                            },
                          };
                          triggerSave({
                            ...journalState,
                            goals: { ...journalState.goals, [selectedArea]: updated },
                          });
                        }}
                        placeholder={`Specific outcome to achieve by end of Q${idx + 1}...`}
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none resize-none font-sans ${
                          isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 3: QUARTER PLAN                                         */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "quarter" && (
          <div className="space-y-6">
            {/* Quarter Selector Tabs */}
            <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q as any)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedQuarter === q ? primaryBg : pillLight
                    }`}
                  >
                    Quarter {q}
                  </button>
                ))}
              </div>
              <span className="text-xs opacity-60 font-semibold hidden sm:inline">{selectedArea}</span>
            </div>

            {/* Quarter Content */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-4`}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Quarter {selectedQuarter} Theme &amp; Focus
                </label>
                <input
                  type="text"
                  value={currentQuarterPlan.theme}
                  onChange={(e) => {
                    const updated = {
                      ...currentGoal,
                      quarterPlans: {
                        ...currentGoal.quarterPlans,
                        [selectedQuarter]: {
                          ...currentQuarterPlan,
                          theme: e.target.value,
                        },
                      },
                    };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="e.g. Foundation & Keystone Habits"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Monthly Focus Columns for this Quarter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {(["month1", "month2", "month3"] as const).map((mKey, idx) => {
                  const mNumber = (selectedQuarter - 1) * 3 + idx + 1;
                  const items = currentQuarterPlan[mKey] || [];

                  return (
                    <div key={mKey} className={`p-4 rounded-xl border ${cardBg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-sm">
                          {MONTH_NAMES[mNumber - 1]}
                        </span>
                        <button
                          onClick={() => {
                            const newItems = [...items, { id: Date.now().toString(), text: "", completed: false }];
                            const updated = {
                              ...currentGoal,
                              quarterPlans: {
                                ...currentGoal.quarterPlans,
                                [selectedQuarter]: {
                                  ...currentQuarterPlan,
                                  [mKey]: newItems,
                                },
                              },
                            };
                            triggerSave({
                              ...journalState,
                              goals: { ...journalState.goals, [selectedArea]: updated },
                            });
                          }}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold"
                          title="Add Item"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {items.map((it, itIdx) => (
                          <div key={it.id || itIdx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={it.completed}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[itIdx].completed = e.target.checked;
                                const updated = {
                                  ...currentGoal,
                                  quarterPlans: {
                                    ...currentGoal.quarterPlans,
                                    [selectedQuarter]: {
                                      ...currentQuarterPlan,
                                      [mKey]: newItems,
                                    },
                                  },
                                };
                                triggerSave({
                                  ...journalState,
                                  goals: { ...journalState.goals, [selectedArea]: updated },
                                });
                              }}
                              className="rounded text-amber-500"
                            />
                            <input
                              type="text"
                              value={it.text}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[itIdx].text = e.target.value;
                                const updated = {
                                  ...currentGoal,
                                  quarterPlans: {
                                    ...currentGoal.quarterPlans,
                                    [selectedQuarter]: {
                                      ...currentQuarterPlan,
                                      [mKey]: newItems,
                                    },
                                  },
                                };
                                triggerSave({
                                  ...journalState,
                                  goals: { ...journalState.goals, [selectedArea]: updated },
                                });
                              }}
                              placeholder="Action target..."
                              className={`flex-1 p-1.5 rounded-lg border text-xs outline-none ${
                                it.completed ? "line-through opacity-50" : ""
                              } ${isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"}`}
                            />
                            <button
                              onClick={() => {
                                const newItems = items.filter((_, idx2) => idx2 !== itIdx);
                                const updated = {
                                  ...currentGoal,
                                  quarterPlans: {
                                    ...currentGoal.quarterPlans,
                                    [selectedQuarter]: {
                                      ...currentQuarterPlan,
                                      [mKey]: newItems,
                                    },
                                  },
                                };
                                triggerSave({
                                  ...journalState,
                                  goals: { ...journalState.goals, [selectedArea]: updated },
                                });
                              }}
                              className="text-red-400 hover:text-red-600 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {items.length === 0 && (
                          <div className="text-xs opacity-50 italic py-2">No items set yet.</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 4: MONTH PLAN                                           */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "month" && (
          <div className="space-y-6">
            {/* Month Chips */}
            <div className={`p-3 rounded-2xl border ${cardBg} overflow-x-auto no-scrollbar flex items-center gap-1.5`}>
              {MONTH_NAMES.map((name, idx) => {
                const mNum = idx + 1;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedMonth(mNum)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedMonth === mNum ? primaryBg : pillLight
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Month Dashboard */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-6`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Month Plan</span>
                <h2 className="font-serif font-bold text-2xl">
                  {MONTH_NAMES[selectedMonth - 1]} ({selectedArea})
                </h2>
              </div>

              {/* Key Goals (Up to 5) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Key Monthly Goals
                  </label>
                  <button
                    onClick={() => {
                      const newGoals = [
                        ...(currentMonthPlan.keyGoals || []),
                        { id: Date.now().toString(), text: "", completed: false },
                      ];
                      const updated = {
                        ...currentGoal,
                        monthPlans: {
                          ...currentGoal.monthPlans,
                          [selectedMonth]: { ...currentMonthPlan, keyGoals: newGoals },
                        },
                      };
                      triggerSave({
                        ...journalState,
                        goals: { ...journalState.goals, [selectedArea]: updated },
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-bold opacity-80 hover:opacity-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Goal</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(currentMonthPlan.keyGoals || []).map((kg, kgIdx) => (
                    <div key={kg.id || kgIdx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={kg.completed}
                        onChange={(e) => {
                          const newGoals = [...currentMonthPlan.keyGoals];
                          newGoals[kgIdx].completed = e.target.checked;
                          const updated = {
                            ...currentGoal,
                            monthPlans: {
                              ...currentGoal.monthPlans,
                              [selectedMonth]: { ...currentMonthPlan, keyGoals: newGoals },
                            },
                          };
                          triggerSave({
                            ...journalState,
                            goals: { ...journalState.goals, [selectedArea]: updated },
                          });
                        }}
                        className="rounded text-amber-500"
                      />
                      <input
                        type="text"
                        value={kg.text}
                        onChange={(e) => {
                          const newGoals = [...currentMonthPlan.keyGoals];
                          newGoals[kgIdx].text = e.target.value;
                          const updated = {
                            ...currentGoal,
                            monthPlans: {
                              ...currentGoal.monthPlans,
                              [selectedMonth]: { ...currentMonthPlan, keyGoals: newGoals },
                            },
                          };
                          triggerSave({
                            ...journalState,
                            goals: { ...journalState.goals, [selectedArea]: updated },
                          });
                        }}
                        placeholder="Key milestone for this month..."
                        className={`flex-1 p-2 rounded-lg border text-xs outline-none ${
                          kg.completed ? "line-through opacity-50" : ""
                        } ${isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"}`}
                      />
                      <button
                        onClick={() => {
                          const newGoals = currentMonthPlan.keyGoals.filter((_, i) => i !== kgIdx);
                          const updated = {
                            ...currentGoal,
                            monthPlans: {
                              ...currentGoal.monthPlans,
                              [selectedMonth]: { ...currentMonthPlan, keyGoals: newGoals },
                            },
                          };
                          triggerSave({
                            ...journalState,
                            goals: { ...journalState.goals, [selectedArea]: updated },
                          });
                        }}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(currentMonthPlan.keyGoals || []).length === 0 && (
                    <div className="text-xs opacity-50 italic py-1">No monthly goals set. Tap Add Goal.</div>
                  )}
                </div>
              </div>

              {/* Monthly Strategic Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Monthly Focus &amp; Notes
                </label>
                <textarea
                  rows={3}
                  value={currentMonthPlan.notes}
                  onChange={(e) => {
                    const updated = {
                      ...currentGoal,
                      monthPlans: {
                        ...currentGoal.monthPlans,
                        [selectedMonth]: { ...currentMonthPlan, notes: e.target.value },
                      },
                    };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Observations, mindset, and strategy for this month..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 5: WEEKLY PLANNER                                       */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "week" && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-60">Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none ${cardBg}`}
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                <span className="text-xs font-bold opacity-60">Week:</span>
                {[1, 2, 3, 4, 5].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeek(w)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedWeek === w ? primaryBg : pillLight
                    }`}
                  >
                    W{w}
                  </button>
                ))}
              </div>
              <span className="text-xs opacity-60 font-semibold hidden sm:inline">{selectedArea}</span>
            </div>

            {/* Weekly Schedule: 7 Full Days */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-6`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  {MONTH_NAMES[selectedMonth - 1]} • Week {selectedWeek}
                </span>
                <h2 className="font-serif font-bold text-2xl">Weekly Planner (Monday to Sunday)</h2>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {(
                  [
                    { key: "monday", label: "Monday" },
                    { key: "tuesday", label: "Tuesday" },
                    { key: "wednesday", label: "Wednesday" },
                    { key: "thursday", label: "Thursday" },
                    { key: "friday", label: "Friday" },
                    { key: "saturday", label: "Saturday" },
                    { key: "sunday", label: "Sunday" },
                  ] as const
                ).map((day) => (
                  <div key={day.key} className={`p-3 rounded-xl border flex flex-col justify-between ${cardBg}`}>
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                      {day.label}
                    </div>
                    <textarea
                      rows={5}
                      value={currentWeekPlan.days?.[day.key] || ""}
                      onChange={(e) => {
                        const newDays = {
                          ...currentWeekPlan.days,
                          [day.key]: e.target.value,
                        };
                        const updatedWeek = { ...currentWeekPlan, days: newDays };
                        const updated = {
                          ...currentGoal,
                          monthPlans: {
                            ...currentGoal.monthPlans,
                            [selectedMonth]: {
                              ...currentMonthPlan,
                              weeks: {
                                ...currentMonthPlan.weeks,
                                [selectedWeek]: updatedWeek,
                              },
                            },
                          },
                        };
                        triggerSave({
                          ...journalState,
                          goals: { ...journalState.goals, [selectedArea]: updated },
                        });
                      }}
                      placeholder={`Focus for ${day.label}...`}
                      className={`w-full p-2 rounded-lg border text-xs outline-none resize-none font-sans ${
                        isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Carry Forward Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Carry Forward &amp; Weekly Reflection
                </label>
                <input
                  type="text"
                  value={currentWeekPlan.carryForward || ""}
                  onChange={(e) => {
                    const updatedWeek = { ...currentWeekPlan, carryForward: e.target.value };
                    const updated = {
                      ...currentGoal,
                      monthPlans: {
                        ...currentGoal.monthPlans,
                        [selectedMonth]: {
                          ...currentMonthPlan,
                          weeks: {
                            ...currentMonthPlan.weeks,
                            [selectedWeek]: updatedWeek,
                          },
                        },
                      },
                    };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Items or mindset to carry forward into next week..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 6: MONTH IN REVIEW                                      */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "review" && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-60">Select Month to Review:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none ${cardBg}`}
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs opacity-60 font-semibold">{selectedArea}</span>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-5`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Personal Reflection</span>
                <h2 className="font-serif font-bold text-2xl">
                  {MONTH_NAMES[selectedMonth - 1]} in Review
                </h2>
                <p className="text-xs opacity-70 mt-0.5">
                  The review is done personally by you to celebrate wins, acknowledge lessons, and re-center.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70 text-emerald-500">
                  What I Achieved (Wins &amp; Milestones)
                </label>
                <textarea
                  rows={3}
                  value={currentMonthPlan.review?.whatIAchieved || ""}
                  onChange={(e) => {
                    const review = { ...currentMonthPlan.review, whatIAchieved: e.target.value };
                    const updated = {
                      ...currentGoal,
                      monthPlans: {
                        ...currentGoal.monthPlans,
                        [selectedMonth]: { ...currentMonthPlan, review },
                      },
                    };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Record your breakthroughs, victories, and fulfilled goals..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70 text-amber-500">
                  What Was Left Undone &amp; What Got In The Way
                </label>
                <textarea
                  rows={3}
                  value={currentMonthPlan.review?.whatGotInTheWay || ""}
                  onChange={(e) => {
                    const review = { ...currentMonthPlan.review, whatGotInTheWay: e.target.value };
                    const updated = {
                      ...currentGoal,
                      monthPlans: {
                        ...currentGoal.monthPlans,
                        [selectedMonth]: { ...currentMonthPlan, review },
                      },
                    };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="What friction arose? Distractions, schedule conflicts, or unmet targets..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Gratitude & Key Lesson */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    One Major Lesson
                  </label>
                  <input
                    type="text"
                    value={currentMonthPlan.review?.reflection?.oneLesson || ""}
                    onChange={(e) => {
                      const reflection = {
                        ...currentMonthPlan.review?.reflection,
                        oneLesson: e.target.value,
                      };
                      const review = { ...currentMonthPlan.review, reflection };
                      const updated = {
                        ...currentGoal,
                        monthPlans: {
                          ...currentGoal.monthPlans,
                          [selectedMonth]: { ...currentMonthPlan, review },
                        },
                      };
                      triggerSave({
                        ...journalState,
                        goals: { ...journalState.goals, [selectedArea]: updated },
                      });
                    }}
                    placeholder="Key insight from this month..."
                    className={`w-full p-3 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Grateful For
                  </label>
                  <input
                    type="text"
                    value={currentMonthPlan.review?.reflection?.gratefulFor || ""}
                    onChange={(e) => {
                      const reflection = {
                        ...currentMonthPlan.review?.reflection,
                        gratefulFor: e.target.value,
                      };
                      const review = { ...currentMonthPlan.review, reflection };
                      const updated = {
                        ...currentGoal,
                        monthPlans: {
                          ...currentGoal.monthPlans,
                          [selectedMonth]: { ...currentMonthPlan, review },
                        },
                      };
                      triggerSave({
                        ...journalState,
                        goals: { ...journalState.goals, [selectedArea]: updated },
                      });
                    }}
                    placeholder="Specific blessings or people..."
                    className={`w-full p-3 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: YEAR PICKER                                            */}
      {/* ------------------------------------------------------------- */}
      {showYearPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Switch Journal Year</h3>
              </div>
              <button onClick={() => setShowYearPicker(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                Rolling 4-Year Window
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleSelectYear(yr)}
                    className={`py-3 rounded-xl text-center text-sm font-bold border transition-all ${
                      yr === journalState.year ? primaryBg : pillLight
                    }`}
                  >
                    <div>{yr}</div>
                    {yr === new Date().getFullYear() && (
                      <div className="text-[10px] opacity-70">(Now)</div>
                    )}
                  </button>
                ))}
              </div>

              {/* Jump to custom year */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Or enter year (e.g. 2029)..."
                  value={customYearInput}
                  onChange={(e) => setCustomYearInput(e.target.value)}
                  className={`flex-1 p-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
                <button
                  onClick={() => {
                    const parsed = parseInt(customYearInput.trim(), 10);
                    if (!isNaN(parsed) && parsed >= 2000 && parsed <= 2100) {
                      handleSelectYear(parsed);
                      setCustomYearInput("");
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold ${primaryBg}`}
                >
                  Jump
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: AUTH / SIGN IN / REGISTER                              */}
      {/* ------------------------------------------------------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif font-bold text-lg">
                {authMode === "login" ? "Sign In to Your Journal" : "Create Your Journal Account"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="py-4 space-y-3">
              {authError && (
                <div className="p-3 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/40 text-red-500">
                  {authError}
                </div>
              )}

              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="Your name"
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2 transition-all ${primaryBg}`}
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{authMode === "login" ? "Sign In" : "Create Account"}</span>
              </button>

              <div className="text-center text-xs opacity-70 pt-2">
                {authMode === "login" ? (
                  <span>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="font-bold underline text-amber-500"
                    >
                      Create one
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="font-bold underline text-amber-500"
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EMAIL REMINDERS CONFIGURATION                           */}
      {/* ------------------------------------------------------------- */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Email Goal Reminders</h3>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs opacity-75 leading-relaxed">
                Receive encouraging check-ins with your top 3 annual goals, current weekly focus, and direct reflective link.
              </p>

              {reminderMsg && (
                <div className="p-3 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-500">
                  {reminderMsg}
                </div>
              )}

              {/* Frequency */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Reminder Frequency
                </label>
                <select
                  value={reminderFreq}
                  onChange={(e) => setReminderFreq(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${cardBg}`}
                >
                  <option value="weekly">Weekly (Recommended for Steady Momentum)</option>
                  <option value="monthly">Monthly (End-of-Month Review)</option>
                  <option value="daily">Daily Morning Intention</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Day of Week */}
              {reminderFreq === "weekly" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Preferred Day
                  </label>
                  <select
                    value={reminderDay}
                    onChange={(e) => setReminderDay(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${cardBg}`}
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Destination Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Delivery Email Address
                </label>
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={reminderLoading}
                  onClick={() => handleSaveReminders(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${primaryBg}`}
                >
                  {reminderLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Settings</span>
                </button>
                <button
                  type="button"
                  disabled={reminderLoading}
                  onClick={() => handleSaveReminders(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-amber-400/50 text-amber-500 hover:bg-amber-400/10 transition-colors"
                >
                  Send Test Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: INTELLIGENT GOAL DECOMPOSITION (AI AUTO-SPLIT)         */}
      {/* ------------------------------------------------------------- */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                <h3 className="font-serif font-bold text-lg">
                  ✨ Intelligent Goal Decomposition
                </h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Life Area &amp; Yearly Goal
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-500 border border-amber-400/40">
                    {aiTargetArea}
                  </span>
                  <span className="text-xs opacity-60">Target Year: {journalState.year}</span>
                </div>
                <textarea
                  rows={2}
                  value={aiGoalText}
                  onChange={(e) => setAiGoalText(e.target.value)}
                  placeholder="Enter your yearly goal statement..."
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none font-sans ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* AI Engine Status Badge */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-500">
                    ⚡ Automated Cascading Decomposition
                  </div>
                  <div className="text-[11px] opacity-70">
                    Intelligently decomposes yearly goals into 4 quarters, 12 months &amp; 7-day habits.
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30">
                  AI Ready
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                disabled={aiLoading || !aiGoalText.trim()}
                onClick={handleRunDecomposition}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${primaryBg}`}
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {aiLoading ? "Generating Intelligent Breakdown..." : "Decompose Goal into Quarters, Months & Weeks"}
                </span>
              </button>

              {/* Generated Breakdown Preview */}
              {decomposedPreview && (
                <div className="mt-4 p-4 rounded-xl border border-amber-400/40 bg-amber-400/5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
                    <span className="font-serif font-bold text-sm text-amber-500">
                      Generated Plan Preview ({decomposedPreview.source})
                    </span>
                    <span className="text-[11px] opacity-70">Review and adjust below</span>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">
                      Why It Matters
                    </div>
                    <p className="text-xs leading-relaxed">{decomposedPreview.whyItMatters}</p>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                      Quarterly Milestones
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                        <strong>Q1:</strong> {decomposedPreview.milestones?.q1}
                      </div>
                      <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                        <strong>Q2:</strong> {decomposedPreview.milestones?.q2}
                      </div>
                      <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                        <strong>Q3:</strong> {decomposedPreview.milestones?.q3}
                      </div>
                      <div className="p-2 rounded bg-black/5 dark:bg-white/5">
                        <strong>Q4:</strong> {decomposedPreview.milestones?.q4}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleApplyDecomposition}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Breakdown to My 2026 Journal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
