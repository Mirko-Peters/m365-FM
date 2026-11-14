---
title: "Microsoft Copilot Privacy Controls: Sensitivity Labels, Permissions, DLP and Audit Logs"
summary: "The privacy controls that apply to Microsoft Copilot: permissions, sensitivity labels with usage rights, the DLP Copilot location, audit records and retention, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [copilot, sensitivity-labels, microsoft-purview-audit, dlp]
keypoints:
  - "Copilot only surfaces organizational data the user has at least view permissions for. Prompts and responses aren't used to train foundation LLMs."
  - "For labels that encrypt, users need the EXTRACT usage right as well as VIEW before AI apps return the data."
  - "The DLP location for Copilot can block sensitive prompts, web search for those prompts, and labeled files and emails from being processed."
  - "Copilot interactions are written to the unified audit log as CopilotInteraction records, including accessed resources and label IDs."
  - "Retention policies can retain or delete prompts and responses. eDiscovery can search them in the user's mailbox."
faq:
  - q: "Does Copilot respect sensitivity labels?"
    a: "Yes, with a condition. Microsoft Learn says that when a label applies encryption, users must have the EXTRACT usage right as well as VIEW for AI apps to return the data. Copilot honors the usage rights granted to the user."
  - q: "Are Copilot prompts used to train the model?"
    a: "No. According to Microsoft's Copilot privacy page, prompts, responses and data accessed through Microsoft Graph aren't used to train foundation LLMs, including those used by Microsoft Copilot."
  - q: "Where can admins see what Copilot accessed?"
    a: "In the Microsoft Purview portal under Audit. Microsoft Learn says Copilot interactions create CopilotInteraction records that reference the files, sites and other resources accessed, including a sensitivity label ID for each resource. Auditing must be enabled in the organization."
  - q: "Can DLP stop Copilot from using a labeled file?"
    a: "Yes. The DLP policy location for Microsoft Copilot, Copilot Chat and Copilot Cowork can prevent processing of files and emails with chosen sensitivity labels. Microsoft notes the item could still appear in the citations of the response."
---
Copilot's privacy model rests on one rule: it works within what the signed-in user can already access. Everything else is a layer on top of that rule. Sensitivity labels, data loss prevention (DLP), audit, retention and eDiscovery decide how tightly that access is controlled and how well it can be reviewed afterward. Microsoft Learn now calls the product Microsoft Copilot. Older pages say Microsoft 365 Copilot.

## Layer 1: permissions and data use

Microsoft's privacy page states that Copilot "only surfaces organizational data to which individual users have at least view permissions." The semantic index honors the same user identity-based access boundary. Copilot presents data using the same underlying access controls as other Microsoft 365 services.

Two commitments from the same page:

- Prompts, responses and data accessed through Microsoft Graph aren't used to train foundation LLMs.
- Stored interaction data (the prompt, the response and citations) is encrypted while stored.

For EU users, Microsoft says EU traffic stays within the EU Data Boundary, while worldwide traffic can be sent to the EU and other regions for LLM processing. The page adds that models from Anthropic as a subprocessor are currently excluded from the EU Data Boundary. Check this point against the current page if data residency matters for your organization.

The practical consequence: permissions hygiene is the first privacy control. Microsoft's security overview notes that overshared or poorly governed content can affect Copilot results and increase risk.

## Layer 2: sensitivity labels and encryption

Purview documentation says AI apps use existing controls so that data in the tenant isn't returned to a user, or used by an LLM, if the user lacks access to it. Labels add protection:

- When a label applies encryption, users need the **EXTRACT** usage right as well as **VIEW** for the AI apps to return the data.
- This protection extends to data stored outside the tenant when it is open in an Office app.
- Microsoft recommends enabling sensitivity labels for SharePoint and OneDrive.

Encryption without labels is treated differently. Azure Rights Management encryption (Purview Message Encryption, IRM, the RMS connector and the RMS SDK) still gets VIEW and EXTRACT checks, but new items don't inherit protection automatically. Microsoft also lists these cases:

- S/MIME-protected emails aren't returned by Copilot.
- Password-protected documents are inaccessible to AI apps unless already open in the same app.
- Items encrypted with Customer Key or BYOK are eligible to be returned by Copilot.

For agents, the privacy page says encryption can exclude programmatic access, which limits an agent's access to the content.

## Layer 3: DLP for Copilot

Purview DLP has a policy location named **Microsoft Copilot, Copilot Chat, and Copilot Cowork**. Per Microsoft Learn it can:

- Restrict external web search when prompts contain sensitive data.
- Restrict processing of sensitive prompts.
- Restrict processing of sensitive files and emails.
- Restrict processing of external email (preview).

| Condition | What happens |
|---|---|
| Content contains a sensitivity label | The item isn't processed or used in the response summary. It could still be available in the citations. |
| Content contains a sensitive information type (processing prompts) | The experience doesn't respond to the prompt. |
| Content contains a sensitive information type (web searches) | External web search isn't used as a grounding source for that prompt. |

Things to know before building the policy:

- The location is available only in the **Custom** policy template, and selecting it disables the other locations for that policy.
- Labels and sensitive information types can't be combined in the same rule. Use one rule for each.
- DLP can't scan files uploaded directly into prompts. It checks only the typed prompt text.
- Blocking prompts by sensitive information type is documented as preview.
- Policy updates can take up to four hours to take effect.
- Calendar invites aren't supported for label-based blocking, and emails must have been sent on or after January 1, 2025.

## Layer 4: audit logs

Copilot interactions are captured in the unified audit log. Microsoft Learn describes these records:

- **CopilotInteraction** (workload Copilot) covers Microsoft-developed Copilots.
- **ConnectedAIAppInteraction** covers custom or third-party AI apps deployed and registered in the organization.
- **AIAppInteraction** covers third-party AI apps not deployed in the organization.

Useful properties include **AppIdentity**, **AppHost** and **AccessedResources**. The last one lists the resources Copilot used, with action, status and, when access was blocked or restricted, policy details. Each resource also carries a **SensitivityLabelId**. The page documents only the ID, not the label name. Other flags include XPIADetected (cross prompt injection attack) and JailbreakDetected.

To search: open the Microsoft Purview portal, select **Audit**, and filter the **Activities – operation names** field by operation, record type or workload. Auditing must be enabled in the organization. Audit logs for non-Microsoft AI apps use pay-as-you-go billing and are retained for 180 days. The page doesn't state the default retention for Audit (Standard) and doesn't list the admin roles needed to search.

## Layer 5: retention, eDiscovery and oversight

- **Retention.** Retention policies can retain or delete user prompts and responses. If several policies or eDiscovery holds apply, data is kept for the longest duration.
- **eDiscovery.** Prompts and responses are stored in the user's mailbox. Search it with the condition Type > Contains any of > Copilot activity.
- **Communication compliance.** It can detect conduct violations in AI prompts and responses, with usernames pseudonymized by default.
- **Insider Risk Management.** The Risky AI usage template detects risky usage including prompt injection attacks and access to protected material.
- **Users.** People can delete their own Copilot activity history in the My Account portal.

## Where to start

1. Fix oversharing first, because permissions define what Copilot can reach.
2. Label sensitive content and confirm which labels encrypt.
3. Create a DLP rule for the Copilot location for the labels or information types that must never be processed.
4. Confirm auditing is on and test a search for CopilotInteraction records.
5. Decide how long prompts and responses should be retained.

## Related

- [Copilot](https://www.m365.fm/entity/copilot/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Copilot privacy, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy)
- [Microsoft Copilot security overview, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
- [Microsoft Purview for AI apps and Copilot, Microsoft Learn](https://learn.microsoft.com/en-us/purview/ai-microsoft-purview)
- [Audit logs for Copilot and AI applications, Microsoft Learn](https://learn.microsoft.com/en-us/purview/audit-copilot)
- [DLP for Microsoft 365 Copilot, Copilot Chat and Cowork, Microsoft Learn](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about)
