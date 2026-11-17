---
title: "How to configure QR-code watermarking for AVD session hosts"
summary: "Watermarking is turned on per session host with the Enable watermarking policy in Intune (settings catalog) or Group Policy. This guide lists the prerequisites, the steps for both tools, the five options with their defaults, and how to look up a Connection ID afterwards."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-watermarking, azure-virtual-desktop]
keypoints:
  - "In Intune, add Enable watermarking from the settings catalog under Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Azure Virtual Desktop. Do not pick the entry marked [Deprecated]."
  - "In Group Policy, the same setting sits under Computer Configuration > Policies > Administrative Templates, in the same folder path, and needs the Azure Virtual Desktop administrative template."
  - "Defaults: scale factor 4, opacity 2000, grid width 320, grid height 180, embedded content Connection ID. Learn suggests changing only the opacity."
  - "After the policy applies, sync (Intune) or refresh Group Policy or restart (Group Policy); existing sessions must sign out and back in. Unsupported clients can no longer connect."
  - "To trace a code, search the Connection ID in Azure Virtual Desktop Insights or query WVDConnections by CorrelationId in Log Analytics."
faq:
  - q: "Why does Learn warn against the entry marked [Deprecated] Enable watermarking in Intune?"
    a: "Learn says the deprecated setting does not include the option to specify the QR code embedded content, so you could not choose between Connection ID and Device ID. Select the current Enable watermarking setting instead."
  - q: "Which role do I need to configure it?"
    a: "For the host pool, Learn lists Desktop Virtualization Host Pool Contributor as the minimum built-in role. For Intune you need the Policy and Profile manager role, and for Group Policy a domain account in the Domain Admins group."
  - q: "How do I find out who a QR code belongs to?"
    a: "Read the code, then search for its value in Azure Virtual Desktop Insights (Connection Diagnostics tab) or run a WVDConnections query that filters CorrelationId on the full or partial value. Both depend on Azure Virtual Desktop Insights being configured."
---

To enable QR-code watermarking for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) session hosts, turn on the **Enable watermarking** policy for the machines that provide the remote sessions, using Microsoft Intune or Group Policy. Once it applies, new sessions to a remote desktop show a grid of QR codes that contain a Connection ID or Device ID. This guide follows Microsoft Learn's [Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking) page and adds checks and pitfalls. For what the feature protects and what it leaves open, see the companion explainer on [watermarking](/entity/avd-watermarking/).

## Before you start

Learn lists these prerequisites:

- An existing [host pool](/entity/avd-host-pool/) with session hosts.
- A Microsoft Entra ID account with at least the **Desktop Virtualization Host Pool Contributor** built-in role on the host pool.
- A client that supports watermarking. Remote Desktop client: Windows Desktop 1.2.3317 or later on Windows 10 and later, web browser, macOS 10.9.5 or later, iOS/iPadOS 10.5.4 or later. [Windows App](/entity/windows-app/): Windows, macOS, iOS and iPadOS, web browser, and Android/Chrome OS (marked preview).
- Azure Virtual Desktop Insights configured for your environment.
- For Intune: an Entra ID account with the **Policy and Profile manager** role, and a group containing the devices to configure.
- For Group Policy: a domain account in **Domain Admins**, and a security group or organizational unit (OU) containing the session hosts.

Two warnings from the page apply before you change anything. Once watermarking is on for a session host, only clients that support it can connect, and an unsupported client gets a non-specific error. Watermarking is also for remote desktops only; RemoteApp connections and direct `mstsc.exe` connections are allowed without a watermark.

Decide first which pool you will test on. A small pilot pool with a handful of users on known clients is safer than a policy assigned to every session host at once.

## Option A: configure with Microsoft Intune

1. Sign in to the Microsoft Intune admin center.
2. Create or edit a configuration profile for **Windows 10 and later** devices, with the **Settings catalog** profile type.
3. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.
4. Check the box for **Enable watermarking**, then close the settings picker. Do not select **[Deprecated] Enable watermarking**: Learn says that setting does not include the option to specify the QR code embedded content.
5. Expand the **Administrative templates** category and switch **Enable watermarking** to **Enabled**.
6. Set the options (next section), then select **Next**.
7. Optional: on **Scope tags**, pick a scope tag.
8. On **Assignments**, select the group that contains the session hosts, then select **Next**.
9. On **Review + create**, check the settings and select **Create**.
10. Sync the session hosts with Intune so the settings take effect. Learn points to the Intune device sync remote action for this.

Assign the profile to a group of session host devices, not to user groups. The policy is a computer setting on the machine that provides the remote session.

## Option B: configure with Group Policy

1. Make the administrative template for Azure Virtual Desktop available in Group Policy by following Learn's [administrative template](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template) steps.
2. Open the **Group Policy Management** console on a device you use to manage the domain, then create or edit a policy that targets the computers providing a remote session.
3. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.
4. Open **Enable watermarking** and set it to **Enabled**.
5. Set the options (next section).
6. Make sure the policy applies to the session hosts, then refresh Group Policy on them or restart them.
7. Connect with a supported client and check that QR codes appear. Existing sessions must sign out and back in for the change to take effect.

## The five options

Intune and Group Policy offer the same options, with the same defaults:

| Option | Values | Default | What it does |
|---|---|---|---|
| QR code bitmap scale factor | 1 to 10 | 4 | Size in pixels of each QR code dot |
| QR code bitmap opacity | 100 to 9999 | 2000 | How transparent the watermark is; 100 is fully transparent |
| Width of grid box (percent of QR code bitmap width) | 100 to 1000 | 320 | Horizontal distance between QR codes |
| Height of grid box (percent of QR code bitmap width) | 100 to 1000 | 180 | Vertical distance between QR codes |
| QR code embedded content | Connection ID or Device ID | Connection ID | Which identifier the code contains |

Notes from the page on these values:

- For width and height, a value of 100 makes the codes appear side by side and fill the entire screen when combined.
- The Group Policy table states that 9999 is fully opaque; the Intune table describes only the transparent end.
- Select **Device ID** only for session hosts in a personal host pool that are joined to Microsoft Entra ID or Microsoft Entra hybrid joined. For pooled host pools, keep Connection ID.
- Learn's tip: try different opacity values to balance session readability against the ability to scan the code, and keep the defaults for the other parameters.

A sensible test plan is to start with the defaults, take a photo of the test session with a phone, and raise or lower opacity in small steps until the code can be read from the photo without making the work area hard to read. Changing the grid box values is possible but Learn recommends against it.

## Verify the result

1. Apply the policy to the pilot group and sync or refresh as described above.
2. Sign out any test session, then connect to a remote desktop with a supported client. You should see QR codes in the session.
3. Connect once with an unsupported client, if you have one, to see the non-specific error and confirm your help desk can recognise it.
4. Connect to a RemoteApp from the same pool and confirm that no watermark appears, so nobody assumes RemoteApp sessions are covered.
5. Note the on-screen code (a phone camera reader will show the value) for the next section.

## Find the session behind a code

Learn describes two routes. Both need Azure Virtual Desktop Insights configured.

**Azure Virtual Desktop Insights**

1. Open `https://aka.ms/avdi` and sign in with your Azure credentials.
2. Select the subscription, resource group, host pool and time range, then open the **Connection Diagnostics** tab.
3. In the section **Success rate of (re)establishing a connection (% of connections)**, look for the Connection ID in the list. It shows **First attempt**, **Connection Id**, **User** and **Attempts**. You can also export the list to Excel.

**Log Analytics**

1. In the Azure portal, open **Log Analytics workspaces** and select the workspace connected to your Azure Virtual Desktop environment.
2. Under **General**, select **Logs**.
3. Run the following query, replacing `<connection ID>` with the full or partial value from the QR code. The connection ID appears as `CorrelationId` in Log Analytics:

```kusto
WVDConnections
| where CorrelationId contains "<connection ID>"
```

Run this lookup against a test connection before you need it, so you know the data flows and your team knows where to click.

## Common pitfalls

- **Policy applied, no watermark.** Check that the session host received the policy (Intune sync or Group Policy refresh) and that the user started a new session. Existing sessions keep running without it until the user signs out and in again.
- **Users report a generic connection error after rollout.** Suspect an unsupported client first. Check the client against the version list above.
- **Wrong Intune entry.** If the embedded content option is missing, the deprecated setting was probably selected.
- **Device ID on a pooled host pool.** Learn limits Device ID to personal host pools that are Entra joined or hybrid joined.
- **Code not matching in Insights.** Confirm the time range and host pool you selected, and try the Log Analytics query with a partial value.
- **Expecting more than it does.** Watermarking traces and deters; it does not block capture. Pair it with screen capture protection and consider disabling clipboard, drive and printer redirection, as Learn's [screen capture protection](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection) page advises.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
