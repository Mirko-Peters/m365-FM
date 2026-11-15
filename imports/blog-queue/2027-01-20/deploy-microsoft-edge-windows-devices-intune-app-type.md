---
title: "How to Deploy Microsoft Edge to Windows Devices With Intune"
summary: "Add the built-in Microsoft Edge app type in Intune and assign it to Windows devices: menu path, app information, channel choice, scope tags, uninstall assignments and the limits Microsoft Learn documents, such as workplace join devices."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [intune, microsoft-edge]
keypoints:
  - "In the Intune admin center, go to Apps > All Apps > Create and pick Windows 10 under the Microsoft Edge, version 77 and later app type."
  - "Choose a channel: Stable, Beta or Dev. Learn calls Stable the recommended channel for broad enterprise deployment."
  - "Edge installs as a Win32 app in system context and overwrites a user-context installation. Automatic updates are on by default."
  - "The built-in deployment needs the Intune management extension, so it cannot be used on workplace join computers. Use an MSI line-of-business app instead."
  - "To uninstall, add an Uninstall assignment and remove the install assignment first. A group assigned both install and uninstall keeps the app."
faq:
  - q: "How do I add Microsoft Edge to Intune for Windows?"
    a: "Per Microsoft Learn, sign in to the Microsoft Intune admin center, select Apps, All Apps, Create, and under Microsoft Edge, version 77 and later select Windows 10 as the app type. Then fill in App information, choose a channel under App settings, optionally add scope tags and select Add."
  - q: "Which Edge channel should I choose?"
    a: "Learn describes three: Stable is the recommended channel for deploying broadly in enterprise environments and updates every four weeks, Beta is the best choice for a full pilot and also has major updates every four weeks, and Dev updates every week and is ready for enterprise feedback."
  - q: "What happens if Edge is already installed on a device?"
    a: "Learn says Intune detects pre-existing installations. If Edge is installed in user context, a system installation overwrites it. If it is installed in system context, installation success is reported. Automatic updates of Edge are on by default."
  - q: "Can I use this app type on workplace join devices?"
    a: "No. Learn states that built-in deployment requires the Intune management extension, which only exists for Microsoft Entra joined devices. You can still deploy Edge version 77 and later by uploading an MSI as a Windows line-of-business app."
  - q: "How do I remove Edge with Intune?"
    a: "Open the Edge app, select Assignments, Add group and choose Uninstall, then select the groups. Learn notes that uninstall only works on devices where Intune installed the app through an Available for enrolled devices or Required assignment of the same deployment, and that unassigning alone leaves Edge on the device."
---

To deploy Microsoft Edge to Windows devices with Intune, create an app of the type **Microsoft Edge, version 77 and later** in the Microsoft Intune admin center, choose a channel, and assign it to groups. Intune uses the Intune management extension to download the installer, which then pulls Edge from the content delivery network. This article follows the Microsoft Learn page on adding Microsoft Edge for Windows to Intune.

## Before you start

- A supported Windows version is required. Learn also notes that Windows 10 reached end of support on October 14, 2025 and is an allowed version in Intune. Devices can still enroll and use eligible features, but functionality is not guaranteed and can vary.
- The app type offers the Stable, Beta and Dev channels for Windows.
- The deployment is in English only. End users can change the display language in the browser under **Settings** > **Languages**.
- Edge is a Win32 app installed in system context, on like architectures: x86 app on x86 OS, x64 app on x64 OS.
- Intune detects existing Edge installations. A user-context installation is overwritten by a system installation. If Edge is already in system context, success is reported.
- Automatic updates of Edge are on by default.

## A limit to check first: workplace join devices

Learn states that you cannot use the built-in Edge deployment on workplace join computers. The built-in deployment needs the Intune management extension, and that exists only for Microsoft Entra joined devices. For those computers, upload an `.msi` as a Windows line-of-business app. Learn points to its page on adding a Windows line-of-business app.

## Step 1: Create the app

1. Sign in to the Microsoft Intune admin center.
2. Select **Apps** > **All Apps** > **Create**.
3. In the **App type** list, under **Microsoft Edge, version 77 and later**, select **Windows 10**.

## Step 2: App information

Select **App information** and fill in the fields. These help you identify the app and help users find it in the company portal.

- **Name:** shown in the company portal. Keep names unique. If the same name exists twice, only one of the apps is displayed to users.
- **Description:** for example, the targeted users.
- **Publisher, Developer, Owner:** Microsoft appears for all three.
- **Category:** optional, makes the app easier to find in the company portal.
- **Display this as a featured app in the Company Portal:** shows the app prominently on the main page.
- **Information URL, Privacy URL, Notes:** optional.

Select **OK**.

## Step 3: App settings and channel

Under **App settings**, pick the **Channel**. Learn describes the choices:

| Channel | Learn's description |
| --- | --- |
| Stable | Recommended for deploying broadly in enterprise environments. Updates every four weeks, each release incorporating improvements from Beta |
| Beta | The most stable preview experience and the best choice for a full pilot in your organization. Major updates every four weeks |
| Dev | Ready for enterprise feedback on Windows, Windows Server and macOS. Updates every week and contains the latest improvements and fixes |

The Edge logo is shown with the app in the company portal. Select **OK**.

## Step 4: Scope tags (optional)

Scope tags decide who can see client app information in Intune. Select **Scope (Tags)** > **Add**, search for tags, select the check boxes, and then **Select** > **OK**.

## Step 5: Add and assign

Select **Add**. The app appears in the apps list, where you can assign it to the groups you choose. Learn does not repeat the assignment steps on this page beyond the uninstall case, so use the standard Intune assignment options for **Required** or **Available for enrolled devices**.

## Uninstall Edge

1. In the Intune admin center, select **Apps** > **All Apps**, open the Microsoft Edge app, and select **Assignments** > **Add group**.
2. In the **Add group** pane, select **Uninstall**.
3. Select **Included Groups** and choose the groups for the uninstall assignment. To exclude groups, use **Exclude Groups**.
4. Select **Select**, then **OK**, and then **Save** in the app **Assignments** pane.

Learn adds three conditions:

- The app is uninstalled only if Intune previously installed it on the device through an **Available for enrolled devices** or **Required** assignment, using the same deployment.
- Remove the install assignment for a group before you assign it for uninstall. If a group is assigned both, the app remains.
- Currently, unassigning the Edge deployment leaves Edge on the device.

## Troubleshooting from the Learn page

Intune uses the Intune management extension to download and deploy the Edge installer, and then passes the deployment settings to it. The installer downloads and installs Edge directly from the CDN. Learn says to review the prerequisites of the Intune management extension and the guidance on accessing the Azure update service and the CDN, so that your network lets Windows devices reach these locations. To allow installation files to come from the CDN, you also need to allow access to Windows Update endpoints. Learn links its pages on Windows Update connection endpoints and network endpoints for Intune.

## A short checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Confirm that target devices are Microsoft Entra joined and have the management extension.
2. Pilot with the Beta channel on a small group, then roll out Stable.
3. Check that firewalls and proxies allow the endpoints named on the page.
4. Keep install and uninstall groups separate, so one group never has both.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Edge](https://www.m365.fm/entity/microsoft-edge/)

## Sources

- [Add Microsoft Edge for Windows to Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/app-management/deployment/add-edge-windows)
