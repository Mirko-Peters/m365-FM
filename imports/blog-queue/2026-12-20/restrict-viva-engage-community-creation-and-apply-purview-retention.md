---
title: "Restrict Who Can Create Viva Engage Communities and Apply Purview Retention to Viva Engage Messages"
summary: "How community creation in Viva Engage follows Microsoft 365 Groups creation settings, how to restrict it, and how Microsoft Purview retention policies treat Viva Engage messages, with the gaps the Learn pages leave open."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [viva-engage, microsoft-365-groups, microsoft-purview-data-lifecycle-management, retention-policies]
keypoints:
  - "Learn says you cannot disable Viva Engage communities connected to Microsoft 365 Groups, but you can manage who can create Microsoft 365 Groups. Groups made by restricted users are not connected."
  - "Restricting group creation affects all group-based services, such as Outlook, SharePoint, Teams and Planner. The archived Learn guide uses one allowed-creators group and Graph PowerShell."
  - "Admins in certain roles keep their ability to create groups. Managing who creates groups needs Microsoft Entra ID P1 or P2 for the admin and the allowed creators."
  - "Purview retention for Viva Engage uses the Viva Engage community messages and Viva Engage user messages locations. Files, and emoticon reactions, are not covered."
  - "Retention deletion is not immediate. Learn describes a timer job of up to seven days and a SubstrateHolds step, so a one-day delete can take about 16 days."
faq:
  - q: "Can I turn off Viva Engage communities connected to Microsoft 365 Groups?"
    a: "No. Learn says you cannot disable them, but you can manage who can create Microsoft 365 Groups. A new creation policy does not retroactively change groups that are already connected. It only affects new groups."
  - q: "What happens to communities created by users who are restricted from creating groups?"
    a: "Learn says groups created by people who are restricted from creating Microsoft 365 groups are not Microsoft 365 connected. Only groups with at least one admin who has group creation privileges can connect."
  - q: "Which Viva Engage content do retention policies cover?"
    a: "Viva Engage user messages (including storyline posts) and community messages, plus hyperlinks and links to other messages. Learn says files used with Viva Engage and emoticon reactions are not included in Viva Engage retention policies."
  - q: "Why do deleted messages stay visible or discoverable after retention expires?"
    a: "Learn describes a timer job that takes up to seven days, then a move to the SubstrateHolds folder before permanent deletion. Holds, other retention policies or eDiscovery holds can suspend permanent deletion, and the Viva Engage app does not accurately show what is retained."
  - q: "Are external or guest users covered by Viva Engage retention?"
    a: "By default a retention policy for Viva Engage user messages applies to all users in your organization but not external users. Learn says you can apply it to external accounts via Edit, and that Azure B2B guest users are not supported."
---

Viva Engage does not have its own switch for who may create communities. Microsoft Learn ties community creation to Microsoft 365 Groups creation, so you restrict it by restricting who can create Microsoft 365 Groups. Retention is a separate task: you configure Microsoft Purview retention policies for the **Viva Engage community messages** and **Viva Engage user messages** locations. This article covers both, and lists the points Learn does not cover. One source for the group restriction is an archived page, which is marked below.

## How community creation is controlled

From the Learn page on Viva Engage and Microsoft 365 Groups:

- If your network is eligible, communities connected to Microsoft 365 Groups are used. Creating such a community in Viva Engage also creates a Microsoft 365 group and a new SharePoint site and document library.
- Learn says you cannot disable connected communities, but you can [manage who can create Microsoft 365 Groups](https://learn.microsoft.com/en-us/previous-versions/microsoft-365/solutions/manage-creation-of-groups).
- Groups created by people who are restricted from creating Microsoft 365 groups are not Microsoft 365 connected.
- For eligibility, the community owner must have Microsoft 365 Group creation privileges (by default every Microsoft 365 user does), the community must be public or private internal, and it must have an owner and members.
- A new creation policy does not retroactively change groups that are already connected. It only affects new groups.
- Naming policy applies. Community names cannot contain the characters `@`, `#`, `[`, `]`, `<` and `>`. If the naming policy includes any of them, regular users cannot create communities.

## Restrict group creation

The Learn guide on managing who can create Microsoft 365 Groups is archived and marked retired, and its canonical address is under previous-versions. The steps below are what it describes, so verify them against current Microsoft guidance before you use them in production.

What the guide states:

- By default all users can create Microsoft 365 groups, and Learn calls that the recommended approach.
- Limiting creation affects all services that rely on groups, including Outlook, SharePoint, Viva Engage, Microsoft Teams, Planner, Power BI (classic) and Project for the web or Roadmap.
- You can restrict creation to the members of one Microsoft 365 group or security group. Only one group can control this, but other groups can be nested in it.
- The restriction cannot stop certain admin roles. Learn lists Exchange Administrator, Groups Administrator, SharePoint Administrator, Teams Service Administrator, User Administrator, Directory Writers and partner support roles, each with specific places where they can still create groups. Global admins can create groups in the Microsoft 365 admin center, Planner, Exchange and SharePoint, but not in other places such as Teams.
- The admin who configures the setting and the members of the group allowed to create groups need Microsoft Entra ID P1 or P2, or Microsoft Entra Basic Education licenses.

Steps from the guide:

1. In the Microsoft 365 admin center, open **Groups**, select **Add a Group**, choose the type, and add the people or groups who may create groups as members (not owners).
2. Run the Microsoft Graph PowerShell **Beta** script from the page. It signs in with `Connect-MgGraph -Scopes "Directory.ReadWrite.All", "Group.Read.All"`, sets `EnableGroupCreation` to `False` and `GroupCreationAllowedGroupId` to the ID of your group in the `Group.Unified` directory setting.
3. Wait. Learn says changes can take 30 minutes or more. Test with a restricted user in Planner, where creating a plan should show that plan and group creation is disabled, and with a member of the allowed group.

To lift the restriction, the guide says to rerun the script with an empty group name and `$AllowGroupCreation` set to true.

The Viva Engage page adds a check for eligibility: in the Viva Engage admin center, go to **Network Admin** > **Security Settings**, where the **Microsoft 365 Connected Viva Engage Groups** status should show **Enabled**.

## Apply retention to Viva Engage

From the Learn page on retention for Viva Engage:

- Viva Engage user messages and community messages can be retained and deleted by retention policies. Storyline posts count as user messages. Hyperlinks and links to other Viva Engage messages can be retained too.
- Emoticon reactions are not retained, and files used with Viva Engage are not covered. Files have their own retention policies.
- Messages are included only in a retention policy configured for the **Viva Engage community messages** or **Viva Engage user messages** locations, even though they are stored in Exchange. Data is copied to hidden folders in user or group mailboxes.
- Copies of community messages can be stored in user mailboxes when they mention users or notify of a reply. So a policy for user messages often includes copies of community messages.
- To create the policy, Learn points to the general guide for creating and configuring retention policies.

### How deletion actually runs

- After a policy is configured, a timer job from the Exchange service evaluates items and takes up to seven days to run. Expired items move to the SubstrateHolds folder and are then permanently deleted.
- Permanent deletion is suspended if the mailbox has another Viva Engage retention policy for the same location, a Litigation Hold, a delay hold or an eDiscovery hold.
- A delete after one day can take up to 16 days before the message no longer appears in eDiscovery searches, according to Learn's example.
- Users can keep seeing messages in the app for a short time because of delays or caching, and Learn says messages visible in the app do not accurately show what is retained or deleted. Verify with eDiscovery tools.
- When a retention delete reaches Viva Engage, the message is deleted for all users in the conversation. Users from another organization, or with a longer policy, keep copies in their mailboxes until another policy deletes them.

### Users, guests and leavers

- By default the user messages policy covers all users in your organization but not external users. Azure B2B guest users are not supported, and Learn tells you not to select guests and nonmailbox users when you choose **Edit** for the user messages location.
- If you delete the mailbox of a user covered by an active policy, it becomes an inactive mailbox to retain the data. Exclude the account first if you do not need it retained.
- If a user leaves and their account is deleted, their messages stay subject to the retention policy in an inactive mailbox.

## What the documentation does not say

The pages read do not describe a Viva Engage setting that restricts community creation by itself, and the one detailed guide for restricting group creation is archived. They also do not list Purview licensing for Viva Engage retention, and they do not say how retention interacts with specific community types beyond the points above. Check current Microsoft guidance and test in a pilot community before you apply an organization-wide policy. That testing advice is the author's own.

## Related

- [Viva Engage](https://www.m365.fm/entity/viva-engage/)
- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)

## Sources

- [Viva Engage and Microsoft 365 Groups (Microsoft Learn)](https://learn.microsoft.com/en-us/viva/engage/engage-microsoft-365-groups)
- [Manage who can create Microsoft 365 Groups, archived (Microsoft Learn)](https://learn.microsoft.com/en-us/previous-versions/microsoft-365/solutions/manage-creation-of-groups)
- [Learn about retention for Viva Engage (Microsoft Learn)](https://learn.microsoft.com/en-us/purview/retention-policies-viva-engage)
