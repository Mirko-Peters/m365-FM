---
title: "How to Set Up Operator Connect for Teams Phone"
summary: "Set up Operator Connect for Teams Phone: prerequisites, adding an operator in the Teams admin center, getting numbers for new users or from Calling Plans and Direct Routing, emergency address models, removal rules and caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [teams-phone, operator-connect]
keypoints:
  - "Path: Teams admin center > Voice > Operator Connect. Choose an operator, select countries or regions, accept the data transfer notice and select Add as my operator."
  - "Users need a Phone System license and must be in TeamsOnly mode before you get Operator Connect numbers. Order numbers from the operator with your tenant ID."
  - "Migrating from Calling Plans or Direct Routing is handled with the operator. On-premises-assigned Direct Routing numbers need Set-CsUser -LineURI null first."
  - "Emergency addresses follow one of three models set by the operator: operator assigns, you assign, or operator assigns and locks."
  - "Before removing an operator or a country, remove all assigned numbers and have the operator release them."
faq:
  - q: "Where do I add an operator?"
    a: "In the Teams admin center, per Microsoft Learn, go to Voice > Operator Connect. In All operators filter by region or service, select an operator, choose countries or regions under Operator settings, provide company size, accept the data transfer notice and select Add as my operator."
  - q: "What do users need before they get numbers?"
    a: "A Phone System license and TeamsOnly mode. If the organization is in Islands mode, check each user's Teams upgrade settings."
  - q: "How do I get numbers?"
    a: "Order from the operator using your tenant ID, then assign them in Voice > Phone numbers. For numbers from Calling Plans, ask the operator to port them. For online-assigned Direct Routing numbers, ask the operator to migrate on an agreed date."
  - q: "Who sets the emergency address?"
    a: "It depends on the operator. Learn lists three models: the operator assigns and you can change it, the operator does not assign and you do, or the operator assigns and locks it so changes go through the operator."
  - q: "Can I remove an operator at any time?"
    a: "Before you remove an operator or a country or region, you must remove all assigned numbers and have the operator release them. Removing a Direct Routing assignment can take up to 10 minutes and in rare cases up to 24 hours."
---

Operator Connect lets you add a Microsoft-certified operator in the Teams admin center and get phone numbers from them. You prepare users with licenses and TeamsOnly mode, add the operator, order numbers using your tenant ID and assign them to users. This guide follows the Microsoft Learn article on configuring Operator Connect. The page is written for admins and defers prerequisites and licensing to the planning article.

## Prerequisites on the page

- **Plan first.** Learn tells you to read its Plan for Operator Connect article for prerequisites and licensing. This page does not restate them.
- **Phone System license** for users, assigned before you acquire numbers, from the Microsoft 365 admin center or PowerShell.
- **TeamsOnly mode** for users who will get Operator Connect numbers. Check **Teams** > **Teams upgrade settings**. If the organization is in Islands mode, check each user under **Users** > **Account** > **Teams upgrade settings**.
- **Tenant ID**, which you need to order numbers from your operator.
- The page does not name required admin roles.

## Add an operator

Path: Teams admin center > **Voice** > **Operator Connect**.

1. In **All operators**, filter by region or service and select an operator.
2. Under **Operator settings**, select countries or regions.
3. Contact information (full name and email) is shared automatically. You must provide company size and may provide a phone number.
4. Accept the data transfer notice.
5. Select **Add as my operator**.

## Get numbers

| Situation | What Learn says |
| --- | --- |
| New users | Assign Phone System licenses, confirm TeamsOnly mode, order numbers from the operator with your tenant ID, then assign them in **Voice** > **Phone numbers** |
| From Calling Plans | Ask the operator to port the numbers. After the port completes the operator uploads them and you assign them |
| From Direct Routing, online-assigned | Ask the operator to migrate the numbers on an agreed date |
| From Direct Routing, on-premises-assigned | Run `Set-CsUser -Identity <user> -LineURI $null` in Skype for Business Server PowerShell. Then verify with `Get-CsOnlineUser`, remove the assignment with `Remove-CsPhoneNumberAssignment -PhoneNumberType DirectRouting` and clear the policy with `Grant-CsOnlineVoiceRoutingPolicy -PolicyName $Null`. Then acquire and assign numbers |

For on-premises-assigned numbers, the page says the number is out of service during the migration, so coordinate with the operator before you begin.

## Emergency addresses

The page gives no step for adding an emergency location. It says emergency addresses are created in the Teams admin center, and the operator then uses one of three models:

1. The operator assigns addresses, and you can change them later in the admin center.
2. The operator does not assign addresses, and you assign them in the admin center.
3. The operator assigns addresses and locks them, so changes go through the operator.

Details are in the linked emergency calling articles.

## Who does what (my summary of the page)

| Operator | Admin |
| --- | --- |
| Ports numbers, uploads numbers to your tenant, performs online Direct Routing migrations, may assign emergency addresses, may contact you about the service, handles service-number requests | Enables and manages operators, orders numbers through the operator's site, assigns or releases numbers, removes operators |

## Limits and caveats

- Before you remove an operator or a country or region, remove all assigned numbers and have the operator release them.
- To release a number assigned to a user, unassign it first, then release it.
- Removing a Direct Routing assignment can take up to 10 minutes and in rare cases up to 24 hours.
- Service numbers for conferencing, auto attendants and call queues have a higher concurrent-call capacity, and you get them by contacting the operator.
- Whether emergency addresses can be changed depends on the operator's model.

## What the page does not cover

Specific admin roles and exact license SKUs, pricing, porting or order timelines, end-user steps, operator availability by region (an external directory holds it), and how to assign numbers in detail (a linked article). The menu item is named Voice > Operator Connect on the page.

## A rollout order (my advice)

The order is my own suggestion, not taken from the page.

1. Read the planning article and confirm licenses.
2. Move pilot users to TeamsOnly mode.
3. Add one operator for one country or region.
4. Order a few numbers and assign them to pilot users.
5. Agree the emergency address model with the operator.
6. Plan migrations of existing numbers with a dated cutover.

## Typical mistakes (my advice)

- Ordering numbers before users have licenses and TeamsOnly mode.
- Forgetting your tenant ID when ordering.
- Starting a Direct Routing migration without coordinating the outage.
- Trying to remove an operator while numbers are still assigned.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Operator Connect](https://www.m365.fm/entity/operator-connect/)
- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Teams Calling Plans](https://www.m365.fm/entity/teams-calling-plans/)

## Sources

- [Configure Operator Connect (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/operator-connect-configure)
