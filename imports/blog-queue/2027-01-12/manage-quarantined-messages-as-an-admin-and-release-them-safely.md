---
title: "How to Manage Quarantined Messages as an Admin and Release Them Safely"
summary: "Manage quarantined email in the Microsoft Defender portal: where to find it, filters, release and delete actions, allow and block sender, download, required permissions, retention and the guidance Learn gives before you release a message."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [exchange-online-protection, defender-for-office-365]
keypoints:
  - "Path: Defender portal > Email & collaboration > Review > Quarantine > Email tab. The first 100 entries load, and you scroll for more."
  - "Release can send a copy to other recipients and submit the message to Microsoft as a false positive. Delete from quarantine is permanent. Bulk actions cover up to 100 messages."
  - "Check that non-Microsoft security services or outbound connectors do not cause re-quarantine, and that inbox rules do not move released messages. Use message trace to confirm delivery."
  - "Roles that manage quarantine include Quarantine Administrator, Security Administrator and Organization Management. Read-only roles are Global Reader, Security Reader and Security Operator."
  - "Quarantined files need Defender for Office 365 Plan 1 or 2. The page does not state the email retention periods in this section."
faq:
  - q: "Where do I find quarantined email?"
    a: "In the Microsoft Defender portal go to Email & collaboration > Review > Quarantine and select the Email tab. The Files tab needs Defender for Office 365 Plan 1 or Plan 2, and the Teams messages tab shows messages quarantined by zero-hour auto purge."
  - q: "What happens when I release a message?"
    a: "The message is delivered to the recipient again. You can also send a copy to other recipients and submit the message to Microsoft as a false positive. Releasing can re-deliver the message while the original send date stays in the headers."
  - q: "Is deleting from quarantine reversible?"
    a: "No. Delete from quarantine permanently removes the message."
  - q: "How many messages can I act on at once?"
    a: "Bulk actions are available for up to 100 messages."
  - q: "Who can manage quarantine?"
    a: "Quarantine Administrator, Security Administrator, Organization Management, or the Microsoft Entra Security Administrator or Global Administrator role. Learn says to limit Global Administrator to emergencies. The unified RBAC permission Email & collaboration quarantine (manage) also works when Defender for Office 365 permissions are Active, in the portal only. PIM roles are not supported."
---

Quarantine holds messages that protection policies caught, such as spam, phishing and malware. Admins decide what to release, delete or report. This guide follows the Microsoft Learn page on managing quarantined messages and files as an admin. The release guidance on the page is scattered, so it is collected here.

## Find quarantined items

Go to the Microsoft Defender portal, then **Email & collaboration** > **Review** > **Quarantine**.

- **Email** tab. The first 100 entries load, and more load when you scroll.
- **Files** tab. Needs Defender for Office 365 Plan 1 or Plan 2. It shows files quarantined by Safe Attachments in SharePoint, OneDrive and Teams.
- **Teams messages** tab. Shows messages quarantined by zero-hour auto purge.

## Filters and search

Email filters include Time received (default Last 7 days), Expires, Quarantine reason, Policy type, Release status, Recipient (All users or Only me), Blocked sender, Message ID, Sender address, Recipient address, Subject and Recipient tag. Filters are cached, so the filters from the last session are selected the next time you open the page.

Search takes a sender email address or the entire subject, and wildcards are not supported. The subject search is not case-sensitive. It searches only the current view of up to 100 items, so narrow the filters first.

## Actions

- **Release.** Delivers the message again. It is not available for messages already released, and you cannot release a message to the same recipient more than once. Options let you send a copy to other recipients and submit the message to Microsoft as a false positive. The false-positive option reveals Allow this message, Remove entry after (default 45 days after the last used date) and an Allow entry note. The page says that only members of the Security Administrators role group see and use the submit and Allow email with similar attributes options.
- **Approve or Deny release.** Handles release requests from users. Deny applies to all recipients, not to specific ones.
- **Delete from quarantine.** Permanent.
- **Preview message** and **View message headers.**
- **Submit for review.**
- **Allow sender** and **Block sender.** They need the Only me filter and add the sender to the Safe Senders or Blocked Senders list of the mailbox of whoever is signed in. The organization can still receive mail from a blocked sender. To delete mail from a blocked sender on arrival, use a mail flow rule with Block the message.
- **Remove sender from user block list.**
- **Share email.**
- **Download messages.** Requires a reason and a password. The result is saved as .eml files in Quarantined Messages.zip.

Bulk actions work on up to 100 messages. For bulk release the only options are sending a copy to other recipients and submitting the message as a false positive.

## Before you release

The page has no dedicated checklist. These points come from its guidance:

- Check that non-Microsoft antivirus, other security services or outbound connectors are not causing the message to be quarantined again.
- Inbox rules can move or delete a released message. Use message trace to confirm that it reached the inbox.
- A release re-delivers the message. The original send date stays in the headers.
- Password-protected attachments that Safe Attachments could not scan can be released without the password.
- Selecting Allow this message in a false-positive submission adds allow entries for the sender and related URLs or attachments to the Tenant Allow/Block List.

## Permissions

- Managing quarantine: Quarantine Administrator, Security Administrator, Organization Management, or the Microsoft Entra Security Administrator or Global Administrator role (the page says to limit Global Administrator to emergencies or cases where you cannot use another role), or the unified RBAC permission Email & collaboration quarantine (manage), which applies when Email & collaboration > Defender for Office 365 permissions is Active and affects the portal only, not PowerShell.
- Read-only, including preview and download: Global Reader, Security Reader and Security Operator. Submitting messages to Microsoft from quarantine needs Security Administrator.
- Privileged Identity Management roles are not supported in quarantine.
- Exchange Online permissions for quarantine management ended in February 2023 (message center post MC447339).
- Guest admins from other organizations cannot manage quarantine.

## Retention and audit

- Messages and files are kept for a default period that depends on why they were quarantined. Expired items are deleted automatically and cannot be recovered. The page links a Quarantine retention article for the periods. Teams messages are kept 30 days. Files quarantined in SharePoint or OneDrive are removed from quarantine after 30 days, and the blocked files stay in the blocked state.
- The page does not state the email retention numbers in this section.
- The quarantine policy for Teams messages is currently AdminOnlyAccess, so users cannot access quarantined Teams messages.
- Deleting is logged as the audit activity Deleted Quarantine message.
- PowerShell cmdlets are listed: Delete-QuarantineMessage, Export-QuarantineMessage, Get-QuarantineMessage, Preview-QuarantineMessage and Release-QuarantineMessage. Preview-QuarantineMessage is for messages only. The PermissionTo* properties from Get-QuarantineMessage reflect the permissions of the user who runs the cmdlet, not those of the recipients. The page gives no examples.

## What the page does not say

- The email retention periods in this section.
- A single release checklist.
- Cmdlet syntax and examples.

## A release outline

This outline is my advice, built on the page.

1. Filter to the message and preview it before you decide.
2. Check the quarantine reason and the policy type.
3. Release, and submit as a false positive only when you believe the verdict is wrong.
4. Confirm delivery with message trace.
5. If the message returns to quarantine, review connectors and other filtering services.

## Typical mistakes (my advice)

- Deleting messages that a user may still need, since delete is permanent.
- Expecting Allow sender to block or allow mail for the whole tenant.
- Searching for a message that sits beyond the first 100 loaded items.
- Using a Global Administrator account for routine quarantine work.

## Related

- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Manage quarantined messages and files as an admin (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/quarantine-admin-manage-messages-files)
