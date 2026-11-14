---
title: "Custom CSS and JavaScript on Modern SharePoint Pages: Use an SPFx Application Customizer"
summary: "How to add custom script and styles to modern SharePoint pages the supported way: an SPFx Application Customizer with header and footer placeholders, local testing, packaging and site or tenant-wide deployment."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [sharepoint, sharepoint-framework]
keypoints:
  - "Modern team sites have scripting turned off, and Microsoft says custom JavaScript via user custom actions is not supported there."
  - "Microsoft points to SharePoint Framework Extensions as the controlled way to add script and UI to modern pages."
  - "An Application Customizer renders into the Top and Bottom placeholders, which you get with placeholderProvider.tryCreateContent."
  - "Test on a live modern page with heft start and serve.json customActions, then select Load debug scripts."
  - "Deploy through the app catalog. Site-level activation uses elements.xml, and tenant-wide deployment uses ClientSideInstance.xml."
faq:
  - q: "Can I inject JavaScript into a modern SharePoint page with a custom action?"
    a: "Microsoft's modern customization guidance lists user custom actions and custom JavaScript as not supported. It says modern team sites have scripting turned off and that SharePoint Framework Extensions provide a more controlled way to embed JavaScript on the pages."
  - q: "What is an Application Customizer?"
    a: "It is a type of SharePoint Framework extension. Microsoft Learn says its logic lives in onInit, which runs when the extension is first activated on the page, and that it can render content into placeholders such as the page header and footer."
  - q: "How do I test an Application Customizer before deploying it?"
    a: "Microsoft Learn says to test on a live SharePoint Online page, not in a workbench. Set the page URL and customActions in config/serve.json, run heft start, and select Load debug scripts when the page asks."
  - q: "How do I activate the extension on every site?"
    a: "Microsoft describes tenant-wide deployment for extensions in the app catalog, introduced in SharePoint Framework 1.6. It uses ClientSideInstance.xml, which adds an entry to the Tenant-Wide Extensions list on the tenant app catalog site."
---

For modern SharePoint pages, the supported way to add custom script and styling is a SharePoint Framework (SPFx) Application Customizer. It renders your own HTML into page placeholders, and its CSS ships inside the package as a module. Classic techniques such as user custom actions that inject script are listed by Microsoft as unsupported on modern sites. The steps below follow Microsoft Learn.

## What Microsoft says about script on modern sites

Microsoft's modern customization guidance lists what is not supported: custom master pages, custom page layouts, user custom actions with custom JavaScript, programmatic changes to navigation elements, among others. In its NoScript list the page also says sandbox solutions are not supported. By default a modern team site has scripting turned off, and custom JavaScript cannot be enabled through classic options such as user custom actions. The page also says it is possible and supported to disable the NoScript setting on both modern and classic sites to enable some capabilities.

For the replacement, Microsoft says to use the SharePoint Framework to change the experience, with client-side web parts or SharePoint Framework Extensions. The same page lists applying a custom or out-of-the-box theme and changing the logo as supported. Its custom-theme example is a PnP PowerShell script, and it says it was written before tenant themes. The page metadata dates it June 2022, so check the SPFx documentation for current build tooling.

The Hello World page says the SharePoint page HTML DOM is not an API. It tells you to avoid depending on the page DOM structure or CSS styles, because they can change and break your solution, and calls SharePoint Framework the only supported means to interact with the page DOM. My own conclusion: style your own placeholder content through the module styles and do not target SharePoint's own elements.

## Create the Application Customizer

In a new folder, run the Yeoman generator:

```console
yo @microsoft/sharepoint
```

Microsoft's walkthrough answers the prompts like this:

- Solution name: `app-extension` (the page says to keep the default for every prompt not listed)
- Client-side component type: **Extension**
- Extension type: **Application Customizer**
- Application Customizer name: `HelloWorld`

The manifest file defines the extension type and a unique ID. In the example, it sets `componentType` to `Extension`, `extensionType` to `ApplicationCustomizer` and `requiresCustomScript` to `false`. Note the `id` GUID, because testing and deployment both need it.

The customizer logic goes in `onInit()`, which runs when the extension is first activated on the page. The class constructor runs earlier, when `this.context` and `this.properties` are undefined, so Microsoft says custom initialization is not supported there.

## Render into the header and footer placeholders

Microsoft's placeholder tutorial uses these steps:

1. Install the styling package: `npm install @microsoft/sp-office-ui-fabric-core`.
2. Add an `AppCustomizer.module.scss` file with classes for the top and bottom areas.
3. Import `PlaceholderContent` and `PlaceholderName` from `@microsoft/sp-application-base`, plus your styles and `escape` from `@microsoft/sp-lodash-subset`.
4. Define an interface for the properties, for example `Top` and `Bottom` strings.
5. In `onInit()`, subscribe to `this.context.placeholderProvider.changedEvent` and render when the placeholders are ready.
6. In the render method, call `this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose })` and write into `domElement`.

Two rules from the page matter. The extension must not assume the placeholder exists, so check the return value and log an error if it is missing. And use the `styles` object rather than raw class names, because unused style references are removed during the build and the stylesheet would not reach the page. Pass property values through `escape()` before putting them into `innerHTML`, as the sample does.

## Test on a live page

Microsoft says to test the Application Customizer on a live modern page, not in a workbench. In `config/serve.json`, set `pageUrl` to a modern page and add the extension under `customActions`, keyed by the component ID:

```json
"customActions": {
  "<component-id>": {
    "location": "ClientSideExtension.ApplicationCustomizer",
    "properties": { "Top": "Top area of the page", "Bottom": "Bottom area of the page" }
  }
}
```

Run `heft start`. It serves the manifest from `https://localhost:4321` and opens the browser with the required query parameters. When the page asks, select **Load debug scripts**. The page's screenshot of the dev server is labelled as a historical Gulp-era image, and its commands use Heft.

## Package and deploy

Microsoft's deployment article describes three activation options: Feature Framework activation on specific sites, tenant-scoped deployment, and tenant-wide deployment for app catalog extensions. The page says the Feature Framework option is the only model that supports creating or deploying site-level assets as part of solution activation.

For site-level activation:

1. Check `config/package-solution.json`. The article removes `clientsideinstance.xml` from `elementManifests` and keeps `elements.xml`.
2. Confirm `sharepoint/assets/elements.xml` uses your component ID, the location `ClientSideExtension.ApplicationCustomizer` and HTML-encoded JSON in `ClientSideComponentProperties`.
3. Build and package: `heft build`, then `heft package-solution`. The package is `sharepoint/solution/<name>.sppkg`.
4. Upload the `.sppkg` to the tenant app catalog, in the **Apps for SharePoint** list, and select **Enable app**.
5. On the target site, select the gear icon, choose **Add an app** and add the solution.

The tutorial still serves scripts from `https://localhost:4321` until you ship them, so keep the dev server running while you check. For production, the pages read do not walk through the production bundle step in detail, so follow Microsoft's current SPFx deployment guidance for hosting the assets.

## Activate on many sites

`ClientSideInstance.xml` is used for tenant-wide deployment. It adds an entry to the Tenant-Wide Extensions list on the tenant app catalog site, and the list supports Application Customizers and list view command sets. When a solution is installed at site level, the file is ignored. Application Customizers support Site, Web and List scopes, and Microsoft notes that Feature XML based registration works only at web or list level. Wider activation is possible through tenant-wide deployment or by associating the customizer with the `UserCustomAction` collection on the `Site` object. The deployment page is not consistent about scope: it says it registers the customizer at site collection scope, but also says the generated elements.xml belongs to a Web-scoped feature and adds the action to `Web.UserCustomAction`.

## Common mistakes (my own list, derived from the pages above)

- **Using the wrong ID.** The GUID in `serve.json` and `elements.xml` must be the `id` from your own manifest. Microsoft stresses that the sample GUID differs in every solution.
- **Skipping the placeholder check.** If `tryCreateContent` returns nothing, the expected placeholder is not available, and the sample logs an error and returns.
- **Writing unescaped values into `innerHTML`.** Use `escape()` for any property that comes from configuration.
- **Editing the constructor.** Put start-up logic in `onInit()` only.
- **Expecting a classic workaround to work.** If a requirement cannot be met with placeholders and supported APIs, raise it as a design question instead of re-enabling scripting on the site.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint Framework](https://www.m365.fm/entity/sharepoint-framework/)
- [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/)

## Sources

- [Microsoft Learn: Customizing "modern" team sites](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/modern-experience-customizations-customize-sites)
- [Microsoft Learn: Build your first SharePoint Framework Extension (Hello World part 1)](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/build-a-hello-world-extension)
- [Microsoft Learn: Use page placeholders from Application Customizer (Hello World part 2)](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/using-page-placeholder-with-extensions)
- [Microsoft Learn: Deploy your extension to SharePoint (Hello World part 3)](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/serving-your-extension-from-sharepoint)
