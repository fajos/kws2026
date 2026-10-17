import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpeakerCard from "@/components/SpeakerCard";
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Award,
  BookOpen,
  DollarSign,
  Gamepad2,
  Brain,
  Zap,
  Music,
  Compass,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-emerald-800/60 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-emerald-950">
          {/* Background Ambient Glows & Chess/Dominion Motifs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Organizer Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-lg shadow-black/40">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>FINISH RICH AFRICA (FRA) PRESENTS</span>
              </div>

              {/* Summit Title Badge */}
              <p className="text-sm font-bold text-emerald-200 uppercase tracking-widest">
                KINGDOM WEALTH SUMMIT (KWS) 2026
              </p>

              {/* Main Headline: DOMINION MANDATE */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                  DOMINION
                </h1>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white drop-shadow-md">
                  MANDATE
                </h2>
              </div>

              {/* Scripture Reference */}
              <div className="inline-block px-4 py-1.5 rounded-lg bg-emerald-900/90 border border-emerald-700/80 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase">
                GENESIS 1:28
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-normal leading-relaxed">
                Step into financial mastery, spiritual alignment, and kingdom economic dominance. Convened by <strong className="text-amber-300 font-semibold">Temilola Adeyemi</strong> and guest experts.
              </p>

              {/* Key Event Meta (Date & Venue from Flyer) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 text-xs sm:text-sm font-bold text-white">
                <div className="flex items-center gap-2 bg-emerald-900/90 px-5 py-3 rounded-2xl border border-amber-400/40 shadow-lg">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 text-base uppercase">28TH NOVEMBER 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-900/90 px-5 py-3 rounded-2xl border border-emerald-700 shadow-lg">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-left text-xs sm:text-sm">
                    <strong>ERIDAN SPACE (THE PHILIPPI CENTRE)</strong><br />
                    Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa Ikeja
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl text-base font-extrabold text-emerald-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-amber-300 shadow-xl shadow-amber-400/25 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>REGISTER FOR KWS 2026</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#activities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-emerald-100 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 hover:border-amber-400/40 transition-all duration-300"
                >
                  <span>VIEW ACTIVITIES</span>
                </a>
              </div>

              {/* Host Tag */}
              <div className="pt-6 flex items-center justify-center gap-2 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Convener: <strong className="text-amber-300">Temilola Adeyemi</strong> | Finish Rich Africa</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ACTIVITIES HIGHLIGHTS (EXTRACTED FROM FLYER) */}
        <section id="activities" className="py-20 bg-emerald-950 relative border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                WHAT TO EXPECT AT KWS 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                SUMMIT HIGHLIGHTS &amp; SESSIONS
              </h2>
              <p className="text-emerald-200/90 text-sm sm:text-base">
                An immersive environment built to equip you with biblical wisdom, practical money games, and high-impact strategy.
              </p>
            </div>

            {/* Flyer Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Music className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Anointed Worship</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Atmosphere of deep spiritual praise and worship to align your soul and receive divine ideas from the Holy Spirit.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Financial Literacy &amp; Wealth Teaching</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  In-depth teaching on money management, investment principles, wealth creation, and building enduring Kingdom assets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Financial Reality Check</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Honest, practical assessment of your current financial standing and step-by-step guidance to eradicate financial debt and gaps.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Prophetic Session &amp; Journaling</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  A guided prophetic time of decree, revelation, and personal journaling to capture divine instructions for your wealth journey.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Interactive Money Game</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Engaging, hands-on simulation game designed to sharpen your negotiation skills, risk assessment, and financial decision-making.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800 hover:border-amber-400/40 transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Breakout Sessions &amp; Ask the Experts</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Targeted breakout tracks and direct Q&amp;A sessions with Convener Temilola Adeyemi and seasoned finance experts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MEET THE CONVENER SECTION */}
        <section id="convener" className="py-20 bg-emerald-900/40 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                THE HOST &amp; CONVENER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Temilola Adeyemi</h2>
              <p className="text-emerald-200 text-sm sm:text-base">
                Leading Finish Rich Africa to empower believers and visionaries with kingdom economic strategy.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <SpeakerCard
                name="Temilola Adeyemi"
                role="Convener of KWS 2026 & Lead at Finish Rich Africa"
                badge="Convener & Host"
                imageSrc="/images/convener-temilola-adeyemi.svg"
                topic="Dominion Mandate: Operating in Kingdom Financial Authority"
                isConvener={true}
                bio="Temilola Adeyemi is the convener of Kingdom Wealth Summit (KWS) 2026 and the visionary behind Finish Rich Africa (FRA). Temilola is deeply passionate about breaking financial scarcity mindsets and building sustainable, kingdom-aligned wealth ecosystems."
                fullBio="Through Finish Rich Africa, Temilola has helped hundreds of professionals, entrepreneurs, and believers cultivate financial discipline, master wealth creation, and step into their biblical Dominion Mandate (Genesis 1:28)."
              />
            </div>
          </div>
        </section>

        {/* FEATURED SPEAKERS SECTION */}
        <section id="speakers" className="py-20 bg-emerald-950 border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                KEYNOTE FACILITATORS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Guest Speakers</h2>
              <p className="text-emerald-200 text-sm sm:text-base">
                Learn directly from financial experts, business builders, and kingdom teachers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Speaker 1 Placeholder */}
              <SpeakerCard
                name="Keynote Guest Speaker 1"
                role="Wealth Building & Investment Specialist"
                badge="Guest Speaker 1"
                imageSrc="/images/speaker-1.svg"
                topic="Financial Reality Check & Asset Building Strategies"
                bio="A seasoned authority in financial planning, investment strategies, and debt-free wealth building with years of experience transforming personal and corporate finances."
                fullBio="Speaker 1 will facilitate the Financial Reality Check and Breakout Sessions, delivering step-by-step tools to organize your wealth portfolio and execute smart investments."
              />

              {/* Speaker 2 Placeholder */}
              <SpeakerCard
                name="Keynote Guest Speaker 2"
                role="Kingdom Economist & Market Facilitator"
                badge="Guest Speaker 2"
                imageSrc="/images/speaker-2.svg"
                topic="Dominion in Marketplaces & The Money Game"
                bio="An accomplished entrepreneur and financial literacy advocate dedicated to training kingdom visionaries to dominate market sectors through strategic innovation."
                fullBio="Speaker 2 will lead the interactive Money Game simulation and co-anchor the Ask the Experts session alongside Temilola Adeyemi."
              />
            </div>
          </div>
        </section>

        {/* VENUE & LOCATION SECTION */}
        <section id="venue" className="py-20 bg-emerald-900/50 border-b border-emerald-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                WHERE TO JOIN US
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Summit Venue &amp; Date</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Physical Venue Card */}
              <div className="p-8 rounded-3xl bg-emerald-950 border border-amber-400/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
                    <MapPin className="w-4 h-4" /> Physical Venue
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Eridan Space (The Philippi Centre)</h3>
                  <p className="text-sm text-emerald-200 leading-relaxed">
                    Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa Ikeja, Lagos, Nigeria.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-900 flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>DATE: 28TH NOVEMBER 2026</span>
                  <span>IKEJA, LAGOS</span>
                </div>
              </div>

              {/* Virtual Access Card */}
              <div className="p-8 rounded-3xl bg-emerald-950 border border-emerald-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase">
                    <Users className="w-4 h-4" /> Virtual Global Stream
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Live Online Stream</h3>
                  <p className="text-sm text-emerald-200 leading-relaxed">
                    Can&apos;t attend physically in Ikeja? Join our high-definition interactive live stream from anywhere around the globe.
                  </p>
                </div>
                <div className="pt-4 border-t border-emerald-900 flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>ACCESS LINK SENT ON REGISTRATION</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-b from-emerald-950 to-emerald-900 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
            <Award className="w-14 h-14 text-amber-400 mx-auto" />
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              CLAIM YOUR DOMINION MANDATE
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
              Finish Rich Africa invites you to Kingdom Wealth Summit 2026. Secure your seat today for this transformational event with Temilola Adeyemi and guest experts.
            </p>
            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2xl text-lg font-black text-emerald-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-amber-300 shadow-2xl shadow-amber-400/30 transition-transform transform hover:scale-105 uppercase tracking-wide"
              >
                <span>REGISTER NOW FOR KWS 2026</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
