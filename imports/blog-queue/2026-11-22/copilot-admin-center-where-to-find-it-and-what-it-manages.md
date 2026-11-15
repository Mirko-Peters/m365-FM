---
title: "Copilot Admin Center: Where to Find It and What You Can Manage"
summary: "Where the Copilot admin console lives in the Microsoft 365 admin center, which role you need, and what each settings category controls, from user access and agents to web search and diagnostics."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [copilot, microsoft-365-admin-center, copilot-chat]
keypoints:
  - "Microsoft documents no separate Copilot admin center. The controls sit under Copilot > Settings in the Microsoft 365 admin center at admin.microsoft.com."
  - "AI Administrator is the role Microsoft names for managing Copilot settings. Global Reader can view the settings but not change them."
  - "Settings are grouped into User access, Data access, Copilot actions and Other settings. Some entries only link to another admin center."
  - "Agents are managed under Data access and on the Agents page. Deployment and blocking sit under Settings > Integrated apps."
  - "Which settings you see depends on licenses, rollout status and plan, so a missing setting is not always a permission problem."
faq:
  - q: "Is there a separate Copilot admin center?"
    a: "Not in the pages Microsoft Learn offers for this topic. According to the Microsoft Learn article on configuring Copilot settings, you sign in to the Microsoft 365 admin center at admin.microsoft.com, expand Copilot in the left navigation and select Settings. Several entries on that page open other admin centers, such as the Teams admin center or the Microsoft Purview portal."
  - q: "Which admin role do I need for the Copilot settings?"
    a: "Microsoft Learn names AI Administrator as the appropriate role for managing Copilot settings. Global Reader can view the settings but cannot change them. Controls that open another service need that service's permissions, for example Office Apps admin for Cloud Policy settings for Microsoft 365 apps. Learn advises using the least-privileged role that does the job."
  - q: "Why can I not see a setting that the documentation describes?"
    a: "Microsoft Learn says the available settings depend on your licenses, enabled features, rollout status, tenant, location and Microsoft 365 plan. Some settings may not appear, and locations can differ from the documented ones. Check your role first, then your license and rollout state."
  - q: "Where do I control web search for Copilot Chat?"
    a: "The Copilot settings page lists Web search for Microsoft Copilot and Microsoft Copilot Chat under Data access. According to Microsoft Learn, its link creates an Allow web search in Copilot cloud policy in the Microsoft 365 Apps admin center. The Copilot Chat management page does not name a separate admin location for it."
---

The Copilot admin console is not a separate product. Microsoft puts the controls in the Microsoft 365 admin center: sign in at admin.microsoft.com, expand **Copilot** in the left navigation and select **Settings**. From there you reach four categories: **User access**, **Data access**, **Copilot actions** and **Other settings**. Some entries only link out to other admin centers, so a full Copilot setup touches more than one portal.

## How to open it

1. Go to `https://admin.microsoft.com` and sign in with an admin account.
2. In the left navigation, expand **Copilot**.
3. Select **Settings**.
4. Browse the categories. If a setting is not visible, select **View all** or **All settings**.

Microsoft Learn dates the source page to 31 October 2026. The page it describes does not mention the domain admin.cloud.microsoft, so this article uses admin.microsoft.com only.

## Roles

According to Microsoft Learn, **AI Administrator** is the appropriate role for managing Copilot settings. **Global Reader** can see the settings but cannot change them. Two further points matter in practice:

- A control that opens another service needs that service's permission. Creating Cloud Policy settings for Microsoft 365 apps, for example, requires the **Office Apps admin** role.
- Viewing Copilot licensing recommendations also needs permission to manage user licenses.

Microsoft's advice is to use the role with the fewest permissions that completes the task.

## What each category controls

### User access

This category decides who can reach Copilot features and how Copilot Chat is surfaced.

- **Copilot Frontier:** choose which users or groups can try eligible preview features.
- **Copilot pay-as-you-go billing:** set up a billing policy for eligible Copilot Chat usage under **Billing & usage** > **Pay-as-you-go services**.
- **Microsoft Copilot self-service purchases:** allow trials or purchases, allow trials only, or block self-service purchases.
- **Microsoft Copilot in admin centers:** decide whether eligible admins can use Copilot in supported admin centers.
- **Pin Copilot Chat** and **Pin the Microsoft Copilot app to the Windows taskbar:** control visibility.
- **Copilot in Edge:** opens the Microsoft Edge configuration policies.

Microsoft Security Copilot is a separate service. If its entry appears, it opens the Security Copilot portal and is not configured here.

### Data access

- **Agents:** control access to agents and which ones users can install or use. **Manage all agents** leads to more detail.
- **AI providers operating as independent processors** and **as Microsoft subprocessors:** manage third-party AI models.
- **Data security and compliance:** a shortcut to the Microsoft Purview portal.
- **Copilot in Power Platform and Dynamics 365:** a shortcut to the Power Platform admin center.
- **Web search for Microsoft Copilot and Microsoft Copilot Chat:** a link that creates an **Allow web search in Copilot** cloud policy in the Microsoft 365 Apps admin center.
- **Recommendations for Microsoft Copilot licensing:** based on eligible activity, shown in the Microsoft Copilot readiness report.
- **People Skills in Microsoft Copilot** and **Azure DevOps data in Microsoft 365 Copilot**, where available.

### Copilot actions

- **Copilot image generation:** allow or prevent supported image generation.
- **Screen and camera sharing:** manages Vision in Microsoft Copilot. Turning it off does not turn off voice.
- **Copilot in Teams meetings:** a shortcut to the Teams admin center.
- **Advanced package uploads:** controls who can upload advanced agent and plugin packages.

### Other settings

- **Copilot custom dictionary:** organization-specific vocabulary for supported Teams experiences.
- **Copilot diagnostics logs:** submit diagnostic information to Microsoft for users who cannot send feedback themselves. This temporarily overrides user-level feedback policies, so review the information before sending. US government environments have separate feedback policies.

## Controls that live outside Copilot > Settings

Learn lists several Copilot app features whose controls are elsewhere:

| Feature | Where to manage it |
|---|---|
| Search | **Settings** > **Search & intelligence**, plus item insights |
| Agents (deploy or block) | **Settings** > **Integrated apps** |
| Pages and Notebooks | Cloud Policy settings for Copilot Pages and Copilot Notebooks |
| Create | No individual settings; brand kits require a Cloud Policy |
| Copilot key on Windows | Windows policies or the Intune settings catalog |
| Other Chat controls | The Microsoft Copilot Chat management article |

For agents specifically, Learn describes the **Agents** page in the Microsoft 365 admin center. Admins can enable, disable, assign, block or remove agents, review agent requests and view shared agents with creator and availability status. The page names no specific role for these tasks.

## Copilot Chat: removing or limiting access

The Copilot Chat management article describes four layers: unpin it, restrict the Copilot app in **Integrated apps** to licensed users, limit Copilot Chat in Teams through app permission and app setup policies, and block the Edge sidebar app with the `EdgeMicrosoft365CopilotChatIconEnabled` policy. It warns that users can still reach `m365.cloud.microsoft/chat` even when Copilot Chat is not pinned. Blocking through Integrated apps is tenant-wide, can be scoped to users or groups, and also blocks licensed users.

## Common mistakes

- **Looking for one console.** The settings are spread across the Microsoft 365 admin center, Teams admin center, Purview, Power Platform admin center and the Microsoft 365 Apps admin center.
- **Using Global Administrator for everything.** Learn recommends the least-privileged role.
- **Assuming a missing setting means a permission gap.** Licenses and rollout state also change what appears.

## Limits of the sources

The Microsoft Learn page on Copilot management controls could not be retrieved while this article was prepared. The page on configuring Copilot settings does not mention the Copilot Control System. Check that area directly in your tenant before relying on it.

## Related

- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Learn: Configure Microsoft Copilot settings in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-copilot-admin-center)
- [Microsoft Learn: Manage Microsoft Copilot Chat](https://learn.microsoft.com/en-us/copilot/manage)
- [Microsoft Learn: Manage agents for Copilot in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-plugins-for-copilot-in-integrated-apps)
