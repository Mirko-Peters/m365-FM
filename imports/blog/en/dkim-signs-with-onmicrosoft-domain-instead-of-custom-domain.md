---
title: "DKIM Signs With onmicrosoft.com Instead of Your Custom Domain: How to Fix It"
summary: "Mail from your custom domain carries a DKIM signature for the onmicrosoft.com domain, so DMARC alignment is weak. Publish the two CNAMEs, enable DKIM, verify the headers, and handle forwarding with ARC."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [exchange-online, dkim, dmarc, spf, email-spoofing]
keypoints:
  - "DMARC needs an aligned pass: the domain that signed the message must match the domain in the From address."
  - "For a custom domain you publish two CNAME records and then enable signing. The exact target values come from Get-DkimSigningConfig, not from a template."
  - "Test with a message to an external mailbox. Mail inside your own organization shows dkim=none and is not a valid test."
  - "Forwarding and gateways can break SPF and DKIM. Learn recommends trusted ARC sealers, and you add the vendor's signing domain, not your own."
faq:
  - q: "Why does my mail show d=yourtenant.onmicrosoft.com in the DKIM signature?"
    a: "In a Microsoft Q&A thread from October 2026, an independent advisor said this appears when DKIM is not configured and enabled for the custom domain. Microsoft Learn confirms that mail from the onmicrosoft.com domain is signed by that domain automatically and that custom domains need their own setup, but it does not describe what signature a custom-domain message gets before you enable DKIM."
  - q: "Do I need both DKIM CNAME records?"
    a: "Yes. Microsoft Learn says to create both selector1 and selector2 CNAME records, even though only one selector is active at a time. The second one is used when keys rotate."
  - q: "How long does it take until DKIM signing starts?"
    a: "Learn says detection of the CNAME records takes a few minutes or possibly longer, and public DNS propagation can take from a few minutes up to 48 hours depending on your DNS provider and TTL. If the status stays CnameMissing after 48 hours, compare the records with the values from Get-DkimSigningConfig."
  - q: "Can I test DKIM by sending to a colleague?"
    a: "Not reliably. Learn says that when sender and recipient are in the same organization the header reads dkim=none (message not signed). Send to an external mailbox such as outlook.com or gmail.com instead, and avoid AOL, which may skip the DKIM check when SPF passes."
---

A mail leaves your tenant with the From address on your custom domain. The DKIM-Signature header says `d=yourtenant.onmicrosoft.com`. A strict receiver may then see no aligned DKIM pass, and DMARC depends on SPF alone.

This pattern appeared in a Microsoft Q&A thread in October 2026. This article explains the fix with Microsoft Learn as the main source. It is a troubleshooting guide, not an official Microsoft procedure. The thread itself did not reach a confirmed solution, and I say below what stays open.

## What the thread reported

- A person who received mail from a Microsoft 365 tenant saw a DKIM signature for the onmicrosoft.com domain. The ARC results header in the same message showed `dkim=pass` for the custom domain and `dmarc=pass`. They asked why, and whether custom-domain DKIM should be set up differently.
- An AI-generated answer and an independent advisor said the same thing: the sender has to enable DKIM for the custom domain, otherwise Exchange Online signs with the onmicrosoft.com domain. The advisor noted that the documentation does not explain the ARC result and asked for the full headers.
- The person who asked then explained that they run a forwarding gateway, have no admin access to the sender's tenant, and that sender rewriting breaks SPF alignment. They asked what to do about forwarded mail.
- No answer was marked accepted, and nobody confirmed a fix. The difference between the signature and the ARC result stayed unexplained.

A second thread from February 2026 asked a simpler version: outgoing mail lands in junk or quarantine, and the person did not know where to find the SPF, DKIM and DMARC settings. It also ended without a confirmed fix, but its question is the reason Step 2 below gives the exact portal path.

## Symptoms

- `DKIM-Signature` shows `d=` with the onmicrosoft.com domain while the From address uses your domain.
- `Authentication-Results` shows `dmarc=fail` or relies on SPF only.
- Mail to strict receivers, or forwarded mail, is quarantined or rejected.
- In the Defender portal, DKIM for the custom domain is disabled, or the status shows `NoDKIMKeys` or `CnameMissing`.

## Step 1: Read the headers

Open the full headers of a message received outside your organization. Look at:

- `DKIM-Signature`: `d=` is the signing domain, `s=` is the selector.
- `Authentication-Results`: look for `dkim=pass` and for `dmarc=pass`, and which domain each result names.

Microsoft Learn explains why the signing domain matters. A message needs to be DKIM signed by the domain in the From address, and DKIM passes DMARC only if the signing domain and the From domain align.

## Step 2: Check the DKIM state of the custom domain

In the Microsoft Defender portal, go to **Email & collaboration**, **Policies & rules**, **Threat policies**, **Email authentication settings**, then the **DKIM** tab. The direct link is `https://security.microsoft.com/authentication?viewid=DKIM`.

Or use [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/):

```powershell
Get-AcceptedDomain
Get-DkimSigningConfig | Format-List Name,Enabled,Status,Selector1CNAME,Selector2CNAME
```

If the custom domain is disabled with `NoDKIMKeys`, there is no signing for it yet. Learn also says each sending subdomain needs its own DKIM configuration.

## Step 3: Publish both CNAME records

Learn gives this layout. Both records use the same host names for every tenant:

- Host `selector1._domainkey` points to `selector1-<CustomDomainWithDashes>._domainkey.<InitialDomainPrefix>.<DynamicPartitionCharacter>-v1.dkim.mail.microsoft`
- Host `selector2._domainkey` points to the same pattern with `selector2`

The dashes replace the dots of your domain. The partition character is assigned by Microsoft and is not configurable. Learn says this format applies to new custom domains since May 2025, and that existing domains may still use the older format that points to `<InitialDomainPrefix>.onmicrosoft.com`. The old and new formats cannot coexist for the same selector.

Because of this, do not copy values from an old guide. Use the `Selector1CNAME` and `Selector2CNAME` values that `Get-DkimSigningConfig` returns, or the values the portal shows after you try to enable the domain.

Practical points from Learn:

- Create both records, even though only one selector is active at a time.
- For Microsoft 365 use CNAME records. TXT records are for non-Microsoft systems.
- At GoDaddy, Azure DNS, Namecheap and Google, enter only the host name part. The zone is appended.
- At Cloudflare, set the record to **DNS only**, not proxied.
- At Amazon Route 53, add a trailing dot to the target.
- Keep the TTL at 3600 seconds or more. Learn warns that very low TTL values can cause `dkim=temperror` or `dkim=fail`.

Check that DNS answers:

```
nslookup -type=CNAME selector1._domainkey.<yourdomain>
nslookup -type=CNAME selector2._domainkey.<yourdomain>
```

## Step 4: Enable signing

**Portal.** On the DKIM tab, slide the toggle for the domain. Learn describes that a dialog with the CNAME values appears first, and the status becomes `CnameMissing` until Microsoft 365 detects the records. Then select the domain and turn on **Sign messages for this domain with DKIM signatures**. Success looks like this: the toggle is enabled, the status reads "Signing DKIM signatures for this domain", and the last checked date is recent.

**PowerShell.** After the CNAME records are detected:

```powershell
Set-DkimSigningConfig -Identity <yourdomain> -Enabled $true
```

If the records are not found, the command returns an error with the expected values. Check for typos, wait, and run it again. Learn lists `Enabled: True` and `Status: Valid` as the target state.

## Step 5: Allow time

Learn names these timings: the portal needs several minutes to synchronize, CNAME detection takes a few minutes or possibly longer, and DNS propagation takes a few minutes up to 48 hours depending on provider and TTL. If `CnameMissing` is still shown after 48 hours, compare your records with the `Get-DkimSigningConfig` values.

## Step 6: Verify with an external message

Send a test message to an outside mailbox, for example at outlook.com or gmail.com. Then check:

- `DKIM-Signature` has `d=<yourdomain>`.
- `Authentication-Results` shows `dkim=pass` and `dmarc=pass`.

Learn warns that mail inside one organization shows `dkim=none (message not signed)`. A colleague in your own tenant is not a test. Learn also advises against AOL as a test target.

## Step 7: Understand the DMARC side

Learn's troubleshooting page says DMARC requires that SPF or DKIM passes and that the authenticated domain aligns with the From domain. At least one aligned pass is needed. For marketing or third-party senders, its fix is DKIM signing for the From domain, and optionally relaxed alignment (`adkim=r`) in the DMARC record. Learn recommends a separate subdomain for third-party bulk senders.

## Step 8: Forwarding and gateways

The second part of the thread is about forwarded mail. Learn says forwarded mail commonly fails SPF because the forwarder's IP is not in the sender's SPF record, and that DKIM may survive only if the body was not changed. Its recommendation for intermediaries is trusted ARC sealers, or Enhanced Filtering for Connectors.

For the receiving tenant:

1. In the Defender portal, open **Email authentication settings** and the **ARC** tab, then add the sealer's domain. Or use:

```powershell
Get-ArcConfig
Set-ArcConfig -Identity Default -ArcTrustedSealers "<sealer1>","<sealer2>"
```

`-ArcTrustedSealers` replaces the whole list, so include existing entries.

2. Use the vendor's signing domain. Find it in a test message: the `d=` value of the `ARC-Seal` header. Learn calls using your own domain a common mistake.
3. Allow up to 30 minutes, then test with new messages. Look for `arc=pass` and `compauth=pass reason=130`.

Learn also states that ARC only overrides DMARC failures. It does not bypass spam filtering, bulk filtering or mail flow rules, and each trusted sealer is a risk if the vendor is compromised.

A receiver cannot fix the sender's missing DKIM. The sender must enable it on their own tenant. That is the part the person in the thread could not do.

## Limits and open points

- Learn says mail from the onmicrosoft.com domain is signed by that domain automatically. It does not say which signature a custom-domain message carries before you enable DKIM, so the thread's onmicrosoft.com signature is consistent with the advice but not described there.
- Nobody explained why the ARC result named the custom domain while the signature named the onmicrosoft.com domain. Full headers from both ends would be needed.
- Key rotation is separate. Learn says a rotation takes effect after four days and that there is no automatic rotation for the onmicrosoft.com domain.
- DKIM alone is not enough. Check SPF and your DMARC policy too.

## Related

- [DKIM](https://www.m365.fm/entity/dkim/)
- [DMARC](https://www.m365.fm/entity/dmarc/)
- [SPF](https://www.m365.fm/entity/spf/)
- [Email spoofing](https://www.m365.fm/entity/email-spoofing/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Microsoft Learn: How to use DKIM for email in your custom domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dkim-configure)
- [Microsoft Learn: Troubleshoot email authentication in Microsoft 365](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-troubleshoot)
- [Microsoft Learn: Configure trusted ARC sealers](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-arc-configure)
- [Microsoft Q&A: Exchange Online DKIM uses onmicrosoft.com instead of custom domain (October 2026)](https://learn.microsoft.com/en-us/answers/questions/6024551/exchange-online-dkim-uses-onmicrosoft-com-instead)
- [Microsoft Q&A: How do I fix email with DMARC, SPF and DKIM issues (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5782777/how-do-i-fix-email-with-dmarc-spf-and-dkim-issues)
