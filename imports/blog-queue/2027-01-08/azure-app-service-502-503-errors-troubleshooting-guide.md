---
title: "Azure App Service Returns 502 or 503 Errors: Troubleshooting Guide"
summary: "Troubleshoot HTTP 502 and 503 errors in Azure App Service: the causes Learn names, how to observe with service health and metrics, collect data with Diagnose and solve problems and Kudu, and mitigate with scaling, auto-healing or a restart."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [azure-app-service, azure-monitor]
keypoints:
  - "Learn says 502 and 503 errors often come from application-level problems: requests that take a long time, high memory or CPU use, or an exception that stops the app from responding."
  - "The workflow has three tasks in order: observe and monitor, collect data, and mitigate."
  - "Observe with service health notifications and Monitoring > Metrics. Collect with Diagnose and solve problems and the Kudu debug console."
  - "Mitigate by scaling up or out, setting up auto-healing, or restarting the app."
  - "The page does not separate 502 from 503 causes and does not mention Always On, SNAT or specific detectors."
faq:
  - q: "What causes 502 and 503 errors in App Service?"
    a: "Microsoft Learn says they often happen because of an application-level problem: requests take a long time, the app uses high memory or CPU, or an exception prevents the app from responding."
  - q: "Where do I look first?"
    a: "Check service health in the Azure portal for service interruptions, then open the app's Monitoring > Metrics. Learn names the metrics Average memory working set, CPU time, Memory working set and Requests."
  - q: "How do I collect data?"
    a: "Select Diagnose and solve problems on the app's menu, or open the Kudu debug console through Development Tools > Advanced Tools > Go. Kudu offers environment settings, a log stream, a diagnostic dump and a debug console, and works with ProcDump for memory dumps."
  - q: "What are the mitigation options?"
    a: "Scale up the plan or run more than one instance, configure auto-healing in the root Web.config, or restart the app from the portal or Azure PowerShell."
  - q: "Does the page explain 502 and 503 separately?"
    a: "No. It describes them together and does not give separate root causes or diagnostic steps for each."
---

HTTP 502 Bad Gateway and 503 Service Unavailable on an App Service app usually point at the app itself: slow requests, high memory or CPU, or an unhandled exception. The Microsoft Learn page on these errors gives a three-step workflow: observe, collect data, mitigate. This guide follows that page and the landing page for App Service troubleshooting, which only lists article titles.

## What the page says causes them

The errors often happen because of an application-level problem:

- Requests take a long time.
- The app uses high memory or CPU.
- An exception prevents the app from responding.

The page does not describe the symptoms of 502 and 503 separately, and it does not give separate causes for each.

## Step 1: observe and monitor

- **Service health.** Azure announces service interruptions and performance degradations in App Service. You can track them in the Azure portal. The page links to the guide for viewing service health notifications.
- **App metrics.** On the app's page select **Monitoring** > **Metrics**. Learn names these metrics: Average memory working set, CPU time, Memory working set and Requests. It also links to the quotas and metrics article and to Azure Monitor alerts.

## Step 2: collect data

- **Diagnose and solve problems.** App Service offers an interactive troubleshooting experience that needs no configuration. Open the app or App Service Environment and select **Diagnose and solve problems** on the left menu.
- **Kudu debug console.** Go to the app, select **Development Tools** > **Advanced Tools** and then **Go**. The URL has the form `https://<app-name>-<random-hash>.scm.<region>.azurewebsites.net/`. Take the hash and region from **Default domain** on the **Overview** page. Kudu provides environment settings, a log stream, a diagnostic dump, and a debug console that runs PowerShell cmdlets and basic DOS commands.
- **Memory dumps.** For first-chance exceptions, Kudu and the Sysinternals tool ProcDump can create memory dumps, which are snapshots of the process.

## Step 3: mitigate

- **Scale the app.** Scaling up means changing the plan to a higher pricing tier and configuring certain settings after the change. For more capacity, run on more than one instance, so that if the process goes down on one, another keeps serving requests. Scaling can be manual or automatic.
- **Auto-healing.** It recycles the worker process based on settings you choose, such as configuration changes, requests, memory-based limits or request duration. Learn says recycling is usually the fastest way to recover. Triggers go in the root `Web.config`, and they work the same even if the app is not a .NET app.
- **Restart.** Restarting is often the simplest way to recover from one-time problems. Use the app's page in the portal or Azure PowerShell.

## Related articles listed on the landing page

Under availability and performance, the troubleshooting landing page lists articles on slow web app performance, instance-related issues and temporary storage next to the 502 and 503 article. It gives no description of them, so any link to your problem is your own judgment. Its networking section lists virtual network integration and intermittent outbound connection errors.

## What the page does not say

- Always On, SNAT or outbound connection limits.
- Kusto or Log Analytics queries.
- Named diagnostic detectors beyond the general blade.
- Kudu Process Explorer.
- How to find slow requests, although it lists them as a cause.
- Metric thresholds or specific scale settings.
- The auto-healing `Web.config` syntax.

## A troubleshooting order

This order is practical advice built on the page.

1. Check service health for the region.
2. Open the metrics and look for a spike in memory or CPU or a drop in requests around the time of the errors.
3. Open Diagnose and solve problems for the app.
4. Use Kudu to take a diagnostic dump or memory dump if an exception is suspected.
5. Restart the app to restore service, then scale or configure auto-healing to stop it recurring.

## Typical mistakes

- Restarting without collecting data first.
- Treating 502 and 503 as separate problems when the page treats them as one family.
- Scaling out without checking whether one slow request type causes the load.
- Ignoring service health.

## Related

- [Azure App Service](https://www.m365.fm/entity/azure-app-service/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure App Service plan](https://www.m365.fm/entity/azure-app-service-plan/)

## Sources

- [Troubleshoot HTTP 502 and HTTP 503 errors (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/app-service/troubleshoot-http-502-http-503)
- [Azure App Service troubleshooting (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/app-service/welcome-app-service)
