---
title: "SharePoint Just-in-Time Access with Entra PIM: What Works and What Delays"
summary: "How to use Microsoft Entra Privileged Identity Management for just-in-time SharePoint access: PIM for Groups for site membership, PIM for roles for SharePoint Administrator, settings, and the 24-hour delay trap."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [sharepoint, privileged-identity-management, microsoft-entra]
keypoints:
  - "Two different jobs exist: just-in-time site access through PIM for Groups, and just-in-time admin rights through the SharePoint Administrator role."
  - "For the SharePoint Administrator role, Learn advises PIM for Entra roles. Eligible group membership with a role-assigned group can delay access by up to 24 hours."
  - "Any security group or Microsoft 365 group can be enabled in PIM for Groups, except dynamic groups and groups synchronized from on-premises."
  - "Eligible users need a Microsoft Entra ID P2 or ID Governance license. Group role settings allow an activation duration of 1 to 24 hours."
  - "Once a group is managed by PIM it cannot be taken out, and group owners can still change it through other interfaces."
faq:
  - q: "Why do I get Access denied in SharePoint right after activating a PIM role?"
    a: "Microsoft Learn's SharePoint troubleshooting article says this can happen when the SharePoint Administrator role was granted through PIM for Groups. Permissions can take up to 24 hours to propagate. A Privileged Role Administrator can make the user eligible for the role directly, or add the user to a group and make the group eligible."
  - q: "Can I use PIM for Groups for SharePoint site membership?"
    a: "The pages read describe PIM for Groups for any Microsoft Entra security group or Microsoft 365 group, except dynamic and on-premises synchronized groups. They do not contain a dedicated walkthrough for SharePoint sites, so test the combination in your tenant."
  - q: "What do eligible users need in terms of licensing?"
    a: "According to Microsoft Learn, every user eligible for membership or ownership in PIM for Groups needs a Microsoft Entra ID P2 or Microsoft Entra ID Governance license."
  - q: "How long can an activation last?"
    a: "The PIM for Groups role settings let an admin set the maximum activation duration with a slider from 1 to 24 hours. Learn does not state a default."
  - q: "Can a group be removed from PIM again?"
    a: "No. Microsoft Learn states that once a group is managed in PIM, it cannot be taken out of management. It also notes that admins and group owners can change groups through other interfaces, which can override PIM changes."
---

Just-in-time access to SharePoint with Microsoft Entra Privileged Identity Management (PIM) means two different designs, and Microsoft documents a different warning for each. For admin rights, use PIM for Microsoft Entra roles and assign the SharePoint Administrator role as eligible. For access to the content of a site, put people into a group through PIM for Groups and make the group a member or owner of the site. The first design has a documented delay trap. The second has no dedicated SharePoint walkthrough on the Learn pages that were read, so it needs a test.

## Decide which problem you have

| Goal | PIM feature | Notes from Microsoft Learn |
|---|---|---|
| Temporary SharePoint admin rights | PIM for Microsoft Entra roles | Avoid eligible group membership that is tied to a role-assigned group |
| Temporary membership of a site | PIM for Groups | Group must be a security group or Microsoft 365 group, not dynamic and not synchronized from on-premises |

Learn is explicit about SharePoint: to avoid activation delays, use PIM for Microsoft Entra roles instead of PIM for Groups to provide just-in-time access to SharePoint, Exchange or the Microsoft Purview portal.

## Design A: SharePoint Administrator through PIM

The SharePoint troubleshooting article describes the symptom: an "Access denied" error in SharePoint or OneDrive after activating the SharePoint Administrator role in PIM. The cause is a role assigned to a group while the user is eligible to activate membership of that group. Permissions can then take up to 24 hours to propagate.

The fix is on the assignment side. A Privileged Role Administrator should use one of these:

- Make the user eligible for the role without using a group.
- Add the user to a group and make the group eligible for the role.

The article does not give a time frame for the direct approach. It only says access is available as soon as possible after activation. It also says nothing about site collection administrator rights, so those are not covered.

## Design B: Site membership through PIM for Groups

### 1. Pick the right group

Learn states that any Microsoft Entra security group and any Microsoft 365 group can be enabled in PIM for Groups, except dynamic membership groups and groups synchronized from an on-premises environment. The group does not need to be role-assignable. Role-assignable groups are only required if the group will hold a Microsoft Entra role.

How the group connects to a site follows the normal SharePoint rules. In a group-connected team site, owners and members of the Microsoft 365 group become site owners and members. Communication sites use the Owners, Members and Visitors SharePoint groups, and individual users, security groups and Microsoft 365 groups can be added to them. Microsoft 365 groups have no view-only access, so visitors on a team site must be added directly to the Visitors group.

One consequence: membership of a Microsoft 365 group gives access to the group's other connected services as well, not only to the site.

### 2. Bring the group under PIM

1. Open the Microsoft Entra admin center and go to **ID Governance** > **Privileged Identity Management** > **Groups**.
2. Select **Discover groups** and choose the group.
3. Select **Manage groups** and **OK**.

Learn lists the required permissions. For non-role-assignable groups, roles such as Groups Administrator or Identity Governance Administrator work, as does being an active owner of the group. Two cautions: a managed group cannot be taken out of management, and groups in Restricted Management Administrative Units are not supported.

### 3. Set the activation rules

Open the group in PIM, select **Settings**, choose **Member** or **Owner**, then **Edit**. Learn lists these activation options:

- Activation maximum duration from 1 to 24 hours.
- Require justification.
- Require ticket information (information only, no ticketing check).
- Require multifactor authentication or a Conditional Access authentication context.
- Require approval, with at least one approver selected. Learn recommends at least two.

Each group has one policy for membership and one for ownership.

### 4. Assign eligibility

1. In the group, select **Assignments** > **Add assignments**.
2. Choose **Member** or **Owner**, select the users and select **Next**.
3. Set **Assignment type** to **Eligible**.
4. Select **Assign**.

Assignments cannot be shorter than five minutes and cannot be removed within five minutes of being assigned. Every eligible user needs a Microsoft Entra ID P2 or Microsoft Entra ID Governance license.

### 5. Activate when needed

Users go to **ID Governance** > **Privileged Identity Management** > **My roles** > **Groups** (or aka.ms/pim), select **Activate**, and complete MFA or a justification if required. Learn says PIM adds the active assignment within seconds. It also warns that application access might not immediately reflect the change, and some apps may need a new sign-in.

## What the pages do not cover

- How long a SharePoint site takes to honor a freshly activated group membership. Learn only gives the 24-hour figure for the SharePoint Administrator role scenario.
- Removing standing access. Direct site permissions that already exist stay in place unless someone removes them, so audit them before calling the site JIT-protected. This is a practical point, not a statement from Learn.

## Typical mistakes

- Using PIM for Groups for the SharePoint Administrator role and then expecting instant access.
- Leaving group ownership open. Learn notes that admins and group owners can manage groups through other interfaces, overriding changes made in PIM.
- Using a dynamic or synchronized group, which cannot be enabled.
- Skipping approval for groups that elevate into roles. Learn recommends approval for eligible member assignments there.

## Related

- [Microsoft Entra Privileged Identity Management (PIM)](https://www.m365.fm/entity/privileged-identity-management/)
- [Microsoft Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [Error when accessing SharePoint or OneDrive after role activation in PIM (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/troubleshoot/administration/access-denied-to-pim-user-accounts)
- [Privileged Identity Management for Groups (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/concept-pim-for-groups)
- [Bring groups into Privileged Identity Management (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-discover-groups)
- [Assign eligibility for a group in PIM (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-assign-member-owner)
- [Configure PIM for Groups settings (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-role-settings)
- [Activate group membership or ownership in PIM (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-activate-roles)
- [Site permissions in the SharePoint modern experience (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions)
