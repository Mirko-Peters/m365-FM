---
title: "Azure Arc Connected Machine Agent Deployment at Scale: Choose a Method"
summary: "Compare the documented ways to roll out the Azure Arc agent across Windows and Linux: service principal script, Group Policy, Configuration Manager and Ansible, with prerequisites and pitfalls."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [azure-arc, azure-connected-machine-agent, azure-monitor]
keypoints:
  - "Microsoft lists eleven onboarding methods. Group Policy and Configuration Manager are for Windows only, Ansible and the service principal script cover Windows and Linux."
  - "Create a service principal with the Azure Connected Machine Onboarding role, scoped to the target resource group or subscription. It is used only during onboarding."
  - "With Group Policy, every machine in the GPO scope is onboarded, and you should disable the GPO after the machines appear."
  - "The Ansible role is idempotent and skips machines that are already connected, but it does not discover machines."
  - "The agent cannot be installed on an Azure VM. SQL Server instances on a connected machine are connected automatically unless you set a tag."
faq:
  - q: "Which role does the onboarding service principal need?"
    a: "According to Microsoft Learn, the Azure Connected Machine Onboarding role, scoped to a subscription or resource group. The Group Policy and Configuration Manager pages recommend limiting the scope to the target Azure landing zone. Learn says the service principal is used only during onboarding."
  - q: "Can I onboard Linux servers with Group Policy?"
    a: "No. Microsoft lists Group Policy and both Configuration Manager methods as Windows methods. For Linux and Windows together, Learn lists the deployment script, PowerShell, the service principal flow and Ansible."
  - q: "Does the Ansible role find machines for me?"
    a: "No. Learn says the role does not discover machines automatically. It installs the agent and registers each host from your inventory, and it is idempotent, so machines that are already connected are skipped on a rerun."
  - q: "Can I install the Connected Machine agent on an Azure VM?"
    a: "No. Learn says the installation script warns you and rolls back if it detects that the server runs in Azure."
---

To deploy the Azure Arc Connected Machine agent across a mixed fleet, use a service principal with the Azure Connected Machine Onboarding role and then pick a delivery method that fits your tools. For Windows machines in Active Directory, Group Policy or Configuration Manager work. For Windows and Linux together, a deployment script from the service principal flow or an Ansible role are the documented options.

## The methods Microsoft lists

Microsoft's deployment options page labels each method as interactive or at scale.

| Method | OS | Mode |
|---|---|---|
| Deployment script from the Azure portal | Linux and Windows | Interactive |
| PowerShell | Linux and Windows | Interactive or at scale |
| Service principal | Linux and Windows | At scale, noninteractive |
| Ansible (Ansible Core or Ansible Automation Platform) | Linux and Windows | At scale |
| Azure Arc-enabled VMware vSphere | Linux and Windows | At scale, needs VMware tools on the VMs |
| AWS multicloud connector | Linux and Windows | At scale, discovers and onboards EC2 VMs |
| Configuration Manager PowerShell scripts | Windows | At scale |
| Configuration Manager custom task sequence | Windows | At scale |
| Group Policy | Windows | At scale |
| Windows Admin Center, Windows Server setup | Windows | Interactive |

The page has no comparison or when-to-use section. The guidance below is my reading of the prerequisites on each method's page.

## Step 1: Prepare the common pieces

- Review the agent prerequisites and the network requirements. The Ansible page says the Arc gateway can reduce the URL allowlist from about 20 URLs to about 7.
- Register the resource providers `Microsoft.HybridCompute`, `Microsoft.GuestConfiguration` and `Microsoft.HybridConnectivity` in the target subscription. Add `Microsoft.AzureArcData` only if you will Arc-enable SQL Server.
- You cannot install the agent on an Azure VM. The installation script warns and rolls back if it detects that the server runs in Azure.
- Administrator rights on each machine are required: root on Linux or membership in the local Administrators group on Windows.

## Step 2: Create a service principal

In the Azure portal, search for **Azure Arc**, expand **Additional setup**, select **Service principals** and then **Add**. Name it, choose subscription or resource group access, choose a duration for the client secret and select the role **Azure Connected Machine Onboarding**. Microsoft says the service principal is a limited identity with only the permissions needed to connect machines and is used only during onboarding.

The page does not give storage or rotation guidance for the secret. Handle it like any other secret and limit the role scope to the target landing zone, which the Group Policy and Configuration Manager pages recommend.

The `azcmagent` connection needs the service principal ID and secret, tenant ID, subscription ID, resource group and location. A resource name is optional and defaults to the host name.

## Step 3: Pick a method

**Script from the service principal flow.** In **Azure Arc** > **Machines** > **Onboard/Create** > **Onboard existing machines**, choose subscription, resource group, region, operating system, connectivity method (public or private endpoint, optional proxy URL or Arc gateway) and **Authenticate machines automatically** with your service principal. You download `OnboardingScript.ps1` or `OnboardingScript.sh`. The PowerShell script supports only 64-bit Windows PowerShell. Use this when you already have a way to run a script on many hosts.

**Group Policy (Windows, Active Directory).**
1. Create a remote share with the agent package. Domain computers need Change permission and domain admins Full Control.
2. Download the ArcEnabledServersGroupPolicy project from GitHub. It contains `EnableAzureArc.ps1`, `DeployGPO.ps1` and `AzureArcDeployment.psm1`.
3. Save the agent installer from `https://aka.ms/AzureConnectedMachineAgent` on the share.
4. Run `DeployGPO.ps1` on a domain controller with the domain FQDN, report server, share, service principal values, subscription, resource group, location and tenant.
5. Link the GPO named **[MSFT] Azure Arc Servers (datetime)** to the OU. It replicates within 20 minutes.
6. Check **Azure Arc - Machines**, then disable the GPO. If you leave it active, its scheduled task runs again at reboot or policy update.

Every machine in scope is onboarded, so keep the scope tight.

**Configuration Manager custom task sequence (Windows).** Create an application from `AzureConnectedMachineAgent.msi`, then a custom task sequence with an **Install Application** step and a **Run PowerShell Script** step. The script runs `azcmagent.exe connect` with the service principal values. Set the execution policy to Bypass, deploy as **Required** and use **Rerun if failed previous attempt**.

**Ansible (Windows and Linux).** Install the collection `azure.azcollection` and use the role `azure.azcollection.azure_arc` with variables such as `azure_arc_resource_group`, `azure_arc_subscription_id`, `azure_arc_tenant_id` and `azure_arc_location`. Authentication is `cli` for interactive use, `msi` for production automation (a managed identity must first receive the onboarding role) or `env` with a service principal credential in Ansible Automation Platform. The role is idempotent, so you can rerun it as inventory grows, but it does not discover machines. The page gives no Windows-specific playbook.

## Step 4: Verify and clean up

Open the Azure portal and confirm that the machines show as connected under Arc agent status. Remove temporary shares and disable one-off deployment policies.

## Two surprises

- **SQL Server.** A server with SQL Server installed gets its instances connected, an extension deployed and new roles applied. To opt out, add the tag `ArcSQLServerExtensionDeployment` with the value `Disabled` when connecting.
- **Error about ServiceManagementReference.** The service principal page says this error may mean you need the Application Administrator or Cloud Application Administrator role.

## Typical mistakes

- Leaving the Group Policy object active after onboarding.
- Giving the service principal a broad scope instead of the target resource group.
- Expecting the Ansible role to find machines for you.
- Forgetting the proxy or gateway when the fleet sits behind restricted egress.

## Related

- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Azure Connected Machine agent](https://www.m365.fm/entity/azure-connected-machine-agent/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)

## Sources

- [Azure Connected Machine agent deployment options (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/azure-arc/servers/deployment-options)
- [Connect machines using a service principal (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/onboard-service-principal)
- [Connect machines at scale with Group Policy (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/onboard-group-policy-powershell)
- [Connect machines at scale with Ansible playbooks (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/onboard-ansible-playbooks)
- [Connect machines with a Configuration Manager custom task sequence (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/onboard-configuration-manager-custom-task)
