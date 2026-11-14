---
title: "Troubleshoot the On-Premises Data Gateway: Install, Connectivity and Refresh Errors"
summary: "A symptom-first checklist from the Microsoft Learn gateway troubleshooting page: version support, install errors, firewall and proxy checks, the offline gateway symptoms, concurrency limit 30, log collection and testing a source with Power BI Desktop on the gateway machine."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [on-premises-data-gateway, power-bi, power-bi-service]
keypoints:
  - "Start with the version. Learn says Microsoft actively supports only the last six monthly releases, and cluster members should run the same version."
  - "Installing on a domain controller is not supported and causes the error Failed to add user to group with the PBIEgwService Performance Log Users text."
  - "For offline or unreachable gateway symptoms, check FQDNs and ports, proxy configuration and logs, and enable HTTPS mode if only ports 80 and 443 are open."
  - "The gateway has a concurrency limit of 30 refreshes. Add gateways to a cluster or start a new cluster to spread the load."
  - "Collect logs first: Diagnostics, Export logs in the gateway app, and the On-premises data gateway service log in Event Viewer."
faq:
  - q: "Which gateway versions does Microsoft support?"
    a: "Microsoft Learn says a new update of the on-premises data gateway is released every month, and Microsoft actively supports only the last six releases. If you have issues with your version, try upgrading, since the latest version might already fix them. Keep all members of a cluster on the same version to avoid unexpected refresh failures."
  - q: "Why does the gateway installation fail with Failed to add user to group?"
    a: "The page lists the error Failed to add user to group (-2147463168 PBIEgwService Performance Log Users) for an installation on a domain controller. Deploying the gateway on a domain controller is not supported, so install it on a machine that is not a domain controller."
  - q: "The gateway shows offline or Your data gateway is offline or couldn't be reached. What do I check?"
    a: "Learn lists three verifications. Are the FQDNs and ports from the gateway communication documentation allowed in the firewall or proxy. If you use a proxy, is it configured in the gateway config files, is the configuration consistent and do the proxy logs show blocked requests. If the firewall allows only ports 80 and 443, is HTTPS mode enabled in the gateway."
  - q: "What does There are too many refreshes occurring concurrently mean?"
    a: "The gateway has a concurrency limit of 30, and the error means you reached it. Learn says you can monitor the concurrency count with the gateway diagnostics template, and avoid the problem by adding gateways to a cluster or starting a new cluster to load balance the requests."
  - q: "How do I troubleshoot a refresh that fails for one data source?"
    a: "Learn advises testing the source with Power BI Desktop on the gateway computer. If you cannot refresh in Power BI Desktop from that machine, a refresh through the gateway is highly unlikely to succeed. A successful desktop refresh is a strong indicator, not a guarantee, that the gateway machine is configured correctly. Then narrow down to the data source and semantic model settings in the Power BI service."
---

When an on-premises data gateway misbehaves, the Microsoft Learn troubleshooting page offers a long list of symptoms with causes. This article reorders them into a path: version, installation, connectivity, common errors, then logs and a test of the data source. I keep to what the page says, and mark my own advice as such.

## Step 1: Check the version

- Learn says a new gateway update is released every month and Microsoft actively supports only the last six releases. If you hit an issue, updating can fix it.
- In a cluster, keep all members on the same version. A query can be routed to a member that is not able to run it because of a lower version, which causes unexpected refresh failures.
- The primary node cannot be removed while other members are in the cluster. Removing the primary node also removes the gateway cluster.

## Step 2: Installation errors

| Symptom | Cause and fix from the page |
| --- | --- |
| Failed to add user to group (-2147463168 PBIEgwService Performance Log Users) | Installing on a domain controller, which is not supported. Use a machine that is not a domain controller |
| Install fails, antivirus out of date | Update the antivirus, or disable it only during installation and re-enable it afterwards |
| Install fails with antivirus such as McAfee Endpoint Defender enabled | Configure the antivirus to ignore the gateway process |
| Error when installing the same or an older version than the one installed | The page shows the error in a screenshot. Install a newer version |
| The user profile is a temporary profile | A problem with the machine. Ask your internal IT team to remove the temporary profile |
| Error generating an asymmetric key | Antivirus such as McAfee can corrupt or delete files the setup needs. Disable it temporarily or configure it to ignore the gateway process, delete the RSA folder under `c:\Users\<GW Service Account User>\AppData\Roaming\Microsoft\Crypto\RSA`, restart the machine, then finish setup and sign in. The root path can differ depending on whether you sign in as a user or service profile |

## Step 3: Connectivity

Typical symptoms on the page:

- The gateway shows an offline status on the Manage gateways page.
- A refresh fails with "Your data gateway is offline or couldn't be reached".
- Signing in to the gateway configurator shows "Network request returned unexpected error".

Learn's verifications, in order:

1. Are the FQDNs and ports from the gateway communication documentation allowed in the firewall or proxy? Run the network ports test. The result is Completed (Succeeded) or Completed (Failed, see last test results). A failure means your network might block required ports and servers.
2. If you use a proxy: confirm it is configured in the gateway config files, confirm the proxy configuration is consistent, and check the proxy logs for blocked requests.
3. If the firewall allows only ports 80 and 443, enable HTTPS mode in the gateway.

More connectivity notes from the page:

- A firewall can block the connections that Azure Relay makes to the Azure data centers. In that case unblock the IP addresses for your region. Learn points to the Azure IP ranges download and to the page for the data center region.
- A proxy that needs a domain user account can be handled by changing the gateway service sign-in user to a domain user. By default the gateway uses a service SID.
- By default communication to Azure Relay uses ports other than 443. You can force HTTPS communication instead of direct TCP.
- To reach a managed data lake through a proxy, add `*.dfs.core.windows.net` and `*.blob.core.windows.net` to the proxy allowlist.
- With bring your own Azure Relay, Private Link must not be enabled on the relay, as it is not supported.

## Step 4: Common errors

**Failed to create a gateway. Try again.** The page ties this to proxy configuration issues and says the gateway log has details.

**Power BI service reported local gateway as unreachable. Restart the gateway and try again.** At the end of configuration the Power BI service validates the gateway and does not report it as live. Restarting the Windows service might help. Collect the logs for more detail.

**Information is needed in order to combine data.** Refresh fails in the Power BI service while Power BI Desktop works. Learn says this happens when Desktop refresh works with **Always ignore privacy level settings** set, which is not available in the service. To resolve it, change the privacy settings in Desktop under **Options** > **Global** > **Privacy** and **Options** > **Current File** > **Privacy** so they do not ignore privacy, republish the file and set the credentials to Organizational in the Power BI service.

**There are too many refreshes occurring concurrently.** The concurrency limit is 30. Monitor it with the gateway diagnostics template, and add gateways to a cluster or start a new cluster.

**Only memory shows in the System Counter Aggregation Report.** If the gateway service account is not in the local security group Performance Log Users, only the system memory value is available. Add the account to the group and restart the gateway service.

**Fabric pipeline tasks queue.** The gateway machine needs enough memory to run the tasks of a pipeline activity, otherwise they are queued. Learn says 5% of the machine memory is reserved for system processes, and each task process gets 1,000 MB by default. The value of `OnPremRuntimeDefaultWorkerMaxWorkingSetInMB` in `Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config` can change that, with a minimum of 100 MB.

## Step 5: Collect logs

Learn says to always start with the logs.

- **Gateway app:** open the on-premises data gateway app, select **Diagnostics**, then **Export logs**. A zip file is saved in the ODGLogs folder on your Windows desktop.
- **Event Viewer:** on the gateway computer expand **Applications and Services Logs** and select **On-premises data gateway service**.

## Step 6: Test one data source

Refreshes through the gateway need the source to be reachable from the gateway computer. Use Power BI Desktop locally on that computer to test the connection. This helps when the source needs extra components, such as a third-party database driver, or extra environment settings, such as access to a shared network drive. Test again after each configuration change. A successful refresh in Desktop is a strong indicator, though not a guarantee. If it fails there, a refresh through the gateway is highly unlikely to succeed. After a Desktop success, look at the data source and the semantic model configuration in the Power BI service.

## Limits to remember

The page notes that the Power BI gateway REST APIs do not support gateway clusters. If your problem is not listed, it says to create a support ticket for the cloud service that runs the gateway.

## My working order (my advice)

This is my suggestion, not Microsoft guidance:

1. Export the logs before you restart anything, so you keep the evidence.
2. Check version and cluster consistency before network work, since it is quick.
3. Run the network ports test from the gateway machine, not from your own PC.
4. Keep a record of which proxy and firewall rules the gateway needs, so a network change does not surprise you.
5. If many refreshes fail at the same hour, look at the concurrency count before you suspect the sources.

## Related

- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Troubleshoot the on-premises data gateway (Microsoft Learn)](https://learn.microsoft.com/data-integration/gateway/service-gateway-tshoot)
