---
title: "How to Work Incidents and Alerts in the Microsoft Defender Portal"
summary: "Triage and resolve incidents in the Microsoft Defender portal: queue path, assigning owners, severity, status, tags, classification, comments, activity log, analyst notes and PDF export, based on the legacy incident page, with noted gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [defender]
keypoints:
  - "Open the queue under Investigation & response > Incidents & alerts > Incidents. Select an incident and use Manage incidents to assign, set status and classify."
  - "New incidents have no owner. Only one user or group can be assigned, and the assignment applies to all associated alerts."
  - "Resolving an incident resolves all linked and active alerts. Classification can be Not set, True positive, Informational expected activity or False positive."
  - "The Learn page describes the legacy experience. Its note points to incident cases in preview as the recommended experience."
  - "The page does not describe merging, the alerts tab, evidence and response or automatic investigation steps, and it lists no specific roles."
faq:
  - q: "Where do I find incidents?"
    a: "In the Microsoft Defender portal use the quick launch and go to Investigation & response > Incidents & alerts > Incidents."
  - q: "How do I assign an incident?"
    a: "Select the incident, select Manage incidents, use the Assign to box to pick a user or group and select Save. Only one user or group can be assigned, and it applies to all associated alerts."
  - q: "What happens when I resolve an incident?"
    a: "Select Resolved from the Status drop-down, enter a note and select Save. Resolving an incident also resolves all the linked and active alerts that belong to it."
  - q: "Which classifications exist?"
    a: "Not set (default), True positive with a threat type, Informational expected activity with an activity type, and False positive."
  - q: "Is this page current?"
    a: "It describes the legacy incident experience. A note on the page says incident cases are in preview and are the recommended experience, with a separate article."
---

Incidents group related alerts into one case for analysts. The daily work is triage: give each incident an owner, check severity, set a status, add tags and comments, and finally resolve and classify it. This guide follows the Microsoft Learn page on managing incidents in the Microsoft Defender portal. The page describes the legacy experience and points to incident cases as the recommended one.

## Open the queue

Use the quick launch and go to **Investigation & response** > **Incidents & alerts** > **Incidents**. To manage an incident, either select its check box and choose **Manage incidents** above the filters, or select the row without clicking the name and choose **Manage incident** in the details pane. You can select several check boxes for bulk management. The page says you need a role assigned through Microsoft Defender XDR role-based access control. It names no specific permission for incident management.

## Triage

- **Assign.** New incidents have no owner. Use the **Assign to** box to choose a user or group, then **Save**. Only one user or group can be assigned. The assignment applies to all associated alerts.
- **Filter by assignee.** Use the **Incident assignment** filter. Unlike assignment, you can select several assignees. **Copy list link** saves the queue with the current filters.
- **Severity.** It is the highest severity of the associated alerts: high, medium, low or informational. You can change it in the **Severity** drop-down.
- **Status.** Incidents start as **Active**. Change to **In progress** when you work on them, and to **Resolved** at the end.
- **Tags.** Type in the **Incident tags** field and pick an existing tag or create a new one. System tags identify attack types, automatic actions, Defender Experts handling and critical assets.

## Resolve and classify

1. Select **Resolved** in the **Status** drop-down and enter a note that explains the resolution. The note appears in the activity log and the incident details.
2. Choose a classification:
   - **Not set** (default)
   - **True positive**, with a threat type
   - **Informational, expected activity**, with an activity type
   - **False positive**
3. Select **Save**.

Resolving an incident also resolves all linked and active alerts.

## Comments and history

Select the three dots in the upper right corner > **Activities**, then **Add comment**. Comments are limited to 30,000 characters and support text, formatting, links and images. All changes made by users or the system are recorded in the activity log, which you can filter by origin, category, provider, trigger, status, type, target and performed by.

## Rename

You can rename an incident in the **Incident name** field. If another incident is merged into a renamed incident, Defender gives it a new name and overwrites the custom name.

## AI-generated analyst notes

The page lists prerequisites: a security administrator turns on the feature under **System** > **Settings** > **Microsoft Defender XDR** > **Advanced features**, a Security Copilot license, and the Security Data Read or Security Data Manage permission. Generation can take up to 20 minutes. Saving an edit removes the AI disclaimer.

## Export and notifications

Export an incident as PDF through **More actions** > **Export incident as PDF**. The export includes an overview, the attack story graph, up to 10 assets per asset type, up to 100 evidence items, related alerts and activity log entries. Email notifications for incidents are configured by alert severity, alert sources and device group, on a separate page.

## What the page does not say

- How to merge incidents. It only mentions merging in the renaming note.
- The alerts tab and the evidence and response view.
- Automatic investigation steps. Those are on a linked page.
- Specific roles for incident management.
- Queue sort options and the full filter list.

## A triage outline

This outline is practical advice built on the page.

1. Filter the queue for unassigned incidents.
2. Assign an owner and set the status to In progress.
3. Review severity and tags, then investigate on the linked investigation pages.
4. Add comments as you go so that the activity log tells the story.
5. Resolve with a note and a classification.

## Typical mistakes

- Resolving an incident and forgetting that its active alerts are resolved too.
- Expecting to assign several owners. Only one is allowed.
- Using the legacy page for incident cases without checking the note.
- Relying on a custom name after a merge.

## Related

- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Manage incidents in the Microsoft Defender portal (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/manage-incidents)
