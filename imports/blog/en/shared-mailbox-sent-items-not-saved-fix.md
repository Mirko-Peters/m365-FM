---
title: "Shared Mailbox Sent Items Not Saving: Fix the Missing Copy (and the Duplicates)"
summary: "Mail sent from a shared mailbox lands in the sender's Sent Items, not in the shared mailbox? Turn on the two copy settings in Exchange Online, and avoid the registry value that creates duplicates."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [shared-mailbox, exchange-online, exchange-online-powershell]
keypoints:
  - "By default, a message sent as or on behalf of a shared mailbox is saved only in the sender's own Sent Items folder."
  - "Two mailbox properties fix this: MessageCopyForSentAsEnabled for Send As and MessageCopyForSendOnBehalfEnabled for Send on Behalf."
  - "The DelegateSentItemsStyle registry value in classic Outlook is a second switch. Combined with the mailbox setting it can produce two copies."
  - "Check which permission your users really use, because each copy setting covers only one of the two."
faq:
  - q: "Why does a message sent from a shared mailbox show up in my own Sent Items?"
    a: "A shared mailbox is not a separate account that users sign in to. You sign in to your own mailbox and open the shared one, so Outlook sends the message from your account and stores the copy in your Sent Items. Microsoft Learn describes this as the default behavior."
  - q: "Which setting do I change for Send As and which for Send on Behalf?"
    a: "Use MessageCopyForSentAsEnabled for messages sent with the Send As permission and MessageCopyForSendOnBehalfEnabled for messages sent with Send on Behalf. If your users have both permissions, set both properties to True."
  - q: "Does the fix work for the new Outlook?"
    a: "Yes. The Exchange Online mailbox setting is server-side and works for classic and new Outlook. The registry value DelegateSentItemsStyle works only in classic Outlook."
  - q: "Will old messages move into the shared mailbox after the change?"
    a: "Not according to a community answer in an older thread: only messages sent after the change are copied. Microsoft Learn does not state this either way, so test with a fresh message and treat older mail as something you may have to move by hand."
---

A team sends customer mail from a shared mailbox. Everything is delivered, but the shared mailbox's Sent Items folder stays empty. The copies sit in each sender's personal Sent Items instead. Nobody else on the team can see what was already answered.

This is one of the most repeated questions on Microsoft Q&A. A thread from April 2026 got an answer that the person asking accepted, and older threads describe the same behavior. This article combines that answer with the current Microsoft Learn guidance. It is a troubleshooting guide, not an official Microsoft procedure, so check the linked pages for your tenant.

## What the symptoms look like

- Users have Send As or Send on Behalf permission on a shared mailbox and send from it in Outlook.
- The recipient gets the message and it shows the shared mailbox as the sender.
- The shared mailbox's Sent Items folder does not contain the message. The sender's own Sent Items does.
- Or the opposite problem: after someone "fixed" it, some mailboxes show two copies of every sent message.

## Why it happens

Microsoft Learn explains the cause. A shared mailbox does not need a license, and users do not add it to Outlook as an independent account. They sign in to their own mailbox and open the shared one as an extra mailbox. So Outlook sends the message from the user's account, and the copy goes to the user's Sent Items.

The behavior is by default, not a bug. Exchange Online has two mailbox properties that change it.

## Step 1: Decide which permission your users have

The two properties map to two different permissions:

| Permission | What the recipient sees | Mailbox property |
|---|---|---|
| Send As | The shared mailbox as the sender | `MessageCopyForSentAsEnabled` |
| Send on Behalf | The user "on behalf of" the shared mailbox | `MessageCopyForSendOnBehalfEnabled` |

If some users have Send As and others Send on Behalf, you need both properties. Check the permissions of the mailbox before you start. If a user was added only a few minutes ago and gets the error that they cannot send on behalf of the user, Microsoft Learn says this is a replication delay that normally clears in about an hour.

## Step 2: Turn on the copy settings

The accepted answer in the April 2026 thread and the Learn troubleshooting article agree on the commands. Connect to Exchange Online PowerShell first with `Connect-ExchangeOnline`, then run:

```powershell
Set-Mailbox "<shared mailbox>" -MessageCopyForSentAsEnabled $true
Set-Mailbox "<shared mailbox>" -MessageCopyForSendOnBehalfEnabled $true
```

Run only the line that matches your permissions, or both lines if you use both. Use the shared mailbox's address or alias in place of the placeholder.

You can also do this in the Microsoft 365 admin center. Open **Teams & groups**, then **Shared mailboxes**, select the mailbox, and choose **Edit** under **Sent items**. The Learn page for configuring a shared mailbox confirms this path but does not list the exact option names. A community answer describes them as copying items sent as the mailbox and copying items sent on behalf of the mailbox. That wording comes from the thread, so read the labels on your screen.

## Step 3: Verify the setting

Read the values back:

```powershell
Get-Mailbox "<shared mailbox>" | Format-List MessageCopyForSentAsEnabled,MessageCopyForSendOnBehalfEnabled
```

Both properties you changed should show `True`. Then test with a fresh message. Send one as the shared mailbox from a test user's Outlook, wait a moment, and check the shared mailbox's Sent Items folder.

Two points from the threads:

- A community answer states that the change applies only to messages sent after it. Microsoft Learn does not say this. Do not expect older mail to appear.
- Learn mentions no propagation time for this setting. If the first test fails, wait and test again before you change anything else.

## Step 4: Understand the registry value that causes duplicates

Learn documents a second switch for classic Outlook only. It is the `DelegateSentItemsStyle` value in this registry location:

```
HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Outlook\Preferences
```

It is a DWORD (32-bit) value. Set to `1`, Outlook saves the sent item in the shared mailbox instead of the sender's mailbox. Learn publishes a table of what happens when the registry value and `MessageCopyForSentAsEnabled` are combined:

| DelegateSentItemsStyle | MessageCopyForSentAsEnabled | Result |
|---|---|---|
| 0 | True | One copy in the sender's mailbox and one in the shared mailbox |
| 1 | True | Two copies in the shared mailbox, none in the sender's mailbox |
| 0 | False | One copy in the sender's mailbox only |
| 1 | False | One copy in the shared mailbox only |

So the registry value together with the server-side setting is the likely source of doubled mail. Pick one method. For most tenants the mailbox property is cleaner, because it works for every client, including the new Outlook, and needs no change on each PC. The registry method works correctly only when Outlook runs in Cached Exchange Mode, according to Learn. Back up the registry before you edit it.

If you want the sender to keep a personal copy too, the combination `0` and `True` gives that. If you want only the shared copy, the table shows that the server-side setting and the registry value cannot both be on without a duplicate.

## Step 5: Check these when only some mailboxes misbehave

A June 2025 thread described eight shared mailboxes in classic Outlook 2016 over a remote desktop session. Only some of them duplicated sent items, even though all were set up the same way in Exchange Online. No answer was confirmed there, so use it only as a checklist:

1. Read the current properties for every shared mailbox and compare them. The command above works for this. Do not rely on a wildcard filter such as `*sentitems*`, because it does not match the property names.
2. Compare the registry value on the affected PCs. One PC with `DelegateSentItemsStyle` set to `1` is enough to cause the pattern.
3. A group policy for saving sent messages from a shared mailbox was mentioned in that thread. I did not verify the policy name against the Office administrative templates, so check them before you rely on it.
4. Create a new Outlook profile on one affected PC to rule out a damaged profile.

One warning from that thread: the answer there showed both properties set to `$false`. That turns the copies off. Do this only if you want the old behavior back.

## Limits and open points

- Learn does not give the Exchange admin center path for these properties, and it names no wait time. The checks above rely on testing.
- This fix changes only where the sent copy is stored. It does not change who can send or how recipients see the message.
- Messages sent from a shared mailbox cannot be encrypted, according to the Learn overview of shared mailboxes. That is separate from this problem but surprises some teams.
- The April 2026 thread had two participants and one answer. The setting itself is documented by Microsoft, so the commands are not in doubt. Local effects, such as duplicates, are what you must test.

## Related

- [Shared mailbox](https://www.m365.fm/entity/shared-mailbox/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Microsoft Learn: Messages sent from a shared mailbox aren't saved to the Sent Items folder](https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/sent-mail-is-not-saved)
- [Microsoft Learn: About shared mailboxes](https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes)
- [Microsoft Learn: Configure a shared mailbox](https://learn.microsoft.com/en-us/microsoft-365/admin/email/configure-a-shared-mailbox)
- [Microsoft Q&A: Shared Mailbox Sent Items Not Saving (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5872676/shared-mailbox-sent-items-not-saving)
- [Microsoft Q&A: Outlook 365 duplicates in Sent Items only in two of several shared mailboxes (June 2025)](https://learn.microsoft.com/en-us/answers/questions/2280830/outlook-365-duplicates-in-sent-items-only-in-two-o)
- [Microsoft Q&A: Sent email does not show in the shared mailbox Sent Items (December 2023)](https://learn.microsoft.com/en-us/answers/questions/5304887/when-sending-an-email-from-a-shared-mailbox-the-se)
