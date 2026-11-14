---
title: "How to Run Phishing Simulations With Attack Simulation Training"
summary: "Launch a phishing simulation in Microsoft Defender for Office 365: license note, the ten wizard steps from technique to launch details, training and notifications, reports, and copy, cancel and delete behavior, with gaps in the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [defender-for-office-365]
keypoints:
  - "Learn names Microsoft 365 E5 or Defender for Office 365 Plan 2. The Applies to line lists only Plan 2. The page names no required roles."
  - "Start under Email & collaboration > Attack simulation training > Simulations and select Launch a simulation. Seven techniques are offered, such as Credential Harvest and Malware Attachment."
  - "The wizard covers name, payload and login page, target users, exclusions, training, landing page, end user notifications, launch details and review."
  - "The default and minimum simulation length is 2 days, the maximum is 30. Training due dates are 7, 15 or 30 days after the simulation ends."
  - "Cancel works for Scheduled or In progress simulations. Delete is not available while a simulation is In progress."
faq:
  - q: "What license do I need?"
    a: "The intro says Microsoft 365 E5 or Microsoft Defender for Office 365 Plan 2. The Applies to line lists only Plan 2. A 90-day Defender for Office 365 trial is available from the Defender portal trials hub."
  - q: "Where do I start a simulation?"
    a: "In the Defender portal go to Email & collaboration > Attack simulation training > Simulations, or open the attacksimulator page in security.microsoft.com, and select Launch a simulation."
  - q: "Which techniques are available?"
    a: "Credential Harvest, Malware Attachment, Link in Attachment, Link to Malware, Drive-by URL, OAuth Consent Grant and How-to Guide. Credential Harvest, Link to Malware, OAuth Consent Grant and How-to Guide support QR codes."
  - q: "Can I stop a running simulation?"
    a: "Yes. Cancel is available for Scheduled and In progress simulations. A scheduled simulation is cancelled with no training or notifications sent. For In progress, delivery continues but phishing links are deactivated and reminders are cancelled."
  - q: "How long does a simulation run?"
    a: "The page sets the number of days to end the simulation after launch, with a default and minimum of 2 days and a maximum of 30."
---

Attack simulation training sends realistic phishing messages to chosen users, then assigns training to those who fall for them. This guide follows the Microsoft Learn page on creating and launching simulations in Microsoft Defender for Office 365. The page names no required roles or limits.

## License

The intro says attack simulation training is available in Microsoft 365 E5 or Microsoft Defender for Office 365 Plan 2. The Applies to line lists only Plan 2. The page offers a 90-day Defender for Office 365 trial from the Defender portal trials hub.

## Start

In the Defender portal go to **Email & collaboration** > **Attack simulation training** > **Simulations** and select **Launch a simulation**.

## The wizard

1. **Technique.** Choose one of seven: Credential Harvest, Malware Attachment, Link in Attachment, Link to Malware, Drive-by URL, OAuth Consent Grant or How-to Guide. Credential Harvest, Link to Malware, OAuth Consent Grant and How-to Guide support QR codes.
2. **Name.** Enter a unique name and an optional description.
3. **Payload and login page.** Pick from **Global payloads** or **Tenant payloads**, with filters such as complexity and language. **Send a test** emails a copy to you. For Credential Harvest and Link in Attachment you can change the login page. OAuth Consent Grant needs an app name, an optional logo and one app scope.
4. **Target users.** Include all users, or only specific users and groups through **Add users** or an **Import** of a CSV file with one email address per line. Groups can be Microsoft 365 Groups, static distribution groups and static mail-enabled security groups. Hidden membership groups are not supported.
5. **Exclusions.** Optionally exclude some targeted users. The step is skipped for How-to Guide.
6. **Training.** Choose **Microsoft training experience (Recommended)**, **Redirect to a custom URL** or **No training**. Due dates are 7, 15 or 30 days after the simulation ends, with 30 as the default.
7. **Landing page.** Choose a library landing page or a custom URL.
8. **End user notifications.** Choose no notifications, the Microsoft default (recommended) or customized notifications. Customized ones need a training assignment notification and a training reminder, Weekly by default or Twice a week.
9. **Launch details.** Launch as soon as you finish or schedule it. Set the days until the simulation ends: default and minimum 2, maximum 30. You can enable region aware time zone delivery.
10. **Review.** Select **Submit**. The status becomes In progress or Scheduled.

After naming you can select **Save and close** to keep a draft. Resume it with **Edit simulation**.

## Results

The **Simulations** tab shows name, type, platform, dates, compromise rates, technique and status. Statuses are Draft, Scheduled, In progress, Completed, Failed, Canceled and Excluded. Select a row or **View report** to see the **Report**, **Users** and **Details** tabs. The Users tab can filter by compromised users, reported messages and training status.

## Copy, cancel, delete, exclude

- **Copy** works for any status. The copy gets a _Copy suffix. Copying failed simulations is not recommended.
- **Cancel** works for In progress or Scheduled simulations. A scheduled one is cancelled completely. For an in-progress one, delivery continues, phishing links are deactivated and reminders are cancelled.
- **Delete** is not available while a simulation is In progress.
- **Exclude** is available only for Completed simulations.

## What the page does not say

- Required roles or permissions.
- Limits on users, simulations, payloads or groups.
- Plan 1 availability.
- The definition of predicted compromise rate. It is on another page.
- The page has several inconsistent UI labels, so screens may differ slightly.

## A first simulation outline

This outline is practical advice built on the page.

1. Pick a technique and test the payload with Send a test.
2. Start with a small group before you target everyone.
3. Use the Microsoft training experience and default notifications for a first run.
4. Keep the default two-day run, then read the report.
5. Use Copy to repeat a simulation with changes.

## Typical mistakes

- Assuming a role is documented. The page names none.
- Cancelling an in-progress run and expecting delivery to stop.
- Expecting QR code support for every technique.
- Excluding users in a How-to Guide run. That step does not exist there.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Create and launch a simulation in Attack simulation training (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/attack-simulation-training-simulations)
