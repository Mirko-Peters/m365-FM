---
title: "How Accurate Is Microsoft Copilot? What Shapes the Response It Gives You"
summary: "What shapes a Copilot answer in Microsoft 365: prompt, grounding data, permissions, model mode and license. Plus Microsoft's own limits on accuracy and how to check output."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [copilot, copilot-grounding, copilot-governance]
keypoints:
  - "A Copilot answer depends on the prompt, the data it is grounded in, the user's permissions, the license tier and the model mode."
  - "Microsoft describes AI services as fallible and probabilistic. Output can be inaccurate, incomplete, biased or ungrounded."
  - "Copilot only uses organizational data that the signed-in user can already access."
  - "Microsoft gives no accuracy scores. Its guidance is to review and verify, and to treat untraceable statements as unconfirmed."
  - "Four checks from Microsoft: Source, Verified, Context and Resilient."
faq:
  - q: "How accurate is Microsoft Copilot?"
    a: "Microsoft doesn't publish accuracy figures on the pages read for this article. The Microsoft 365 Copilot transparency note says AI services are fallible and probabilistic and that output can be inaccurate, incomplete, biased, misaligned or irrelevant. It recommends reviewing and verifying every response."
  - q: "What shapes the response Copilot gives?"
    a: "Per Microsoft Learn, the main factors are the prompt, the data used for grounding (Microsoft Graph content and optionally the web), the user's existing permissions, the license tier and tenant configuration, and the model mode. Language support also matters, because Copilot supports fewer languages than Microsoft 365."
  - q: "Can Copilot see files I don't have access to?"
    a: "No. The transparency note says Copilot only accesses data that an individual user has existing access to, based on existing Microsoft 365 role-based access controls. Content the user can't open can't be used for grounding."
  - q: "Can Copilot check its own answers?"
    a: "Only in part. Microsoft's validation guidance says Copilot can help validate its output, for example as a reviewer or gap finder, but it can't certify its own correctness. Verify against trusted sources when the stakes are high."
---
A Copilot answer is shaped by five things: the prompt, the data used to ground it, the permissions of the person asking, the license and tenant setup, and the model mode. On accuracy, Microsoft is direct. Copilot can be wrong, and its pages say to review and verify the output. This article sorts the factors that move quality and lists the checks Microsoft recommends. Microsoft Learn pages use both the names Microsoft Copilot and Microsoft 365 Copilot, for example in the Basic and Premium tier names.

## How a response is produced

The Microsoft 365 Copilot transparency note describes four steps:

1. Copilot receives the prompt from a user in an app such as Word or PowerPoint.
2. Copilot processes the prompt to make it more specific. The prompt can include text from input files or other content found through Microsoft Graph. It is then sent to the large language model (LLM). Copilot only accesses data the user already has access to.
3. Copilot post-processes the LLM response. This includes further grounding calls to Microsoft Graph, responsible AI checks such as content classifiers, security, compliance and privacy checks, and command generation.
4. Copilot returns the response to the app, where the user reviews it.

Without web or organizational data, the note says Copilot relies only on its LLMs to understand prompts and generate responses. Grounding data can improve the quality, accuracy and relevance of a response.

## What shapes the answer

### The prompt

Microsoft says that writing good prompts is key to better outcomes. Its recommendations for end users: include details, structure prompts, provide positive instructions, iterate and regenerate, and always review and verify. When a prompt is ambiguous, Copilot can enrich it with extra instructions. That enrichment relies on the LLM, not on knowledge of the user or earlier searches.

### Grounding data

The transparency note says Copilot adds content found through Microsoft Graph and makes further grounding calls to Microsoft Graph. Allowing web references can also improve responses. Microsoft's architecture page adds that web search grounding can be managed with the Allow web search in Copilot policy.

### Permissions

Copilot only accesses data that users are authorized to access, based on existing access controls. Two people can send the same prompt and get different answers because they can open different content. The security overview also notes that overshared or poorly governed content can affect Copilot results and increase risk.

### License tier and tenant setup

The architecture page says experiences differ by data grounding, integration depth and licensing. Copilot Chat (Basic) responses are grounded in the public web. Microsoft 365 Copilot (Premium) uses both web and organizational data through Microsoft Graph and Work IQ. Basic users don't have access to Microsoft Graph. They must supply organizational content manually, for example by uploading a file.

### Model mode

By default, Copilot uses a real-time router to adjust the underlying model to the prompt. The documented modes are:

- **Auto.** Copilot decides which model to use.
- **Quick response.** For common or routine questions, it prioritizes speed.
- **Think deeper.** Advanced reasoning for complex questions.

### Language

Copilot supports fewer languages than Microsoft 365. If the language in the prompt isn't supported, the user gets an error message.

## Microsoft's stated limits

The transparency note is blunt about accuracy:

- AI services are fallible and probabilistic.
- When summarizing content from several sources, Copilot may include information that isn't in its input sources. The note calls this ungrounded output.
- Outputs may be inaccurate, incomplete, biased, misaligned or irrelevant to the intended goal, for example because of ambiguous input or model limits.
- Overreliance happens when users accept incorrect or incomplete output because mistakes are hard to detect.

Where possible, responses based on business documents include references to the sources so users can verify them. The note says Microsoft runs quality evaluations, including groundedness assessments, but gives no scores. The pages read for this article contain no accuracy benchmarks, so any percentage quoted elsewhere isn't backed by these sources.

## How to check an answer

Microsoft's guidance "Validate Copilot output before you act on it" defines validation as checking output after it is generated and before acting on it. It stresses that a response can sound polished and still be wrong, incomplete or risky. Four checks:

1. **Source.** Does the response reflect the source material? Treat a statement that can't be traced to a source as unconfirmed until verified.
2. **Verified.** Are the key facts, names, dates, numbers and recommendations confirmed?
3. **Context.** What is missing that could change the decision? Look for caveats, dependencies and exceptions.
4. **Resilient.** Would the answer hold up across different scenarios and audiences?

Validation matters most for decisions, summaries of multiple sources, messages to customers or leadership, priorities and hard-to-reverse work. Copilot can act as reviewer, challenger, gap finder or stress tester. Its feedback is a signal, not the final authority.

## Practical steps that follow from the documentation

- Include details and structure in the prompt, as Microsoft recommends.
- Regenerate or refine instead of accepting the first output.
- Open the cited references for any number or date that matters.
- Review content governance. Microsoft notes that overshared or poorly governed content affects results.
- Keep human review in place for decisions, as the transparency note advises.

## Related

- [Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot grounding](https://www.m365.fm/entity/copilot-grounding/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Oversharing](https://www.m365.fm/entity/oversharing/)

## Sources

- [Microsoft 365 Copilot transparency note, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-transparency-note)
- [Microsoft Copilot architecture, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture)
- [Microsoft Copilot security overview, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
- [Microsoft Copilot privacy, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy)
- [Validate Copilot output before you act on it, Microsoft Support](https://support.microsoft.com/en-us/Microsoft-365-Copilot/validate-copilot-output)
