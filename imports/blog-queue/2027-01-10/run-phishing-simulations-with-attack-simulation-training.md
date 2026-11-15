---
title: "How to Run Phishing Simulations With Attack Simulation Training"
summary: "Launch a phishing simulation in Microsoft Defender for Office 365: license note, the ten wizard steps from technique to launch details, training and notifications, reports, and copy, cancel and delete behavior, with gaps in the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [defender-for-office-365]
keypoints:
  - "Learn names Microsoft 365 E5 or Defender for Office 365 Plan 2 for this feature. The page names no required roles."
  - "Start under Email & collaboration > Attack simulation training > Simulations and select Launch a simulation. Seven techniques are offered, such as Credential Harvest and Malware Attachment."
  - "The wizard covers name, payload and login page, target users, exclusions, training, landing page, end user notifications, launch details and review."
  - "The default and minimum simulation length is 2 days, the maximum is 30. Training due dates are 7, 15 or 30 days after the simulation ends."
  - "Cancel works for Scheduled or In progress simulations. Delete is not available while a simulation is In progress."
faq:
  - q: "What license do I need?"
    a: "The intro says Attack simulation training is in Microsoft 365 E5 or Microsoft Defender for Office 365 Plan 2, and the page description mentions Plan 2. A 90-day Defender for Office 365 trial is linked from the Defender portal trials hub."
  - q: "Where do I start a simulation?"
    a: "In the Defender portal go to Email & collaboration > Attack simulation training > Simulations, or open the attacksimulator page in security.microsoft.com, and select Launch a simulation."
  - q: "Which techniques are available?"
    a: "Credential Harvest, Malware Attachment, Link in Attachment, Link to Malware, Drive-by URL, OAuth Consent Grant and How-to Guide. Credential Harvest, Link to Malware, OAuth Consent Grant and How-to Guide support QR codes."
  - q: "Can I stop a running simulation?"
    a: "Yes. Cancel is available for Scheduled and In progress simulations. A scheduled simulation is cancelled completely, with no training assignment messages or notifications sent. For In progress, delivery to targets continues. Phishing links are deactivated for every technique except Malware Attachment, whose landing page stays visible. Training reminders are canceled if you cancel after a training assignment, and trainings are not assigned if you cancel before it."
  - q: "How long does a simulation run?"
    a: "The page sets the number of days to end the simulation after launch, with a default and minimum of 2 days and a maximum of 30."
---

Attack simulation training sends realistic phishing messages to chosen users, then assigns training to those who fall for them. This guide follows the Microsoft Learn page Simulate a phishing attack with Attack simulation training. The page names no required roles or limits.

## License

The intro says attack simulation training is available in Microsoft 365 E5 or Microsoft Defender for Office 365 Plan 2, and the page description mentions Plan 2. The page links a 90-day Defender for Office 365 trial from the Defender portal trials hub.

## Start

In the Defender portal go to **Email & collaboration** > **Attack simulation training** > **Simulations** and select **Launch a simulation**.

## The wizard

1. **Technique.** Choose one of seven: Credential Harvest, Malware Attachment, Link in Attachment, Link to Malware, Drive-by URL, OAuth Consent Grant or How-to Guide. Credential Harvest, Link to Malware, OAuth Consent Grant and How-to Guide support QR codes.
2. **Name.** Enter a unique name and an optional description.
3. **Payload and login page.** Pick from **Global payloads** or **Tenant payloads**, with filters such as complexity and language. **Send a test** emails a copy to you. For Credential Harvest and Link in Attachment you can change the login page. OAuth Consent Grant adds a Configure OAuth payload page with an app name, an app logo (a .png, .jpeg or .gif file) and one app scope.
4. **Target users.** Include all users, or only specific users and groups through **Add users** or an **Import** of a CSV file with one email address per line. Groups can be Microsoft 365 Groups, static distribution groups and static mail-enabled security groups. Hidden membership groups are not supported.
5. **Exclusions.** Optionally exclude some of the targeted users from the simulation. A tip placed after this step says that with How-to Guide you go directly to the Select end user notification page.
6. **Training.** Choose **Microsoft training experience (Recommended)**, **Redirect to a custom URL** or **No training**. Due dates are 7, 15 or 30 days after the simulation ends, with 30 as the default.
7. **Landing page.** Choose a library landing page or a custom URL. A custom URL is not available for Malware Attachment or Link to Malware.
8. **End user notifications.** Choose no notifications, the Microsoft default (recommended) or customized notifications. Customized ones need a training assignment notification and a training reminder (frequency Weekly by default or Twice a week), plus an optional positive reinforcement notification. For How-to Guide only a positive reinforcement notification can be configured.
9. **Launch details.** Launch as soon as you finish or schedule it. Set the days until the simulation ends: default and minimum 2, maximum 30. You can enable region aware time zone delivery.
10. **Review.** Select **Submit**. The status becomes In progress or Scheduled.

After naming you can select **Save and close** to keep a draft. Resume it with **Edit simulation**.

## Results

The **Simulations** tab shows name, type, platform, dates, compromise rates, technique and status. Statuses are Draft, Scheduled, In progress, Completed, Failed, Canceled and Excluded. For In progress or Completed simulations, select a row or **View report** to see the **Report**, **Users** and **Details** tabs. The Users tab can filter by compromised users, reported messages and training status.

## Copy, cancel, delete, exclude

- **Copy** works for any status. The copy gets a _Copy suffix. Copying failed simulations is not recommended.
- **Cancel** works for In progress or Scheduled simulations. A scheduled one is cancelled completely. For an in-progress one, delivery to targets continues. Phishing links are deactivated for every technique except Malware Attachment, whose landing page stays visible. Training reminders are canceled if you cancel after a training assignment, and trainings are not assigned if you cancel before it. Positive reinforcement messages are still delivered if a user reports the message.
- **Delete** is not available while a simulation is In progress.
- **Exclude** is available only for Completed simulations.

## What the page does not say

- Required roles or permissions.
- Limits on users, simulations, payloads or groups.
- Plan 1 availability.
- Full detail on the predicted compromise rate. The page gives a one-line definition (historical data across Microsoft 365 predicting the share of recipients compromised by the payload) and links to another page.
- The page has several inconsistent UI labels, so screens may differ slightly.

## A first simulation outline

This outline is my advice, built on the page.

1. Pick a technique and test the payload with Send a test.
2. Start with a small group before you target everyone.
3. Use the Microsoft training experience and default notifications for a first run.
4. Keep the default two-day run, then read the report.
5. Use Copy to repeat a simulation with changes.

## Typical mistakes (my advice)

- Assuming a role is documented. The page names none.
- Cancelling an in-progress run and expecting delivery to stop.
- Expecting QR code support for every technique.
- Planning exclusions for a How-to Guide run without checking the wizard. The page says that technique goes directly to the end user notification page.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Simulate a phishing attack with Attack simulation training (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/attack-simulation-training-simulations)
