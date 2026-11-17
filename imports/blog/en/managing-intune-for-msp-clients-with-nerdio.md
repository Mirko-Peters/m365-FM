---
title: "Managing Intune for MSP clients with Nerdio"
summary: "Nerdio Manager for MSP keeps Intune policies at the MSP level, publishes them to customer accounts and compares each customer against the source. This article walks through that workflow, its documented limits, and how it differs from the Intune admin center and Microsoft 365 Lighthouse."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-msp, intune]
keypoints:
  - "In Nerdio Manager for MSP, Intune policies are imported or created once at the MSP level and published to customer accounts. Intune in each customer tenant still enforces them."
  - "Assignments to customers use a sync type, manual by default or automatic, and Add or Overwrite. With automatic sync for All customers, new accounts receive the policy automatically."
  - "Drift status compares a customer's policy with the MSP source. Fix drift only works in Enforced mode; Rollback and Accept drift (with an expiry) are the alternatives."
  - "Nerdio checks source tenants for unimported changes every 4 hours. Nerdio validates only the JSON syntax of an edited policy, not whether the Intune settings are valid."
  - "Microsoft 365 Lighthouse is a no-additional-cost Microsoft option with its own limits (CSP partners, up to 2,500 licensed users per customer tenant). Microsoft also names Nerdio and others as companion solutions for Intune multi-tenant work."
faq:
  - q: "Does Nerdio replace Intune for an MSP?"
    a: "No. Intune remains the service that enforces policies in each customer tenant. Nerdio's help pages describe policies, profiles and baselines that are published to customer accounts, and say that changes made in Nerdio Manager or in the admin center appear in the other. The Microsoft post that announces the collaboration calls Nerdio and inforcer independent companion solutions built on Intune."
  - q: "Can an MSP use Nerdio Manager for Intune only, without Azure Virtual Desktop?"
    a: "Yes, with limits. Nerdio's account-level page describes Intune-only accounts, meaning accounts without an Azure Virtual Desktop subscription. They can manage only Intune policies, have access only to MSP-assigned certificates, and cannot use customer-level private WinGet or Shell Apps repositories because those need an Azure subscription."
  - q: "What happens when a customer changes a policy that the MSP published?"
    a: "The Configuration Drift window in Nerdio Manager shows the difference from the MSP source policy. The MSP can fix the drift (in Enforced mode, Fix drift republishes the mismatched items), roll back to another version assigned to the customer, or accept the drift for a set period."
---

Nerdio Manager for MSP lets a managed service provider keep Intune policies in one place at the MSP level, publish them to customer accounts and see where a customer differs from the source. Intune in each customer tenant still does the enforcing. This article covers how that workflow works, the steps and settings that matter in daily use, and where Microsoft's own tools may be enough.

The details come from Nerdio's help center and Microsoft Learn. Nerdio's pages use the term "Microsoft Endpoint Manager admin center" for the Intune admin portal, and this article keeps that wording when it quotes them. It does not cover Intune on AVD session hosts or onboarding a customer account.

## The multi-tenant problem

Intune is configured per tenant. Microsoft describes the MSP effect in a September 2025 post by Lior_Bela: MSPs repeat tasks across tenants, troubleshoot inconsistent policies and switch between portals. The same post announces a collaboration with two partners, inforcer and Nerdio, and describes their products as independent companion solutions built on Intune. A March 2026 follow-up adds three validated partners: AvePoint Confidence Platform: Elements Edition, CyberDrain CIPP and SoftwareCentral Tenant Manager. Neither post labels a capability as preview or generally available.

An MSP therefore has several routes:

| Route | What it gives | Limits stated in the sources |
|---|---|---|
| Intune admin center per customer tenant | Full Intune feature set in the tenant | One tenant at a time |
| [Microsoft 365 Lighthouse](/entity/microsoft-365-lighthouse/) | One portal for tenant onboarding, security baselines, device compliance insights and more; no additional cost | CSP partners only; each customer tenant needs delegated access, at most 2,500 licensed users and a region matching the partner's; devices must be enrolled in Intune with compliance policies assigned to appear on device pages |
| Partner solutions such as Nerdio, inforcer, CIPP | Cross-tenant policy handling and dashboards, according to Microsoft's post | Separate product; check licensing and scope with the vendor |

Nerdio's own blog adds a claim about native Intune: no native multi-tenant management, and no import or export of policies between customer tenants. That is a vendor statement from 2023; compare it with what Lighthouse offers before treating it as a requirement.

Access differs too. Lighthouse requires a delegated administrative relationship, either [GDAP](https://learn.microsoft.com/en-us/partner-center/customers/gdap-introduction) or DAP, per customer. Nerdio's permissions page describes a different model: adding a customer account creates a Nerdio Manager app registration in the customer tenant, a customer admin with the Global Administrator role and Owner on the subscription grants its permissions, and day-to-day actions then run as the app registration. That page does not mention GDAP.

## How Nerdio organises Intune for an MSP

Nerdio Manager works on two levels. At the MSP level you keep the source policies and publish them. At the account level, one customer, you assign groups and see the result. The MSP-level Policies menu covers these types:

- Entra: Conditional Access
- Devices: Configuration Profiles, MAM Policies, Autopilot Profiles, Enrollment Status Pages
- Security: Security Baselines, Compliance Policies, Update Rings, Endpoint Security Policies, Defender O365 Policies

Policies get into Nerdio Manager in two ways. **Import from a source tenant** (Policies > [type] > Import Actions > Import) walks through four stages: Available Policies, Selected Policies, Policy Options and Summary. **Import from JSON** accepts a JSON or TXT file or pasted JSON. Imported policies can then be edited or cloned from the action menu, which opens their settings as JSON. Nerdio's page says compliance, configuration and security policies are created in the Microsoft Endpoint Manager admin center using an MSP-level Azure tenant, and that Nerdio Manager only displays them. Under Policies > Entra > Conditional Access, tenant-specific objects such as locations, applications and authentication contexts are replaced with customer-specific values when you publish.

Nerdio checks the source tenant for unimported changes every four hours; you can start a check yourself with Import Actions > Source tenant check.

## Publishing a policy to customers

1. Open Policies and choose the policy type.
2. Select Assign, then Add assignments.
3. Under Select assignments, choose accounts, or All for every account. A grayed-out account usually means Intune is not enabled for it.
4. Choose Add to extend existing assignments or Overwrite to replace them, then Confirm.
5. On the Assignments page set the Sync Type. Manual is the default; Automatic republishes regularly, and with All customers selected, new accounts get the policy automatically. Set the Version, and for Conditional Access the State.
6. Select Apply and close.

After you edit a source policy, Re-publish applies to manual assignments and Publish now to automatic ones. Re-publish is available only for policies that are already assigned to customers.

**Worked example.** An MSP imports an update ring from its own tenant and assigns it to All customers with Automatic sync. After the MSP edits a deferral setting in the source policy, Publish now confirms the change for the automatic assignments. For an account assigned with Manual sync, the change goes out when someone selects Re-publish. The decision to make per customer is therefore the sync type, not only the policy.

## Per-customer differences

Customers rarely want identical settings. Three mechanisms cover the difference:

- **Inherited variables.** In the Settings tab of an edited policy, values are passed with `$InheritedVars.Variable_Name`. Drift checks ignore account-level Inherited variables, because those are expected to differ.
- **Direct assignment.** For Configuration Profiles, Autopilot Profiles, Enrollment Status Pages, Compliance Policies, Security Baselines, Update Rings and Endpoint Security Policies you can set users, devices and group templates per account. Microsoft restricts filters to a shorter list of types and group templates to others, and the Nerdio page lists both. Check it before you plan an assignment around a filter.
- **Account-level assignment.** Inside one customer account, Policies > [category] > Assign lets you set Included Groups, with All users (Intune-licensed users) or All devices (Intune-enrolled devices), and Excluded Groups. Only one of the two All options can be used per assignment type.

Inherited assignments from baselines appear marked "Inherited" and are read-only.

## Drift, versions and rollback

For any policy assigned to customers, open Status from the action menu. The Configuration Drift window compares the customer's settings with the MSP source. Three actions exist for a drifted item:

- **Fix drift** republishes mismatched items. It skips items with Accepted drift and only works in Enforced mode; Report only mode makes no changes.
- **Rollback** lets you pick a version assigned to the customer and Confirm.
- **Accept drift** sets an expiration, an optional description and an optional Allow processing flag, so the next republish attempts a sync. Accepted drift rules are managed under Accepted Drifts at the MSP level.

When the source policy changes, an update indicator appears and Update shows a side-by-side comparison, with a changelog field. On the account side, bulk action "Update selected" applies only to policies with a drifted status.

Nerdio's blog describes daily backups, version control and change tracking for policies. Treat that as a product description from March 2025, and test a rollback on a non-critical policy before depending on it.

## Policy baselines

A baseline groups Intune policies under a desired state. Create one under Baselines > Policy Baselines > Add Baseline, then add policies with Edit policies > Add policies, and assign accounts with Assign. Each account assignment is either Enforced, where policies are assigned to customers and published if the sync type is Auto, or Report-only, where Nerdio Manager only checks whether the actual state matches.

Baselines are processed from top to bottom, and a lower-priority baseline skips a policy that a higher one already evaluated or published. Nerdio advises avoiding overlapping baselines. In the confirmation dialog, "Remove policies … from accounts" is off by default, and removal only happens for policies with no other assignments. [Nerdio Solution Baselines](/entity/nerdio-solution-baselines/) are a related, separate feature at the MSP level and are not covered here.

To use the Center for Internet Security (CIS) Intune policies, enable them first under Settings > Integrations: select the Center for Internet Security tile, select Disabled next to CIS Intune Policies, then I Agree and Enable. The CIS baselines then appear in Policy Management.

## Limits and pitfalls from the documentation

- **Syntax-only validation.** When you edit JSON, Nerdio Manager validates only the syntax, not whether the Intune settings and values are valid. Check them in the Intune portal or documentation.
- **Authentication contexts are shared.** Conditional Access Authentication Context IDs (c1 to c199) are shared across policies. The option to overwrite an authentication context is off by default; review the existing contexts under Protection > Conditional Access > Authentication contexts in the Microsoft Entra admin center first.
- **Microsoft-managed Conditional Access policies** are read-only in Nerdio. Per Nerdio's page, Microsoft adds them to tenants and enables them automatically after 45 days, so import from several tenants to see all of them. You can change their state and group assignments, but not edit them or push them to tenants.
- **The built-in device compliance policy is tenant-wide** and cannot be scoped to user or device groups. By default it can report compliant when no compliance policy is assigned to a device.
- **Intune-only accounts** cannot use customer-level private WinGet or Shell Apps repositories (see the FAQ above).
- **Limited Access mode.** When enabled for an account, the account app does not get the Global Admin role, and Intune permissions must be assigned afterwards under Settings > Integrations.
- **Cross-Tenant Management is a different feature.** A Nerdio page on Intune Cross-Tenant Management, which links secondary Intune tenants to one Nerdio Manager instance, is labelled Public Preview. It is described for AVD Core, AVD Premium, Windows 365 and Unified Endpoint Management subscriptions and does not say whether it targets MSPs. Do not mix it up with the MSP-level policy workflow above.

## Which route fits

Choose by workload rather than by product. If your customer tenants meet the Lighthouse requirements, Lighthouse costs nothing extra and covers onboarding, baselines and device compliance insights; check whether its policy tooling covers what you publish. If you also run [Azure Virtual Desktop](/entity/azure-virtual-desktop/) or Windows 365 for the same customers, a console that handles both and publishes Intune policies with drift checks can reduce portal switching. Other partner solutions such as inforcer and CIPP target the same multi-tenant gap, so a fair comparison covers all of them. Confirm pricing and edition requirements for these Intune features with the vendor.

Before you roll anything out to many tenants, run one policy through the whole cycle on a test customer: import, assign with manual sync, republish, change a setting in the customer tenant, read the drift status, then fix it or accept it. That shows how sync type, Enforced mode and accepted drift behave in your own set-up.

## Related

- [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/)
- [Microsoft Intune](/entity/intune/)
- [Nerdio](/entity/nerdio/)
- [Microsoft 365 Lighthouse](/entity/microsoft-365-lighthouse/)
- [Conditional Access](/entity/conditional-access/)
- [Configuration drift](/entity/configuration-drift/)

## Sources

All retrieved on 17 November 2026.

- [Nerdio Help: Overview of Intune Policies and Configurations](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616287373)
- [Nerdio Help: Intune policy: MSP level general management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624563085)
- [Nerdio Help: Intune Policy: MSP-level Advanced Management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125615807629)
- [Nerdio Help: Intune policy: Account-level general management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125601997069)
- [Nerdio Help: Intune: Policy baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608692493)
- [Nerdio Help: Permissions and Nerdio Manager](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608873229)
- [Nerdio Help: Enable and configure Intune Cross-Tenant Management](https://nmehelp.getnerdio.com/hc/en-us/articles/43762208848397)
- [Nerdio blog: Intune for MSPs](https://getnerdio.com/blog/intune-for-msps/)
- [Nerdio blog: Policy standardization in Nerdio Manager for MSP](https://getnerdio.com/blog/policy-standardization-in-nerdio-manager-for-msp/)
- [Tech Community: Addressing multi-tenant management challenges for MSPs with Microsoft Intune and partner innovations](https://techcommunity.microsoft.com/t5/microsoft-intune-blog/addressing-multi-tenant-management-challenges-for-msps-with/ba-p/4453682)
- [Tech Community: Announcing three new partners for multi-tenant management with Microsoft Intune](https://techcommunity.microsoft.com/t5/microsoft-intune-blog/announcing-three-new-partners-for-multi-tenant-management-with/ba-p/4501339)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Microsoft Learn: Requirements for Microsoft 365 Lighthouse](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-requirements)
- [Microsoft Learn: Granular delegated admin privileges (GDAP) introduction](https://learn.microsoft.com/en-us/partner-center/customers/gdap-introduction)
