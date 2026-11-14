---
title: "Onboard non-Azure servers to Defender for Cloud with Azure Arc securely"
summary: "Step-by-step onboarding of on-premises servers to Microsoft Defender for Cloud through Azure Arc: the least-privilege service principal, network and TLS requirements, enabling Defender for Servers and verifying the result."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [azure-arc, microsoft-defender-for-cloud, defender, azure-connected-machine-agent]
keypoints:
  - "Microsoft recommends Azure Arc for non-Azure machines. With only the Defender for Endpoint agent you get Plan 1 plus, in Plan 2, just the premium Vulnerability Management features."
  - "For scale, use a service principal with the Azure Connected Machine Onboarding role, scoped to a subscription or resource group. Learn says it is used only during onboarding."
  - "The agent talks outbound over TCP 443 only. Allow the documented service tags and URLs and configure TLS 1.2 and 1.3."
  - "Turn on Defender for Servers under Environment settings. The default is Plan 2, and you can change to Plan 1. A 30-day trial starts and cannot be stopped, paused or extended."
  - "Verify in Defender for Cloud under Inventory, and in Azure Arc under Machines, where Arc agent status should show connected."
faq:
  - q: "Why use Azure Arc instead of just the Defender for Endpoint agent?"
    a: "Microsoft Learn says on-premises machines onboarded as Azure Arc machines get full Defender for Servers functionality. If you only install the Defender for Endpoint agent directly, only Plan 1 functionality is available, and Plan 2 adds only the premium Defender Vulnerability Management features on top of Plan 1."
  - q: "Which permissions does the onboarding service principal need?"
    a: "Learn says to assign the Azure Connected Machine Onboarding role, which gives only the minimum permission to connect machines with azcmagent. You choose the scope, an entire subscription or a resource group, and the duration of the client secret. Learn says it is safer than a higher privileged account such as a Tenant Administrator."
  - q: "Which network ports does the Arc agent need?"
    a: "Learn says the agent communicates outbound over TCP port 443, and all connections are outbound unless noted. It lists service tags such as AzureActiveDirectory, AzureResourceManager, AzureArcInfrastructure and Storage, plus URLs such as login.microsoftonline.com, pas.windows.net and *.his.arc.azure.com."
  - q: "Does a proxy make the agent more secure?"
    a: "No. Learn says proxy servers don't make the Connected Machine agent more secure because the traffic is already encrypted. For more secure connectivity, Learn points to an Azure Arc private link scope."
  - q: "How do I confirm the server shows up in Defender for Cloud?"
    a: "In the Azure portal open Microsoft Defender for Cloud, select Inventory and filter for resource types. Icons distinguish Non-Azure machine, Azure VM and Azure Arc-enabled server. In Azure Arc, the machine should show as connected under Arc agent status."
---

The secure route for non-Azure servers is: connect them to Azure Arc with a narrowly scoped service principal over outbound HTTPS, then enable Defender for Servers on the subscription that holds the Arc machines. Microsoft recommends this over installing only the endpoint agent, because only Arc-connected machines get the full plan.

## Why Azure Arc

Learn says a machine with Azure Arc-enabled servers becomes an Azure resource. Once connected to a subscription with Defender for Servers enabled, it appears in Defender for Cloud like other Azure resources. Microsoft recommends onboarding on-premises and non-Azure cloud machines as Arc machines. If you instead install the Defender for Endpoint agent directly, only Plan 1 functionality is available, and in Plan 2 only the premium Defender Vulnerability Management features are added on top.

For AWS and GCP, the multicloud connectors in Defender for Cloud handle the Arc deployment for you, so the steps below are for on-premises and other machines you connect yourself.

## Step 1: Plan access and prerequisites

From the Azure Arc onboarding page:

- You need local admin rights on the machine: root on Linux or a member of Local Administrators on Windows.
- You need the **Azure Connected Machine Onboarding** role, or **Contributor**, for the resource group of the machine.
- Register these resource providers in the target subscription: Microsoft.HybridCompute, Microsoft.GuestConfiguration and Microsoft.HybridConnectivity. Microsoft.AzureArcData is only needed for Arc-enabled SQL Server.
- To create a service principal, your Entra tenant must allow users to register applications, or you need the **Application Administrator** or **Cloud Application Administrator** role. To assign roles, you need **Owner** or **User Access Administrator** on the subscription.

## Step 2: Create a least-privilege service principal

Learn describes the service principal as a limited identity with only the minimum permission needed to connect machines with `azcmagent`, safer than a Tenant Administrator, and used only during onboarding.

1. In the Azure portal, search for **Azure Arc**, expand **Additional setup** and select **Service principals**.
2. Select **Add**, enter a name and choose the scope: the entire subscription or a specific resource group.
3. Under **Client secret**, choose how long the secret stays valid.
4. Under **Role assignment**, select **Azure Connected Machine Onboarding**, then **Create**.

Choose the shortest secret duration that fits your rollout, and the narrowest scope. For the Azure CLI and PowerShell variants, Learn notes the secret is valid for one year, after which you generate a new one and update any scripts. The pages I read give no further advice on keeping secrets out of scripts, so apply your own secret handling standards to the generated script.

## Step 3: Open the network path

Learn's network requirements page says the agent communicates outbound over TCP port 443, using HTTPS with officially signed certificates. By default it uses the default route to the internet.

- **Service tags:** `AzureActiveDirectory`, `AzureTrafficManager`, `AzureResourceManager`, `AzureArcInfrastructure`, `Storage`, and `AzureFrontDoor.Frontend` (required as of April 2026). If you filter on `AzureArcInfrastructure`, allow the full range.
- **Always required URLs include:** `login.microsoftonline.com`, `*.login.microsoft.com`, `pas.windows.net`, `*.his.arc.azure.com`, `*.guestconfiguration.azure.com` and `*.servicebus.windows.net`. `management.azure.com` is needed when you connect or disconnect, and `download.microsoft.com` only at installation.
- **TLS:** configure TLS 1.2 and 1.3. Learn says Windows Server 2012 R2 and later support TLS 1.2 and have it enabled by default. Older TLS and SSL versions still work for backward compatibility, but Learn says not to use them.
- **Proxy:** supported, but Learn says proxies do not make the agent more secure. A Log Analytics gateway is not supported as a proxy for the agent.
- **Private link:** Learn offers an Azure Arc private link scope for more secure connectivity. Some endpoints still need internet access, shown in the private link capable column.

Learn also suggests Azure Arc gateway to reduce the number of endpoints in the public cloud.

## Step 4: Generate and run the onboarding script

1. In **Azure Arc**, expand **Infrastructure**, select **Machines**, then **Onboard/Create** > **Onboard existing machines**.
2. On **Basics**, set subscription, resource group, region and operating system. Under **Connectivity method**, choose **Public endpoint** or **Private endpoint**, or enter a proxy as `http://<proxyURL>:<proxyport>`.
3. Under **Authentication**, select **Authenticate machines automatically** and pick your service principal.
4. Download `OnboardingScript.ps1` or `OnboardingScript.sh` and run it on the server.

Learn notes the PowerShell script supports only 64-bit Windows PowerShell, and that servers with SQL Server are auto-connected for SQL unless you add the tag `ArcSQLServerExtensionDeployment` set to `Disabled`.

## Step 5: Enable Defender for Servers

In the Azure portal:

1. Search for **Microsoft Defender for Cloud** and select **Environment settings**.
2. Select the subscription that contains the Arc machines.
3. On **Defender plans**, set **Servers** to **On**. This turns on Plan 2 by default. Select **Change plans** to pick **Plan 1**, then **Confirm** and **Save**.

Learn describes Plan 1 as entry-level, focused on endpoint detection and response through the Defender for Endpoint integration. Plan 2 adds items such as agentless scanning, file integrity monitoring, just-in-time machine access and compliance assessment. Learn does not say whether agentless scanning supports non-Azure machines, so check that before relying on it. After you enable a plan, a 30-day trial begins that cannot be stopped, paused or extended. Learn says enabling the plan consents to Defender for Servers accessing Defender for Endpoint data on vulnerabilities, installed software and alerts.

## Step 6: Verify

In Defender for Cloud, select **Inventory** and filter by resource type. Icons separate **Non-Azure machine**, **Azure VM** and **Azure Arc-enabled server**. In Azure Arc, confirm the machine appears connected under **Arc agent status**.

## Typical mistakes

- Onboarding with a high-privilege account instead of the onboarding role.
- Blocking `AzureFrontDoor.Frontend` or filtering only part of the `AzureArcInfrastructure` range.
- Leaving old TLS versions enabled.
- Enabling the plan on the wrong subscription, so Arc machines never show protection.
- Expecting a proxy to add security.

## Related

- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Azure Connected Machine agent](https://www.m365.fm/entity/azure-connected-machine-agent/)

## Sources

- [Connect hybrid machines at scale with a service principal](https://learn.microsoft.com/en-us/azure/azure-arc/servers/onboard-service-principal)
- [Connected Machine agent network requirements](https://learn.microsoft.com/en-us/azure/azure-arc/servers/network-requirements)
- [Connect your non-Azure machines to Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/quickstart-onboard-machines)
- [Select a Defender for Servers plan](https://learn.microsoft.com/en-us/azure/defender-for-cloud/plan-defender-for-servers-select-plan)
- [Enable the Defender for Servers plan](https://learn.microsoft.com/en-us/azure/defender-for-cloud/tutorial-enable-servers-plan)
