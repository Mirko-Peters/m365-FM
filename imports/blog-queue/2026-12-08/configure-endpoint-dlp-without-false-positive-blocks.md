---
title: "Configure Purview Endpoint DLP without high false-positive blocks"
summary: "Reduce false positives in Microsoft Purview Endpoint DLP: design before building, test in simulation mode, scope by user and device, tune exclusions and allow lists, and use override and audit actions first."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [endpoint-dlp, dlp, dlp-simulation-mode, purview]
keypoints:
  - "Move a policy through states: Keep it off, simulation mode, simulation with policy tips for a pilot group, then Turn it on right away."
  - "Simulation runs up to 15 days and keeps results for 30 days. Tune a noisy policy by copying it, changing the copy and simulating that version."
  - "Both the user and the device must be in the policy scope, so scope narrowly. Use audit, warn or block with override before hard blocks."
  - "Endpoint settings offer file path exclusions, restricted app groups, domain lists and a built-in false positive option in policy tips."
  - "Advanced classification scanning adds exact data match and trainable classifiers, which are more precise than local-only detection."
faq:
  - q: "How do I test an Endpoint DLP policy before it blocks users?"
    a: "Microsoft Learn describes policy states. Keep it off while you design, then Run the policy in simulation mode, where no actions are enforced and events are audited. A further state adds policy tips for a pilot group. Only then choose Turn it on right away. The simulation page lists Devices among the supported locations."
  - q: "How long does simulation mode run?"
    a: "The simulation mode page says simulations can run for up to 15 days and data from a simulation run is kept for 30 days. For Devices, only items that are new during the simulation are evaluated. Simulation alerts appear in the simulation alerts tab and do not show in the DLP alerts console."
  - q: "How can users report a false positive?"
    a: "For Block with override, the business justification options in the policy tip can include a Show false positive option. The Learn page gives the default text as 'The information in these files is not sensitive'. You can customize up to five drop-down options."
  - q: "Which settings exclude noise from Endpoint DLP?"
    a: "The Endpoint DLP settings page lists file path exclusions for Windows and Mac, restricted apps and app groups, browser and domain restrictions, network share exclusions, and the setting Always audit file activity for devices. Learn warns that files in excluded paths are not audited at all."
  - q: "Does turning off Always audit file activity change which rules match?"
    a: "No. Learn says turning it off audits Office, PDF and CSV activity only when a device is in an active policy. That reduces audit noise but does not change whether DLP rules match."
---

False positives in Endpoint DLP usually come from rules that are too broad, scopes that include everyone, and actions that block too early. The safest route is to design the policy first, test it in simulation mode, scope it by user and device, and start with audit, warn or block-with-override actions before you enforce hard blocks.

## Step 1: Design before you build

Microsoft Learn's policy design article says designing a policy before implementing it gets you to the desired results faster, with fewer unintended issues, than tuning by trial and error. Write down the policy intent with stakeholders, the locations, and the trigger threshold. Learn calls the instance count threshold "leakage tolerance" and links to its confidence level documentation. The page does not give recommended values, so decide these with the data owners.

Complex rules use AND, OR and NOT groups. Exceptions are expressed as NOT conditions in a nested group. One limitation: in Office desktop apps, a policy with complex conditions shows policy tips only for rules that use the **Content contains sensitive information** condition.

## Step 2: Deploy in stages

The policy deployment article lists these states:

1. **Keep it off.** Use while you develop and review.
2. **Run the policy in simulation mode.** No actions are enforced and events are audited. Monitor the DLP simulation overview and Activity explorer.
3. **Run the policy in simulation mode and show policy tips.** Users get tips and emails but nothing is blocked. Learn recommends scoping this to a pilot group.
4. **Turn it on right away.** Full enforcement. Keep monitoring alerts and Activity explorer.

The simulation mode page says simulations can run for up to 15 days, and results are kept for 30 days. It lists Devices among supported locations. For Devices, only items that are new during the simulation are evaluated. Results appear on the Simulation overview, Items for review and Alerts pages. Simulation alerts do not appear in the DLP alerts console or the Defender portal.

To tune a noisy policy, Learn suggests copying it. Change the copy, run it in simulation mode, and if the result is better, turn off the original and enforce the copy.

## Step 3: Scope by user and device

Learn's Endpoint DLP page says that for a policy to apply to an endpoint, both the user and the device must be in the policy scope. Start with a pilot group. Policy updates take about an hour to sync, and items are reevaluated the next time they are accessed or modified.

## Step 4: Choose softer actions first

The same page lists actions per activity. Copy to clipboard supports **Block with override**. Copy to USB, copy to a network share and print support **Warn**. Every activity can be audited. Start with audit or warn, review Activity explorer, then tighten.

A caution from the page: a Block rule on an open file also restricts copying from other files in the same application while the blocked file is open. This can look like a false positive to users.

## Step 5: Tune the endpoint settings

In the Microsoft Purview portal, open **Data loss prevention** > **Overview** > **Data loss prevention settings** > **Endpoint settings**. The settings page lists several tools:

| Setting | How it reduces noise | Caution |
|---|---|---|
| Advanced classification scanning | Adds exact data match, trainable classifiers and named entities, which are more precise | Bandwidth limits per device, 64 MB text and 50 MB image limits, not for Paste to browser |
| File path exclusions | Skip paths such as `C:\Temp\` | Files in excluded paths are not audited |
| Restricted app groups | Allow trusted apps without action on clipboard, USB, network drive or print | Group settings override the restricted apps list |
| Service domains | Allow or block uploads per domain | Applies to Edge, or Chrome and Firefox with the Purview extension |
| Always audit file activity for devices | Turn off to audit only devices in an active policy | Does not change rule matching |
| Auto-quarantine | Stops repeated notifications for sync apps such as onedrive.exe | Moves items to an admin-defined folder |

Default Windows path exclusions already cover the AppData Roaming and Local folders of each user.

## Step 6: Give users a way to say it is wrong

With **Block with override**, the business justification options can include **Show false positive option**, with the default text "The information in these files is not sensitive". Review these answers in the alerts. If many users report the same pattern, tune the rule or exclusion instead of leaving the noise.

## Step 7: Review and repeat

Use Activity explorer and alerts to find the rules that match most often. Narrow the sensitive information types or raise the threshold on those rules, test in a simulated copy, and promote the copy. The pages I read do not specify a review interval, so set one with your compliance team.

## Common mistakes

- Enforcing on all devices and users on day one.
- Using block when block with override or warn would do.
- Adding broad path exclusions that remove audit coverage.
- Forgetting that Windows Servers need Endpoint DLP enabled explicitly.
- Tuning the live policy instead of a simulated copy.

## Related

- [Endpoint DLP](https://www.m365.fm/entity/endpoint-dlp/)
- [Data loss prevention](https://www.m365.fm/entity/dlp/)
- [DLP simulation mode](https://www.m365.fm/entity/dlp-simulation-mode/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Learn about Endpoint data loss prevention](https://learn.microsoft.com/en-us/purview/endpoint-dlp-learn-about)
- [Configure endpoint DLP settings](https://learn.microsoft.com/en-us/purview/dlp-configure-endpoint-settings)
- [Create and deploy data loss prevention policies](https://learn.microsoft.com/en-us/purview/dlp-create-deploy-policy)
- [Data loss prevention simulation mode](https://learn.microsoft.com/en-us/purview/dlp-simulation-mode-learn)
- [Design a data loss prevention policy](https://learn.microsoft.com/en-us/purview/dlp-policy-design)
