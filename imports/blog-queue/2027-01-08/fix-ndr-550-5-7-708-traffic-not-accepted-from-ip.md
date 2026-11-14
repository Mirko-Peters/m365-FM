---
title: "Fix NDR 550 5.7.708 Access Denied, Traffic Not Accepted From This IP Address"
summary: "What NDR 550 5.7.708 means in Exchange Online according to Microsoft Learn: low IP reputation, higher risk for new and trial tenants, who can fix it, the support route, and how it differs from 5.7.703, 5.7.705 and 5.7.750."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [exchange-online]
keypoints:
  - "Learn says 5.7.708 is generated when you send mail from an IP address with a low reputation. New customers, such as Microsoft 365 trial tenants, are more likely to be affected."
  - "Only an email admin can fix it. For a trial, Learn says to contact Microsoft Support to request an IP address exception until you assign Exchange Online licenses."
  - "The page does not explain how reputation is determined or how to check it, and it gives no steps for non-trial cases beyond contacting support."
  - "The same Learn page covers 5.7.703 (Tenant Allow/Block List), 5.7.705 (tenant exceeded a spam threshold) and 5.7.750 (typically a large volume sent from a domain that is not an accepted domain)."
  - "Community Q&A threads about 5.7.708 were not used, because they are not Microsoft statements."
faq:
  - q: "What does 5.7.708 mean?"
    a: "Microsoft Learn says the NDR is generated if you send an email message from an IP address that has a low reputation. The error text is Access denied, traffic not accepted from this IP."
  - q: "Who is most likely to see it?"
    a: "New customers, such as those with a Microsoft 365 trial subscription, are more likely to be affected, according to Learn."
  - q: "Who can fix it?"
    a: "Learn says only an email admin in your organization can fix this issue."
  - q: "What is the documented fix?"
    a: "If you are an email admin and receive the error during a trial subscription, contact Microsoft Support to request an IP address exception until you assign Exchange Online licenses."
  - q: "How is it different from 5.7.703 or 5.7.705?"
    a: "5.7.703 comes from the Tenant Allow/Block List, 5.7.705 means the tenant exceeded a spam or bulk threshold, and 5.7.750 is typically generated when a large volume of mail is sent from a domain that is not an accepted domain. 5.7.708 is tied to the reputation of the sending IP."
---

NDR 550 5.7.708 tells the sender that Microsoft refused traffic from the sending IP address. The Microsoft Learn page on the NDR codes 550 5.7.703, 5.7.705, 5.7.708 and 5.7.750 explains it in a few lines: low IP reputation, a higher risk for new customers, and a fix that goes through Microsoft Support. This guide reports exactly that and then places it next to the other codes on the same page. Community Q&A threads on 5.7.708 exist, but they are not Microsoft statements, so they were not used.

## What the page says

- **Error text:** 5.7.708 Access denied, traffic not accepted from this IP.
- **Cause:** the NDR is generated if you send an email message from an IP address with a low reputation. The issue is more likely to affect new customers, such as those with a Microsoft 365 trial subscription.
- **Who can fix it:** only an email admin in your organization.
- **Fix:** if you are an email admin and receive this error during a trial subscription, contact Microsoft Support to request an IP address exception until you assign Exchange Online licenses.

That is all the page says about this code. It does not name related codes for 5.7.708.

## What this means in practice

The statements below are interpretation, not Learn text.

- A regular user who sees the NDR cannot fix it. The page says an admin must act.
- If the tenant is new or on a trial, the documented path is a support request for an IP exception.
- The page implies that assigning Exchange Online licenses ends the need for the exception, but it does not say so directly.

## Compare with the neighbors on the same page

The page covers only four codes: 5.7.703, 5.7.705, 5.7.708 and 5.7.750. The page says that for 5.7.705 and 5.7.750 you contact Microsoft Support after you address the underlying cause.

| Code | Cause per Learn | Action per Learn |
| --- | --- | --- |
| 5.7.703 | A user in your organization sends mail to an address or domain that the Tenant Allow/Block List blocks. If one recipient or domain is blocked, all other internal and external recipients in the message are also blocked | Only an email admin can change the Tenant Allow/Block List |
| 5.7.705 | Access denied, tenant has exceeded threshold. Causes include a compromised on-premises server routing mail to Exchange Online or a compromised admin account creating connectors | Fix the cause, then contact Microsoft Support to remove the block |
| 5.7.708 | Low reputation of the sending IP address | Admin contacts Microsoft Support for an IP exception during a trial |
| 5.7.750 | Typically a large volume of mail sent from a domain that is not an accepted domain. Microsoft 365 allows only a certain amount of mail from an unregistered domain. A less common cause is incorrectly configured connectors. Error text: Client blocked from sending from unregistered domain | Add and validate all sending domains in Microsoft 365 (the most common solution), use a certificate-based outbound connector whose certificate domain is accepted and validated, and look for unusual connectors and compromised accounts. Then contact Microsoft Support to have the block removed |

For 5.7.705 the page also says an expired subscription that is being renewed may block sending for no longer than one day, and it calls this rare.

The first step in any of these cases is to read the exact code in the NDR, because the fixes differ.

## What the page does not say

- How low reputation is determined, or how an admin can check the IP reputation.
- What information Microsoft Support needs for an IP exception, or how long it lasts.
- Guidance for 5.7.708 outside a trial, beyond contacting support.
- Any related codes for 5.7.708, or the longer status codes that some NDRs show.
- Whether the exception ends automatically once licenses are assigned.

## A response outline

This outline is my advice, built on the page.

1. Read the full NDR and confirm the code is 5.7.708.
2. Ask who the email admin is. Only that person can act.
3. Check whether the tenant is new or on a trial.
4. If it is a trial, open a support request for an IP address exception and say that you are sending during the trial.
5. If it is not a trial, open a support request and state what the NDR says. The page gives no other route.
6. Check that the NDR is not 5.7.703, 5.7.705 or 5.7.750, which need different fixes.

## Typical mistakes (my advice)

- Treating 5.7.708 as a recipient problem. It concerns the sending IP.
- Asking users to retry repeatedly instead of involving the admin.
- Mixing it up with 5.7.703 and deleting block entries that were not the cause.
- Relying on community threads as if they were official guidance.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Fix NDR error codes 550 5.7.703, 550 5.7.705, 550 5.7.708, and 550 5.7.750 (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-codes-550-5-7-703-550-5-7-705-550-5-7-708-550-5-7-750)
