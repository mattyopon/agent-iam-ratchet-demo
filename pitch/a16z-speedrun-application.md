# a16z Speedrun SR006 Application — Sensitivity Ratchet

## Application URL
https://speedrun.a16z.com/apply

## Deadline
2026年5月17日 11:59pm PT（日本時間5月18日 午後）

---

## Video Pitch Script (if requested, ~2 min)

Same structure as YC but expanded:

**[0:00-0:15] Hook**
"In 2025, Microsoft Copilot, Salesforce AgentForce, and Slack AI all had the same vulnerability. An AI agent read confidential data — and then wrote it somewhere it shouldn't."

**[0:15-0:40] Problem**
"Every AI agent framework gives agents broad permissions — read, write, delete, execute — and never narrows them. RBAC was designed 30 years ago for human users who make conscious decisions. AI agents don't. They follow instructions — including malicious ones injected through data."

**[0:40-1:10] Solution + Demo**
*(Screen recording of demo site)*
"The Sensitivity Ratchet is a one-way valve for permissions. Once an agent touches sensitive data, its permissions are irreversibly narrowed. Not by a policy that can be overridden — by code structure that physically cannot be bypassed. Two mathematical invariants hold for every operation: the high-water mark only goes up, the permission set only shrinks."

**[1:10-1:30] Market**
"Every enterprise deploying AI agents needs this. It's not a nice-to-have — it's the missing layer between 'agent can do things' and 'agent is safe to deploy in production.' The AI agent security market is projected to reach $8B by 2028."

**[1:30-1:50] Traction**
"The SDK is already on PyPI. It integrates with LangChain, CrewAI, and OpenAI Agents SDK — the three biggest agent frameworks. I've filed integration requests with all three for official inclusion."

**[1:50-2:00] Ask**
"I'm looking for investment and the a16z network to get Sensitivity Ratchet into every AI agent deployment. The first company to make AI agents trustworthy wins enterprise AI."

---

## Key Differentiators for a16z
- **Technical moat**: Mathematical invariants, no prior art
- **Open source**: Developer adoption first, enterprise upsell second
- **Solo founder with execution speed**: Built SDK + demo + integrations + articles in days, not months
- **Enterprise-ready**: SOC 2 / HIPAA compliance angle for upsell
