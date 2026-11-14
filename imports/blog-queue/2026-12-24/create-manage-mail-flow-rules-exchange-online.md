---
title: "Create and Manage Mail Flow Rules in Exchange Online: EAC and PowerShell"
summary: "Create, copy, edit, prioritize, enable and delete Exchange Online mail flow rules in the new Exchange admin center and with PowerShell, including rule modes, severity, timing of 30 minutes and monitoring."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [exchange-online]
keypoints:
  - "Open the new Exchange admin center at admin.exchange.microsoft.com, go to Mail flow > Rules and select Add a rule. Rules created in the EAC are disabled by default."
  - "A rule has conditions (Apply this rule if), actions (Do the following) and optional exceptions. Rule mode can be Enforce, Test with Policy Tips or Test without Policy Tips."
  - "Rules run in the listed order and the top rule has priority 0. Stop processing more rules prevents later rules from running on a matched message."
  - "After you create, copy or change a rule it can take 30 minutes or more to take effect."
  - "Use New-TransportRule, Get-TransportRule, Set-TransportRule, Enable-TransportRule, Disable-TransportRule and Remove-TransportRule for PowerShell."
faq:
  - q: "Where are mail flow rules in Exchange Online?"
    a: "In the new Exchange admin center at admin.exchange.microsoft.com, under Mail flow > Rules, or directly at admin.exchange.microsoft.com/#/transportrules. Microsoft Learn says your account needs Mail flow permissions and points to the feature permissions page for the exact entry."
  - q: "Why does my new rule do nothing?"
    a: "Learn says rules created in the EAC are disabled by default so you can review them first. It also says that after you create, copy or modify a rule it can take 30 minutes or more to take effect."
  - q: "What are the rule modes?"
    a: "Enforce, Test with Policy Tips and Test without Policy Tips. Severity (Not specified, Low, Medium, High or Not audit) only filters reports and does not affect processing order. Not audit hides matches from rule reports."
  - q: "How is the order decided?"
    a: "Rules run in the order listed and the top rule has priority 0. You change it with Move up and Move down in the EAC, or with Set-TransportRule and the Priority parameter."
  - q: "Is there a limit to the number of rules?"
    a: "The Learn page does not list rule count or size limits. It links to the journal, transport and inbox rule limits section of the Exchange Online service description."
---

Mail flow rules, also called transport rules, apply actions to messages as they pass through Exchange Online. This guide follows Microsoft Learn's article on managing them in the Exchange admin center and PowerShell.

## Before you start

Use the new Exchange admin center at admin.exchange.microsoft.com, or go directly to the transport rules page. Your account needs permissions for Mail flow. The page does not name a specific role and points to the Exchange Online feature permissions page.

## Create a rule in the EAC

1. Go to **Mail flow** > **Rules**.
2. Select **Add a rule** and choose a template, or **Create a new rule**.
3. Set conditions:
   - Enter a unique **Name**.
   - **Apply this rule if** sets the conditions. **Apply to all messages** matches every message.
   - **Do the following** sets the actions.
   - **Except if** sets exceptions using the same options as conditions.
4. Select **Next** and set rule settings:
   - **Rule mode:** **Enforce**, **Test with Policy Tips** or **Test without Policy Tips**.
   - **Severity:** Not specified, Low, Medium, High or Not audit. Severity only filters reports and doesn't affect processing order.
   - **Activate this rule on** and **Deactivate this rule on** schedule the active period.
   - **Stop processing more rules** prevents later rules from running on a matched message.
   - **Defer the message if rule processing doesn't complete.** By default, the rule is ignored if processing fails. With this option the message is resubmitted.
   - **Match sender address in message:** Header, Envelope or Header or envelope.
5. On **Review and finish**, check the settings, then **Finish** and **Done**.

Rules created in the EAC are disabled by default, so you can review them before enabling.

## Copy, edit, prioritize, enable and delete

- **Copy:** select the radio button by **Status** for the rule, choose **Duplicate**, edit the flyout (default name Copy of the rule name), then **Make copy**.
- **Edit:** click the row, not the checkbox, and use **Edit rule conditions** or **Edit rule settings**.
- **Priority:** rules run in the order listed and the top rule has Priority 0. Use **Move up** or **Move down**.
- **Enable or disable:** open the details flyout and use the **Enable or disable rule** toggle.
- **Delete:** select the rule, choose **Delete**, then **Confirm**.

## PowerShell

```powershell
New-TransportRule -Name "Mark messages from the Internet to Sales DG" -FromScope NotInOrganization -SentTo "Sales Department" -PrependSubject "External message to Sales DG:"
Get-TransportRule
Set-TransportRule -Identity "Sender is a member of Marketing" -Priority "2"
Enable-TransportRule -Identity "Sender is a member of marketing"
Disable-TransportRule -Identity "Sender is a member of marketing"
Remove-TransportRule -Identity "Sender is a member of marketing"
```

To check results, `Get-TransportRule | Format-List Name,Priority` and `Get-TransportRule | Format-Table Name,State` are the verification commands on the page.

## Timing

After you create, copy or modify a rule, it can take 30 minutes or more to take effect. Learn tells you to test each rule and the interactions between rules thoroughly. My advice: test in a quiet period and start with a test mode before **Enforce**.

## Monitoring

Go to **Reports** > **Mail flow** and select **Exchange Transport Rule report**. Rules with severity **Not audit** are excluded. Most data appears within 24 hours, but some can take up to 5 days.

## Import and export

`Export-TransportRuleCollection` exports all rules to XML. `Import-TransportRuleCollection` is being deprecated. The page gives a manual script workaround that first removes all existing rules, so export first as a backup.

## Practical order (my advice)

1. Create the rule in test mode, with a clear name.
2. Check where it sits in the order, and whether an earlier rule uses **Stop processing more rules**.
3. Wait at least 30 minutes, then test with sample messages.
4. Switch to **Enforce** and enable the rule.
5. Review the transport rule report.

## Not covered

The page gives no rule count or size limits and links to the Exchange Online service description for them. It also does not list conditions and actions in full, so check the mail flow rule conditions and exceptions reference for what you need.

## Common checks

These checks are a suggestion derived from the documented behaviour above, not a separate Microsoft troubleshooting procedure.

- If a new rule has no effect, confirm it was enabled, because rules created in the EAC are disabled by default.
- If a rule matched but later rules did not run, look for an earlier rule that uses **Stop processing more rules**.
- If a rule changed recently, remember the 30-minute or longer delay before it takes effect.
- If a rule is missing from reports, check whether its severity is **Not audit**.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Manage mail flow rules in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/security-and-compliance/mail-flow-rules/manage-mail-flow-rules)
