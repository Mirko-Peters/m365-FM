---
title: "Report False Positives and False Negatives With Admin Submissions in Defender"
summary: "Use the Submissions page in the Microsoft Defender portal to report missed threats and wrongly blocked email, URLs and attachments: roles, steps, allow and block options, response times and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [defender-for-office-365]
keypoints:
  - "Open the Microsoft Defender portal, Actions & submissions > Submissions, or go to security.microsoft.com/reportsubmission."
  - "Submit emails, email attachments or URLs. Up to 50 URLs can be submitted at once. User-reported Teams messages are handled on the User reported tab."
  - "False negatives use It appears suspicious or I've confirmed it's a threat. False positives use It appears clean or I've confirmed it's clean."
  - "Allow entries default to expire 45 days after last used date. Block entries default to 30 days. Allow entries do not override impersonation protection."
  - "Emails must be 30 days old or less and still in the mailbox. Throttling is 150 submissions per 15 minutes."
faq:
  - q: "Where do admins report a missed threat or a wrongly blocked message?"
    a: "In the Microsoft Defender portal at Actions & submissions > Submissions, or at security.microsoft.com/reportsubmission, according to Microsoft Learn. Each tab has a Submit to Microsoft for analysis button where you pick the submission type."
  - q: "Which roles are required?"
    a: "Learn lists Defender XDR Unified RBAC permissions such as Security data basics (read) or Response (manage) when Defender for Office 365 permissions are active, or the Security Administrator or Security Reader role group in Email and collaboration permissions, or the same roles in Microsoft Entra."
  - q: "How long do Allow and Block entries last?"
    a: "Allow entries expire by default 45 days after the last used date, with 1 day, 7 days, 30 days or a specific date as options. Block entries default to 30 days, with 1 day, 7 days, Never expire or a specific date up to 30 days out as options. Spoofed sender allow entries never expire by default."
  - q: "How old can a message be for submission?"
    a: "Learn says emails can be submitted if they are 30 days old or less, still in the mailbox and not purged. Submissions from on-premises mailboxes are supported only for messages under 7 days old."
  - q: "Can I dispute a result?"
    a: "Yes, for completed Emails or URLs submissions with results such as Threats found, No threats found, Spam or Bulk. Each item can be disputed once, and you must select Result or the item is not resubmitted. Resubmitting restarts analysis and can be repeated."
---

When Defender for Office 365 misses a threat or blocks a legitimate message, admins can send the item to Microsoft from the Submissions page. The submission feeds analysis and, if you choose, creates an allow or block entry. This guide follows Microsoft Learn's article on submitting messages, URLs and attachments.

## Where to submit

Open the Microsoft Defender portal at **Actions & submissions** > **Submissions**, or go directly to `https://security.microsoft.com/reportsubmission`. Each tab has a **Submit to Microsoft for analysis** button, and you set **Select the submission type** to match.

- **Emails:** add the network message ID or upload a .msg or .eml file.
- **Email attachments:** upload a file.
- **URLs:** enter up to 50 full URLs at once.
- **Teams messages** (Defender for Office 365 Plan 2, preview): not submitted from this tab. User-reported Teams messages are handled on the **User reported** tab.
- **Files:** available only with Microsoft Defender or Defender for Endpoint Plan 2.

## Roles you need

One of the following, per Learn:

- **Defender XDR Unified RBAC**, when the Email and collaboration Defender for Office 365 permissions setting is active: Security operations or Security data with Response (manage) or Security data basics (read).
- **Email and collaboration permissions:** the **Security Administrator** or **Security Reader** role group.
- **Microsoft Entra roles:** **Security Administrator** or **Security Reader**.

## Report a false negative (bad item allowed)

1. Select **It appears suspicious**, or **I've confirmed it's a threat** and choose **Phish**, **Malware** or **Spam** (Spam applies to email only).
2. On the second page, select **Submit**, or choose a block option: **Block all emails from this sender or domain**, **Block this file** or **Block this URL**.

Block entries go into the Tenant Allow/Block List. Duration options are 1 day, 7 days, 30 days (the default), Never expire, or a specific date up to 30 days out.

## Report a false positive (good item blocked)

1. Select **It appears clean**, or **I've confirmed it's clean**.
2. On the second page, select **Submit**, or choose **Allow this message**, **Allow this file** or **Allow this URL**.

Allow entries expire by default 45 days after the last used date. Other options are 1 day, 7 days, 30 days or a specific date. Allow entries for spoofed senders never expire by default.

Learn warns that allow entries don't override impersonation protection. For a recurring legitimate sender, update **Trusted senders and domains** in the anti-phishing policy instead.

## Submitting a quarantined message

The article has no quarantine-specific procedure. For emails, it says the network message ID is in the `X-MS-Office365-Filtering-Correlation-Id` header of quarantined messages, or you can upload the .eml or .msg file.

## Results

- Policy and override results usually show within several minutes.
- Detonation and grader feedback can take up to a day.
- The details flyout shows values such as **Should have been blocked**, **Should not have been blocked** or **Allowed due to user overrides**.
- For Plan 2, admin and user-reported phishing is analyzed with machine learning, then agentic grading, then human graders.

### Disputes and resubmission

Disputes apply to completed Emails or URLs submissions with results of Threats found, No threats found, Spam or Bulk. An item can be disputed once, and you must select **Result** or it isn't resubmitted. **Resubmitting** restarts the analysis and can be repeated.

## Limits

| Limit | Value |
| --- | --- |
| Message age | 30 days or less, still in the mailbox and not purged |
| On-premises mailbox submissions | Only messages under 7 days old |
| Submissions | 150 per 15 minutes |
| Identical submissions | 3 per 24 hours and 1 per 15 minutes |

In U.S. Government clouds (GCC, GCC High, DoD), only email authentication and policy hits are analyzed, and detonation and grader analysis are not performed.

## Working routine

1. Collect the network message ID or the .eml file.
2. Decide whether it is a false positive or false negative, and check your role.
3. Submit with the right choice. Use block or allow options only when the entry is needed now, because they create entries with expiry dates.
4. Check the result in the details flyout.
5. If the result is wrong, use dispute once, then resubmit if needed.

## Not covered

The page does not describe how submissions change tenant policies beyond the allow and block entries, and I did not read the user reported settings pages, so end-user reporting is outside this article.

## Related

- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Use the Submissions page to submit suspected spam, phish, URLs and files to Microsoft](https://learn.microsoft.com/defender-office-365/submissions-admin)
