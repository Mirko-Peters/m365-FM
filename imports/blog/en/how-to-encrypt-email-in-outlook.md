---
title: "How to Encrypt Email in Outlook: Purview, S/MIME and Do Not Forward"
summary: "How to encrypt email in Outlook with Purview Message Encryption or S/MIME: steps per version, what recipients see and what to check if Encrypt is missing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, purview, sensitivity-labels]
keypoints:
  - "Outlook has two real ways to encrypt a message: Microsoft Purview Message Encryption (Options, then Encrypt) and S/MIME, which needs a digital ID on your computer."
  - "Encrypt keeps the message protected but allows forwarding inside the service; Do Not Forward also blocks copying, printing and forwarding."
  - "Microsoft 365 Personal and Family subscribers can send Encrypt and Do Not Forward messages from Outlook.com and new Outlook for Windows."
  - "Recipients on other mail services get a link to a portal and sign in with a Microsoft, Google or Yahoo account or use a one-time passcode."
  - "If the Encrypt button is missing, check your subscription, the Outlook version and your admin's settings before you look for workarounds."
faq:
  - q: "What is the difference between Encrypt and Do Not Forward in Outlook?"
    a: "Encrypt protects the message so only the intended recipients can read it, but they can still do normal things with it inside Microsoft 365. Do Not Forward adds restrictions: the message can't be copied or forwarded, and Office attachments stay encrypted after download. Microsoft notes that PDFs and images can still be downloaded unencrypted."
  - q: "Can I encrypt email in Outlook with a Microsoft 365 Family plan?"
    a: "Yes, in some versions. Microsoft says Personal and Family subscribers can send encrypted mail from Outlook.com and new Outlook for Windows, using Options, Encrypt, then Encrypt or Do Not Forward. Recipients can read it in new Outlook, Outlook for Mac, Outlook.com and the mobile app, or sign in through the portal."
  - q: "Do recipients need Outlook to open an encrypted email?"
    a: "No. Recipients on other mail services receive instructions and a link to a secure portal. Microsoft says Google and Yahoo users can sign in with that account, and other providers use a temporary passcode sent by email. S/MIME is different: the recipient needs a mail app that supports S/MIME and the matching private key."
---
To encrypt an email in Outlook, start a new message, select **Options**, then **Encrypt**, and choose **Encrypt** or **Do Not Forward** before you send. That uses Microsoft Purview Message Encryption. If your company issued digital IDs, you can use S/MIME instead. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who need to send something private, and for the admins who get the question "why is there no Encrypt button on my screen?" It covers both methods, the version differences, what your recipient will see and how to fix a missing button.

## Two ways to encrypt: Purview Message Encryption and S/MIME

Outlook offers two main methods, and they work very differently. Microsoft's article on [securing and protecting email messages in Outlook](https://support.microsoft.com/en-us/outlook/mail/learn-about-securing-and-protecting-email-messages-in-outlook) compares them.

**Microsoft Purview Message Encryption** encrypts the message through Microsoft 365. Recipients using most Outlook versions can read encrypt-only messages directly, and recipients on other mail services get a link to a portal. It needs a qualifying Microsoft 365 subscription, and your organization or account has to allow it. Do Not Forward belongs to this family: it uses Information Rights Management to restrict what the recipient can do.

**S/MIME** uses digital certificates. You need a digital ID verified by a third party and installed on your computer. To encrypt, you need the recipient's public certificate. The recipient needs a mail app that supports S/MIME and the private key that matches. Without that key, the message is unreadable text. A digital signature alone proves who sent a message and that it wasn't changed, and Microsoft notes that inserting a signature also encrypts the message.

Which to pick? For most people sending to customers or partners, Purview Message Encryption is simpler because nobody needs a certificate. S/MIME fits companies that already run a certificate process. Plain TLS between mail servers is a third thing: it encrypts the connection, not the message. Microsoft's personal-subscription article calls this the default, "No permission set", which uses opportunistic TLS and doesn't keep the message encrypted after it reaches the recipient's provider.

## How to encrypt an email in new Outlook for Windows

These steps come from Microsoft's page on [sending S/MIME or Purview encrypted emails](https://support.microsoft.com/en-us/outlook/mail/send-s-mime-or-microsoft-purview-encrypted-emails-in-outlook).

### With Purview Message Encryption

1. Write your message.
2. Select **Options**, then **Encrypt**.
3. Choose a restriction, such as **Encrypt** or **Do Not Forward**.
4. Finish the message and select **Send**.

Microsoft says Purview requires an Office 365 Enterprise E3 license on your email server, and otherwise points you to S/MIME. Its Message Encryption FAQ lists more plans (see the licensing section below). One more detail from the same page: don't apply S/MIME to a message already protected by Purview. Remove any S/MIME signing or encryption first.

### With S/MIME for one message

1. In the message, select **Options**, then **More Options**.
2. Under **Message options**, select **Encrypt this message (S/MIME)**. You can also choose **Digitally sign this message (S/MIME)**. A receipt request needs the digital signature option.
3. Select **OK**.
4. If Outlook can't verify that all recipients can decrypt the message, a warning appears. You can send anyway, remove those recipients or retry the check.
5. Select **Send**.

For external recipients, you have to install their certificate on your computer first.

### With S/MIME for every message

Go to **Settings**, **Mail**, **S/MIME**. Select **Encrypt contents and attachment for all messages I send**, and optionally **Add a digital signature to all messages I send** and **Automatically choose the best certificate for digital signing**. This applies to new messages, replies and forwards. Microsoft's S/MIME setup page adds that new Outlook doesn't import certificates automatically, so install the digital ID manually or have your admin deploy it by policy. If an option is grayed out, your admin disabled it.

## Classic Outlook, web and Mac

**Classic Outlook for Windows.** The path that works is **Options**, then **Encrypt**, then **Encrypt** or **Do Not Forward**. Microsoft documents a known problem with an older route: in a certain update of Microsoft 365 Apps (Current Channel version 2511), encrypting through **File**, **Encrypt** left classic Outlook recipients unable to open Encrypt Only messages. Their reading pane said the message with restricted permission could not be viewed, and an attachment called message_v2.rpmsg appeared. Microsoft lists this as fixed in later builds. Its advice: update Microsoft 365 Apps and use **Options**, **Encrypt**.

**Outlook on the web.** Microsoft's FAQ lists Outlook on the web as a client that can create protected messages. The exact menu path isn't on the pages I opened. Look for the **Encrypt** command in the options of the compose window, and if it's missing, treat that as a license or admin question, not a bug.

**Outlook for Mac.** Microsoft's Mac article describes S/MIME and doesn't describe a Purview button.

1. Choose **Outlook**, then **Accounts**. Select the account, then **Security**.
2. Under **Certificate**, select your certificate. Only certificates in your Mac keychain that are valid for signing or encryption appear.
3. Choose **OK** and close the Accounts dialog.
4. In a new message, choose **See more items** (the ellipsis), then **S/MIME**, then **Encrypt with S/MIME**. If S/MIME isn't listed, add it to the toolbar with **Customizable Toolbar**.

You also need a copy of each recipient's certificate saved with their contact in Outlook. If the recipient is in your Exchange global address list, the certificate is published there and available automatically. The article applies to Outlook for Microsoft 365 for Mac, Outlook 2024 for Mac and Outlook 2021 for Mac. It doesn't give Mac steps for Purview Message Encryption.

## Encrypting with a Microsoft 365 Personal or Family plan

A popular claim says consumer plans can't encrypt at all. Microsoft's own article says otherwise. In [its page for personal and family subscriptions](https://support.microsoft.com/en-us/outlook/send-encrypted-messages-with-a-microsoft-365-personal-or-family-subscription), sending encrypted mail is covered for Outlook.com and new Outlook for Windows. The steps:

1. Compose a new message.
2. Select the **Options** ribbon.
3. Select **Encrypt**, then choose **Encrypt** or **Do Not Forward**.
4. To remove encryption, select **No permission set**.

The options behave like this, according to Microsoft:

- **Do Not Forward.** The message stays encrypted within Microsoft 365 and can't be copied or forwarded. Word, Excel and PowerPoint attachments stay encrypted after download. PDFs and images can be downloaded unencrypted.
- **Encrypt.** The message stays encrypted within Microsoft 365. Recipients with Outlook.com or Microsoft 365 accounts can download attachments unencrypted.
- **No permission set.** The default, with TLS only.

Recipients can read these messages in new Outlook, Outlook for Mac, Outlook.com or the Outlook mobile app. People on third-party mail apps get an email with instructions and sign in with a Microsoft account. Google and Yahoo users can sign in with that account or use a temporary passcode, and users on other providers, Microsoft names Comcast and AOL as examples, use a temporary passcode sent by email. Attachments can be viewed in the browser through the Office Message Encryption portal.

## What your recipient sees

Tell people to expect something unusual. A recipient on Gmail won't see your message in their inbox like a normal one. They see a notice with a link, sign in or enter a passcode, and read your message in a browser.

Microsoft's FAQ on [Message Encryption](https://learn.microsoft.com/en-us/purview/ome-faq) adds some useful details.

- Internal and external recipients can receive encrypted mail in Outlook for Windows, Outlook for Mac, Outlook on the web, Outlook for Android and Outlook for iOS, or through a web portal, regardless of organization. The portal needs no separate download.
- Size limits differ by page. The Message Encryption FAQ names 25 MB including attachments, while Microsoft's Exchange Online limits page lists 100 MB for Purview Message Encryption and 25 MB for the deprecated OME. Check the [Exchange Online limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits) page for the current value before you send a large file.
- Any file type can be attached, but protection applies only to supported formats. Office formats such as docx, xlsx and pptx are encrypted by default. The old 97-2003 formats aren't supported. PDF encryption is off by default and an admin turns it on with `Set-IRMConfiguration -EnablePdfEncryption $true`.
- SharePoint and OneDrive cloud attachments aren't supported. Only the mail message is encrypted.
- Recipients can keep signing in to the portal as long as the sender's organization is active and the mail isn't set to expire.

If the passcode email doesn't arrive, Microsoft suggests checking the junk folder, because DKIM and DMARC settings can cause these emails to be filtered as spam, and checking quarantine in the Microsoft Purview portal, since first-time passcode messages are often quarantined. Give recipients a heads-up before you send the first one.

## Licensing: why the button may be missing

If you can't find Encrypt, go through these checks in order.

1. **Which Outlook is it?** Personal and Family subscribers have documented support in Outlook.com and new Outlook for Windows. Other versions may show different options.
2. **Which subscription?** For work or school accounts, the Message Encryption FAQ lists Office 365 Enterprise E3 and E5, Microsoft 365 Enterprise E3 and E5, Microsoft 365 Business Premium, Office 365 A1, A3 and A5, and Office 365 Government G3 and G5 as included. Azure Information Protection Plan 1 can be added to Exchange Plan 1, Exchange Plan 2, Office 365 F3, Microsoft 365 Business Basic, Microsoft 365 Business Standard or Office 365 Enterprise E1. Each user who benefits needs a message encryption license.
3. **Is the tenant ready?** The FAQ says AD RMS must be migrated to Azure Information Protection first. [Exchange Online](https://www.m365.fm/entity/exchange-online/) with AD RMS can't enable these capabilities.
4. **Did the admin change something?** Microsoft's pages show options grayed out by policy for S/MIME, so ask IT whether encryption is controlled centrally.

Admins often prefer to take the decision away from users with [sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/) in [Microsoft Purview](https://www.m365.fm/entity/purview/). Microsoft notes that a label alone does not restrict what recipients can do. Pair a label with encryption or IRM for that.

## Common mistakes

- **Sending to the wrong person.** Encryption protects the content from outsiders, not from a typo in the To line. Check the recipients first.
- **Expecting Encrypt to stop forwarding.** Use Do Not Forward for that, and remember Microsoft says PDFs and images can still be downloaded unencrypted.
- **Trusting File, Encrypt in an affected build.** Use Options, Encrypt, and update Microsoft 365 Apps.
- **Applying S/MIME on top of Purview.** Microsoft says to remove the S/MIME signing or encryption first.
- **Attaching a large or unsupported file.** Check the size limit first, and remember that SharePoint or OneDrive links aren't covered by the message encryption.
- **Not telling the recipient.** The first encrypted mail looks like a phishing email to many people. Send a short heads-up through another channel.

## Related topics to explore

- **Why the Encrypt button is missing.** Start with the subscription and the Outlook version, then involve your admin.
- **S/MIME setup and certificates.** Learn where your company gets digital IDs and who deploys them.
- **Sensitivity labels that encrypt automatically.** Admins can apply encryption by label, so users don't have to choose.
- **How recipients open protected messages.** Test one message to a Gmail address and one to an Outlook address so you know both experiences.

## Next step

Send a test message to yourself at a personal address. Use Options, Encrypt, Do Not Forward, and open it the way a customer would. Once you've seen how to encrypt email in Outlook from the recipient's side, you'll know what to explain before you send anything sensitive.
