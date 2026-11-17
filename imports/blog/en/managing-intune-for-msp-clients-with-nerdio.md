---
title: "Managing Intune for MSP clients with Nerdio"
summary: "Nerdio Manager for MSP keeps Intune policies at the MSP level, publishes them to customer accounts and compares each customer against the source. This article walks through that workflow, its documented limits, and where the Intune admin center and Microsoft 365 Lighthouse may be enough."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-msp, intune]
keypoints:
  - "Per Nerdio's pages, Intune policies are mostly imported from the MSP tenant or a JSON file into Nerdio Manager for MSP and published to customer accounts. Nerdio Manager can also clone a policy or create a built-in device compliance policy. Later source changes are pulled in by re-import or Update."
  - "Assignments to customers use a sync type, manual by default or automatic, and Add or Overwrite. Per Nerdio's Sync Type note, a policy assigned to All customers is also published automatically to newly added accounts."
  - "Drift status compares a customer's policy with the MSP source. For a policy outside a Policy Baseline, Fix drift only works in Enforced mode; Rollback and Accept drift (with an expiry) are the alternatives."
  - "Nerdio checks source tenants for unimported changes every 4 hours. Nerdio validates only the JSON syntax of an edited policy, not whether the Intune settings are valid."
  - "Microsoft 365 Lighthouse is a no-additional-cost Microsoft option with its own limits (CSP partners, up to 2,500 licensed users per customer tenant). Microsoft's September 2025 post names Nerdio and inforcer as independent companion solutions; a March 2026 post adds three validated partners, including CIPP."
faq:
  - q: "Does Nerdio replace Intune for an MSP?"
    a: "No. Intune remains the underlying service. Nerdio's help pages describe policies, profiles and baselines that are published to customer accounts. On the account-level page, changes to assigned policies and profiles made in Nerdio Manager or in the admin center are reflected in the other. The Microsoft post that announces the collaboration calls Nerdio and inforcer independent companion solutions."
  - q: "Can an MSP use Nerdio Manager for Intune only, without Azure Virtual Desktop?"
    a: "Yes, with limits. Nerdio's account-level general management page describes Intune-only accounts, meaning accounts without an Azure Virtual Desktop subscription. They can manage only Intune policies, have access only to MSP-assigned certificates, and cannot use customer-level private WinGet or Shell Apps repositories because those need an Azure subscription."
  - q: "What happens when a customer changes a policy that the MSP published?"
    a: "The Configuration Drift window in Nerdio Manager shows the difference from the MSP source policy. The MSP can fix the drift (for a policy outside a Policy Baseline, Fix drift republishes the mismatched items in Enforced mode), roll back to another version assigned to the customer, or accept the drift for a set period."
---

Nerdio Manager for MSP lets a managed service provider keep Intune policies in one place at the MSP level, publish them to customer accounts and see where a customer differs from the source. These are Intune policies, so Intune in each customer tenant presumably does the enforcing; the pages describe publishing. This article covers the workflow, key settings and where Microsoft's own tools may be enough.

The details come from Nerdio's help center and Microsoft Learn. Nerdio's pages still say "Microsoft Endpoint Manager admin center" for the Intune admin center; this article uses the current name. It does not cover Intune on AVD session hosts or onboarding a customer account.

## The multi-tenant problem

Intune is configured per tenant. A September 2025 Microsoft post by Lior_Bela says MSPs repeat tasks across tenants, troubleshoot inconsistent policies and switch between portals. It announces a collaboration with inforcer and Nerdio, which it calls independent companion solutions building capabilities on top of Intune. A March 2026 follow-up adds three validated partners: AvePoint, CyberDrain CIPP and SoftwareCentral. Neither post labels a capability as preview or generally available.

An MSP therefore has several routes:

| Route | What the sources say |
|---|---|
| Intune admin center per customer tenant | Configured per tenant; the Microsoft post describes repeated tasks and portal switching |
| [Microsoft 365 Lighthouse](/entity/microsoft-365-lighthouse/) | A Microsoft admin portal for managing customers at scale; no additional cost. Learn lists a default SMB security baseline, multi-tenant device-compliance insights and tools to compare policies. Requires CSP enrollment and, per customer tenant, delegated access (GDAP or DAP), at most 2,500 licensed users and the partner's region |
| Nerdio, inforcer | Named in Microsoft's September 2025 post as independent companion solutions building on top of Intune |
| CIPP | One of three further validated partners in Microsoft's March 2026 post (the September post mentions it as a community tool) |

Nerdio's own blog (2023) states that native Intune has no multi-tenant management and no import or export of policies between customer tenants. That is a vendor statement.

Access differs too. Lighthouse requires a delegated administrative relationship, either [GDAP](https://learn.microsoft.com/en-us/partner-center/customers/gdap-introduction) or DAP, per customer. Nerdio's permissions page describes an app registration created in the customer tenant when an account is added. An admin native to that tenant, with Global Administrator and Owner on the Azure subscription, grants its permissions; afterwards most actions run on the app registration's behalf. That page does not mention GDAP. Per Nerdio's page on account-level features and permissions, the granular prerequisite model is generally available and the default for new accounts, and the Least Privilege model is in Public Preview.

## How Nerdio organises Intune for an MSP

Nerdio Manager works on two levels: at the MSP level you keep source policies and publish them; at the account level, one customer, you assign groups and see the result. The MSP-level Policies menu covers these types:

- Entra: Conditional Access
- Devices: Configuration Profiles, MAM Policies, Autopilot Profiles, Enrollment Status Pages
- Security: Security Baselines, Compliance Policies, Update Rings, Endpoint Security Policies, Defender O365 Policies

Policies enter Nerdio Manager in several ways. **Import from a source tenant** (Policies > [type] > Import Actions > Import) walks through four stages: Available Policies, Selected Policies, Policy Options and Summary. **Import from JSON** accepts a JSON or TXT file or pasted JSON. Imported policies can be edited or cloned from the action menu, which opens a JSON editor. **Add Built-in Device Compliance Policy** (Policies > Security > Compliance Policies) creates that policy in Nerdio Manager and assigns it to accounts. CIS policies, once enabled, appear as CIS policy baselines (see Policy baselines). Nerdio's general-management page says compliance, configuration and security policies are created in the Intune admin center using an MSP-level Azure tenant, and that in Nerdio Manager you can only view them. Its advanced-management page describes editing, cloning and updating in Nerdio Manager. The pages are not fully consistent, so test which actions your instance offers.

Nerdio checks the source tenant for unimported changes every four hours; Import Actions > Source tenant check does it manually. The import options include Overwrite if already exists, which re-imports a policy and keeps its assignments.

## Publishing a policy to customers

1. Open Policies and choose the policy type.
2. Select Assign, then Add assignments.
3. Under Select assignments, choose accounts, or All for every account.
4. Choose Add to extend existing assignments or Overwrite to replace them, then Confirm.
5. On the Assignments page set the Sync Type. Manual is the default; Automatic republishes regularly. Nerdio's note adds that a policy assigned to All customers is also published automatically to newly added accounts. Set the Version, and for Conditional Access the State.
6. Select Apply and close.

After you edit or update a policy, Re-publish applies to manual assignments and Publish now publishes automatic assignments immediately. Re-publish exists only for policies already assigned to customers.

**Worked example (an illustration, not from Nerdio's pages).** An MSP imports an update ring and assigns it to All customers with Automatic sync. After an edit in Nerdio Manager, Publish now pushes the change to the assigned accounts.

## Per-customer differences

Three mechanisms cover customer differences:

- **Inherited variables.** Inherited variables are passed to policies with `$InheritedVars.Variable_Name`. Nerdio's Account-level variables page limits real names to 20 alphanumeric characters or hyphens, no underscores, so treat Variable_Name as a placeholder. At the account level, Settings > Integrations lets you override an inherited variable or reset it to the MSP default. Drift checks ignore account-level Inherited variables, because those are expected to differ.
- **Direct assignment.** For Configuration Profiles, Autopilot Profiles, Enrollment Status Pages, Compliance Policies, Security Baselines, Update Rings and Endpoint Security Policies you can set users, devices and group templates per account; Conditional Access and Defender for Office 365 policies have their own dialog steps. Because of Microsoft limitations the filter and group-template lists differ: Conditional Access supports filters but not group templates, Compliance Policies the reverse, and Autopilot Profiles take group templates for All Devices only.
- **Account-level assignment.** Inside one customer account, Policies > [category] > Assign lets you set Included Groups, with All users (Intune-licensed users) or All devices (Intune-enrolled devices), and Excluded Groups. Nerdio's page limits these two options to one type of assignment without saying exactly how, so test it first.

## Drift, versions and rollback

For any policy assigned to customers, open Status from the action menu. The Configuration Drift window compares the customer's settings with the MSP source. Three actions exist for a drifted item:

- **Fix drift** republishes mismatched items. It skips items with Accepted drift. For a policy that is not part of a Policy Baseline, it only works if the assignment is in Enforced mode; in Report only mode it changes nothing. Policies inside a baseline behave differently (see Policy baselines).
- **Rollback** lets you pick, from a dropdown, the version assigned to the customer to roll back to.
- **Accept drift** sets an expiration, an optional description and an optional Allow processing flag, so the next republish attempts a sync.

When the source policy changes, an update indicator appears and Update shows a side-by-side comparison with a changelog field. On the account side, the bulk action "Update selected" applies only to policies with a drifted status.

## Policy baselines

A baseline groups Intune policies under a desired state. Create one under Baselines > Policy Baselines > Add Baseline, add policies with Edit policies > Add policies, and assign accounts with Assign. An assignment is either Enforced, where policies are assigned to customers and published if the sync type is Auto, or Report-only, where Nerdio Manager only checks whether the actual state matches.

When you view the status of a Policy Baseline, each policy has its own Fix drift action. Per Nerdio, it is available for policies in a Report-only baseline and for policies in an Enforce baseline that are not yet published. In a Report-only baseline it publishes the policy to that account once, after you tick a check box to override Report-only mode.

Baselines are processed from top to bottom, and a lower-priority baseline skips a policy that a higher one already evaluated or published. Nerdio advises against overlapping baselines. [Nerdio Solution Baselines](/entity/nerdio-solution-baselines/) are a separate feature, not covered here.

To use the Center for Internet Security (CIS) Intune policies, enable them first: at the MSP level go to System > System Settings > Integrations, select Disabled next to CIS Intune Policies in the Center for Internet Security area, then select I Agree and Enable. CIS policy baselines then appear in Policy Management.

## Limits and pitfalls from the documentation

- **Syntax-only validation.** When you edit JSON, Nerdio Manager validates only the syntax, not whether the Intune settings and values are valid.
- **Authentication contexts are shared.** Nerdio's page says they use a shared set of predefined IDs in the customer tenant (c1-c199), so overwriting one can affect other policies; Microsoft Learn says up to 99 definitions (c1-c99), so check the tenant. The overwrite option is off by default; review existing contexts first. Microsoft Learn gives the path as Entra ID > Conditional Access > Authentication context; Nerdio's page still says Protection > Conditional Access > Authentication contexts.
- **Microsoft-managed Conditional Access policies** are read-only in Nerdio. Nerdio's page says Microsoft turns them on automatically after 45 days; Microsoft Learn says no less than 30 days after introduction if they stay in Report-only, sometimes faster, with notice two weeks before. Import from several tenants, because the policies can differ. You can change their state and group assignments, but not edit or push them.
- **The built-in device compliance policy is tenant-wide** and cannot be scoped to user or device groups; by default it can report compliant when no compliance policy is assigned. Nerdio's Add Built-in Device Compliance Policy applies one to multiple customer accounts.
- **Limited Access mode is deprecated.** Nerdio's permissions page marks account-level Limited Access mode as deprecated from v7.3, in favor of the Granular and Least Privilege access models.

## Which route fits

If your customer tenants meet the Lighthouse requirements, it costs nothing extra; tenants above 2,500 licensed users, or a partner without a CSP relationship, fall outside them. If you also run [Azure Virtual Desktop](/entity/azure-virtual-desktop/) for the same customers, our reading is that publishing Intune policies with drift checks from the same Nerdio Manager may suit you. Microsoft's posts also name inforcer and CIPP. Nerdio's Intune Cross-Tenant Management (Public Preview, Nerdio Manager for Enterprise help center) links secondary Intune tenants to one Nerdio Manager instance; that page does not mention MSP policy publishing, baselines or drift.

Before a wide rollout, run one policy through the whole cycle on a test customer: import, assign with manual sync, republish, change a setting in the customer tenant, read the drift status, then fix or accept it.

## Related

- [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/)
- [Microsoft Intune](/entity/intune/)
- [Nerdio](/entity/nerdio/)
- [Microsoft 365 Lighthouse](/entity/microsoft-365-lighthouse/)
- [Conditional Access](/entity/conditional-access/)
- [Configuration drift](/entity/configuration-drift/)

## Sources

All retrieved on 17 November 2026.

- [Nerdio Help: Intune policy: MSP level general management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624563085)
- [Nerdio Help: Intune policy: MSP-level advanced management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125615807629)
- [Nerdio Help: Intune policy: Account-level general management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125601997069)
- [Nerdio Help: Intune: Policy baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608692493)
- [Nerdio Help: Manage customer account-level features and permissions](https://nmmhelp.getnerdio.com/hc/en-us/articles/39828325981709)
- [Nerdio Help: Account-level variables](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498291119629)
- [Nerdio Help: Azure Permissions and Nerdio Manager](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608873229)
- [Nerdio Help: Enable and configure Intune Cross-Tenant Management](https://nmehelp.getnerdio.com/hc/en-us/articles/43762208848397)
- [Nerdio blog: Intune for MSPs](https://getnerdio.com/blog/intune-for-msps/)
- [Tech Community: Addressing multi-tenant management challenges for MSPs with Microsoft Intune and partner innovations](https://techcommunity.microsoft.com/t5/microsoft-intune-blog/addressing-multi-tenant-management-challenges-for-msps-with/ba-p/4453682)
- [Tech Community: Announcing three new partners for multi-tenant management with Microsoft Intune](https://techcommunity.microsoft.com/t5/microsoft-intune-blog/announcing-three-new-partners-for-multi-tenant-management-with/ba-p/4501339)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Microsoft Learn: Requirements for Microsoft 365 Lighthouse](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-requirements)
- [Microsoft Learn: Microsoft-managed Conditional Access policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/managed-policies)
- [Microsoft Learn: Targeting resources in Conditional Access policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-cloud-apps)
- [Microsoft Learn: Granular delegated admin privileges (GDAP) introduction](https://learn.microsoft.com/en-us/partner-center/customers/gdap-introduction)
