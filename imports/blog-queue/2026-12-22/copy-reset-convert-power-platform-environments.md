---
title: "Copy, Reset and Convert Power Platform Environments: Admin Guide"
summary: "How to copy, reset and convert a Power Platform environment in the admin center: what each action deletes or keeps, who can run it, the limits Learn lists, and what to review after a copy."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [power-platform-admin-center, power-platform-environment]
keypoints:
  - "Copy has two levels: Everything (data, users, customizations) or Customizations and schemas only. The target is overwritten and the data cannot be recovered."
  - "You cannot overwrite production environments, and you cannot copy from or to a default or trial environment. Source and target must share tenant and region."
  - "Reset works only on sandbox and developer environments and permanently deletes apps, flows, custom connectors, connections and backups."
  - "Convert changes only between production and sandbox, using Convert to production or Convert to sandbox in the command bar."
  - "After a copy the target is in administration mode with background operations off. Review flows, connections, email sync and SharePoint before turning them on."
faq:
  - q: "What is the difference between Everything and Customizations and schemas only?"
    a: "According to Microsoft Learn, an Everything copy includes all application data, users, customizations and schemas from the source. A Customizations and schemas only copy includes users, customizations and schema, and it truncates a long list of tables such as Account, Contact, Email and Lead."
  - q: "Can I copy a production environment over another production environment?"
    a: "No. Learn says the target appears in the Select environment to overwrite list only if it can be overwritten, and production environments are not offered. You also cannot copy from or to a default or trial type environment."
  - q: "How long does a copy take?"
    a: "Learn says copy and restore operations can take up to 8 hours. If a lot of data, including audit data, has to be copied, they can take up to 24 hours. Copying audit logs is off by default because it adds to the time."
  - q: "Which environments can be reset?"
    a: "Only sandbox and developer environments, according to the Learn page on resetting. A reset deletes components such as canvas apps, flows, custom connectors, connections and backups, and the deleted data cannot be recovered."
  - q: "Can I convert a trial or developer environment to production?"
    a: "The Learn page on changing environment type describes only two conversions: production to sandbox and sandbox to production. The pages I read do not describe converting trial or developer environments, so check the environment type in the admin center before you plan on it."
---

Copy, reset and convert are three separate actions in the Power Platform admin center, and they do very different things. Copy overwrites a sandbox or preview environment with the content of another environment. Reset deletes a sandbox or developer environment and reprovisions it empty. Convert only flips the type between production and sandbox. This guide describes each action as Microsoft Learn documents it, including the limits that tend to surprise admins.

## Before you start

You need the **Environment Admin** or **System Administrator** role. Microsoft Learn says Environment Admins or System Administrators can copy all available environments, and a system administrator can copy environments where that person holds one of those two roles.

All three actions start in the same place:

1. Sign in to the Power Platform admin center at admin.powerplatform.microsoft.com.
2. In the navigation pane, select **Manage**.
3. Select **Environments**, then select the environment.

## Copy an environment

Select **Copy** in the top menu bar. You then choose one of two levels.

**Everything** copies all application data, users, customizations and schemas. Learn lists user acceptance testing, upgrade testing, preview in production and training as typical uses.

**Customizations and schemas only** copies users, customizations and schema, but no business data. Learn lists it as suitable for iterative team development, partner or ISV solutions and proof of concept. The page lists many tables that are truncated in this mode, for example Account, Contact, Email, Lead, Opportunity and Audit.

### Copy steps

1. Select **Copy** and choose the copy level.
2. For **Everything**, decide whether to copy audit logs. Under **Audit logs**, select **Change this** and enable it. Learn says this is not done by default because it can add significantly to the time.
3. Select a target environment in **Select environment to overwrite**.
4. Optionally restrict access to a security group with **Edit**.
5. Select **Copy**, then **Confirm** to overwrite the target.

The warning on the page is blunt: data, components and customizations in the target are deleted and replaced, and deleted data can't be recovered.

### Limits Learn lists for copy

- The target can be a sandbox or preview environment, not production. A sandbox or preview environment can be promoted to production after the copy.
- Copy works only within the same tenant and region.
- If the environment is enabled for Virtual Network support, you can copy only to an environment in the same enterprise policy.
- You can't copy from or to a default or trial type environment. For a Trial (subscription-based) source, the target must be of the same type.
- Components that are not in a solution, such as canvas apps, flows, custom connectors and connections, might not be part of the copy.
- For each canvas app, only up to 20 of the most recent revisions are copied.
- Copy and restore can take up to 8 hours, or up to 24 hours with a lot of data.

If a copy fails, the target is left disabled. Learn says to wait 30 minutes and retry with the same failed environment as the target. Reset, delete or restore are the other options for it.

## What to do after a copy

After the copy, the target is in administration mode, so only users with the System Administrator role can sign in. Background operations, including workflows and Exchange synchronization, are disabled. Learn's reason: a mailbox can't be synced with two different environments.

Learn recommends reviewing every component with an external connection:

- **Email.** In an Everything copy, set synchronization for incoming email, outgoing email, and appointments, contacts and tasks to None.
- **SharePoint.** Deactivate the site or redirect it to a sandbox site under Documentation Management settings.
- **Plug-ins, custom workflow activities, JavaScript and iframes.** Check whether they write to production services.
- **Flows.** Existing solution flows in the target are deleted, non-solution flows remain, and flows start disabled. Run history is not copied. Flows with the HTTP request trigger get a new URL. Enable child flows before parent flows.
- **Connection references.** They need new connections.
- **Custom connectors.** They get a new identifier and look like new connectors, so flows must be pointed at them.
- **Dataverse search.** If results look wrong, Learn suggests turning search off for 12 hours and back on to refresh the index.

## Reset an environment

Reset is for sandbox and developer environments when you want to start a new project, free up storage or remove personal data. Learn states you can only reset those two types.

1. Select the environment and choose **Reset** in the top menu bar.
2. On the **Reset environment** page, adjust the environment settings as needed and select **Reset**.
3. Select **Confirm**.

A reset permanently deletes canvas apps, flows, custom connectors, connections and backups. The environment returns to factory settings.

## Convert an environment type

Learn describes two conversions: production to sandbox and sandbox to production. The command bar shows **Convert to production** or **Convert to sandbox**. Select it, choose **Continue**, then confirm with **OK**.

Administration mode matters here. Learn notes that in an environment in administration mode only System Administrator or System Customizer users can sign in, and after conversion to production all users can access the organization.

## Which action fits (my summary)

| Goal | Action | Key effect |
| --- | --- | --- |
| Test a change against realistic data | Copy, Everything | Target overwritten with data and users |
| Give developers a data-free copy | Copy, Customizations and schemas only | Schema and users, selected tables truncated |
| Start clean or remove personal data | Reset | Sandbox or developer environment reprovisioned empty |
| Go live from a tested sandbox | Convert to production | Environment type changes, all users get access |

## Common mistakes (my advice)

- Expecting a production target in the overwrite list. It will not appear.
- Forgetting that unsolutioned apps and flows may be missing after a copy. Put assets into solutions first.
- Leaving email sync active in a copy, which can conflict with production.
- Resetting the wrong environment. Learn says reset deletes backups too and that deleted data can't be recovered.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform environment](https://www.m365.fm/entity/power-platform-environment/)

## Sources

- [Copy an environment (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/copy-environment)
- [Reset an environment to delete and reprovision (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/reset-environment)
- [Change environment type (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/switch-environment)
