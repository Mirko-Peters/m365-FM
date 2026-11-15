---
title: "Sales Agent (Copilot for Sales): Dataverse Security Roles for Custom Roles and Boundaries"
summary: "Which Dynamics 365 and Dataverse security roles the Sales agent (formerly documented as Copilot for Sales) needs, how to build custom roles, and which boundaries Microsoft Learn documents for tenants, guests and propagation."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [dynamics-365-sales, dataverse-security-roles, dataverse, salesforce]
keypoints:
  - "Out-of-the-box Dynamics 365 roles need no work. System Administrator and System Customizer get the admin privileges, Salesperson and Sales Manager get the seller privileges."
  - "For custom roles, assign the Sales Copilot Administrator or Sales Copilot User role, or copy the listed table privileges into the custom role."
  - "Sales Copilot User complements a custom seller role. If the custom role lacks privileges that Salesperson has, expect Dynamics 365 permission errors."
  - "After a role change, users sign out and in again in Outlook. Changes can take up to 15 minutes to show in Teams."
  - "The agent uses Microsoft Entra ID, so access stays within one tenant. Guest users cannot use it."
faq:
  - q: "Do I need to change anything for the standard Dynamics 365 roles?"
    a: "No. Microsoft Learn says that for the out-of-the-box System Administrator, System Customizer, Salesperson and Sales Manager roles the Sales agent privileges are added automatically."
  - q: "What is the difference between Sales Copilot Administrator and Sales Copilot User?"
    a: "Per the Learn privileges page, for a custom admin role you either assign Sales Copilot Administrator or add the listed administration privileges, for example on msdyn_vivaorgsetting and connectionreference. For a custom seller role you either assign Sales Copilot User or add the listed seller privileges, for example on msdyn_taggedrecord and msdyn_crmconnection."
  - q: "Why do users with a custom seller role get permission errors?"
    a: "Learn states that the Sales Copilot User role complements custom roles and does not replace them. If a custom seller role misses any privilege that the Salesperson or Sales Manager role has, errors related to Dynamics 365 permissions can occur. Edit the custom role to match the built-in role."
  - q: "Does the Sales agent work across tenants or for guest users?"
    a: "The Learn deployment guide says it does not support multiple tenants because it authenticates with Microsoft Entra ID, so access is limited to environments in the same tenant. Guests added to a tenant cannot access it."
  - q: "Does Learn cover field-level security or business units for the Sales agent?"
    a: "The pages I read do not mention field-level security or business units. They only say the Sales agent applies your existing CRM access controls. Check your Dataverse security design separately."
---

The Sales agent applies the access controls that already exist in your CRM. If you use the standard Dynamics 365 roles, there is nothing to configure. If you use custom roles, each admin and seller role needs the privileges Microsoft lists, and Learn points to matching the built-in roles. This article follows Microsoft Learn's privileges page.

Naming note: the Learn pages I read call the product **Sales agent**. The URL path still says `microsoft-sales-copilot`, and older material uses **Copilot for Sales**. The topic is the same.

## What Learn says about access

The Sales agent needs two kinds of permission. Administrators need rights to customize the CRM. Sellers need rights to view, update and create CRM records from the agent. It supports Dynamics 365 Sales and Salesforce, and it is not available on Dynamics 365 Customer Engagement (on-premises).

## Dynamics 365 administrators

For **System Administrator** or **System Customizer**, the administration privileges are added automatically.

For a custom admin role, either assign the **Sales Copilot Administrator** security role or add privileges to your role. Learn lists these tables:

| Table | Access level |
|---|---|
| msdyn_vivausersetting | Organization (full set including Assign and Share) |
| msdyn_vivaorgextensioncred, msdyn_vivaorgsetting, msdyn_vivaentitysetting | Organization (Create, Read, Write, Delete, Append, Append to) |
| User (systemuser) | Organization, Read |
| organization | Global, Read, Write, Append to |
| dvtablesearch, dvtablesearchentity, connectionreference, copilotglossaryterm, copilotsynonyms | Global |
| Recently Used (recentlyused) | User |

The page lists the exact privilege per table. Copy from the page, not from this summary.

## Dynamics 365 sellers

For **Salesperson** or **Sales Manager**, nothing needs to be done.

For a custom seller role, assign the **Sales Copilot User** role or add the listed privileges. They include these tables:

- Tagged Record (msdyn_taggedrecord), External Record, External CRM and CRM Connection at user level, with Organization-level Read on some of them
- msdyn_vivausersetting at user level
- msdyn_vivaorgsetting and msdyn_vivaentitysetting with Read at Organization level
- Note (annotation), User and Recently Used
- dvtablesearchentity, copilotglossaryterm and copilotsynonyms with Read at Global level

The caveat matters most in practice. Sales Copilot User complements your custom role. If your custom role lacks any privilege that Salesperson or Sales Manager has, you can get Dynamics 365 permission errors. Open the built-in role, compare it with yours and close the gap.

## Salesforce customers

Salesforce admins need **Modify All Data** or **Manage Data Integrations** on the user profile, not through a permission set. They also need Read and Write on the Organization table.

In the Dataverse environment named **msdyn_viva**, admins need the **System Administrator** role plus **Sales Copilot Administrator** (or privileges added to the Copilot for Sales Extended User role). Users of the agent in Microsoft 365 Copilot need Read privileges on dvtablesearchentity, copilotglossaryterm and copilotsynonyms to the Viva Sales (Sales Productivity App), as Learn words it.

To assign the roles in msdyn_viva:

1. Sign in to the Power Platform admin center.
2. Select **Manage** > **Environments** and open the **msdyn_viva** environment.
3. Select **Settings** > **Users + permissions** > **Users**.
4. Select the user, then **Manage security roles**.
5. Pick **System Administrator** and **Sales Copilot Administrator**, then **Save**.

## Boundaries to plan for

- **Propagation.** After you change roles in the CRM, users sign out of the Sales agent in Outlook and sign in again. Changes can take up to 15 minutes to appear in Teams.
- **Tenant boundary.** The agent does not support multiple tenants and guests cannot use it.
- **Admin settings visibility.** Learn says administrator settings are visible only when you sign in with administrator credentials: System Administrator or System Customizer for Dynamics 365, or Modify All Data or Manage Data Integrations on the Salesforce user profile. With a custom Dynamics 365 role you might need more privileges.
- **Regions.** The introduction page lists regions where it is unavailable, including GCC and DoD. Check it before rollout.
- **Licensing.** The Learn deployment guide lists a Microsoft 365 Copilot license per user. The introduction page names no SKU and refers to the Product Terms.

## A practical order of work (my own suggestion)

1. Compare each custom role against Salesperson or Sales Manager, and System Administrator or System Customizer.
2. Add the Sales Copilot roles to a test user first.
3. Ask the test user to sign out and back in, then wait up to 15 minutes before testing in Teams.
4. Roll out to the real role set.

Learn gives no guidance on narrowing the Sales agent below your normal Dataverse access model. Keep any such restriction in your Dataverse roles and test it, instead of assuming the agent adds its own limits.

## Where admins change settings

You open the Sales personal app in Outlook or Teams, sign in with administrator credentials and select the **Settings** tab. The settings apply to the CRM environment you sign in to. To customize another environment, switch to that environment first. Learn lists tenant-level settings (Copilot AI, Collaboration spaces), environment-level settings (Copilot AI, Access settings, Save to (CRM), Forms, Custom AI instructions) and features (Sales Agent - Lead Research, Meeting insights, Sales Chat).

If the tab asks you to connect to your CRM to view settings, Learn says to select **Connect to CRM** and follow the steps. The current Learn page names no screen-size or theme limits for the settings tab.

The Dynamics 365 deployment guide also lists related steps outside roles: create a Teams setup policy to install and pin the agent, enable Teams meeting transcription, and set up server-side synchronization of emails and appointments so Outlook activities can be saved to Dynamics 365.

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Microsoft Learn: Privileges required to use Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/privileges)
- [Microsoft Learn: Administrator settings for Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-sales-app)
- [Microsoft Learn: Welcome to Sales agent](https://learn.microsoft.com/en-us/microsoft-sales-copilot/introduction)
- [Microsoft Learn: Sales agent deployment guide for Dynamics 365 customers](https://learn.microsoft.com/en-us/microsoft-sales-copilot/deploy-sales-app-d365)
