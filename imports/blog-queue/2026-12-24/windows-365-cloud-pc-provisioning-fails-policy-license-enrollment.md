---
title: "Windows 365 Cloud PC Provisioning Fails: Check Policy, Licenses and Enrollment Restrictions"
summary: "Troubleshoot Windows 365 Enterprise provisioning failures using Microsoft's error list: Intune enrollment restrictions, license and policy deleted mid-provisioning, network connection health, domain join, IP exhaustion and Azure Policy blocks."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [windows-365]
keypoints:
  - "Learn identifies provisioning errors by display title, such as Intune enrollment failed, License not found, Provisioning policy not found and Request disallowed by policy."
  - "Intune enrollment failed can come from blocked Intune endpoints or MDM enrollment restrictions that block Windows enrollment. Allow Windows corporate enrollment."
  - "The Azure network connection refreshes every six hours, and a failed refresh during provisioning fails it. Make sure it is healthy, then retry."
  - "Not enough IP addresses available means the subnet is too small. Each attempt, up to three, allocates a new vNIC and IP."
  - "Request disallowed by policy means an Azure Policy blocks Windows 365 from creating the vNIC or other objects. Check Policy in the Azure portal."
faq:
  - q: "Why does provisioning fail with Intune enrollment failed?"
    a: "Microsoft Learn lists these causes: required Intune endpoints are unreachable, MDM enrollment restrictions block Windows enrollment, the tenant is unhealthy, or Configuration Manager client push targets the Cloud PC OU. The fixes are to allow the Intune endpoints on the vNet, allow Windows corporate enrollment and deploy the Configuration Manager agent from Intune instead of client push."
  - q: "What does License not found mean?"
    a: "Learn says the user's Windows 365 license was removed during provisioning. Assign a valid license to the user and provision again."
  - q: "What does Provisioning policy not found mean?"
    a: "The provisioning policy was deleted while provisioning was in progress. Confirm the policy exists and is assigned to the correct group."
  - q: "How many times does provisioning try to allocate an IP?"
    a: "Learn says each attempt, up to three, allocates a new vNIC and IP in the subnet of the Azure network connection, so a subnet that is too small causes Not enough IP addresses available. Add available private IPs to the subnet."
  - q: "What if my error is not on the list?"
    a: "Learn lists Other provisioning failures as unlisted errors, usually caused by blocked network access. Allow all required endpoints on the Azure network connection vNet and any gateway."
---

When a Cloud PC fails to provision, Windows 365 shows an error title in the Intune admin center. Microsoft's provisioning error page maps each title to a cause and a fix. This guide groups those entries by what to check first: policy and license, enrollment, network, and Azure-side blocks.

## How Microsoft names the errors

The page does not list codes such as internalServerError. It identifies each error by its display title. If you see a title that is not below, check the page directly, because it lists 20 entries.

## Policy, user and license errors

These happen when something was removed while provisioning was running.

| Error | Cause | Fix |
| --- | --- | --- |
| License not found | The user's Windows 365 license was removed during provisioning | Assign a valid license |
| Provisioning policy not found | The policy was deleted during provisioning | Confirm the policy exists and is assigned to the right group |
| User not found | The associated user was deleted during provisioning | Verify the account is valid |
| Windows Autopatch enrollment error | The Autopatch group was deleted before provisioning finished | Add the group to the provisioning policy and reprovision |
| Local administrator permissions error | The User Settings policy's local admin rights were not applied | Retry, or create a new User Settings policy |

## Enrollment errors

**Intune enrollment failed.** Learn lists these causes:

- Required Intune endpoints are unreachable.
- MDM enrollment restrictions block Windows enrollment.
- The tenant is unhealthy.
- Client push targets the Cloud PC OU.

Fixes: allow the Intune endpoints on the vNet, allow Windows corporate enrollment in policies, and deploy the Configuration Manager agent from Intune instead of client push. Test with a VM.

**Microsoft Entra hybrid join failed.** Hybrid join isn't configured or healthy, often because the AD sync period is too long or AD replication is slow. Learn says to set Entra Connect to sync computer objects every 30 to 60 minutes and confirm the AD object is in the correct OU and syncs to Entra ID within the 90-minute window.

**Domain join failed.** Causes are an incorrect AD domain, OU or credentials in the Azure network connection, insufficient permissions, or a vNet or subnet that can't reach a domain controller. Verify the connection settings, permissions and connectivity. Learn suggests attaching an Azure VM to the vNet and testing the domain join with the same credentials.

**Microsoft Entra ID service connection point misconfigured.** The SCP is missing or the virtual network can't discover it. Confirm it exists for all target forests.

## Network errors

- **Azure network connection isn't healthy.** The connection refreshes every six hours, and a failed refresh during provisioning fails it. Make it healthy, then retry.
- **Not enough IP addresses available.** The subnet is too small. Each attempt, up to three, allocates a new vNIC and IP. Add available private IPs and check capacity on the Azure network connections page in Intune.
- **Blocking High Risk Ports.** An Intune policy re-enables high-risk ports. Retry, apply a policy that disables them, or add local firewall rules.
- **Other provisioning failures.** Usually blocked network access. Allow all required endpoints on the network connection vNet and any gateway.

## Azure-side blocks

**Request disallowed by policy.** An Azure Policy blocks Windows 365 from creating the vNIC or other Azure objects. In the Azure portal, check **Policy** for events blocking provisioning.

**Supported Azure regions not listed in the provisioning UI.** A region may appear in the requirements but not in the UI, likely because of a planned expansion. Open a support request to have the region evaluated.

## Configuration errors that usually clear on retry

Several entries recommend simply retrying provisioning: Disk allocation error, Microsoft Teams optimization error, Windows reset error and Start menu power icons error. The last one also names a device configuration policy using `Start/HideShutdown` and `Start/HideRestart` as a fix. Time zone redirection error suggests a GPO with **Allow time zone redirection**.

## A triage order

1. Read the exact error title in the Intune admin center.
2. If it mentions a deleted object, check what changed during provisioning.
3. For enrollment, check MDM enrollment restrictions and endpoint access first.
4. For network titles, check the Azure network connection health and subnet size.
5. If nothing matches, check Azure Policy events and required endpoints.
6. Retry once after a fix, since several entries recommend it.

## What the page does not cover

The page says nothing about license assignment timing and it does not list how long provisioning normally takes. It also does not cover Windows 365 Frontline or Business specific problems.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)

## Sources

- [Troubleshoot Windows 365 provisioning errors](https://learn.microsoft.com/troubleshoot/windows-365/provisioning-errors)
