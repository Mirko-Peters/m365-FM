---
title: "Fix NDR 550 4.4.7 Message Expired in Exchange Online"
summary: "NDR 550 4.4.7 QUEUE.Expired means Exchange Online retried delivery for 24 hours and gave up. See the causes, what senders can do, admin checks for SPF, hybrid and domain status, and the AmbiguousRecipient variant."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [exchange-online, spf]
keypoints:
  - "A 550 4.4.7 NDR means Exchange Online retried delivery for 24 hours and the message then expired in the queue."
  - "Causes listed: destination server offline or unreachable, server refuses the message, network timeout, or a missing or wrong MX record."
  - "If only one destination domain fails, the problem is likely at that domain, and the recipient should pass the NDR to their admins."
  - "Admins test outbound mail with the Outbound SMTP Email test in the Microsoft Remote Connectivity Analyzer, then check SPF, domain expiry and hybrid configuration."
  - "The variant with AmbiguousRecipientTransientException points to duplicate mail-enabled objects or conflicting proxy addresses."
faq:
  - q: "What does NDR 550 4.4.7 mean?"
    a: "Microsoft Learn describes it as a persistent transient failure. The destination server was unable or unwilling to accept the message, Exchange Online retried delivery over 24 hours, and only after 24 hours of unsuccessful attempts does the sender get this NDR. The diagnostic text reads QUEUE.Expired; message expired."
  - q: "What should the sender do first?"
    a: "Learn says to check whether the error occurs only for messages to one specific domain. If so, the problem is likely with that destination domain. The sender should notify the recipient by another channel and pass on the server name, the returned error message and a copy of the NDR so their email admins can investigate."
  - q: "How does an admin test whether the problem is on the sending side?"
    a: "Learn lists four solutions: run the Outbound SMTP Email test in the Microsoft Remote Connectivity Analyzer, check that the SPF record includes all email sources, verify with your registrar that the domain has not expired, and in hybrid deployments check the hybrid configuration and rerun the Hybrid Configuration Wizard if IP addresses or firewall rules changed."
  - q: "What is the AmbiguousRecipientTransientException variant?"
    a: "Learn says that a 4.4.7 NDR with Transient Failure during recipients lookup AmbiguousRecipientTransientException means Exchange Online could not uniquely resolve the recipient object because several directory objects matched. Listed causes include duplicate mail-enabled objects, hybrid sync problems with overlapping proxy addresses, conflicting proxy addresses and temporary directory inconsistency."
  - q: "Where does the NDR appear and what does it say to the user?"
    a: "The user section says the server tried to deliver the message but cannot, stops trying, and advises trying again and contacting the help desk if the problem continues. The admin diagnostic section includes QUEUE.Expired and may include a proxy session setup failure line with a 451 4.4.0 code."
---

NDR 550 4.4.7 means Exchange Online could not deliver a message, kept retrying for 24 hours, and then let it expire in the queue. The destination server was unavailable, refused the message, timed out, or the destination DNS records are wrong. Start by checking whether only one recipient domain is affected. Then work through the admin checks below. This guide follows the Microsoft Learn article for this NDR.

## What the error means

Learn describes 4.4.7 as a persistent transient failure. When the destination server cannot or will not accept a message, it can return a temporary 4.x.x code rather than a permanent 5.x.x rejection. Exchange Online then tries repeatedly over 24 hours. Only after 24 hours of failed attempts does the sender receive this NDR.

The NDR can contain:

- User section: the server tried to deliver the message but cannot, and it stops trying. Try sending again, and if the problem continues, contact your help desk.
- Admin diagnostic section: `#550 4.4.7 QUEUE.Expired; message expired ##`. Learn explains this as the rejecting system considering the message too old, either because it stayed on that host too long or because the time-to-live set by the sender was exceeded.
- Possibly: `450 4.7.0 Proxy session setup failed on Frontend with '451 4.4.0 Primary target IP address responded with ...`. Learn says to record the error that follows this string and the last endpoint attempted.

## Causes listed by Microsoft

- The destination email server is offline or unreachable.
- The server will not accept delivery of the message.
- A network problem causes delivery to time out.
- An incorrect DNS record for the destination domain, for example a missing or wrong MX record.

## If you are the sender

Learn says to look at the pattern. If you get the error only for messages to one domain, such as only recipients at one company, the problem is likely with that destination domain. Examples it gives:

- Temporary network or internet problems in the destination domain.
- An incorrect DNS record, such as a missing or incorrect MX record.
- Aggressive anti-spam settings that block legitimate senders, for example all senders from any domain in Exchange Online.

Tell the recipient through another channel (phone, in person) and give them the name of the mail server in the NDR, the error message the server returned and a copy of the NDR. Their email admins need to investigate. Possible fixes on their side, per Learn: stop blocking messages from Exchange Online or allow senders from your domain, and check that MX and other DNS records are configured properly. They can test the MX record with the **Outbound SMTP Email** test in the Microsoft Remote Connectivity Analyzer.

## If you are the email admin

If the destination admins say the problem is not on their side, look at your own Exchange Online organization and, in a hybrid deployment, your on-premises Exchange. Learn lists four solutions in this order:

1. **Test outbound mail** with the **Outbound SMTP Email** test in the Microsoft Remote Connectivity Analyzer.
2. **Check SPF.** The SPF record for your domain might be incomplete and might not include all email sources. Learn links to its article on setting up SPF to help prevent spoofing.
3. **Check the domain.** Your domain might have expired because of non-payment. Verify with your registrar that it is active.
4. **Check the hybrid configuration** if the recipient is on-premises. Give the NDR information to your on-premises Exchange administrators. They might need to rerun the Hybrid Configuration Wizard because of changes to on-premises IP addresses or firewall rules.

Learn also links to an article on transport routing in Exchange hybrid deployments.

## The AmbiguousRecipientTransientException variant

One 4.4.7 variant carries the text **Transient Failure during recipients lookup AmbiguousRecipientTransientException**. Learn says this means Exchange Online could not uniquely resolve the recipient object. It found multiple possible directory objects for the same recipient and treats this ambiguity as a transient condition.

Common causes listed:

- **Duplicate mail-enabled objects** in Entra ID or Exchange Online: a mailbox and a mail user with the same SMTP address, a mailbox and a mail contact with the same proxy address, or duplicate mail users or guest users created during migration.
- **Hybrid directory synchronization issues**, such as an object that exists on-premises and in Exchange Online with overlapping proxy addresses.
- **Duplicate or conflicting proxy addresses**: the same SMTP address on several recipients, or X500, SIP or other proxy address conflicts in some scenarios.
- **Temporary directory inconsistency**, where recent recipient changes have not fully propagated.

The page lists causes but not a command sequence for finding duplicates. My suggestion, not Microsoft's: search your recipients for the SMTP address in the NDR and check that exactly one object owns it.

## A working order

This order is my own, built from the Learn page.

1. Read the NDR. Is it plain QUEUE.Expired, a proxy session failure, or the ambiguous recipient text?
2. Is it one domain or many? One domain points to the destination side.
3. For many domains, run the Remote Connectivity Analyzer test, then check SPF and domain status.
4. For hybrid recipients, involve the on-premises team early.
5. For the ambiguous recipient text, check for duplicate objects and proxy addresses.
6. Keep the full NDR. Learn tells you to record the error after the proxy session string and the last endpoint.

## What the page does not tell you

The article does not give time limits other than the 24-hour retry window, and it does not say how long directory changes take to propagate. I do not give any numbers for that.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [SPF](https://www.m365.fm/entity/spf/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Fix NDR error 550 4.4.7 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-4-4-7-in-exchange-online)
