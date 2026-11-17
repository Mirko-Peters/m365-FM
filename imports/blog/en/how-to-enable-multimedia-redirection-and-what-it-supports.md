---
title: "How to enable multimedia redirection and what it supports"
summary: "To enable multimedia redirection, install the Remote Desktop Multimedia Redirection Service on the session host, force-install the Edge or Chrome extension with a policy, restart the host and test on a listed site. This guide gives the steps, the policy values and the checks Microsoft Learn describes."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-multimedia-redirection, azure-virtual-desktop]
keypoints:
  - "Install the service first, then the extension. Learn documents the installer at aka.ms/avdmmr/msi, with a silent option of msiexec /i <path> /qn, and says Edge and Chrome must not be running during the install."
  - "Central management is optional but removes the user prompt. In Intune, the Edge extension is set under Settings catalog, Microsoft Edge, Extensions, Configure extension management settings, with the extension ID joeclbldhdmoijbaagobkhlpfjglcihd and installation_mode force_installed."
  - "Restart the session hosts after the policy applies. Then open a listed site in Edge or Chrome and check for the blue-bordered extension icon and a green check mark next to the feature."
  - "Extra sites are added with the registry values AllowedVideoRedirectionSites and AllowedCallRedirectionSites, as semicolon-separated FQDNs with at most one subdirectory. Learn says a listed site is not guaranteed to work."
  - "The service never updates itself, the extension does. If the MSI did not install the extension, install it from the store using the direct links in Learn's troubleshooting page."
faq:
  - q: "Why does the extension say it is not loaded in the first tab?"
    a: "Learn's troubleshooting page lists this as a known issue: in the first browser tab a user opens, the extension pop-up can say the extension is not loaded or that video playback or call redirection is not supported, even though redirection works in the tab. The documented workaround is to open a second tab."
  - q: "Can I enable multimedia redirection only for some websites?"
    a: "Yes. Learn describes the browser ExtensionSettings policy with runtime_blocked_hosts to block the extension on domains, and runtime_allowed_hosts for exceptions. An allowed host only lets the extension interact with the domain. The site must also be on the default supported list or on your own allow list."
  - q: "Where do I collect logs for a support case?"
    a: "In the extension pop-up, select Show Advanced Settings, then for Collect logs select Start, reproduce the issue, open the pop-up again and select Stop. The browser then prompts you to download the log files. Learn says users can still collect logs when the advanced settings button is hidden by policy."
---

To enable multimedia redirection (MMR) in Azure Virtual Desktop, install the Remote Desktop Multimedia Redirection Service on each session host, install the browser extension for Microsoft Edge or Google Chrome, restart the hosts and test on a supported site. This guide walks through those steps with the values Microsoft Learn documents. For what the feature does and where it stops, see the companion explainer on [multimedia redirection](/entity/avd-multimedia-redirection/); here the focus is the rollout.

## Before you start

Check these items from Learn's prerequisites first:

- Local administrator rights on the session hosts.
- The latest Microsoft Edge or Google Chrome on the hosts.
- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later, on the session hosts and on the local Windows devices. Learn's troubleshooting page adds that a missing host and client version number in the extension's status message likely means the host does not have the latest redistributable.
- Clients: Windows App on Windows 2.0.297.0 or later, or the Remote Desktop app on Windows 1.2.5709 or later. The troubleshooting page says it does not work on macOS, iOS, Android or in a browser-based remote session.
- For Intune: a Microsoft Entra ID account with the Policy and Profile manager role and a group containing the devices. For Group Policy: a domain account that can create or edit GPOs and a group or OU with the devices.
- Not supported: Azure US Government, Windows 365 for Microsoft 365 Government (GCC, GCC-High) and Microsoft 365 DoD.

On Windows 365 Cloud PCs, Learn says the feature is already installed on Microsoft gallery images, so you only install it on a custom image. The steps below apply to [session hosts](/entity/avd-session-host/) in [Azure Virtual Desktop](/entity/azure-virtual-desktop/).

## Step 1: Install the service

Learn's session-host section names two components: the service and the browser extension. The complete installer steps on the page appear in the dev box section, which describes a single `.msi` that installs both. Our reading, not a Learn statement: session hosts use the same installer, since the troubleshooting page also refers to the MSI installer when the extension is missing. Check Learn's session-host section for current wording before you build a package.

1. Download the installer from `https://aka.ms/avdmmr/msi`.
2. Make sure Edge and Chrome are not running. In Task Manager, check the **Details** tab for `msedge.exe` or `chrome.exe`.
3. Install it. Either run the file and follow the wizard, then select **Finish**, or use your deployment tool, for example Intune Win32 app management, with this command as administrator:

```cmd
msiexec /i <path to the MSI file> /qn
```

The `/qn` switch means no user interface or interaction. After installation you still have to enable the extension.

## Step 2: Enable the extension centrally

By default users are prompted to enable the extension when they open the browser. If a user denies that prompt, the troubleshooting page says the extension may not load. Central management avoids this and also gives silent enablement, per-site restrictions, advanced-settings control and toolbar pinning. Learn recommends Intune for Windows 365 and also documents Group Policy, and the Microsoft Edge management service for Edge only.

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

Chrome needs administrative templates first. Download the Chrome ADM/ADMX templates from Chrome Enterprise, import `google.admx` and `google.adml` first, then `chrome.admx` and `chrome.adml`, and create a profile from the imported files. Browse to **Computer Configuration** > **Google** > **Google Chrome** > **Extensions**, open **Extension management settings**, select **Enabled** and enter the same JSON with `lfmemoeeciijgkjkgbgikoonlkabmlno` as the key and `https://clients2.google.com/service/update2/crx` as the update URL. Assign, create and restart as above.

### Group Policy

Learn's central-management section has a Group Policy tab for the same task, with the exact menu paths; follow it. The block-domain section of Learn names the browser's `ExtensionSettings` policy as the mechanism for extension settings, so the JSON above is the payload to look for. Whichever tool you use, restart the hosts afterwards.

## Step 3: Test on a supported site

Learn's test for video playback:

1. Connect to a remote session from a supported client.
2. Open a supported video page, for example on YouTube, in Edge or Chrome.
3. Select the extension icon. It should have a blue border, and **Video Playback Redirection** should show a green check mark.
4. Play a video. The icon changes to show that redirection is active.

For calls, the same procedure applies, with **Call Redirection** and a call icon during the call. A grey icon means the content on the page is not redirected. An error state means the extension failed to load, and Learn says to reinstall the extension or the service.

If the first tab shows "not loaded" although video redirection works, open a second tab. That is a known issue on the troubleshooting page.

## Step 4: Tune what is covered

The settings below are optional. Edge keys are shown; Chrome uses the Chrome ID and the `HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\lfmemoeeciijgkjkgbgikoonlkabmlno\policy` path.

| Goal | Setting |
|---|---|
| Show the icon on the toolbar | `toolbar_state` in the extension JSON: `default_shown`, `force_shown` or `default_hidden` (hidden by default) |
| Hide the advanced settings button | DWORD `HideAdvancedSettings` = `1` under `HKLM\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy`; `0` shows it |
| Add video sites | REG_SZ `AllowedVideoRedirectionSites` under the same key |
| Add call sites | REG_SZ `AllowedCallRedirectionSites` under the same key |
| Block the extension on domains | `runtime_blocked_hosts`, for example `["*://*.contoso.com"]`; `["*://*"]` blocks everything, with `runtime_allowed_hosts` for exceptions |

Format for the site lists: fully qualified domain names, optionally followed by one subdirectory, no scheme, no trailing slash, separated by semicolons, for example `contoso.com;videos.contoso.com;contoso.com/training`. Matching uses the host name and the first path segment. You can set the value with Intune, Configuration Manager or Group Policy, or with PowerShell as administrator:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Name AllowedVideoRedirectionSites -PropertyType String -Value "<URLs>" -Force
```

Replace `<URLs>` with your list. Learn states that adding a site enables the feature for it but does not guarantee compatibility, and protected content stays unsupported. A `runtime_allowed_hosts` entry does not enable redirection either: it only lets the extension interact with that domain.

## What it supports, in short

Out of the box, video playback redirection covers sites such as YouTube, Vimeo, LinkedIn Learning, Microsoft Learn, Pluralsight and Udemy, and call redirection covers WebRTC audio calls on sites such as Dialpad, Five9, Genesys and Twilio Flex. Learn's page lists the full sets. Two optional extension toggles go beyond the lists, **Enable video playback for all sites (beta)** and **Enable call redirection for all sites (experimental)**. Learn says both might not work as expected, so use them for testing only. For the call toggle, Learn's test procedure first creates the key `HKEY_CURRENT_USER\Software\Microsoft\MMR` on the local Windows device with DWORD `AllowCallRedirectionAllSites` = `1`, then you connect to a remote session, select the extension icon, choose **Show Advanced Settings** and switch the toggle on.

## Pitfalls to plan for

- **Updates:** The service does not update automatically. Install the new MSI with the same steps and it replaces the old version. The extension updates by itself. The latest version in Learn's history is 1.0.2604.16004 from 14 July 2026.
- **Extension missing after the MSI:** If a user denied the prompt, install the extension from the Edge Add-ons or Chrome Web Store using the direct links on the troubleshooting page, because the extension cannot be found by searching. Better, force-install it by policy as in step 2.
- **Blocked cmd.exe:** The troubleshooting page says redirection does not work as expected when session hosts block `cmd.exe`.
- **Display problems:** For video players that do not draw correctly, Learn says to restore default Windows video player settings. For a grey pattern on the video, set the monitor or browser scale factor to 100%.
- **Stuck video:** If a video stays in a loading state, sign out of the remote session and sign back in.
- **Calls stop after a disconnect:** Refresh the web page.
- **Call and video toggles clash:** If a supported call site misbehaves while **Enable video playback for all sites** is on, switch that toggle off and retry.

For calls that connect but sound poor, Learn points to the app provider. For calls that do not connect or features that misbehave, it points to a Microsoft support ticket, and the logs from the extension help there.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Multimedia redirection for video playback and calls in a remote session](https://learn.microsoft.com/en-us/azure/virtual-desktop/multimedia-redirection-video-playback-calls)
- [Microsoft Learn: What's new in multimedia redirection](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-multimedia-redirection)
- [Microsoft Learn: Troubleshoot multimedia redirection](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-multimedia-redirection)
