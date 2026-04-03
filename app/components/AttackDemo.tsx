"use client";

import { useState } from "react";

interface Step {
  id: number;
  action: string;
  detail: string;
  status: "pending" | "running" | "success" | "blocked";
}

const WITHOUT_RATCHET: Step[] = [
  { id: 1, action: "Agent starts", detail: "Scopes: read:*, write:*, delete:*, execute:*", status: "pending" },
  { id: 2, action: "Read HR database", detail: "SELECT * FROM employees WHERE salary > 100000", status: "pending" },
  { id: 3, action: "Write to Slack", detail: 'POST /api/chat.postMessage { channel: "#general", text: "Top earners: ..." }', status: "pending" },
  { id: 4, action: "Data exfiltrated", detail: "Confidential salary data leaked to public channel", status: "pending" },
];

const WITH_RATCHET: Step[] = [
  { id: 1, action: "Agent starts", detail: "Scopes: read:*, write:*, delete:*, execute:*", status: "pending" },
  { id: 2, action: "Read HR database", detail: "CONFIDENTIAL access → ratchet narrows to {read:*, write:*}", status: "pending" },
  { id: 3, action: "Read medical records", detail: "RESTRICTED access → ratchet narrows to {read:*}", status: "pending" },
  { id: 4, action: "Write to Slack", detail: "BLOCKED — write:* was irreversibly removed", status: "pending" },
];

function StepRow({ step }: { step: Step }) {
  const colors = {
    pending: "border-zinc-800 text-zinc-600",
    running: "border-blue-500/50 bg-blue-500/5 text-blue-300",
    success: "border-green-500/50 bg-green-500/5 text-green-300",
    blocked: "border-red-500/50 bg-red-500/5 text-red-400",
  };
  const icons = {
    pending: "○",
    running: "◉",
    success: "✓",
    blocked: "✕",
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-300 ${colors[step.status]} ${step.status !== "pending" ? "animate-slide-in" : "opacity-40"}`}
    >
      <div className="flex items-center gap-2 text-sm font-bold">
        <span className="w-5 text-center">{icons[step.status]}</span>
        {step.action}
      </div>
      <div className="text-xs mt-1 ml-7 opacity-70 font-mono">{step.detail}</div>
    </div>
  );
}

export default function AttackDemo() {
  const [withoutSteps, setWithoutSteps] = useState(WITHOUT_RATCHET);
  const [withSteps, setWithSteps] = useState(WITH_RATCHET);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runDemo = () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setWithoutSteps(WITHOUT_RATCHET);
    setWithSteps(WITH_RATCHET);

    const finalStatuses = {
      without: ["success", "success", "success", "success"] as const,
      with: ["success", "success", "success", "blocked"] as const,
    };

    [0, 1, 2, 3].forEach((i) => {
      setTimeout(() => {
        setWithoutSteps((prev) =>
          prev.map((s, j) =>
            j === i ? { ...s, status: "running" } : j < i ? { ...s, status: finalStatuses.without[j] } : s
          )
        );
        setWithSteps((prev) =>
          prev.map((s, j) =>
            j === i ? { ...s, status: "running" } : j < i ? { ...s, status: finalStatuses.with[j] } : s
          )
        );
      }, i * 1200);

      setTimeout(() => {
        setWithoutSteps((prev) =>
          prev.map((s, j) => (j <= i ? { ...s, status: finalStatuses.without[j] } : s))
        );
        setWithSteps((prev) =>
          prev.map((s, j) => (j <= i ? { ...s, status: finalStatuses.with[j] } : s))
        );
        if (i === 3) {
          setRunning(false);
          setDone(true);
        }
      }, i * 1200 + 800);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Without Ratchet */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h3 className="text-sm uppercase tracking-wider text-red-400 font-bold">
              Without Ratchet
            </h3>
          </div>
          <div className="space-y-2">
            {withoutSteps.map((step) => (
              <StepRow key={step.id} step={step} />
            ))}
          </div>
          {done && (
            <div className="mt-3 p-3 rounded border border-red-900 bg-red-950/50 text-red-400 text-sm animate-slide-in">
              Data breach: confidential PII leaked to public channel
            </div>
          )}
        </div>

        {/* With Ratchet */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h3 className="text-sm uppercase tracking-wider text-green-400 font-bold">
              With Sensitivity Ratchet
            </h3>
          </div>
          <div className="space-y-2">
            {withSteps.map((step) => (
              <StepRow key={step.id} step={step} />
            ))}
          </div>
          {done && (
            <div className="mt-3 p-3 rounded border border-green-900 bg-green-950/50 text-green-400 text-sm animate-slide-in">
              Exfiltration blocked. Agent can still read, but cannot write.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={runDemo}
          disabled={running}
          className={`
            px-8 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer
            ${running
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
            }
          `}
        >
          {running ? "Running..." : done ? "Run Again" : "▶ Run Attack Simulation"}
        </button>
      </div>
    </div>
  );
}
