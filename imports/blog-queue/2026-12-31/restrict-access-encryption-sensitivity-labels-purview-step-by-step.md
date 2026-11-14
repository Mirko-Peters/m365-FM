---
title: "Restrict Access With Encryption in Sensitivity Labels: Steps and Options in Purview"
summary: "How to configure encryption in a sensitivity label using Microsoft Learn: prerequisites, the Control access steps, assigning permissions now or letting users choose, expiry and offline access, Do Not Forward versus Encrypt-Only, and what happens to existing encryption."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [sensitivity-labels, purview, microsoft-information-protection]
keypoints:
  - "Encryption is set in the label wizard: scope Files and other data assets, then Control access, then Configure access control settings."
  - "You can assign permissions in the label, or let users assign permissions when they apply the label, with Do Not Forward or Encrypt-Only as the user choices."
  - "Learn recommends 7 days offline access for sensitive business data and states that the default use license validity is 30 days."
  - "Do Not Forward blocks forwarding, printing and copying. Encrypt-Only allows all usage rights except Save As, Export and Full Control. A DKE label cannot be edited after saving."
  - "The Learn page does not list license SKUs, so check the service description for licensing."
faq:
  - q: "Where do I turn on encryption for a sensitivity label?"
    a: "According to Microsoft Learn, in the label configuration choose the scope Files and other data assets, then Control access, then Configure access control settings."
  - q: "What is the difference between assigning permissions now and letting users assign them?"
    a: "Learn describes that you either define the permissions in the label, or you let users assign permissions when they apply the label. In the second case the user picks options such as Do Not Forward."
  - q: "What default validity does the use license have?"
    a: "The Learn page states that the use license validity defaults to 30 days."
  - q: "Can I change a Double Key Encryption setting later?"
    a: "According to Microsoft Learn, the setting cannot be edited after you save the label."
---

To restrict access with a sensitivity label, you turn on encryption in the label and decide who gets which permissions. The Microsoft Learn article on encryption in sensitivity labels was updated on 2026-04-15. This guide follows its structure and notes what it leaves out.

## Prerequisites

Learn lists these prerequisites:

- Azure Rights Management must be active.
- The network must allow the needed connections.
- Cross-tenant access in Microsoft Entra or Conditional Access policies can affect access to encrypted content, so review them.
- Exchange Online configuration is recommended.

The page does not list the license SKUs that include encryption. Check the Microsoft Purview service description for licensing.

## Turn on encryption in a label

The label wizard path on the page is:

1. Choose the label scope **Files & other data assets**.
2. Select **Control access**.
3. Select **Configure access control settings**.

You then choose between two models.

### Assign permissions now

You define who gets which permissions. Learn lists who can be added: all users in your organization, any authenticated users, specific users and groups, or any email address or domain. The page states that the Rights Management issuer has Full Control.

### Let users assign permissions

Here the label asks the user to choose permissions when applying it. The page describes two user options: **Do Not Forward** and **Encrypt-Only**.

- **Do Not Forward:** Learn says recipients cannot forward the email, print it or copy from it. In the Outlook client, the Forward button is not available, Save As and Print are not available, and recipients cannot be added or changed in the To, Cc or Bcc boxes. Do Not Forward is supported by all email clients that support sensitivity labels.
- **Encrypt-Only:** Learn says recipients have all usage rights except Save As, Export and Full Control. They have no restrictions except that they cannot remove the protection. A recipient can copy from the email, print it and forward it.

## Expiry and offline access

Learn describes two settings:

- **User access to content expires:** access can expire on a specific date or after a number of days after the label is applied. A date takes effect at midnight on that date in your current time zone. Learn warns that some email clients might not enforce expiration because of caching, and show emails past their expiry.
- **Allow offline access:** never, always, or for a number of days after the label is applied.

Learn gives these recommendations:

| Setting | Recommended value | Used for |
|---|---|---|
| User access to content expires | Never, unless there is a time-bound requirement | Most labels |
| Allow offline access | Only for 7 days | Sensitive business data that could cause damage if shared with unauthorized people |
| Allow offline access | Never | Labels with dynamic watermarks and very sensitive business data |
| Allow offline access | Always | Less sensitive content where a validity of up to 30 days is acceptable |

Labels that let users assign permissions use the tenant's use license validity period. The page states that the default is 30 days, and that the same default applies if no expiration is set. How to change the tenant value is not described on this page.

## Permission levels

The page names the predefined levels **Editor** and **Restricted Editor**, and uses **Viewer** and **Owner** in its examples. It does not state which rights Editor, Restricted Editor or Owner include and refers to the usage rights documentation. It also does not list Co-Owner, Co-Author or Reviewer.

## Dynamic watermarks

Learn describes dynamic watermarks as follows:

- By default the user principal name (UPN) of the person viewing is inserted as a watermark on each page. Custom text can include date and time.
- The watermark is highly visible on a device and persists when printed, but not when exported.
- It is supported only for encryption labels, and Learn recommends setting offline access to **Never**.
- File preview for attachments in Outlook and PowerPoint Live in Microsoft Teams open the document without the watermark.
- Apps that do not support dynamic watermarks either deny access or the document does not open, unless the user is the Rights Management owner or uses Office on the web.

## Co-authoring limits

For simultaneous editing, Learn says all users must use Office for the web, or co-authoring for files encrypted with sensitivity labels must be enabled and all users must have Office apps that support it. Without that, an open file shows a **File In Use** message in Office apps, and in Office for the web users see an error and can select **Open in Reading View**. AutoSave is disabled for encrypted files, and viewing or restoring previous versions is not supported from Office apps.

## Double Key Encryption

Select the **Double Key Encryption** option only after you configured the Double Key Encryption service. The page states that after the label is configured and saved, you cannot edit it. Prerequisites are on a separate page that I did not read.

## What happens to existing encryption

The page has a table that compares the existing encryption with the label setting.

| Existing encryption source | Label encryption not selected | Configured | Remove |
|---|---|---|---|
| Permissions specified by a user | Original encryption is removed | New label encryption is applied | Original encryption is removed |
| Rights management template | Original encryption is preserved | New label encryption is applied | Original encryption is removed |
| Label with administrator-defined permissions | Original encryption is removed | New label encryption is applied | Original encryption is removed |

Replacing or removing encryption works only if the person applying the label has the Export or Full Control usage right, is the Rights Management issuer or owner, or is a super user. Otherwise the label cannot be applied and the original encryption stays. The user sees the message that they do not have permission to make this change to the sensitivity label and should contact the content owner.

## Suggestion: a rollout approach

This section is a practical suggestion and not a Microsoft statement.

1. Start with one test label that has a small group as the audience.
2. Apply it to a document and an email, and open both as a permitted user and as a user outside the list.
3. Check offline behavior with a short offline period.
4. Review Conditional Access and cross-tenant settings if external users fail to open files.
5. Only then publish the label to a larger audience.

## Not covered

The pages I read do not describe the following:

- License SKUs that include encryption.
- The rights contained in Editor, Restricted Editor and Owner.
- Minimum Office app versions, which are in linked capability tables.
- Double Key Encryption setup steps.
- Troubleshooting steps for users who cannot open encrypted files.

## Related

- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Microsoft Information Protection](https://www.m365.fm/entity/microsoft-information-protection/)

## Sources

- [Restrict access to content by using encryption in sensitivity labels](https://learn.microsoft.com/purview/encryption-sensitivity-labels)
