---
title: "Microsoft Entra Domain Services Alerts: Common Alerts and How to Resolve Them"
summary: "A guide to the Entra Domain Services health alerts on Microsoft Learn, grouped by cause: unrecoverable configurations, subscription and directory problems, network and resource locks, sync and backup alerts, suspension, and the RC4 alert."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [entra-domain-services, entra-id, network-security-group]
keypoints:
  - "Alerts appear under Domain Services > Health in the Microsoft Entra admin center. After a fix, health usually updates itself within two hours."
  - "Learn calls AADDS100, AADDS110 and AADDS114 unrecoverable. Its fix for them is to delete the managed domain and recreate it."
  - "AADDS109 alerts younger than 4 hours may be resolved automatically by the platform, because deleted resources can be recreated."
  - "AADDS115 means a resource lock and AADDS116 a restrictive policy on the managed domain's network resources. Remove the lock or loosen the policy."
  - "Suspended domains (AADDS503, AADDS504, AADDS600) risk deletion if left unresolved, so resolve the cause as quickly as possible."
faq:
  - q: "Where do I see Domain Services alerts?"
    a: "According to Microsoft Learn, in the Microsoft Entra admin center search for and select Domain Services, choose your managed domain and select Health in the left navigation. Selecting an alert, for example AADDS109, shows the timestamp of when it was first found."
  - q: "Which alerts require deleting and recreating the managed domain?"
    a: "Learn says AADDS100 (missing directory), AADDS110 (subnet full) and AADDS114 (invalid subnet) are unrecoverable, and that the fix is to delete the managed domain and recreate it. AADDS103 and AADDS112 also use delete and recreate in a virtual network with a private or large enough IP range, and AADDS101 needs a non-B2C directory."
  - q: "What does AADDS109 mean and can it fix itself?"
    a: "It means a resource used by the managed domain, such as a public IP address, network interface or load balancer, was deleted. Learn says that if the resource was deleted less than 4 hours ago, the Azure platform may recreate it automatically. For older alerts you can delete and recreate the domain or open a support request, and support can require a restore from backup."
  - q: "What do AADDS500 and AADDS501 point to?"
    a: "AADDS500 says synchronization with Microsoft Entra ID has not completed in a while, and AADDS501 says a backup has not been taken in a while. Learn says to check Domain Services health for configuration alerts, and for sync to check blocked network connectivity and whether password synchronization was set up. Wait two hours after a fix."
  - q: "What is the RC4 alert AADDS123?"
    a: "Learn says AADDS123 means Kerberos RC4 usage was detected for service ticket issuance, which can block security enforcement related to CVE-2026-20833. Learn lists steps including turning off RC4 in the managed domain's security settings, enabling security audit events and monitoring event IDs 4768 and 4769."
---

Microsoft Entra Domain Services reports problems as numbered health alerts. Open **Domain Services** in the Microsoft Entra admin center, select your managed domain and then **Health** to see them. For many alerts, Microsoft Learn describes a fix that ends with the health status updating itself within two hours. For several others, the only fix is to delete the managed domain and create a new one. This article groups the alerts on the Learn page by what you have to do.

## Where to look

1. In the Microsoft Entra admin center, search for and select **Domain Services**.
2. Choose your managed domain, for example `aaddscontoso.com`.
3. Select **Health** in the left navigation.
4. Select the alert to read its message. For AADDS109, Learn's example, the alert shows a timestamp for when it was first found.

You can open an Azure support request at any time for more help.

## Group 1: unrecoverable configurations

For these, Learn says the problem cannot be repaired in place.

| Alert | Meaning | Learn's fix |
| --- | --- | --- |
| AADDS100 | The associated directory is missing, often because the subscription moved to a new directory or the old directory was deleted | Delete the managed domain and recreate it in the new directory |
| AADDS101 | Azure AD B2C runs in this directory | Delete the domain, create a directory that is not B2C, create a replacement managed domain |
| AADDS110 | Subnet is full, no room for another domain controller | Delete and recreate. Do not deploy your own VMs into the same subnet |
| AADDS114 | Subnet is invalid | Delete and recreate |

Learn calls AADDS100, AADDS110 and AADDS114 unrecoverable. For AADDS101, it notes that Domain Services automatically synchronizes with a Microsoft Entra directory and cannot be deployed in a B2C directory.

## Group 2: IP address ranges

- **AADDS103, address in a public IP range.** The virtual network must use a private IP range. Learn says that if you own the public range configured in the virtual network, the alert can be ignored, but the SLA cannot be committed to because of possible unpredictable errors. The fix is disruptive: delete the managed domain, change the address space and subnets to a private range, and recreate it. Custom resources such as OUs and service accounts are lost.
- **AADDS112, not enough IP addresses.** Domain Services needs at least two available IP addresses in the subnet, and Learn recommends at least 3 to 5 spare ones. The fix is the same pattern: delete, enlarge the range, recreate.

## Group 3: subscription and directory

- **AADDS106, subscription not found.** Domain Services cannot be moved to a different subscription. Create a subscription, delete the managed domain, create a replacement.
- **AADDS107, subscription disabled.** Renew the subscription. A Domain Services notification then lets you re-enable the managed domain.
- **AADDS108, subscription moved directories.** Move the subscription back to the previous directory, or delete the managed domain and create a replacement in the chosen subscription.
- **AADDS111, service principal unauthorized.** A service principal that Domain Services uses lacks permissions. Review the access of the service principal with the ID given on the Learn page and grant the access that was denied earlier.

## Group 4: network resources

- **AADDS109, resources cannot be found.** Domain Services creates resources such as public IP addresses, virtual network interfaces and a load balancer. If one is deleted, the domain is unsupported. If the deletion was less than 4 hours ago, the platform may recreate it. Check the timestamp of the alert in **Health**. For older alerts, delete and recreate the domain or open a support request.
- **AADDS113, resources are unrecoverable.** A required resource was modified and cannot be recovered automatically. Open a support request.
- **AADDS115, resources are locked.** A resource lock blocks the platform's management tasks. Check the operation logs for each network component, find the lock, and under **Locks** remove it.
- **AADDS116, resources are unusable.** A policy restricts the platform. Check the operation logs, select the resource and under **Policies** edit the policy so it is less restrictive.

## Group 5: custom attributes and group policy

- **AADDS120, custom attribute onboarding error.** An extension property conflicts with the built-in schema. Learn says to check the **Custom Attributes** page for the expected LDAPName, remove the failed attributes, wait for the alert to clear and add them again. Contact Microsoft Support if your scenario is blocked.
- **AADDS122, GPO conflict (preview).** Review the domain's GPO settings. Learn says 4 alerts are sent every 7 days if there is no resolution, and after 30 days the system fixes lingering issues automatically, which may lead to loss of GPO data.

## Group 6: synchronization and backup

- **AADDS500, sync has not completed in a while.** Check health for configuration alerts. Learn names two common reasons: blocked network connectivity, and password synchronization that was never set up or completed. Wait two hours after fixing.
- **AADDS501, no recent backup.** Network configuration problems can block backups. Resolve configuration alerts and wait two hours.

## Group 7: suspension

- **AADDS503, suspended due to a disabled subscription.** Renew the subscription and re-enable the domain.
- **AADDS504, suspended due to an invalid configuration.** Resolve configuration alerts in health, wait two hours, then open a support request to re-enable the domain.
- **AADDS600, unresolved alerts for 30 days.** Microsoft cannot manage the domain controllers, which blocks security updates. Failure to resolve within 30 days results in suspension. Wait six hours after resolving alerts to see whether the alert is removed.

Learn warns for all three that a domain suspended for an extended period can be deleted.

## The RC4 alert, AADDS123

AADDS123 says Kerberos RC4 usage was detected for service ticket issuance that can block security enforcement related to CVE-2026-20833. Learn's steps are: turn off RC4 in the domain's security settings (Learn says that unless you have workloads, devices or services explicitly dependent on RC4, you need not go to the next steps), turn on security audit events and use the page's sample query to find dependencies, monitor Kerberos ticket event IDs 4768 and 4769, set the `msDS-SupportedEncryptionTypes` value for service accounts that still need RC4 in on-premises Active Directory, keep Kerberos hardened, and keep monitoring until the alert clears.

Members of the **AAD DC Administrators** group can also use a self-service configuration through the hidden SMB share `\\<domain-controller-name>\CustomerExecutionScripts$`. Learn warns that the configuration applies per domain controller and that a KDC restart happens automatically when registry values change, so space the rollout. The page lists a schedule of January 13, 2026 for initial deployment, April 2026 for enforcement with manual rollback, and July 2026 for final enforcement without rollback. Those dates have passed, so treat this alert as urgent. That last point is my reading.

## A short order of work (my advice)

1. Sort by group above. Anything in group 1 needs a rebuild plan, so schedule downtime and note custom OUs and service accounts first.
2. For resource alerts, check locks and policies before assuming a rebuild is needed.
3. Do not wait on suspension alerts.

## Related

- [Microsoft Entra Domain Services](https://www.m365.fm/entity/entra-domain-services/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Network security group (NSG)](https://www.m365.fm/entity/network-security-group/)

## Sources

- [Common alerts and resolutions in Microsoft Entra Domain Services (Microsoft Learn)](https://learn.microsoft.com/entra/identity/domain-services/troubleshoot-alerts)
