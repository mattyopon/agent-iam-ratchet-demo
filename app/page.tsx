import RatchetDemo from "./components/RatchetDemo";
import AttackDemo from "./components/AttackDemo";

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="font-bold tracking-tight">Sensitivity Ratchet</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#demo" className="text-zinc-400 hover:text-white transition-colors">
              Demo
            </a>
            <a href="#how" className="text-zinc-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#install" className="text-zinc-400 hover:text-white transition-colors">
              Install
            </a>
            <a
              href="https://github.com/mattyopon/agent-iam-ratchet"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold tracking-wider mb-6">
            OPEN SOURCE — MIT LICENSE
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            AI permissions that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              only shrink.
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-4">
            Once an AI agent reads sensitive data, its write and execute permissions are
            permanently removed. No API call, no override, no rollback can restore them.
          </p>
          <p className="text-sm text-zinc-600 font-mono mb-10">
            P(t) ⊆ P(t-1) for all t — mathematically guaranteed
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#demo"
              className="px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-all"
            >
              Try the Demo
            </a>
            <a
              href="#install"
              className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all font-mono text-sm flex items-center"
            >
              pip install agent-iam-ratchet
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The Problem</h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
            AI agents with broad permissions can silently exfiltrate sensitive data.
            RBAC grants permissions at session start and never reduces them based on what the agent actually accessed.
          </p>
          <AttackDemo />
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Interactive Demo</h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
            Click the buttons below to simulate an AI agent accessing data at different sensitivity levels.
            Watch the permissions shrink — and try to restore them.
          </p>
          <RatchetDemo />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="text-3xl mb-3">📐</div>
              <h3 className="font-bold mb-2">Two Invariants</h3>
              <p className="text-sm text-zinc-400">
                High-water mark only increases. Permission set only shrinks.
                These hold for every operation, no exceptions.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-bold mb-2">Structural Enforcement</h3>
              <p className="text-sm text-zinc-400">
                Not a policy check. Not a prompt instruction. The narrowing is
                implemented in code that cannot be bypassed at runtime.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-bold mb-2">Delegation Safe</h3>
              <p className="text-sm text-zinc-400">
                Child agents inherit the parent&apos;s ratchet state. A sub-agent
                spawned after CONFIDENTIAL access cannot obtain delete permissions.
              </p>
            </div>
          </div>

          {/* Narrowing diagram */}
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30 font-mono text-sm">
            <div className="text-zinc-500 mb-4">// Narrowing rules</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-400 w-32">PUBLIC</span>
                <span className="text-zinc-600">→</span>
                <span className="text-zinc-300">No change</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 w-32">INTERNAL</span>
                <span className="text-zinc-600">→</span>
                <span className="text-zinc-300">No change</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-400 w-32">CONFIDENTIAL</span>
                <span className="text-zinc-600">→</span>
                <span className="text-red-400 line-through">delete</span>
                <span className="text-red-400 line-through">execute</span>
                <span className="text-zinc-500">removed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 w-32">RESTRICTED+</span>
                <span className="text-zinc-600">→</span>
                <span className="text-red-400 line-through">write</span>
                <span className="text-red-400 line-through">delete</span>
                <span className="text-red-400 line-through">execute</span>
                <span className="text-zinc-500">removed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started in 30 Seconds</h2>

          <div className="space-y-6">
            <CodeBlock
              code={`pip install agent-iam-ratchet`}
            />

            <CodeBlock
              code={`from agent_iam_ratchet import RatchetSession, Sensitivity

session = RatchetSession(scopes=["read:*", "write:*", "delete:*", "execute:*"])

# Agent reads a confidential document
session.access(Sensitivity.CONFIDENTIAL)
print(session.effective_scopes)
# frozenset({'read:*', 'write:*'})  ← delete + execute gone forever

# Agent reads restricted data
session.access(Sensitivity.RESTRICTED)
print(session.effective_scopes)
# frozenset({'read:*'})  ← write gone forever

# Try to get permissions back by reading public data
session.access(Sensitivity.PUBLIC)
print(session.effective_scopes)
# frozenset({'read:*'})  ← still read-only. Irreversible.`}
            />

            <h3 className="text-xl font-bold mt-10 mb-4">Framework Integrations</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <h4 className="font-bold text-sm mb-2">LangChain</h4>
                <code className="text-xs text-zinc-400">pip install &apos;agent-iam-ratchet[langchain]&apos;</code>
              </div>
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <h4 className="font-bold text-sm mb-2">CrewAI</h4>
                <code className="text-xs text-zinc-400">pip install &apos;agent-iam-ratchet[crewai]&apos;</code>
              </div>
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <h4 className="font-bold text-sm mb-2">OpenAI Agents SDK</h4>
                <code className="text-xs text-zinc-400">pip install &apos;agent-iam-ratchet[openai-agents]&apos;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop sensitivity mixing attacks.
          </h2>
          <p className="text-zinc-400 mb-8">
            One line of code. Zero configuration. Mathematically irreversible.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com/mattyopon/agent-iam-ratchet"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-all"
            >
              View on GitHub
            </a>
            <a
              href="https://pypi.org/project/agent-iam-ratchet/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all"
            >
              PyPI Package
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span>Sensitivity Ratchet — Open Source (MIT License)</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
}
