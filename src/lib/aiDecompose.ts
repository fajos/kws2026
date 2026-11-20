import { getWeeksForMonth } from "./journalCalendar";

export type LifeArea =
  | "Personal growth"
  | "Health and wellbeing"
  | "Spiritual life"
  | "Career or business"
  | "Financial"
  | "Family and relationships"
  | "Community and impact"
  | "Rest and joy";

export interface DecomposedWeek {
  topPriorities: string[];
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

export interface DecomposedMonth {
  keyGoals: string[];
  todos: string[];
  notes: string;
  weeks?: Record<number, DecomposedWeek>;
}

export interface DecomposedPlan {
  whyItMatters: string;
  supportNeeded: string;
  milestones: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  quarterPlans: {
    1: { theme: string; month1: string[]; month2: string[]; month3: string[] };
    2: { theme: string; month1: string[]; month2: string[]; month3: string[] };
    3: { theme: string; month1: string[]; month2: string[]; month3: string[] };
    4: { theme: string; month1: string[]; month2: string[]; month3: string[] };
  };
  monthPlans: Record<number, DecomposedMonth>;
  sampleWeek?: DecomposedWeek;
  source: "deepseek" | "openai" | "smart-engine";
}

export const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Synthesizes actionable weekly schedules for the exact calendar weeks (4 or 5 weeks)
 * of any given month based on ISO-8601 calendar logic, the month's specific goals,
 * quarterly phase, and life area habits.
 */
export function generateWeeklyPlansForMonth(
  cleanGoal: string,
  monthIndex: number,
  monthName: string,
  quarterIndex: number,
  keyGoals: string[],
  todos: string[],
  habits: string[],
  initialSampleWeek?: DecomposedWeek,
  targetYear: number = 2026
): Record<number, DecomposedWeek> {
  const weeks: Record<number, DecomposedWeek> = {};
  const monthWeeks = getWeeksForMonth(targetYear, monthIndex);
  const totalWeeks = monthWeeks.length; // Exactly 4 or 5 weeks for this month

  const g0 = keyGoals[0] || `Advance ${cleanGoal}`;
  const g1 = keyGoals[1] || `Maintain 80%+ consistency on daily keystone habit`;
  const g2 = keyGoals[2] || `Deliver Quarter ${quarterIndex} milestone targets`;

  const t0 = todos[0] || `Audit monthly baseline & establish weekly schedule`;
  const t1 = todos[1] || `Execute primary tactical sprint`;
  const t2 = todos[2] || `Prepare monthly reflection & retrospective`;

  const h0 = habits[0] || "Review priorities & execute keystone habit";
  const h1 = habits[1] || "Dedicated deep focus session";
  const h2 = habits[2] || "Habit check & metric tracking";
  const h3 = habits[3] || "Rest, active joy & weekly reflection";

  for (let w = 1; w <= totalWeeks; w++) {
    // If Month 1, Week 1 and sampleWeek was provided, preserve sampleWeek
    if (monthIndex === 1 && w === 1 && initialSampleWeek) {
      weeks[1] = initialSampleWeek;
      continue;
    }

    if (w === 1) {
      weeks[1] = {
        topPriorities: [
          `Kick off ${monthName} milestone: ${g0}`,
          `Execute setup task: ${t0}`,
          `Lock in keystone daily habit: ${h0}`,
        ],
        days: {
          monday: `Kick off ${monthName}: establish intention for "${cleanGoal.substring(0, 36)}"`,
          tuesday: `Focused session: ${h0} and foundational setup`,
          wednesday: `Midweek calibration: ensure solid momentum on "${t0.substring(0, 35)}"`,
          thursday: `Overcome friction: ${h1} with zero distractions`,
          friday: `Wrap up Week 1 deliverables; evaluate initial output`,
          saturday: `Active joy & restorative downtime: ${h3}`,
          sunday: `Sunday Reset: review Week 1 wins, plan priorities for Week 2`,
        },
        carryForward: `Strong opening in ${monthName}. Early consistency builds compounding momentum.`,
      };
    } else if (w === 2) {
      weeks[2] = {
        topPriorities: [
          `Core execution sprint: ${g1}`,
          `Advance tactical deliverable: ${t1}`,
          `Sustain high consistency on ${h1}`,
        ],
        days: {
          monday: `Sprint kickoff: tackle top priority first for "${g1.substring(0, 35)}"`,
          tuesday: `Deep execution block: dedicated to ${h1}`,
          wednesday: `Mid-sprint check: review tracking metrics & KPIs`,
          thursday: `High-impact action: push through "${t1.substring(0, 35)}"`,
          friday: `Consolidate sprint deliverables; tidy workspace & review wins`,
          saturday: `Personal enrichment, outdoor recreation, and creative downtime`,
          sunday: `Weekly review: evaluate sprint velocity, outline Week 3 focus`,
        },
        carryForward: `Execution rhythm is steady. Maintain consistency into the next phase.`,
      };
    } else if (w === 3) {
      weeks[3] = {
        topPriorities: [
          `Target breakthrough on ${g2}`,
          `Resolve primary bottleneck or friction point`,
          `Mid-month calibration against Quarter ${quarterIndex} targets`,
        ],
        days: {
          monday: `Mid-month recommitment: assess progress against monthly targets`,
          tuesday: `High-leverage focus session: ${h2}`,
          wednesday: `Accountability check: audit habit consistency and address friction`,
          thursday: `Breakthrough sprint: push through resistance on challenging tasks`,
          friday: `Consolidate Week 3 victories; document key insights and wins`,
          saturday: `Rest, family connection, and physical/mental recharge`,
          sunday: `Sunday review: prepare for next week in ${monthName}`,
        },
        carryForward: `Plateaus yield to persistence. Approaching the finish line of ${monthName}.`,
      };
    } else if (w === totalWeeks) {
      // The final week of this month (Week 4 in 4-week months, Week 5 in 5-week months)
      weeks[w] = {
        topPriorities: [
          `Finalize and deliver Month ${monthIndex} key goal: "${g0}"`,
          `Complete final monthly review tasks: ${t2}`,
          `Conduct Month in Review reflection & celebrate achievements`,
        ],
        days: {
          monday: `Closing sprint kickoff: line up all remaining deliverables for ${monthName}`,
          tuesday: `Deep closing block: finalize critical action items`,
          wednesday: `Milestone verification: measure tangible results against Q${quarterIndex}`,
          thursday: `Wrap up remaining todos and document key learnings`,
          friday: `Monthly celebration: acknowledge progress, celebrate top win`,
          saturday: `Celebration, gratitude, and unplugged restoration`,
          sunday: `Complete Month in Review: record one win, one lesson, and grateful moments`,
        },
        carryForward: `Outstanding dedication in ${monthName}. Carry forward these habits and wins into next month.`,
      };
    } else {
      // Week 4 in a 5-week month (momentum acceleration week)
      weeks[4] = {
        topPriorities: [
          `Accelerate momentum on ${g1}`,
          `Refine and optimize execution workflows`,
          `Pre-close key deliverables before final week wrap-up`,
        ],
        days: {
          monday: `Week 4 acceleration: streamline tasks and remove roadblocks`,
          tuesday: `Execution focus: high-output sprint block`,
          wednesday: `Midweek quality review: verify progress and deliverables`,
          thursday: `Push through remaining resistance on challenging tasks`,
          friday: `Review week 4 progress; celebrate consistency wins`,
          saturday: `Restorative rest, exercise, and mental rejuvenation`,
          sunday: `Weekly reset: prepare for final closing week of ${monthName}`,
        },
        carryForward: `Strong consistency through week 4. Position yourself for a triumphant monthly finish.`,
      };
    }
  }

  return weeks;
}

// --------------------------------------------------------------------------
// DeepSeek / OpenAI API Caller
// --------------------------------------------------------------------------
async function callLlmApi(
  prompt: string,
  systemPrompt: string,
  apiKey: string,
  provider: "deepseek" | "openai" = "deepseek"
): Promise<any> {
  const url =
    provider === "deepseek"
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

  const model = provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI API failed (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } finally {
    clearTimeout(timeoutId);
  }
}

// --------------------------------------------------------------------------
// Domain-Specific Smart Heuristics Engine
// --------------------------------------------------------------------------
function generateSmartHeuristicDecomposition(
  area: LifeArea,
  goalText: string,
  year: number
): DecomposedPlan {
  const cleanGoal = goalText.trim() || `Excel in ${area}`;

  // Area archetypes
  const areaTemplates: Record<
    LifeArea,
    {
      why: string;
      support: string;
      q1Theme: string;
      q2Theme: string;
      q3Theme: string;
      q4Theme: string;
      habits: string[];
    }
  > = {
    "Personal growth": {
      why: `Mastering "${cleanGoal}" creates continuous momentum, sharpens intellectual clarity, and unlocks new personal horizons in ${year}.`,
      support: "Reading list, notebook/Kindle, accountability partner, dedicated 30-min morning deep-work block.",
      q1Theme: "Foundation, Keystone Habits & Knowledge Baseline",
      q2Theme: "Skill Immersion & Active Deliberate Practice",
      q3Theme: "Integration, Output & Mid-Year Milestone Review",
      q4Theme: "Mastery, Polish & Annual Retrospective",
      habits: ["Read 20 pages", "Listen to educational podcast", "Document 3 insights in journal", "Reflect on weekly lesson"],
    },
    "Health and wellbeing": {
      why: `Prioritizing "${cleanGoal}" energizes the mind and body, increases stamina, and guarantees long-term vitality throughout ${year}.`,
      support: "Nutrition tracking app, gym membership or running shoes, 8-hour sleep schedule, hydration bottle.",
      q1Theme: "Base Conditioning, Sleep Hygiene & Consistent Routine",
      q2Theme: "Intensity Progression & Nutritional Optimization",
      q3Theme: "Endurance Testing, Metric Tracking & Recovery Cycles",
      q4Theme: "Peak Vitality, Sustainable Lifestyle Lock-in",
      habits: ["Drink 2.5L water", "45-min active workout or run", "Prep nutrient-rich lunch", "Lights out by 10:30 PM"],
    },
    "Spiritual life": {
      why: `Deepening "${cleanGoal}" grounds every decision in wisdom, inner peace, and divine purpose for ${year}.`,
      support: "Study Bible / devotional guide, daily prayer notebook, mentor/pastor, quiet morning sanctuary.",
      q1Theme: "Consecration, Stillness & Daily Sacred Rhythm",
      q2Theme: "Scripture Immersion & Spiritual Discipline",
      q3Theme: "Faith in Action, Service & Community Fellowship",
      q4Theme: "Gratitude Overflow, Reflection & Vision Renewal",
      habits: ["15-min morning meditation & prayer", "Read daily scripture chapter", "Journal 3 blessings", "Evening gratitude check"],
    },
    "Career or business": {
      why: `Achieving "${cleanGoal}" expands influence, creates tangible market value, and accelerates financial independence in ${year}.`,
      support: "Project management board, mentor/advisor, professional network, weekly strategic review sessions.",
      q1Theme: "Market Research, Strategy Alignment & High-Impact Quick Wins",
      q2Theme: "Aggressive Execution, Sales/Client Acquisition & Skill Polish",
      q3Theme: "Systemization, Automation & Team / Resource Scaling",
      q4Theme: "Revenue Maximization, Milestone Deliverables & Next-Year Roadmap",
      habits: ["Complete high-priority frog task first", "Send 3 outreach / networking emails", "Review daily metrics & KPIs", "Clean inbox and plan tomorrow"],
    },
    "Financial": {
      why: `Reaching "${cleanGoal}" delivers peace of mind, eliminates monetary friction, and builds generational stewardship in ${year}.`,
      support: "Budgeting spreadsheet or app, investment account, financial advisor/books, automated savings transfers.",
      q1Theme: "Audit Current Cashflow, Eliminate Waste & Automate Savings",
      q2Theme: "Income Stream Diversification & High-Yield Asset Allocation",
      q3Theme: "Debt Snowball Progress & Mid-Year Net Worth Calculation",
      q4Theme: "Tax Planning, Year-End Surplus Optimization & Reinvestment",
      habits: ["Track every daily expense", "Review daily balance & budget limits", "Execute weekly savings sweep", "Zero impulsive unbudgeted purchases"],
    },
    "Family and relationships": {
      why: `Fostering "${cleanGoal}" protects what matters most, nurturing love, loyalty, and deep memories in ${year}.`,
      support: "Shared family calendar, weekly date night schedule, unplugged evening routine, honest communication agreements.",
      q1Theme: "Reconnection, Quality Presence & Relationship Boundaries",
      q2Theme: "Intentional Experiences, Shared Goals & Weekend Retreats",
      q3Theme: "Deep Conversations, Active Listening & Conflict Resolution",
      q4Theme: "Holiday Celebrations, Family Traditions & Heartfelt Gratitude",
      habits: ["Unplug phone during dinner", "Express genuine verbal appreciation", "Call or message a loved one", "Evening family check-in"],
    },
    "Community and impact": {
      why: `Fulfilling "${cleanGoal}" enriches the community, serves those in need, and leaves an enduring legacy in ${year}.`,
      support: "Charity or nonprofit partners, volunteering calendar, community peers, donation budget.",
      q1Theme: "Identify Needs, Select Partner Initiatives & First Volunteer Shift",
      q2Theme: "Mentorship Engagement & Grassroots Action",
      q3Theme: "Fundraising, Group Mobilization & Tangible Impact Milestones",
      q4Theme: "Annual Impact Report, Celebration & Long-Term Advocacy",
      habits: ["Perform 1 random act of kindness", "Engage with community group", "Share helpful knowledge or resources", "Support a local cause"],
    },
    "Rest and joy": {
      why: `Embracing "${cleanGoal}" prevents burnout, restores creative vitality, and brings genuine joy to life in ${year}.`,
      support: "Vacation booking, leisure reading list, hobby toolkit, non-negotiable Sabbath time.",
      q1Theme: "Create Rest Sanctuary, Digital Detox & Weekly Sabbath Routine",
      q2Theme: "Explore New Creative Hobbies & Spring Micro-Adventures",
      q3Theme: "Mid-Year Vacation, Unplugged Nature Retreat & Play",
      q4Theme: "Winter Cozy Recharge, Celebration & Restorative Quietude",
      habits: ["1 hour of pure play or hobby", "Evening stroll without headphones", "Read uplifting fiction / art", "Celebrate today's win"],
    },
  };

  const t = areaTemplates[area] || areaTemplates["Personal growth"];

  const sampleWeek: DecomposedWeek = {
    topPriorities: [
      `Prioritize primary action step for "${cleanGoal.substring(0, 40)}"`,
      "Maintain daily tracking habit Monday through Sunday",
      "Conduct Sunday evening weekly review and preview next week",
    ],
    days: {
      monday: `Set intention & kick off week: ${t.habits[0] || "Review goals"}`,
      tuesday: `Focused execution block: ${t.habits[1] || "Core practice"}`,
      wednesday: `Midweek progress check: ${t.habits[2] || "Track metrics"}`,
      thursday: `Overcome friction & stay consistent: ${t.habits[0] || "Deep session"}`,
      friday: `Wrap up week deliverables & tidy workspace: ${t.habits[1] || "Review wins"}`,
      saturday: `Active joy, recovery & lighter reflection: ${t.habits[3] || "Rest & reflect"}`,
      sunday: `Sunday Reset: review past 7 days, plan upcoming week's top 3`,
    },
    carryForward: "Keep the momentum going. Consistency compounds exponentially over 52 weeks.",
  };

  const monthPlans: Record<number, DecomposedMonth> = {};

  for (let m = 1; m <= 12; m++) {
    const q = Math.ceil(m / 3);
    const monthName = MONTH_NAMES_FULL[m - 1];
    const keyGoals = [
      `Achieve Month ${m} milestone toward "${cleanGoal.substring(0, 45)}"`,
      `Maintain minimum 80% habit consistency throughout ${monthName}`,
      `Complete targeted milestone for Quarter ${q}`,
    ];
    const todos = [
      `Audit progress on the 1st of ${monthName}`,
      `Execute key tactical sprint in week 2`,
      `Prepare end-of-month self-assessment`,
    ];
    const weeks = generateWeeklyPlansForMonth(
      cleanGoal,
      m,
      monthName,
      q,
      keyGoals,
      todos,
      t.habits,
      m === 1 ? sampleWeek : undefined,
      year
    );
    monthPlans[m] = {
      keyGoals,
      todos,
      notes: `Focus on Quarter ${q} milestone alignment. Steady execution beats sporadic intensity.`,
      weeks,
    };
  }

  return {
    whyItMatters: t.why,
    supportNeeded: t.support,
    milestones: {
      q1: `Establish consistent keystone routines and complete foundational milestone for "${cleanGoal.substring(0, 40)}" by March 31.`,
      q2: `Build measurable acceleration, achieve 50% milestone target, and expand scope by June 30.`,
      q3: `Refine systems, overcome mid-year plateaus, and hit 75% target by September 30.`,
      q4: `Deliver full breakthrough for "${cleanGoal.substring(0, 40)}", consolidate gains, and celebrate by December 31.`,
    },
    quarterPlans: {
      1: {
        theme: t.q1Theme,
        month1: [`Set up tracking systems for ${cleanGoal}`, "Audit current baseline", "Establish daily 20-min block"],
        month2: ["Increase consistency to 5 days/week", "Eliminate top friction point", "Check mid-Q1 velocity"],
        month3: ["Complete Q1 milestone evaluation", "Adjust schedule for spring", "Celebrate initial progress"],
      },
      2: {
        theme: t.q2Theme,
        month1: ["Launch phase 2 core deliverables", "Introduce advanced techniques", "Weekly accountability check"],
        month2: ["Push through difficulty curve", "Review metrics with mentor", "Refine weekly plan"],
        month3: ["Mid-year halfway milestone review", "Audit time allocation", "Consolidate Q2 victories"],
      },
      3: {
        theme: t.q3Theme,
        month1: ["Re-energize focus post-summer", "Scale up execution intensity", "Track key ratios"],
        month2: ["Tackle toughest obstacle", "Double down on what works", "Eliminate distractions"],
        month3: ["Q3 finish line push", "Document key lessons learned", "Prepare final sprint plan"],
      },
      4: {
        theme: t.q4Theme,
        month1: ["Begin 90-day final sprint", "Lock in daily non-negotiables", "Optimize environment"],
        month2: ["Surpass 90% completion mark", "Finalize core project or outcome", "Express gratitude to mentors"],
        month3: ["Full annual review of goal", "Celebrate complete victory in " + year, "Draft vision for next year"],
      },
    },
    monthPlans,
    sampleWeek,
    source: "smart-engine",
  };
}

// --------------------------------------------------------------------------
// Master Decomposition Dispatcher (Environment Variable Driven)
// --------------------------------------------------------------------------
export async function decomposeGoal(
  area: LifeArea,
  goalText: string,
  year: number = 2026
): Promise<DecomposedPlan> {
  const cleanGoal = goalText.trim() || `Excel in ${area}`;

  // Read API keys strictly from background Vercel / server environment variables
  const deepseekKey = (process.env.DEEPSEEK_API_KEY || "").trim();
  const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

  const apiKey = deepseekKey || openaiKey;
  const resolvedProvider: "deepseek" | "openai" = deepseekKey ? "deepseek" : "openai";

  if (apiKey) {
    try {
      const systemPrompt = `You are a world-class executive life planner and goal decomposition strategist.
Given a user's yearly goal in a specific Life Area, decompose it into a comprehensive, realistic, and inspiring annual plan.
Respond ONLY with a JSON object matching this TypeScript interface:
{
  "whyItMatters": string,
  "supportNeeded": string,
  "milestones": {
    "q1": string,
    "q2": string,
    "q3": string,
    "q4": string
  },
  "quarterPlans": {
    "1": { "theme": string, "month1": string[], "month2": string[], "month3": string[] },
    "2": { "theme": string, "month1": string[], "month2": string[], "month3": string[] },
    "3": { "theme": string, "month1": string[], "month2": string[], "month3": string[] },
    "4": { "theme": string, "month1": string[], "month2": string[], "month3": string[] }
  },
  "monthPlans": {
    "1": { "keyGoals": string[], "todos": string[], "notes": string },
    ...
    "12": { "keyGoals": string[], "todos": string[], "notes": string }
  },
  "sampleWeek": {
    "topPriorities": string[],
    "days": {
      "monday": string,
      "tuesday": string,
      "wednesday": string,
      "thursday": string,
      "friday": string,
      "saturday": string,
      "sunday": string
    },
    "carryForward": string
  }
}
Do NOT include monthly review fields; the user will reflect and fill those in personally.`;

      const userPrompt = `Life Area: ${area}
Year: ${year}
Yearly Goal: "${cleanGoal}"

Please intelligently decompose this yearly goal into:
1. Why it matters & Support/Resources needed
2. Milestone progression for Q1, Q2, Q3, Q4
3. Detailed quarterly focus with themes and 3 action items per month
4. 12 Monthly plans (Months 1 to 12) with key goals and todos
5. Actionable Weekly plan (Monday through Sunday) for the initial week`;

      const aiResult = await callLlmApi(userPrompt, systemPrompt, apiKey, resolvedProvider);
      if (aiResult && aiResult.milestones && aiResult.quarterPlans) {
        // Area archetypes for fallback habits
        const areaProfiles: Record<string, string[]> = {
          "Personal growth": ["Read 20 pages", "Listen to educational podcast", "Document 3 insights in journal", "Reflect on weekly lesson"],
          "Health and wellbeing": ["Drink 2.5L water", "45-min active workout or run", "Prep nutrient-rich lunch", "Lights out by 10:30 PM"],
          "Spiritual life": ["15-min morning meditation & prayer", "Read daily scripture chapter", "Journal 3 blessings", "Evening gratitude check"],
          "Career or business": ["Complete high-priority frog task first", "Send 3 outreach / networking emails", "Review daily metrics & KPIs", "Clean inbox and plan tomorrow"],
          "Financial": ["Track every daily expense", "Review daily balance & budget limits", "Execute weekly savings sweep", "Zero impulsive unbudgeted purchases"],
          "Family and relationships": ["Unplug phone during dinner", "Express genuine verbal appreciation", "Call or message a loved one", "Evening family check-in"],
          "Community and impact": ["Perform 1 random act of kindness", "Engage with community group", "Share helpful knowledge or resources", "Support a local cause"],
          "Rest and joy": ["1 hour of pure play or hobby", "Evening stroll without headphones", "Read uplifting fiction / art", "Celebrate today's win"],
        };
        const habits = areaProfiles[area] || areaProfiles["Personal growth"];

        // Synthesize full 12-month weekly planners (Weeks 1 to 5 for every month)
        const enrichedMonthPlans: Record<number, DecomposedMonth> = {};
        for (let m = 1; m <= 12; m++) {
          const mp = aiResult.monthPlans?.[m] || {};
          const q = Math.ceil(m / 3);
          const monthName = MONTH_NAMES_FULL[m - 1];
          const keyGoals = mp.keyGoals || [`Achieve Month ${m} milestone toward "${cleanGoal.substring(0, 40)}"`];
          const todos = mp.todos || [`Execute tactical steps for ${monthName}`];
          const weeks = mp.weeks || generateWeeklyPlansForMonth(
            cleanGoal,
            m,
            monthName,
            q,
            keyGoals,
            todos,
            habits,
            m === 1 ? aiResult.sampleWeek : undefined,
            year
          );
          enrichedMonthPlans[m] = {
            keyGoals,
            todos,
            notes: mp.notes || `Focus on Quarter ${q} milestone alignment. Steady execution beats sporadic intensity.`,
            weeks,
          };
        }

        return {
          ...aiResult,
          monthPlans: enrichedMonthPlans,
          sampleWeek: aiResult.sampleWeek,
          source: resolvedProvider,
        };
      }
    } catch (err) {
      console.warn("LLM API decomposition call failed, falling back to smart heuristics:", err);
    }
  }

  // Fallback to high-quality heuristic decomposition
  return generateSmartHeuristicDecomposition(area, cleanGoal, year);
}
