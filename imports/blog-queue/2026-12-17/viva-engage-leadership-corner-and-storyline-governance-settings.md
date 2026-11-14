---
title: "Viva Engage Leadership Corner and Storyline Governance: Settings, Roles and Audit Options"
summary: "How to control who can post to storyline, who counts as a leader, which audiences leaders reach and who holds the admin roles in Viva Engage, plus the compliance tools Microsoft documents for storyline content."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [viva-engage, viva, governance]
keypoints:
  - "Storyline is managed in the Engage admin center under Feature management > Storyline. The Specify storyline creators setting limits who gets a storyline feed."
  - "Leaders are identified under Feature management > Leadership identification and audiences. Group changes do not update leaders automatically."
  - "Only admins and corporate communicators can let a leader reach the entire organization. A leader can have up to 40 audiences."
  - "Leadership corner is on by default and can be switched off by an Engage admin. The Leaders entry point then disappears."
  - "Storyline content can be handled with eDiscovery, network export, retention and Communications Compliance, like community content."
faq:
  - q: "How do I limit who can post to storyline?"
    a: "According to Microsoft Learn, go to the Engage admin center, Feature management, Storyline, select Edit in Advanced Settings and switch Specify storyline creators to Eligible users from selected group. Choose a security group, mail-enabled security group, distribution list or Microsoft 365 group. Viva Engage checks group membership daily, and backend membership changes can take up to 24 hours to apply."
  - q: "Does limiting storyline creators hide storyline content from other users?"
    a: "No. Microsoft Learn says the setting controls who has a storyline feed and who can create posts, but not who can view, react or reply. Learn also states that you cannot prevent an internal user with Viva Engage access from seeing storyline content, and guests cannot see any."
  - q: "Who can identify leaders?"
    a: "Microsoft Learn lists Engage admins, corporate communicators, Verified admins and Network admins. Learn adds that identified leaders need a license such as Viva Engage, Viva Engage Core or the Viva Engage Communities and Communications service plan, and only the last gives access to storyline announcements, leadership corner, campaigns and AMAs."
  - q: "Can I turn off leadership corner?"
    a: "Yes. Microsoft Learn says leadership corner is on by default and an Engage admin can turn it off with the toggle under Feature management, Leadership corner. After that, users no longer see the Leaders entry point in the top navigation."
  - q: "What happens to storyline posts when storyline is disabled?"
    a: "Per Microsoft Learn, a user without storyline cannot create posts and loses the Storyline tab, but earlier conversations remain visible in the All activity feed and in search. Content stays available through network data export and eDiscovery."
---

Governing leadership corner and storyline in Viva Engage means four decisions: who may post to storyline, who is a leader, which audiences each leader may reach, and who holds the admin roles that make these changes. All four live in the Engage admin center, and Microsoft Learn documents the settings, limits and compliance tools.

## Step 1: Decide who gets a storyline

Open the Engage admin center from the settings gear, select **Admin Center**, then **Feature management** > **Storyline**. The **Manage storyline** page controls whether storyline is available. When storyline is enabled, internal users with Viva Engage access see a Storyline tab on their profile, and the feature also appears in Microsoft Teams. Learn says guests have no storyline and cannot see storyline content. Storyline is supported only in networks that enforce Microsoft 365 identity, and it is not available in Viva Engage Basic networks.

By default all internal users can post to their own storyline. To limit this:

1. Go to **Feature management** > **Storyline** and select **Edit** under **Advanced Settings**.
2. Switch **Specify storyline creators** to **Eligible users from selected group**.
3. Select the group. Security groups, mail-enabled security groups, distribution lists and Microsoft 365 groups are supported.

Learn says changes take effect within minutes, while membership changes in the group can take up to 24 hours. The setting does not restrict who can view, react or reply. You also cannot hide storyline content from internal users with Viva Engage access.

In the same area you can set default notification channels. By default, storyline notifies users in Viva Engage, Teams and by email when people they follow post. Network and verified admins can change these defaults, and users can adjust them per person.

## Step 2: Identify leaders

Leader identification is the requirement for storyline announcements, campaigns, audience analytics and leadership corner. Under **Feature management**, select **Leadership identification and audiences**. On the **Manage leaders** page, select **Add leaders** and pick users or groups.

Learn notes that later changes to a group do not update the leaders list. Re-add the group to pick up new members. The people who may identify leaders are Engage admins, corporate communicators, Verified admins and Network admins. A license is needed for the leader as described in the FAQ above.

## Step 3: Control the audiences

Select the pencil icon on a leader's row to open **Manage audiences**. A leader can reach:

- The entire organization, excluding guests. Learn says only Engage admins, Verified admins, Network admins and corporate communicators can switch this on. Leaders and delegate managers cannot.
- One or more audiences, built from users or groups. A leader can add up to 40 audiences. Group membership changes, including nested members, update the audience within 24 hours.
- Spoke tenants, in a multitenant organization, with the hub tenant toggle.

If a leader is set for the entire organization but has no audiences, that leader and delegates see no audience analytics data. Each storyline announcement automatically notifies the selected audiences.

Delegates and delegate managers are set by the leader under **Manage delegate settings** in the Viva Engage Teams app. A delegate can post on the leader's behalf. A delegate manager can also configure audiences and assign more delegates. Because delegate managers can change audiences, review who holds that role. If a delegate must post on the leader's storyline, the storyline toggle has to be enabled.

## Step 4: Decide on leadership corner

Leadership corner is on by default. An Engage admin can turn it off under **Feature management** > **Leadership corner**. After that, the **Leaders** entry point disappears from the top navigation. Leadership corner lets users read leaders' posts, join their communities and attend their AMAs.

## Step 5: Assign the right admin roles

Learn's roles page lists who can do what:

| Role | Relevant permissions |
|---|---|
| Engage Administrator | Configures all of Viva Engage, sets up storylines, identifies leaders, assigns Corporate Communicator, Network and Verified admin roles. Assigned in Microsoft Entra ID. |
| Verified Administrator | Identifies leaders, manages content policies, retention and data export. |
| Network Administrator | Manages storyline creation access and default notifications, enables or disables leadership corner, views the activity log on the leadership page, can delete conversations. |
| Corporate Communicator | Defines leaders, views the leadership activity log, manages official campaigns. |

Learn also says Global Administrators and Engage administrators do not need a Viva Engage license to use the admin center. Assign the narrowest role that covers the task.

## Step 6: Audit and retain

The leadership page includes an activity log for the past 30 days. It shows who added or removed leaders and who changed audiences, and when.

For content, Learn says storyline uses the same platform as community messages, so the same tools apply:

- eDiscovery in the Microsoft Purview portal for Microsoft Entra networks.
- Network export.
- Retention and Communications Compliance, with AI-based monitoring (E5).
- The Report a conversation feature.
- OneDrive governance for attached files, which are stored in a hidden library in the author's OneDrive. Learn advises not to add, replace or delete those files directly in OneDrive.

For objectionable content, Learn suggests deleting the conversation or blocking the user.

## Typical mistakes

- Assuming a creator group also limits who can read storyline.
- Expecting leader lists to follow group membership.
- Giving a delegate manager role without realizing it changes audiences.
- Forgetting the license distinction, so leaders without the Communities and Communications plan cannot send announcements.
- Editing storyline files directly in OneDrive.

## What the sources do not say

The pages read for this article do not describe a way to require approval before a storyline post is published, and they do not describe a size limit for the organization-wide audience. Storyline governance therefore relies on creator groups, role control, auditing and after-the-fact moderation.

## Related

- [Viva Engage](https://www.m365.fm/entity/viva-engage/)
- [Viva](https://www.m365.fm/entity/viva/)
- [Governance](https://www.m365.fm/entity/governance/)

## Sources

- [Manage and set up storyline in Viva Engage](https://learn.microsoft.com/en-us/viva/engage/eac-storyline)
- [Identify leaders and manage audiences in Viva Engage](https://learn.microsoft.com/en-us/viva/engage/leadership-identification)
- [Manage admin roles in Viva Engage](https://learn.microsoft.com/en-us/viva/engage/eac-key-admin-roles-permissions)
