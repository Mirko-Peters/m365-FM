---
title: "Users Cannot Create Teams or Microsoft 365 Groups: Check Group Creation Restrictions"
summary: "Why users cannot create Microsoft 365 groups or teams, using Microsoft Learn: the Entra setting for group creation, the older allowed-group method with EnableGroupCreation, roles that can still create groups, delays, and what the pages do not say about Teams."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [microsoft-365-groups, teams, entra-id]
keypoints:
  - "In the Microsoft Entra admin center the setting is Users can create Microsoft 365 groups in Azure portals, API or PowerShell. Learn says changes can take up to 15 minutes."
  - "The older allowed-group method uses the Group.Unified settings EnableGroupCreation and GroupCreationAllowedGroupId. Its page is archived and says changes can take 30 minutes or more."
  - "Some roles can still create groups, such as Groups Administrator, User Administrator and Teams Service Administrator, depending on the location."
  - "The Entra page does not say whether the setting governs creation from Teams, Outlook or Planner, so test that in your tenant."
  - "The archived page says the admin who configures the allowed-group method and the members allowed to create groups need Entra ID P1 or P2 or Basic Education licenses."
faq:
  - q: "Where do I change who can create Microsoft 365 groups?"
    a: "According to Microsoft Learn, in the Microsoft Entra admin center go to Microsoft Entra ID, All groups, Groups, then General settings, and set Users can create Microsoft 365 groups in Azure portals, API or PowerShell to Yes or No."
  - q: "How long does a change take?"
    a: "The Entra page says these settings can take up to 15 minutes to take effect. The archived Microsoft 365 page says 30 minutes or more."
  - q: "Can some admins still create groups when creation is restricted?"
    a: "According to Microsoft Learn, yes. Roles such as Groups Administrator, User Administrator, SharePoint Administrator and Teams Service Administrator can create groups in the locations the page lists."
  - q: "Does the restriction stop service principals?"
    a: "According to Microsoft Learn, the settings are for users and do not affect service principals. A service principal with group-creation permissions can still create groups."
---

When users cannot create Microsoft 365 groups or teams, check two things: the group creation setting in Microsoft Entra, and the older allowed-group restriction that limits creation to members of one group. This guide combines the Microsoft Learn article on self-service group management in Entra with the Microsoft 365 article on managing group creation. The Microsoft 365 article is marked as archived and retired, so treat it as background.

## Default behavior

The Microsoft 365 article says that by default all users can create Microsoft 365 groups, and calls this the recommended approach because users can start collaborating without IT help. If your business needs restrictions, you can limit creation to members of a specific Microsoft 365 group or security group. Limiting creation affects the services that rely on groups, including Outlook, SharePoint, Viva Engage, Microsoft Teams, Planner, Power BI (classic) and Project for the web or Roadmap.

## Check 1: The Entra setting

On the Entra page, the steps are:

1. Sign in to the Microsoft Entra admin center as at least a Global Administrator.
2. Select **Microsoft Entra ID**.
3. Select **All groups**, **Groups**, and then **General** settings.
4. Check **Users can create Microsoft 365 groups in Azure portals, API or PowerShell**.

With **Yes**, all users in the organization can create Microsoft 365 groups. With **No**, users cannot create them, but they can still manage membership of groups they own and approve join requests. Learn says the settings can take up to 15 minutes to take effect. To allow only some users, the page suggests assigning a role that can create groups, such as Groups Administrator.

For Microsoft Graph, the page says to configure the `EnableGroupCreation` object in the `groupSettings` object. It gives no code sample.

The page does not state whether this setting governs group creation from Teams, Outlook, Planner or SharePoint. It does not give the default value or say which role besides Global Administrator can change it. Test creation from each app in your tenant.

## Check 2: The allowed-group method

The Microsoft 365 article describes limiting creation to one group. You create the allowed group in the Microsoft 365 admin center and add people or groups as members, not owners. Only one group can control creation, but you can nest other groups in it. A script using the Microsoft Graph PowerShell Beta module then sets two group settings values:

- `EnableGroupCreation` set to false
- `GroupCreationAllowedGroupId` set to the ID of the allowed group

To change the allowed group, run the script again with the new group name. To allow everyone again, clear the group name and set `EnableGroupCreation` to true. The page text shows `"$true"` in quotes while the script default is the string `"False"`, so copy the script from the page and test it in a non-production tenant first.

Learn says to verify after at least 30 minutes by trying to create a plan in Planner as a user outside the group, which should show that plan and group creation is disabled. If members of the allowed group still cannot create groups, the page suggests checking whether their OWA mailbox policy blocks it, using `Set-OwaMailboxPolicy`.

## Who can still create groups

The archived page says the steps cannot stop members of some roles from creating groups. Global Administrators can create groups through the Microsoft 365 admin center, Planner, Exchange and SharePoint, but not through other locations such as Teams. It lists these roles and locations:

| Role | Locations |
|---|---|
| Exchange Administrator | Exchange admin center, Microsoft Entra ID |
| Partner Tier 1 and Tier 2 Support | Microsoft 365 admin center, Exchange admin center, Microsoft Entra ID |
| Directory Writers | Microsoft Entra ID |
| Groups Administrator | Microsoft Entra ID |
| SharePoint Administrator | SharePoint admin center, Microsoft Entra ID |
| Teams Service Administrator | Teams admin center, Microsoft Entra ID |
| User Administrator | Microsoft 365 admin center, Microsoft Entra ID |

These admins can create groups for restricted users and assign them as owners. Microsoft recommends the least privileged roles and limiting Global Administrator to emergencies.

## Licenses

The archived page says the admin who configures these settings and the members allowed to create groups need Microsoft Entra ID P1 or P2, or Microsoft Entra Basic Education licenses. Members who cannot create groups do not need them. The Entra page separately says P1 or P2 is needed for join requests and owner approval.

## Suggestion: a checking order

This section is a practical suggestion and not a Microsoft statement.

1. Ask which app the user tried and what message appeared.
2. Check the Entra setting and whether the allowed-group method is also in use.
3. Check whether the user is in the allowed group and whether the change is older than 30 minutes.
4. Check the user's role, since some roles can create groups.
5. Test creation from the same app with a second user.

## Not covered

The pages I read do not describe the following:

- Whether the Entra setting governs creation from Teams, Outlook or Planner.
- A path in the Entra admin center for the allowed-group method.
- How Teams creation is governed beyond the general statement.
- Current Microsoft guidance that replaces the archived page. The Entra page does not link to the allowed-group method.
- The default value of the Entra setting.

## Related

- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Set up self-service group management (Microsoft Learn)](https://learn.microsoft.com/entra/identity/users/groups-self-service-management)
- [Manage who can create Microsoft 365 Groups (Microsoft Learn)](https://learn.microsoft.com/previous-versions/microsoft-365/solutions/manage-creation-of-groups)
