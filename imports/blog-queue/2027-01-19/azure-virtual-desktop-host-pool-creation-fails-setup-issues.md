---
title: "Azure Virtual Desktop Host Pool Creation Fails: Portal and Template Errors"
summary: "When an Azure Virtual Desktop host pool deployment fails, the cause is usually a subscription or quota limit in the portal, or an ARM template error such as a failed domain join, a forbidden admin user name or a blocked download. Learn's troubleshooting page lists each case with its fix."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [azure-virtual-desktop, arm-template, azure-virtual-network]
keypoints:
  - "Start by viewing the deployment operations and the activity log for the failed deployment, fix the error, delete leftover resources and retry."
  - "Portal issues include no active subscription or too few rights, exceeding a quota limit, missing users after a tenant move and a missing region."
  - "A failed domain join comes from wrong credentials, a domain name that does not resolve, or a virtual network whose DNS is set to Default instead of the domain controller."
  - "The admin user name cannot contain admin, administrator or root, and a duplicate network interface name or resource group prefix causes InvalidResourceReference."
  - "To delete a session host after its VM was deleted, put it in drain mode first, sign users out and then delete the host."
faq:
  - q: "Where do I find out why the deployment failed?"
    a: "Learn says to view the deployment operations and the activity log for the resource group, fix the error that is reported, delete any resources the failed deployment left behind and then try again."
  - q: "What can I do about a quota error?"
    a: "Use fewer virtual machines or cores in the deployment, or request a quota increase through the link in the status message."
  - q: "Why does the domain join fail?"
    a: "Learn lists three causes: wrong credentials, a domain name that cannot be resolved, and virtual network DNS settings left on Default. For the last one, set custom DNS servers that match the domain controller."
  - q: "Why is the region I want missing?"
    a: "Learn says to re-register the Microsoft.DesktopVirtualization resource provider for the subscription, which makes the regions appear again."
  - q: "What does the Unauthorized scale operation error mean?"
    a: "Learn says the subscription type, such as MSDN, Free or Education, does not allow the scale operation in that region. Change the subscription type or the region."
---

An Azure Virtual Desktop host pool deployment that fails is either stopped in the portal before it starts, by a subscription, quota or provider problem, or fails during the template deployment, for example in the domain join or the VM extensions. Learn's troubleshooting page for host pool creation lists each case with a fix. The common first step is to open the deployment operations and the activity log, fix what they report, delete leftover resources and retry. This article follows that page, which I read in full.

## First steps for any failure

Learn's guidance for template errors applies to most failures:

1. View the deployment operations and the activity log to see which step failed and why.
2. Fix the reported error.
3. Delete the resources that the failed deployment left behind.
4. Run the deployment again.

For the image, the page says to acquire the Windows Enterprise multi-session image, which is the starting point for the standard multi-session host pool.

## Portal issues

- **Create a free account.** You see this when you have no active subscriptions or no rights on them. Sign in with an account that has at least contributor-level access.
- **Exceeding quota limit.** Use fewer virtual machines or cores in the deployment, or request a quota increase through the link in the status message.
- **User assignments not visible.** This can happen after the subscription moved between tenants. Reassign the users.
- **A region is missing.** Re-register the Microsoft.DesktopVirtualization resource provider: in the portal go to Subscriptions, select the subscription, open Resource Provider and re-register it.

## ARM template errors

### The joindomain extension fails

Learn lists three causes:

1. The credentials are wrong.
2. The domain name does not resolve.
3. The virtual network's DNS servers are set to Default. Set custom DNS servers that match the domain controller.

### Unauthorized

The message says the scale operation is not allowed for this subscription in this region. Learn says the subscription type, such as MSDN, Free or Education, is the cause. Change the subscription type or the region.

### VMExtensionProvisioningError

Learn describes this as transient. Verify the health of the host with PowerShell and finish the registration manually.

### The admin user name is not allowed

The user name cannot contain the substrings admin, administrator or root.

### DSC extension errors

These indicate that the account has no administrative access. Check the credentials you supplied.

### InvalidResourceReference

Learn describes two variants:

- **Resource group name prefix.** Names are compared by their prefix, so make the first two characters of the resource group name unique.
- **Duplicate network interface name.** Use a different host name prefix, so that the NIC names do not collide.

### Error downloading

The error mentions catalogartifact.azureedge.net and a message of failing after 29 attempts. Learn says a static route, a firewall or a network security group blocks the download. Remove whatever blocks it, then retry.

## Deleting a session host after deleting its VM

If the VM is gone but the session host remains, Learn says to put the session host in drain mode, sign out the users and then delete the host.

## A practical order

This section is my advice, not a Microsoft statement.

1. **Read the exact message and error code.** Many of the entries above are distinguished by one string.
2. **Decide portal or template.** A failure before any resources appear is a portal or subscription problem. A failure with partial resources is a template problem.
3. **Check subscription basics first.** Rights, quota, subscription type and provider registration are quick to check.
4. **Check networking next.** DNS on the virtual network, name resolution of the domain and rules that block downloads are common causes of the template errors on Learn's list.
5. **Clean up before retrying.** Leftover resources can cause naming conflicts such as the NIC name error.
6. **Change one thing per retry.** It lets you tell which change fixed the failure.
7. **Verify the hosts after a transient error.** For VMExtensionProvisioningError, Learn suggests checking the health with PowerShell rather than assuming the deployment failed completely.

## Preparing the next deployment

This section is my advice, not a Microsoft statement.

- Check the account's role on the subscription before you start.
- Confirm that the domain controller is reachable from the virtual network and that the network's DNS servers point to it.
- Choose resource group and host name prefixes that are unique, using the first characters as Learn suggests.
- Avoid the forbidden strings in the admin user name.
- Keep the template parameters in a file, so a retry uses the same values.

## Information to gather for a support case

This section is my advice, not a Microsoft statement.

If you cannot resolve the failure with the list above, collect the name of the failed deployment operation, the full error message, the subscription type and region, the host pool and resource group names, and the virtual network DNS settings. Add whether the domain join credentials work when you test them manually, and whether the domain name resolves from a VM in the same virtual network. These facts let a support engineer match your case to one of the entries quickly, or see that it is a new one.

## What I did not read

I read the host pool creation troubleshooting page. I did not read the separate Learn pages about session host registration, about the Azure Virtual Desktop service principal or about quota increases, so I do not describe the steps on those pages.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Azure Virtual Desktop environment host pool creation - Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-issues)
