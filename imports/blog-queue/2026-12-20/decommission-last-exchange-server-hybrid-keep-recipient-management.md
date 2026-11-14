---
title: "Decommission On-Premises Exchange Servers in Hybrid and Keep Recipient Management"
summary: "When you can shut down on-premises Exchange in a hybrid setup, the three scenarios Microsoft Learn describes, the cleanup steps, and the Management tools option that keeps recipient management without a running server, with its warnings."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [exchange-server, exchange-online, entra-connect]
keypoints:
  - "With directory synchronization, most recipient properties must be managed on-premises. Removing the last Exchange server without a plan prevents management of cloud recipients."
  - "Learn describes three scenarios: all cloud with no sync, all cloud with AD FS and sync, and all cloud with remaining services such as SMTP relay or public folders. Only the first allows full removal."
  - "If you keep directory sync but no longer need the on-premises Exchange admin center or Exchange RBAC, the Exchange Management tools with PowerShell can manage recipients without a running server."
  - "Learn warns not to uninstall the last server. Shut it down, clean up, and erase and reformat it, because uninstalling removes information from Active Directory that the management tools need."
  - "Shutting down the last server ends Exchange RBAC. Only domain admins and members of the Recipient Management EMT group can manage recipients afterward."
faq:
  - q: "Why not just uninstall Exchange once all mailboxes are in Exchange Online?"
    a: "Learn says removing on-premises Exchange servers in a hybrid deployment prevents management of cloud mailboxes when directory synchronization is enabled, because most user properties must be managed on-premises. Which option applies depends on whether you keep directory synchronization."
  - q: "Can I decommission all Exchange servers and keep directory synchronization?"
    a: "Learn describes the Exchange Management tools route for this case. You install the tools on a domain-joined computer and manage recipients with PowerShell cmdlets. It lists conditions, such as no on-premises mailboxes or public folders and no need for the on-premises Exchange admin center or RBAC."
  - q: "What happens to Exchange RBAC after the last server is shut down?"
    a: "Learn says Exchange RBAC no longer functions. Users in Exchange recipient groups or with custom Exchange roles lose permission, and only domain admins and users added through the Add-PermissionForEMT.ps1 script can manage recipients."
  - q: "Should I keep the server if I use it for SMTP relay?"
    a: "Learn says that if the last Exchange server is used for anything other than recipient management, for example SMTP relay, it should not be shut down. It also recommends against removing Exchange in the scenario with SMTP relay or on-premises public folders."
  - q: "Do I need to change DNS before shutting down?"
    a: "Learn says that once all mailboxes are in Exchange Online you can point the MX and Autodiscover records to Exchange Online, and that both internal and external DNS must be updated to avoid inconsistent client connectivity."
---

Whether on-premises Exchange can be removed in a hybrid deployment depends on one question: do you still synchronize identities from Active Directory? Microsoft Learn says that with directory synchronization enabled, most user properties cannot be managed in Exchange Online, so the on-premises environment is where recipient management happens. Learn describes three scenarios and a separate option, the Exchange Management tools, for keeping recipient management after the last server is shut down.

## Why this is not a simple uninstall

According to the decommissioning article, many hybrid organizations eventually move all mailboxes to Exchange Online and then consider removing their servers. Learn calls that not a good idea in general, because removing on-premises Exchange servers prevents management of cloud mailboxes. The reason is directory synchronization. Even if you configured directory synchronization without running the Hybrid Configuration wizard, you still cannot do most recipient management tasks in the cloud.

Learn also notes that third-party tools or ADSIEdit are not supported for managing Exchange users. Supported tools are the Exchange Management Console, the Exchange admin center and the Exchange Management Shell.

## Three scenarios from Learn

| Scenario | Learn's recommendation |
|---|---|
| All mailboxes in the cloud, all management in the cloud, no directory sync needed | Disable directory synchronization and remove Exchange from the on-premises environment. |
| All mailboxes in the cloud, AD FS kept, so directory sync stays | You cannot remove all Exchange servers. Remove most of them and keep one (OK) or two (better) for user management. |
| All mailboxes in the cloud, but SMTP relay for applications or on-premises public folders remain | Learn recommends against removing Exchange and the hybrid configuration. Pointing Autodiscover to Exchange Online breaks features such as hybrid public folder access. |

For the second scenario, Learn adds that the remaining servers do not need a DAG or other high availability options.

## Scenario 1 steps: full removal

Learn lists these steps for disabling directory synchronization and uninstalling hybrid:

1. Check that `PublicFoldersEnabled` is not `Remote` with `Get-OrganizationConfig | Format-List PublicFoldersEnabled`. If it is `Remote` and you need the public folders, migrate them to Exchange Online first.
2. Point the MX and Autodiscover records to Exchange Online. Update both internal and external DNS.
3. Remove the Service Connection Point values with `Set-ClientAccessService -AutoDiscoverServiceInternalUri $Null` (Exchange 2016 or later) or `Set-ClientAccessServer` (2010 or 2013).
4. In the Exchange admin center, under **Mail Flow** > **Connectors**, disable or delete the inbound and outbound connectors created by the Hybrid Configuration wizard.
5. Under **Organization** > **Sharing**, remove the **O365 to On-Premises** organization relationship.
6. Disable the OAuth configuration on-premises and in Exchange Online with `Set-IntraOrganizationConnector -Enabled $False`, using the identities `ExchangeHybridOnPremisesToOnline` and `ExchangeHybridOnlineToOnPremises`. Learn notes these identities assume the wizard configured OAuth.
7. Turn off directory synchronization.
8. Uninstall Exchange from the on-premises servers.

For scenario 2, Learn adds `Remove-HybridConfiguration` to prevent hybrid configuration objects from being recreated, and recommends leaving the Exchange Hybrid Deployment feature enabled in cloud sync or Microsoft Entra Connect.

## Keeping recipient management without a server

Learn's article on managing recipients with Management tools applies to organizations that keep directory sync but no longer want a running Exchange server. It says the updated tools can replace a server if all of these are true:

- All mailboxes and public folders are in Exchange Online, so there are no on-premises Exchange recipients.
- AD is used for recipient management with cloud sync or Microsoft Entra Connect.
- You do not use or need the on-premises Exchange admin center or Exchange RBAC.
- You are comfortable using PowerShell only for recipient management.
- You do not need auditing or logging of recipient management activity.
- You run only one on-premises Exchange server, and only for recipient management.

Learn names Exchange 2019 Cumulative Update 12 or later for installing the tools on any domain-joined computer. Domain admins and members of the **Recipient Management EMT** group can then run cmdlets such as `Set-RemoteMailbox`, `New-RemoteMailbox`, `Set-MailUser`, `Set-DistributionGroup` and `Set-EmailAddressPolicy` without a running Exchange server. You cannot modify on-premises recipients directly in Microsoft Entra ID or Exchange Online.

The documented preparation includes:

1. Verify that all mailboxes are in the cloud.
2. Verify that the Exchange Online coexistence domain is the target delivery domain of a remote domain.
3. Install the Exchange Management tools and the Windows Remote Server Administration Tools.
4. Copy `ScriptingAgentConfig.xml` if you use the Scripting Agent.
5. Run `Add-PermissionForEMT.ps1` to create the Recipient Management EMT group.
6. Load the snap-in with `Add-PSSnapin *RecipientManagement` each time you manage recipients.
7. Test the cmdlets, shut down the last server, and test again.

Learn notes that after shutting down the last server, create and update commands can be slow, with about 40 seconds of delay, until the server is cleaned up in Active Directory with `CleanupActiveDirectoryEMT.ps1`.

## Cleanup before shutdown

If you shut down permanently, Learn's steps include running the hybrid cleanup from scenario 2, removing the federation trust `Microsoft Federation Gateway`, removing the federation certificate, resetting the key credentials of the first-party service principal with `ConfigureExchangeHybridApplication.ps1 -ResetFirstPartyServicePrincipalKeyCredentials`, uninstalling the Hybrid agent for Modern Hybrid, pointing MX and Autodiscover to Exchange Online, and then shutting the server down.

The Active Directory cleanup script removes system mailboxes, Exchange containers, permissions for Exchange security groups and the groups themselves. Learn says this cannot be undone and should only be done if you never want to run Exchange again.

## Warnings to keep in view

- **Do not uninstall the last server.** Learn says to shut it down and use the cleanup script, but not to uninstall, because uninstalling removes critical information from Active Directory that breaks the management tools. After cleanup, erase and reformat the server.
- **Exchange RBAC ends.** Only domain admins and members of Recipient Management EMT can manage recipients.
- **Other uses.** Do not shut down the server if it is used for SMTP relay or anything else besides recipient management.
- **Updates.** Updating the Management tools only role to a newer CU requires `Setup /PrepareAD` first, and the cleanup script must be run again afterward.

Learn also describes a newer option, transferring the Source of Authority for Exchange attributes to Exchange Online, with its own articles. Those articles were not read for this article.

## What the documentation does not say

The pages read give no timeline or rollback plan for decommissioning, and they do not say how to restore the removed objects after the Active Directory cleanup beyond the warning that it cannot be undone. Test in a lab first and keep a backup of the last server until you are sure.

## Related

- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [How and when to decommission your on-premises Exchange servers in a hybrid deployment (Microsoft Learn)](https://learn.microsoft.com/en-us/exchange/decommission-on-premises-exchange)
- [Manage recipients in Exchange Hybrid environments using Management tools (Microsoft Learn)](https://learn.microsoft.com/en-us/exchange/manage-hybrid-exchange-recipients-with-management-tools)
