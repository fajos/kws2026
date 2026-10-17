import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 border-t border-emerald-800/80 text-emerald-200/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-900 border border-amber-400/50 p-1 shadow-lg shadow-amber-400/10">
                <Image
                  src="/images/logo.png"
                  alt="Finish Rich Africa - KWS 2026 Logo"
                  fill
                  sizes="(max-width: 640px) 48px, 64px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  KWS <span className="text-amber-400">2026</span>
                </span>
                <p className="text-[10px] text-amber-300 uppercase font-bold tracking-widest">Dominion Mandate</p>
              </div>
            </Link>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Presented by <strong>Finish Rich Africa (FRA)</strong>. Convener: <strong>Dr. Temilola Adeyemi</strong>.
            </p>
            <p className="text-xs text-amber-300 font-medium">
              &quot;And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it...&quot; — Genesis 1:28
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#about" className="hover:text-amber-300 transition-colors">
                  About KWS 2026
                </Link>
              </li>
              <li>
                <Link href="/#activities" className="hover:text-amber-300 transition-colors">
                  Summit Features
                </Link>
              </li>
              <li>
                <Link href="/#convener" className="hover:text-amber-300 transition-colors">
                  The Convener
                </Link>
              </li>
              <li>
                <Link href="/#speakers" className="hover:text-amber-300 transition-colors">
                  Guest Speakers
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-amber-400 font-bold hover:underline">
                  Registration Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Venue & Date */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Venue &amp; Date</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-bold text-amber-300 text-sm">28th November 2026</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Eridan Space (The Philippi Centre)</strong><br />
                  Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa Ikeja, Lagos
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Hybrid Event (In-Person &amp; Virtual Access)</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact &amp; Inquiries</h3>
            <p className="text-xs mb-3">For group registration, partnerships or inquiries:</p>
            <a
              href="mailto:info@kingdomwealthsummit.com"
              className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@kingdomwealthsummit.com</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-4">
          <p>© 2026 Kingdom Wealth Summit (KWS) | Finish Rich Africa (FRA). All rights reserved.</p>
          <p>Convener: Dr. Temilola Adeyemi</p>
        </div>
      </div>
    </footer>
  );
}
