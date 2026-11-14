---
title: "Elevate Access as Global Administrator to Manage All Azure Subscriptions"
summary: "How a Global Administrator elevates access to manage all Azure subscriptions and management groups: the portal toggle, what role is assigned at root scope, how to remove it, PIM caveats and audit logs."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [entra-id, azure-rbac]
keypoints:
  - "Elevating access assigns the User Access Administrator role at root scope (/) to the Global Administrator who sets the toggle. It is per user, not tenant-wide."
  - "In the Azure portal go to Microsoft Entra ID > Manage > Properties and set Access management for Azure resources to Yes, then Save and sign in again."
  - "Remove access with the same user by setting the toggle to No. The root-scope assignment cannot be removed from the Access control (IAM) page."
  - "Deactivating a PIM Global Administrator role does not reset the toggle, so set it to No before deactivating."
  - "Elevation and removal are logged in Microsoft Entra audit logs under the service Azure RBAC (Elevated Access), and can feed a Microsoft Sentinel rule."
faq:
  - q: "What does elevating access actually grant?"
    a: "According to Microsoft Learn, it assigns the User Access Administrator role at root scope, which lets the Global Administrator view all resources and assign access in any subscription or management group. Microsoft Entra and Azure RBAC are secured independently, so it does not grant Azure roles in Entra ID."
  - q: "Who sees the toggle?"
    a: "Only users with the Global Administrator role in Microsoft Entra ID. Learn says the setting is per user and that you cannot elevate all Global Administrators at once. If you use Privileged Identity Management, activate the role first."
  - q: "How do I remove elevated access?"
    a: "Sign in as the same user who elevated, go to Microsoft Entra ID > Manage > Properties and set Access management for Azure resources back to No. Learn says the portal blocks removing the root-scope assignment from the IAM page and points to the toggle, PowerShell, Azure CLI or REST API."
  - q: "Does deactivating my PIM role remove the elevation?"
    a: "No. Learn says deactivating the Global Administrator role does not reset the toggle to No. Set it to No before deactivating to keep least privilege."
  - q: "Where can I see who elevated access?"
    a: "In Microsoft Entra audit logs (preview), filter Service to Azure RBAC (Elevated Access) under Monitoring > Audit logs. Azure activity logs hold similar information, and a Sentinel template named Azure RBAC (Elevate Access) can create incidents."
---

A Global Administrator in Microsoft Entra ID does not automatically have access to Azure subscriptions. When no one holds access to a subscription, or access must be fixed tenant-wide, the Global Administrator can elevate access. This guide follows Microsoft Learn's article on elevating access and focuses on doing it safely.

## What elevation does

Setting the toggle assigns the **User Access Administrator** role at **root scope (`/`)**. That lets the person view all resources and assign access in any Azure subscription or management group in the tenant. Microsoft Entra and Azure RBAC are secured independently, so elevation does not give Azure roles in Entra ID.

Learn stresses that the setting is per user. You can't elevate all Global Administrators at once.

## Elevate in the portal

1. Sign in to the Azure portal as a Global Administrator. If you use Privileged Identity Management (PIM), activate the role first.
2. Browse to **Microsoft Entra ID** > **Manage** > **Properties**.
3. Under **Access management for Azure resources**, set the toggle to **Yes**.
4. Select **Save**.
5. Sign out and sign in again to refresh your access.
6. Confirm the **User Access Administrator** assignment at root scope on the **Access control (IAM)** page.

Only Global Administrators see the toggle.

## Remove elevated access

1. Sign in as the same user who elevated access.
2. Browse to **Microsoft Entra ID** > **Manage** > **Properties**.
3. Set **Access management for Azure resources** back to **No**.

Learn says you can't remove the root-scope assignment from the IAM page. The portal blocks it and directs you to the toggle, PowerShell, Azure CLI or the REST API. I did not verify exact command syntax for those options, so copy the commands from the Learn page itself.

## Best practices from the page

- **Remove access promptly.** Keep elevated access only as long as you need root-scope changes.
- **PIM caveat.** Deactivating your Global Administrator role does not reset the toggle to No. Set it to No before you deactivate, to keep least privilege.
- **Treat elevated users as a risk.** Microsoft recommends removing unnecessary elevated access.

## See who still has elevated access

Two options in the portal:

- In **Microsoft Entra ID** > **Properties**, look for the banner that says how many users have elevated access and select **Manage elevated access users**.
- On a subscription's **Access control (IAM)** page, look for the **Action required** banner and select **View role assignments**.

To remove users in the **Users with elevated access** pane, set the toggle to **Yes**, select users and select **Remove**. Learn says this capability is being rolled out in stages, so it may not appear in your tenant yet.

## Logging

- **Microsoft Entra audit logs (preview).** Go to **Monitoring** > **Audit logs**, filter **Service** to **Azure RBAC (Elevated Access)** and export as JSON. Entries include that the user has elevated their access to User Access Administrator, and that the assignment was removed.
- **Azure activity logs** hold similar information, but Learn says the Entra audit logs are easier to filter and export.
- **Microsoft Sentinel.** Install the **Microsoft Entra ID** solution, enable the **Audit Logs** connector and create a rule from the **Azure RBAC (Elevate Access)** template to generate incidents.

## When to use it

Learn frames elevation as for administrators who need to manage all subscriptions and management groups in the tenant. For routine work, assign roles at the narrowest suitable scope and avoid leaving elevation on.

## A safe routine

1. Activate Global Administrator through PIM if you use it.
2. Elevate, sign in again and make the specific root-scope change.
3. Set the toggle back to **No** before deactivating the role.
4. Check the Entra audit log for your own elevation and removal events.
5. Review the **Users with elevated access** banner periodically.

## Not covered by the page

I did not read details about elevation for guest users or about conditional access effects on the toggle. If you depend on those, confirm them in the current documentation.

## Quick reference

| Question | Answer from Learn |
| --- | --- |
| Who sees the toggle? | Users with the Global Administrator role in Entra ID |
| What role is assigned? | User Access Administrator at root scope (`/`) |
| Is it tenant-wide? | No, it is per user |
| Does it grant Azure roles in Entra ID? | No, Entra and Azure RBAC are secured independently |
| Where do I remove it? | The same toggle, as the same user, or PowerShell, Azure CLI or REST API |
| Can I remove it on the IAM page? | No, the portal blocks it |
| Does deactivating PIM reset it? | No, set the toggle to No first |

## After you elevate

Once the toggle is on and you have signed in again, you can view all resources and assign access in any subscription or management group. Learn names these as the purpose of elevation. Keep the work narrow: make the specific role assignment, confirm it, then switch the toggle off. Because other Global Administrators may also have left their toggle on, use the **Manage elevated access users** banner now and then to see who else holds root-scope access.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)

## Sources

- [Elevate access to manage all Azure subscriptions and management groups](https://learn.microsoft.com/azure/role-based-access-control/elevate-access-global-admin)
