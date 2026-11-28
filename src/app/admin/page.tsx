"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  Users,
  MapPin,
  Globe,
  Search,
  Download,
  RefreshCw,
  ArrowLeft,
  Lock,
  KeyRound,
  LogOut,
  AlertCircle,
  BookOpen,
  Target,
  Calendar,
  Mail,
  CheckCircle2,
  Eye,
  Send,
  X,
  ExternalLink,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { formatUtcPlus1Time } from "@/lib/dateUtils";
import type { AdminJournalMember, JournalAdminStats } from "@/lib/adminJournal";

interface Registration {
  id: number;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  occupation: string;
  city_country: string;
  attendance_type: string;
  expectations: string;
  created_at: string;
  attended?: number | boolean;
  checked_in_at?: string | null;
  checkin_method?: string | null;
}

interface Stats {
  total: number;
  inPerson: number;
  virtual: number;
  attended?: number;
  pending?: number;
  inPersonAttended?: number;
  virtualAttended?: number;
  attendanceRate?: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Section
  const [adminSection, setAdminSection] = useState<"registrations" | "journal">("registrations");

  // Summit Registrations State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, inPerson: 0, virtual: 0, attended: 0, pending: 0, attendanceRate: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");

  // Journal Goals & Follow-Up State
  const [journalMembers, setJournalMembers] = useState<AdminJournalMember[]>([]);
  const [journalStats, setJournalStats] = useState<JournalAdminStats>({
    totalUsers: 0,
    usersWithGoals: 0,
    usersWithReminders: 0,
  });
  const [journalLoading, setJournalLoading] = useState(false);
  const [journalYear, setJournalYear] = useState<number>(new Date().getFullYear());
  const [journalSearch, setJournalSearch] = useState("");
  const [journalFilter, setJournalFilter] = useState<string>("all");

  // Inspection & Follow-Up Modals State
  const [inspectMember, setInspectMember] = useState<AdminJournalMember | null>(null);
  const [followupMember, setFollowupMember] = useState<AdminJournalMember | null>(null);
  const [followupSubject, setFollowupSubject] = useState("");
  const [followupMessage, setFollowupMessage] = useState("");
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupStatus, setFollowupStatus] = useState<string | null>(null);

  // 1. Fetch Summit Registrations
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (filterType !== "all") query.set("type", filterType);
      if (attendanceFilter !== "all") query.set("attendance", attendanceFilter);

      const res = await fetch(`/api/admin/registrations?${query.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setStats(data.stats || { total: 0, inPerson: 0, virtual: 0, attended: 0, pending: 0, attendanceRate: 0 });
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Failed to fetch admin registrations", err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType, attendanceFilter]);

  // 2. Fetch Journal Goals
  const fetchJournalGoals = useCallback(async () => {
    setJournalLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("year", journalYear.toString());
      if (journalSearch) query.set("search", journalSearch);
      if (journalFilter !== "all") query.set("filter", journalFilter);

      const res = await fetch(`/api/admin/journal-goals?${query.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setJournalMembers(data.members || []);
        setJournalStats(data.stats || { totalUsers: 0, usersWithGoals: 0, usersWithReminders: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch journal goals", err);
    } finally {
      setJournalLoading(false);
    }
  }, [journalYear, journalSearch, journalFilter]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    if (isAuthenticated && adminSection === "journal") {
      fetchJournalGoals();
    }
  }, [isAuthenticated, adminSection, fetchJournalGoals]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect admin passcode");
      }

      setIsAuthenticated(true);
      setPasscode("");
      fetchRegistrations();
      fetchJournalGoals();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Failed to authenticate.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } catch (err) {
      console.error("Failed to log out", err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const handleExportRegistrationsCSV = () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (filterType !== "all") query.set("type", filterType);
    if (attendanceFilter !== "all") query.set("attendance", attendanceFilter);
    query.set("export", "csv");
    window.open(`/api/admin/registrations?${query.toString()}`, "_blank");
  };

  const handleToggleAttendance = async (id: number, currentAttended: boolean) => {
    try {
      const res = await fetch("/api/admin/attendance/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, attended: !currentAttended }),
      });
      if (res.ok) {
        fetchRegistrations();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to toggle attendance");
      }
    } catch (err) {
      console.error("Failed to toggle attendance:", err);
    }
  };

  const handleExportJournalCSV = () => {
    const query = new URLSearchParams();
    query.set("year", journalYear.toString());
    if (journalSearch) query.set("search", journalSearch);
    if (journalFilter !== "all") query.set("filter", journalFilter);
    query.set("export", "csv");
    window.open(`/api/admin/journal-goals?${query.toString()}`, "_blank");
  };

  // Open Follow-Up Modal with pre-filled template
  const handleOpenFollowUp = (member: AdminJournalMember, template?: "encouragement" | "kickstart") => {
    setFollowupMember(member);
    setFollowupStatus(null);

    if (template === "kickstart" || !member.has_goals) {
      setFollowupSubject(`Checking in on your ${journalYear} E-Journal Goals | Kingdom Wealth Summit`);
      setFollowupMessage(
        `Hi ${member.full_name},\n\nWe noticed you recently created your account on the Reflective E-Journal, but haven't written down your yearly focus areas yet.\n\nSetting clear, intentional goals across your spiritual life, career, finances, and personal growth is the foundation for lasting kingdom wealth. Have you had a chance to reflect on what you want to achieve this year?\n\nTake 10 minutes today to log in and write down your top 3 goals—our smart AI assistant can even help you break them down into quarterly milestones and weekly habits!\n\nCheering you on,\nThe Kingdom Wealth Summit Team`
      );
    } else {
      const topGoal = member.top_three_goals[0]?.text || "your annual goals";
      setFollowupSubject(`Great momentum on your ${journalYear} E-Journal Goals! | Kingdom Wealth Summit`);
      setFollowupMessage(
        `Hi ${member.full_name},\n\nI was reviewing our members' E-Journals and wanted to personally commend you on setting your goals for ${journalYear}, especially your focus on "${topGoal}".\n\nHow is progress going so far this month? Remember that consistency in daily small habits is what turns yearly vision into physical reality.\n\nIf you need any guidance or support with your milestones, feel free to reply directly to this email.\n\nRooting for your continuous success,\nThe Kingdom Wealth Summit Team`
      );
    }
  };

  const handleSendFollowUpEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupMember) return;

    setFollowupLoading(true);
    setFollowupStatus(null);

    try {
      const res = await fetch("/api/admin/journal-goals/send-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: followupMember.id,
          subject: followupSubject,
          message: followupMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send follow-up email");
      }

      setFollowupStatus(data.message || `Email sent successfully to ${followupMember.email}!`);
      setTimeout(() => {
        setFollowupMember(null);
        setFollowupStatus(null);
      }, 2500);
    } catch (err: any) {
      setFollowupStatus(`Error: ${err.message || "Failed to dispatch email"}`);
    } finally {
      setFollowupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* LOGIN GATE IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-12 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto shadow-xl shadow-amber-400/10">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Admin Portal Gated
                </h1>
                <p className="text-xs text-emerald-200">
                  Finish Rich Africa | Kingdom Wealth Summit
                </p>
              </div>

              <div className="bg-emerald-900/70 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                      Enter Admin Passcode
                    </label>
                    <div className="relative">
                      <KeyRound className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-xs uppercase text-emerald-950 bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loginLoading ? (
                      <span>Verifying Passcode...</span>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Unlock Admin Portal</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-8 animate-fadeIn">
              {/* Top Navigation & App Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800 pb-6">
                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-emerald-300 hover:text-amber-300 transition-colors mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Public Site</span>
                  </Link>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                    <Shield className="w-7 h-7 text-amber-400" />
                    <span>KWS Admin Portal</span>
                  </h1>
                  <p className="text-xs text-emerald-200 mt-1">
                    Finish Rich Africa | Registrations, E-Journal Goals &amp; Member Follow-Up
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={adminSection === "registrations" ? fetchRegistrations : fetchJournalGoals}
                    className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${(loading || journalLoading) ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    onClick={adminSection === "registrations" ? handleExportRegistrationsCSV : handleExportJournalCSV}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-950 bg-linear-to-r from-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-emerald-950 border border-red-500/30 hover:border-red-500/60 transition-colors"
                    title="Lock / Logout Admin Portal"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>

              {/* Section Tabs Switcher */}
              <div className="flex border-b border-emerald-800 gap-2">
                <button
                  onClick={() => setAdminSection("registrations")}
                  className={`flex items-center gap-2 px-5 py-3 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    adminSection === "registrations"
                      ? "bg-emerald-900 border-amber-400 text-amber-300"
                      : "border-transparent text-emerald-300 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Summit Registrations ({stats.total})</span>
                </button>

                <button
                  onClick={() => setAdminSection("journal")}
                  className={`flex items-center gap-2 px-5 py-3 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                    adminSection === "journal"
                      ? "bg-emerald-900 border-amber-400 text-amber-300"
                      : "border-transparent text-emerald-300 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>E-Journal Member Goals ({journalStats.totalUsers})</span>
                </button>
              </div>

              {/* ========================================================================= */}
              {/* VIEW 1: SUMMIT REGISTRATIONS                                              */}
              {/* ========================================================================= */}
              {adminSection === "registrations" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>Total Registered</span>
                        <Users className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-3xl font-black text-white">{stats.total}</p>
                      <p className="text-[11px] text-emerald-200">All registered attendees</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>In-Person</span>
                        <MapPin className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-3xl font-black text-amber-300">{stats.inPerson}</p>
                      <p className="text-[11px] text-emerald-200">
                        {stats.inPersonAttended !== undefined ? `${stats.inPersonAttended} checked in` : "Ikeja, Lagos"}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>Virtual Streamers</span>
                        <Globe className="w-4 h-4 text-emerald-300" />
                      </div>
                      <p className="text-3xl font-black text-emerald-300">{stats.virtual}</p>
                      <p className="text-[11px] text-emerald-200">
                        {stats.virtualAttended !== undefined ? `${stats.virtualAttended} checked in` : "Online Stream"}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-700/80 space-y-2 ring-1 ring-emerald-500/30">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>Checked In</span>
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-black text-emerald-400">
                        {stats.attended ?? 0}{" "}
                        <span className="text-sm font-semibold text-emerald-300">
                          ({stats.attendanceRate ?? 0}%)
                        </span>
                      </p>
                      <p className="text-[11px] text-emerald-200">
                        {stats.pending ?? 0} pending arrival
                      </p>
                    </div>
                  </div>

                  {/* Controls Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-emerald-900/80 p-4 rounded-2xl border border-emerald-800">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by name, email, phone, code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-200 font-bold">Type:</span>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="bg-emerald-950 border border-emerald-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                        >
                          <option value="all">All Modes</option>
                          <option value="in-person">In-Person Only</option>
                          <option value="virtual">Virtual Only</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-200 font-bold">Status:</span>
                        <select
                          value={attendanceFilter}
                          onChange={(e) => setAttendanceFilter(e.target.value)}
                          className="bg-emerald-950 border border-emerald-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                        >
                          <option value="all">All Status</option>
                          <option value="attended">Checked In (Attended)</option>
                          <option value="pending">Pending Check-In</option>
                        </select>
                      </div>

                      <Link
                        href="/attendance"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Open Check-In Desk</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                      </Link>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="bg-emerald-900/80 border border-emerald-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-emerald-100">
                        <thead className="bg-emerald-950 text-emerald-300 uppercase font-bold border-b border-emerald-800">
                          <tr>
                            <th className="py-3.5 px-4">Ref Code</th>
                            <th className="py-3.5 px-4">Full Name</th>
                            <th className="py-3.5 px-4">Contact Info</th>
                            <th className="py-3.5 px-4">Mode</th>
                            <th className="py-3.5 px-4">Attendance Status</th>
                            <th className="py-3.5 px-4">Check-In Action</th>
                            <th className="py-3.5 px-4">Date Registered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-800/60">
                          {loading ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-emerald-400">
                                <div className="inline-flex items-center gap-2">
                                  <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                  <span>Loading registrations...</span>
                                </div>
                              </td>
                            </tr>
                          ) : registrations.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-emerald-400">
                                No registrations found in database.
                              </td>
                            </tr>
                          ) : (
                            registrations.map((reg) => (
                              <tr key={reg.id} className="hover:bg-emerald-800/40 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                                  {reg.reference_code}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-white">
                                  <div>{reg.full_name}</div>
                                  <div className="text-[11px] text-emerald-400 font-normal">{reg.occupation || reg.city_country || ""}</div>
                                </td>
                                <td className="py-3.5 px-4 space-y-0.5">
                                  <div className="text-emerald-100">{reg.email}</div>
                                  <div className="text-emerald-400 text-[11px]">{reg.phone}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                      reg.attendance_type === "in-person"
                                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                        : "bg-emerald-950 text-emerald-200 border border-emerald-700"
                                    }`}
                                  >
                                    {reg.attendance_type === "in-person" ? "In-Person" : "Virtual"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  {Boolean(reg.attended) ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        Checked In
                                      </span>
                                      {reg.checked_in_at && (
                                        <p className="text-[10px] text-emerald-300">
                                          {formatUtcPlus1Time(reg.checked_in_at)} ({reg.checkin_method || "self"})
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <button
                                    onClick={() => handleToggleAttendance(reg.id, Boolean(reg.attended))}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                      Boolean(reg.attended)
                                        ? "bg-emerald-950/80 text-emerald-300 hover:text-red-300 border border-emerald-800 hover:border-red-500/40"
                                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                                    }`}
                                    title={Boolean(reg.attended) ? "Click to undo check-in" : "Mark as checked in"}
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>{Boolean(reg.attended) ? "Undo" : "Mark Present"}</span>
                                  </button>
                                </td>
                                <td className="py-3.5 px-4 text-emerald-300 whitespace-nowrap">
                                  {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : "N/A"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2: E-JOURNAL GOALS & MEMBER FOLLOW-UP                                */}
              {/* ========================================================================= */}
              {adminSection === "journal" && (
                <div className="space-y-6">
                  {/* Journal Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>E-Journal Users</span>
                        <BookOpen className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-3xl font-black text-white">{journalStats.totalUsers}</p>
                      <p className="text-[11px] text-emerald-200">Registered journal accounts in Turso</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>Active Goal Setters</span>
                        <Target className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-black text-emerald-300">
                        {journalStats.usersWithGoals}{" "}
                        <span className="text-xs font-semibold text-emerald-200">
                          ({journalStats.totalUsers > 0 ? Math.round((journalStats.usersWithGoals / journalStats.totalUsers) * 100) : 0}%)
                        </span>
                      </p>
                      <p className="text-[11px] text-emerald-200">Members with goals set for {journalYear}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                        <span>Email Reminders Active</span>
                        <Mail className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-3xl font-black text-amber-300">{journalStats.usersWithReminders}</p>
                      <p className="text-[11px] text-emerald-200">Scheduled automated check-ins</p>
                    </div>
                  </div>

                  {/* Journal Controls Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-emerald-900/80 p-4 rounded-2xl border border-emerald-800">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search member name or email..."
                        value={journalSearch}
                        onChange={(e) => setJournalSearch(e.target.value)}
                        className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-emerald-200 font-bold">Year:</span>
                        <select
                          value={journalYear}
                          onChange={(e) => setJournalYear(parseInt(e.target.value, 10))}
                          className="bg-emerald-950 border border-emerald-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                        >
                          {[2025, 2026, 2027, 2028].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-emerald-200 font-bold">Filter:</span>
                        <select
                          value={journalFilter}
                          onChange={(e) => setJournalFilter(e.target.value)}
                          className="bg-emerald-950 border border-emerald-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                        >
                          <option value="all">All Members</option>
                          <option value="with-goals">Has Set Goals</option>
                          <option value="no-goals">Needs Follow-Up (No Goals Yet)</option>
                          <option value="reminders-active">Reminders Active</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Member Goals Table */}
                  <div className="bg-emerald-900/80 border border-emerald-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-emerald-100">
                        <thead className="bg-emerald-950 text-emerald-300 uppercase font-bold border-b border-emerald-800">
                          <tr>
                            <th className="py-3.5 px-4">Member Name &amp; Email</th>
                            <th className="py-3.5 px-4">Goal Status</th>
                            <th className="py-3.5 px-4">All Goals Set ({journalYear})</th>
                            <th className="py-3.5 px-4">Reminders</th>
                            <th className="py-3.5 px-4">Last Activity</th>
                            <th className="py-3.5 px-4 text-right">Follow-Up Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-800/60">
                          {journalLoading ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-emerald-400">
                                <div className="inline-flex items-center gap-2">
                                  <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                  <span>Loading members and goals...</span>
                                </div>
                              </td>
                            </tr>
                          ) : journalMembers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-emerald-400">
                                No journal members match the selected filter.
                              </td>
                            </tr>
                          ) : (
                            journalMembers.map((member) => (
                              <tr key={member.id} className="hover:bg-emerald-800/40 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-white text-sm flex items-center gap-1.5 flex-wrap">
                                    <span>{member.full_name}</span>
                                    {member.is_kws_attendee ? (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                        ★ KWS Attendee
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-700/50 text-emerald-200 border border-emerald-600/50">
                                        E-Journal User
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-emerald-300 text-xs font-mono">{member.email}</div>
                                  <div className="text-[10px] text-emerald-400 mt-0.5">
                                    Joined {new Date(member.created_at).toLocaleDateString()}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  {member.has_goals ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>{member.total_goals_count} Goals Set</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>No Goals Set Yet</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 max-w-lg">
                                  {member.all_goals && member.all_goals.length > 0 ? (
                                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                      {member.all_goals.map((g, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 text-xs">
                                          <span
                                            className={`shrink-0 px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase border ${
                                              g.isTopThree
                                                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                                                : "bg-emerald-950 text-emerald-300 border-emerald-700/60"
                                            }`}
                                          >
                                            {g.isTopThree ? "★ " : ""}
                                            {g.area}
                                          </span>
                                          <span className="text-emerald-100 leading-snug break-words">
                                            {g.text}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : member.top_three_goals && member.top_three_goals.length > 0 ? (
                                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                      {member.top_three_goals.map((g, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 text-xs">
                                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                            ★ {g.area}
                                          </span>
                                          <span className="text-emerald-100 leading-snug break-words">{g.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-emerald-500 italic text-[11px]">
                                      No yearly goals defined
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        member.reminder_frequency !== "disabled"
                                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                      }`}
                                    >
                                      {member.reminder_frequency}
                                    </span>
                                    {member.reminder_day && (
                                      <div className="text-[10px] text-emerald-300">
                                        On {member.reminder_day}s
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-emerald-300 whitespace-nowrap">
                                  {member.entry_updated_at
                                    ? new Date(member.entry_updated_at).toLocaleDateString()
                                    : "Never"}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => setInspectMember(member)}
                                      className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 transition-colors"
                                      title="Inspect All Goals & Milestones"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleOpenFollowUp(member)}
                                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] text-emerald-950 bg-amber-400 hover:bg-yellow-300 transition-all shadow"
                                      title="Send Follow-Up / Encouragement Email"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      <span>Follow Up</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: INSPECT MEMBER GOALS                                             */}
      {/* ========================================================================= */}
      {inspectMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-emerald-900 border border-emerald-700 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Member Journal Dossier ({journalYear})
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>{inspectMember.full_name}</span>
                </h3>
                <div className="text-xs text-emerald-300 font-mono">{inspectMember.email}</div>
              </div>
              <button
                onClick={() => setInspectMember(null)}
                className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {inspectMember.all_goals.length === 0 ? (
                <div className="text-center py-12 text-emerald-300 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="font-semibold text-sm">
                    {inspectMember.full_name} has not set any goals yet for {journalYear}.
                  </p>
                  <button
                    onClick={() => {
                      const m = inspectMember;
                      setInspectMember(null);
                      handleOpenFollowUp(m, "kickstart");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-emerald-950 hover:bg-yellow-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Kickstart Encouragement</span>
                  </button>
                </div>
              ) : (
                inspectMember.all_goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {goal.area}
                        </span>
                        {goal.isCustom && (
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                            Custom Area
                          </span>
                        )}
                      </div>
                      {goal.isTopThree && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          ★ Top 3 Focus
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-white">{goal.text}</p>

                    {goal.whyItMatters && (
                      <div className="text-xs text-emerald-200">
                        <strong className="text-emerald-400">Why it matters:</strong> {goal.whyItMatters}
                      </div>
                    )}

                    {goal.supportNeeded && (
                      <div className="text-xs text-emerald-200">
                        <strong className="text-emerald-400">Support needed:</strong> {goal.supportNeeded}
                      </div>
                    )}

                    {goal.milestones && (goal.milestones.q1 || goal.milestones.q2 || goal.milestones.q3 || goal.milestones.q4) && (
                      <div className="pt-2 border-t border-emerald-900 grid grid-cols-2 gap-2 text-[11px]">
                        {goal.milestones.q1 && (
                          <div className="p-2 rounded-lg bg-emerald-900/60">
                            <span className="font-bold text-amber-300">Q1 Milestone:</span> {goal.milestones.q1}
                          </div>
                        )}
                        {goal.milestones.q2 && (
                          <div className="p-2 rounded-lg bg-emerald-900/60">
                            <span className="font-bold text-amber-300">Q2 Milestone:</span> {goal.milestones.q2}
                          </div>
                        )}
                        {goal.milestones.q3 && (
                          <div className="p-2 rounded-lg bg-emerald-900/60">
                            <span className="font-bold text-amber-300">Q3 Milestone:</span> {goal.milestones.q3}
                          </div>
                        )}
                        {goal.milestones.q4 && (
                          <div className="p-2 rounded-lg bg-emerald-900/60">
                            <span className="font-bold text-amber-300">Q4 Milestone:</span> {goal.milestones.q4}
                          </div>
                        )}
                      </div>
                    )}

                    {goal.quarterlyTargets && Object.keys(goal.quarterlyTargets).length > 0 && (
                      <div className="pt-2 border-t border-emerald-900 space-y-1.5">
                        <div className="text-[10.5px] font-bold uppercase tracking-wider text-amber-300">
                          Quarterly Targets (Month 1, 2, 3 Breakdown):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                          {Object.entries(goal.quarterlyTargets).map(([qKey, targets]) => (
                            <div key={qKey} className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-800/60">
                              <span className="font-bold text-amber-400 uppercase">{qKey.toUpperCase()}:</span>
                              <ul className="list-disc list-inside mt-0.5 text-emerald-100 space-y-0.5">
                                {targets.map((t, tIdx) => (
                                  <li key={tIdx} className="line-clamp-2">{t}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {goal.monthlyGoals && goal.monthlyGoals.length > 0 && (
                      <div className="pt-2 border-t border-emerald-900 space-y-1.5">
                        <div className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                          Monthly Key Goals &amp; Tasks:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                          {goal.monthlyGoals.map((mg, mgIdx) => (
                            <div key={mgIdx} className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-800/60 space-y-1">
                              <span className="font-bold text-emerald-300">{mg.monthName}</span>
                              {mg.keyGoals.length > 0 && (
                                <ul className="list-disc list-inside text-emerald-100">
                                  {mg.keyGoals.map((kg, kgIdx) => (
                                    <li key={kgIdx} className="line-clamp-2">{kg}</li>
                                  ))}
                                </ul>
                              )}
                              {mg.todos.length > 0 && (
                                <div className="text-[10px] text-emerald-300 italic">
                                  {mg.todos.length} to-do item{mg.todos.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-emerald-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-emerald-300">
                Total Goals: <strong>{inspectMember.total_goals_count}</strong>
              </span>
              <button
                onClick={() => {
                  const m = inspectMember;
                  setInspectMember(null);
                  handleOpenFollowUp(m);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-yellow-300 shadow"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Compose Follow-Up Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SEND FOLLOW-UP / ENCOURAGEMENT EMAIL                            */}
      {/* ========================================================================= */}
      {followupMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-emerald-900 border border-emerald-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>Send Member Follow-Up Email</span>
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  To: <strong>{followupMember.full_name}</strong> ({followupMember.email})
                </p>
              </div>
              <button
                onClick={() => setFollowupMember(null)}
                className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {followupStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  followupStatus.startsWith("Error")
                    ? "bg-red-500/20 border border-red-500/40 text-red-300"
                    : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200"
                }`}
              >
                {followupStatus}
              </div>
            )}

            <form onSubmit={handleSendFollowUpEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-emerald-300 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={followupSubject}
                  onChange={(e) => setFollowupSubject(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-300 mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={8}
                  value={followupMessage}
                  onChange={(e) => setFollowupMessage(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={`mailto:${followupMember.email}?subject=${encodeURIComponent(
                    followupSubject
                  )}&body=${encodeURIComponent(followupMessage)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-amber-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in My Mail Client</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setFollowupMember(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950 border border-emerald-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={followupLoading}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs text-emerald-950 bg-linear-to-r from-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 transition-all shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{followupLoading ? "Sending..." : "Send Official Follow-Up"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
