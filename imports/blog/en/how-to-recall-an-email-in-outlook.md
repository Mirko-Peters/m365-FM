---
title: "How to Recall an Email in Outlook: Windows, Mac, Web and Mobile"
summary: "How to recall an email in Outlook: the exact steps for new Outlook, classic Outlook, Mac and mobile, who can use recall, and what to do when it fails."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, exchange-online-powershell, message-trace, shared-mailbox]
keypoints:
  - "To recall an email in Outlook, open the message from Sent Items in its own window and select Recall Message, then watch your inbox for the Message Recall Report."
  - "Recall only works when you and the recipient both have Microsoft 365 work or school accounts in the same organization. Gmail, Hotmail and Outlook.com addresses are out of reach."
  - "Microsoft's support pages say the recipient must not have opened the message. Whether read messages can be recalled is an admin setting."
  - "Outlook for Mac supports recall from version 16.94 (Build 25010522); the older legacy Outlook for Mac does not."
  - "If recall fails, send a short correction right away and tell your IT or security team when the mistake involves sensitive data."
faq:
  - q: "Can you recall an email in Outlook after it was read?"
    a: "Microsoft's support pages say the recipient must not have opened the message. Behind the scenes, Exchange Online has an organization setting called RecallReadMessagesEnabled that controls whether read messages can be recalled, and the documentation doesn't state its default. Assume a read message can't be pulled back and send a correction."
  - q: "Can I recall an email sent to Gmail or another company?"
    a: "No. Recall works when you and the recipient both have a Microsoft 365 work or school account in the same organization. Gmail, Hotmail and Outlook.com recipients can't be reached. Exchange Online does support cross-tenant recall between two organizations, but only if the receiving tenant's admin has switched it on and allowed your tenant."
  - q: "How do I know if my Outlook recall worked?"
    a: "Shortly after you start a recall, a Message Recall Report arrives in your inbox. Select the link in it to see whether the recall succeeded, is pending or failed. Exchange keeps trying for up to 24 hours, so a pending status can still change. Report emails come from Office365Reports@microsoft.com."
---
To recall an email in Outlook, open the sent message from your Sent Items folder in its own window and select Recall Message (in new Outlook) or Recall This Message (in classic Outlook). A few minutes later you get a Message Recall Report in your inbox that says whether it worked. It only works if you and the recipient both have a Microsoft 365 work or school account in the same organization, and Microsoft says the recipient must not have opened the message yet. This article is for everyday [Outlook](https://www.m365.fm/entity/outlook/) users who just hit Send on the wrong message, and for the admins who get the follow-up question afterward.

## What an Outlook recall can and can't do

Recall isn't an undo button. It's a request that Exchange tries to carry out in the background. When you recall a message, a service in Exchange Online tries to delete the original from the recipients' mailboxes, and Microsoft's documentation says it's a hard delete. Then the recall message itself is dropped, so the recipient usually never sees a "recall request" arrive. The service keeps trying for up to 24 hours before it gives up.

Microsoft's [recall requirements page](https://support.microsoft.com/en-us/outlook/mail/how-to-recall-an-email-in-outlook-requirements-limitations-steps) lists three conditions:

- You and the recipient both have a Microsoft 365 work or school account in the same organization.
- The recipient hasn't opened the message.
- You're using new Outlook, classic Outlook for Windows or Outlook on the web. Mac and mobile have their own articles, covered below.

Personal accounts such as Gmail, Hotmail and Outlook.com can't use message recall. For those, Microsoft points you to the Undo Send delay instead, which I'll come back to.

There are two flavors of recall. A plain recall deletes the original. A recall-and-replace deletes the original and then sends your corrected version through normal delivery, so the new message arrives like any other email. In both cases the recipient only ever sees the message that survives.

## How to recall an email in Outlook for Windows

The steps depend on which Outlook you run. Microsoft's current support page documents new Outlook first and keeps the classic steps on a separate tab.

### New Outlook for Windows

1. Select **Sent Items** in the left folder pane.
2. Double-click the message so it opens in a separate window. Microsoft's steps all start from the message opened in its own window, not from the reading pane.
3. On the ribbon, select **Recall Message**, then select **OK** in the confirmation box.
4. Wait a few minutes and open your inbox. Find the **Message Recall Report** and select the link inside it. The report tells you whether the recall succeeded, is pending or failed.

If you don't see a Recall Message button, you may not be on new Outlook yet. Microsoft says to use the classic steps in that case.

### Classic Outlook for Windows

Classic Outlook is the version with the full ribbon and the File menu. You work from Sent Items again and open the message in its own window. The recall command sits on the **Message** tab of the opened message under **Actions**, and it's called **Recall This Message**. You then choose between deleting unread copies and deleting unread copies and replacing them with a new message. If you pick replace, Outlook opens a copy of the original that you edit and send. The labels can differ slightly between builds, so if you can't find the command, check the Classic Outlook tab on Microsoft's [recall page](https://support.microsoft.com/en-us/outlook/mail/how-to-recall-an-email-in-outlook-requirements-limitations-steps).

Two limits matter for classic Outlook. First, Microsoft's Exchange Online documentation says recall doesn't work when Outlook runs in Online mode, or when several Exchange accounts are configured in the same Outlook profile. Second, if the command is missing, check the account type first. Microsoft's article links to a short check for whether your classic Outlook profile uses an Exchange account, and recall depends on that.

## How to recall an email in Outlook for Mac

Mac support is newer than Windows support and it has a version floor. Microsoft's [Outlook for Mac recall article](https://support.microsoft.com/en-us/outlook/recall-an-email-message-in-outlook-for-mac) says you need Outlook for Mac 16.94 (Build 25010522) or later. It also says the feature isn't supported in legacy Outlook for Mac.

1. Select **Sent** in the folder pane.
2. Double-click the sent message so it opens in its own window.
3. On the ribbon, select **Recall**, then select **OK**. You can also Control-click the message and choose **Recall** from the shortcut menu.
4. Check your inbox for the **Message Recall Report** and select the link to see the outcome.

If the Recall button isn't on your toolbar, add it by customizing the toolbar. Microsoft's Mac article links to the steps for that.

The same account rule applies on Mac: you and the recipient both need Microsoft 365 work or school accounts in the same organization. Messages to or from Hotmail, Gmail or live.com addresses can't be recalled.

## Recall on the web and on mobile

Older advice says recall is a desktop-only feature. That's out of date. Microsoft's Exchange Online documentation lists these clients as supported for recall: classic Outlook, new Outlook, Outlook on the web, Outlook for Mac and Outlook for Android and iOS.

On a phone, Microsoft's [mobile recall page](https://support.microsoft.com/en-us/outlook/can-i-undo-recall-a-sent-email) gives this path: open the message from your Sent folder, tap the three-dot More options menu in the top right corner and tap **Recall**. You get an email telling you whether the recall succeeded. The same page says a recall can fail if the message is very old or if your IT administrator has turned the feature off.

You start the recall in whichever supported client you send from. Microsoft describes the deletion as happening in the recipient's mailbox, so the recipient doesn't need a special client. What matters is the account type and whether the message was already opened.

## Why a recall fails

Most failures come from a short list of causes. Check these before you blame Outlook.

- **The recipient already opened the message.** This is the number one reason in Microsoft's own requirements. Exchange has an organization-level setting, `RecallReadMessagesEnabled`, that decides whether read messages can be recalled at all, and the documentation doesn't state a default. Don't count on it.
- **The recipient is outside your organization or on a personal account.** Gmail, Outlook.com and Hotmail recipients can't be reached. Messages to another Microsoft 365 tenant can only be recalled if the receiving tenant's admin has turned on cross-tenant recall and allowed your tenant ID. That setting is off by default.
- **The recipient's mailbox is on-premises.** In a hybrid setup, cloud mailboxes can't recall messages that went to the on-premises Exchange environment.
- **The message was forwarded.** Automatic forwarding inside the organization is recallable. Manual forwarding by the recipient, forwarding through an inbox rule, and automatic forwarding outside the organization are not.
- **The message is too old.** Admins can set a maximum recallable message age. The documented default is 365 days, and the allowed range runs from five minutes to ten years. If you try to recall something older, you get a notice that it's too old.
- **Recall is turned off.** Admins can disable the feature with `Set-OrganizationConfig -MessageRecallEnabled $false`.
- **The recipient list is a mail-enabled public folder.** Recalls to those aren't supported.

Encrypted messages deserve a short note. Microsoft says recall of OME or MIP-encrypted messages is supported if the sender has the Premium Encryption in Office 365 service plan and recalls from Outlook on the web or new Outlook.

## What the recipient sees and what IT can see

Since the original is hard-deleted from the mailbox, a recipient who hasn't opened the message sees nothing unusual. If the admin switched on recipient notifications, recipients get an alert. The setting is off by default and can be limited to messages that were already read. The documentation doesn't describe the notification text, so test it before you promise anything to a nervous executive.

For compliance people, this part matters more than the recipient's view. Microsoft's documentation says mailboxes under Litigation Hold or In-Place Hold still show recalled messages in eDiscovery, and that recalls don't appear in mailbox audit logs at this time. So a recall doesn't make a message disappear from a legal point of view. If you recalled something because it contained personal data or a secret, IT should still hear about it.

## Admin notes for Exchange Online

If you run the tenant, here's what to check before the first recall ticket lands on your desk.

1. Connect with [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/) and read the current settings with `Get-OrganizationConfig`.
2. Confirm that recall is enabled: `Set-OrganizationConfig -MessageRecallEnabled $true`.
3. Decide on read-message recall with `-RecallReadMessagesEnabled`. Treat this as a policy decision, not a default.
4. Decide whether recipients should get a notification with `-MessageRecallAlertRecipientsEnabled`.
5. Make sure `Office365Reports@microsoft.com` isn't blocked. Recall reports come from that sender, and a mail rule that eats them makes recalls look broken.
6. Know how to verify a recall with [message trace](https://www.m365.fm/entity/message-trace/). A recall message in a trace often shows the status Failed, and that's normal because Transport drops it after the recall completes. The Drop event detail shows the real result, either `Result:Success` or `Result:Failed`.

Shared and delegated mailboxes work with limits. Microsoft says messages sent from a [shared mailbox](https://www.m365.fm/entity/shared-mailbox/) can be recalled, but the report opens only in a browser and requires sign-in with the owning mailbox's credentials. Signing in as the shared account doesn't work. The recall status report is also limited to about 50,000 recipients, although the recall itself is attempted for every eligible recipient. The full details are in Microsoft's article on [cloud-based message recall](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/work-with-cloud-based-message-recall), which is worth a bookmark.

## Common mistakes

- **Waiting to see if anyone notices.** Start the recall in the first minute. The recipient has to open the message after you hit Send, and they'd have to do it before the service deletes it.
- **Recalling from the reading pane.** Microsoft's steps start from the message opened in its own window. Selecting it in Sent Items isn't enough.
- **Assuming a recall to Gmail will work.** It won't, and the Message Recall Report will tell you so.
- **Treating "pending" as "failed".** The service keeps trying for up to 24 hours. Give it time before you write a follow-up that makes things worse, unless the content is sensitive. In that case act now.
- **Skipping the follow-up.** A recall that succeeds is invisible, but a recall that fails leaves the original in the inbox. Send a two-line correction anyway when the mistake is big.
- **Forgetting the delay.** The best fix for most senders isn't recall at all. It's a few seconds of grace before the message leaves.

## Undo Send: the better safety net

Undo Send is not recall. It holds the message for a few seconds before it leaves your outbox. In Outlook for Mac you set it under **Outlook > Settings > Composing**, with a delay of 5, 10, 15 or up to 120 seconds. After you send, a prompt appears at the bottom of the window and you select **Undo** to cancel. Microsoft says this isn't true recall and that it's available only with Microsoft 365 subscription licenses and Outlook.com accounts. Microsoft's recall page also names an Undo Send delay in new Outlook for Windows and in Outlook.com for personal accounts, so look for it in your compose settings.

## Related topics to explore

- **What to do after a failed recall.** Send a short correction, add the missing attachment or ask the recipient to delete the message, and tell your IT team if the mistake involved personal data.
- **Which clients support recall.** New Outlook, classic Outlook, Outlook on the web, Mac and mobile are all listed, but Mac needs version 16.94 or later.
- **How recall interacts with compliance tools.** Holds, eDiscovery and [Exchange Online](https://www.m365.fm/entity/exchange-online/) retention still see recalled messages, so talk to your compliance owner about how to handle the sensitive ones.
- **How admins monitor recalls.** Message trace and the recall report give you the facts. Learn the Drop event detail before the first escalation.

## Next step

Open Outlook, go to Sent Items and find the last message you sent to a colleague. Check whether your version shows the Recall command and turn on a short Undo Send delay while you're at it. That way, the next time you need to know how to recall an email in Outlook, you'll already know where the button is.
