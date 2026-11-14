---
title: "How to Add a Custom Domain and TLS Certificate to a Power Pages Site"
summary: "Add a custom domain to a Power Pages site: prerequisites, the Power Platform admin center steps, CNAME and TXT records, the three certificate options, certificate requirements, renewal and change steps, and what the Learn page leaves out."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [power-pages, power-platform-admin-center]
keypoints:
  - "The site must be in production state, and only one custom domain can be added per website. You need a domain name, DNS access and a certificate unless you use a Microsoft-managed one."
  - "Path: Power Platform admin center > Resources > Power Pages sites > select the site > Manage > Site Details > Connect Custom Domain."
  - "A CNAME record to the Power Pages site URL is required. The hostname cannot be a root domain, and the CNAME must be publicly resolvable."
  - "Certificate options are a Microsoft-managed certificate (not available with CDN or WAF), an uploaded .pfx with specific requirements, or an existing certificate."
  - "The page names no admin roles and gives no DNS propagation times or TXT token lifetime."
faq:
  - q: "What do I need before I start?"
    a: "The website must be in production state. You need a domain name, DNS access at your domain provider and an SSL certificate unless you use a Microsoft-managed one. Only one custom domain can be added per website."
  - q: "Where do I add the domain?"
    a: "In the Power Platform admin center go to Resources > Power Pages sites, select the site, then Manage > Site Details > Connect Custom Domain."
  - q: "Which DNS records are needed?"
    a: "A CNAME record that points your hostname to the Power Pages site URL, which cannot use a root domain. For sites with CDN or WAF, also a TXT record with the name and value shown in the admin center."
  - q: "What are the certificate options?"
    a: "Add a Microsoft Managed certificate, upload a new .pfx certificate, or use an existing certificate. The Microsoft-managed option is not available if CDN or WAF is enabled."
  - q: "What must an uploaded certificate meet?"
    a: "A trusted CA signature, a password-protected PFX, a private key of at least 2,048 bits, all intermediate certificates, SHA2, TripleDES encryption (AES-256 is not supported) and Extended Key Usage for server authentication."
---

A Power Pages site starts on a Microsoft-provided address. A custom domain such as www.contoso.com needs a DNS record and a TLS certificate. This guide follows the Microsoft Learn page on adding a custom domain. The queue text names a different menu path, so this guide uses the path documented on the page.

## Prerequisites

- The website is in production state.
- You have a domain name, DNS access at your domain provider and an SSL certificate, unless you use a Microsoft-managed certificate.
- Only one custom domain can be added per website.
- The page refers to the admin roles needed for website administrative tasks but does not list them.

## Steps

1. In the Power Platform admin center go to **Resources** > **Power Pages sites**, select the site, then **Manage** > **Site Details** > **Connect Custom Domain**.
2. Under **Choose a SSL certificate** select **Add Microsoft Managed certificate**, **Upload a new certificate** (choose the .pfx file and enter the password) or **Use an existing certificate**.
3. Select **Next** and enter the **Host Name**, for example www.contoso.com.
4. Select **Next**. If the site uses a CDN or WAF, copy the record type, name and value from **Validate the domain** and create the TXT record.
5. Select **Next**, check that the custom host name matches the certificate subject, then select **Next** to create the SSL binding.
6. When the success message appears, select **Close**.

## DNS records

- **CNAME (required).** Point your hostname to the Power Pages site URL. You cannot use a root domain as the hostname. The CNAME must be publicly resolvable. Private or internal DNS zones make setup fail. Check with `nslookup -type=CNAME <hostname>` on Windows or `dig CNAME <hostname>` on macOS or Linux.
- **TXT (CDN or WAF sites only).** Create a TXT record named as shown, for example `_dnsauth.www`, with the displayed value. Delete any existing `asuid.<customDomain>` TXT record before binding. Token values expire and are regenerated, and an expired value does not pass validation, so copy the current value right before you create the record.

## Certificate options

- **Microsoft managed.** Provisioned, configured and renewed by Microsoft. Not available if CDN or WAF is enabled.
- **Bring your own .pfx.** Requirements: signed by a trusted certificate authority, password-protected PFX, private key of at least 2,048 bits, all intermediate certificates included, SHA2, TripleDES encryption (AES-256 is not supported) and Extended Key Usage for server authentication.
- **Azure Front Door sites.** Front Door creates its own TLS certificates with a six-month lifetime that renew automatically 45 days before expiry. Certificates you upload are different, and you manage their renewal.

## Timing

DNS records take some time to propagate. If you see an incorrect URL mapping error, retry later. Microsoft-managed certificates take a few minutes. The page gives no specific propagation time.

## Change, switch and renew

- **Change the domain.** Select the pencil icon next to the custom URL in Site Details, delete the SSL binding, the SSL certificate and the assigned hostname, then run the add steps again.
- **Switch certificate type.** Delete the existing binding and certificate, then configure again.
- **Renew an uploaded certificate.** Generate a new CSR, get the renewed .pfx from your CA, upload it with **New** in the **Edit Custom Domain** pane, delete the old binding and create a new one.

## What the page does not say

- The admin roles required.
- DNS propagation times and the lifetime of the TXT token.
- Whether the Microsoft-managed option is available on sites without CDN or WAF beyond the stated restriction.
- The renewal section refers to a Power Portals admin center with a different URL, which may be outdated.

## A setup outline

This outline is practical advice built on the page.

1. Confirm the site is in production state and pick a hostname that is not a root domain.
2. Create the CNAME record first and check it with nslookup or dig.
3. Choose the certificate option that matches whether the site uses CDN or WAF.
4. For TXT validation, copy the value only when you are ready to create the record.
5. Set a reminder for certificate renewal if you upload your own certificate.

## Typical mistakes

- Using a root domain as the hostname.
- Pointing a CNAME in a private DNS zone.
- Choosing the Microsoft-managed certificate on a CDN or WAF site.
- Uploading a certificate that uses AES-256 encryption.

## Related

- [Power Pages](https://www.m365.fm/entity/power-pages/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Add a custom domain name to a Power Pages site (Microsoft Learn)](https://learn.microsoft.com/power-pages/admin/add-custom-domain)
