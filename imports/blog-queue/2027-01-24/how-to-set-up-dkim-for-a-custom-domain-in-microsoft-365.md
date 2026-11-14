---
title: "How to Set Up DKIM for a Custom Domain in Microsoft 365"
summary: "Step by step from Microsoft Learn: create the two selector CNAME records, enable DKIM in the Defender portal or Exchange Online PowerShell, verify the signature in message headers, rotate keys, disable signing and fix the usual DNS mistakes such as TXT instead of CNAME or a low TTL."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [dkim, custom-domain, exchange-online, defender-for-office-365]
keypoints:
  - "Custom domains need DKIM set up by you. The initial onmicrosoft.com domain is signed automatically."
  - "Create two CNAME records per domain or subdomain, selector1._domainkey and selector2._domainkey, with the exact target values from the Defender portal or Get-DkimSigningConfig."
  - "Enable signing in the Defender portal under Email authentication settings on the DKIM tab, or with Set-DkimSigningConfig -Enabled true after the CNAME records are detected."
  - "Key rotation takes four days (96 hours), and you cannot start another rotation while one is in progress."
  - "Always use CNAME and not TXT records for Microsoft 365. Learn recommends a TTL of at least 3600 seconds."
faq:
  - q: "Do I need to set up DKIM for the onmicrosoft.com domain?"
    a: "No. Learn says outbound messages from senders in the initial onmicrosoft.com domain are signed automatically by that domain. You can customize it, for example to generate new keys, but you do not need to do anything for signing to work."
  - q: "Which DNS records do I create for a custom domain?"
    a: "Two CNAME records per custom domain or subdomain. The hostnames are selector1._domainkey and selector2._domainkey. The target values come from the Defender portal or from Get-DkimSigningConfig, in the Selector1CNAME and Selector2CNAME properties. Learn says the example values on its page are for illustration only and you should not build them by hand."
  - q: "How long does key rotation take?"
    a: "Four days, which is 96 hours. Until then the existing key keeps signing. During the rotation you cannot start another one. Rotation is available only for domains with the toggle Enabled and the status Valid or CnameMissing."
  - q: "How do I check that DKIM works?"
    a: "Send a message from the DKIM-enabled domain to another email system such as outlook.com or gmail.com, then read the header. Look for the DKIM-Signature field with d= and s= values and for dkim=pass in Authentication-Results. Learn says not to test with AOL, and notes that no signature is added when sender and recipient are in the same domain or in domains of the same organization."
  - q: "The status stays CnameMissing. What should I check?"
    a: "Learn lists wrong hostname format with the domain appended twice, a TXT record instead of a CNAME, a target that does not match the generated value, and a trailing dot problem at some DNS providers. If the status is still CnameMissing after 48 hours, check the values with Get-DkimSigningConfig and confirm the records are in the correct DNS zone."
---

DKIM signs outbound mail so that the receiving system can check that the message was not changed on the way. For a custom domain in Microsoft 365 you have to turn that on, and it needs work in two places: the Microsoft Defender portal or PowerShell, and the DNS zone of your domain. This article follows the Microsoft Learn page on using DKIM in a custom domain and keeps to the steps it gives.

## What you need to know first

- **Initial domain only (for example contoso.onmicrosoft.com):** nothing to do. Outbound mail from senders in that domain is signed automatically.
- **Custom domains (for example contoso.com):** Learn says that currently no DKIM signing occurs for outbound mail from custom domains, so you need to configure it. A message needs to be signed by the domain in the From address. Learn also recommends DMARC, because DKIM passes DMARC validation only if the signing domain and the From address domain align.
- **Subdomains:** each subdomain that sends mail from Microsoft 365 needs its own DKIM configuration. For services you do not control, such as bulk mail services, Learn recommends a subdomain like marketing.contoso.com, so problems there do not affect the reputation of your main domain.
- **Parked domains:** for registered domains that are not used for email, Learn says not to publish DKIM records. A missing record prevents validation of forged mail from that domain.
- **DKIM alone is not enough.** Set up SPF and DMARC as part of your email authentication.

The domain must already be added to Microsoft 365. Learn adds that the main factor deciding when signing starts is the detection of the CNAME records in DNS.

## The CNAME records

Enabling DKIM for a custom domain generates two key pairs. The private keys that sign messages are not accessible. The CNAME records point to the public keys, and these records are called selectors. Only one selector is active at a time. The other is used only after a later key rotation.

The syntax for new custom domains:

```text
Hostname: selector1._domainkey
Points to: selector1-<CustomDomainWithDashes>._domainkey.<InitialDomainPrefix>.<DynamicPartitionCharacter>-v1.dkim.mail.microsoft

Hostname: selector2._domainkey
Points to: selector2-<CustomDomainWithDashes>._domainkey.<InitialDomainPrefix>.<DynamicPartitionCharacter>-v1.dkim.mail.microsoft
```

- `<CustomDomainWithDashes>`: the domain with periods replaced by dashes, so contoso.com becomes contoso-com.
- `<InitialDomainPrefix>`: the part of your onmicrosoft.com name before the suffix.
- `<DynamicPartitionCharacter>`: a character assigned by Microsoft, for example r or n. It is not configurable. Learn says it belongs to an updated record format for new custom domains introduced in May 2025. Existing custom domains and initial domains continue to use the old format, which points to selector1-contoso-com._domainkey.contoso.onmicrosoft.com. The old and new formats cannot coexist for the same selector.

Learn warns that the values in its article are for illustration only. Get your real values with:

```powershell
Get-DkimSigningConfig -Identity contoso.com | Format-List Name,Enabled,Status,Selector1CNAME,Selector2CNAME
```

## Enable DKIM in the Defender portal

The domain must appear on the **DKIM** tab with the toggle **Disabled** and the status **NoDKIMKeys**.

1. In https://security.microsoft.com go to **Email & collaboration** > **Policies & rules** > **Threat policies** > **Email authentication settings**, or open https://security.microsoft.com/authentication.
2. Select the **DKIM** tab.
3. In the row of the domain, try to slide the toggle from **Disabled** to **Enabled**.
4. A **Client error** dialog shows the required CNAME values. Select **OK**. The status of the domain is now **CnameMissing**.
5. Open the details flyout by selecting the row, and note the **Last checked date**. Copy the values from the **Publish CNAMEs** section.
6. At your domain registrar, create the two CNAME records. Learn says it takes a few minutes or longer for Microsoft 365 to detect them.
7. Return to the flyout and turn on **Sign messages for this domain with DKIM signatures**. A dialog says it may take several minutes to synchronize the change.
8. If the records are detected, the toggle is **Enabled**, the status is **Signing DKIM signatures for this domain**, **Rotate DKIM keys** is available and the **Last checked date** is newer.

## Enable DKIM with Exchange Online PowerShell

1. List the domains: `Get-DkimSigningConfig | Format-List Name,Enabled,Status,Selector1CNAME,Selector2CNAME`. To check that the domain is available, Learn says to run `Get-AcceptedDomain`.
2. If the domain is listed with Enabled False and the status NoDKIMKeys or CnameMissing, go to step 3. If it is not listed, create the configuration:

   ```powershell
   New-DkimSigningConfig -DomainName contoso.com -Enabled $false
   ```

   Optional parameters are `-BodyCanonicalization` and `-HeaderCanonicalization` (Relaxed, the default, or Simple) and `-KeySize` (1024, the default, or 2048). The status should then be CnameMissing.
3. Copy `Selector1CNAME` and `Selector2CNAME` and create the two CNAME records at the registrar.
4. After a while, enable signing:

   ```powershell
   Set-DkimSigningConfig -Identity contoso.com -Enabled $true
   ```

   If the records are not detected, you get an error that contains the CNAME values. Check for typos, wait longer and run the command again.
5. Run the list command again. Enabled should be True and Status should be Valid.

## Verify the signature

Wait a few minutes after any change. Then:

1. Send a message from the DKIM-enabled domain to a recipient in another system, for example outlook.com or gmail.com. Learn says not to use AOL, which might skip the DKIM check if SPF passes.
2. Open the message header, for example with Outlook or the Message Header Analyzer.
3. Find the **DKIM-Signature** header. The **d=** value is the signing domain, and **s=** is the selector.
4. Find **Authentication-Results**. It should contain dkim=pass or DKIM=OK.

No DKIM signature is added when sender and recipient are in the same domain or in different domains of the same organization. The header then shows dkim=none (message not signed). That is expected. There is also a DKIM test in Microsoft 365 help, which needs a Global Administrator account and is not available in GCC, GCC High, DoD or Office 365 operated by 21Vianet.

## Rotate and disable

For key rotation, Learn compares it to changing passwords periodically. Rotation takes four days (96 hours) until the new key signs, and you cannot start another one meanwhile. You can rotate only domains with the toggle Enabled and the status Valid or CnameMissing. In the portal select the domain and then **Rotate DKIM keys**. In PowerShell:

```powershell
Rotate-DkimSigningConfig -Identity contoso.com -KeySize 2048
```

Omit `-KeySize` to keep the bit depth. If you change from 1024 to 2048, it applies to the next active selector first, and the other selector gets 2048 at the next rotation. Learn notes there is currently no automatic rotation for the onmicrosoft.com domain.

To disable signing, slide the toggle to **Disabled**, or run `Set-DkimSigningConfig -Identity contoso.com -Enabled $false`.

## Fix common DNS mistakes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Hostname includes the full domain | CnameMissing | Enter only selector1._domainkey |
| Only selector1 created | Rotation fails | Create both CNAME records |
| TXT record instead of CNAME | CnameMissing | Delete the TXT, create a CNAME |
| TTL too low | Intermittent dkim=temperror | Use at least 3600 seconds |
| Wrong target format | CnameMissing | Use the exact values from Get-DkimSigningConfig |
| Trailing dot issue | Record exists but not detected | Follow your DNS provider's format |

To check propagation use `nslookup -type=CNAME selector1._domainkey.contoso.com` on Windows or `dig CNAME selector1._domainkey.contoso.com +short` on macOS and Linux. Learn says propagation can take from a few minutes to 48 hours. If DKIM passes but DMARC fails, make sure DKIM is configured for the exact domain in the From address. If DKIM fails after forwarding, Learn suggests configuring the intermediary as a trusted ARC sealer.

## Rollout checklist (my advice)

This is my suggestion, not an order from the page:

1. List every domain and subdomain that sends mail, including third-party senders, before you start.
2. Create the DNS records for both selectors in one change, with the TTL set as Learn recommends.
3. Start with one domain, send test messages, and read the headers before you do the others.
4. Add the rotation date to your calendar. The rotation itself needs no DNS change here, but test the signature again afterward.
5. Review SPF and DMARC for the same domain in the same project.

## Related

- [DomainKeys Identified Mail (DKIM)](https://www.m365.fm/entity/dkim/)
- [Custom domain in Microsoft 365](https://www.m365.fm/entity/custom-domain/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [How to use DKIM for email in your custom domain (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/email-authentication-dkim-configure)
