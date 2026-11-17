---
title: "Moving from the service principal to a managed identity for AVD features"
summary: "To move an Azure Virtual Desktop host pool from the Azure Virtual Desktop service principal to a managed identity, assign the identity to the host pool, grant it the role each feature needs, check the feature, and only then remove the service principal's role assignment. Learn describes these tasks on separate pages, so this sequence combines them and marks where the ordering is our own."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-managed-identity, azure-virtual-desktop]
keypoints:
  - "Order matters: assign the identity and its roles first, verify the feature, and remove the service principal's role assignment last. A subscription-level assignment of the service principal serves every host pool in that subscription, so remove it only after every pool has an identity."
  - "Assigning the identity needs Desktop Virtualization Host Pool Contributor on the host pool (plus Managed Identity Operator for a user-assigned identity). Assigning roles to it needs Microsoft.Authorization/roleAssignments/write, which Owner and User Access Administrator include."
  - "Learn's PowerShell for a host pool identity uses New-AzWvdHostPool with the existing values and only IdentityType changed, and Get-AzWvdHostPool with Format-Table Name, IdentityType checks the result."
  - "App Attach with Azure Files and Entra-joined session hosts cannot use a managed identity, so leave its service principal assignment in place."
  - "For session host creation and update, Learn says an assigned identity acts in place of the service principal. For autoscale and Start VM on Connect it names either identity without saying which is used while both hold the role, so there only removing the service principal assignment shows that the identity works."
faq:
  - q: "Can I keep the service principal role assignments while I test the managed identity?"
    a: "Yes. For autoscale and Start VM on Connect, Learn lists both identities as options, and the pages cited here do not say that adding an identity removes the service principal assignment. The catch is that Learn does not say which one these two features use while both hold the role, so a feature that keeps working proves nothing about the identity until the service principal assignment is gone. For session host creation and update, the deployment page says the assigned identity performs the actions in place of the service principal."
  - q: "What do I need to be allowed to do before I start?"
    a: "Desktop Virtualization Host Pool Contributor at the host pool scope or higher to assign the identity, Managed Identity Operator at the identity's scope or higher for a user-assigned identity, and Microsoft.Authorization/roleAssignments/write on the scope to grant its roles."
  - q: "How do I undo the change?"
    a: "Re-create the service principal's role assignment using Learn's service principal page, which shows the Azure PowerShell and Azure CLI commands with the application ID 9cdead84-a844-4324-93f2-b2e6bb768d07. To remove the identity from a host pool, clear the Assign a Managed Identity box on the Identity page and save."
---

To move a host pool from the Azure Virtual Desktop service principal to a managed identity, assign the identity to the host pool, grant that identity the role each feature needs, confirm the feature still works, and remove the service principal's role assignment last. This article gives that sequence with the portal and PowerShell steps Learn publishes, plus the points where migrations go wrong.

Learn describes the concept and the individual tasks on separate pages; this order is our own, built from those pages. For which features can use an identity and which roles they need, see the explainer "Managed identity in Azure Virtual Desktop: autoscale, Start VM on Connect and session host configuration". Learn's What's new announced general availability of host pool [managed identity](/entity/avd-managed-identity/) support in September 2026 and says that host pools with a session host configuration will require one "in a future service update".

## Before you start

You need three permissions, which often sit with different people.

- **To assign an identity to the host pool:** the Desktop Virtualization Host Pool Contributor role at the host pool scope or higher. For a user-assigned identity you also need Managed Identity Operator at the identity's scope or higher.
- **To grant roles to the identity:** `Microsoft.Authorization/roleAssignments/write` on the target scope. Learn names Owner and User Access Administrator as roles that include it.
- **To remove the old assignment:** `Microsoft.Authorization/roleAssignments/delete`, which Learn's removal page gives as part of Role Based Access Control Administrator.

For PowerShell or Azure CLI on your own machine you need the Az.DesktopVirtualization module or the desktopvirtualization CLI extension; Azure Cloud Shell works as well.

## Step 1: inventory what the service principal holds

Open **Access control (IAM)** at each scope that might carry a role for the service principal, and select the **Role assignments** tab. Look for entries named *Azure Virtual Desktop* or *Windows Virtual Desktop*. Learn warns that you can see two entries with the same name, for example after using both Azure Virtual Desktop classic and the Azure Resource Manager version, and says to tell them apart by application ID. The one that matters for host pool features has application ID 9cdead84-a844-4324-93f2-b2e6bb768d07. In Microsoft Entra ID, search the tenant for that ID and note the **object ID**, which is unique to your tenant. You need it later to remove the right assignment.

Write down, for each assignment, the role, the scope and the host pools it covers. The roles you expect are Desktop Virtualization Power On Off Contributor (autoscale), Desktop Virtualization Power On Contributor (Start VM on Connect) and, for dynamic autoscale, Desktop Virtualization Virtual Machine Contributor. Then mark each host pool with the features it uses. A host pool that uses App Attach with Azure Files and Entra-joined session hosts keeps its service principal assignment for that feature, because Learn lists App Attach as not able to use a managed identity.

## Step 2: assign an identity to the host pool

In the Azure portal:

1. Search for **Azure Virtual Desktop**, select **Host pools**, and open the host pool.
2. Select **Identity**.
3. Tick **Assign a Managed Identity**, then choose **System assigned managed identity** or **User assigned managed identity**.
4. For a user-assigned identity, pick the **Subscription** and the existing identity.
5. Select **Save**.

In Azure PowerShell, Learn's pattern reads the current pool first, then runs `New-AzWvdHostPool` with the same values and only the identity type changed:

```powershell
$existingHostPool = Get-AzWvdHostPool -Name '<HostPoolName>' -ResourceGroupName '<ResourceGroupName>'

$parameters = @{
    Name = $existingHostPool.Name
    ResourceGroupName = $existingHostPool.ResourceGroupName
    Location = $existingHostPool.Location
    HostPoolType = $existingHostPool.HostPoolType
    LoadBalancerType = $existingHostPool.LoadBalancerType
    PreferredAppGroupType = $existingHostPool.PreferredAppGroupType
    IdentityType = 'SystemAssigned'
}
New-AzWvdHostPool @parameters
```

Learn says that because the pool exists, this changes only the `IdentityType` property. Verify with `Get-AzWvdHostPool` piped to `Format-Table Name, IdentityType`; the expected output shows `SystemAssigned`. For a user-assigned identity, Learn adds `IdentityType = 'UserAssigned'` and `IdentityUserAssignedIdentity = @{$managedIdentity.Id = @{}}`, with the identity object taken from `Get-AzUserAssignedIdentity`. One stumbling block: the explanatory text of that step says "only changing the IdentityType to 'SystemAssigned'", while the code block uses 'UserAssigned'. Use the code. The cmdlet reference for module version 16.5.0 lists `-IdentityType` as "either system assigned, or none" and does not list `-IdentityUserAssignedIdentity` in its syntax, so check `Get-Help New-AzWvdHostPool -Parameter *Identity*` in your module version, or use the portal steps, before you rely on the user-assigned block. As a precaution of our own, save the output of `Get-AzWvdHostPool` before the change so you can compare it afterwards.

## Step 3: grant the identity its roles

Learn's service principal page points to the general Azure RBAC articles for managed identities. In the portal:

1. Open **Access control (IAM)** at the scope the feature needs and select **Add**, then **Add role assignment**.
2. On the **Role** tab, choose the role, for example Desktop Virtualization Power On Off Contributor.
3. On the **Members** tab, select **Managed identity**, then **Select members**.
4. In the **Select managed identities** pane, choose user-assigned or system-assigned and pick the identity. For a system-assigned identity, Learn's Azure Local steps select **Hostpool** in the **Managed Identity** drop-down and then the pool's identity, and the RBAC page says system-assigned identities can be selected by Azure service instance.
5. Select **Review + assign**.

In PowerShell, Learn's Azure Local example reads `$hostPool.IdentityPrincipalId` and passes it to `New-AzRoleAssignment -ObjectId`; the page does not state the identity type. Our reading is that the property holds the object ID of the pool's system-assigned identity. Combining that with the subscription-scope form from Learn's RBAC page gives, for a system-assigned identity:

```powershell
$hostPool = Get-AzWvdHostPool -Name '<HostPoolName>' -ResourceGroupName '<ResourceGroupName>'
New-AzRoleAssignment -ObjectId $hostPool.IdentityPrincipalId `
  -RoleDefinitionName "Desktop Virtualization Power On Off Contributor" `
  -Scope "/subscriptions/<SubscriptionId>"
```

Use the scope that the feature page names. For autoscale, Learn says the Azure subscription, and a lower scope "prevents autoscale from working properly". For Start VM on Connect, the scope must contain the host pool and its session host VMs. For session host creation and update, the identity needs Desktop Virtualization Virtual Machine Contributor on the resource group or subscription of the session hosts, and the Key Vault Secrets User role on the key vault that holds the local administrator and domain join secrets. Azure Local session hosts additionally need Reader on their resource group.

For a user-assigned identity, Learn's RBAC PowerShell page says to use the identity's object ID, which you can get with `Get-AzADServicePrincipal`; the same call works for a system-assigned identity. Our reading: a user-assigned identity attached to several pools needs the role assigned once, at a scope that covers all of those pools, while a system-assigned identity needs it for each pool.

## Step 4: verify each feature

Test one pool at a time, while the service principal still holds its role. For autoscale, in Insights open the **Autoscale** tab, or query the `WVDAutoscaleEvaluationPooled` table where `ResultType != "Succeeded"` after a schedule phase has run. Learn gives that table for pooled host pools only, and it needs the category **Autoscale logs for pooled host pools** in the host pool's diagnostic settings (Insights does not support personal host pools). For Start VM on Connect, deallocate a test session host and connect as a test user. For session host update, run it on a test host pool first, as Learn recommends for any update. Learn also says to disable autoscale on a host pool before you start a session host update and keep it disabled until the update finishes, because a scaling plan that is enabled during an update can make the update fail with a runtime error, so plan the autoscale and session host update tests one after the other.

This step has a limit for autoscale and Start VM on Connect. Their Learn pages name "a managed identity assigned to your host pool or the Azure Virtual Desktop service principal" without saying which one is used while both hold the role, so a passing test with both assignments in place shows the feature works, not that the managed identity works. For session host creation and update, the deployment page says the assigned identity performs the actions in place of the service principal, so the same test is more informative there.

## Step 5: remove the service principal assignment

For autoscale and Start VM on Connect, the only proof is to remove the old assignment and test again. Two conditions come first. Learn names only the service principal for the roles of dynamic autoscale, so keep that assignment for any pool that uses dynamic autoscale until the live page names the managed identity. And Learn's known issue says session host update must use a managed identity to use a key vault with private network access, so confirm the identity has its Key Vault role before you remove anything that session host update relies on.

1. Confirm that every host pool in the scope has an identity with the needed role. A subscription-level service principal assignment covers all host pools in the subscription, so removing it early breaks every pool that has no identity yet.
2. Open **Access control (IAM)** at the scope where the role was assigned and select the **Role assignments** tab.
3. Tick the row for the Azure Virtual Desktop service principal (check the object ID you noted) and the role, and select **Remove**, then **Yes**. If you see a message that inherited role assignments cannot be removed, open IAM at the scope where it was assigned, which the **Scope** column shows next to **(Inherited)**.
4. Repeat the feature tests from step 4.

In PowerShell, `Remove-AzRoleAssignment -ObjectId <ServicePrincipalObjectId> -RoleDefinitionName "<Role>" -Scope "/subscriptions/<SubscriptionId>"` does the same; Learn says that if you get "The provided information does not map to a role assignment", add the scope or resource group parameter.

To roll back, re-create the assignment with the commands on Learn's service principal page, such as `New-AzRoleAssignment` with `-ApplicationId "9cdead84-a844-4324-93f2-b2e6bb768d07"` and the subscription scope.

## Stumbling blocks

- **Wrong entry.** Duplicate service principal names exist; match the object ID.
- **Wrong scope.** An identity with the right role at the resource group does not satisfy autoscale.
- **Dynamic autoscale.** Learn's dynamic scaling section names the service principal for both roles. Check the live page for which identity you may use before removing anything.
- **Key vault access policy.** Learn says the Get secret access policy is not supported if you chose a system-assigned identity during pool creation; use Azure RBAC.
- **Pool deletion.** A system-assigned identity is deleted with the host pool, while a user-assigned identity and its permissions stay.
- **Preview wording.** Some Learn pages still carry preview wording for enhanced host pool management, which Microsoft announced as generally available in July 2026; check the current page before relying on a limit.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure managed identity in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-principal-assign-roles)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Configure Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Monitor Autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Assign Azure roles using the Azure portal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal)
- [Microsoft Learn: Assign Azure roles using Azure PowerShell](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-powershell)
- [Microsoft Learn: Remove Azure role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-remove)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
