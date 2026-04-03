"use client";

import { useState, useCallback } from "react";

type Sensitivity = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED" | "TOP_SECRET";
type Scope = "read" | "write" | "delete" | "execute";

interface Event {
  id: number;
  sensitivity: Sensitivity;
  scopesBefore: Scope[];
  scopesAfter: Scope[];
  removed: Scope[];
  timestamp: string;
}

const SENSITIVITY_LEVELS: Record<Sensitivity, number> = {
  PUBLIC: 0,
  INTERNAL: 1,
  CONFIDENTIAL: 2,
  RESTRICTED: 3,
  TOP_SECRET: 4,
};

const SENSITIVITY_COLORS: Record<Sensitivity, string> = {
  PUBLIC: "text-green-400 border-green-400/30 bg-green-400/10",
  INTERNAL: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  CONFIDENTIAL: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  RESTRICTED: "text-red-400 border-red-400/30 bg-red-400/10",
  TOP_SECRET: "text-red-500 border-red-500/30 bg-red-500/10",
};

const SCOPE_META: Record<Scope, { label: string; icon: string; color: string }> = {
  read: { label: "READ", icon: "👁", color: "border-green-500 bg-green-500/20 text-green-300" },
  write: { label: "WRITE", icon: "✏️", color: "border-blue-500 bg-blue-500/20 text-blue-300" },
  delete: { label: "DELETE", icon: "🗑", color: "border-amber-500 bg-amber-500/20 text-amber-300" },
  execute: { label: "EXECUTE", icon: "⚡", color: "border-red-500 bg-red-500/20 text-red-300" },
};

const SCENARIOS: { label: string; description: string; sensitivity: Sensitivity }[] = [
  { label: "Read Public API", description: "Agent fetches public docs", sensitivity: "PUBLIC" },
  { label: "Read Internal Wiki", description: "Agent reads internal docs", sensitivity: "INTERNAL" },
  { label: "Read HR Database", description: "Agent accesses employee PII", sensitivity: "CONFIDENTIAL" },
  { label: "Read Medical Records", description: "Agent reads HIPAA data", sensitivity: "RESTRICTED" },
];

function narrowScopes(scopes: Scope[], sensitivity: Sensitivity): Scope[] {
  const level = SENSITIVITY_LEVELS[sensitivity];
  if (level >= SENSITIVITY_LEVELS.RESTRICTED) {
    return scopes.filter((s) => s === "read");
  }
  if (level >= SENSITIVITY_LEVELS.CONFIDENTIAL) {
    return scopes.filter((s) => s !== "delete" && s !== "execute");
  }
  return [...scopes];
}

export default function RatchetDemo() {
  const [scopes, setScopes] = useState<Scope[]>(["read", "write", "delete", "execute"]);
  const [highWater, setHighWater] = useState<Sensitivity>("PUBLIC");
  const [events, setEvents] = useState<Event[]>([]);
  const [removingScopes, setRemovingScopes] = useState<Set<Scope>>(new Set());
  const [restoreAttempt, setRestoreAttempt] = useState(false);
  const [eventCounter, setEventCounter] = useState(0);

  const handleAccess = useCallback(
    (sensitivity: Sensitivity) => {
      const newHighWater =
        SENSITIVITY_LEVELS[sensitivity] > SENSITIVITY_LEVELS[highWater] ? sensitivity : highWater;
      const newScopes = narrowScopes(scopes, sensitivity);
      const removed = scopes.filter((s) => !newScopes.includes(s));

      if (removed.length > 0) {
        setRemovingScopes(new Set(removed));
        setTimeout(() => {
          setScopes(newScopes);
          setRemovingScopes(new Set());
        }, 500);
      }

      setHighWater(newHighWater);
      const newId = eventCounter + 1;
      setEventCounter(newId);
      setEvents((prev) => [
        {
          id: newId,
          sensitivity,
          scopesBefore: [...scopes],
          scopesAfter: newScopes,
          removed,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    },
    [scopes, highWater, eventCounter]
  );

  const handleRestore = useCallback(() => {
    setRestoreAttempt(true);
    setTimeout(() => setRestoreAttempt(false), 800);
  }, []);

  const handleReset = useCallback(() => {
    setScopes(["read", "write", "delete", "execute"]);
    setHighWater("PUBLIC");
    setEvents([]);
    setRemovingScopes(new Set());
    setEventCounter(0);
  }, []);

  const allScopes: Scope[] = ["read", "write", "delete", "execute"];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Permission display */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider text-zinc-500">
            Agent Permissions
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">High-Water Mark:</span>
            <span
              className={`px-2 py-0.5 rounded border text-xs font-bold ${SENSITIVITY_COLORS[highWater]}`}
            >
              {highWater}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {allScopes.map((scope) => {
            const active = scopes.includes(scope) && !removingScopes.has(scope);
            const removing = removingScopes.has(scope);
            const revoked = !scopes.includes(scope) && !removing;
            const meta = SCOPE_META[scope];

            return (
              <div
                key={scope}
                className={`
                  relative p-4 rounded-lg border-2 text-center transition-all duration-300
                  ${removing ? "animate-shrink-out" : ""}
                  ${active ? meta.color : ""}
                  ${revoked ? "border-zinc-800 bg-zinc-900/50 opacity-30" : ""}
                  ${restoreAttempt && revoked ? "animate-lock-shake" : ""}
                `}
              >
                <div className="text-2xl mb-2">{meta.icon}</div>
                <div className="text-sm font-bold tracking-wider">{meta.label}</div>
                {revoked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl opacity-60">🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Invariant display */}
        <div className="mt-4 p-3 rounded border border-zinc-800 bg-zinc-900/50 font-mono text-xs">
          <div className="flex gap-6">
            <span>
              <span className="text-zinc-500">HW(t):</span>{" "}
              <span className="text-amber-400">{SENSITIVITY_LEVELS[highWater]}</span>
              <span className="text-zinc-600"> ≥ HW(t-1)</span>
            </span>
            <span>
              <span className="text-zinc-500">|P(t)|:</span>{" "}
              <span className="text-green-400">{scopes.length}</span>
              <span className="text-zinc-600"> ⊆ P(t-1)</span>
            </span>
            <span>
              <span className="text-zinc-500">Irreversible:</span>{" "}
              <span className="text-red-400">true</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-4">
          Simulate Agent Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {SCENARIOS.map((scenario) => {
            const disabled =
              scopes.length === 1 &&
              SENSITIVITY_LEVELS[scenario.sensitivity] >= SENSITIVITY_LEVELS.RESTRICTED;
            return (
              <button
                key={scenario.label}
                onClick={() => handleAccess(scenario.sensitivity)}
                className={`
                  p-3 rounded-lg border text-left transition-all
                  ${SENSITIVITY_COLORS[scenario.sensitivity]}
                  hover:brightness-125 active:scale-[0.98]
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="text-sm font-bold">{scenario.label}</div>
                <div className="text-xs opacity-70 mt-1">{scenario.description}</div>
                <div className="text-[10px] mt-1 opacity-50">
                  Sensitivity: {scenario.sensitivity}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleRestore}
            className={`
              flex-1 p-3 rounded-lg border border-red-900/50 bg-red-950/30 text-red-400
              text-sm font-bold cursor-pointer hover:bg-red-950/50 transition-all
              ${restoreAttempt ? "animate-pulse-red" : ""}
            `}
          >
            🔓 Try to Restore Permissions
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-lg border border-zinc-800 text-zinc-500 text-sm cursor-pointer hover:border-zinc-600 transition-all"
          >
            Reset Demo
          </button>
        </div>

        {restoreAttempt && (
          <div className="mt-3 p-3 rounded border border-red-900 bg-red-950/50 text-red-400 text-sm animate-slide-in">
            <span className="font-bold">DENIED</span> — Ratchet is irreversible.
            Removed scopes cannot be restored within a session. This is enforced
            structurally, not by policy.
          </div>
        )}
      </div>

      {/* Audit trail */}
      {events.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-4">
            Audit Trail
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded border border-zinc-800 bg-zinc-900/50 text-xs font-mono animate-slide-in"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600">{event.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded border ${SENSITIVITY_COLORS[event.sensitivity]}`}
                  >
                    {event.sensitivity}
                  </span>
                  {event.removed.length > 0 ? (
                    <span className="text-red-400">
                      -{event.removed.map((r) => r.toUpperCase()).join(", -")}
                    </span>
                  ) : (
                    <span className="text-zinc-600">no narrowing</span>
                  )}
                  <span className="text-zinc-600 ml-auto">
                    [{event.scopesAfter.length}/4 scopes]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
