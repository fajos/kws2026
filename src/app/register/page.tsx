"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  Send,
  Globe,
} from "lucide-react";

interface SuccessState {
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  attendance_type: string;
  alreadyRegistered?: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    occupation: "",
    city_country: "",
    attendance_type: "in-person",
    expectations: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessState | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setSuccessData({
        reference_code: data.registration.reference_code,
        full_name: data.registration.full_name,
        email: data.registration.email,
        phone: data.registration.phone,
        attendance_type: data.registration.attendance_type,
        alreadyRegistered: data.alreadyRegistered,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyRefCode = () => {
    if (successData?.reference_code) {
      navigator.clipboard.writeText(successData.reference_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back to Home Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Summit Home</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FINISH RICH AFRICA PRESENTS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              KWS 2026 Registration
            </h1>
            <p className="text-sm text-emerald-200 max-w-lg mx-auto">
              <strong>DOMINION MANDATE</strong> (Genesis 1:28) | Convener: <strong className="text-amber-300 font-semibold">Dr. Temilola Adeyemi</strong>
            </p>
            <p className="text-xs text-amber-300 font-bold uppercase">
              28TH NOVEMBER 2026 • ERIDAN SPACE, ALAUSA IKEJA
            </p>
          </div>

          {/* SUCCESS SCREEN */}
          {successData ? (
            <div className="bg-emerald-900/90 border border-amber-400/50 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {successData.alreadyRegistered ? "Already Registered!" : "Registration Confirmed!"}
                </h2>
                <p className="text-sm text-emerald-100">
                  {successData.alreadyRegistered
                    ? "Welcome back! Here are your official registration details for Kingdom Wealth Summit 2026."
                    : "Praise God! Your seat for Kingdom Wealth Summit 2026 has been successfully reserved."}
                </p>
              </div>

              {/* Ticket / Reference Code Card */}
              <div className="p-6 rounded-2xl bg-emerald-950 border border-amber-400/40 text-center space-y-3 relative">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">Your Registration Reference Code</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-300 tracking-wider">
                    {successData.reference_code}
                  </span>
                  <button
                    onClick={copyRefCode}
                    className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-5 h-5 text-amber-300" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && <p className="text-xs text-amber-300 font-medium">Copied to clipboard!</p>}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 border-t border-emerald-800 pt-6 text-sm">
                <h3 className="font-bold text-white text-base">Registration Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-emerald-100">
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800">
                    <span className="text-xs text-emerald-300 block font-semibold">Full Name</span>
                    <span className="font-bold text-white">{successData.full_name}</span>
                  </div>
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800">
                    <span className="text-xs text-emerald-300 block font-semibold">Email</span>
                    <span className="font-bold text-white">{successData.email}</span>
                  </div>
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800">
                    <span className="text-xs text-emerald-300 block font-semibold">Phone</span>
                    <span className="font-bold text-white">{successData.phone}</span>
                  </div>
                  <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800">
                    <span className="text-xs text-emerald-300 block font-semibold">Attendance Mode</span>
                    <span className="font-bold text-amber-300 capitalize">
                      {successData.attendance_type === "in-person"
                        ? "In-Person (Eridan Space, Ikeja)"
                        : "Virtual Global Stream"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-emerald-800">
                <Link
                  href="/"
                  className="flex-1 text-center py-3.5 px-6 rounded-xl font-bold text-emerald-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-md"
                >
                  Return to Summit Home
                </Link>
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setFormData({
                      full_name: "",
                      email: "",
                      phone: "",
                      occupation: "",
                      city_country: "",
                      attendance_type: "in-person",
                      expectations: "",
                    });
                  }}
                  className="px-6 py-3.5 rounded-xl font-bold text-emerald-100 bg-emerald-950 hover:bg-emerald-800 border border-emerald-700 transition-colors"
                >
                  Register Another Person
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <div className="bg-emerald-900/70 border border-emerald-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Attendance Mode */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-white">
                    Select Attendance Mode <span className="text-amber-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.attendance_type === "in-person"
                          ? "bg-amber-400/20 border-amber-400 text-white"
                          : "bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:border-emerald-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance_type"
                        value="in-person"
                        checked={formData.attendance_type === "in-person"}
                        onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value })}
                        className="sr-only"
                      />
                      <MapPin className={`w-5 h-5 ${formData.attendance_type === "in-person" ? "text-amber-400" : "text-emerald-500"}`} />
                      <div>
                        <p className="font-extrabold text-sm">In-Person (Ikeja, Lagos)</p>
                        <p className="text-xs text-emerald-200">Eridan Space (The Philippi Centre)</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.attendance_type === "virtual"
                          ? "bg-amber-400/20 border-amber-400 text-white"
                          : "bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:border-emerald-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance_type"
                        value="virtual"
                        checked={formData.attendance_type === "virtual"}
                        onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value })}
                        className="sr-only"
                      />
                      <Globe className={`w-5 h-5 ${formData.attendance_type === "virtual" ? "text-amber-400" : "text-emerald-500"}`} />
                      <div>
                        <p className="font-extrabold text-sm">Virtual Global Stream</p>
                        <p className="text-xs text-emerald-200">Live HD Online Access</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 2: Personal Details */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                        Phone / WhatsApp <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +234 800 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                        Occupation / Business
                      </label>
                      <div className="relative">
                        <Briefcase className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Entrepreneur, Accountant"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                        City &amp; Country
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Ikeja, Lagos / London, UK"
                          value={formData.city_country}
                          onChange={(e) => setFormData({ ...formData, city_country: e.target.value })}
                          className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">
                      Expectations or Questions for Dr. Temilola Adeyemi &amp; Speakers
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What specific financial questions or expectations do you have for KWS 2026?"
                      value={formData.expectations}
                      onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                      className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white placeholder-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl font-black uppercase text-emerald-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-amber-300 transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                        Processing Seat Reservation...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>REGISTER FOR KWS 2026</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
