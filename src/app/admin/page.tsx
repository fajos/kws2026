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
} from "lucide-react";

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
}

interface Stats {
  total: number;
  inPerson: number;
  virtual: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, inPerson: 0, virtual: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (filterType !== "all") query.set("type", filterType);

      const res = await fetch(`/api/admin/registrations?${query.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setStats(data.stats || { total: 0, inPerson: 0, virtual: 0 });
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      fetchData();
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

  const handleExportCSV = () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (filterType !== "all") query.set("type", filterType);
    query.set("export", "csv");

    window.open(`/api/admin/registrations?${query.toString()}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12">
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
                  Finish Rich Africa | Kingdom Wealth Summit 2026
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
              {/* Header */}
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
                    <span>KWS 2026 Admin Portal</span>
                  </h1>
                  <p className="text-xs text-emerald-200 mt-1">
                    Finish Rich Africa | KWS 2026 Registration Database &amp; Analytics
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchData}
                    className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={handleExportCSV}
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

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                    <span>In-Person (Eridan Space)</span>
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-amber-300">{stats.inPerson}</p>
                  <p className="text-[11px] text-emerald-200">Attending Ikeja, Lagos</p>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                    <span>Virtual Streamers</span>
                    <Globe className="w-4 h-4 text-emerald-300" />
                  </div>
                  <p className="text-3xl font-black text-emerald-300">{stats.virtual}</p>
                  <p className="text-[11px] text-emerald-200">Attending Online Stream</p>
                </div>
              </div>

              {/* Controls Bar (Search & Filter) */}
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

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-emerald-200 font-bold">Filter:</span>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-emerald-950 border border-emerald-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Registrations</option>
                    <option value="in-person">In-Person Only</option>
                    <option value="virtual">Virtual Only</option>
                  </select>
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
                        <th className="py-3.5 px-4">Occupation / Location</th>
                        <th className="py-3.5 px-4">Expectations</th>
                        <th className="py-3.5 px-4">Attendance</th>
                        <th className="py-3.5 px-4">Date Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/60">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-emerald-400">
                            <div className="inline-flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              <span>Loading registrations...</span>
                            </div>
                          </td>
                        </tr>
                      ) : registrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-emerald-400">
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
                              {reg.full_name}
                            </td>
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="text-emerald-100">{reg.email}</div>
                              <div className="text-emerald-400 text-[11px]">{reg.phone}</div>
                            </td>
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="text-emerald-100">{reg.occupation || "N/A"}</div>
                              <div className="text-emerald-400 text-[11px]">{reg.city_country || "N/A"}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-emerald-200 max-w-xs truncate" title={reg.expectations || "N/A"}>
                                {reg.expectations || "N/A"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                  reg.attendance_type === "in-person"
                                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                    : "bg-emerald-950 text-emerald-200 border border-emerald-700"
                                }`}
                              >
                                {reg.attendance_type === "in-person" ? "In-Person (Ikeja)" : "Virtual"}
                              </span>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
