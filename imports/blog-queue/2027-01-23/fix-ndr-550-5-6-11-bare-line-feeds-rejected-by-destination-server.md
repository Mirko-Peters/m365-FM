---
title: "Fix NDR 550 5.6.11: Bare Line Feeds Rejected by the Destination Server"
summary: "NDR 550 5.6.11 means your message contained bare line feeds and the destination server does not support SMTP chunking with the BDAT command. What a bare line feed is, why Microsoft 365 no longer strips them, and the sender and recipient admin fixes from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [exchange-online, outlook-web, exchange-server]
keypoints:
  - "5.6.11 means the message contains bare line feeds and the destination email server does not support messages with them."
  - "A bare line feed is an LF character not immediately preceded by a CR. Email lines should end with CR LF."
  - "Messages with bare line feeds need SMTP Chunking and the BDAT command from RFC 3030. A destination without BDAT cannot accept them."
  - "Sender fixes: use a different email program such as Outlook on the web, or send without the attachment."
  - "The recipient admin can disable bare line feed rejection, for example BareLinefeedRejectionEnabled false on an Exchange Server Receive connector, or move to a server that supports BDAT."
faq:
  - q: "What does NDR 550 5.6.11 mean?"
    a: "Microsoft Learn says you get this bounce because your message contains bare line feeds and the destination email server does not support messages with bare line feeds. The NDR is also called a bounce message, delivery status notification or DSN."
  - q: "What is a bare line feed?"
    a: "A line feed character (LF, ASCII 10) that is not immediately preceded by a carriage return (CR, ASCII 13). The line separator in an email message is supposed to be CR LF. With a bare line feed, a line ends with only LF."
  - q: "Why does the destination server need BDAT?"
    a: "If a message contains bare line feeds, the SMTP Chunking feature is required to move it between email servers. Chunking uses the SMTP BDAT command defined in RFC 3030. A destination server that does not support BDAT cannot accept such messages. Learn says most modern servers support BDAT, but some free and older ones do not."
  - q: "What can the sender try?"
    a: "Send the message with a different email program that does not add bare line feeds, such as Outlook on the web. If the original message had an attachment, try sending it without the attachment. If neither helps, contact your email admin and point them to the Learn page."
  - q: "What can the recipient's admin do?"
    a: "Two solutions are listed. Disable bare line feed rejection on the destination server if it supports that, for example set BareLinefeedRejectionEnabled to false on the Exchange Server Receive connector used for internet mail. Or upgrade to a newer version, or different server software, that supports the SMTP BDAT command."
---

The Microsoft Learn page on NDR 550 5.6.11 says your message contained bare line feeds, and the destination email server does not support messages with them. This article explains what that means, who can fix it, and what each side can try.

## What the bounce says

The page describes the NDR (also called a bounce message, delivery status notification or DSN) as the result of a message that contains bare line feeds sent to a server that cannot accept them.

## What a bare line feed is

- A **line feed** is the LF character (ASCII 10). A **carriage return** is CR (ASCII 13).
- Each line in an email message normally ends with CR followed by LF.
- A **bare line feed** is an LF that is not immediately preceded by a CR. The line ends with only LF.

## Why the destination matters

According to Learn, a message with bare line feeds needs the SMTP Chunking feature to travel between email servers. Chunking uses the SMTP `BDAT` command defined in RFC 3030. If the destination server does not support BDAT, it cannot accept messages with bare line feeds. Most modern email servers support BDAT, but some free and older servers do not.

There is a history in the page. Microsoft 365 and Office 365 used to remove bare line feeds from messages, so delivery worked to older servers without SMTP Chunking and BDAT. To better support security standards, for example DomainKeys Identified Mail (DKIM), Office 365 no longer removes them. That is why a message that once reached an old server can now bounce.

## If you sent the message

Learn gives two things to try:

1. Send the message with a different email program that does not add bare line feeds, such as Outlook on the web.
2. If the message had an attachment, send it without the attachment.

If this does not fix it, contact your email admin and point them to the Learn page, so they can try to resolve it with the recipient side.

## If you are the recipient's email admin

The page says the **recipient's** email admin can fix the problem with one of two solutions.

### Solution 1: Stop rejecting bare line feeds

Some email servers allow you to disable bare line feed rejection. Learn's example: Receive connectors in Exchange Server support the `BareLinefeedRejectionEnabled` setting. If the recipient's server is Exchange, the admin could set `-BareLinefeedRejectionEnabled $false` on the Receive connector for internet mail. The page points to the `Set-ReceiveConnector` documentation for details. I did not read that article, so I give no further syntax here.

### Solution 2: Move to a server that supports BDAT

Upgrade the destination server to a newer version, or to different email server software, that supports the SMTP BDAT command.

## How to read the situation

This compact picture is assembled from the page. You can use it to explain the NDR to a user or to the other side:

| Element | What it is |
| --- | --- |
| Bare line feed | An LF without a CR before it, in a message that should use CR LF line endings |
| SMTP Chunking | The SMTP feature needed to transmit a message with bare line feeds between servers |
| BDAT | The SMTP command used by Chunking, defined in RFC 3030 |
| Destination without BDAT | Cannot accept the message, so the NDR with 5.6.11 is returned |
| Exchange Online | No longer removes bare line feeds, in support of standards such as DKIM |

Two consequences follow from this, in my reading. First, the same message can be delivered to a modern server and bounce from an older one, so a single recipient or domain can fail while others work. Second, the cause the page names is how the message's lines end, not its size or content. The page does not say why its two sender tips, another email program and no attachment, help. I assume they remove the source of the stray line feeds.

## Who owns the fix

The page puts the server-side fix on the recipient's email admin. My reading: an admin on the sending side cannot make the remote server accept the message, but can help the sender work around the problem and give the recipient's admin the facts.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Save the full NDR text and the recipient's domain before the user deletes the message.
2. Ask the sender to try Outlook on the web, since the page names it as an example of a client that does not add bare line feeds.
3. Test whether the problem only occurs with one recipient domain. If so, it points to that domain's server.
4. Send the recipient's admin a short note: the code, the explanation of bare line feeds and BDAT, and the two solutions from the Learn page.
5. Do not remove bare line feeds with custom tooling on your side unless you have checked the effect on DKIM. Learn gives DKIM support as the reason Microsoft stopped removing them.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Outlook on the web](https://www.m365.fm/entity/outlook-web/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)

## Sources

- [Fix NDR error 550 5.6.11 in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-6-11-in-exchange-online)
