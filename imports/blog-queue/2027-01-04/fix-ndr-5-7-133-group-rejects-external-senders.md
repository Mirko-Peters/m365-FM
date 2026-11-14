---
title: "Fix NDR 550 5.7.133 When a Group Does Not Accept External Senders"
summary: "NDR 550 5.7.133 means the recipient group rejects senders from outside its organization. Learn who can fix it, the two Exchange admin center methods, prerequisites and how it differs from similar 5.7.x codes."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [exchange-online, microsoft-365-groups]
keypoints:
  - "550 5.7.133 means the recipient is a group set to reject messages from outside its organization."
  - "Only the group owner or an email admin in the recipient's organization can fix it. The sender cannot."
  - "Method 1 in the Exchange admin center is Recipients > Groups > group > Settings > Edit delivery management > Allow messages from people inside and outside my organization."
  - "Method 2 keeps the restriction and adds specific senders. An external sender first needs a mail contact or mail user."
  - "Learn distinguishes 5.7.133 from 5.7.124, 5.7.134, 5.7.136 and the public folder codes, which have different causes."
faq:
  - q: "What does 550 5.7.133 mean?"
    a: "Microsoft Learn describes it as Sender not authenticated for group. The recipient address is a group distribution list set up to reject messages from outside its organization."
  - q: "Who can fix it?"
    a: "Learn says only an email administrator of the recipient's organization or the group owner can change the configuration. A sender should contact the group owner or admin and share the article."
  - q: "Where is the setting in the Exchange admin center?"
    a: "Per Learn: Recipients > Groups, select the group, open its properties, go to the Settings tab, select Edit delivery management under Delivery management, and use the Sender options."
  - q: "How do I allow only one external partner?"
    a: "Learn's second method uses the group's allowed senders list under Specified senders. To allow an external sender, first create a mail contact or mail user that represents them in your organization."
  - q: "Is this the same as the anti-spam allowed senders list?"
    a: "No. Learn says the group's allowed senders list is separate from the organization's anti-spam allowed senders list, which is managed in the Exchange admin center under Protection > Spam filter."
---

NDR 550 5.7.133 means the recipient group rejects mail from senders outside its organization. The fix sits on the recipient side. The group owner or an email admin changes the group's delivery management setting in the Exchange admin center. This guide follows two Microsoft Learn pages: the NDR reference for Exchange Online and the article on fixing error 5.7.133.

## What the error says

Learn lists the code as **Sender not authenticated for group**. The recipient address is a group distribution list that is set up to reject messages sent from outside its organization. Only an email administrator for the recipient's organization or the group owner can change this configuration. The NDR reference gives no other cause for this code.

For a sender, this means the sender cannot repair it alone. Learn tells senders to contact the group owner or email admin and share the article.

## Fix method 1: allow internal and external senders

Learn lists these steps in the Exchange admin center (EAC):

1. Go to **Recipients** > **Groups**.
2. Select the group and open its properties.
3. Select the **Settings** tab.
4. Under **Delivery management**, select **Edit delivery management**.
5. Under **Sender options**, choose **Allow messages from people inside and outside my organization**.
6. Select **Save changes**.

Use this method only when the group should accept mail from anyone. A group that accepts any external mail can attract unwanted messages, so weigh that before you choose it. That point is practical advice, not from Learn.

## Fix method 2: use the group's allowed senders list

1. Complete steps 1 to 5 above.
2. Under **Specified senders**, click in the text box to display the list of internal and external senders.
3. Choose the senders to add and select **Save changes**.

Prerequisites from Learn:

- To allow an **external sender**, first create a **mail contact** or **mail user** that represents the sender in your organization.
- To allow **everyone in your organization**, create a distribution group or dynamic distribution group that contains all members, and add that group to the allowed senders list.
- The group's allowed senders list is separate from the organization's anti-spam allowed senders list. The anti-spam list is managed in the EAC under **Protection** > **Spam filter**.

## Choose between the methods

| Question | Method |
| --- | --- |
| Should the group take mail from any external sender? | Method 1 |
| Should only named partners or contacts be allowed? | Method 2 |
| Is the sender a single known external address? | Method 2, with a mail contact |
| Do you want to keep the group closed otherwise? | Method 2 |

## Do not mix it up with similar codes

The NDR reference lists neighbors with different causes:

| Code | Meaning on the page |
| --- | --- |
| 5.7.124 | Sender not in the allowed-senders list. The sender is not on the group's allowed list |
| 5.7.134 | Sender was not authenticated for the mailbox. The recipient is a mailbox set to reject outside senders |
| 5.7.136 | Sender was not authenticated. The recipient is a mail user set to reject outside senders |
| 5.7.13 and 5.7.135 | Sender was not authenticated for a public folder |

Check the recipient type in the NDR. Only 5.7.133 points at a group.

## What the pages do not cover

The Learn article on 5.7.133 does not describe the Microsoft 365 admin center, PowerShell, or differences between Microsoft 365 groups, distribution groups, mail-enabled security groups and dynamic distribution groups. It does not mention a PowerShell parameter. Other documentation may cover the Exchange PowerShell route, but this guide did not verify it. The steps above are the EAC path as Learn words it. Menu labels can change, so confirm them in your tenant.

## A checklist for admins

1. Read the NDR and confirm code 5.7.133 and the group address.
2. Find the group in the EAC under Recipients > Groups.
3. Open Settings > Edit delivery management and read the current Sender options.
4. Decide between method 1 and method 2.
5. For an external sender, create the mail contact first.
6. Save and ask the sender to try again.

## Typical mistakes

- Asking the sender to change something. The sender cannot fix a 5.7.133.
- Adding an external address to the anti-spam allowed list when the problem is the group setting.
- Typing an external address into the group list without a mail contact.
- Reading 5.7.134 or 5.7.136 as the same issue.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft 365 groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Dynamic distribution group](https://www.m365.fm/entity/dynamic-distribution-group/)

## Sources

- [Non-delivery reports in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/non-delivery-reports-in-exchange-online/non-delivery-reports-in-exchange-online)
- [Fix email delivery issues for error code 5.7.133 in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-5-7-133-in-exchange-online)
