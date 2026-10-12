// src/lib/groq.js
// Groq AI Integration & LCCA Mathematical Engine for Muar Road GIS

const CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile"
];

/**
 * Call Groq AI via OpenAI-compatible endpoint
 */
export async function callGroqAi(prompt, systemPrompt = "You are a senior highway and pavement engineer for the Malaysian Public Works Department (JKR).") {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API key is not configured in .env.local (VITE_GROQ_API_KEY).");
  }

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.35,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Groq API responded with HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn(`Groq model ${model} failed, attempting next fallback...`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to communicate with Groq AI.");
}

/**
 * Material profiles and default maintenance percentages
 */
export const MATERIAL_PROFILES = {
  GENERAL: {
    key: "GENERAL",
    name: "Yong Peng Standard Schedule (FT0024)",
    desc: "Fixed schedule from original LCCA sheet with 4 patching events and 1 periodic milling & overlay.",
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    schedulePattern: [
      { yearLabel: "2018", activity: "Initial Construction", assumed: "Actual Construction Cost", pct: 1.00, yearN: 0, isInitial: true },
      { yearLabel: "2019 - 2020", activity: "No Major Maintenance", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "2021", activity: "Corrective Patching for Localized Potholes", assumed: "3% of initial cost", pct: 0.03, yearN: 4 },
      { yearLabel: "2022 - 2023", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "2024", activity: "Corrective Patching for Recurring Localized Defects", assumed: "3% of initial cost", pct: 0.03, yearN: 7 },
      { yearLabel: "2025", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "2026", activity: "Corrective Patching", assumed: "3% of initial cost", pct: 0.03, yearN: 9 },
      { yearLabel: "2027 - 2029", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "2030", activity: "Preventive Maintenance / Crack Treatment", assumed: "3% of initial cost", pct: 0.03, yearN: 13 },
      { yearLabel: "2031 - 2032", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "2033", activity: "Periodic Maintenance – Milling & Overlay", assumed: "15% of initial cost", pct: 0.15, yearN: 16 },
      { yearLabel: "2034 - 2037", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null }
    ]
  },
  CRMA: {
    key: "CRMA",
    name: "CRMA (Crumb Rubber Modified Asphalt)",
    desc: "Rubber-modified bituminous binder. High crack and rut resistance, lowest maintenance ratio.",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    schedulePattern: [
      { yearLabel: "Year 0", activity: "Initial Construction", assumed: "Actual Construction Cost", pct: 1.00, yearN: 0, isInitial: true },
      { yearLabel: "Year 1 - 7", activity: "No Maintenance Required", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 8", activity: "Preventive Maintenance", assumed: "3% of initial cost", pct: 0.03, yearN: 8 },
      { yearLabel: "Year 9 - 15", activity: "No Major Maintenance", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 16", activity: "Periodic Maintenance (Milling & Overlay)", assumed: "15% of initial cost", pct: 0.15, yearN: 16 },
      { yearLabel: "Year 17 - 20", activity: "Routine Monitoring Only", assumed: "-", pct: 0.00, yearN: null }
    ]
  },
  SFM: {
    key: "SFM",
    name: "SFM (Stone Fiber Modified Asphalt)",
    desc: "Fiber-reinforced bituminous mix. High tensile strength, durable against shear distress.",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    schedulePattern: [
      { yearLabel: "Year 0", activity: "Initial Construction", assumed: "Actual Construction Cost", pct: 1.00, yearN: 0, isInitial: true },
      { yearLabel: "Year 1 - 7", activity: "No Maintenance Required", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 8", activity: "Preventive Maintenance", assumed: "3% of initial cost", pct: 0.03, yearN: 8 },
      { yearLabel: "Year 9 - 15", activity: "No Major Maintenance", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 16", activity: "Periodic Maintenance (Milling & Overlay)", assumed: "15% of initial cost", pct: 0.15, yearN: 16 },
      { yearLabel: "Year 17 - 20", activity: "Routine Monitoring Only", assumed: "-", pct: 0.00, yearN: null }
    ]
  },
  CMA: {
    key: "CMA",
    name: "CMA (Crumb Modified Asphalt)",
    desc: "Modified asphalt with recurrent minor localized patching needs.",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    schedulePattern: [
      { yearLabel: "Year 0", activity: "Initial Construction", assumed: "Actual Construction Cost", pct: 1.00, yearN: 0, isInitial: true },
      { yearLabel: "Year 1 - 5", activity: "No Maintenance Required", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 6", activity: "Preventive Maintenance", assumed: "3% of initial cost", pct: 0.03, yearN: 6 },
      { yearLabel: "Year 7 - 10", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 11", activity: "Periodic Maintenance (Milling & Overlay)", assumed: "15% of initial cost", pct: 0.15, yearN: 11 },
      { yearLabel: "Year 12 - 17", activity: "Routine Monitoring Only", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 18", activity: "Preventive Maintenance", assumed: "3% of initial cost", pct: 0.03, yearN: 18 },
      { yearLabel: "Year 19 - 20", activity: "Routine Monitoring Only", assumed: "-", pct: 0.00, yearN: null }
    ]
  },
  LATEX: {
    key: "LATEX",
    name: "LATEX (Polymer Latex Modified Asphalt)",
    desc: "Susceptible to shoving and recurring deformations; requires major rehabilitation earlier.",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    schedulePattern: [
      { yearLabel: "Year 0", activity: "Initial Construction", assumed: "Actual Construction Cost", pct: 1.00, yearN: 0, isInitial: true },
      { yearLabel: "Year 2", activity: "Patching (Shoving & Defect repair)", assumed: "Actual patch basis", pct: 0.005, yearN: 2 },
      { yearLabel: "Year 4", activity: "Major Rehabilitation", assumed: "35% of initial cost", pct: 0.35, yearN: 4 },
      { yearLabel: "Year 5 - 7", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 8", activity: "Corrective Maintenance", assumed: "10% of initial cost", pct: 0.10, yearN: 8 },
      { yearLabel: "Year 9 - 14", activity: "Routine Monitoring", assumed: "-", pct: 0.00, yearN: null },
      { yearLabel: "Year 15", activity: "Periodic Maintenance", assumed: "10% of initial cost", pct: 0.10, yearN: 15 },
      { yearLabel: "Year 16 - 20", activity: "Routine Monitoring Only", assumed: "-", pct: 0.00, yearN: null }
    ]
  }
};

/**
 * Calculate LCCA rows, factors, and NPV
 */
export function calculateLccaSchedule(materialKey = "GENERAL", initialCost = 1000000, discountRate = 0.04) {
  const profile = MATERIAL_PROFILES[materialKey] || MATERIAL_PROFILES.GENERAL;
  const rows = [];
  let totalMaintenanceCost = 0;
  let totalNpv = 0;

  profile.schedulePattern.forEach(item => {
    let cost = 0;
    let pf = 0;
    let npv = 0;

    if (item.isInitial) {
      cost = initialCost;
      pf = 1.0000;
      npv = initialCost;
    } else if (item.pct > 0 && item.yearN !== null) {
      cost = initialCost * item.pct;
      pf = 1 / Math.pow(1 + discountRate, item.yearN);
      npv = cost * pf;
      totalMaintenanceCost += cost;
    }

    totalNpv += npv;

    rows.push({
      yearLabel: item.yearLabel,
      activity: item.activity,
      assumed: item.assumed,
      pct: item.pct,
      yearN: item.yearN,
      pf: pf,
      cost: cost,
      npv: npv
    });
  });

  return {
    material: profile,
    initialCost,
    discountRate,
    totalMaintenanceCost,
    totalCashOutflow: initialCost + totalMaintenanceCost,
    totalNpv,
    costRatio: totalMaintenanceCost / (initialCost || 1),
    rows
  };
}
