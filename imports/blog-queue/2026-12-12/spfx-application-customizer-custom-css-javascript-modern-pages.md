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

Microsoft's modern customization guidance lists what is not supported: custom master pages, custom page layouts, user custom actions with custom JavaScript, programmatic changes to navigation elements and sandboxed solutions. By default a modern team site has scripting turned off, and custom JavaScript cannot be enabled through classic options such as user custom actions. The page says it is possible and supported to turn off the NoScript setting, but it does not recommend JavaScript or CSS injection as a workaround.

For the replacement, Microsoft says to use the SharePoint Framework to change the experience, with client-side web parts or SharePoint Framework Extensions. For plain branding without code, apply a theme or change the logo. The page notes it was last updated in 2022, so check the SPFx documentation for current build tooling.

The pages read do not describe injecting CSS or manipulating the page DOM directly. They describe placeholders and supported APIs, so stay with those.

## Create the Application Customizer

In a new folder, run the Yeoman generator:

```console
yo @microsoft/sharepoint
```

Microsoft's walkthrough answers the prompts like this:

- Solution name: your choice, for example `app-extension`
- Client-side component type: **Extension**
- Extension type: **Application Customizer**
- Customizer name: for example `HelloWorld`

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

Run `heft start`. It serves the manifest from `https://localhost:4321` and opens the browser with the required query parameters. When the page asks, select **Load debug scripts**. Older tutorials show gulp. Microsoft's current pages use Heft.

## Package and deploy

Microsoft's deployment article describes three activation options: Feature Framework activation on specific sites, tenant-scoped deployment, and tenant-wide deployment for app catalog extensions.

For site-level activation:

1. Check `config/package-solution.json`. The article removes `clientsideinstance.xml` from `elementManifests` and keeps `elements.xml`.
2. Confirm `sharepoint/assets/elements.xml` uses your component ID, the location `ClientSideExtension.ApplicationCustomizer` and HTML-encoded JSON in `ClientSideComponentProperties`.
3. Build and package: `heft build`, then `heft package-solution`. The package is `sharepoint/solution/<name>.sppkg`.
4. Upload the `.sppkg` to the tenant app catalog, in the **Apps for SharePoint** list, and select **Enable app**.
5. On the target site, select the gear icon, choose **Add an app** and add the solution.

The tutorial still serves scripts from `https://localhost:4321` until you ship them, so keep the dev server running while you check. For production, the pages read do not walk through the production bundle step in detail, so follow Microsoft's current SPFx deployment guidance for hosting the assets.

## Activate on many sites

`ClientSideInstance.xml` is used for tenant-wide deployment. It adds an entry to the Tenant-Wide Extensions list on the tenant app catalog site, and the list supports Application Customizers and list view command sets. When a solution is installed at site level, the file is ignored. Application Customizers support Site, Web and List scopes, and Microsoft notes that Feature XML based registration works only at web or list level.

## Common mistakes

- **Using the wrong ID.** The GUID in `serve.json` and `elements.xml` must be the `id` from your own manifest. Microsoft stresses that the sample GUID differs in every solution.
- **Skipping the placeholder check.** If `tryCreateContent` returns nothing, the page does not offer that placeholder, and the code must stop cleanly.
- **Writing unescaped values into `innerHTML`.** Use `escape()` for any property that comes from configuration.
- **Editing the constructor.** Put start-up logic in `onInit()` only.
- **Expecting a classic workaround to work.** If a requirement cannot be met with placeholders and supported APIs, raise it as a design question instead of re-enabling scripting on the site.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint Framework](https://www.m365.fm/entity/sharepoint-framework/)
- [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/)

## Sources

- [Microsoft Learn: Customize modern SharePoint team sites](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/modern-experience-customizations-customize-sites)
- [Microsoft Learn: Build your first SharePoint Framework Extension (Hello World)](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/build-a-hello-world-extension)
- [Microsoft Learn: Use page placeholders from Application Customizer](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/using-page-placeholder-with-extensions)
- [Microsoft Learn: Deploy your extension to SharePoint](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/serving-your-extension-from-sharepoint)
