# YC S26 Application — Sensitivity Ratchet

## Application URL
https://www.ycombinator.com/apply

## Deadline
2026年5月4日 8pm PT（日本時間5月5日 正午）

---

## 1-Minute Video Script

**[0:00-0:10] 顔出し + 問題提起**
"Hi, I'm Yutaro. AI agents can read your HR database and post the data to Slack. This happened to Microsoft Copilot, Salesforce AgentForce, and Slack AI — all in the last year."

**[0:10-0:25] なぜ既存の解決策では防げないか**
"RBAC doesn't fix this. It grants permissions at session start and never reduces them based on what the agent actually read. Prompt instructions? Bypassable. Output filters? Circumvented. This is a structural problem."

**[0:25-0:45] デモ（画面共有）**
*(agent-iam-ratchet-demo.vercel.app を操作)*
"The Sensitivity Ratchet is a one-way valve. Watch — the agent starts with read, write, delete, execute. It reads HR data... delete and execute are gone. It reads medical records... write is gone. Click 'restore'... denied. Irreversible. Mathematically guaranteed."

**[0:45-0:55] トラクション + ビジネス**
"It's already on PyPI. Integrates with LangChain, CrewAI, and OpenAI Agents SDK. Every enterprise deploying AI agents needs this — it's not a nice-to-have, it's a compliance requirement."

**[0:55-1:00] クロージング**
"Sensitivity Ratchet. One pip install. Zero configuration. Permissions that only shrink."

---

## Application Form Answers (Draft)

### What does your company do?
Sensitivity Ratchet is an open-source SDK that prevents AI agents from exfiltrating sensitive data by irreversibly narrowing their permissions. When an agent reads confidential data, its write/delete/execute permissions are permanently removed — structurally, not by policy.

### Why did you pick this idea?
AI agents are being deployed with broad tool access (read, write, delete, execute) but no mechanism to dynamically restrict permissions based on data sensitivity. This caused real breaches: EchoLeak (CVE-2025-32711, CVSS 9.3) in Microsoft Copilot, ForcedLeak (CVSS 9.4) in Salesforce AgentForce. RBAC is 30 years old and wasn't designed for this. I built the structural fix.

### What's new about what you're making?
Two mathematical invariants that no existing system enforces: (1) the sensitivity high-water mark only increases, (2) the permission set only shrinks. This is enforced in code structure, not policy — it cannot be bypassed at runtime. No prior art exists for this mechanism in AI agent security.

### How do or will you make money?
Open-source SDK (free) → Enterprise features (paid): audit logging, compliance reports (SOC 2, HIPAA), centralized policy management, real-time dashboards. Every company deploying AI agents with access to sensitive data is a customer.

### How far along are you?
- SDK published on PyPI (pip install agent-iam-ratchet)
- Framework integrations: LangChain, CrewAI, OpenAI Agents SDK
- Interactive demo: agent-iam-ratchet-demo.vercel.app
- Issues filed with LangChain, CrewAI, and OpenAI for official integration

### How many founders?
1 (solo founder)

### Technical background
Software engineer at TV Asahi MediaPlex (media industry). Built multiple AI security tools: FaultRay (AI reliability testing), agent-iam (8-dimensional authorization for AI agents). Experience with patent filings and enterprise security requirements.
