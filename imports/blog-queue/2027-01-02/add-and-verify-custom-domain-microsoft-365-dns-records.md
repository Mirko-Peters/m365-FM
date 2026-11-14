---
title: "Add and Verify a Custom Domain in Microsoft 365 and Set DNS Records"
summary: "How to add a custom domain in the Microsoft 365 admin center, verify it with a TXT record, and add DNS records, with notes on what the Microsoft pages do and do not specify."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [microsoft-365-admin-center]
keypoints:
  - "Add a domain under Settings > Domains > Add domain in the Microsoft 365 admin center. You must be a Domain Name Administrator."
  - "Verification uses a TXT record whose value looks like MS=msXXXXXXXX. Remove it from your DNS host after verification succeeds."
  - "If your registrar supports Domain Connect, the wizard can add the TXT and the other records for you after you authorize them."
  - "Add users and mailboxes before the MX record changes, so mail keeps working. Existing mail stays at the old host unless you migrate it."
  - "The pages read for this article give no propagation time and no exact MX, SPF or CNAME values. Use the values shown in your own admin center."
faq:
  - q: "Where do I add a domain in Microsoft 365?"
    a: "According to Microsoft Learn, select Show all, then Settings, then Domains in the Microsoft 365 admin center and select Add domain. On first-time setup you can use Get your custom domain set up under Setup."
  - q: "Which role do I need to add a domain?"
    a: "Microsoft Learn says you must be a Domain Name Administrator, because domain changes affect the whole tenant."
  - q: "What does the TXT verification record look like?"
    a: "The Learn page on DNS record information says the value looks like MS=msXXXXXXXX. Copy the exact value from the domain setup wizard in your own tenant, add it at your DNS host, verify, then remove it."
  - q: "How long does DNS propagation take?"
    a: "The Microsoft Learn pages read for this article do not state a propagation time or general TTL recommendation. Check your DNS host and retry verification."
  - q: "What if my registrar does not support automatic setup?"
    a: "Learn says only registrars on the Domain Connect list support automatic setup. If your DNS host hosts the records, the Add records button does not appear in Microsoft 365, and you use the registrar's own DNS tools with the values from the wizard."
---

To add a custom domain, open the Microsoft 365 admin center, go to **Settings** > **Domains** and select **Add domain**. Enter the domain, verify ownership with a TXT record at your DNS host, then add the records that route mail and services to Microsoft 365. You need the Domain Name Administrator role. The details below follow Microsoft Learn and say where the pages are silent.

## Before you start

- You must be a **Domain Name Administrator**. Learn says domain changes affect the whole tenant.
- Add users and mailboxes before you add the MX record. Otherwise mail for those recipients can break during the switch.
- Know where your DNS is hosted. If the registrar hosts DNS, you may need to add records in the registrar's tools instead of Microsoft 365.
- Learn warns that incorrect DNS records can cause email and service outages, so change records carefully.

## Step 1: Add the domain

First-time setup:

1. Sign in to the Microsoft 365 admin center.
2. Select **Show all**, then **Setup**.
3. Under **Sign-in and security**, select **Get your custom domain set up**, then **Get Started**.

Adding another domain:

1. Select **Show all**, then expand **Settings**.
2. Select **Domains**.
3. Select **Add domain**.

On the **Add a domain** page, enter the domain name and select **Use this domain**.

## Step 2: Verify you own the domain

### Option A: Domain Connect (automatic)

On **Verify you own your domain**, the wizard shows your registrar. Confirm it and select **Verify**. If it is wrong, select **choose a different domain host**. Sign in to the registrar window and authorize the TXT record. Allow pop-ups, or add the registrar URL to your pop-up allow list.

Learn lists GoDaddy, IONOS, Cloudflare and Plesk as examples of registrars on the Domain Connect list.

### Option B: Add the TXT record manually

1. In **Settings** > **Domains**, select your domain and then **Continue setup**.
2. On **Domain Verification**, select **Add a TXT record to the domain's DNS records** and **Continue**.
3. Copy the TXT value. Learn says it looks like `MS=msXXXXXXXX`.
4. Add the record at your DNS host and return to Microsoft 365 to verify.
5. Remove the TXT record from your DNS host once verification succeeds.

The pages I read describe TXT verification only. They do not describe MX or CNAME as verification methods.

## Step 3: Add DNS records for services

After verification, the wizard asks how you want to connect the domain. On **Add DNS records**, select the services to configure. Expand **Advanced options** to see more services. Select **Add DNS records** and authorize them in the registrar window, then select **Done** on **Domain setup is complete**.

The records offered depend on your choice under **Domain purpose**. If you manage DNS yourself:

1. On **Domains**, select your domain.
2. Select **Manage DNS**, then **More Options** > **Add your own DNS**, then **Continue**.
3. Keep that page open and copy each value into your DNS host.

What the Learn pages say about the records:

- **MX:** added for Exchange Online. Remove old MX records for a previous provider or give them a lower priority than the Microsoft 365 record.
- **SPF:** activated by adding a TXT record to the domain's DNS.
- **DKIM:** optional, selected under Advanced options. DMARC is recommended together with SPF and DKIM.
- **CNAME:** added for Teams, Exchange Online and Intune under Advanced options.

The pages I read do not give the exact MX, SPF or CNAME values, and they do not mention autodiscover. The wizard generates the values for your tenant, so copy them from there. For other record types, Learn names A, CNAME, MX, TXT and SRV as types you can add under **Domains** > your domain > **DNS records** > **+ Add records** > **Add a custom DNS record**.

An SRV example on Learn, for SIP federation, uses service `_sipfederationtls`, protocol TCP, target `sipfed.online.lync.com`, priority 100, weight 1, port 5061 and TTL 3600.

## After the MX change

New mail goes to Microsoft 365. Existing mail stays with the previous host unless you migrate it. Learn gives no general TTL guidance and no propagation time. If a check fails, wait, confirm the record at the DNS host and try again.

## When the Add records button is missing

Learn says that if the registrar hosts your DNS, **+ Add records** does not appear. Use the registrar's own DNS tools. Learn also says the Domain Connect setup does not change an existing website.

## Typical mistakes

- Adding the MX record before users and mailboxes exist.
- Leaving the old MX record at a higher priority than the Microsoft 365 one.
- Copying a TXT value from an old tenant or a forum instead of the wizard.
- Deleting the verification TXT record before verification succeeds.

## Related

- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Add a domain to Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/setup/add-domain)
- [Gather the information you need to create DNS records (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/get-help-with-domains/information-for-dns-records)
- [Add DNS records to connect your domain (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/get-help-with-domains/create-dns-records-at-any-dns-hosting-provider)
