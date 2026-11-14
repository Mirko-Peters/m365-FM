---
title: "Copilot Connectivity Troubleshooter: How to Run It and Read the Results"
summary: "How to run the Copilot connectivity troubleshooter in the Get Help app, what it checks, and how to read the related Microsoft 365 network connectivity test results for HTTP, WebSocket and latency."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [copilot, microsoft-365-apps, copilot-governance]
keypoints:
  - "Open the Get Help app, search for 'Copilot connectivity troubleshooter' and follow the steps. Microsoft says it checks for firewall rules and other things that could block the connection."
  - "Microsoft's page does not define result categories or codes for the troubleshooter. It says Get Help reports its findings and suggests possible fixes."
  - "The separate Microsoft 365 network connectivity test has three Copilot tests: HTTP Connectivity, Web Socket Enablement and Latency."
  - "A green tick means a test passed. Latency above 250 ms may cause a slower Copilot experience."
  - "If the troubleshooter finds nothing, the next step is the network team: WSS, TLS inspection and proxy timeouts."
faq:
  - q: "Where do I find the Copilot connectivity troubleshooter?"
    a: "According to Microsoft Support, it runs in the Get Help app. Open Get Help, enter 'Copilot connectivity troubleshooter' in the search bar and follow the steps. The support page also has a Start button that launches it."
  - q: "What does the troubleshooter check?"
    a: "Microsoft Support says it checks for firewall rules and other things that could block the connection to Copilot. The page does not list the individual checks, so do not assume more than that."
  - q: "What do the results mean?"
    a: "Microsoft Support says Get Help reports its findings and suggests possible fixes, and that you can close the app if a fix resolves the problem. The page does not define specific result categories or codes. For defined pass and warning states, use the Microsoft 365 network connectivity test described on Microsoft Learn."
  - q: "What is the difference from the Copilot license troubleshooter?"
    a: "Microsoft Support lists both in Get Help. The license troubleshooter is for users who believe they have a Copilot license but do not see the Copilot icon in eligible Microsoft 365 apps. The connectivity troubleshooter is for trouble connecting to Copilot."
  - q: "Is the network connectivity test the same tool?"
    a: "No. Microsoft Learn describes it as a separate tool at connectivity.m365.cloud.microsoft. It runs tests on the user's machine, including three Copilot tests, and can upload a report to the tenant when the user is signed in."
---

The Copilot connectivity troubleshooter is a guided check in the Windows Get Help app. Open Get Help, search for "Copilot connectivity troubleshooter" and follow the steps. Microsoft says it checks for firewall rules and other things that could block the connection to Copilot. For hard numbers such as latency, use Microsoft's separate network connectivity test.

## What the troubleshooter is for

Microsoft Support lists two Copilot troubleshooters in Get Help:

- **Copilot license troubleshooter.** For users who think they have a Copilot license but do not see the Copilot icon in eligible Microsoft 365 apps.
- **Copilot connectivity troubleshooter.** For trouble connecting to Copilot. It checks for firewall rules and other things that could block the connection.

Pick the one that matches the symptom. A missing icon points to the license troubleshooter. A Copilot that opens but never answers, or fails to load, points to connectivity.

## How to run it

1. Open the **Get Help** app.
2. In the **Search** bar, enter "Copilot connectivity troubleshooter".
3. Follow the steps the app provides.

The Microsoft Support page also has a **Start** button that launches the troubleshooter. The Get Help app is required. The page does not list other prerequisites such as an operating system version or account type, so it is not possible to say from that page which Windows builds support it.

## How to read the results

Microsoft Support says that after a troubleshooter runs, Get Help reports its findings and suggests possible fixes. If a fix resolves the problem, you can close the app and continue working. The page does not define result categories or codes. That means there is no official list to map a specific finding to a cause, and this guide does not invent one.

Practical reading:

- **A fix is suggested and works.** Done. Note what changed, because the same issue may return on other devices.
- **A fix is suggested and does not help.** Collect the text of the finding and escalate it with the network checks below.
- **No problem found.** The client-side check passed. The cause may sit elsewhere in the network path, in the license or in the browser.

## The second tool: Microsoft 365 network connectivity test

Where the troubleshooter gives guidance, the Microsoft 365 network connectivity test gives measured results. Microsoft Learn describes it at `connectivity.m365.cloud.microsoft`. It runs tests locally on the user's machine and complements the network insights in the Microsoft 365 admin center under **Health** > **Connectivity**. Signing in matters, because Microsoft says test reports are shared with the administrator and uploaded to the tenant while you are signed in.

The Copilot tests became generally available worldwide on 2025-03-25 according to the page. Microsoft documents three:

| Test | What it checks | Microsoft's guidance |
|---|---|---|
| Microsoft Copilot HTTP Connectivity | HTTP connectivity to specific endpoints | On a managed network, ask IT to allow `*.cloud.microsoft` and `*.office.com` |
| Microsoft Copilot Web Socket Enablement | Whether WebSocket (WSS) works | On a managed network, ask IT to enable WSS for Copilot domains |
| Microsoft Copilot Latency | Average latency to Copilot endpoints | Make sure WebSocket support is enabled. Latency above 250 ms may cause a slower Copilot experience |

To run it from the web, go to the address above and select **Run test**. The tool identifies the office location and runs JavaScript TCP latency tests. It then prompts you to download and run the advanced tests client, which needs the .NET 6.0 Runtime. A command-line version and a Microsoft Support and Recovery Assistant (SaRA) option also exist. The standalone executable does not upload results to the tenant.

On the **Details** tab, a green circle with a check mark means the result compared favorably. A red triangle with an exclamation point means a threshold was exceeded and a network insight was generated. For a WebSocket problem, Microsoft's example is that a passing test shows a green tick and a blocked connection shows a warning instead. The Copilot tests are listed as available for the global service and US Government (GCC), and not for China operated by 21Vianet.

Microsoft's requirements page also points to a Copilot app connectivity test at `connectivity.m365.cloud.microsoft/copilot` for `*.cloud.microsoft`.

## What to do with a failed test

The requirements page lists the usual suspects and asks you to work with the teams that manage proxies, firewalls and secure web gateways:

1. Allow the entire `*.cloud.microsoft` domain. Allowing only selected URLs inside it is not supported.
2. Verify WSS to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft`.
3. Check for TLS inspection that interferes with the connection.
4. Check for proxies with aggressive connection timeouts.
5. Confirm that URL filtering, tenant restrictions, Conditional Access and app control do not block `copilot.cloud.microsoft`.

## When the troubleshooter does not help

If both tools pass and Copilot still fails, go back to the account side. Microsoft Learn lists a newly assigned license, a mix of personal and work accounts, device-based licensing, an unsupported update channel and blocked connected experiences as causes of Copilot not working in Microsoft 365 apps. The related checklist on Copilot not working in Microsoft 365 apps walks through them.

Information to send with a support request: the exact message, the time, the network (home or corporate), the troubleshooter's finding and the result of each Copilot test.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Support: Copilot troubleshooters](https://support.microsoft.com/en-us/support/get-help/copilot-troubleshooters)
- [Microsoft Learn: Microsoft 365 network connectivity test tool](https://learn.microsoft.com/en-us/microsoft-365/enterprise/office-365-network-mac-perf-onboarding-tool)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-requirements)
- [Microsoft Learn: Copilot is missing, disabled, or doesn't work correctly](https://learn.microsoft.com/en-us/office/troubleshoot/copilot/copilot-missing-disabled-not-work-correctly)
