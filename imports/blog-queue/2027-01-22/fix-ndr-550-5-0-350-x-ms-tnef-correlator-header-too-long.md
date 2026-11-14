---
title: "Fix NDR 550 5.0.350 When the x-dg-ref Header Is Too Long in Exchange Online"
summary: "NDR 550 5.0.350 is a generic wrapper, but two phrases inside it have specific fixes: x-dg-ref header is too long (Rich Text with nested attached emails) and policy violation AS345 (20 or more embedded files). Sender and admin steps, plus the TNEF settings, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [exchange-online, outlook]
keypoints:
  - "5.0.350 is a generic wrapper for non-specific errors usually returned by the recipient's email organization. Read the rest of the NDR text."
  - "If it says x-dg-ref header is too long, switch Outlook messages from Rich Text Format to HTML."
  - "The cause: in Rich Text messages the attachment BLOB becomes part of the X-MS-TNEF-Correlator header, and a big attachment makes the line too long for the receiving server."
  - "If it says policy violation detected (AS345), remove some embedded files. Learn ties it to an attachment with 20 or more embedded files."
  - "Admins can control TNEF in remote domain settings and in mail contact or mail user properties. For other 5.0.350 errors, read the Diagnostic information for administrators."
faq:
  - q: "What does 550 5.0.350 mean?"
    a: "Microsoft Learn calls 5.0.350 a generic wrapper that Exchange Online uses for a wide variety of non-specific errors that are typically returned by the recipient's email organization. It is the extra text in the NDR that tells you whether one of the two documented specific fixes applies."
  - q: "How do I fix the x-dg-ref header is too long error?"
    a: "Use HTML formatting for messages in Outlook instead of Rich Text Format. Learn says the issue occurs if you use Rich Text formatting. The message likely contains at least one attachment, and one attachment is likely an email message that itself contains at least one attached email message."
  - q: "Why does Rich Text cause a long header?"
    a: "In Rich Text formatted messages, the attachment's binary large object becomes part of the header stream in the X-MS-TNEF-Correlator header field. If the attachment is too big, the header line is too long and the receiving email server rejects the message."
  - q: "What does the AS345 policy violation message mean?"
    a: "If the NDR contains Requested action not taken: policy violation detected (AS345), Learn says the message has an attachment, for example a Word file, with 20 or more embedded files such as Excel or Word files. The fix for the sender is to remove some embedded files from the attachment."
  - q: "What can an admin change?"
    a: "In Exchange Online you can control TNEF settings in remote domains and in the properties of mail contacts or mail users. The message format page says remote domain settings override per-user settings. For other 5.0.350 errors Learn says support usually cannot help, because the problem lies with the recipient's system, and points you to the Diagnostic information for administrators section of the bounce."
---

The NDR code 550 5.0.350 is a generic wrapper. Microsoft Learn says Exchange Online uses it for a wide variety of non-specific errors that are typically returned by the recipient's email organization. Two phrases inside the NDR point to specific fixes, so read the whole bounce text before you do anything.

## Which text does your NDR contain?

| Text in the NDR | What it points to | Fix |
| --- | --- | --- |
| `x-dg-ref header is too long` | Rich Text formatting with nested attached emails | Send in HTML format |
| `Requested action not taken: policy violation detected (AS345)` | An attachment with 20 or more embedded files | Remove some embedded files |
| Neither | A generic error from the recipient side | Forward the NDR to your admin |

## Case 1: x-dg-ref header is too long

### What causes it

Learn says the issue occurs if you use Rich Text formatting in Outlook messages. The message likely has at least one attachment, and one attachment is likely an email message that also contains at least one attached email message.

The admin-level explanation: in Rich Text formatted messages, the attachment's binary large object (BLOB) becomes part of the header stream in the `X-MS-TNEF-Correlator` header field. If the attachment is too big, the line length of that header field is too long, and the receiving server rejects the message.

### Sender fix

Use **HTML** formatting for messages in Outlook instead of **Rich Text Format**. Learn links the Outlook article on changing the message format to HTML, Rich Text Format or plain text.

### Admin options

In Exchange Online you can control TNEF settings (also called Transport Neutral Encapsulation Format, Outlook Rich Text Format or Exchange Rich Text Format) in remote domains, and in the properties of mail contacts or mail users.

The Exchange Online page on message format and transmission gives the background:

- Message format is how the user writes the message: plain text, HTML or rich text. Outlook offers all three. Outlook on the web offers plain text and HTML, and can read but not send rich text.
- Transmission is how the message is sent to another system, with MIME or TNEF. All three formats can be sent with TNEF, while only HTML and plain text can be sent with MIME.
- A TNEF message holds a plain text version and an attachment packaging the original formatted version, typically named Winmail.dat. Clients that do not understand TNEF may show that attachment.
- Admin settings override user settings. Remote domain settings control the format of messages to a specific external domain or to all external domains, and override per-user settings set by admins or users. Per-recipient settings on mail users and mail contacts override the settings a user sets for that recipient.
- In Outlook, users can control whether TNEF messages go to remote recipients, in the Internet message format and Internet recipient message format options. These do not apply to recipients inside the Exchange Online organization.

The page links to remote domain and mail contact articles for the exact settings, and I did not read those, so I list no cmdlet parameters here.

## Case 2: AS345 policy violation

Learn says this happens when a message has an attachment, for example a Word file, with 20 or more embedded files, such as Excel or Word files. The sender should remove some embedded files from the attachment. Learn gives no admin-side setting for it.

## Case 3: Other 5.0.350 errors

For other 5.0.350 errors Learn says typically there is nothing support can do, since the problem lies with the recipient's email system. The **Diagnostic information for administrators** section of the bounce contains the original error message from the external server or service when Microsoft 365 tried to send the message. Use it to identify the issue and to see whether you can fix anything.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Copy the full NDR text, including the diagnostic section, before the user deletes it.
2. Check for the two phrases above. If one is there, fix the sender side first.
3. For the header case, ask whether the user forwards emails as attachments inside other emails. That nesting is the pattern Learn describes.
4. If the problem repeats for one external domain, look at the remote domain TNEF setting for that domain instead of changing every user.
5. For a generic case, contact the recipient's admin with the diagnostic text.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Fix NDR error 550 5.0.350 in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-0-350-in-exchange-online)
- [Message format and transmission in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/message-format-and-transmission)
