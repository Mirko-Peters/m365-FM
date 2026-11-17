---
title: "When large environments need capacity and API limit helpers"
summary: "Large Azure Virtual Desktop estates managed with Nerdio can hit two different ceilings: Azure has no capacity for the VM size, or Azure Resource Manager throttles the API calls. This guide separates the two, lists the tuning steps Nerdio documents before the Booster, and shows when the Azure Capacity Extender and the Azure API Limit Booster, both Premium only, come in."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-azure-capacity-extender, nerdio-manager-for-enterprise]
keypoints:
  - "Capacity and API limits are different problems. An allocation failure means Azure has no capacity for the VM size in the region or zone. Throttling means Azure Resource Manager returns HTTP 429 Too many requests because a request limit was reached."
  - "Nerdio says API usage optimisation becomes relevant above 500 session host VMs, and, above 2,500 VMs, recommends splitting a deployment across subscriptions of up to 2,500 VMs each. Azure's VM operation limits are region specific, so more regions raise the limit."
  - "Nerdio says to work through its throttling overview and its scale-up page before adding Booster apps. Both lists include App Service settings, SQL and App Service plan sizing; the order of steps 2 to 4 below is our arrangement."
  - "The Booster links extra Entra ID app registrations, and Nerdio Manager round-robins its Azure calls across them. Nerdio says in practice 1 to 2 extra apps usually suffice and very large environments may need 3 or more."
  - "The Azure Capacity Extender and the Azure API Limit Booster are both listed as Premium edition features. Nerdio advises not to change App Service settings without consulting Nerdio support."
faq:
  - q: "Do I need the API Limit Booster for a few hundred session hosts?"
    a: "Probably not. Nerdio says API usage optimisation becomes relevant if the environment has more than 500 session host VMs, and its default deployment is sized for a few hundred hosts and a couple of thousand users. Start with the call-reduction settings and monitor for throttling before adding app registrations."
  - q: "Does the Booster raise Azure's limits?"
    a: "Not directly. Nerdio's help article says the Booster lets Nerdio Manager spread its Azure calls across additional Entra ID app registrations. Learn says Azure Resource Manager limits apply per subscription, per service principal and per operation type, and also names global subscription limits of 15 times the principal limit. Nerdio says that more subscriptions, regions and security principals increase the aggregate limit. Our reading: additional principals add headroom up to that global ceiling; Nerdio does not say how far. VM operations also have separate Compute limits."
  - q: "Which one fixes a failed scale-out?"
    a: "It depends on the error. A capacity message such as AllocationFailed points to the Azure Capacity Extender or another size, zone or region. An HTTP 429 or a Too many requests message points to the API-reduction steps and the Booster."
---

Large Nerdio-managed estates can hit two separate ceilings. If Azure cannot allocate the VM size you asked for, the Azure Capacity Extender supplies fallback sizes. If Azure Resource Manager throttles the API calls Nerdio Manager makes, you reduce calls first and add Azure API Limit Booster app registrations only if that is not enough. Both helpers need the Premium edition. This guide shows how to tell the problems apart. Nerdio says to work through its throttling overview and its scale-up page before adding Booster apps; the order of the steps in between is our arrangement.

For the concept behind the first helper, see the companion article on the [Azure Capacity Extender](/community/u/mirko-p/blog/azure-capacity-extender-in-nerdio-explained/). This one is about when to use which lever.

## Two ceilings, two sets of symptoms

| | Capacity ceiling | API ceiling |
|---|---|---|
| What happens | Azure cannot allocate compute for the requested VM size in the region or zone | Azure Resource Manager throttles management requests |
| Typical message | `AllocationFailed`, `ZonalAllocationFailed` and overconstrained variants (Microsoft Learn) | HTTP 429 Too many requests; Resource Manager responses carry a Retry-After value (Microsoft Learn) |
| Where it bites | Create, start or resize of VMs | Auto-scale checks, re-images, VM creation and, in very large estates, loading host and pool details |
| Nerdio helper | [Azure Capacity Extender](/entity/nerdio-azure-capacity-extender/) | Azure API Limit Booster |
| First step | Choose matching fallback sizes | Reduce the number of calls |

Microsoft Learn's page on Azure Resource Manager throttling describes a token bucket model. For subscription and tenant scopes in public and sovereign clouds it lists a bucket size of 250 with a refill rate of 25 per second for reads, and 200 with 10 per second for writes and for deletes. The page says subscription limits apply per subscription, per service principal and per operation type, and that there are also global subscription limits equal to 15 times the individual service principal limits. When a limit is reached the response is HTTP 429 with a Retry-After value. Learn also lists response headers such as `x-ms-ratelimit-remaining-subscription-reads` that show how much of the bucket remains. Learn says that since 2024 these limits apply per region, and points to "Accessing Azure Resource Manager metrics" for viewing throttled requests. The Nerdio pages listed under Sources do not describe a console view of API consumption.

Resource Manager is only one layer. Nerdio's overview names a second one, the resource provider level, for example Compute, and Learn says resource providers apply their own limits. Learn's compute throttling page counts per region and per minute, for each VM and for the subscription. For Create VM, Update VM (which includes Start and Restart) and Delete VM (which includes Deallocate), the listed per-VM bucket is 12 tokens refilled at 4 per minute, and the subscription bucket is 1,500 tokens refilled at 500 per minute. Compute responses carry an `x-ms-ratelimit-remaining-resource` header. The Resource Manager figures above therefore do not describe VM operations on their own.

Nerdio's throttling overview adds that API limits are scoped to the security principal and the subscription ID, and that some VM limits are also scoped to a region. Its conclusion is that more subscriptions, regions and principals raise the aggregate limit.

## How Nerdio Manager uses the API

Nerdio's throttling overview lists the main consumers of API calls:

- Interactive use of the UI, which it calls relatively low.
- [Auto-scaling](/entity/nerdio-auto-scaling/): every 5 minutes by default, per [host pool](/entity/avd-host-pool/), Nerdio checks the status of VMs and session hosts. More pools and more VMs per pool mean more calls.
- The VM Deallocator, which runs every 10 minutes by default and deallocates VMs that are stopped but not deallocated.
- Metrics collection during each auto-scale operation (CPU, RAM and AVD session usage).
- Scheduled tasks such as a re-image of a host pool, which consume calls while the VMs are processed.
- Small amounts for Azure Files and Azure NetApp Files auto-scaling and email notifications.

The Booster article makes one more point: there is a baseline number of calls per VM that Nerdio Manager must make no matter what, so a large enough estate can hit the ceiling even after optimisation.

## Step 1: Check whether you are in the range where this matters

Nerdio says API usage optimisations become relevant above 500 session host VMs, and that thousands of VMs call for an architecture designed for scale. Its default deployment is sized for a few hundred hosts and a couple of thousand users, and it describes the larger case as hundreds or thousands of session hosts with 10,000 or more users.

## Step 2: Shape the Azure layout

From the throttling overview:

1. If you run more than 2,500 VMs, split the deployment across multiple [Azure subscriptions](/entity/azure-subscription/) with up to 2,500 VMs each, using hub-and-spoke connected by virtual network peering.
2. Create FSLogix storage in the subscription where the VMs are deployed, to avoid heavy traffic over peering links.
3. Avoid a single host pool whose VMs sit in two subscriptions. Nerdio Manager can manage a deployment that spans subscriptions.
4. Use more than one Azure region where practical, because limits on VM operations are region specific. Nerdio suggests this for more than 2,500 VMs in one subscription, and mentions its Active/Active host pool disaster recovery to split VMs across two subscriptions.
5. Keep one resource group per host pool where possible.

## Step 3: Reduce the calls Nerdio makes

Nerdio's advanced settings page opens with a warning not to change App Service settings without first consulting Nerdio Manager support, so treat the table below as a map for that conversation. Defaults come from that page. The suggested values come from Nerdio's throttling overview and its scale-up page.

| Setting | Default | Suggested for large environments |
|---|---|---|
| `AutoScale:RepeatIntervalInMinutes` | 5 | 10 or 15 (Nerdio does not recommend going below 5) |
| `AutoScale:MaxAutoScaleProcesses` | 10 | Adjustable; controls how many auto-scale processes run at once |
| `VmDeallocator:RepeatIntervalInMinutes` | 10 | 60 or 240; or set `VmDeallocator:Enabled` to False |
| `Provision:MaxAddNewVMJobsCount` | 100 | 25 or 50 |
| `AutoScale:RestartAttempts` and `Provision:MaxRestartAttempts` | 2 | 4 or 5 if throttling occurs |
| `ArmHostPoolRequestor:ResourceGraphThreshold` | not set | 50; with more host pools in the subscription than this value, Nerdio queries host pools through Azure Resource Graph |
| `HostPoolVmsConfig:ResourceGraph` | False | True; uses Resource Graph to load VMs on the hosts page |
| `UI:RecentTasksHours` | not stated | 24 (scale-up page) |
| `StorageAutoScale:RepeatIntervalInMinutes` | 5 | Higher may be more efficient under API limits; no figure given, and not below 5 |

Each change has a cost. Nerdio says that lowering the add-VM concurrency lowers the error rate but increases the time to provision new capacity, and that more restart attempts can recover from Azure-side issues such as rate limits but may add time wasted on retries if the cause does not clear. A longer auto-scale interval reduces calls; our inference is that it also means the pool is assessed less often.

The VM Deallocator can also be turned off for individual pools: in Nerdio Manager open the host pool, then **Settings** > **Virtual Machines**, and clear **Automatically deallocate powered-off VMs**.

To change a setting, go in the Azure portal to the Nerdio App Service (named like `nmw-app-xxxxxxxxxx`), then **Settings** > **Environment variables**. Nerdio notes that most of these settings do not exist by default and must be added manually, that saving restarts the App Service, and that Nerdio Manager is unavailable for up to 5 minutes during the restart without affecting users' AVD connectivity. With App Service high availability configured, make changes in the app configuration environment variables, not on individual instances.

## Step 4: Scale Nerdio's own resources

Nerdio's scale-up page says the Azure SQL database is likely the first resource to need more. It advises a tier with at least 100 DTUs (for example S3+ or P1+), then monitoring the Compute utilization graph on the Overview page and increasing gradually if utilisation stays between 80% and 100%. For the [App Service plan](/entity/azure-app-service-plan/), Nerdio's condition is that CPU or memory utilization is consistently very high; you can see both on the plan (the `nmw-app-plan-*` link on the App Service overview). Then it scales up from the default B3, recommends starting with P2v3, allows up to P3v3 and says Premium v4 sizes are supported. Both changes are described as non-disruptive and possible during production hours. Nerdio lists the SQL and App Service plan increases among its recommendations for optimizing API usage, and its scale-up page also describes faster loading of workspace and pool details.

## Step 5: Add Azure API Limit Booster app registrations

If the steps above are not enough, Nerdio's Booster article describes registering additional applications in Entra ID. Nerdio Manager distributes its Azure calls across the linked applications in round-robin fashion, so the total available calls grow by a factor of n, where n is the number of linked client apps. Nerdio says that in theory the approach scales indefinitely, that in practice 1 to 2 extra registrations usually suffice, and that very large environments may need 3 or more.

Our reading of the Microsoft side: Learn's global subscription limit is 15 times the per-principal limit, so a single subscription would still have a global ceiling. Nerdio does not mention that figure, so confirm the effect with Nerdio support if you plan for many extra apps.

The steps, as Nerdio documents them:

1. In the Entra ID portal, signed in as Subscription Owner to the tenant that contains the subscription being linked (Application Administrator or Global Administrator may be needed), go to **App registrations** > **New registration**. Choose **Accounts in this organizational directory only**; no redirect URI is needed.
2. Copy the Application (client) ID.
3. Under **Certificates & secrets**, create a client secret. Nerdio recommends an expiry of more than one year. Copy the secret value.
4. In Nerdio Manager go to **System** > **Settings** > **Azure**, expand **Azure Subscriptions**, and next to **Client Apps** select **Configure**.
5. Choose **Link new app identity**, then enter identity type, name, app ID, Azure cloud, client secret and the assigned subscriptions. Select **Save and Close**.

Nerdio Manager tries to assign the needed permissions automatically using the signed-in account, which requires Owner or User Access Administrator. Otherwise assign the displayed permissions to each listed resource yourself. Expiring secrets are updated through the edit icon of the app.

## Step 6: Plan for capacity separately

The tuning above reduces the number of calls; it does not add capacity. For allocation failures use the Capacity Extender for fallback sizes, and see the companion article for Microsoft Learn's list of other workarounds. Retries can bridge a short shortfall: Nerdio's restart attempts pause a failed job and retry it after a few minutes, and Learn lists retrying the allocation. Neither page says retries solve a lasting shortage. A large burst of VM creation can touch both ceilings at once, so lowering add-VM concurrency may reduce throttling while lengthening the time to fill a pool.

## Sources

- [Nerdio Help Center: Azure API limits and throttling overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124316172941-Azure-API-limits-and-throttling-overview)
- [Nerdio Help Center: Azure API Limit Booster](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388476941-Azure-API-Limit-Booster)
- [Nerdio Help Center: Scale up Nerdio Manager for large deployments](https://nmehelp.getnerdio.com/hc/en-us/articles/26124315546381-Scale-up-Nerdio-Manager-for-large-deployments)
- [Nerdio Help Center: Advanced App Service configurations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124300686093-Advanced-App-Service-configurations)
- [Nerdio Help Center: Host Pool Azure Capacity Extender Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124377923085-Host-Pool-Azure-Capacity-Extender-Configuration)
- [Nerdio Help Center: NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Microsoft Learn: Understand how Azure Resource Manager throttles requests](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/request-limits-and-throttling)
- [Microsoft Learn: Compute throttling limits](https://learn.microsoft.com/en-us/azure/virtual-machines/compute-throttling-limits)
- [Microsoft Learn: Troubleshooting Azure VM allocation failures](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/windows/allocation-failure)
