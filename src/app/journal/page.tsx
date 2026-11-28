"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Sun,
  Moon,
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
  Target,
  AlertTriangle,
  ShieldAlert,
  Crown,
  Cloud,
  Lock,
  Smartphone,
  CreditCard,
  Settings,
  ShieldCheck,
  RefreshCw,
  Palette,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { getWeeksForMonth } from "@/lib/journalCalendar";

// -------------------------------------------------------------
// Types & Constants
// -------------------------------------------------------------
export type PredefinedLifeArea =
  | "Personal growth"
  | "Health and wellbeing"
  | "Spiritual life"
  | "Career or business"
  | "Financial"
  | "Family and relationships"
  | "Community and impact"
  | "Rest and joy";

export type LifeArea = PredefinedLifeArea | (string & {});

export interface LifeAreaMeta {
  key: LifeArea;
  label: string;
  icon: any;
  defaultPlaceholder: string;
  isCustom?: boolean;
}

export const LIFE_AREAS: LifeAreaMeta[] = [
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

export const SUGGESTED_CUSTOM_GOALS = [
  { name: "Creative Project", placeholder: "e.g. Write a book, record podcast, learn oil painting" },
  { name: "Ministry & Outreach", placeholder: "e.g. Lead small group, volunteer at soup kitchen, missions trip" },
  { name: "Home & Sanctuary", placeholder: "e.g. Renovate kitchen, organize garage, landscape garden" },
  { name: "Travel & Adventure", placeholder: "e.g. Visit 3 new countries, annual family road trip, hike Rockies" },
  { name: "Education & Degree", placeholder: "e.g. Complete certification, learn fluent Spanish, read 20 whitepapers" },
  { name: "Investing & Real Estate", placeholder: "e.g. Acquire rental property, index fund DCA, crypto safety" },
  { name: "Parenting & Legacy", placeholder: "e.g. 1-on-1 monthly child dates, build trust fund, family tree" },
  { name: "Physical Fitness", placeholder: "e.g. Run half-marathon, 100 pushups daily, hit 15% body fat" },
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
  isCustom?: boolean;
}

export interface JournalState {
  year: number;
  goals: Record<string, GoalEntry>;
  customAreas?: string[];
  yearsData?: Record<number, Record<string, GoalEntry>>;
}

export function getActiveGoalAreas(state: JournalState): LifeAreaMeta[] {
  const result: LifeAreaMeta[] = [];
  const knownKeys = new Set<string>();

  // Include predefined areas that are not deleted from state.goals
  for (const item of LIFE_AREAS) {
    if (state.goals && state.goals[item.key] !== undefined) {
      result.push(item);
      knownKeys.add(item.key);
    }
  }

  // Include custom areas
  if (state.customAreas && Array.isArray(state.customAreas)) {
    for (const ca of state.customAreas) {
      if (ca && !knownKeys.has(ca) && state.goals && state.goals[ca] !== undefined) {
        result.push({
          key: ca,
          label: ca,
          icon: Target,
          defaultPlaceholder: `e.g. Set specific, measurable milestones for ${ca}`,
          isCustom: true,
        });
        knownKeys.add(ca);
      }
    }
  }

  // Any other keys present in state.goals
  if (state.goals) {
    for (const [k, v] of Object.entries(state.goals)) {
      if (k && !knownKeys.has(k) && v) {
        result.push({
          key: k,
          label: k,
          icon: Target,
          defaultPlaceholder: `e.g. Set specific, measurable milestones for ${k}`,
          isCustom: true,
        });
        knownKeys.add(k);
      }
    }
  }

  return result;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function createDefaultGoalEntry(area: LifeArea, isCustom: boolean = false, targetYear: number = 2026): GoalEntry {
  const quarterPlans: Record<1 | 2 | 3 | 4, QuarterPlan> = {
    1: { quarter: 1, theme: "", month1: [], month2: [], month3: [] },
    2: { quarter: 2, theme: "", month1: [], month2: [], month3: [] },
    3: { quarter: 3, theme: "", month1: [], month2: [], month3: [] },
    4: { quarter: 4, theme: "", month1: [], month2: [], month3: [] },
  };

  const monthPlans: Record<number, MonthPlan> = {};
  for (let m = 1; m <= 12; m++) {
    const monthWeeks = getWeeksForMonth(targetYear, m);
    const weeks: Record<number, WeekPlan> = {};
    monthWeeks.forEach((wInfo) => {
      weeks[wInfo.weekIndex] = {
        weekIndex: wInfo.weekIndex,
        weekOf: `Week ${wInfo.weekIndex} (${wInfo.shortLabel})`,
        topPriorities: [],
        days: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
        carryForward: "",
      };
    });

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
      weeks,
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
    isCustom,
  };
}

function createDefaultJournalState(year: number): JournalState {
  const goals: Record<string, GoalEntry> = {};
  LIFE_AREAS.forEach((item) => {
    goals[item.key] = createDefaultGoalEntry(item.key, false, year);
  });
  return {
    year,
    goals,
    customAreas: [],
    yearsData: { [year]: goals },
  };
}

// -------------------------------------------------------------
// Main Journal Web App Component
// -------------------------------------------------------------
export default function JournalPage() {
  const [themeMode, setThemeMode] = useState<"linen" | "dark">("linen");
  const [activeTab, setActiveTab] = useState<"year" | "breakdown" | "quarter" | "month" | "week" | "review" | "settings">("year");
  const [selectedArea, setSelectedArea] = useState<LifeArea>("Health and wellbeing");
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"cards" | "wheel">("cards");

  // State & Multi-Year
  const defaultYear = new Date().getFullYear();
  const [journalState, setJournalState] = useState<JournalState>(() => createDefaultJournalState(defaultYear));
  const [availableYears, setAvailableYears] = useState<number[]>([
    defaultYear - 1,
    defaultYear,
    defaultYear + 1,
    defaultYear + 2,
  ]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [customYearInput, setCustomYearInput] = useState("");

  // Auth & Cloud Sync
  interface JournalUser {
    id: number;
    email: string;
    full_name: string;
    is_kws_member?: boolean;
    membership_tag?: string;
    is_pro?: boolean;
    subscription?: any;
    is_summit_attendee?: boolean;
  }
  const [user, setUser] = useState<JournalUser | null>(null);
  const [token, setToken] = useState<string>("");
  const [authChecking, setAuthChecking] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline">("offline");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proFeatureContext, setProFeatureContext] = useState<"ai" | "sync" | "reminders" | "general">("general");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Email Reminders Modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderFreq, setReminderFreq] = useState<"weekly" | "daily" | "monthly" | "disabled">("disabled");
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

  // Custom Goals Modal & Delete Confirmation
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalPriority, setNewGoalPriority] = useState<1 | 2 | 3>(2);
  const [addGoalError, setAddGoalError] = useState("");
  const [goalToDelete, setGoalToDelete] = useState<LifeArea | null>(null);

  // Account Deletion Modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");

  // Paystack Web Checkout
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [paystackError, setPaystackError] = useState("");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Reset Journal Confirmation Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function handleResetJournal() {
    setResetLoading(true);
    try {
      const fresh = createDefaultJournalState(journalState.year);
      setJournalState(fresh);
      await triggerSave(fresh);
      setShowResetModal(false);
    } catch (err) {
      console.error("Failed to reset journal:", err);
    } finally {
      setResetLoading(false);
    }
  }

  function handleThemeChange(mode: "linen" | "dark") {
    setThemeMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("kws_journal_theme", mode);
    }
  }

  // 1. Initial Load: Check token & require authentication
  useEffect(() => {
    const savedTheme = localStorage.getItem("kws_journal_theme") as "linen" | "dark" | null;
    if (savedTheme === "linen" || savedTheme === "dark") {
      setThemeMode(savedTheme);
    }

    const savedToken = localStorage.getItem("kws_journal_token") || "";

    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken).finally(() => setAuthChecking(false));
      fetchCloudJournal(savedToken, defaultYear);
    } else {
      setAuthChecking(false);
    }

    // Check for Paystack redirect query params: ?payment=verify&reference=...
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");
      const paymentAction = urlParams.get("payment");

      if (paymentAction === "verify" && reference) {
        verifyPaystackPayment(reference);
      }
    }
  }, []);

  // Fetch reminder settings when Settings tab is activated
  useEffect(() => {
    if (token && activeTab === "settings") {
      fetch("/api/journal/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.reminder) {
            setReminderFreq(data.reminder.frequency || "disabled");
            setReminderDay(data.reminder.day_of_week || "Monday");
            setReminderTime(data.reminder.time_of_day || "08:00");
            if (data.reminder.email) setReminderEmail(data.reminder.email);
          }
        })
        .catch(() => {});
    }
  }, [token, activeTab]);

  async function verifyPaystackPayment(ref: string) {
    try {
      const res = await fetch(`/api/journal/paystack/verify?reference=${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccessMsg("Payment successful! FRA Journal Pro has been activated on your account.");
        const savedToken = localStorage.getItem("kws_journal_token") || "";
        if (savedToken) {
          fetchUserProfile(savedToken);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setPaystackError(data.error || "Payment verification could not be completed.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setPaystackError("Failed to verify Paystack transaction.");
    }
  }

  async function handlePaystackCheckout() {
    if (!token) {
      setShowProModal(false);
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    setPaystackLoading(true);
    setPaystackError("");

    try {
      const res = await fetch("/api/journal/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not initialize Paystack checkout.");
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      setPaystackError(err.message || "Failed to launch Paystack checkout.");
      setPaystackLoading(false);
    }
  }

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
        setSyncStatus(data.user?.is_pro ? "synced" : "offline");
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
    localStorage.removeItem("kws_journal_local_state");
    setJournalState(createDefaultJournalState(new Date().getFullYear()));
    setSyncStatus("offline");
    fetch("/api/journal/auth/login", { method: "DELETE" }).catch(() => {});
  }

  // Custom Goals Logic
  function handleAddCustomGoal() {
    const trimmedName = newGoalName.trim();
    if (!trimmedName) {
      setAddGoalError("Please enter a goal name or title.");
      return;
    }

    const currentAreas = getActiveGoalAreas(journalState);
    if (currentAreas.some((a) => a.key.toLowerCase() === trimmedName.toLowerCase())) {
      setAddGoalError("A goal with this name already exists.");
      return;
    }

    const newEntry = createDefaultGoalEntry(trimmedName, true, journalState.year);
    newEntry.text = newGoalText.trim();
    newEntry.priority = newGoalPriority;

    const nextCustomAreas = Array.from(new Set([...(journalState.customAreas || []), trimmedName]));
    const nextGoals = {
      ...journalState.goals,
      [trimmedName]: newEntry,
    };
    const yearsData = journalState.yearsData || {};
    const nextYearsData = {
      ...yearsData,
      [journalState.year]: nextGoals,
    };

    const nextState: JournalState = {
      ...journalState,
      goals: nextGoals,
      customAreas: nextCustomAreas,
      yearsData: nextYearsData,
    };

    triggerSave(nextState);
    setSelectedArea(trimmedName);
    setNewGoalName("");
    setNewGoalText("");
    setNewGoalPriority(2);
    setAddGoalError("");
    setShowAddGoalModal(false);
  }

  function handleConfirmDeleteGoal() {
    if (!goalToDelete) return;

    const nextGoals = { ...journalState.goals };
    delete nextGoals[goalToDelete];

    const nextCustomAreas = (journalState.customAreas || []).filter((c) => c !== goalToDelete);
    const yearsData = journalState.yearsData || {};
    const nextYearGoals = { ...(yearsData[journalState.year] || {}) };
    delete nextYearGoals[goalToDelete];

    const nextYearsData = {
      ...yearsData,
      [journalState.year]: nextYearGoals,
    };

    const nextState: JournalState = {
      ...journalState,
      goals: nextGoals,
      customAreas: nextCustomAreas,
      yearsData: nextYearsData,
    };

    const remainingAreas = getActiveGoalAreas(nextState);
    if (selectedArea === goalToDelete) {
      setSelectedArea(remainingAreas[0]?.key || "Personal growth");
    }

    triggerSave(nextState);
    setGoalToDelete(null);
  }

  async function handleDeleteAccount() {
    if (!token) return;
    setDeleteAccountLoading(true);
    setDeleteAccountError("");

    try {
      const res = await fetch("/api/journal/auth/delete-account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteAccountError(data.error || "Failed to delete account. Please try again.");
        setDeleteAccountLoading(false);
        return;
      }

      setUser(null);
      setToken("");
      localStorage.removeItem("kws_journal_token");
      localStorage.removeItem("kws_journal_local_state");
      setJournalState(createDefaultJournalState(new Date().getFullYear()));
      setSyncStatus("offline");
      setShowDeleteAccountModal(false);
      setDeleteAccountLoading(false);
    } catch {
      setDeleteAccountError("Network error. Could not delete account.");
      setDeleteAccountLoading(false);
    }
  }

  // AI Decomposition
  async function handleRunDecomposition() {
    if (!token) {
      setShowAiModal(false);
      setShowAuthModal(true);
      return;
    }
    if (!user?.is_pro) {
      setShowAiModal(false);
      setProFeatureContext("ai");
      setShowProModal(true);
      return;
    }

    setAiLoading(true);
    setDecomposedPreview(null);

    try {
      const res = await fetch("/api/journal/ai-decompose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          area: aiTargetArea,
          goalText: aiGoalText,
          year: journalState.year,
        }),
      });

      const data = await res.json();
      if (res.ok && data.plan) {
        setDecomposedPreview(data.plan);
      } else if (res.status === 403 || data.requires_pro) {
        setShowAiModal(false);
        setProFeatureContext("ai");
        setShowProModal(true);
      } else if (res.status === 401 || data.requires_auth) {
        setShowAiModal(false);
        setShowAuthModal(true);
      } else {
        alert(data.error || "Decomposition failed");
      }
    } catch {
      alert("Error contacting AI decomposition service");
    } finally {
      setAiLoading(false);
    }
  }

  function handleApplyDecomposition() {
    if (!decomposedPreview) return;

    try {
      const currentGoal = journalState.goals[aiTargetArea] || createDefaultGoalEntry(aiTargetArea, false, journalState.year);

      // Populate milestones, why, support
      const updatedGoal: GoalEntry = {
        ...currentGoal,
        text: aiGoalText,
        whyItMatters: decomposedPreview.whyItMatters || currentGoal.whyItMatters || "",
        supportNeeded: decomposedPreview.supportNeeded || currentGoal.supportNeeded || "",
        milestones: {
          q1: decomposedPreview.milestones?.q1 || currentGoal.milestones?.q1 || "",
          q2: decomposedPreview.milestones?.q2 || currentGoal.milestones?.q2 || "",
          q3: decomposedPreview.milestones?.q3 || currentGoal.milestones?.q3 || "",
          q4: decomposedPreview.milestones?.q4 || currentGoal.milestones?.q4 || "",
        },
        quarterPlans: { ...(currentGoal.quarterPlans || {}) },
        monthPlans: { ...(currentGoal.monthPlans || {}) },
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

      // Apply Months & Weeks (All 12 Months, All Weeks 1 to 5)
      if (decomposedPreview.monthPlans) {
        for (let m = 1; m <= 12; m++) {
          const mp = decomposedPreview.monthPlans[m];
          if (mp) {
            const currentMonth = updatedGoal.monthPlans[m] || {
              monthIndex: m,
              monthName: MONTH_NAMES[m - 1],
              keyGoals: [],
              todos: [],
              notes: "",
              review: { whatIAchieved: "", whatWasLeftUndone: "", whatGotInTheWay: "", carryForwardItems: [], reflection: { oneWin: "", oneLesson: "", gratefulFor: "" } },
              weeks: {},
            };

            const monthWeeks = getWeeksForMonth(journalState.year, m);
            const populatedWeeks: Record<number, WeekPlan> = {};

            monthWeeks.forEach((wInfo) => {
              const w = wInfo.weekIndex;
              const dw = mp.weeks?.[w];
              if (dw) {
                populatedWeeks[w] = {
                  weekIndex: w,
                  weekOf: `Week ${w} (${wInfo.shortLabel})`,
                  topPriorities: (dw.topPriorities || []).map((t: string, i: number) => ({
                    id: `wp-${m}-${w}-${i}`,
                    text: t,
                    completed: false,
                  })),
                  days: {
                    monday: dw.days?.monday || "",
                    tuesday: dw.days?.tuesday || "",
                    wednesday: dw.days?.wednesday || "",
                    thursday: dw.days?.thursday || "",
                    friday: dw.days?.friday || "",
                    saturday: dw.days?.saturday || "",
                    sunday: dw.days?.sunday || "",
                  },
                  carryForward: dw.carryForward || "",
                };
              } else {
                populatedWeeks[w] = currentMonth.weeks?.[w] || {
                  weekIndex: w,
                  weekOf: `Week ${w} (${wInfo.shortLabel})`,
                  topPriorities: [],
                  days: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
                  carryForward: "",
                };
              }
            });

            updatedGoal.monthPlans[m] = {
              ...currentMonth,
              keyGoals: (mp.keyGoals || []).map((t: string, i: number) => ({ id: `kg-${m}-${i}`, text: t, completed: false })),
              todos: (mp.todos || []).map((t: string, i: number) => ({ id: `td-${m}-${i}`, text: t, completed: false })),
              notes: mp.notes || currentMonth.notes || "",
              weeks: populatedWeeks,
            };
          }
        }
      }

      // Apply Sample Week override to Month 1, Week 1 if explicitly present
      if (decomposedPreview.sampleWeek && updatedGoal.monthPlans[1]?.weeks?.[1]) {
        updatedGoal.monthPlans[1].weeks[1] = {
          ...updatedGoal.monthPlans[1].weeks[1],
          topPriorities: (decomposedPreview.sampleWeek.topPriorities || []).map((t: string, i: number) => ({
            id: `wp-1-1-${i}`,
            text: t,
            completed: false,
          })),
          days: {
            ...updatedGoal.monthPlans[1].weeks[1].days,
            ...decomposedPreview.sampleWeek.days,
          },
          carryForward: decomposedPreview.sampleWeek.carryForward || updatedGoal.monthPlans[1].weeks[1].carryForward || "",
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
    } catch (err) {
      console.error("Failed to apply decomposition:", err);
      setShowAiModal(false);
      setDecomposedPreview(null);
    }
  }

  // Email Reminders Save & Test Send
  async function handleSaveReminders(sendTest: boolean = false) {
    if (!token) {
      setShowReminderModal(false);
      setShowAuthModal(true);
      return;
    }
    if (!user?.is_pro) {
      setShowReminderModal(false);
      setProFeatureContext("reminders");
      setShowProModal(true);
      return;
    }

    setReminderLoading(true);
    setReminderMsg("");

    try {
      const res = await fetch("/api/journal/reminders", {
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

      if (res.status === 403) {
        setShowReminderModal(false);
        setProFeatureContext("reminders");
        setShowProModal(true);
        return;
      }

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
        targetGoals[item.key] = createDefaultGoalEntry(item.key, false, yr);
      });
      if (journalState.customAreas) {
        journalState.customAreas.forEach((ca) => {
          targetGoals[ca] = createDefaultGoalEntry(ca, true, yr);
        });
      }
      newYearsData[yr] = targetGoals;
    }

    const nextState: JournalState = {
      year: yr,
      goals: targetGoals,
      customAreas: journalState.customAreas || [],
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

  const activeAreas = getActiveGoalAreas(journalState);
  const currentGoal = journalState.goals[selectedArea] || (activeAreas[0] ? journalState.goals[activeAreas[0].key] : null) || createDefaultGoalEntry(selectedArea, false, journalState.year);
  const currentMonthPlan = currentGoal.monthPlans[selectedMonth] || currentGoal.monthPlans[1];
  const weeksForSelectedMonth = getWeeksForMonth(journalState.year, selectedMonth);
  const safeWeekIndex = Math.min(Math.max(1, selectedWeek), weeksForSelectedMonth.length);
  const currentWeekPlan = currentMonthPlan.weeks[safeWeekIndex] || currentMonthPlan.weeks[1] || {
    weekIndex: safeWeekIndex,
    weekOf: `Week ${safeWeekIndex}`,
    topPriorities: [],
    days: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
    carryForward: "",
  };
  const currentQuarterPlan = currentGoal.quarterPlans[selectedQuarter] || currentGoal.quarterPlans[1];

  useEffect(() => {
    if (activeAreas.length > 0 && !journalState.goals[selectedArea]) {
      setSelectedArea(activeAreas[0].key);
    }
  }, [journalState.goals, selectedArea]);

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

      {/* Payment Success Toast / Banner */}
      {paymentSuccessMsg && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">FRA Journal Pro Activated!</h4>
                <p className="text-xs text-emerald-200 mt-0.5">{paymentSuccessMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentSuccessMsg("")}
              className="p-1 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

        {/* Main Auth Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${cardBg}`}>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-500 mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 mb-1">
                Reflective Life Planner • Finish Rich Africa
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
                FRA Journal
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
          FRA Journal • Finish Rich Africa
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
              FRA Journal
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
              onClick={() => {
                if (!token) {
                  setShowAuthModal(true);
                  return;
                }
                if (!user?.is_pro) {
                  setProFeatureContext("reminders");
                  setShowProModal(true);
                  return;
                }
                setShowReminderModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${pillLight} hover:opacity-90`}
              title="Configure Email Reminders"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reminders</span>
              {!user?.is_pro && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-500">
                  PRO
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => handleThemeChange(isDark ? "linen" : "dark")}
              className={`p-1.5 rounded-full border transition-all ${pillLight} hover:opacity-90`}
              title="Toggle Light / Dark Theme"
            >
              <SunMoon className="w-4 h-4" />
            </button>

            {/* Quick Settings Button */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`p-1.5 rounded-full border transition-all ${
                activeTab === "settings" ? primaryBg : pillLight
              } hover:opacity-90`}
              title="Settings & Membership"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Account / Sync Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!user.is_pro) {
                      setProFeatureContext("sync");
                      setShowProModal(true);
                    }
                  }}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    user.is_pro && syncStatus === "synced"
                      ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                      : user.is_pro && syncStatus === "saving"
                      ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                      : "text-slate-400 border-slate-500/20 bg-slate-500/10 hover:border-amber-400/50"
                  }`}
                  title={user.is_pro ? "Cloud Sync Active" : "Local Storage (Upgrade to Pro for multi-device Cloud Sync)"}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.is_pro && syncStatus === "synced"
                        ? "bg-emerald-500"
                        : user.is_pro && syncStatus === "saving"
                        ? "bg-amber-500 animate-ping"
                        : "bg-slate-400"
                    }`}
                  />
                  <span>
                    {user.is_pro
                      ? syncStatus === "synced"
                        ? "Cloud Synced"
                        : "Saving..."
                      : "Local Storage (Free)"}
                  </span>
                </button>

                {/* Membership / Pro Badge */}
                {user.is_pro ? (
                  <div
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-amber-400/15 border-amber-400/40 text-amber-500 shadow-sm"
                  >
                    <span>★</span>
                    <span>{user.is_kws_member ? "KWS Member" : "PRO"}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setProFeatureContext("general");
                      setShowProModal(true);
                    }}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 border border-amber-400/40 text-amber-500 hover:bg-amber-400/30 transition-all"
                  >
                    <span>★</span>
                    <span>Upgrade to Pro</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="hidden md:inline font-semibold">{user.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full hover:bg-slate-500/15 opacity-70 hover:opacity-100 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteAccountError("");
                      setShowDeleteAccountModal(true);
                    }}
                    className="p-1.5 rounded-full hover:bg-red-500/15 text-red-500 transition-colors"
                    title="Delete Account & Wipe Cloud Data"
                  >
                    <Trash2 className="w-4 h-4" />
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

      {/* Payment Success Toast / Banner */}
      {paymentSuccessMsg && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">FRA Journal Pro Activated!</h4>
                <p className="text-xs text-emerald-200 mt-0.5">{paymentSuccessMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentSuccessMsg("")}
              className="p-1 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                { id: "settings", label: "Settings", icon: Settings },
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
            {activeTab !== "year" && activeTab !== "settings" && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-300 dark:border-slate-700">
                <span className="text-xs opacity-60 hidden md:inline">Goal:</span>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value as LifeArea)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none ${cardBg}`}
                >
                  {activeAreas.map((a) => (
                    <option key={a.key} value={a.key}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setNewGoalName("");
                    setNewGoalText("");
                    setNewGoalPriority(2);
                    setAddGoalError("");
                    setShowAddGoalModal(true);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${pillLight} hover:scale-105`}
                  title="Add Custom Goal"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
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
                  Set, customize, and prioritize your annual goals. Each area cascades into quarterly roadmaps, monthly reviews, and weekly plans.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setNewGoalName("");
                    setNewGoalText("");
                    setNewGoalPriority(2);
                    setAddGoalError("");
                    setShowAddGoalModal(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 shadow-sm ${primaryBg}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Goal</span>
                </button>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${pillLight}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Top 3: {topThreeCount}/3</span>
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

            {/* Render Life Area Cards */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeAreas.map((item) => {
                  const goal = journalState.goals[item.key] || createDefaultGoalEntry(item.key, false, journalState.year);
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
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base sm:text-lg">{item.label}</span>
                              {item.isCustom && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
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
                              <span className="hidden sm:inline">{goal.isTopThree ? "Top 3 Priority" : "Make Top 3"}</span>
                            </button>

                            {/* Delete Goal Button */}
                            <button
                              onClick={() => setGoalToDelete(item.key)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                              title={`Delete ${item.label} goal and all cascading plans`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                              if (!token) {
                                setShowAuthModal(true);
                                return;
                              }
                              if (!user?.is_pro) {
                                setProFeatureContext("ai");
                                setShowProModal(true);
                                return;
                              }
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
                            {!user?.is_pro && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-400">
                                PRO
                              </span>
                            )}
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
                  Review the balance across your active life areas. Tap any life area to focus and edit its breakdown.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {activeAreas.map((item) => {
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
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (!token) {
                        setShowAuthModal(true);
                        return;
                      }
                      if (!user?.is_pro) {
                        setProFeatureContext("ai");
                        setShowProModal(true);
                        return;
                      }
                      setAiTargetArea(selectedArea);
                      setAiGoalText(currentGoal.text);
                      setShowAiModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-500 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>✨ Auto-Decompose with AI</span>
                    {!user?.is_pro && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-400">
                        PRO
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setGoalToDelete(selectedArea)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                    title={`Delete ${selectedArea} goal and all cascading plans`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Goal</span>
                  </button>
                </div>
              </div>

              {/* Goal Statement */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Yearly Goal Statement
                </label>
                <textarea
                  rows={2}
                  value={currentGoal.text}
                  onChange={(e) => {
                    const updated: GoalEntry = { ...currentGoal, text: e.target.value };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="What is your primary goal in this area for the year?"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none leading-relaxed break-words ${
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
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none leading-relaxed break-words ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Support & Resources Needed */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Support &amp; Resources Needed
                </label>
                <textarea
                  rows={2}
                  value={currentGoal.supportNeeded}
                  onChange={(e) => {
                    const updated: GoalEntry = { ...currentGoal, supportNeeded: e.target.value };
                    triggerSave({
                      ...journalState,
                      goals: { ...journalState.goals, [selectedArea]: updated },
                    });
                  }}
                  placeholder="Mentors, books, apps, habits, accountability partner..."
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none leading-relaxed break-words ${
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
                        rows={3}
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
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none resize-none font-sans min-h-[72px] leading-relaxed break-words ${
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
                <textarea
                  rows={2}
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
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none leading-relaxed break-words ${
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
                          <div key={it.id || itIdx} className="flex items-start gap-2">
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
                              className="rounded text-amber-500 mt-1 cursor-pointer shrink-0"
                            />
                            <textarea
                              rows={2}
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
                              className={`flex-1 p-1.5 rounded-lg border text-xs outline-none resize-none leading-relaxed break-words font-sans ${
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
                              className="text-red-400 hover:text-red-600 p-0.5 mt-1 shrink-0"
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
                    <div key={kg.id || kgIdx} className="flex items-start gap-2">
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
                        className="rounded text-amber-500 mt-1 cursor-pointer shrink-0"
                      />
                      <textarea
                        rows={2}
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
                        className={`flex-1 p-2 rounded-lg border text-xs outline-none resize-none leading-relaxed break-words font-sans ${
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
                        className="text-red-400 hover:text-red-600 p-1 mt-1 shrink-0"
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
                  onChange={(e) => {
                    const nextM = parseInt(e.target.value, 10);
                    setSelectedMonth(nextM);
                    const nextWeeks = getWeeksForMonth(journalState.year, nextM);
                    if (selectedWeek > nextWeeks.length) {
                      setSelectedWeek(nextWeeks.length);
                    }
                  }}
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
                {weeksForSelectedMonth.map((wInfo) => (
                  <button
                    key={wInfo.weekIndex}
                    onClick={() => setSelectedWeek(wInfo.weekIndex)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      safeWeekIndex === wInfo.weekIndex ? primaryBg : pillLight
                    }`}
                    title={wInfo.dateRange}
                  >
                    W{wInfo.weekIndex} <span className="text-[10px] opacity-75 font-normal ml-0.5 hidden md:inline">({wInfo.shortLabel})</span>
                  </button>
                ))}
              </div>
              <span className="text-xs opacity-60 font-semibold hidden sm:inline">{selectedArea}</span>
            </div>

            {/* Weekly Schedule: 7 Full Days */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-6`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  {MONTH_NAMES[selectedMonth - 1]} • Week {safeWeekIndex} ({weeksForSelectedMonth.find((w) => w.weekIndex === safeWeekIndex)?.shortLabel || ""})
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
                                [safeWeekIndex]: updatedWeek,
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
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none resize-none font-sans min-h-[110px] leading-relaxed break-words whitespace-pre-wrap ${
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
                <textarea
                  rows={3}
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
                            [safeWeekIndex]: updatedWeek,
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
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-sans resize-none leading-relaxed break-words whitespace-pre-wrap ${
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
                  <textarea
                    rows={2}
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
                    className={`w-full p-3 rounded-xl border text-sm outline-none resize-none leading-relaxed break-words font-sans ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Grateful For
                  </label>
                  <textarea
                    rows={2}
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
                    className={`w-full p-3 rounded-xl border text-sm outline-none resize-none leading-relaxed break-words font-sans ${
                      isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 7: SETTINGS & PREFERENCES                               */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6 pb-12 animate-fadeIn">
            {/* Header / Intro Card */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${pillLight}`}>
                    Preferences &amp; Account
                  </span>
                  <span className="text-xs opacity-50">• {journalState.year} Edition</span>
                </div>
                <h2 className="font-serif font-bold text-2xl tracking-tight">Settings &amp; Appearance</h2>
                <p className="text-xs sm:text-sm opacity-70 mt-1 max-w-xl leading-relaxed">
                  Customize themes, manage your subscription status, configure email reminders, and maintain your cloud account.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setShowYearPicker(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${pillLight} hover:scale-105`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Year: {journalState.year}</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: MEMBERSHIP & SUBSCRIPTION STATUS */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user?.is_pro ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-amber-500/20 text-amber-500 border border-amber-500/40"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-snug">Membership &amp; Subscription</h3>
                    <p className="text-xs opacity-60">Manage your Pro access across web and mobile</p>
                  </div>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${user?.is_pro ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" : "bg-slate-500/15 text-slate-400 border-slate-500/30"}`}>
                  {user?.is_pro ? "★ Pro Active" : "Free Starter"}
                </span>
              </div>

              {user?.is_pro ? (
                /* Pro Member Status View */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>FRA Journal Pro Active</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Annual Plan
                          </span>
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-200/80 mt-1">
                          Billing Channel:{" "}
                          <strong>
                            {user.subscription?.platform === "paystack_web"
                              ? "Paystack Web Checkout"
                              : user.subscription?.platform === "apple_iap"
                              ? "Apple App Store (iOS)"
                              : user.subscription?.platform === "google_play"
                              ? "Google Play Store (Android)"
                              : "Cloud Subscription"}
                          </strong>
                        </p>
                        {user.subscription?.current_period_end && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-300 mt-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              Renews / Expires:{" "}
                              <strong>
                                {new Date(user.subscription.current_period_end).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchUserProfile(token)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Status</span>
                    </button>
                  </div>

                  {/* Active Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs opacity-90 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Unlimited AI Goal Cascading &amp; Decomposition</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-90 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Real-time multi-device cloud sync (Web + Mobile)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-90 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Scheduled weekly &amp; monthly email check-ins</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-90 p-2.5 rounded-lg border border-slate-200/40 dark:border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Printable annual keepsake export</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Free Starter Plan View with Paystack Web Checkout + Mobile Options */
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                    You are currently using the <strong>Free Starter Plan</strong>. Upgrade to <strong>FRA Journal Pro</strong> to unlock unlimited AI goal decomposition, automated email reminders, multi-device cloud synchronization, and printable annual keepsakes.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Paystack Web Checkout Card */}
                    <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-amber-500" />
                            Option 1: Web Checkout
                          </span>
                          <span className="text-xs font-extrabold text-amber-500 bg-amber-400/20 px-2 py-0.5 rounded">
                            ₦10,000 / yr
                          </span>
                        </div>
                        <h4 className="font-bold text-sm">Subscribe via Paystack</h4>
                        <p className="text-xs opacity-75 mt-1 leading-relaxed">
                          Instant card payment, bank transfer, or USSD checkout directly in your browser. Active on web and mobile instantly.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={paystackLoading}
                        onClick={handlePaystackCheckout}
                        className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 text-emerald-950 hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {paystackLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                            <span>Connecting to Paystack...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-950" />
                            <span>Pay ₦10,000 with Paystack</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Mobile App Subscription Card */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold opacity-80 uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-slate-400" />
                            Option 2: Mobile In-App
                          </span>
                          <span className="text-xs font-extrabold opacity-90 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                            $6.99 / yr
                          </span>
                        </div>
                        <h4 className="font-bold text-sm">Subscribe via App Store</h4>
                        <p className="text-xs opacity-75 mt-1 leading-relaxed">
                          Subscribe inside the <strong>FRA E-Journal</strong> app on Apple App Store or Google Play. Log in with the same email (<strong>{user?.email}</strong>) on web and your Pro status unlocks here automatically.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fetchUserProfile(token)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${pillLight}`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Check Subscribed Status</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: APPEARANCE & VISUAL THEMES */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-4`}>
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-500">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base leading-snug">App Appearance &amp; Theme</h3>
                  <p className="text-xs opacity-60">Choose an aesthetic that matches your journaling mood</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Theme 1: Warm Linen */}
                <div
                  onClick={() => handleThemeChange("linen")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                    themeMode === "linen"
                      ? "border-amber-500 bg-amber-500/5 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-amber-500/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-sm">Warm Linen Elegance</h4>
                      </div>
                      {themeMode === "linen" && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75 leading-relaxed">
                      Warm parchment tones, classic editorial serif typography, and soft gold accents. Ideal for daytime journaling.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] uppercase font-bold opacity-60">Palette:</span>
                    <div className="w-5 h-5 rounded-md border border-slate-300" style={{ backgroundColor: "#FAF6F0" }} title="#FAF6F0" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#7A283C" }} title="#7A283C" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#C5A880" }} title="#C5A880" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#2B1C22" }} title="#2B1C22" />
                  </div>
                </div>

                {/* Theme 2: Midnight Obsidian */}
                <div
                  onClick={() => handleThemeChange("dark")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                    themeMode === "dark"
                      ? "border-amber-400 bg-amber-400/5 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-amber-400/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm">Midnight Obsidian</h4>
                      </div>
                      {themeMode === "dark" && (
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75 leading-relaxed">
                      Deep obsidian dark surfaces with soft contrast and gold accents. Calm, distraction-free night focus.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] uppercase font-bold opacity-60">Palette:</span>
                    <div className="w-5 h-5 rounded-md border border-slate-700" style={{ backgroundColor: "#121216" }} title="#121216" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#1C1C24" }} title="#1C1C24" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#E5B8C2" }} title="#E5B8C2" />
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: "#F4F0E8" }} title="#F4F0E8" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: EMAIL CADENCE & REMINDERS */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-snug">Cadence &amp; Email Reminders</h3>
                    <p className="text-xs opacity-60">Automated check-ins delivered directly to your inbox</p>
                  </div>
                </div>
                {!user?.is_pro && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    ★ Pro Feature
                  </span>
                )}
              </div>

              {reminderMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{reminderMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">
                    Cadence Frequency
                  </label>
                  <select
                    value={reminderFreq}
                    onChange={(e) => setReminderFreq(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${cardBg}`}
                  >
                    <option value="disabled">Disabled</option>
                    <option value="weekly">Weekly Check-in</option>
                    <option value="monthly">Monthly Review</option>
                    <option value="daily">Daily Reflection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">
                    Day of the Week
                  </label>
                  <select
                    disabled={reminderFreq === "disabled" || reminderFreq === "daily"}
                    value={reminderDay}
                    onChange={(e) => setReminderDay(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${cardBg} disabled:opacity-40`}
                  >
                    <option value="Monday">Monday (Start of Week)</option>
                    <option value="Sunday">Sunday (Planning Cadence)</option>
                    <option value="Friday">Friday (Wrap-up)</option>
                    <option value="Wednesday">Wednesday (Mid-week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">
                    Delivery Time (UTC+1)
                  </label>
                  <input
                    type="time"
                    disabled={reminderFreq === "disabled"}
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${cardBg} disabled:opacity-40`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-70">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={reminderEmail || user?.email || ""}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${cardBg}`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={reminderLoading}
                  onClick={() => handleSaveReminders(false)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm ${primaryBg}`}
                >
                  {reminderLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Reminder Preferences</span>
                </button>

                <button
                  type="button"
                  disabled={reminderLoading || reminderFreq === "disabled"}
                  onClick={() => handleSaveReminders(true)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${pillLight} disabled:opacity-40`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email Now</span>
                </button>
              </div>
            </div>

            {/* SECTION 4: CLOUD ACCOUNT & SYNC */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-snug">User Profile &amp; Cloud Sync</h3>
                    <p className="text-xs opacity-60">Connected account and data backup status</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === "synced" ? "bg-emerald-400" : syncStatus === "saving" ? "bg-amber-400 animate-pulse" : "bg-slate-400"}`} />
                  <span className="text-xs font-semibold capitalize opacity-80">{syncStatus}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 border border-amber-400/30 flex items-center justify-center font-bold text-base font-serif">
                    {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : "ME"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-snug">{user?.full_name || "Journal User"}</h4>
                    <p className="text-xs opacity-70">{user?.email}</p>
                    <div className="mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${pillLight}`}>
                        ★ {user?.membership_tag || (user?.is_kws_member ? "Kingdom Wealth Summit Member" : "FRA Journal Member")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => triggerSave(journalState)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${pillLight}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync to Cloud</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 5: DATA MANAGEMENT & DANGER ZONE */}
            <div className={`p-6 rounded-2xl border border-red-500/20 shadow-sm space-y-4 ${cardBg}`}>
              <div className="flex items-center gap-2.5 pb-3 border-b border-red-500/20 text-red-400">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-serif font-bold text-base leading-snug text-red-500">
                    Data Management &amp; Danger Zone
                  </h3>
                  <p className="text-xs opacity-70">Actions that modify or reset your journal state</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 gap-3">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider">Reset Current Year Data</h4>
                    <p className="text-xs opacity-70 mt-0.5">
                      Clear all goals, milestones, reflections, and weekly plans for {journalState.year} back to template defaults. Other years will remain intact.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset {journalState.year} Goals</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-red-500/30 bg-red-500/5 gap-3">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-red-500">
                      Permanently Delete Account &amp; All Cloud Data
                    </h4>
                    <p className="text-xs opacity-70 mt-0.5">
                      Irreversibly delete your account, authentication credentials, and all multi-year journals stored on our servers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                  </button>
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
                {!user?.is_pro && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-500 border border-amber-400/40">
                    ★ PRO
                  </span>
                )}
              </div>
              <button onClick={() => setShowReminderModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {!user?.is_pro && (
                <div className="p-3 rounded-xl border border-amber-400/40 bg-amber-400/10 text-xs flex items-start gap-2.5">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-500">FRA Journal Pro Feature</div>
                    <p className="text-[11px] opacity-80 leading-relaxed mt-0.5">
                      Scheduled automated check-ins require an active FRA Journal Pro subscription. Subscribe in the mobile app and log in here with the same email.
                    </p>
                  </div>
                </div>
              )}

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
                {!user?.is_pro ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowReminderModal(false);
                      setProFeatureContext("reminders");
                      setShowProModal(true);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${primaryBg}`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Unlock Reminders with Pro</span>
                  </button>
                ) : (
                  <>
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
                  </>
                )}
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
              {!user?.is_pro && (
                <div className="p-3.5 rounded-xl border border-amber-400/40 bg-amber-400/10 flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-500">
                      FRA Journal Pro Feature
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      AI Goal Decomposition requires an active FRA Journal Pro subscription. Subscribe in the mobile app and log in here with the same email to unlock Pro.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAiModal(false);
                        setProFeatureContext("ai");
                        setShowProModal(true);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                    >
                      <span>Unlock with Pro</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

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
                  {user?.is_pro ? "AI Ready" : "Pro Only"}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                disabled={aiLoading || !aiGoalText.trim() || !user?.is_pro}
                onClick={handleRunDecomposition}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
                  !user?.is_pro
                    ? "opacity-60 cursor-not-allowed bg-slate-500/20 text-slate-400 border border-slate-500/30"
                    : primaryBg
                }`}
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {!user?.is_pro
                    ? "Locked — Upgrade to Pro to Decompose"
                    : aiLoading
                    ? "Generating Intelligent Breakdown..."
                    : "Decompose Goal into Quarters, Months & Weeks"}
                </span>
              </button>

              {/* Generated Breakdown Preview */}
              {decomposedPreview && (
                <div className="mt-4 p-4 rounded-xl border border-amber-400/40 bg-amber-400/5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
                    <span className="font-serif font-bold text-sm text-amber-500">
                      Generated Plan Preview
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

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full calendar coverage: 4 Quarters, 12 Months, and exact Weekly Schedules (4 or 5 weeks per month matching the calendar)</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleApplyDecomposition}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Breakdown to My E-Journal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD CUSTOM GOAL                                        */}
      {/* ------------------------------------------------------------- */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Add Custom Goal</h3>
              </div>
              <button onClick={() => setShowAddGoalModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {addGoalError && (
                <div className="p-3 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/40 text-red-500">
                  {addGoalError}
                </div>
              )}

              {/* Goal Title / Area Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Goal / Life Area Name
                </label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => {
                    setNewGoalName(e.target.value);
                    if (addGoalError) setAddGoalError("");
                  }}
                  placeholder="e.g. Creative Project, Parenting, Real Estate"
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Quick Template Suggestions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-60">
                  Popular Suggestions:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_CUSTOM_GOALS.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setNewGoalName(s.name);
                        if (!newGoalText) setNewGoalText(s.placeholder);
                        if (addGoalError) setAddGoalError("");
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        newGoalName === s.name ? primaryBg : pillLight
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Statement */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Annual Goal Statement
                </label>
                <textarea
                  rows={2}
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="What is your primary milestone or outcome for this year?"
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none font-sans resize-none ${
                    isDark ? "bg-[#15151C] border-[#2E2E3A]" : "bg-[#FAF8F5] border-[#E8DFD8]"
                  }`}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Initial Priority
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { p: 1, label: "1 - High Priority" },
                    { p: 2, label: "2 - Medium Focus" },
                    { p: 3, label: "3 - Standard" },
                  ].map((item) => (
                    <button
                      key={item.p}
                      type="button"
                      onClick={() => setNewGoalPriority(item.p as any)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        newGoalPriority === item.p ? primaryBg : pillLight
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${pillLight}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomGoal}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${primaryBg}`}
                >
                  Create Goal &amp; Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE GOAL CONFIRMATION                               */}
      {/* ------------------------------------------------------------- */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg">Delete Goal &amp; All Plans?</h3>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-sm opacity-90 leading-relaxed">
                Are you sure you want to delete <strong className="text-red-500">"{goalToDelete}"</strong>?
              </p>
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400 space-y-1">
                <div className="font-bold">⚠️ Cascading Deletion Warning:</div>
                <p>
                  This action will permanently remove this goal along with its 4 quarterly roadmaps, 12 monthly reviews, and all weekly/daily action items.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGoalToDelete(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${pillLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGoal}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Goal Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PERMANENT ACCOUNT DELETION                             */}
      {/* ------------------------------------------------------------- */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-red-500">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Delete Account &amp; All Data?</h3>
              </div>
              <button onClick={() => setShowDeleteAccountModal(false)} className="p-1 opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {deleteAccountError && (
                <div className="p-3 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/40 text-red-500">
                  {deleteAccountError}
                </div>
              )}

              <p className="text-sm opacity-90 leading-relaxed">
                This will permanently delete your account (<strong>{user?.email}</strong>) and erase:
              </p>

              <ul className="text-xs space-y-1.5 opacity-80 list-disc list-inside">
                <li>Your user profile and credentials</li>
                <li>All annual goals and 4-quarter milestones</li>
                <li>All 12 monthly reviews and reflection logs</li>
                <li>All weekly planners and daily action checklists</li>
                <li>All automated email reminder preferences</li>
              </ul>

              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400 font-semibold">
                ⚠️ This action cannot be undone. All cloud data will be immediately and irreversibly purged from our servers.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={deleteAccountLoading}
                onClick={() => setShowDeleteAccountModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${pillLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteAccountLoading}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {deleteAccountLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Account Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: RESET JOURNAL DATA CONFIRMATION                        */}
      {/* ------------------------------------------------------------- */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-amber-500">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Reset {journalState.year} Journal Goals?
                </h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1 opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-sm opacity-90 leading-relaxed">
                Are you sure you want to reset all your goals, milestones, reflections, and weekly plans for <strong className="text-amber-500">{journalState.year}</strong>?
              </p>
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400 space-y-1">
                <div className="font-bold">⚠️ Fresh Start Notice:</div>
                <p>
                  This will restore the standard 8 life areas to empty templates for {journalState.year}. Other journal years in your multi-year archive will remain safe.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={resetLoading}
                onClick={() => setShowResetModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${pillLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetLoading}
                onClick={handleResetJournal}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {resetLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                <span>Reset {journalState.year} Goals</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PRO SUBSCRIPTION / UPGRADE EXPLANATION                 */}
      {/* ------------------------------------------------------------- */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade">
          <div className={`w-full max-w-lg p-6 sm:p-7 rounded-2xl border shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-500">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">
                    FRA Journal Pro
                  </h3>
                  <p className="text-[11px] opacity-60">
                    {proFeatureContext === "ai"
                      ? "AI Goal Decomposition is a Pro Feature"
                      : proFeatureContext === "sync"
                      ? "Cross-Device Cloud Sync is a Pro Feature"
                      : proFeatureContext === "reminders"
                      ? "Email Reminders are a Pro Feature"
                      : "Elevate your intentional living experience"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProModal(false)}
                className="p-1.5 opacity-60 hover:opacity-100 rounded-full transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Feature Highlights */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-500">
                      AI Goal Cascading &amp; Decomposition
                    </div>
                    <div className="text-[11px] opacity-75 leading-relaxed">
                      Transform high-level yearly visions into 4 quarterly milestones, 12 monthly objectives, and calendar-synced weekly habits with one click.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-400/5 border border-blue-400/20">
                  <Cloud className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-blue-400">
                      Cross-Device Real-Time Cloud Sync
                    </div>
                    <div className="text-[11px] opacity-75 leading-relaxed">
                      Instant synchronization across iOS, Android, and Web browsers. Never lose a thought or goal.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-400/5 border border-purple-400/20">
                  <Bell className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-purple-400">
                      Automated Email Check-Ins &amp; Cadence
                    </div>
                    <div className="text-[11px] opacity-75 leading-relaxed">
                      Scheduled weekly planning and monthly review prompts delivered directly to your inbox to keep momentum high.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/20">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-400">
                      Multi-Year Rolling Archive &amp; Export
                    </div>
                    <div className="text-[11px] opacity-75 leading-relaxed">
                      Preserve every year’s achievements and reflections with unlimited multi-year tracking and future planning.
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Unlock Pro */}
              <div className="p-4 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Unlock FRA Journal Pro (Annual Access)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Works on Web + Mobile
                  </span>
                </div>

                {paystackError && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
                    {paystackError}
                  </div>
                )}

                {/* Option 1: Instant Web Checkout with Paystack */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 dark:bg-black/40 border border-amber-400/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Instant Web Checkout (Paystack)</span>
                      </div>
                      <p className="text-[11px] opacity-75 mt-0.5">
                        Pay with Card, Bank Transfer, USSD, or Apple Pay.
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-amber-400 whitespace-nowrap">
                      ₦10,000 <span className="text-[10px] font-normal opacity-70">/yr</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={paystackLoading}
                    onClick={handlePaystackCheckout}
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 text-emerald-950 hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {paystackLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                        <span>Connecting to Paystack...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-emerald-950" />
                        <span>Subscribe on Web with Paystack (₦10,000)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Option 2: Mobile App In-App Purchase */}
                <div className="pt-1 text-xs opacity-85 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-slate-200">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Or Subscribe on Mobile App ($6.99/year)</span>
                  </div>
                  <p className="text-[11px] opacity-75 leading-relaxed pl-5">
                    Subscribe inside the <strong>FRA E-Journal</strong> app on Google Play or App Store. Log in with the exact same email address on web, and your Pro version unlocks here automatically!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              {!token ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowProModal(false);
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${primaryBg}`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In with Your Account</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowProModal(false);
                    handleLogout();
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${pillLight}`}
                >
                  <span>Switch Account / Re-login</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowProModal(false)}
                className={`w-full ${!token ? "sm:w-32" : ""} py-2.5 rounded-xl text-xs font-bold border ${pillLight} hover:opacity-80 transition-opacity`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
