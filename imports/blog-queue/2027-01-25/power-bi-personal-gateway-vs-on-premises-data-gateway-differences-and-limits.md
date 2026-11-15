---
title: "Power BI Personal Gateway vs On-Premises Data Gateway: Differences and Limits"
summary: "When to use the on-premises data gateway in personal mode and when to use the standard gateway, from Microsoft Learn: comparison table, what personal mode cannot do, installation steps, Fast Combine, R and Python, updates, credential prompts and how to reopen the app."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [power-bi, power-bi-service, on-premises-data-gateway, import-mode, directquery]
keypoints:
  - "Personal mode works only with Power BI and refreshes Import semantic models from on-premises data sources through scheduled or on-demand refresh."
  - "Use the standard gateway if you need DirectQuery, live connection, composite models, virtual network gateway scenarios, clustering, high availability or central governance."
  - "Each Power BI user can run only one personal mode gateway. A new installation on another computer replaces the previous one."
  - "Personal mode is an interactive application and cannot run as a Windows service. It updates monthly and can run side by side with a standard gateway."
  - "Install does not need a local admin. The gateway runs under your Windows credentials or per data source credentials you set, and the computer must stay on and signed in during refresh."
faq:
  - q: "When should I use personal mode?"
    a: "Microsoft Learn says to use it when you are an individual author refreshing a few Import semantic models and you do not need to share data sources or manage centralized credentials."
  - q: "When do I need the standard gateway?"
    a: "When several authors or admins manage data sources and credentials, when you need DirectQuery, live connection, composite models or virtual network gateway scenarios, when you need high availability, clustering or load balancing, or when you need centralized auditing and governance."
  - q: "Can I run both gateways on the same computer?"
    a: "The FAQ on the page says yes, personal mode can run side by side with the standard gateway. It also says personal mode cannot run as a Windows service and is only an interactive application."
  - q: "Why am I asked to update credentials?"
    a: "Learn names reinstalling on a different machine, changed data source credentials, a failed connection test, a timeout or a transient system error. Update the credentials in the Data source credentials pane of the semantic model in the Power BI service."
  - q: "Does personal mode support R and Python?"
    a: "Yes. Install the matching R or Python version locally, set the executable paths in the options, install the needed packages for the gateway user, and keep the machine on with the gateway signed in during refresh. Script visuals render at view time, and the gateway runs only the Power Query transformation steps during refresh."
---

The on-premises data gateway comes in two modes. The standard mode is for teams and for services beyond Power BI. Personal mode is a lighter option for one author who needs to refresh imported data from a source on a local network. The Microsoft Learn page on the personal gateway lays out the differences and the limits, and this article follows it.

## What personal mode is

The on-premises data gateway (personal mode) works only with Power BI. You install it on your own computer to refresh Import semantic models from on-premises data sources. Each Power BI user can run only one personal mode gateway. If the user installs another one on a different computer, the latest installation replaces the earlier one.

## When to use which

Use personal mode when:

- You are an individual author refreshing a few Import semantic models.
- You do not need to share data sources or manage centralized credentials.

Use the standard gateway when:

- Several authors or admins manage data sources and credentials.
- You need DirectQuery, live connection, composite models or virtual network gateway scenarios.
- You need high availability, clustering or load balancing.
- You need centralized auditing and governance.

## Comparison

| | Standard gateway | Personal mode |
| --- | --- | --- |
| Cloud services | Power BI, Power Apps, Power Automate, Azure Logic Apps, Azure Analysis Services, Power BI dataflows (legacy) | Power BI only |
| Runs under | Credentials configured by authorized gateway users | Your Windows credentials (interactive sign-in) or per data source credentials you set |
| Install only as local admin | Yes | No |
| Centralized gateway and data source management | Yes | No |
| Import data and scheduled refresh | Yes | Yes |
| DirectQuery | Yes | No |
| Live connection to Analysis Services | Yes | No |

Learn adds that personal mode supports only Import semantic models with scheduled or on-demand refresh. It does not support DirectQuery, live connection to Analysis Services, composite models, multiple custom connector sources in DirectQuery, the virtual network data gateway, clustering or high availability.

The note on the page also says the on-premises data gateway docs are split into Power BI content and general content for all services that use the gateway.

## Install personal mode

1. Download the on-premises data gateway.
2. Open the installer and select **Next**.
3. Select **On-premises data gateway (personal mode)**, then **Next**.
4. Review the requirements, check or change the installation path, accept the terms and select **Install**.
5. Enter your email address in **Email address to use with this gateway** and select **Sign in**.
6. After signing in, select **Close** on the confirmation screen.

## Fast Combine

Fast Combine lets queries ignore privacy levels. Learn warns that enabling it disables privacy level isolation for combined queries, so enable it only if all sources are trusted.

1. Open `%LOCALAPPDATA%\Microsoft\On-premises data gateway (personal mode)\Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config`.
2. Before the closing `GatewayCoreSettings` element, add a setting named `EnableFastCombine` with the value `true`. The page shows the exact XML.
3. Wait about a minute, then run an on-demand refresh in the Power BI service to confirm.

## Frequently asked questions from the page

- **Side by side with the standard gateway?** Yes.
- **Run as a Windows service?** No. It is an interactive application. Use the standard gateway for service mode.
- **How often does it update?** Monthly.
- **Why am I prompted to update credentials?** Common causes are reinstalling on a different machine, changed data source credentials, a failed test connection, a timeout or a transient system error. Update them in the semantic model's **Data source credentials** pane in the Power BI service.
- **How long is it offline during an upgrade?** Typically a few minutes.
- **R and Python?** Yes. To refresh a model with R or Python in Power Query steps: install the matching version locally, set the executable paths in **File** > **Options and settings** > **Options** > **R script** or **Python script** (and save and republish if you changed them), install the required packages for the gateway user, and keep the machine on with the gateway signed in during refresh. Script visuals render at view time, and the gateway runs only the Power Query transformation steps during refresh.
- **How do I reopen or check it?** Use the system tray icon, search the Start menu for On-premises data gateway (personal mode), or run `%LOCALAPPDATA%\Microsoft\On-premises data gateway (personal mode)\GatewayApp.exe`. If the status shows **Not connected**, sign in again and check network access.

## Choosing and moving (my advice)

This is my suggestion, not guidance from the page:

1. Treat personal mode as a way to start, not as a shared solution. When a second person needs the same source, or a report becomes important to a team, move to the standard gateway.
2. Because personal mode is interactive and the computer must stay on and signed in, a laptop that sleeps will miss refreshes. Look at the refresh history before you blame the source.
3. Before you move to the standard gateway, list the semantic models that use personal mode, and plan to republish or rebind their data source settings. The page does not describe the move, so check the standard gateway docs.
4. If a report needs DirectQuery or live connection, do not spend time on workarounds. The page lists these as unsupported in personal mode.
5. Keep a note of which computer holds your personal gateway, since a second installation replaces the first.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Service](https://www.m365.fm/entity/power-bi-service/)
- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)
- [Import mode (Power BI)](https://www.m365.fm/entity/import-mode/)
- [DirectQuery](https://www.m365.fm/entity/directquery/)

## Sources

- [Use a Personal Gateway in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/connect-data/service-gateway-personal-mode)
