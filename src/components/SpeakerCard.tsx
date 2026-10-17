"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export interface SpeakerProps {
  name: string;
  role: string;
  badge: string;
  imageSrc: string;
  topic?: string;
  bio: string;
  fullBio?: string | string[];
  isConvener?: boolean;
}

export default function SpeakerCard({
  name,
  role,
  badge,
  imageSrc,
  topic,
  bio,
  fullBio,
  isConvener = false,
}: SpeakerProps) {
  const [expanded, setExpanded] = useState(false);

  // Normalize fullBio into array of paragraphs
  const paragraphs = Array.isArray(fullBio)
    ? fullBio
    : fullBio
    ? fullBio.split("\\n\\n").flatMap((p) => p.split("\n\n"))
    : [];

  return (
    <div
      className={`card-3d relative rounded-3xl overflow-hidden border ${
        isConvener
          ? "border-amber-400/60 shadow-2xl shadow-amber-400/10"
          : "border-emerald-700/80 shadow-xl"
      }`}
    >
      {/* Top Metallic Gold Line Accent */}
      <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-md" />

      <div className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">
          {/* Avatar Container */}
          <div className="relative shrink-0 group">
            <div
              className={`w-28 h-28 sm:w-40 sm:h-40 rounded-2xl overflow-hidden relative border-2 ${
                isConvener ? "border-amber-400 image-3d-frame" : "border-emerald-600 image-3d-frame"
              }`}
            >
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="(max-width: 640px) 112px, 160px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Badge Overlay */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase bg-emerald-950 border border-amber-400/80 text-amber-300 shadow-2xl shadow-black">
              {badge}
            </div>
          </div>

          {/* Speaker Info */}
          <div className="flex-1 text-center sm:text-left space-y-2.5 sm:space-y-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                {isConvener && <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-300">
                  {isConvener ? "Convener & Host" : "Guest Keynote"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{name}</h3>
              <p className="text-xs sm:text-sm font-semibold text-emerald-200 mt-0.5">{role}</p>
            </div>

            {topic && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-bold text-left shadow-inner">
                <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Session: {topic}</span>
              </div>
            )}

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">{bio}</p>

            {paragraphs.length > 0 && (
              <div>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 mt-1 transition-colors focus:outline-none"
                >
                  <span>{expanded ? "Show Less" : "Read Full Profile"}</span>
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expanded && (
                  <div className="mt-3 p-3.5 sm:p-5 rounded-2xl bg-emerald-950/95 border border-emerald-700/80 text-emerald-100 text-xs leading-relaxed space-y-3 animate-fadeIn text-left shadow-2xl">
                    {paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
