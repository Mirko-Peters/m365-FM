---
title: "Sensitivity Labels Blocking Microsoft 365 Copilot From Using Content: Troubleshooting Checklist"
summary: "Copilot skips a labeled file when encryption withholds the EXTRACT right or a DLP policy blocks processing. Check usage rights, unopened encrypted files, DKE, labels on containers and Copilot DLP policies, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [copilot, sensitivity-labels, purview, dlp]
keypoints:
  - "For encrypted content, the EXTRACT usage right (shown as Copy and extract content) decides whether Copilot can show text from it."
  - "With VIEW but no EXTRACT, Copilot will not summarize the content, but it can link to it. In an open document, Copilot cannot be used."
  - "Unopened files with user-defined permissions are not accessible to Copilot unless the label is a default label that extends SharePoint permissions, or the file is referenced with a slash."
  - "Double Key Encryption items are not accessible to Copilot at all."
  - "A DLP policy on the Copilot location can stop processing of labeled items. They may still appear as citations, but their content is not used."
faq:
  - q: "What usage right does Copilot need for encrypted files?"
    a: "According to Microsoft Learn, EXTRACT, which the Microsoft Purview portal shows as Copy and extract content (EXTRACT). It determines whether Copilot or agents can display text from encrypted content to the user. Full control includes it automatically."
  - q: "Why does Copilot only give me a link to a file instead of a summary?"
    a: "Microsoft Learn describes two cases. If you have VIEW but not EXTRACT on encrypted content, Copilot will not summarize it but can reference it with a link. The same link-only behavior applies when a Purview DLP policy identifies the labeled file or email."
  - q: "Does a sensitivity label on a site or group affect Copilot?"
    a: "Learn says labels applied to containers such as groups and sites are not inherited by the items inside them. Labels that protect Teams meetings and chat are not currently recognized by Copilot and agents, and labels from other organizations are not accessible."
  - q: "How quickly does a Copilot DLP policy change take effect?"
    a: "Microsoft Learn says updates to a DLP policy can take up to four hours to reflect. For Word, Excel and PowerPoint, the policy is evaluated when the file is opened, so a label applied mid-session is enforced the next time the file is opened."
---

When Copilot ignores a file you expect it to use, a sensitivity label is often involved in one of two ways. Either the label applies encryption and your account lacks the EXTRACT usage right, or a Purview data loss prevention (DLP) policy tells Copilot not to process labeled content. The checks below follow Microsoft Learn's documentation on Copilot and sensitivity labels and its DLP page for the Copilot location. They start with the most common causes.

## Step 0: Rule out plain permissions

Copilot works within existing permissions. Microsoft's security documentation says Copilot only accesses data that users are authorized to access. If the person cannot open the file, Copilot cannot use it either, and a label is not the cause. Confirm access before you dig into labels.

## Step 1: Check the EXTRACT usage right on encrypted labels

If the label applies encryption, Microsoft Learn says the **EXTRACT** usage right determines whether Copilot or agents can display text from the content to the user. In the Microsoft Purview portal it appears as **Copy and extract content (EXTRACT)**. Points to know:

- **Full control** (OWNER) includes EXTRACT automatically.
- The person who applied the encryption always has EXTRACT, because they are the Rights Management owner. Restrictions apply to other authorized people.
- In Outlook, **Encrypt-Only** includes EXTRACT, while **Do Not Forward** does not.

If a user has VIEW but not EXTRACT, Learn says that with the content open in an app they cannot use Copilot. Copilot will not summarize it but can reference it with a link. The pages read do not describe the case where the user has no VIEW right.

To fix this, review the label's encryption settings and the permissions assigned to the affected users. Changing encryption settings affects everyone who uses that label, so test on a pilot label first.

## Step 2: Check unopened encrypted files

Learn states that Copilot and agents cannot access unopened documents in SharePoint and OneDrive that are labeled and encrypted with user-defined permissions. There are two exceptions, and in both the user needs EXTRACT:

- The label is used as a default sensitivity label that extends SharePoint permissions to downloaded documents.
- The file is referenced directly by typing a slash (`/`).

Copilot can always use these documents for a user when they are open in the app.

## Step 3: Look for Double Key Encryption

Learn says Copilot and agents cannot access data protected by Double Key Encryption. Items protected by DKE are not returned, and if a DKE item is open you cannot use Copilot in the app. This is by design for the most sensitive data.

## Step 4: Check what labels do not cover

Several limits can look like a block:

- Labels applied to containers, meaning groups and sites, are not inherited by the items in them.
- Labels that protect Teams meetings and chat are not currently recognized by Copilot and agents.
- Copilot can use labels from your own organization, not from other organizations.
- Unless DLP is used in Edge, Copilot can reference encrypted content from the active browser tab when that content does not grant the user EXTRACT.

## Step 5: Check for Copilot DLP policies

A DLP policy can intentionally stop Copilot from using labeled items. According to Learn, the policy uses the Copilot location (named **Microsoft Copilot, Copilot Chat, and Copilot Cowork**) and a rule with **Content contains** > **Sensitivity labels**. The action is **Prevent Copilot and Cowork from processing content**.

What users see:

- Copilot does not process the item's content or use it in the response summary, but the item could appear in the citations.
- In Word, Excel and PowerPoint the policy is evaluated at file open. The skills in these apps are disabled for files with a covered label.
- Supported content includes files and emails sent on or after January 1, 2025. Calendar invites are not supported.

Admin facts from the same page:

- Updates can take up to four hours to reflect.
- The location is only available in the **Custom** policy template, and selecting it disables other locations for that policy.
- You cannot combine sensitive info type and sensitivity label conditions in the same rule.
- Policy simulation mode is available.
- The page lists the roles that can create or edit these policies and recommends using the role with the fewest permissions.

The page does not describe a workflow to identify which policy blocked a specific interaction. For that, check the DLP reference and Activity explorer documentation it links to.

## Step 6: Check label inheritance when creating content

When Copilot creates new content from labeled items, the label can be inherited. Learn says an inherited label replaces a lower priority label, but not a higher priority one. If an inherited label cannot be applied, the text is not added to the destination. Examples are a read-only destination or a label not published to the user. Inheritance is not supported when the source uses user-defined permissions encryption, or when encryption was applied independently of the label.

## Quick decision path

1. User cannot open the file normally? Fix permissions first.
2. Encrypted label? Check EXTRACT.
3. File unopened and uses user-defined permissions? Open it or reference it with a slash.
4. DKE? Copilot cannot use it.
5. Copilot link-only or skills disabled? Look for a DLP policy on the Copilot location.
6. Label on a site, meeting or chat? Learn says these are not inherited or recognized.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Data loss prevention](https://www.m365.fm/entity/dlp/)

## Sources

- [Microsoft Learn: Purview considerations for Copilot and agents (sensitivity labels and encryption)](https://learn.microsoft.com/en-us/purview/ai-m365-copilot-considerations)
- [Microsoft Learn: Learn about the Microsoft 365 Copilot DLP location](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about)
- [Microsoft Learn: Microsoft Copilot security](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
