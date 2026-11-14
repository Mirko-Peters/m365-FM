---
title: "Create a DLP Policy for Microsoft 365 Copilot to Block Labeled Content"
summary: "Create a Microsoft Purview DLP policy for the Microsoft 365 Copilot and Copilot Chat location: block sensitivity-labeled files and emails, sensitive info types in prompts, roles needed, known limits and the up to four hour delay."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [dlp, copilot-governance]
keypoints:
  - "Create the policy under Data Loss Prevention > Policies with the Custom template and Custom policy. The Copilot location is available only there."
  - "A label rule stops Copilot from processing matching files and emails. Matching items can still appear in response citations."
  - "A rule cannot combine the condition for sensitive information types with the condition for sensitivity labels."
  - "Uploaded files in prompts are not scanned and calendar invites are not supported for labels. Email coverage applies to emails sent on or after January 1, 2025."
  - "Policy updates can take up to four hours to reflect in Copilot experiences."
faq:
  - q: "Where do I create a DLP policy for Copilot?"
    a: "According to Microsoft Learn, in the Microsoft Purview portal under Data Loss Prevention > Policies > Create policy, using the Custom template and then Custom policy. The Microsoft 365 Copilot and Copilot Chat location is only available in that template."
  - q: "Can I block labeled content and sensitive info types in one rule?"
    a: "No. Learn says you cannot use both the sensitive info types and the sensitivity labels conditions in the same rule. Create separate rules."
  - q: "Which roles can create these policies?"
    a: "Learn lists roles including Microsoft Entra AI Admin, Purview Data Security AI Admin, Purview Compliance Administrator, Purview Security Administrator and Microsoft Entra Global Admin. It recommends the role with the fewest permissions."
  - q: "How long until a change takes effect?"
    a: "Learn says updates to a DLP policy can take up to four hours to reflect in the Copilot experiences."
  - q: "Are files I upload in a prompt checked?"
    a: "No. Learn says uploaded files in prompts are not scanned, and DLP only checks the typed prompt text."
---

To block labeled content from Microsoft 365 Copilot, create a custom Microsoft Purview DLP policy, turn on the Copilot location and add a rule that uses the sensitivity labels condition. Copilot then does not process matching files and emails. This guide follows Microsoft Learn's page on Microsoft Purview DLP for Microsoft 365 Copilot and Copilot Chat.

## What the policy can do

The page names the location **Microsoft 365 Copilot and Copilot Chat**. It covers four cases:

- **Sensitivity-labeled files and emails:** Copilot and Copilot Chat do not use the content of matching items in the response or access it. Matching items can still appear in the citations of the response.
- **Sensitive information types in prompts:** Copilot returns no response. Only out-of-the-box and custom sensitive information types are supported.
- **Web search grounding:** for prompts containing those types, external web search is blocked as a grounding source, and the response uses permitted internal data.
- **External email (preview):** Copilot and Copilot Chat exclude emails from external senders. Only sender domain metadata is evaluated, not the body.

A rule cannot use both the sensitive information types condition and the sensitivity labels condition.

## Conditions and actions

| Condition | Action |
| --- | --- |
| Content contains > Sensitivity labels | Prevent Copilot from processing content |
| Content contains > Sensitive information types | Prevent Copilot from processing content > Processing prompts |
| Content contains > Sensitive information types | Prevent Copilot from processing content > Performing Web Searches |
| Email is received from > External users | Prevent Copilot from processing content |

## Create the policy

1. Sign in to the Microsoft Purview portal at purview.microsoft.com.
2. Go to **Data Loss Prevention** > **Policies** and select **+ Create policy**.
3. Select the **Custom** template, then **Custom policy**. The location is available only in this template.
4. On the **Locations** page, turn on **Microsoft 365 Copilot and Copilot Chat**. All other locations are then disabled for the policy.
5. Add a rule with the condition and action you need, for example the sensitivity labels condition.
6. Save and turn on the policy.

The page says this location does not support **Admin units**.

## Permissions

Learn lists these roles as able to create or edit these policies: Microsoft Entra AI Admin, Purview Data Security AI Admin, Purview Compliance Administrator, Purview Compliance Data Administrator, Purview Information Protection, Purview Information Protection Admin, Purview Security Administrator and Microsoft Entra Global Admin. It recommends the role with the fewest permissions and notes that Purview Data Security AI Admin cannot read prompts and responses.

## Licensing

The page only links to the Microsoft 365 Enterprise plans and the security and compliance licensing guidance. It names no specific SKUs, so check those pages for your tenant.

## Known limitations

- Blocking sensitive information types in prompts and blocking external email are in preview. Learn says the prompt feature is rolling out to tenants, so check whether it has reached yours.
- Calendar invites are not supported for sensitivity labels.
- Email coverage for labels applies only to emails sent on or after January 1, 2025.
- Uploaded files in prompts are not scanned.
- In Word, Excel and PowerPoint, label-based policies are evaluated when the file opens. A label applied mid-session takes effect the next time the file opens. The preview user messaging may not clearly say the interaction was blocked by policy.
- Skills in Word, Excel and PowerPoint are disabled for files that match a policy.

## Timing

Updates to a DLP policy can take up to four hours to reflect in the Copilot experiences. Test after that window, not right after saving.

## Suggested rollout order

This order is a suggestion based on the documented limits, not a Microsoft procedure.

1. Decide which labels must be blocked and confirm that your users' files and emails carry them.
2. Create a label rule in its own policy and keep sensitive info type rules separate, because one rule cannot combine both conditions.
3. Wait up to four hours after saving, then test with a labeled file and a labeled email.
4. Tell users that cited items can still appear in citations and that labels applied mid-session apply the next time a file opens.

## Not covered by the page

The page does not list the supported file types, which it links to the sensitivity labels documentation. It also gives no rollout dates for the preview features, and does not describe Activity explorer or alerts in depth.

## Related

- [Data loss prevention](https://www.m365.fm/entity/dlp/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Purview DLP for Microsoft 365 Copilot and Copilot Chat (Microsoft Learn)](https://learn.microsoft.com/purview/dlp-microsoft365-copilot-location-learn-about)
