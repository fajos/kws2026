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
      className={`relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 border ${
        isConvener
          ? "bg-gradient-to-b from-emerald-950 via-emerald-900/80 to-emerald-950 border-amber-400/50 shadow-xl shadow-amber-400/10 hover:border-amber-300"
          : "bg-emerald-950/80 border-emerald-800 hover:border-amber-400/40 hover:shadow-lg"
      }`}
    >
      {/* Top Metallic Gold Line Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar Container */}
          <div className="relative shrink-0 group">
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden relative border-2 ${
                isConvener ? "border-amber-400 shadow-md shadow-amber-400/20" : "border-emerald-700"
              }`}
            >
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Badge Overlay */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-950 border border-amber-400/60 text-amber-300 shadow-lg">
              {badge}
            </div>
          </div>

          {/* Speaker Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {isConvener && <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />}
                <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                  {isConvener ? "Convener & Host" : "Guest Keynote"}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{name}</h3>
              <p className="text-sm font-semibold text-emerald-200 mt-0.5">{role}</p>
            </div>

            {topic && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Session: {topic}</span>
              </div>
            )}

            <p className="text-emerald-100/90 text-sm leading-relaxed">{bio}</p>

            {paragraphs.length > 0 && (
              <div>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 mt-2 transition-colors focus:outline-none"
                >
                  <span>{expanded ? "Show Less" : "Read Full Profile"}</span>
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expanded && (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs leading-relaxed space-y-3 animate-fadeIn">
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
