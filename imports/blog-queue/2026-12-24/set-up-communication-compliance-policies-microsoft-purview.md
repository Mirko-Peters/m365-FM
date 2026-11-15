---
title: "Set Up Communication Compliance Policies in Microsoft Purview: Prerequisites and Steps"
summary: "Configure Communication Compliance in Microsoft Purview: role groups, audit log, groups and reviewers, creating a policy from a template or a custom policy, conditions, testing and the documented 24 to 48 hour timing."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [communication-compliance, purview]
keypoints:
  - "Open Communication Compliance in the Microsoft Purview portal, select Policies, then Create policy. Use a template or a custom policy."
  - "The audit log is required. Auditing is on by default, and after you turn it on the log takes a couple of hours to prepare."
  - "Reviewers must be individual users with Exchange Online mailboxes. Groups cannot be reviewers."
  - "The policy name cannot be changed after creation. Policies detect only activity that occurs after they are active."
  - "Email takes about 24 hours to process, Teams and Viva Engage about 48 hours. PowerShell cannot create or manage these policies."
faq:
  - q: "Which roles can use the policy condition testing feature?"
    a: "According to Microsoft Learn, members of the Communication Compliance Admins or Communication Compliance role group. You assign them on the Role groups page in the Microsoft Purview portal."
  - q: "Is the audit log required?"
    a: "Yes. Learn says Communication Compliance needs the audit log to show alerts and log remediation actions. Auditing is on by default, and after you turn it on the log takes a couple of hours to prepare."
  - q: "Can I use a distribution group for reviewers?"
    a: "No. Learn says reviewers cannot be groups. They must be individual users with Exchange Online mailboxes. Groups are supported for scoped and excluded users, with some types unsupported."
  - q: "How soon do alerts appear?"
    a: "Learn says email can take approximately 24 hours to fully process in a policy, and communications in Teams, Viva Engage and third-party platforms approximately 48 hours. It tells you to give policies time to activate and gives no specific activation time."
  - q: "Can I create policies with PowerShell?"
    a: "No. Learn states that PowerShell cannot create or manage Communication Compliance policies."
---

To set up a Communication Compliance policy, make sure the audit log is on, assign the right role group, then create a policy in the Communication Compliance solution of the Microsoft Purview portal, either from a template or as a custom policy. This guide follows Microsoft Learn's configuration page.

## Prerequisites

- **Licensing:** confirm a supported Microsoft 365 subscription, add-ons and user licenses. For non-Microsoft 365 AI data, such as Copilot in Microsoft Fabric, Microsoft Security Copilot or Microsoft Copilot Studio, pay-as-you-go billing must be enabled. Learn says there are no pay-as-you-go requirements for Microsoft 365 Copilot data.
- **Region:** the feature is available only in regions supported by Azure service dependencies.
- **Audit log:** required. Auditing is on by default. If it is off, turn it on once, and allow a couple of hours before the log can be searched.
- **Permissions:** add users to the appropriate role group on the **Role groups** page. If your role is scoped by admin units, you cannot create a policy from a template, but you can create a custom policy. Admin units and adaptive scopes cannot be used together.

## Plan groups and reviewers

- Distribution groups, Microsoft 365 Groups and mail-enabled security groups are supported for scoped and excluded users.
- Dynamic distribution groups, shared mailboxes, nested distribution groups and dynamic-membership Microsoft 365 Groups are not supported for scoped or excluded users.
- Learn recommends distribution groups, because they detect each user's individual emails and Teams chats. Microsoft 365 Groups detect messages sent to the group, not each member's received messages. It also suggests adaptive scopes as a more flexible option.
- Reviewers must be individual users with Exchange Online mailboxes. They receive an email notification of their assignment. Only the reviewers you add are available when escalating an alert.

## Create a policy from a template

1. Go to purview.microsoft.com and sign in as an admin.
2. Open the **Communication Compliance** solution.
3. Select **Policies**, then **Create policy**.
4. Select a template, for example **Detect inappropriate text**.
5. In the right pane, set the policy name, the users or groups in scope and the reviewers. Review the automatically chosen settings, select **Customize policy** if needed, then **Create policy**.

The **Detect conflict of interest** template requires two scoped groups or two scoped users. The page does not list all templates.

## Create a custom policy

1. Select **Create policy** > **Custom policy**.
2. **Name and describe** the policy. The name is required and cannot be changed later.
3. **Admin units (preview)** appear only if admin units exist.
4. **Choose users and reviewers:** **All users**, **Select users** or **Select adaptive scopes**, plus excluded users or groups and reviewers.
5. **Choose locations:** Exchange, Teams, Viva Engage, Microsoft Copilot experiences, Enterprise AI apps, Other AI apps or third-party sources through a Microsoft 365 connector.
6. **Choose conditions and review percentage:** direction (inbound, outbound or internal), conditions, OCR, review percentage and the email blast filter.
7. **Review and finish**, then **Create policy**.

## Conditions

Conditions can use sensitive information types (default or custom), keyword dictionaries and Microsoft-provided trainable classifiers, such as Targeted threat, Profanity and Targeted harassment. OCR is available through **Use OCR to extract text from images**, but at least one text, keyword, classifier or sensitive information type condition must be set first. **Filter email blasts** is selected by default and excludes bulk email, spam, phishing and malware from alerts.

## Test conditions (preview)

For the classifier and sensitive information type conditions only, you can enter comma-separated messages or upload a .txt file and select **Test**. Learn advises checking the definition of the type or classifier and making sure messages meet the minimum word count.

## Timing

Policies detect only activity that occurs after they are active, and Learn gives no activation duration. Email takes about 24 hours to process, and Teams, Viva Engage and third-party platforms about 48 hours.

## Optional steps and gaps

- If you use compliance boundaries, run `New-ComplianceSecurityFilter` once so admins and reviewers can access supervised mailboxes.
- Anonymized usernames are under **Settings** > **Communication Compliance** > **Privacy**.
- Viva Engage Native Mode is required for policies to check private messages and community conversations.
- The page does not cover alert investigation, which a separate article describes, or licensing prices.

## Related

- [Communication Compliance](https://www.m365.fm/entity/communication-compliance/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Get started with Communication Compliance (Microsoft Learn)](https://learn.microsoft.com/purview/communication-compliance-configure)
