---
title: "Fix NDR 5.7.520: External Forwarding Blocked by the Outbound Spam Policy"
summary: "NDR 5.7.520 says your organization does not allow external forwarding. The cause is the automatic forwarding setting in the outbound spam filter policy. Learn the three settings, how remote domains and mail flow rules interact, how to find forwarding users and what to change."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [exchange-online, defender-for-office-365, exchange-online-protection]
keypoints:
  - "The NDR reads 5.7.520 Access denied, Your organization does not allow external forwarding, and it is returned to the sender of the forwarded message."
  - "The outbound spam filter policy has three automatic forwarding values: Automatic - System-controlled, On - Forwarding is enabled and Off - Forwarding is disabled."
  - "Learn says the Automatic value behaves differently by organization, so configure On or Off explicitly instead."
  - "When one control allows forwarding and another blocks it, the block typically wins; remote domains and mail flow rules are the other controls."
  - "The Auto forwarded messages report finds cloud users who forward; on-premises forwarders need a mail flow rule on the X-MS-Exchange-Inbox-Rules-Loop header."
faq:
  - q: "What does 5.7.520 mean?"
    a: "Learn shows the NDR text as 5.7.520 Access denied, Your organization does not allow external forwarding, followed by a request to contact the administrator. It appears when a message is detected as automatically forwarded and the outbound spam filter policy blocks that activity."
  - q: "Which kinds of forwarding are affected?"
    a: "Inbox rules that users create to forward to external recipients, and mailbox forwarding (also called SMTP forwarding) that admins configure. Learn says disabling automatic forwarding disables both when they redirect to external addresses, while forwarding between internal users is not affected."
  - q: "What are the three settings?"
    a: "Automatic - System-controlled, On - Forwarding is enabled and Off - Forwarding is disabled. On allows and does not restrict automatic external forwarding. Off disables it and sends an NDR to the sender."
  - q: "Why is the Automatic setting a problem?"
    a: "Learn says its meaning changed over time. In 2021 it became equivalent to Off for new organizations and for existing ones not actively using it, while organizations already using it can stay equivalent to On. Because behavior differs by organization, Learn says to set On or Off explicitly."
  - q: "If remote domains allow forwarding, will it work?"
    a: "Not if the outbound spam filter policy is set to Off. Learn's table says the block typically wins, so forwarded messages to the affected domains are blocked."
---

NDR 5.7.520 means a message was detected as automatically forwarded to an external recipient and the outbound spam filter policy in Microsoft 365 blocks that. Microsoft Learn shows the NDR text as: 5.7.520 Access denied, Your organization does not allow external forwarding. Please contact your administrator for further assistance. The fix is a decision, not a repair: either allow automatic external forwarding in the policy or keep it blocked and stop the forwarding rule. This article follows Learn's page on controlling external email forwarding.

## What triggers the error

Learn lists two kinds of automatic forwarding in Microsoft 365:

- **Inbox rules** that users create to forward messages to external recipients, deliberately or because of a compromised account.
- **Mailbox forwarding**, also known as SMTP forwarding, that admins configure. The admin can choose whether to forward messages only or also keep copies in the mailbox.

Learn adds that users who forward from on-premises email systems through Microsoft 365 are subject to the same policy controls as cloud mailboxes.

When the outbound spam filter policy blocks the activity, the message returns to the sender in an NDR with the 5.7.520 text above.

## The three settings

The outbound spam filter policy has three values for automatic forwarding:

1. **Automatic - System-controlled.** This is the default. Learn says that when it was introduced it was equivalent to On. In 2021 it changed to Off for new organizations and for existing organizations that were not actively using it. For existing organizations that were already using the value, it can remain equivalent to On. Because behavior can differ by organization, Learn says to configure On or Off instead.
2. **On - Forwarding is enabled.** Automatic external forwarding is allowed and not restricted.
3. **Off - Forwarding is disabled.** Automatic external forwarding is disabled and results in an NDR to the sender.

Learn adds two notes. Disabling automatic forwarding disables any inbox rules or mailbox forwarding that redirect messages to external addresses. And automatic forwarding between internal users is not affected by these settings.

For the steps to change the setting, Learn points to its page on configuring outbound spam filtering, which I did not read for this article. Learn's screenshot shows the Protection settings flyout in the properties of the default outbound spam filter policy.

## Other controls that can block forwarding

The outbound spam filter policy is not the only control. Learn names two more:

- **Remote domains**, which can allow or block automatic forwarding to some or all external domains.
- **Mail flow rules** (transport rules), whose conditions and actions can detect and block automatically forwarded messages to external recipients by inbox rules.

When one setting allows forwarding and another blocks it, Learn says the block typically wins. Its examples:

| Scenario | Result |
| --- | --- |
| Remote domain allows forwarding, policy is Off | Forwarded messages to the affected domains are blocked |
| Remote domain allows forwarding, policy is Automatic | Depends on how Automatic works in your organization |
| Policy is On, but mail flow rules or remote domains block forwarding | Messages to the affected recipients are blocked by those rules or domains |

Learn notes you can use this to allow forwarding in the policy and then use remote domains to control which external domains users may forward to.

## Find who is forwarding

For cloud-based accounts, Learn points to the Auto forwarded messages report. For on-premises users who forward through Microsoft 365, you need a mail flow rule to track them. Learn's example in the Exchange admin center:

- **Condition:** the message headers matches these text patterns, with the header `X-MS-Exchange-Inbox-Rules-Loop` and the value `.` to match any value.
- **Action:** for example, modify the message properties and set a message header such as `X-Forwarded` with the value `True`.
- **Severity:** set to Low, Medium or High, so the Exchange transport rule report can show the users who forward.

## A decision path

This section is my advice, not a Microsoft statement.

1. **Confirm the message was forwarded automatically.** The NDR applies to automatic forwarding. A person who forwards a message by hand is a different case, and Learn describes the policy as controlling automatic forwarding.
2. **Find the forwarding mechanism.** Ask the user whether they created an inbox rule, or check whether an admin set mailbox forwarding. Run the report Learn mentions to see how many users are affected.
3. **Decide per use case.** A shared mailbox that must forward to a partner is a business need. A user forwarding to a personal address is a data leakage risk, which is the concern Learn raises about disclosure of information.
4. **Prefer an explicit setting.** If you keep the default, behavior depends on your organization's history. Setting On or Off removes that doubt.
5. **Use the narrower tool for exceptions.** Since Learn says you can allow forwarding in the policy and limit domains with remote domains, consider whether that fits better than switching the whole policy.
6. **Tell the sender.** The sender received the bounce, not the forwarding user, so a short note about what changed saves confusion.

## Common traps

This section is my advice, not a Microsoft statement.

- **Changing one control and testing too soon.** Several controls interact, so after a change, test with a message that goes through the same path as the one that bounced.
- **Forgetting on-premises forwarding.** Learn says on-premises forwarders through Microsoft 365 are subject to the same controls, so mailboxes that are not in the cloud can trigger the same NDR.
- **Leaving forwarding rules in compromised accounts.** Learn names compromised accounts as one reason for inbox rule forwarding. If you find an unknown forwarding rule, treat it as a security issue before you think about allowing it.

## What the page does not cover

I read the whole page. It does not list how long a policy change takes to apply, and it does not describe PowerShell commands for the policy in the text I read. The configuration steps are on a separate page that I did not read.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Control external email forwarding and fix 5.7.520 errors - Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/outbound-spam-policies-external-email-forwarding)
