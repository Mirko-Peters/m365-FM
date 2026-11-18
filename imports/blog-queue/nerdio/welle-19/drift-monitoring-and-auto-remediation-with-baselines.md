---
title: "Drift monitoring and auto-remediation with baselines"
summary: "In Nerdio Manager for MSP, drift on a solution baseline shows as a Mismatch or Unavailable setting. This guide covers a rollout from Report-only to Enforce, triage, accepted drift and auto-remediation."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-solution-baselines, nerdio-manager-for-msp]
keypoints:
  - "Drift means a baseline setting is Mismatch or Unavailable. Nerdio shows it red when the baseline is enforced, amber when not, and lists the setting per account."
  - "Nerdio's 2024 announcement mentions auto-remediation of drift; current help pages document Enforce and re-applying, but not whether Nerdio corrects drift on its own. Test it on one account."
  - "A safe rollout assigns in Report-only mode with Process after saving cleared, reads the status page, resolves or accepts each difference, and only then switches the assignment to Enforce."
  - "Unavailable has six named reasons, from Loading Failed to Unknown. Nerdio names a next step for only three; the other steps in this article are our suggestions."
  - "Accepted drift has an expiry setting, an optional description and an Allow processing flag, for deliberate exceptions such as a customer whose standard differs from the baseline."
faq:
  - q: "Does Nerdio Manager for MSP fix drift on a solution baseline automatically?"
    a: "Nerdio's 2024 announcement says baselines can be configured to auto-remediate drift by forcing the correct setting, and the help center says Enforce mode applies the baseline to assigned accounts and that a Mismatch is resolved by re-applying the baseline. Whether Enforce re-corrects drift continuously, and at what interval, is not documented in Nerdio's solution baseline help pages, so verify on a test account how soon a changed setting is detected and corrected."
  - q: "What is the difference between Mismatch and Unavailable?"
    a: "Mismatch means the setting differs from the baseline value, and Nerdio says to re-apply the baseline. Unavailable means the state could not be determined or applied, and the tooltip gives a reason such as Loading Failed or Prerequisites Not Met. Nerdio's status legend lists both as drifted."
  - q: "How do I keep a deliberate difference from showing as a problem?"
    a: "Select Accept Drift on the setting, choose an expiry from the drop-down or enter a date, add a description and decide whether to Allow processing on the next republish. The setting stays in the drifted group with the status Accepted drift, and you can remove the acceptance later."
---

On a solution baseline in [Nerdio Manager for MSP](https://www.m365.fm/entity/nerdio-manager-for-msp/), [configuration drift](https://www.m365.fm/entity/configuration-drift/) means a setting is shown as Mismatch or Unavailable on the baseline's status page. Nerdio's help pages describe Enforce mode as applying the baseline to assigned accounts, and re-applying the baseline as the response to a Mismatch. Our suggested order is to assign in Report-only mode, read the status, resolve or accept each difference, and then switch to Enforce.

This guide covers [Nerdio Solution Baselines](https://www.m365.fm/entity/nerdio-solution-baselines/) only; concepts, requirements and the Prerequisites action are in the companion article on solution baselines. Drift on Intune policies and Intune policy baselines is a separate feature with its own status window. Menu labels follow Nerdio's help center and can differ between versions.

## What counts as drift

At the MSP level, open **Solution Baselines**, find the baseline and select **Status overview** from the action menu (or use the status overview icon). Each setting has one of five states:

| State | Meaning in Nerdio's help center | Drifted |
|---|---|---|
| Valid | The current setting matches the baseline value | No |
| Mismatch | The setting differs from the baseline; re-apply the baseline | Yes |
| Excluded | The action is excluded for this tenant and is not checked or enforced | No |
| Not Assigned | The setting has not been assigned to this tenant | No (our reading) |
| Unavailable | The state could not be determined or applied; the tooltip gives the reason | Yes |

Nerdio's legend marks only Mismatch and Unavailable as drifted, so the No for Not Assigned is our reading. The status page uses green for Valid, gray for Excluded, and red or amber for drift: red when the baseline is enforced, amber when it is not. Nerdio's older getting-started article describes the colours differently (yellow for Mismatch, red for Not Found), and the current management page does not list a Not Found state. Point to the icon in your own console; Nerdio says the tooltip shows the state and what it means.

## Run a monitored rollout

The steps below follow Nerdio's getting-started article for Microsoft 365 baselines and the MSP-level management page.

1. **Check the account first.** The baseline's **Prerequisites** action must show Passed for the account. If it shows Not Passed, hover to see the missing license, role, permission or service; the remaining actions are skipped for that account until it passes.
2. **Optionally run a Tenant Assessment.** In the customer account's menu, select **Tenant Assessment**. Nerdio says it compares existing policies with the baselines you plan to deploy and reports findings as Conflict, Overlap, Recommendation or Unavailable, with CSV or JSON export. The overview page says the wizard is in Public Preview as of version 7.0. Nerdio adds that a later run may show fewer findings than an earlier one because of improved result filtering, not because the tenant changed.
3. **Clone the baseline** so the original stays as a starting point, then use **Configure baseline** to review the settings. Nerdio's Purview baseline page says each action supports one or more of the modes Enforce, Report Only and Exclude; some actions do not support Enforce.
4. **Assign in Report-only mode.** Select **Assign > Add assignments**, choose the accounts, choose Add or Overwrite, and select **Confirm**. On the Assignments page, select **Report-only** in the **Mode** column and then **Apply and close**. In the review dialog, make sure **Process the solution baseline after saving** is not selected, because Nerdio says that option immediately applies the baseline to the assigned accounts. Clear **Do you want to remove policies that are affected by this change?** as needed, then select **Confirm**.
5. **Read the status page** and open **View details** on each drifted setting. Decide for each whether the customer should change or the baseline should.
6. **Accept deliberate differences** (see below) rather than leaving them unexplained; the setting stays in the drifted group with the status Accepted drift.
7. **Switch to Enforce.** Assign again, set **Mode** to **Enforce**, select **Apply and close** and confirm. Nerdio says Enforce applies the baseline to all assigned customer accounts, and that Nerdio Manager first tries to fix missing prerequisites by enabling a service or granting permissions. Read the recommended-settings side effects first; they are summarized in the companion article.
8. **Check the status again.** Our reading: because Nerdio shows drift as red on an enforced baseline, a setting that was amber in Report-only and is still drifted will now be red, and one that matches will be green. For a red setting, look at its Unavailable reason first; for a Mismatch, Nerdio says to re-apply the solution baseline. Nerdio does not name a button for that; it documents Assign, **Apply and close** and the optional **Enforce** choice, and for Loading Failed it says to run the baseline again. The baseline's action menu also has a **Reprocess** action, which the help page describes only as reprocessing the solution baseline. The one context Nerdio gives is that after an upgrade an existing baseline might need to be reprocessed before the Prerequisites action appears. Nerdio does not say whether Reprocess re-applies the baseline to assigned accounts, so test it on one account before relying on it. Version 7.4.0 (21 October 2026) changed the baseline background task: when some actions cannot be applied, it shows a warning icon and the Status Overview lists per-action results with error details.

## Triage Unavailable

We suggest looking at Unavailable first. Nerdio defines it as a state that "could not be determined or applied", and depending on the reason the setting might be only partially applied. Nerdio lists these reasons. The last column marks where the next step comes from: Nerdio's own wording, or our suggestion where Nerdio names none.

| Reason | Nerdio's description | Next step |
|---|---|---|
| Loading Failed | The setting could not be loaded from the external API, possibly temporary | Nerdio: run the baseline again |
| Invalid Configuration | The baseline configuration for this action is incomplete or invalid | Nerdio: review the baseline settings before you re-apply it |
| Prerequisites Not Met | One or more prerequisites are not met | Nerdio: check the Prerequisites action, resolve issues, then re-apply |
| API Check Error | An error occurred while reading the setting from the external service | Our suggestion: read the tooltip details, then run the baseline again |
| API Apply Error | An error occurred while applying the setting; it might be partially applied | Our suggestion: re-apply and check the status again |
| Unknown | The status could not be determined | Our suggestion: check the tenant, then run the baseline again |

The release notes show that some Unavailable states have come from product defects rather than tenant problems. Version 7.1.2 (2 July 2026) fixed Intune baseline settings that showed Unavailable after a Microsoft Graph API change, and version 6.7.3 (24 February 2026) fixed two Exchange Online settings, Calendar sharing level and reply-all storm protection, that always resulted in Unavailable or null. After an upgrade, check the release notes before opening a customer ticket.

## Accept drift on purpose

Some differences are correct for one customer. On a drifted setting, select **Accept Drift** and enter:

- **Drift acceptance expires after**: a value from the drop-down or a typed date.
- **Description**: optional, but useful for the next engineer.
- **Allow processing**: if selected, the next republish attempts to sync the setting.

Select **Accept**. The setting stays in the drifted group with the status Accepted drift; hovering shows when and by whom it was accepted, the expiry (never if there is none), the re-publishing mode and the description. Use the remove icon next to Accepted drift to withdraw it.

Release notes add three details. Version 6.8.0 (a preview release of 17 March 2026, with GA in 6.8.1 on 31 March 2026) made Allow processing disabled by default. Version 6.7.2 (17 February 2026) made accepted drifts persist when assignments are removed, with a checkbox to delete them, and fixed the Accepted Drifts page so that it shows the drift expiration date. Version 7.0.1 (13 May 2026) improved how expiry is handled. Accepted drift on Intune policies works in a related way and is covered in the article on managing Intune for MSP clients with Nerdio.

## A worked example

This is our own example, not a scenario from Nerdio. A fictional MSP assigns a cloned Teams baseline to 10 accounts in Report-only mode. Eight accounts show mostly green. One of them shows a Mismatch on a single setting, because that customer's own standard deliberately differs from the baseline value. On the Status page the MSP opens **View details** and selects **Accept Drift** on that setting, with an expiry three months out, the description "Customer standard differs, review at renewal" and Allow processing cleared. Nerdio describes Accept Drift for "any drifted setting", so we treat it as a per-setting action: a second Mismatch on the same account would need its own acceptance. Nerdio says the accepted setting stays in the drifted group with the status Accepted drift.

The ninth account shows Unavailable with Prerequisites Not Met, and the tooltip on Not Passed lists a missing license. Nerdio says the remaining actions are skipped for that account while prerequisites are not met. Nerdio offers Accept Drift for any drifted setting and lists Unavailable as drifted, but its pages do not say how settings skipped while prerequisites are missing are shown. Accepting drift for a missing licence would hide a problem rather than record a decision, so we resolve the prerequisite first. It follows Nerdio's order instead: resolve the missing item, then re-apply the baseline. The tenth account has the same pattern, and the MSP handles it the same way. The MSP then switches the assignment to Enforce. Counts, dates and wording are illustrative.

## What the documentation does not settle

- **Auto-remediation.** The 2024 announcement says baselines can be configured to auto-remediate drift by forcing the correct setting. Nerdio's solution baseline help pages describe no setting by that name and give no interval at which assigned accounts are re-evaluated. Release notes mention policy status caching and tuned drift detection intervals for policies, without values. Test with one account: change a setting in the customer tenant and watch when the status and the setting change.
- **Notifications.** Release notes list drift-detected notification conditions for policy profiles in version 6.3.0 Preview (11 August 2025), with a known issue that notification emails could fail to send and a statement that it would be fixed in the 6.3.1 GA release. A later note says some policy drift notifications did not trigger because of an internal policy type filter, now resolved. None of these notes say that solution baselines send such emails.
- **Per-setting versus assignment mode.** Nerdio does not spell out how the two combine.
- **Scale.** Version 6.8.0 (a preview release, with GA in 6.8.1) fixed cancelling long-running operations when a baseline was applied to 100 or more accounts; staging large rollouts is our suggestion.

## Alternatives

Microsoft 365 Lighthouse is a separate [Microsoft tool](https://www.m365.fm/entity/microsoft-365-lighthouse/) with a default SMB security baseline; the companion article compares it with Nerdio's baselines. Nerdio's own policy baselines cover Intune policies separately. Choose by the tool your team already operates, not by feature names.

## Sources

- [Nerdio help center: Solution Baselines, MSP-level management](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498298095373)
- [Nerdio help center: Configure a Solution Baseline for Microsoft Purview](https://nmmhelp.getnerdio.com/hc/en-us/articles/47914654965773-Configure-a-Solution-Baseline-for-Microsoft-Purview)
- [Nerdio help center: Get started with Microsoft 365 solution baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/37958534716941-Get-started-with-Microsoft-365-solution-baselines-in-Nerdio-Manager)
- [Nerdio help center: What Microsoft 365 solution baseline settings are recommended?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35388344800013-What-Microsoft-365-solution-baseline-settings-are-recommended)
- [Nerdio help center: Tenant Assessment Wizard Overview](https://nmmhelp.getnerdio.com/hc/en-us/articles/47405622370317-Tenant-Assessment-Wizard-Overview)
- [Nerdio help center: Run a Tenant Assessment](https://nmmhelp.getnerdio.com/hc/en-us/articles/47405609067021-Run-a-Tenant-Assessment)
- [Nerdio help center: NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
