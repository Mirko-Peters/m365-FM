---
title: "How Microsoft Secure Score Works and How to Improve It"
summary: "How Microsoft Secure Score is calculated, where to find it in the Defender portal, who can see it, what the action statuses mean and how to work through recommendations."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [secure-score, defender]
keypoints:
  - "Secure Score is a measure of security posture in the Microsoft Defender portal. A higher number means more recommended actions are taken."
  - "Each recommended action is worth 10 points or less. Most are binary, others give points in proportion to the share of users or devices covered."
  - "Statuses are To address, Planned, Risk accepted, Resolved through third party, Resolved through alternate mitigation and Completed."
  - "Score changes after an action can take 24 to 48 hours to appear, so check back before you assume the change failed."
  - "Secure Score is not a guarantee against breaches. Learn calls it a summary of the security controls in use, not a measure of breach likelihood."
faq:
  - q: "Where do I find Microsoft Secure Score?"
    a: "Microsoft Learn says it is in the Microsoft Defender portal at security.microsoft.com/securescore. The Your secure score tile shows the percentage and the points achieved out of the points possible."
  - q: "How are points awarded?"
    a: "Learn says each recommended action is worth 10 points or less. Most are scored as all or nothing, while others give points as a percentage of the total configuration. The example on Learn is 50 of 100 users protected by MFA giving 5 of 10 points."
  - q: "How long until my score changes after I implement an action?"
    a: "The Microsoft Learn page on recommended actions says score changes can take 24 to 48 hours to appear after you complete an action."
  - q: "Who can see and manage Secure Score?"
    a: "Learn lists Security Administrator or higher, Exchange Administrator and SharePoint Administrator as roles with read and write access. Roles such as Security Reader and Global Reader are read-only. Defender Unified RBAC can also be used with the Exposure Management permissions."
  - q: "Does a low score mean I was breached or a high score means I am safe?"
    a: "No. Microsoft Learn says Secure Score is not an absolute measure of how likely a breach is and should not be read as a guarantee against one."
---

Microsoft Secure Score measures the security posture of a Microsoft 365 environment. You open it in the Microsoft Defender portal, review the recommended actions, work through them, and the score rises as the points are earned. A higher number means more recommended actions have been taken. It is a measure of controls in use, not a prediction of whether you will be breached.

This guide follows the Microsoft Learn documentation for Secure Score in Microsoft Defender XDR.

## Where to find it

Sign in to the Microsoft Defender portal and open [security.microsoft.com/securescore](https://security.microsoft.com/securescore). The **Your secure score** tile shows the score as a percentage and the points achieved out of the points possible. Next to the score you can select **Include** to add the views **Planned score**, **Current license score** and **Achievable score** to the graph.

Learn describes the dashboard as a place to report on the current posture, improve it with guidance and control, and compare with benchmarks and KPIs.

## How points work

You earn points for configuring recommended security features, doing security-related tasks, or addressing a recommended action with a non-Microsoft application or an alternate mitigation.

Each recommended action is worth 10 points or less. Most actions are binary: implement the policy or setting and you get all of the points. Others give a share of the points based on coverage. Learn gives this example: an action worth 10 points for protecting all users with multifactor authentication gives 5 points when 50 of 100 users are protected.

The score updates in real time in the visualizations and recommended action pages, and Secure Score syncs daily to receive system data about achieved points. For Microsoft Teams and Microsoft Entra recommendations, the state updates when the configuration changes and is also refreshed once a month (Teams) or once a week (Entra), according to Learn.

One point to note: Learn says you see the full set of possible recommendations for a product regardless of license edition. Your absolute posture stays the same whatever licenses you own. Prerequisites on each recommendation can still include licenses.

## Which products are covered

Learn lists recommendations for products including Microsoft Entra ID, Microsoft Defender for Endpoint, Defender for Identity, Defender for Office, Exchange Online, SharePoint Online, Microsoft Teams, Defender for Cloud Apps, Microsoft Purview Information Protection, App governance and GitHub. Non-Microsoft products such as Okta, Salesforce, ServiceNow, Zoom, Docusign and Citrix ShareFile are listed too. Learn notes the recommendations do not cover every attack surface of each product but are a good baseline.

## Work through recommended actions

1. Open the **Recommended actions** tab on the Secure Score page.
2. Search, filter or group the list. Learn says ranking reflects points left to achieve, implementation difficulty, user impact and complexity.
3. Select an action to open its flyout. It shows the category, the attacks it protects against, user impact, users affected, prerequisites and implementation steps.
4. Select **Manage in Microsoft Defender XDR** to open the configuration screen. Learn says points update in about 24 hours.
5. Set a status and add notes. Tags let you filter later.

The four categories are Identity, Device, Apps and Data.

### Status values

| Status | Effect on points |
| --- | --- |
| To address | You recognize the action is necessary and plan to address it later. Also applies to actions that are only partly completed |
| Planned | Concrete plans are in place to complete the action |
| Risk accepted | No points. You can undo it at any time |
| Resolved through third party | Gives points, but Microsoft cannot verify the work |
| Resolved through alternate mitigation | Gives points, but Microsoft cannot verify the work |
| Completed | Set by Microsoft data when all points are earned. You cannot change it |

For the Device category you cannot set a status in Secure Score. Learn directs you to the related Microsoft Defender Vulnerability Management recommendation. A global exception there updates the Secure Score status, which may take up to 2 hours. An exception per device group does not update Secure Score.

## Security defaults and Conditional Access

Learn says that turning on security defaults in Microsoft Entra ID earns full points for three actions: all users can complete MFA, MFA for administrative roles and blocking legacy authentication. Because security defaults give similar protection to the sign-in risk and user risk policies, Learn recommends marking those two actions as Resolved through alternative mitigation rather than building the policies on top.

## Permissions

Learn recommends roles with the fewest permissions.

- **Read and write:** Security Administrator or higher, Exchange Administrator, SharePoint Administrator.
- **Read-only:** Helpdesk Administrator, User Administrator, Service Support Administrator, Security Reader, Security Operator, Global Reader.
- **Defender Unified RBAC:** custom roles use the Exposure Management (read) and Exposure Management (manage) permissions under Security posture, with the Microsoft Security Exposure Management data source assigned. Learn says this model is supported only in the Defender portal. For Graph API access, keep using Microsoft Entra roles.

If you want custom Defender roles to take effect, Learn advises removing elevated Entra roles from those users and groups.

## Typical mistakes (my advice)

- Chasing points without reading user impact. Learn says security should be balanced with usability.
- Using Resolved through third party without evidence. Microsoft cannot verify it.
- Expecting an instant change. Allow 24 to 48 hours.
- Treating Risk accepted as a fix. It gives no points and the risk remains.

## Related

- [Secure Score](https://www.m365.fm/entity/secure-score/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Microsoft Secure Score (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/microsoft-secure-score)
- [Assess your security posture through Microsoft Secure Score (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/microsoft-secure-score-improvement-actions)
