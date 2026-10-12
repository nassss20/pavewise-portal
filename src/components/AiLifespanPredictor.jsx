import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, Info, Zap } from "lucide-react";
import { callGroqAi } from "../lib/groq";

export default function AiLifespanPredictor({ materialName, scheduleData }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPrediction(null);
    setError(null);
  }, [materialName, scheduleData]);

  const generatePrediction = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const scheduleText = scheduleData.map(item =>
      `Year ${item.year}: ${item.activity} (Cost: RM ${item.cost})`
    ).join("\n");
    const prompt = `You are a Civil Engineering AI assistant specializing in pavement asset management. I have a 20-year Life Cycle Cost Analysis (LCCA) maintenance schedule for a road pavement material called "${materialName}".

Schedule:
${scheduleText}

Based on this schedule, predict how long this material is typically expected to remain in "Good" condition before the FIRST major recurring defect, periodic maintenance, or significant corrective patching occurs.

IMPORTANT FORMATTING RULES:
- Format your response strictly as 3 bullet points starting with "- "
- Do NOT write paragraphs
- Keep each bullet point concise and clear

Example structure:
- **Estimated Lifespan**: [X years] before significant maintenance is needed
- **Key Distress / Maintenance Trigger**: [brief observation from schedule]
- **Engineering Recommendation**: [actionable recommendation]`;

    try {
      const responseText = await callGroqAi(
        prompt,
        "You are a civil engineering expert for Malaysian road authorities. Always format responses in clean bullet points."
      );
      setPrediction(responseText);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate AI prediction.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render bullet points cleanly and format **bold** text without showing raw asterisks
  const renderFormattedPrediction = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter(l => l.trim().length > 0);
    return (
      <ul className="space-y-2 text-[15px] text-slate-800 dark:text-slate-200 leading-relaxed">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[-*•]\s*/, "");
          const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold mt-0.5 text-[15px]">•</span>
              <div>
                {parts.map((part, pIdx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={pIdx} className="font-semibold text-cyan-950 dark:text-cyan-200">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/50">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-2 mb-1">
            <Zap size={16} className="text-cyan-500 fill-current" />
            AI Prediction
            <span className="text-[13px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              LPU Accelerated
            </span>
          </h3>
          <p className="text-[15px] text-cyan-700/80 dark:text-cyan-400/80">
            Estimate how long {materialName} may remain in good condition before significant maintenance.
          </p>
        </div>
        <button
          type="button"
          onClick={generatePrediction}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-60 text-white text-[15px] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Generating..." : prediction ? "Generate Again" : "Generate Prediction"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-[15px]">
          {error}
        </p>
      )}

      {prediction && (
        <div className="mt-3 p-4 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-cyan-100 dark:border-cyan-800/50 flex items-start gap-3">
          <Info size={16} className="text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            {renderFormattedPrediction(prediction)}
          </div>
        </div>
      )}
    </section>
  );
}