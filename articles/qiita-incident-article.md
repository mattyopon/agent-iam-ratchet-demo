---
title: AIエージェントが機密データを漏洩する5つの実例 — RBACでは防げない構造的欠陥
tags: AI, セキュリティ, LLM, AIエージェント, Python
private: false
---

## AIエージェントは「読んだデータを外に書ける」

2025年、AIエージェントによるデータ漏洩インシデントが相次いでいます。

共通する問題は単純です：**エージェントがデータを読んだ後も、書き込み権限がそのまま残っている**。

従来のRBAC（Role-Based Access Control）はセッション開始時に権限を付与し、**エージェントが実際に何を読んだかに基づいて権限を縮小する仕組みがありません**。

この構造的欠陥を、実際のインシデントで見ていきます。

---

## 実例1: EchoLeak — Microsoft 365 Copilot（CVE-2025-32711、CVSS 9.3）

攻撃者が細工したメールを送るだけで、被害者のM365データが外部サーバに流出。ゼロクリック。

Copilotが受信メール（外部データ）を読み込んだ後、その指示に従って別のデータを外部URLに送信。MicrosoftのXPIA分類器、外部リンク削除、CSPを**すべてバイパス**しました。

**根本原因**: Copilotは機密メールを読んだ後も、外部への書き込み能力を保持していた。

> 参考: [Hack The Box解説](https://www.hackthebox.com/blog/cve-2025-32711-echoleak-copilot-vulnerability)

---

## 実例2: Slack AI データ流出（2024年8月）

RAGポイズニングとプロンプトインジェクションの組み合わせ。攻撃者がSlackチャンネルに悪意あるメッセージを投稿し、Slack AIが**別のプライベートチャンネルの機密情報**を攻撃者に回答する形で流出。

**根本原因**: AIがプライベートチャンネルのデータを読んだ後も、パブリックチャンネルへの書き込みが可能だった。

> 参考: [OWASP GenAI LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

---

## 実例3: ForcedLeak — Salesforce AgentForce（CVSS 9.4）

間接プロンプトインジェクションにより、外部攻撃者がCRMの顧客データを流出。

AgentForceが外部から取り込んだデータに含まれる悪意ある指示を実行し、CRM内の顧客PII（個人識別情報）を外部に送信。

**根本原因**: ユーザー指示と外部データの境界がなく、機密データ読み取り後も外部出力の権限が残っていた。

> 参考: [Noma Security](https://noma.security/blog/forcedleak-agent-risks-exposed-in-salesforce-agentforce/)

---

## 実例4: Log-To-Leak — MCP経由の秘密ロギング攻撃（学術研究、2025年）

MCPサーバに悪意あるロギングツールを仕込み、エージェントに自発的に呼び出させる手法。ユーザークエリ・ツール応答・エージェント回答の**全て**が流出。GPT-4o、Claude Sonnetなど5つのLLMで実証済み。

**根本原因**: エージェントがツール呼び出しを通じて任意の外部エンドポイントにデータを送信可能だった。

> 参考: [OpenReview論文](https://openreview.net/forum?id=UVgbFuXPaO)

---

## 実例5: Semantic Privilege Escalation（AI版Confused Deputy）

AIエージェントは自然言語で動作するため、「データ」と「命令」の境界がありません。古典的なConfused Deputy問題のAI版として学術的に定式化されています。

外部データに埋め込まれた指示をエージェントが命令として解釈し、本来アクセスすべきでない操作を実行する。

> 参考: [Acuvity解説](https://acuvity.ai/semantic-privilege-escalation-the-agent-security-threat-hiding-in-plain-sight/) / [arXiv論文](https://arxiv.org/html/2601.11893v1)

---

## 共通する構造的欠陥: Sensitivity Mixing

これらのインシデントに共通するのは、**「高感度データを読んだ後も、低感度チャンネルへの書き込みが可能」** という構造です。

```
Agent: read:* + write:*
  │
  ├── CONFIDENTIAL HR record を読む
  │
  └── public Slack channel に書く  ← ここが問題
```

RBACはこの問題を解決できません。なぜなら：

1. **権限はセッション開始時に固定** — 読んだデータの感度に応じた動的縮小がない
2. **プロンプト指示は強制力がない** — LLMはプロンプトを無視できる
3. **出力フィルタはバイパス可能** — 実行パスの外にあるチェックは迂回される

---

## 解決策: 感度ラチェット（Sensitivity Ratchet）

感度ラチェットは、**権限を一方向にしか動かさない**メカニズムです。

エージェントが機密データにアクセスした瞬間、書き込み・削除・実行の権限が**構造的に、不可逆的に**削除されます。

```python
pip install agent-iam-ratchet
```

```python
from agent_iam_ratchet import RatchetSession, Sensitivity

session = RatchetSession(scopes=["read:*", "write:*", "delete:*", "execute:*"])

# エージェントがHRデータベースを読む
session.access(Sensitivity.CONFIDENTIAL)
print(session.effective_scopes)
# frozenset({'read:*', 'write:*'})  ← delete + execute は永久に消えた

# エージェントが医療記録を読む
session.access(Sensitivity.RESTRICTED)
print(session.effective_scopes)
# frozenset({'read:*'})  ← write も永久に消えた

# PUBLICデータを読んでも権限は戻らない
session.access(Sensitivity.PUBLIC)
print(session.effective_scopes)
# frozenset({'read:*'})  ← 不可逆。これが「ラチェット」
```

### 2つの数学的保証

| 不変条件 | 意味 |
|---------|------|
| `HW(t) ≥ HW(t-1)` | 感度の最高水位は上がるだけ |
| `P(t) ⊆ P(t-1)` | 権限は縮むだけ |

### ポリシーではなく構造で強制

感度ラチェットはプロンプト指示でも出力フィルタでもありません。**コード内の構造**として実装されており、ランタイムでバイパスする方法がありません。

### フレームワーク統合

LangChain、CrewAI、OpenAI Agents SDKに対応：

```python
# LangChain
from agent_iam_ratchet.langchain import RatchetCallbackHandler

# CrewAI
from agent_iam_ratchet.crewai import install_ratchet_hooks

# OpenAI Agents SDK
from agent_iam_ratchet.openai_agents import ratchet_tool_guardrail
```

---

## まとめ

| 防御手法 | バイパス可能か | 構造的強制か |
|---------|:------------:|:----------:|
| プロンプト指示 | ✅ 可能 | ❌ |
| 出力フィルタ | ✅ 可能 | ❌ |
| RBAC | — | ❌（動的縮小なし）|
| **感度ラチェット** | **❌ 不可能** | **✅** |

AIエージェントのセキュリティは、モデルの賢さではなく**権限モデルの構造**で決まります。

**デモ**: [agent-iam-ratchet-demo.vercel.app](https://agent-iam-ratchet-demo.vercel.app)
**GitHub**: [github.com/mattyopon/agent-iam-ratchet](https://github.com/mattyopon/agent-iam-ratchet)
**PyPI**: [pypi.org/project/agent-iam-ratchet](https://pypi.org/project/agent-iam-ratchet/)
