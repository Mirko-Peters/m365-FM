---
title: "Dynamics 365 Sales Hierarchical Forecasts: Fix Rollups That Show Zero, Blank or Stale Values"
summary: "How hierarchical forecasts roll up in Dynamics 365 Sales, which settings Microsoft Learn says drive the rollup, and a checklist of documented causes when values show zero, stay stale or the forecast will not activate."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [dynamics-365-sales, dataverse-hierarchy-security, dataverse-security-roles]
keypoints:
  - "Forecasts use a rollup entity, a hierarchy entity plus a relationship. Only entities with change tracking can be rollup entities, and only hierarchy-enabled ones can be hierarchy entities."
  - "Forecasting supports up to two levels of relationships between the rollup and the hierarchical entity, for example Opportunity to Owner (User) to Territory."
  - "Learn lists field-level security as a cause of zero values. The Dynamics 365 Sales Forecasting user needs Read permission in the field security profile."
  - "The prediction column recalculates automatically every seven days and cannot be recalculated manually. Other data can be recalculated with Recalculate data."
  - "Territory hierarchy can be disabled by system updates. Learn says to re-enable Hierarchical on the territory_parent_territory relationship."
faq:
  - q: "Why do forecast columns show 0 for everyone?"
    a: "Learn says the columns behind Selector, Amount field and Date field might have field-level security enabled. Grant Read permission to the Dynamics 365 Sales Forecasting user in the field security profile, then recalculate the forecast."
  - q: "Why can the forecast not be activated?"
    a: "Learn lists two checks. If the forecast has a hierarchy-related lookup column, the Dynamics 365 Sales Forecasting user needs organization-level Read on that entity. Also make sure hierarchy filters do not filter out the entire hierarchy, which you can check in the Preview section of the General step."
  - q: "Why does a territory-based forecast show an error or not refresh?"
    a: "According to Learn, system updates can disable the hierarchy on the territory entity. Re-enable the Hierarchical option on the territory_parent_territory relationship in the classic customization area."
  - q: "Can I recalculate the prediction column manually?"
    a: "No. Learn says the prediction column is recalculated automatically every seven days and does not support manual recalculation, because it is based on AI-driven models using historical data and the open pipeline."
  - q: "Why do Won and Lost opportunities stay in the old pipeline bucket?"
    a: "Learn attributes this to the Opportunity Forecast Category Mapping Process workflow being disabled. Activate it and check its conditions for each forecast category. Opportunities changed before activation must be corrected manually."
---

Hierarchical forecasts in Dynamics 365 Sales usually show wrong numbers for configuration or permission reasons, not because the rollup math is broken. Microsoft Learn documents the model behind the rollup and a list of known causes, such as field-level security, a disabled workflow or a deactivated process. This article orders those causes into a checklist. It does not describe the internal calculation, because the pages read do not.

## How the rollup is defined

According to the Learn page on custom rollup entities, a forecast is configured by selecting a rollup entity, a related hierarchical entity and a relationship between them. Two notes matter for troubleshooting:

- Only entities with **Change Tracking** enabled can be used as a rollup entity.
- Only hierarchy-enabled entities can be used as a hierarchy entity.

Forecasting supports up to two levels of relationships between them, for example Opportunity, Owner (User), Territory, Territory. For complex models such as opportunity product or opportunity split, the key attributes are distributed. The product forecast uses Opportunity Product as the rollup entity and Product as the hierarchy entity, with forecast category and estimated close date from the related Opportunity. For the opportunity split model, you create the custom entity first, because it is not available by default. Its columns must be configured manually, and you cannot proceed until all columns are configured.

If no direct relationship exists, the **Related** tab lets you choose a related attribute. If no relationships exist, the tab is empty and you cannot configure the forecast.

## Checklist

Work through these in order. All items come from the Learn forecasting troubleshooting page unless noted.

### 1. Values show 0 or blank

The columns for **Selector**, **Amount field** and **Date field** might have field-level security enabled. Learn says that otherwise the column shows 0 for all users. Fix:

1. Go to **Settings** > **Advanced Settings** > **Security** > **Field Security Profiles**.
2. Select the profile for the field that shows 0.
3. Select **Users** > **Add** and add the **# Dynamics 365 Sales Forecasting** user.
4. Under **Field Permissions**, grant **Read**.
5. Save, then recalculate the forecast.

### 2. The forecast does not activate

- If the forecast uses a hierarchy-related lookup column, the Dynamics 365 Sales Forecasting user needs Read permission. Learn says to open the **Forecast AppUser** role and enable **Read** at the organization level for the lookup field's entity type.
- Check that mandatory configuration is complete and that hierarchy filters do not remove the entire hierarchy. Use the **Preview** section in the **General** step.

### 3. Territory forecast errors or no refresh

System updates can disable the hierarchy on the territory entity even if you enabled it. Learn describes the fix in the classic customization area: select **Territory**, open **Relationships**, select **Parent**, select the **Hierarchical** check box in the many-to-one dialog and save. The path starts at **Advance settings** > **Settings** > **Customization** > **Customizations**.

### 4. The grid will not load or drill-down fails

- The error "Action (ForecastInstanceActions) for fetching forecasts has been disabled" means the **ForecastInstanceActions** process is deactivated. Learn says an owner change in the organization might cause it. Activate it under **Settings** > **Process Center** > **Processes**.
- A "Something went wrong" error on drill-down means the role lacks privileges for the **Forecast Configuration** entity. Grant Read on the **Custom Entities** tab.

### 5. Categories do not move

If opportunities stay in the previous pipeline bucket after being set to Won or Lost, activate the **Opportunity Forecast Category Mapping Process** workflow. Learn also says to open the workflow and verify the conditions for each forecast category.

### 6. Managers cannot see a forecast

Learn says a user must be the owner, be in a role with read permission configured in the **Permissions** step, or have the forecast shared. If the **Owner lookup field** in the Permissions step is **None**, no one can view the forecast.

### 7. Forecast configuration is not visible

Learn lists missing Read permission on the forecast configuration entity, or the forecast grid and configuration not being added under **Performance Management** in the site map. It names the Forecast Manager security role for users who manage configurations. If you cannot view forecasts at all after an upgrade, Learn points to an unmanaged layer of the Sales Hub app that can keep the old site map.

### 8. Custom script blocks the grid

If the underlying grid is read-only on load, a custom JavaScript configured in the forecast configuration might disable it.

## Recalculation

Learn says forecast data is recalculated automatically at regular intervals, and past and future periods are not automatically recalculated. To recalculate manually:

1. Open the forecast and check **Last updated** on the command bar.
2. Select **Recalculate data**.
3. When the notification appears, select **Refresh page**.

The prediction column is the exception. It is recalculated automatically every seven days and cannot be recalculated manually. Learn suggests keeping **Forecast Category** values in sync with the opportunity **Status** to keep predictions accurate.

## What the documentation does not say

The pages read do not explain how parent and child forecasts are summed internally, how adjustments by managers interact with rollups, or any per-level limits beyond the two levels of relationships between rollup and hierarchy entities. Treat any claim about those details as unverified until you test it in a sandbox.

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [Dataverse hierarchy security](https://www.m365.fm/entity/dataverse-hierarchy-security/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)

## Sources

- [Troubleshoot issues with forecasting (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/sales/troubleshoot-forecast-issues)
- [Configure a forecast using custom rollup entity (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/configure-forecast-using-custom-rollup-entity)
- [Recalculate forecasts manually (Microsoft Learn)](https://learn.microsoft.com/en-us/dynamics365/sales/keep-forecast-data-up-to-date)
