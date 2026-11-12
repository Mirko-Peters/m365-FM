---
title: "How to Change Your Signature in Outlook on Every Device"
summary: "How to change a signature in Outlook on Windows, the web, Mac and mobile, plus defaults, multiple signatures and why an edit sometimes doesn't show up."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, outlook-web, microsoft-365]
keypoints:
  - "In new Outlook for Windows, open Settings, then Accounts, then Signatures, pick the signature, select the pencil icon, edit it and save."
  - "In classic Outlook for Windows, go to File, Options, Mail and select Signatures. On Mac it is the Outlook menu, Settings, Mail, Signatures."
  - "Defaults are set per account, and new messages and replies or forwards each get their own default."
  - "Since Outlook build 2303, signatures for Microsoft 365 and Outlook.com accounts roam with the mailbox, but older local signatures stay on the device."
  - "If a changed signature doesn't appear on another device, check the account type, the default settings and whether the signature is stored on the device or in the mailbox."
faq:
  - q: "Why is my Outlook signature missing in replies and forwards?"
    a: "Outlook keeps separate defaults for new messages and for replies and forwards. Open your signature settings, select the account and set the signature for both. In new Outlook that means ticking the checkboxes under the editor, and in classic Outlook it means using the two default drop-downs for the account. Then send a test reply."
  - q: "Do my Outlook signatures sync between devices?"
    a: "Often, yes. Microsoft says roaming signatures need Outlook build 2303 or later and a Microsoft 365 or Outlook.com mailbox. The default signatures are copied to the mailbox. Other signatures stay on the device and can't be edited unless they're linked to an account. POP, IMAP, third-party and on-premises Exchange accounts aren't supported."
  - q: "Can I have more than one signature in Outlook?"
    a: "Yes. You can create several signatures, give each a clear name and choose one per message. Set a default per account for new messages and a different one for replies and forwards. While you write a message, use the Signature command on the Message tab to switch to another saved signature."
---
To change your signature in Outlook, open the signature settings, select the signature you want to edit, change the text or image, and save. In new Outlook for Windows that's Settings, Accounts, Signatures. In classic Outlook for Windows it's File, Options, Mail, Signatures. On the web it's Settings, Accounts, Signatures, and on a Mac it's the Outlook menu, Settings, Mail, Signatures. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who want the exact steps for their version, and it also explains defaults, multiple signatures and the sync surprises that make people think the change didn't work.

## Which Outlook are you using?

Before you click anything, work out which Outlook you have, because the menus differ. Microsoft's own pages call out the same split: new Outlook for Windows, classic Outlook for Windows, Outlook on the web, Outlook for Mac and the mobile apps. A quick test: if you see a File menu in the top left of the window, you're on classic Outlook. If you see a Settings gear in the top right and a simplified ribbon, you're on new Outlook or the web. If the steps for new Outlook don't match your screen, Microsoft says to switch to the classic steps.

Signature features are available in every one of them. Microsoft's comparison of Outlook for PC, Outlook on the web and the iOS and Android apps lists inserting and changing signatures as supported in all four. What differs is where the setting lives and how much formatting you get.

## How to change your signature in Outlook for Windows

### New Outlook for Windows

These steps come from Microsoft's page on [adding and changing an email signature](https://support.microsoft.com/en-us/outlook/mail/how-to-add-and-change-an-email-signature-in-outlook).

1. Select the **Settings** gear, then **Accounts**, then **Signatures**.
2. If you have more than one account, pick the account the signature belongs to.
3. To change an existing signature, select the **Edit** (pencil) icon next to it. To make a new one, select **Add signature** and give it a name.
4. Type or edit your text in the editing box and format the font, color and styles.
5. Use the checkboxes at the bottom to apply the signature to new messages and to replies and forwards. Leave them empty if you'd rather add the signature by hand.
6. Select **Save**.

The name you give a signature is only for you. Recipients never see it, so "External" or "Internal" is fine.

To drop a saved signature into a single message, open a new mail, and on the **Message** tab in the **Insert** group select **Signature**, then pick one.

### Classic Outlook for Windows

1. Select **File**, then **Options**, then **Mail**.
2. Select **Signatures** (the button opens the Signatures and Stationery window).
3. Under **Select signature to edit**, choose the signature, change it in the **Edit signature** box and select **OK**. To start a new one, select **New** and name it.
4. At the top right of the window, choose the email account under **Choose default signature**. Set the signature for **New messages** and, separately, for **Replies/forwards**.

Microsoft's accessibility guide for classic Outlook confirms this structure: you choose the account first, then the signature for new messages and the signature for replies and forwards. You can also pick **None** to remove a default. While composing, the **Signature** command on the **Message** tab inserts a saved signature into that one message.

## Outlook on the web, Mac and mobile

### Outlook on the web

Microsoft's web page for signatures gives this path: **Settings**, **Accounts**, **Signatures**. Create or edit the signature content, choose whether to include it on new messages and on replies and forwards, and save. Microsoft's page doesn't describe image handling for the web, so test a logo with a message to yourself before you roll it out to a team. The web version is also where many people first notice the old layout, which put signatures under Mail and Compose and reply. If you don't find Accounts in your settings, look there.

### Outlook for Mac

Microsoft documents the Mac steps in its article on [creating, inserting or changing a signature in Outlook for Mac](https://support.microsoft.com/en-us/outlook/create-insert-or-change-a-signature-in-outlook-for-mac). The path is **Outlook** menu, **Settings**, **Mail**, **Signatures**.

1. Open the **Outlook** menu and select **Settings**, then under **Mail** select **Signatures**.
2. To change an existing signature, pick it under **Signature name** and select **Edit**. To create a new one, select the **Add** (+) icon and type a name.
3. Enter your text and format it. Select **See more items (...)** to add a picture, logo, hyperlink or table. For a link, choose **Link**, enter the text and address and select **OK**.
4. Under **Set default signature**, select an account, then choose the signature for **New messages** and for **Replies or forwards**. Repeat for each account, since Mac defaults are per account.
5. Close the **Signatures** window. That saves your changes.

If the Signature button is missing from the ribbon when you compose, add it by customizing the toolbar. Microsoft also notes that support for legacy Outlook for Mac ends in October 2026, so if you're still on the legacy app, plan the move.

### Outlook for iOS and Android

On the phone the signature is a setting in the app, not in your mailbox settings on the desktop. Microsoft's mobile article says to go to the Settings screen, select **Signature** in the Mail section and then either type one signature for all accounts or turn on **Per Account Signature** and write a separate one for each account. Microsoft doesn't say anything about images or formatting limits there, so don't plan a logo-heavy design for mobile. Keep a short plain version, such as name, title and phone number, and test it by sending yourself a message.

## Why your change doesn't show on another device

This is the part that trips people up. For years the rule was simple: each Outlook kept its own signatures. That has changed, and it's why you now get inconsistent results.

Microsoft's article on [Outlook roaming signatures](https://support.microsoft.com/en-us/outlook/outlook-roaming-signatures) explains what happens in Outlook for Windows. Signatures can be stored in your mailbox so they're available on every device where that account is set up. The requirements are Outlook build 2303 or higher and a Microsoft 365 or Outlook.com mailbox. Exchange on-premises, third-party mail and POP or IMAP accounts aren't supported. The feature turns on by itself, and existing signatures aren't overwritten.

The details matter when you troubleshoot:

- Only your default signatures for new messages and for replies and forwards are copied to the account's mailbox.
- Other signatures stay on the device, listed under "Signatures on this device". You can't edit them unless they're linked to an account.
- Signature add-ins that edited signature files on disk or changed the registry stop working once the feature is on.
- Admins can switch the feature off with the `DisableRoamingSignatures` registry value, so a managed PC may behave differently from your home laptop.

The practical read is this: if the signature you changed isn't your default for the account, it may exist on one computer only. Make it the default for new messages or for replies, wait a moment, then check [Outlook on the web](https://www.m365.fm/entity/outlook-web/) on a second device. If you're on a POP or IMAP account, update each device by hand.

Microsoft's pages say nothing about phone signatures syncing with the desktop. Treat the mobile signature as separate and set it once per phone.

## Defaults and multiple signatures

Most people end up with two or three signatures: a full one for first contact, a short one for replies, and maybe one for a second role.

1. Create each signature with a name you'll recognize in the list, such as "Full" and "Short".
2. Pick the account, then set the signature for new messages and a different one for replies and forwards. The short version on replies keeps threads from filling up with repeated logos.
3. If you leave the default checkboxes empty in new Outlook, the signature isn't added by itself. You choose it with the **Signature** command on each message.
4. To change one message, use the **Signature** command while you compose and pick another saved signature.
5. To remove a default in classic Outlook, set the drop-down to **None**.

If you have a shared mailbox or send from several accounts, set the defaults for each account separately. Outlook stores them per account, and an unset account sends mail with no signature at all.

## Start from a template

If you don't want to design a signature from scratch, Microsoft offers templates. Its small-business signature page describes this route for classic Outlook for Windows:

1. Download the signature template and open it in Word. If Word opens it in Protected View, select **Enable Editing**.
2. Pick a design, select all its elements and copy them.
3. In Outlook, start a new email and paste the signature into the message body.
4. Edit the text, swap the photo or logo and add your links. To change a picture, right-click it, choose **Change Picture**, select the source file and click **Insert**. Drag the handles to resize. To change a link, right-click a social icon or highlight website text and choose **Edit Link**, then enter the address and click **OK**.
5. Select and copy all signature elements again, go to **Message**, **Signature**, **Signatures**, click **New**, name it and paste into the **Edit signature** field. Click **OK**.

After you save it, you can ask for the signature to be added automatically to future messages from the Signatures dialog. Microsoft's page also suggests emailing the finished signature to colleagues, who follow the same save steps. That keeps a team consistent without any tool, though it relies on everyone doing the steps themselves.

## What to put in the signature

Microsoft says a signature can include text, links, pictures and images such as a logo or a handwritten signature. Keep it practical.

- Name, job title, company and one way to reach you. A phone number or a website is enough.
- A link only where it helps, for example your company site or a booking page. A signature with eight links looks like an ad.
- A small logo, saved as a compact file. Large images make every message heavier.
- Standard fonts. Microsoft recommends them for signatures because they display on most devices.
- Alt text on images where the editor offers it, so screen reader users know what the image shows.

A text-only fallback is worth keeping. Some recipients block images, and your logo then turns into an empty box. Make sure the name and contact details are text, not part of the picture.

If your company requires a legal or privacy disclaimer, ask legal or compliance for the exact wording and don't improvise it. Rules differ by country and industry, and which ones apply to you is a question for legal.

## Where signatures are stored and how to move them

On a classic Windows install, signature files historically live in a Signatures folder under your user profile in `AppData\Roaming\Microsoft\Signatures`. Copying that folder is the old way to move signatures to a new PC. I couldn't confirm the path on a Microsoft page, so check it on your machine before you rely on it. With roaming signatures, a default signature for a Microsoft 365 account follows the mailbox, so a copy is only needed for the extra signatures that stayed on the device.

Close Outlook before you copy files back, then open it and check that each signature shows up and looks right. Images are the first thing to break.

## Common mistakes

- **Editing a signature that isn't the default.** You changed it, but Outlook still adds the old one because the account's default points elsewhere. Check the default drop-downs or checkboxes after every edit.
- **Forgetting replies and forwards.** New messages and replies have separate defaults. If your signature vanishes in threads, that's almost always why.
- **Assuming every device updates itself.** Roaming covers defaults for supported Microsoft 365 and Outlook.com accounts. POP, IMAP, on-premises Exchange and the mobile apps need a manual update.
- **Pasting from Word without a test.** Pasted formatting can look different in the editor than in a sent message. Send a test to yourself and a second address.
- **Building the contact details into an image.** If images are blocked, your phone number disappears with them.
- **Using an add-in that edits signature files.** Microsoft says such add-ins stop working when roaming signatures are on, so ask your admin before you change a managed signature tool.

## Related topics to explore

- **Signatures missing from replies or forwards.** Check the default for replies and forwards on every account, in new Outlook, classic Outlook and on the Mac.
- **Company-wide signatures.** If you manage more than a handful of people, ask your admin how the company standardizes names, titles and disclaimers. Email lives in [Microsoft 365](https://www.m365.fm/entity/microsoft-365/) for most companies, so that's usually where the discussion starts.
- **Accessible signatures.** Short text, readable fonts, clear contrast and alt text on images help everyone, not only screen reader users.
- **Legal footers and disclaimers.** The wording is a legal decision, so get it from your compliance team rather than from a template.

## Next step

Open your signature settings now and confirm that the signature you want is the default for both new messages and replies on each account. Then send a test email from every device where you want to change your signature in Outlook, so you know which ones follow the mailbox and which ones need a manual update.
