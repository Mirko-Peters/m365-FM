---
title: "Provision SharePoint Site Designs and Site Scripts With PnP PowerShell"
summary: "Create a site script, register it as a site design and apply it to new or existing sites with PnP PowerShell, including documented limits, WebTemplate values, scoping and what the cmdlet pages do not say."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [pnp-powershell, sharepoint, sharepoint-site-provisioning]
keypoints:
  - "A site script is a JSON list of actions. A site design, now also called a site template, runs one or more scripts in order on a Team or Communication site."
  - "Limits on Learn: 100 site scripts and 100 site designs per tenant, 30 actions per script for synchronous runs, and 300 actions or 100,000 characters for asynchronous runs."
  - "Add-PnPSiteScript takes Title and Content as a JSON string. Add-PnPSiteDesign takes Title, WebTemplate and SiteScriptIds. The cmdlets need access to the SharePoint tenant administration site."
  - "Get-PnPSiteScriptFromWeb can export a script from an existing site, which is a quick way to start. Invoke-PnPSiteDesign applies a design to an existing site."
  - "Scripts are non-destructive and re-runnable, and a design is visible to everyone unless you restrict it with Grant-SPOSiteDesignRights."
faq:
  - q: "What is the difference between a site script and a site design?"
    a: "Microsoft Learn describes a site script as a JSON file with an ordered list of actions, and a site design as the registered configuration that runs one or more scripts on a Team or Communication site. Learn also says site designs were renamed site templates, though the old name remains in cmdlets."
  - q: "What are the limits for site scripts and designs?"
    a: "Learn lists 100 site scripts and 100 site designs per tenant. A script can have 30 actions when run synchronously, and 300 actions or 100,000 characters when run asynchronously, for example from the site creation UI."
  - q: "Which WebTemplate values can I use?"
    a: "The PnP cmdlet page lists TeamSite, CommunicationSite, GrouplessTeamSite and ChannelSite. Learn's site template article shows the numeric values 64 for Team site, 1 for Team site without group creation, 68 for Communication site and 69 for channel site."
  - q: "Can I apply a design to a site that already exists?"
    a: "Yes. Learn says modern group-connected Team and Communication sites can have a template applied through the UI, REST API or PowerShell. In PnP PowerShell, Invoke-PnPSiteDesign applies a design by ID or name to a site given with WebUrl."
  - q: "Does the PnP documentation say whether Invoke-PnPSiteDesign runs synchronously?"
    a: "No. The PnP cmdlet page does not say whether it runs synchronously or asynchronously or how completion is reported. Learn describes Invoke-SPOSiteDesign as synchronous, with the 30 action limit, so test the PnP cmdlet on a non-production site first."
---

To provision a site design with PnP PowerShell, connect to the tenant, create a site script from JSON with `Add-PnPSiteScript`, register it with `Add-PnPSiteDesign` and apply it with `Invoke-PnPSiteDesign` or let users pick it when they create a site. The cmdlets need access to the SharePoint tenant administration site. A site script is non-destructive and can be re-run, so it suits repeatable provisioning.

## What the pieces are

Per Microsoft Learn:

- A **site script** is a JSON file that defines an ordered list of actions, such as `applyTheme`, `createSPList` and `addSPField`. Actions run in the listed order.
- A **site design** registers a configuration that runs one or more site scripts, passed as an array of IDs. Learn says site designs were renamed site templates, and the old name may still appear in cmdlets and scripts.
- Designs are registered to a modern template site type: Team site or Communication site. Only SharePoint Online supports them.

Scripts are re-runnable. Running a script again on a site adds only the missing fields to an existing list with the same name.

## Limits to design around

| Item | Limit on Learn |
|---|---|
| Site scripts per tenant | 100 |
| Site designs per tenant | 100 |
| Actions per script, synchronous run | 30 |
| Actions per script, asynchronous run | 300 actions or 100,000 characters |

Split large provisioning into several scripts. A design can run several scripts, and they execute in the order you list.

## Step 1: Connect

```powershell
Connect-PnPOnline -Url https://yourtenant-admin.sharepoint.com
```

The PnP cmdlet pages list access to the SharePoint tenant administration site as the permission for `Add-PnPSiteScript`, `Add-PnPSiteDesign`, `Set-PnPSiteDesign`, `Get-PnPSiteScriptFromWeb` and `Invoke-PnPSiteDesign`. How you authenticate with your own app registration is a separate topic and not covered here.

## Step 2: Write or export the site script

You can write the JSON by hand. A minimal example, based on Learn's sample:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/site-design-script-actions.schema.json",
  "actions": [
    { "verb": "applyTheme", "themeName": "Contoso Explorers" },
    {
      "verb": "createSPList",
      "listName": "Customer Tracking",
      "templateType": 100,
      "subactions": [
        { "verb": "setDescription", "description": "List of Customers and Orders" },
        { "verb": "addSPField", "fieldType": "Text", "displayName": "Customer Name", "isRequired": false, "addToDefaultView": true }
      ]
    }
  ],
  "version": 1
}
```

Or export one from a model site with `Get-PnPSiteScriptFromWeb`. The cmdlet requires at least one include option or the `-Lists` parameter. According to the PnP page:

- `-IncludeBranding`, `-IncludeTheme`, `-IncludeRegionalSettings` and `-IncludeSiteExternalSharingCapability` add those components.
- `-IncludeLinksToExportedItems` adds navigation links.
- `-IncludeAllLists` includes lists that are not hidden, private, internal or catalogs. `-Lists` names lists by site-relative URL.
- `-IncludeAll` includes all supported components.

Review the exported JSON before you register it, since it reflects the model site as it is.

## Step 3: Register the script and the design

```powershell
$script = Get-Content .\site-script.json -Raw
Add-PnPSiteScript -Title "Contoso customer tracking" -Description "Theme and tracking list" -Content $script
Get-PnPSiteScript    # copy the ID

Add-PnPSiteDesign -Title "Contoso team site" -WebTemplate TeamSite `
  -SiteScriptIds "YOUR-SCRIPT-ID" -Description "Standard team site setup" `
  -ThumbnailUrl "https://contoso.example.com/images/design.png"
```

Documented parameter details:

- `-WebTemplate` accepts TeamSite, CommunicationSite, GrouplessTeamSite and ChannelSite. Learn's site template article shows the numeric forms 64, 1, 68 and 69 for the SPO cmdlets.
- `-IsDefault` marks a design as a default design.
- `-ThumbnailUrl` sets the picker image, recommended at 400 x 300 pixels. Give URLs with spaces as they are, without `%20`. `-PreviewImageUrl` and `-PreviewImageAltText` no longer have any function.
- `Set-PnPSiteDesign` updates an existing design by `-Identity`, with `-Title`, `-WebTemplate`, `-SiteScriptIds` and `-Version`.

You can also pipe from an existing site in one line: `Get-PnPSiteScriptFromWeb -IncludeAllLists | Add-PnPSiteScript -Title "..." | Add-PnPSiteDesign -Title "..." -WebTemplate TeamSite`, as the PnP page shows.

The PnP `Add-PnPSiteScript` page lists only title, description and content. It does not list a version parameter.

## Step 4: Apply the design

There are three documented ways to apply it:

1. **At site creation.** Users choose it in the site template gallery under the **From your organization** tab. A design marked as default applies automatically. Owners can change it under **Settings** > **Apply a site template**.
2. **On an existing site.** `Invoke-PnPSiteDesign -Identity <id-or-name> -WebUrl <site-url>` applies a tenant design. If a name matches several designs, all of them are applied. Learn says modern group-connected Team and Communication sites can have a template applied this way.
3. **With a flow.** The `triggerFlow` action starts a Power Automate flow, which can hand work to an Azure function that runs the PnP provisioning engine. Learn's example needs the HTTP request trigger, which is a premium feature, and says the PnP provisioning engine is open source without a Microsoft SLA.

The PnP page for `Invoke-PnPSiteDesign` does not state whether it runs synchronously. Learn describes the SPO equivalent as synchronous with the 30-action limit and `Add-SPOSiteDesignTask` as the asynchronous option. Test on a non-production site before relying on large scripts.

## Control who sees a design

By default, a design is visible to everyone. Learn documents `Grant-SPOSiteDesignRights` to restrict visibility to specific users or mail-enabled security groups, for example `-Rights View`. The site template experience cannot currently be disabled.

For channel sites, Learn lists actions that are blocked automatically: applying a theme, adding links to quick launch or hub navigation, setting regional settings, adding principals to SharePoint roles and setting external sharing capability.

## Typical mistakes

- Exceeding the action limit for a synchronous run. Split the script or apply it asynchronously.
- Using the preview image parameters, which no longer work.
- Expecting a design to change an existing site's lists destructively. Scripts add missing items.
- Forgetting that the design applies after site creation, so branding may show up a minute later.

## Related

- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)
- [SharePoint site provisioning](https://www.m365.fm/entity/sharepoint-site-provisioning/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [SharePoint site templates and site scripts overview (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-overview)
- [Calling the PnP provisioning engine from a site design (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-pnp-provisioning)
- [Add-PnPSiteDesign (PnP PowerShell documentation)](https://pnp.github.io/powershell/cmdlets/Add-PnPSiteDesign.html)
- [Add-PnPSiteScript (PnP PowerShell documentation)](https://pnp.github.io/powershell/cmdlets/Add-PnPSiteScript.html)
- [Set-PnPSiteDesign (PnP PowerShell documentation)](https://pnp.github.io/powershell/cmdlets/Set-PnPSiteDesign.html)
- [Invoke-PnPSiteDesign (PnP PowerShell documentation)](https://pnp.github.io/powershell/cmdlets/Invoke-PnPSiteDesign.html)
- [Get-PnPSiteScriptFromWeb (PnP PowerShell documentation)](https://pnp.github.io/powershell/cmdlets/Get-PnPSiteScriptFromWeb.html)
