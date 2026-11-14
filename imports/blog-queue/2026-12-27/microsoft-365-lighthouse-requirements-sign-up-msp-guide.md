---
title: "Microsoft 365 Lighthouse for MSPs: What It Does, Requirements and How to Sign Up"
summary: "Understand Microsoft 365 Lighthouse using three Microsoft Learn pages: who it is for, the nine listed benefits, customer tenant requirements such as GDAP or DAP and the 2500 user limit, sign-up steps and how cost is described."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [microsoft-365-lighthouse]
keypoints:
  - "Lighthouse is for partners enrolled in the Cloud Solution Provider program, both direct-bill partners and indirect resellers. Customers do not need to enroll in CSP."
  - "A customer tenant needs delegated access through GDAP or DAP, a qualifying subscription, no more than 2500 licensed users and the same geographic region as the partner."
  - "Device pages need all devices enrolled in Intune with compliance policies. User pages need Azure AD Premium P1 or later in the customer tenant."
  - "Sign-up uses lighthouse.microsoft.com. If prompted, an admin buys Microsoft 365 Lighthouse in the Marketplace for the partner tenant only. Customer data can take up to 48 hours to appear."
  - "The overview says no additional costs apply, while the sign-up page says one license is required for the partner tenant. The pages do not reconcile this, so confirm the current purchase flow."
faq:
  - q: "Who can use Microsoft 365 Lighthouse?"
    a: "According to Microsoft Learn, partners enrolled in the Cloud Solution Provider program, including indirect resellers and direct-bill partners. Only partners must enroll, and their customers do not need to."
  - q: "What must a customer tenant meet?"
    a: "Learn lists delegated access through GDAP or DAP, at least one qualifying Enterprise, Business, Frontline or Education subscription, no more than 2500 licensed users and the same geographic region as the partner (Americas, European Union, or Asia plus Australia)."
  - q: "What happens if a tenant does not meet the requirements?"
    a: "Learn says it has access to only a limited set of experiences, including GDAP setup and management, user search, user details, tenant tagging and service health."
  - q: "How do I sign up?"
    a: "Go to lighthouse.microsoft.com. If a message says you need to sign up in the Microsoft 365 admin center, an admin in the partner tenant selects Marketplace, All products, searches Microsoft 365 Lighthouse and selects Buy."
  - q: "Does it cost extra?"
    a: "The overview says no additional costs are associated with using Lighthouse to manage Microsoft 365 services and connected devices. The sign-up page says Lighthouse requires one license for the partner tenant only, with no per-user or customer tenant licenses."
---

Microsoft 365 Lighthouse is a portal for managed service providers (MSPs) to manage customers at scale from one place. This article combines the Learn overview, requirements and sign-up pages and points out where they differ.

## Who it is for

Learn says Lighthouse is available to partners enrolled in the Cloud Solution Provider (CSP) program, both direct-bill partners and indirect resellers. Only partners must enroll. The customers they manage do not. Lighthouse is deployed in the partner tenant only.

## What it offers

The overview lists nine benefits:

1. AI-driven recommendations to acquire and retain customers.
2. Tenant deployment journeys for a consistent set of steps.
3. A default SMB security baseline.
4. Multi-tenant device compliance insights, policy comparison and the top unmet settings.
5. Simpler common tasks such as password reset.
6. Configuring multifactor authentication and self-service password reset (SSPR) with adoption tools.
7. Protection against risky sign-ins.
8. Managing threats on Windows 10 devices using details from Microsoft Defender XDR.
9. Insights into Microsoft 365 service incidents and advisories.

## Customer tenant requirements

Each customer tenant needs the following to be actively monitored and managed:

- Delegated access. Either granular delegated administrative privileges (GDAP) or a delegated administrative privileges (DAP) relationship is required. If both exist, GDAP permissions take precedence for technicians in GDAP-enabled security groups. An indirect reseller relationship is no longer required.
- At least one Enterprise, Business, Frontline or Education subscription of Microsoft 365, Office 365, Exchange Online, Windows 365 Business or Microsoft Defender for Business.
- No more than 2500 licensed users.
- The same geographic region as the partner: Americas, European Union, or Asia plus Australia.

Tenants that do not qualify get only a limited set of experiences: GDAP setup and management, user search, user details, tenant tagging and service health.

## Requirements per area

| Area | Requirement on the page |
| --- | --- |
| Device management | Enroll all customer devices in Microsoft Intune and assign compliance policies to all of them. |
| User management | Licenses for Azure Active Directory Premium P1 or later, which the page names as included in Microsoft 365 Business Premium and E3 (P1) and E5 (P2). |
| Threat management | Enroll all devices in Intune and protect them with Microsoft Defender Antivirus. |
| Opportunities | The Account Manager role in Lighthouse, assigned by someone with the Administrator role. |

## Sign up

1. Go to lighthouse.microsoft.com. If the partner tenant is eligible, a welcome message appears and managed tenants load, which can take a couple of minutes.
2. If a message says you need to sign up in the Microsoft 365 admin center, an admin in the partner tenant signs in, selects **Marketplace**, **All products**, searches for **Microsoft 365 Lighthouse**, selects **Details**, then **Buy**.
3. If a message says Lighthouse was removed for your organization, an admin goes to **Settings**, **Org settings**, opens the **Services** tab, selects **Microsoft 365 Lighthouse**, allows the customer management experiences and selects **Save**.

After sign-up, customer data can take up to 48 hours to appear. The page does not name a specific admin role. It says to contact an admin in the partner tenant.

## Notes on Defender Antivirus and next steps

The requirements page says Microsoft Defender Antivirus is part of Windows and enabled by default on Windows 10 devices. If a non-Microsoft antivirus solution is in use, Defender Antivirus is disabled automatically, and it activates again when that solution is uninstalled. After sign-up, the sign-up page points to two further articles: one on configuring Lighthouse portal security, covering required and optional security capabilities, and one on understanding opportunities and data, which covers the machine learning generated recommendations. Read both before you give technicians access, because they decide who can see which data.

## Cost

The overview says no additional costs are associated with using Lighthouse. The sign-up page says it requires one license for the partner tenant only, with no per-user licenses for the partner and no Lighthouse licenses in customer tenants. The pages do not reconcile these statements, so confirm the purchase flow in the Marketplace.

## Not covered

The pages give no feature limits beyond those above and no explanation of how recommendations are generated. The overview's visible last-updated date is 2024-11-11.

## Related

- [Microsoft 365 Lighthouse](https://www.m365.fm/entity/microsoft-365-lighthouse/)

## Sources

- [Overview of Microsoft 365 Lighthouse](https://learn.microsoft.com/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Requirements for Microsoft 365 Lighthouse](https://learn.microsoft.com/microsoft-365/lighthouse/m365-lighthouse-requirements)
- [Sign up for Microsoft 365 Lighthouse](https://learn.microsoft.com/microsoft-365/lighthouse/m365-lighthouse-sign-up)
