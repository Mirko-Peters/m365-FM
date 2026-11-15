---
title: "Fix NDR 550 5.1.0 Address Rejected and SPF Permanent Error in Exchange Online"
summary: "NDR 550 5.1.0 means the destination server will not accept your mail or mail for the recipient. Sender checks: block list, stale Auto-Complete entry. Admin check: the SPF record, with the SPF Learn rules on lookups, one record and syntax."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [exchange-online, spf, outlook]
keypoints:
  - "The destination server that generated 5.1.0 will not accept messages from you or for the recipient. It can block your address, your organization or all of Exchange Online."
  - "If other recipients in the same domain work, suspect the recipient's personal block list and contact the recipient by another channel."
  - "An invalid Auto-Complete (nickname cache) entry can cause it, for example after a recipient moved between on-premises Exchange and Exchange Online."
  - "For admins the page says the SPF record might be incomplete. The NDR may show Address Rejected and Recipient address rejected: SPF Permanent Error."
  - "The SPF page adds the rules: one record per domain, fewer than 10 DNS lookups, correct syntax, and no SPF changes in Microsoft 365 itself, only at your DNS host."
faq:
  - q: "What does 550 5.1.0 mean?"
    a: "According to the Learn page, the destination email server that generated the 5.1.0 error will not accept messages from you as sender or messages for the recipient. It can happen if your email address, your Exchange Online organization or even all of Exchange Online is blocked by the recipient."
  - q: "What should I check as the sender?"
    a: "First whether you are in the recipient's personal block list, which is likely if you can send to other recipients in the same domain. Contact the recipient by phone or in person. Second, remove a bad entry from your Auto-Complete list, since the identifiers behind a cached entry can change when a recipient moves between on-premises Exchange and Exchange Online."
  - q: "What does the NDR text look like?"
    a: "The page says the user information section may read Address Rejected, A problem occurred during the delivery of this message to this email address, and the diagnostic information for administrators may read Recipient address rejected: SPF Permanent Error."
  - q: "What should the email admin check?"
    a: "The page says the Sender Policy Framework record for your Exchange Online domain might be incomplete and might not include all sources of mail for the domain. It links the SPF setup article."
  - q: "Can I change SPF in the Microsoft 365 admin center?"
    a: "No. The SPF setup page says there are no admin portals or PowerShell cmdlets in Microsoft 365 to manage SPF records. You create the SPF TXT record at your domain registrar or DNS hosting service. The record for the onmicrosoft.com domain cannot be modified."
---

A bounce with 550 5.1.0 looks like a problem with the recipient's address, but the Microsoft Learn page on this code says something more specific: the destination server will not accept messages from you or for the recipient. This article follows that page for senders and for email admins, and adds the SPF rules from the Learn SPF setup page, because the admin part of the NDR points to SPF. The page is short, so I say where I add context and where the advice is mine.

## What the code means

The page explains that the destination email server that generated the 5.1.0 error will not accept messages from you (the sender) or messages for the recipient. This can happen when messages from your email address, your Exchange Online organization, or even all of Exchange Online are being blocked by the recipient.

The NDR from Exchange Online for this error might contain some or all of this information:

- **User information section:** Address Rejected. A problem occurred during the delivery of this message to this email address.
- **Diagnostic information for administrators:** Recipient address rejected: SPF Permanent Error.

Use the information in the NDR to decide which path below fits.

## For senders

### Check the recipient's block list

Your address could be in the recipient's personally maintained block list. The page says this is the likely cause if you can send successfully to other recipients in the same domain, for example another person at fabrikam.com. Contact the recipient by phone, in person or another channel, and ask them to confirm that your address is not in their block list.

### Remove bad Auto-Complete entries

You might have an invalid entry in your Auto-Complete list, also called the nickname cache, for the recipient. The page gives an example: the recipient moved from on-premises Exchange to Exchange Online, or the other way round. The address is the same, but other internal identifiers might have changed, and that breaks your cached entry.

**In Outlook:** the page links the Support article on managing suggested recipients with Auto-Complete, and the one on resending a message.

**In Outlook on the web, one recipient:**

1. Select **New mail**.
2. Start typing the name or address in the **To** field until the recipient appears in the list.
3. Use the arrow keys to select the recipient and press Delete.

**In Outlook on the web, all recipients:** the page says you can clear the list only in the light version of Outlook on the web. It describes two ways to reach that version, an older browser that supports only the light version, or a setting:

1. In Outlook on the web, select **Settings**.
2. In **Search all settings**, type light and select **Outlook on the web version**.
3. Select **Use the light version of Outlook on the web** and **Save**.
4. Sign out, close the browser and open the mailbox again.

Then in the light version: choose **Options**, check that **Messaging** is selected, and in the **E-Mail Name Resolution** section select **Clear Most Recent Recipients list**, then confirm with **OK**. Afterward clear the **Use the light version** check box under **Outlook version**, save, sign out and close the browser to return to the full version. The page names Internet Explorer 9 as an example of an older browser. My advice: use the setting, since Internet Explorer 9 is rarely available today.

If these steps do not help, the page says to contact your email admin and refer them to the article.

## For email admins: check SPF

The page says the Sender Policy Framework record for your Exchange Online domain might be incomplete and might not include all sources of mail for your domain. It links the SPF setup article. The rules below come from the current Learn SPF page listed in the sources.

### What SPF is for

SPF uses a TXT record in DNS to identify valid sources of mail for a domain. Receiving systems use it to check that mail from the envelope sender address (the MAIL FROM address) comes from a designated source for that domain.

### Rules from the SPF setup page

- **Where to change it:** there are no admin portals or PowerShell cmdlets in Microsoft 365 for SPF records. You create or edit the TXT record at your domain registrar or DNS host.
- **onmicrosoft.com:** if you use only the onmicrosoft.com domain for mail, the SPF record is already set up, and you cannot change it.
- **Microsoft 365 only:** the page's example for contoso.com with Microsoft 365 as the only source is `v=spf1 include:spf.protection.outlook.com -all`. For GCC High and DoD, and for 21Vianet, the page gives different include values.
- **Other sources:** on-premises servers are added with `ip4:` or `ip6:` values, and non-Microsoft services with their own `include:` value. For services you do not control, the page recommends a subdomain, so that their problems do not affect the reputation of your main domain.
- **One record per domain:** each domain or subdomain needs its own SPF record, and only one is allowed. Multiple SPF TXT records for the same name cause SPF to return a permanent error (permerror).
- **Lookup limit:** if validation needs more than 10 DNS lookups, SPF fails with a permerror. `include:`, `a`, `mx`, `exists` and `redirect` count, while `ip4:`, `ip6:` and `all` do not. Nested includes add lookups.
- **Syntax:** the page lists mistakes that make SPF fail, such as a trailing period after the domain, an equal sign instead of a colon after `include`, and a space after the colon.
- **TTL:** the page recommends a minimum TTL of 3600 seconds on SPF TXT records.
- **Enforcement:** the page recommends `-all` (hard fail) for Microsoft 365 domains, together with DKIM and DMARC.

The page also says not to flatten the Microsoft 365 include, since Microsoft's sending infrastructure uses dynamic IP addresses that change frequently.

## Connecting the NDR to these rules

The NDR text says SPF Permanent Error, and the SPF page says a permerror comes from things like multiple records, too many lookups, bad syntax or an include that does not resolve. The two pages do not say in so many words that these are the causes of this NDR, so treat the connection as my reading, not as a statement of Microsoft.

## Checking order (my advice)

This is my suggestion, not an order from the pages:

1. Read the NDR. If the admin section says SPF Permanent Error, go to the SPF check. If it only says Address Rejected, start with the sender checks.
2. Test with another recipient in the same domain. If it works, the recipient's block list is the first suspect.
3. For a recipient who moved between on-premises and Exchange Online, remove the Auto-Complete entry and type the address again.
4. For SPF, look up the TXT record of the sending domain and check: exactly one SPF record, the Microsoft 365 include is present, every other sender is listed, and the lookup count is under 10.
5. Make one DNS change at a time, and allow for the TTL before you test again.
6. Keep the NDR text and the time. If the problem remains, those details are what your support case needs.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Sender Policy Framework (SPF)](https://www.m365.fm/entity/spf/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Fix NDR error 550 5.1.0 in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-1-0-in-exchange-online)
- [Set up SPF to identify valid email sources for your Microsoft 365 domain (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/email-authentication-spf-configure)
