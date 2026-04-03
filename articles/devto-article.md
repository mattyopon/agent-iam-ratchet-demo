---
title: "5 Real AI Agent Data Breaches That RBAC Can't Prevent"
published: true
tags: ai, security, python, llm
---

## AI Agents Can Read Your Secrets — Then Write Them Anywhere

In 2024-2025, a pattern emerged across AI agent security incidents: **agents that read sensitive data retain the ability to write it to lower-sensitivity channels**.

Traditional RBAC grants permissions at session start and **never narrows them based on what the agent actually accessed**. This structural flaw — which I call **sensitivity mixing** — is the root cause behind every incident below.

---

## Incident 1: EchoLeak — Microsoft 365 Copilot (CVE-2025-32711, CVSS 9.3)

A zero-click attack. The attacker sends a crafted email. Copilot reads it, follows the embedded instructions, and exfiltrates the victim's M365 data to an external server. Microsoft's XPIA classifier, external link removal, and CSP were all bypassed.

**Root cause**: Copilot retained write-to-external capability after reading confidential emails.

[Source: Hack The Box](https://www.hackthebox.com/blog/cve-2025-32711-echoleak-copilot-vulnerability)

## Incident 2: Slack AI Exfiltration (August 2024)

RAG poisoning + prompt injection. Attacker posts a malicious message in a Slack channel. Slack AI reads private channel data and leaks it in its response to the attacker.

**Root cause**: AI retained public write access after reading private channel data.

[Source: OWASP GenAI](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

## Incident 3: ForcedLeak — Salesforce AgentForce (CVSS 9.4)

Indirect prompt injection allows external attackers to exfiltrate CRM customer PII through AgentForce.

**Root cause**: No trust boundary between user instructions and external data; write permissions persisted after reading confidential CRM records.

[Source: Noma Security](https://noma.security/blog/forcedleak-agent-risks-exposed-in-salesforce-agentforce/)

## Incident 4: Log-To-Leak via MCP (Academic, 2025)

A malicious MCP server installs a logging tool that the agent voluntarily calls. User queries, tool responses, and agent answers are all exfiltrated. Verified on GPT-4o, Claude Sonnet, and 3 others.

**Root cause**: Agents could call arbitrary external tools after accessing sensitive data.

[Source: OpenReview](https://openreview.net/forum?id=UVgbFuXPaO)

## Incident 5: Semantic Privilege Escalation (AI Confused Deputy)

AI agents operate on natural language where "data" and "instructions" are indistinguishable. External data containing embedded instructions gets executed as commands — the classic Confused Deputy, now in AI form.

[Source: Acuvity](https://acuvity.ai/semantic-privilege-escalation-the-agent-security-threat-hiding-in-plain-sight/) | [arXiv](https://arxiv.org/html/2601.11893v1)

---

## The Structural Flaw: Sensitivity Mixing

Every incident above shares the same pattern:

```
Agent starts:  [read, write, delete, execute]
                      │
       Agent reads CONFIDENTIAL data
                      │
       Agent writes to PUBLIC channel  ← THIS IS THE PROBLEM
```

RBAC cannot fix this because:
1. **Permissions are static** — no dynamic narrowing based on accessed data
2. **Prompt instructions are not enforceable** — LLMs can ignore them
3. **Output filters are bypassable** — checks outside the execution path get circumvented

---

## The Fix: Sensitivity Ratchet

The sensitivity ratchet enforces a **one-way valve** on permissions. Once an agent reads sensitive data, write/delete/execute permissions are **structurally and irreversibly** removed.

```bash
pip install agent-iam-ratchet
```

```python
from agent_iam_ratchet import RatchetSession, Sensitivity

session = RatchetSession(scopes=["read:*", "write:*", "delete:*", "execute:*"])

session.access(Sensitivity.CONFIDENTIAL)
print(session.effective_scopes)
# frozenset({'read:*', 'write:*'})  — delete + execute gone forever

session.access(Sensitivity.RESTRICTED)
print(session.effective_scopes)
# frozenset({'read:*'})  — write gone forever

session.access(Sensitivity.PUBLIC)
print(session.effective_scopes)
# frozenset({'read:*'})  — irreversible. That's the ratchet.
```

### Two Mathematical Invariants

- **High-water mark**: `HW(t) ≥ HW(t-1)` — sensitivity only increases
- **Permission set**: `P(t) ⊆ P(t-1)` — scopes only shrink

No API call, no override, no rollback can violate these invariants within a session.

### Framework Integrations

Works with LangChain, CrewAI, and OpenAI Agents SDK out of the box:

```python
# LangChain
from agent_iam_ratchet.langchain import RatchetCallbackHandler

# CrewAI  
from agent_iam_ratchet.crewai import install_ratchet_hooks

# OpenAI Agents SDK
from agent_iam_ratchet.openai_agents import ratchet_tool_guardrail
```

---

## Try It

**Live Demo**: [agent-iam-ratchet-demo.vercel.app](https://agent-iam-ratchet-demo.vercel.app)
**GitHub**: [github.com/mattyopon/agent-iam-ratchet](https://github.com/mattyopon/agent-iam-ratchet)
**PyPI**: [pypi.org/project/agent-iam-ratchet](https://pypi.org/project/agent-iam-ratchet/)

Open Source — MIT License.
