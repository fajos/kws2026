import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpeakerCard from "@/components/SpeakerCard";
import DominionCountdown from "@/components/DominionCountdown";
import DominionInteractiveQuiz from "@/components/DominionInteractiveQuiz";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  Gamepad2,
  Brain,
  Zap,
  Music,
  Compass,
  Briefcase,
  Tv,
  Globe2,
  Crown,
  Sparkles,
  Shield,
  Layers,
  Flame,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-28 border-b border-emerald-800/60 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-emerald-950">
          {/* Background Ambient Glowing 3D Orbs & Light Beams */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none animate-pulseGlow" />
          <div className="absolute top-1/3 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none animate-pulseGlow" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {/* Official Branding Logo & Organizer Badge */}
              <div className="flex flex-col items-center gap-2.5">
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-3xl bg-emerald-950/90 p-2 border-2 border-amber-400/60 image-3d-frame animate-float">
                  <Image
                    src="/images/logo.png"
                    alt="Finish Rich Africa - KWS 2026 Official Logo"
                    fill
                    sizes="(max-width: 640px) 96px, 144px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/90 border border-amber-400/50 text-amber-300 text-[11px] sm:text-sm font-extrabold tracking-wider uppercase shadow-xl shadow-black/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>FINISH RICH AFRICA (FRA) PRESENTS</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>

              {/* Summit Title Badge */}
              <p className="text-xs sm:text-sm font-bold text-emerald-200 uppercase tracking-widest">
                KINGDOM WEALTH SUMMIT (KWS) 2026
              </p>

              {/* Main Headline: DOMINION MANDATE */}
              <div className="space-y-0.5 sm:space-y-1">
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
                  DOMINION
                </h1>
                <h2 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white drop-shadow-xl">
                  MANDATE
                </h2>
              </div>

              {/* Scripture Reference */}
              <div className="inline-block px-4 py-1 rounded-xl bg-emerald-900/90 border border-emerald-700/80 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md">
                GENESIS 1:28
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-emerald-100 max-w-2xl mx-auto font-normal leading-relaxed px-2">
                Step into financial mastery, spiritual alignment, and kingdom economic dominance. Convened by <strong className="text-amber-300 font-semibold">Dr. Temilola Adeyemi</strong> and guest speakers including <strong className="text-amber-300 font-semibold">Seyi Abiodun</strong>.
              </p>

              {/* Key Event Meta (Date & Venue) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 text-xs sm:text-sm font-bold text-white">
                <div className="flex items-center gap-2 bg-emerald-900/90 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-amber-400/50 shadow-xl">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-amber-300 text-sm sm:text-base uppercase">28TH NOVEMBER 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-900/90 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-emerald-700 shadow-xl">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                  <span className="text-left text-[11px] sm:text-sm">
                    <strong>ERIDAN SPACE (THE PHILIPPI CENTRE)</strong><br />
                    Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa Ikeja
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl text-sm sm:text-base font-extrabold text-emerald-950 btn-gold-3d transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>REGISTER FOR KWS 2026</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <a
                  href="#speakers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-xs sm:text-base font-bold text-emerald-100 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 hover:border-amber-400/40 shadow-lg transition-all duration-300"
                >
                  <span>EXPLORE SPEAKERS</span>
                </a>
              </div>

              {/* Live Animated Countdown Timer */}
              <DominionCountdown />

              {/* Host Tag */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Convener: <strong className="text-amber-300">Dr. Temilola Adeyemi</strong> | Founder, Finish Rich Africa</span>
              </div>
            </div>
          </div>
        </section>

        {/* DOMINION STRATEGY PILLARS (CHESS & KINGDOM AUTHORITY MOTIFS) */}
        <section className="py-14 sm:py-20 bg-emerald-900/30 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400">
                THE STRATEGIC CHESSBOARD OF WEALTH
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tight">
                4 PILLARS OF DOMINION MANDATE
              </h2>
              <p className="text-emerald-200/90 text-xs sm:text-base">
                Mastering the financial game with divine authority, foresight, and tactical execution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card-3d p-5 rounded-3xl border border-amber-400/40 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest">Pillar 1 • Authority</span>
                <h3 className="text-lg font-extrabold text-white">King&apos;s Decree</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Operating in biblical authority, breaking generational debt curses, and claiming your legal financial inheritance in Christ.
                </p>
              </div>

              <div className="card-3d p-5 rounded-3xl border border-emerald-700/80 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest">Pillar 2 • Wisdom</span>
                <h3 className="text-lg font-extrabold text-white">Queen&apos;s Strategy</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Data-driven portfolio management, capital allocation, and market analysis taught by PhD finance experts.
                </p>
              </div>

              <div className="card-3d p-5 rounded-3xl border border-emerald-700/80 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest">Pillar 3 • Innovation</span>
                <h3 className="text-lg font-extrabold text-white">Knight&apos;s Maneuver</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Tactical business maneuvers, interactive Money Game simulations, and launching high-yielding Kingdom enterprises.
                </p>
              </div>

              <div className="card-3d p-5 rounded-3xl border border-amber-400/40 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest">Pillar 4 • Fortification</span>
                <h3 className="text-lg font-extrabold text-white">Castle&apos;s Legacy</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Asset protection, estate planning, and establishing multi-generational wealth that impacts kingdom projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DOMINION BLUEPRINT QUIZ */}
        <section className="py-14 sm:py-20 bg-emerald-950 border-b border-emerald-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <DominionInteractiveQuiz />
          </div>
        </section>

        {/* FEATURED ACTIVITIES HIGHLIGHTS */}
        <section id="activities" className="py-14 sm:py-20 bg-emerald-950 relative border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400">
                WHAT TO EXPECT AT KWS 2026
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tight">
                SUMMIT HIGHLIGHTS &amp; SESSIONS
              </h2>
              <p className="text-emerald-200/90 text-xs sm:text-base">
                An environment built to equip you with biblical wisdom, practical money games, and high-impact strategy.
              </p>
            </div>

            {/* Flyer Activities 3D Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <Music className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Anointed Worship</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Atmosphere of deep spiritual praise and worship to align your soul and receive divine ideas from the Holy Spirit.
                </p>
              </div>

              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Financial Literacy &amp; Wealth Teaching</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  In-depth teaching on money management, investment principles, wealth creation, and building enduring Kingdom assets.
                </p>
              </div>

              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Financial Reality Check</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Honest, practical assessment of your current financial standing and step-by-step guidance to eradicate debt and financial gaps.
                </p>
              </div>

              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Prophetic Session &amp; Journaling</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  A guided prophetic time of decree, revelation, and personal journaling to capture divine instructions for your wealth journey.
                </p>
              </div>

              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Interactive Money Game</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Engaging, hands-on simulation game designed to sharpen your negotiation skills, risk assessment, and financial decision-making.
                </p>
              </div>

              <div className="card-3d p-5 sm:p-6 rounded-3xl border border-emerald-700/80 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-md">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Breakout Sessions &amp; Ask the Experts</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Targeted breakout tracks and direct Q&amp;A sessions with Dr. Temilola Adeyemi, Seyi Abiodun, and seasoned finance experts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MEET THE CONVENER SECTION */}
        <section id="convener" className="py-14 sm:py-20 bg-emerald-900/40 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400">
                THE HOST &amp; CONVENER
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white">Dr. Temilola Adeyemi</h2>
              <p className="text-emerald-200 text-xs sm:text-base">
                Founder, Finish Rich Africa | Finance Professional, Chartered Stockbroker &amp; Investment Strategist
              </p>
            </div>

            {/* Convener Profile & Highlights Grid */}
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
              <SpeakerCard
                name="Dr. Temilola Adeyemi"
                role="Founder, Finish Rich Africa | Chartered Stockbroker & PhD in Finance"
                badge="Convener & Host"
                imageSrc="/images/convener.JPG"
                topic="Dominion Mandate: Operating in Kingdom Financial Authority & Strategic Asset Building"
                isConvener={true}
                bio="Dr. Temilola Adeyemi is a finance professional, Chartered Stockbroker, and investment strategist recognized for her work in capital markets, portfolio management, and financial literacy across Africa. She holds a PhD in Finance and brings a strong blend of academic depth and practical market experience."
                fullBio={[
                  "Worked as an Investment Specialist, where she developed data-driven investment strategies and managed portfolios exceeding ₦4 billion in assets. With experience spanning banking, investment advisory, and financial markets, her work focuses on helping investors navigate complex market environments and build sustainable, long-term wealth.",
                  "Beyond the investment industry, Dr. Adeyemi is an advocate for financial inclusion, with a goal of equipping Africans with the knowledge and tools needed to build profitable investment portfolios and achieve financial independence. Through bootcamps, training programs, and speaking engagements, this initiative has trained over 20,000 individuals and partnered with institutions including the United Nations, Mastercard, Fidson, and Lafarge.",
                  "Dr. Adeyemi is also a trusted voice on economic and financial market developments, frequently appearing on major media platforms such as Arise TV, CNBC Africa, and News Central to provide expert commentary on markets, macroeconomic trends, and investment strategy.",
                  "Through her work at the intersection of finance, education, and leadership, Dr. Adeyemi continues to inspire individuals and institutions across Africa to think differently about money, investing, and building generational wealth.",
                ]}
              />

              {/* Convener Credential Highlights Grid - Resized 2-Column 3D Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="card-3d p-4 rounded-2xl border border-emerald-700/80 space-y-1 text-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-white">PhD in Finance</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-300">Chartered Stockbroker</p>
                </div>

                <div className="card-3d p-4 rounded-2xl border border-emerald-700/80 space-y-1 text-center">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-white">₦4 Billion+ Assets</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-300">Managed Portfolios</p>
                </div>

                <div className="card-3d p-4 rounded-2xl border border-emerald-700/80 space-y-1 text-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-white">20,000+ Trained</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-300">UN &amp; Mastercard Partner</p>
                </div>

                <div className="card-3d p-4 rounded-2xl border border-emerald-700/80 space-y-1 text-center">
                  <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-white">Media Analyst</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-300">Arise TV &amp; CNBC Africa</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SPEAKERS SECTION */}
        <section id="speakers" className="py-14 sm:py-20 bg-emerald-950 border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400">
                KEYNOTE FACILITATORS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Guest Speakers</h2>
              <p className="text-emerald-200 text-xs sm:text-base">
                Joining Dr. Temilola Adeyemi to deliver high-impact sessions at KWS 2026.
              </p>
            </div>

            {/* Each speaker on separate full-width rows */}
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
              {/* Speaker 1: Seyi Abiodun */}
              <SpeakerCard
                name="Seyi Abiodun"
                role="Global Wealth Advisor & Impact Investor"
                badge="Keynote Speaker 1"
                imageSrc="/images/speaker1.jpeg"
                topic="Capital Allocation, Sustainable Investments & Wealth Without Borders"
                bio="Seyi Abiodun is a Global Wealth Advisor and Impact Investor with over 16 years of executive experience across corporate governance, finance, administration, and strategic planning, working closely with Group CEOs, Board Chairmen, and Presidents."
                fullBio={[
                  "Seyi Abiodun is a Global Wealth Advisor and Impact Investor with over 16 years of executive experience spanning corporate governance, finance, administration, and strategic planning, he has worked closely with senior executives, Group CEOs, Board Chairmen, and Presidents across industries including management consulting, insurance, oil and gas, and manufacturing. His experience has given him a broad perspective on how businesses are built, capital is allocated, and wealth is created and preserved.",
                  "As an Investor, Seyi is passionate about identifying high-potential founders and businesses solving important problems across Africa and emerging markets. He is particularly interested in opportunities where capital, innovation, and strong execution can create significant long-term value. He advocates for the integration of sustainable investment principles into wealth management and capital allocation, with the belief that financial returns and positive economic impact can be pursued together.",
                  "Seyi holds an Honorary Doctorate in Business Administration from Myles Leadership University and is currently pursuing a Global MBA at Imperial College Business School, London. He also holds a Post Graduate Diploma in Business Management and a Master’s in Industrial Relations. He is a Certified Financial Education Instructor and a member of the NFEC’s Personal Finance Speakers Association (USA), as well as an Associate Member of the Chartered Institute of Finance and Control of Nigeria (CIFCON).",
                  "Beyond his investment and advisory work, Seyi is committed to improving financial literacy and wealth consciousness across Africa. Through his training programs, speaking engagements, and content, he has educated thousands of professionals and entrepreneurs, simplifying complex financial concepts and translating them into practical strategies.",
                  "As a finance content creator and thought leader, he believes wealth is not simply about accumulation. It is about creating the freedom to live, invest, build businesses, protect what you have created, and make an impact without borders.",
                ]}
              />

              {/* Speaker 2 Placeholder */}
              <SpeakerCard
                name="Keynote Guest Speaker 2"
                role="Kingdom Economist & Market Facilitator"
                badge="Guest Speaker 2"
                imageSrc="/images/speaker-2.svg"
                topic="Dominion in Marketplaces & The Money Game"
                bio="An accomplished entrepreneur and financial literacy advocate dedicated to training kingdom visionaries to dominate market sectors through strategic innovation."
                fullBio={[
                  "Speaker 2 will lead the interactive Money Game simulation and co-anchor the Ask the Experts session alongside Dr. Temilola Adeyemi and Seyi Abiodun.",
                  "More details and bio for Guest Speaker 2 will be released soon as we finalize the complete summit lineup.",
                ]}
              />
            </div>
          </div>
        </section>

        {/* VENUE & LOCATION SECTION */}
        <section id="venue" className="py-14 sm:py-20 bg-emerald-900/50 border-b border-emerald-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
            <div className="text-center space-y-2 sm:space-y-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400">
                WHERE TO JOIN US
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Summit Venue &amp; Date</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {/* Physical Venue Card */}
              <div className="card-3d p-6 sm:p-8 rounded-3xl border border-amber-400/50 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
                    <MapPin className="w-4 h-4" /> Physical Venue
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">Eridan Space (The Philippi Centre)</h3>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                    Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa Ikeja, Lagos, Nigeria.
                  </p>
                </div>
                <div className="pt-3 border-t border-emerald-900 flex items-center justify-between text-[11px] sm:text-xs text-amber-300 font-bold">
                  <span>DATE: 28TH NOVEMBER 2026</span>
                  <span>IKEJA, LAGOS</span>
                </div>
              </div>

              {/* Virtual Access Card */}
              <div className="card-3d p-6 sm:p-8 rounded-3xl border border-emerald-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase">
                    <Globe2 className="w-4 h-4" /> Virtual Global Stream
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">Live Online Stream</h3>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                    Can&apos;t attend physically in Ikeja? Join our high-definition interactive live stream from anywhere around the globe.
                  </p>
                </div>
                <div className="pt-3 border-t border-emerald-900 flex items-center justify-between text-[11px] sm:text-xs text-emerald-300 font-bold">
                  <span>ACCESS LINK SENT ON REGISTRATION</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-emerald-950 to-emerald-900 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6 relative z-10">
            <Award className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 mx-auto animate-float" />
            <h2 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tight">
              CLAIM YOUR DOMINION MANDATE
            </h2>
            <p className="text-emerald-100 text-xs sm:text-lg max-w-2xl mx-auto px-2">
              Finish Rich Africa invites you to Kingdom Wealth Summit 2026. Secure your seat today for this transformational event with Dr. Temilola Adeyemi, Seyi Abiodun, and guest experts.
            </p>
            <div className="pt-2 sm:pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4.5 rounded-2xl text-sm sm:text-lg font-black text-emerald-950 btn-gold-3d transition-transform transform hover:scale-105 uppercase tracking-wide"
              >
                <span>REGISTER NOW FOR KWS 2026</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
