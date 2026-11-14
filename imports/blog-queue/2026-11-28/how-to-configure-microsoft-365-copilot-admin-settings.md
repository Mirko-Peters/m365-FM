---
title: "How to Configure Microsoft 365 Copilot: Admin Settings and a Safe Rollout Order"
summary: "How to configure Microsoft 365 Copilot as an admin: licenses, prerequisites, the Copilot settings in the admin center, the web search policy, data foundation work and how to review usage."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [copilot, microsoft-365-admin-center, copilot-governance]
keypoints:
  - "Microsoft publishes no single ideal configuration. Its setup path has five steps: prepare, choose a license, ready apps and network, assign licenses, then welcome users."
  - "Most Copilot settings sit under Copilot > Settings in the Microsoft 365 admin center, grouped as User access, Data access, Copilot actions and Other settings."
  - "Web search is controlled by the Allow web search in Copilot cloud policy, not by a toggle on the Settings page."
  - "Copilot uses what users can already access. Microsoft's blueprint has three pillars: remediate oversharing, set up guardrails and meet regulations."
  - "Use least-privileged roles. The AI Administrator role covers Copilot administration, and Global Reader can view settings but not change them."
faq:
  - q: "Where are the Copilot settings in the Microsoft 365 admin center?"
    a: "Microsoft Learn says to sign in to admin.microsoft.com, expand Copilot and select Settings. The settings are grouped under User access, Data access, Copilot actions and Other settings, and you can select View all when a setting is not shown in a category."
  - q: "Which admin role do I need to configure Copilot?"
    a: "Microsoft Learn names an appropriate role such as AI Administrator. Global Reader can view but not change settings. Creating Cloud Policy settings for Microsoft 365 apps requires the Office Apps admin role. Microsoft advises using the least-privileged role for the task."
  - q: "How do I turn off web search in Copilot?"
    a: "According to Microsoft Learn you create the Allow web search in Copilot policy in Cloud Policy for Microsoft 365. If the policy is not configured, web search is available unless optional connected experiences in Office are disabled. When the policy turns web search off, the user's Web content toggle is dimmed and cannot be turned on."
  - q: "How many licenses can I buy for Copilot Business?"
    a: "Microsoft Learn describes Microsoft Copilot Business as an add-on for organizations with up to 300 users and eligible Microsoft 365 Business licenses, with an annual commitment. It states a limit of up to 300 licensed users per tenant. Larger organizations should use enterprise options."
  - q: "What should I fix before rolling out Copilot?"
    a: "Microsoft's secure and governed foundation guidance is built on three pillars: remediate oversharing, set up guardrails and meet regulations. It notes that SharePoint Advanced Management is included with a Copilot license and that Microsoft Purview supports data protection for Copilot."
---

Microsoft does not publish one ideal Copilot configuration. What it publishes is an order of work and a set of settings. The order is: prepare your organization and data, choose licenses, make apps and network ready, assign licenses, then welcome users and collect feedback. The settings are mainly under **Copilot** > **Settings** in the Microsoft 365 admin center. This article follows that order and marks where the pages are silent.

## Step 1: Prepare the organization and data

Microsoft's setup page recommends completing the Microsoft Copilot Optimization Assessment before deployment, and using the features in your subscription plus SharePoint Advanced Management (SAM) to get your data ready.

Why data readiness comes first: Microsoft's security page says Copilot operates within existing permissions and access controls, and that overshared or poorly governed content can affect results and increase risk. The foundational blueprint has three pillars:

1. **Remediate oversharing:** identify high-risk sites and files, apply interim access restrictions if needed and fix access issues.
2. **Set up guardrails:** harden the environment with enforceable defaults.
3. **Meet regulations:** close gaps in AI regulatory requirements, define audit and legal requirements and improve data hygiene.

The blueprint page says SAM is included with a Copilot license and that Microsoft Purview supports data loss prevention and compliance for Copilot. It does not list detailed phases. Those are in a blueprint document that the page links to.

## Step 2: Choose and check licenses

Per the Learn licensing page, users need a Copilot license and a qualifying prerequisite license. Eligible bases include Microsoft 365 E3, E5, F1, F3, Business Basic, Standard and Premium, and Apps for enterprise or business. Microsoft Copilot Business is an add-on for organizations with up to 300 users, requires an annual commitment and is capped at 300 licensed users per tenant. Licensing can change, so confirm in the Microsoft Product Terms and current pricing before you buy.

To check a user, the requirements page points to the Copilot License Details diagnostic. Copilot Chat is available with an eligible subscription and needs no Copilot license for eligible users.

## Step 3: Make apps and network ready

Learn requires:

- A work or school account in Microsoft Entra ID.
- Not device-based licensing for Microsoft 365 Apps for enterprise.
- Primary Exchange Online mailboxes for mailbox features. Group mailboxes are not supported.
- Windows 11 22H2 or later, macOS 13 or later, iOS and iPadOS 16.0 or later and Android 10 or later.
- Allowing the entire `*.cloud.microsoft` domain, with full WebSocket connectivity to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft`.
- App privacy settings that allow Copilot. Connected experiences can affect feature availability.
- Third-party cookies enabled for the web versions of Word, Excel and PowerPoint.

## Step 4: Assign licenses and set up in the admin center

Assign licenses in the Microsoft 365 admin center. The setup page also points to the Microsoft 365 Copilot setup guide under onboarding. The pages I read do not describe group-based license assignment or name a required role for this step, so check the Learn article on assigning licenses.

## Step 5: Review the Copilot settings

1. Sign in to admin.microsoft.com.
2. Expand **Copilot** and select **Settings**.
3. Browse **User access**, **Data access**, **Copilot actions** and **Other settings**. Select **View all** if a setting is not shown.

Per Microsoft Learn, the groups contain:

| Group | Examples |
|---|---|
| User access | Copilot Frontier, pay-as-you-go billing, self-service purchases, pinning the Copilot app and Copilot Chat |
| Data access | Agents, AI providers as subprocessors, Data security and compliance (Purview), web search, People Skills |
| Copilot actions | Image generation, screen and camera sharing, Copilot in Teams meetings, advanced package uploads |
| Other settings | Custom dictionary, diagnostics logs |

Roles: use an appropriate role such as AI Administrator. Global Reader can view but not change. Cloud Policy settings for Microsoft 365 apps need the Office Apps admin role. Microsoft advises the least-privileged role.

### Web search

Web search is not a toggle on the Settings page. Follow the link from the Copilot settings to create the **Allow web search in Copilot** policy in Cloud Policy. Options are enabled, disabled, or disabled in Work mode while enabled in Web mode and Copilot Chat. If you do not configure the policy, web search is available unless the Office policy for optional connected experiences is set to Disabled. For GCC and DoD it is available but off by default. Users can turn off their own **Web content** toggle in the Copilot app under **Settings** > **Personalization** > **Advanced**.

### Security dashboard

In the admin center, select **Copilot** > **Overview** > **Security** to see Copilot data protection, oversharing and compliance insights. Viewing needs Global Reader, and making changes needs the AI Administrator role.

## Step 6: Welcome users and review usage

Microsoft suggests sending a welcome email after license assignment, adding a link to your AI usage policy, using built-in notifications, monitoring completion through Viva Learning reporting and allowing feedback. The pages read for this article do not describe how to review Copilot usage after rollout, so check the Learn pages on Copilot usage reports and the Copilot Dashboard separately.

## What the documentation does not say

The setup and settings pages give no recommended values, such as which setting "should" be on. Microsoft frames the choices around your policies and data. Decide each setting with security and compliance owners, record the decision and review it when licenses or agents change.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Learn: Microsoft Copilot adoption and onboarding guide for IT admins](https://learn.microsoft.com/en-us/copilot/adopt/enablement-resources)
- [Microsoft Learn: Configure Microsoft Copilot settings in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-copilot-admin-center)
- [Microsoft Learn: Data, privacy, and security for web search in Microsoft Copilot and Microsoft Copilot Chat](https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/copilot/plan/microsoft-copilot-requirements)
- [Microsoft Learn: License Options for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-license-options)
- [Microsoft Learn: Secure & Governed Data Foundation for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance)
- [Microsoft Learn: Security for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/plan/security-microsoft-copilot)
