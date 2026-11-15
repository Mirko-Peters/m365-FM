---
title: "Build a Component Library for Reusable Power Apps Canvas Components"
summary: "How to create a Power Apps component library, publish versions, import components into canvas apps, handle updates and local copies, and share the library, with documented limits."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [power-apps-component-library, power-apps]
keypoints:
  - "A component library is the recommended way to reuse canvas components across apps. The older import feature for components is retired."
  - "Create one in Power Apps under Component libraries > New component library, then build components in it without opening a blank app."
  - "Only published versions are available to consuming apps. Use Save with version notes so makers can review changes."
  - "The customization setting is On by default. Edit component in an app creates a local copy that no longer receives library updates."
  - "A library that an app references cannot be deleted, and code components are not supported in component libraries."
faq:
  - q: "How do I create a component library?"
    a: "According to Microsoft Learn, sign in to Power Apps, select Component libraries in the left navigation and then New component library. If it is not in the navigation, select More > Discover all > Component libraries. Name the library and create components in it."
  - q: "Why does my app not show the library components?"
    a: "Microsoft Learn says only published versions are available to consuming apps, and that if a library does not appear when importing, you should make sure it is shared with you. Import through Insert > Get more components."
  - q: "How do apps get library updates?"
    a: "Learn describes two ways. When a maker edits the app, a notification says an update is available, and they select Review and then Update. Or in the Insert panel, they select the Check for updates icon."
  - q: "What happens if I edit a component inside an app?"
    a: "If the customization setting is On, Learn says consuming apps can select Edit component, which creates a local copy. The association with the library is removed after editing, so the copy no longer receives updates."
  - q: "Can I delete a library that is in use?"
    a: "No. Microsoft Learn says a library referenced by a canvas app cannot be deleted. Remove the component from the app first and check dependencies in the solution dependencies view or the delete error message."
---

To reuse canvas components, create a component library in Power Apps, build and save components there, publish a version, and then import the components into apps through **Insert** > **Get more components**. Consuming apps keep a dependency on the library and are told when updates are available. This guide follows Microsoft Learn.

## What a component library is

Learn describes a component library as a container of component definitions that lets makers discover, search, share and update reusable components across apps. It is the recommended way to reuse components across apps. The earlier feature for importing components from one canvas app into another is retired.

A library differs from an app in a few ways:

- The **Insert** pane opens on a **Components** tab, where an app opens on **Screens**.
- Screens in a library are only for testing. Use them to check components on a real screen and to validate updates.
- Preview with the **play** option on library screens. Play is disabled on the Components tab.
- Component libraries do not display in Power Apps Mobile.
- Power Apps component framework code components are a different feature.

## Create the library

1. Sign in to Power Apps at make.powerapps.com.
2. Select **Component libraries** in the left navigation, then **New component library**. If it is missing, select **More** > **Discover all** > **Component libraries** under **App enhancements**.
3. Name the library, for example Menu components.
4. Create components by following the components overview example, starting at step 2. You do not need to open Studio or create a blank app.
5. Optionally add components to a screen and create output properties.

## Save and publish

- **Save:** use the save icon in app actions. **Save with version notes** is in the arrow menu next to Save. Version notes help you retrieve versions and help consuming makers review changes.
- **Publish:** use the publish icon. Only published versions are available to consuming apps.

## Decide whether apps may customize a component

Each component has a setting for whether consuming apps can customize it. It is **On** by default.

| Setting | Effect in a consuming app |
| --- | --- |
| On | Makers can select **Edit component**. This creates a local copy and removes the link to the library |
| Off | The edit option is hidden. Changes must be made in the library |

My advice: turn it off for components that must stay identical, such as a branded header.

## Import components into an app

1. Edit or create an app in Studio.
2. Select **Insert** (or the plus icon) in the left navigation, then **Get more components**.
3. Select individual components, or **Select all**, from the libraries in the current environment.
4. Find them under **Library components** in the Insert pane. Local components appear under **Custom**.

You can import from several libraries. If a library does not appear, make sure it is shared with you.

## Update a library and its consumers

Save changes with version notes and publish. Consuming apps can then update in two ways:

1. **On edit:** when a maker edits the app, a notification says an update is available. They select **Review**, then **Update**. Version notes show in this review.
2. **Proactively:** in the **Insert** panel, select **Check for updates**.

If a maker selects **Create a copy**, the component is copied into the app under **Custom** and no longer receives updates. Existing instances that are linked to the library are not affected.

## Share the library

Sharing works like sharing a canvas app. Once a library is shared, others can edit it and import its components. A co-owner can use, edit and share the library but cannot delete it or change the owner. Learn adds two considerations for sharing with security groups:

- **Solution-based libraries:** the sharing UI cannot be used. Use the `Set-PowerAppRoleAssignment` cmdlet with the **CanEdit** permission level to share with a security group.
- **Environments without Dataverse:** sharing as Co-owner automatically grants CanEdit to the selected security group.

## Known limitations

- Canvas component limitations also apply to libraries.
- You cannot import a locally downloaded library file made with Download a copy. It produces an error.
- Code components are not supported in component libraries.
- When you import an app and a library into an environment for the first time, make sure the app uses the latest component version. Otherwise it will not receive updates. Later imports into the same environment prompt for updates.
- A library referenced by an app cannot be deleted. Remove the component from the app first.

## Practical advice (my advice)

- Write version notes every time. Consuming makers see them during review.
- Keep a test screen in the library that shows every component, and preview it before publishing.
- Turn customization off for components that carry branding or logic that must not drift.
- Share libraries with a security group instead of individuals.
- Plan solution-based libraries early, because their sharing works differently.

## Related

- [Power Apps component library](https://www.m365.fm/entity/power-apps-component-library/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Component library (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/component-library)
