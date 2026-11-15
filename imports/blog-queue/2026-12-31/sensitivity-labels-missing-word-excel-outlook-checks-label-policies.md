---
title: "Sensitivity Labels Missing in Word, Excel and Outlook: Checks for Label Policies"
summary: "Why sensitivity labels do not show in Office apps, using Microsoft Learn: policy publishing and assignment, label scope, propagation time, the Windows Sensitivity setting, file types, mailbox location and the retired AIP add-on."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [sensitivity-labels, purview, microsoft-information-protection]
keypoints:
  - "Learn has no single troubleshooting list, so the checks here are gathered from the Office apps article and the label creation article."
  - "A label must be published in a label policy and assigned to the user. Changes can take up to 24 hours to apply, and group changes 24 to 48 hours."
  - "A label scoped only to Emails does not appear in Word, Excel or PowerPoint, and the reverse is also true."
  - "On Windows, the policy setting Use the Sensitivity feature in Office to apply and view sensitivity labels can hide the Sensitivity button."
  - "The AIP add-in policy setting must be Not configured or Disabled. Labels are not supported for on-premises mailboxes in Outlook, including shared mailboxes."
faq:
  - q: "Why do users not see any sensitivity labels?"
    a: "According to Microsoft Learn, labels must be published to users in a label policy from the Microsoft Purview portal, and users without an assigned policy do not see the labels."
  - q: "How long do label changes take to show?"
    a: "Learn lists up to 24 hours for label and policy changes and 24 to 48 hours for some group related changes. Treat these as the documented waiting times before you troubleshoot further."
  - q: "Why is the Sensitivity button missing in Office on Windows?"
    a: "According to Microsoft Learn, the setting Use the Sensitivity feature in Office to apply and view sensitivity labels may be disabled. Set it to Enabled and restart the apps."
  - q: "Do labels work with perpetual Office?"
    a: "According to Microsoft Learn, sensitivity labels are not supported for standalone editions of Office, sometimes called Office Perpetual. A subscription edition is required."
---

When a sensitivity label does not show in Word, Excel, PowerPoint or Outlook, the cause is usually one of a few things: the label is not published to that user, its scope does not include the item type, a recent change has not propagated, a Windows policy setting hides the button, or the app, file type or mailbox is not supported. Microsoft Learn has no single page titled as a troubleshooting list. The checks below are gathered from the article on sensitivity labels in Office apps and the article on creating and publishing labels.

## Check 1: Is the label published and assigned

Learn says labels must be published to users from the Microsoft Purview portal, using a label policy. The path described on the label creation page for publishing is the Purview portal, **Solutions**, **Information Protection**, **Publishing policies**, then **Publish label**. Users who have no label policy assigned do not see the labels.

Also check:

- Group membership. If the policy targets a group, the user must be a member.
- Administrative units. If your account is assigned administrative units, you must select at least one when you create the policy, and the policy then applies only to those users.
- Policy order. The page says to review the policy order if more than one label policy might conflict for a user.
- Sublabels in the classic scheme. A sublabel without its parent in the policy is a possible cause.

## Check 2: Wait for propagation

The label creation page says changes can take up to 24 hours to apply, and some group related changes 24 to 48 hours. My advice, not a Microsoft statement: avoid changing the configuration again during this time, because it makes the cause harder to find. Learn itself says it is a good idea to wait the 24 hours before you spend time troubleshooting recent changes.

## Check 3: Label scope

A label has a scope: **Files & other data assets**, **Emails**, and others. The Office apps article describes the scope as the way to show labels only in Outlook (Emails selected, not Files & other data assets) or only in Word, Excel and PowerPoint (Files & other data assets selected, not Emails). A label whose scope is not selected for an app is not available there. The same article says that if you use label policy settings with a label scoped to just files or just emails, the same policy must also include at least one label with both scope options. According to the creation page, you cannot select Meetings unless Files & other data assets and Emails are also selected.

## Check 4: The Windows policy setting

On Windows, the policy setting **Use the Sensitivity feature in Office to apply and view sensitivity labels** controls whether labels show. Set to **Disabled** (0), labels are turned off. Set to **Enabled** (1), they come back. Learn says you might need to enable it if the **Sensitivity** button is not on the ribbon as expected, for example because a previous administrator turned it off. Changes take effect when the apps restart. The setting does not affect other platforms such as macOS, mobile devices or Office for the web.

## Check 5: The old add-in setting

The Windows add-in from the Azure Information Protection unified labeling client is retired and replaced by labels built into Office apps. The policy setting **Use the Azure Information Protection add-in for sensitivity labeling** must be **Not configured** or **Disabled**. If it is **Enabled**, you cannot use sensitivity labeling in Office apps. Learn places it in Group Policy under User Configuration, Administrative Templates, Microsoft Office 2016, Security Settings, or in the Cloud Policy service.

## Check 6: Office edition, version and file type

- A subscription edition of Office is required. Standalone editions, sometimes called Office Perpetual, are not supported.
- A supported Office version is required. Minimum versions per app and platform are in a separate article that I did not read in full.
- When a file type is not supported, the **Sensitivity** button is not available. Supported types include .docx, .xlsx and .pptx families. Legacy .doc and .xls and ODF formats are not supported, and labeling embedded files is not supported.

## Check 7: Mailbox location and users

For Outlook on Windows, macOS, iOS, Android and on the web, the mailbox must be hosted in Exchange Online. Labels are not supported for mailboxes hosted on-premises. This limitation also applies to shared mailboxes, even if the users accessing them have mailboxes in Exchange Online. Learn also notes that labels display only if the user belongs to the same tenant, and this excludes guest accounts.

## Check 8: Office for the web

For documents in SharePoint or OneDrive, Learn says to make sure you enabled sensitivity labels for Office files in SharePoint and OneDrive. The page has no dedicated section on the Sensitivity button in Office for the web.

## Suggestion: a checking order

This section is a practical suggestion and not a Microsoft statement.

1. Test with one affected user in the Purview portal: is the label in a published policy that includes this user?
2. Compare the label scope with the app.
3. Check the age of the change against the 24 and 48 hour values.
4. On Windows, check the two policy settings from checks 4 and 5.
5. Check edition, app version, file type and mailbox hosting.

## Not covered

The pages I read do not describe the following:

- A dedicated troubleshooting checklist or a section named why you do not see labels.
- Minimum Office versions in a table.
- License SKUs, which are in the service description.
- Step-by-step behavior of the Sensitivity button in Office for the web.

## Related

- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Microsoft Information Protection](https://www.m365.fm/entity/microsoft-information-protection/)

## Sources

- [Create and publish sensitivity labels (Microsoft Learn)](https://learn.microsoft.com/purview/create-sensitivity-labels)
- [Manage Sensitivity Labels in Office Apps (Microsoft Learn)](https://learn.microsoft.com/purview/sensitivity-labels-office-apps)
