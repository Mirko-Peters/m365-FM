---
title: "How to enable multimedia redirection and what it supports"
summary: "To enable multimedia redirection, install the Remote Desktop Multimedia Redirection Service on the session host, force-install the Edge or Chrome extension with a policy, restart the host and test on a listed site. This guide gives the steps, the policy values and the checks Microsoft Learn describes."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-multimedia-redirection, azure-virtual-desktop]
keypoints:
  - "One .msi file installs both the multimedia redirection service and the browser extension on the session host. Learn documents the installer at aka.ms/avdmmr/msi, with a silent option of msiexec /i <path> /qn, and says Edge and Chrome must not be running during the install."
  - "Central management is optional but removes the user prompt. In Intune, the Edge extension is set under Settings catalog, Microsoft Edge, Extensions, Configure extension management settings, with the extension ID joeclbldhdmoijbaagobkhlpfjglcihd and installation_mode force_installed."
  - "Restart the session hosts after the policy applies. Then open a listed site in Edge or Chrome and check for the blue-bordered extension icon and a green check mark next to the feature."
  - "Extra sites are added with the registry values AllowedVideoRedirectionSites and AllowedCallRedirectionSites, as semicolon-separated FQDNs with at most one subdirectory. Learn says a listed site is not guaranteed to work."
  - "The service never updates itself, the extension does. If the MSI did not install the extension, install it from the Edge Add-ons or Chrome Web Store using the direct links in this guide, because the store search does not find it."
faq:
  - q: "What do the extension status messages \"The extension is not loaded\" and \"Not active on this site\" mean?"
    a: "Learn's troubleshooting page says \"The extension is not loaded\" (multimedia redirection is not available on this remote client) means the client you connected with does not support the feature, so connect from a supported client. \"Not active on this site\" with the prompt to refresh means the page was opened before the extension connected to the client, for example after a reconnect, and refreshing the page fixes it. Without the refresh prompt, the page is not supported for redirection."
  - q: "Can I enable multimedia redirection only for some websites?"
    a: "Yes. Learn describes the browser ExtensionSettings policy with runtime_blocked_hosts to block the extension on domains, and runtime_allowed_hosts for exceptions. An allowed host only lets the extension interact with the domain. The site must also be on the default supported list or on your own allow list."
  - q: "Where do I collect logs for a support case?"
    a: "In the extension pop-up, select Show Advanced Settings, then for Collect logs select Start, reproduce the issue, open the pop-up again and select Stop. The browser then prompts you to download the log files. Learn says users can still collect logs when the advanced settings button is hidden by policy."
---

To enable multimedia redirection (MMR) in Azure Virtual Desktop, install the Remote Desktop Multimedia Redirection Service on each session host, install the browser extension for Microsoft Edge or Google Chrome, restart the hosts and test on a supported site. This guide walks through those steps with the values Microsoft Learn documents. For what the feature does and where it stops, see the explainer on [multimedia redirection](/entity/avd-multimedia-redirection/).

## Before you start

Check these items from Learn's prerequisites first:

- Local administrator rights on the session hosts and the latest Microsoft Edge or Google Chrome on them.
- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later, on the session hosts and on the local Windows devices. A missing redistributable is one cause of "The extension failed to load".
- Clients: Windows App on Windows, version 2.0.297.0 or later, or a Cloud PC device such as Windows 365 Link. Learn's troubleshooting page says the feature works only with supported Remote Desktop clients.
- A local Windows device that meets the hardware requirements for Teams on a Windows PC.
- For Intune: a Microsoft Entra ID account with the Policy and Profile manager role and a group containing the devices. For Group Policy: a domain account that can create or edit GPOs and a group or OU with the devices.
- Not supported: Azure US Government, Windows 365 for Microsoft 365 Government (GCC, GCC-High) and Microsoft 365 DoD.

On Windows 365 Cloud PCs, Learn says the feature is already installed on Microsoft gallery images, so you only install it on a custom image. The steps below apply to [session hosts](/entity/avd-session-host/) in [Azure Virtual Desktop](/entity/azure-virtual-desktop/).

## Step 1: Install the service and the extension

Learn says you install both the multimedia redirection service and the browser extension from a single `.msi` file, which you can run manually, deploy with Intune Win32 app management or push with your enterprise deployment tool using `msiexec`.

1. Download the installer from `https://aka.ms/avdmmr/msi`.
2. Make sure Edge and Chrome are not running. In Task Manager, check the **Details** tab for `msedge.exe` or `chrome.exe`.
3. Install it. Either run the file and follow the wizard, then select **Finish**, or use your deployment tool, for example Intune Win32 app management, with this command as administrator:

```cmd
msiexec /i <path to the MSI file> /qn
```

The `/qn` switch means no user interface or interaction. By default, users are prompted to enable the extension when they open the browser; step 2 does this centrally.

## Step 2: Enable the extension centrally

By default, when the MSI installs the extension, the browser asks users to turn it on the first time they open it, and the extension does not load if they decline. Central management avoids this and also gives silent enablement, per-site restrictions, advanced-settings control and toolbar pinning. Learn documents Intune, Group Policy and, for Edge only, the Microsoft Edge management service.

### Microsoft Edge with Intune

1. Sign in to the Microsoft Intune admin center.
2. Create or edit a configuration profile for **Windows 10 and later**, profile type **Settings catalog**.
3. In the settings picker, browse to **Microsoft Edge** > **Extensions**, check **Configure extension management settings** and close the picker.
4. Under the **Microsoft Edge** category, set **Configure extension management settings** to **Enabled**.
5. In the **Configure extension management settings (Device)** box, enter this JSON as a single line:

```json
{
  "joeclbldhdmoijbaagobkhlpfjglcihd": {
    "installation_mode": "force_installed",
    "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx"
  }
}
```

6. Select **Next**. Optionally set a scope tag.
7. On **Assignments**, select the group containing the computers that provide the remote session, then **Next**.
8. On **Review + create**, select **Create**.
9. After the policy applies, restart those computers so the settings take effect.

### Google Chrome with Intune

Chrome needs administrative templates first. Download the Chrome ADM/ADMX templates from [Chrome Enterprise](https://chromeenterprise.google/browser/download/#manage-policies-tab), import `google.admx` and `google.adml` first, then `chrome.admx` and `chrome.adml`, and create a profile from the imported files. Browse to **Computer Configuration** > **Google** > **Google Chrome** > **Extensions**, open **Extension management settings**, select **Enabled** and enter the same JSON with `lfmemoeeciijgkjkgbgikoonlkabmlno` as the key and `https://clients2.google.com/service/update2/crx` as the update URL. Assign, create and restart as above.

### Group Policy

For **Microsoft Edge**:

1. Download and install the Microsoft Edge administrative template (see [Configure Microsoft Edge policy settings on Windows devices](https://learn.microsoft.com/en-us/deployedge/configure-microsoft-edge#1-download-and-install-the-microsoft-edge-administrative-template)).
2. Open **Group Policy Management** on a device you use to manage the Active Directory domain, and create or edit a policy that targets the computers providing the remote sessions.
3. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Microsoft Edge** > **Extensions**.
4. Double-click **Configure extension management settings**, select **Enabled** and enter the same single-line JSON as in the Intune steps.
5. Make sure the policy applies, then restart the computers.

For **Google Chrome**, download the Chrome ADM/ADMX templates from [Chrome Enterprise](https://chromeenterprise.google/browser/download/#manage-policies-tab). Learn's step 2 then tells you to copy, on your domain controllers, `terminalserver-avd.admx` and `en-US\terminalserver-avd.adml` to `C:\Windows\PolicyDefinitions\` (and its `en-US` folder) or to the Central Store at `\\<domain>\SYSVOL\<domain>\Policies\PolicyDefinitions`. Learn's [administrative template page](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template) describes these two files as part of the Azure Virtual Desktop template download (aka.ms/avdgpo), not the Chrome download. The multimedia redirection page does not spell out how the two fit together; our reading is that you need both. Check that the Chrome policies appear in the editor first. Then go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Google** > **Google Chrome** > **Extensions**, double-click **Extension management settings**, select **Enabled** and enter the Chrome JSON from the previous section. Restart the computers afterwards.

### Microsoft Edge management service (Edge only)

Sign in to the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/) and create a configuration profile for Microsoft Edge. Select the profile, then **Extensions** > **+ Select extension**, and enter the extension ID `joeclbldhdmoijbaagobkhlpfjglcihd` in the search box. Learn says you cannot search for it by name. Select the extension, set its options or use the Edge JSON from this article, then assign the profile to a Microsoft Entra group.

## Step 3: Test on a supported site

Learn's test for video playback:

1. Connect to a remote session from a supported client.
2. Open a supported video page, for example on YouTube, in Edge or Chrome.
3. Select the extension icon. It should have a blue border, and **Video Playback Redirection** should show a green check mark.
4. Play a video. The icon changes to show that redirection is active.

For calls, the same procedure applies, with **Call Redirection** and a call icon during the call. A grey icon means the content on the page is not redirected. An error state means the extension failed to load, and Learn says to reinstall the extension or the service.

If the pop-up shows "Not active on this site" with a prompt to refresh, refresh the page: the page was opened before the extension connected to the client, for example after a reconnect. If it shows "The extension is not loaded", the client does not support multimedia redirection.

## Step 4: Tune what is covered

The settings below are optional. Edge keys are shown; Chrome uses the Chrome ID and the `HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\lfmemoeeciijgkjkgbgikoonlkabmlno\policy` path.

| Goal | Setting |
|---|---|
| Show the icon on the toolbar | `toolbar_state` in the extension JSON: `default_shown`, `force_shown` or `default_hidden` (hidden by default) |
| Hide the advanced settings button | DWORD `HideAdvancedSettings` = `1` under `HKLM\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy`; `0` shows it |
| Add video sites | REG_SZ `AllowedVideoRedirectionSites` under the same key |
| Add call sites | REG_SZ `AllowedCallRedirectionSites` under the same key |
| Block the extension on domains | `runtime_blocked_hosts`, for example `["*://*.contoso.com"]`; `["*://*"]` blocks everything, with `runtime_allowed_hosts` for exceptions |

Format for the site lists: fully qualified domain names, optionally followed by one subdirectory, no scheme, no trailing slash, separated by semicolons, for example `contoso.com;videos.contoso.com;contoso.com/training`. Matching uses the host name and the first path segment. Set the value with your management tool or with PowerShell as administrator:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Name AllowedVideoRedirectionSites -PropertyType String -Value "<URLs>" -Force
```

Replace `<URLs>` with your list. Learn states that adding a video site enables video playback redirection for it but does not guarantee compatibility, and protected content stays unsupported. For a call site, Learn says the same about compatibility and asks you to test calls on each site you add.

## What it supports, in short

Learn names two functions. **Video playback redirection** covers web pages with embedded video; the default list includes YouTube, Vimeo, LinkedIn Learning and Pluralsight, and protected content is not supported. **Call redirection** covers WebRTC-based audio calls on listed sites such as Dialpad, Five9 and Genesys. Other sites need an allow-list entry (step 4). Supported clients and unsupported clouds are under Before you start; the explainer article has the full site lists. Two optional extension toggles go beyond the lists. Learn says of **Enable video playback for all sites (beta)** that it is experimental and might not work as expected. **Enable call redirection for all sites (experimental)** is described as experimental and useful when developing integration of your website with call redirection. Use both for testing. For the call toggle, Learn's test procedure first creates the key `HKEY_CURRENT_USER\Software\Microsoft\MMR` on the local Windows device with DWORD `AllowCallRedirectionAllSites` = `1`, then you connect to a remote session, select the extension icon, choose **Show Advanced Settings** and switch the toggle on.

## Pitfalls to plan for

- **Updates:** The service does not update automatically. Install the new MSI with the same steps and it replaces the old version. The extension updates by itself. The latest version in Learn's history is 1.0.2604.16004 from 14 July 2026.
- **Extension missing after the MSI:** Learn says the MSI might not install the extension. Use these direct store links, because searching does not find it: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd) and [Chrome Web Store](https://chromewebstore.google.com/detail/lfmemoeeciijgkjkgbgikoonlkabmlno).
- **Extension installed but not loading:** Users who decline the first-launch prompt get no extension. Force-install it by policy as in step 2.
- **"The extension failed to load":** Learn lists three causes on the session host: the service is not installed, the latest supported Visual C++ Redistributable is missing, or the deployment blocks `cmd.exe`. Fix the cause and restart the browser. If none applies, reinstall the service and restart the browser.
- **Blocked cmd.exe:** Edge and Chrome use `cmd.exe` by default to start the service. If App Control for Business or AppLocker blocks it, enable the browser policy `NativeHostsExecutablesLaunchDirectly` on the session hosts: REG_DWORD `1` under `HKLM\SOFTWARE\Policies\Microsoft\Edge` (Edge 121 and later) or `HKLM\SOFTWARE\Policies\Google\Chrome`. Restart the browser afterwards.
- **"Another Multimedia Redirection extension is running":** Only one multimedia redirection extension is supported per browser, for example not the public and the Insider version together. Check `edge://extensions` or `chrome://extensions`, and make sure policy force-installs only one.
- **"Microphone is blocked on your local PC":** On the local device, open Settings > Privacy & security > Microphone, turn on microphone access and allow Windows App, then refresh the page.
- **Calls stop after a reconnect:** Refresh the web page.
- **Call and video toggles clash:** If a supported call site misbehaves while **Enable video playback for all sites** is on, switch that toggle off and retry.

## Sources

- [Microsoft Learn: Multimedia redirection for video playback and calls in a remote session](https://learn.microsoft.com/en-us/azure/virtual-desktop/multimedia-redirection-video-playback-calls)
- [Microsoft Learn: What's new in multimedia redirection](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-multimedia-redirection)
- [Microsoft Learn: Troubleshoot multimedia redirection](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-multimedia-redirection)
- [Microsoft Learn: Add the administrative template for Azure Virtual Desktop to Group Policy](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template)
