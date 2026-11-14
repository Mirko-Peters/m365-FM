---
title: "Power Platform Data Policies for Custom Connectors and HTTP Actions in Managed Environments"
summary: "How to restrict custom connectors by URL pattern, classify or block the HTTP connectors, and use endpoint filtering and action control in Power Platform data policies, with the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [power-platform, managed-environments, power-platform-admin-center]
keypoints:
  - "Tenant data policies classify custom connectors by host URL pattern. Environment policies classify them by name. Unclassified custom connectors fall into the default group."
  - "The HTTP, HTTP Webhook and When an HTTP request is received connectors can be classified or blocked like any other connector."
  - "Endpoint filtering for the HTTP connector lets you allow or deny specific endpoints instead of blocking all HTTP calls."
  - "Connector action control does not work for custom connectors. Advanced connector policies do not yet support custom or HTTP connectors, so classic data policies stay the tool for them."
  - "Policy evaluation happens before Set Host URL, so use only custom connectors from trusted parties."
faq:
  - q: "Where do I configure data policies for custom connectors?"
    a: "In the Power Platform admin center, go to Security, then Data and privacy, then Data policy. Microsoft Learn says the Custom connectors page in a tenant-level policy holds an ordered list of Allow and Deny URL patterns, and environment-level policies list custom connectors by name on the Connectors page."
  - q: "What is the default for custom connectors?"
    a: "At environment level, Learn says unclassified custom connectors go into the default group, or Non-Business if no default group was chosen. At tenant level, new policies start with the wildcard pattern set to Ignore, which defers evaluation to other policies."
  - q: "Can I block all HTTP requests?"
    a: "Yes. Learn says to block the HTTP connector in a data policy. For Copilot Studio, publishing is then blocked for agents that use the HTTP request node. Alternatively, use Configure connector and Connector endpoints to allow or deny specific endpoints."
  - q: "Do these policies require a Managed Environment?"
    a: "The Managed Environments overview lists data policies among its features. The page on data policies for managed environments describes a view of the policies that apply to a managed environment and notes that this environment filter is exclusively available for managed environments. None of the pages I read say that classic data policies work only in managed environments. Check your own tenant before you rely on it."
  - q: "Can I block single actions of a custom connector?"
    a: "No. Learn says connector action control can be configured for blockable connectors, but not for custom connectors or unblockable connectors."
---

To control custom connectors and HTTP actions in Power Platform, use data policies in the Power Platform admin center. A tenant-level policy classifies custom connectors by host URL pattern, an environment-level policy classifies them by name, and the HTTP connectors can be classified, blocked or limited with endpoint filtering. Each control has gaps, which are listed below.

## What Managed Environments add

The Managed Environments overview lists data policies as one of the features of a managed environment, next to limit sharing, pipelines and solution checker. The overview does not describe how data policies work, and it does not say that data policies need a managed environment. The linked page "Data policies for managed environments" adds one concrete thing: in the settings of a managed environment, the **Data policies** section has **See active data policies for this environment**, which opens the policy list filtered to that environment. The page notes that this environment filter is exclusively available for managed environments, and it recommends protecting all environments in the tenant with a data policy. The rest of this article follows the data policy pages for the exact behavior.

## Step 1: Open the policy

1. Sign in to the Power Platform admin center.
2. Select **Security**, then **Data and privacy**, then **Data policy**.
3. Select **New Policy**, or select an existing policy and **Edit policy**.
4. Choose the environments the policy applies to.

On the **Assign connectors** page you classify connectors into **Business**, **Non-Business** or **Blocked**. New policies place all connectors in Non-Business by default. Connectors in different groups cannot share data.

## Step 2: Control custom connectors

**Environment level.** Custom connectors appear on the **Connectors** page next to prebuilt connectors. Classify each as Blocked, Business or Non-Business. Connectors you do not classify go into the default group.

**Tenant level.** Custom connectors do not appear on the Connectors page, because they are environment specific. Use the **Custom connectors** page instead:

1. Select **Add connector pattern**.
2. Enter a URL pattern and classify it as **Blocked**, **Business** or **Non-business**. **Ignore** is supported only for the final wildcard entry.
3. Reorder patterns with **Order**, **Move up** and **Move down**.

Rules apply in order. The wildcard `*` is always the last entry, and new rules are added just above it. **Ignore** is the default for new policies and is supported only for the last entry. It defers the decision to other policies.

PowerShell offers `Get-PowerAppPolicyUrlPatterns`, `New-PowerAppPolicyUrlPatterns` and `Remove-PowerAppPolicyUrlPatterns`. In the Learn example, `https://www.mycompany.com*` is Business, `https://www.bing.com*` is Non-business and `*` is Blocked, so everything else is blocked. In the PowerShell object, the classification values are `Confidential` for Business and `General` for Non-business, next to `Blocked` and `Ignore`, as the page's example shows. The example on the page is printed with curly quotation marks. My own advice: type straight quotes when you copy it.

## Step 3: Control the HTTP connectors

Learn says that the **HTTP**, **HTTP Webhook** and **When an HTTP request is received** connectors can be classified in the data policy UI and in PowerShell like any other connector.

- **Block all HTTP calls.** Find the HTTP connector on the Assign connectors page, select the three dots and choose **Block**.
- **Allow only certain endpoints.** Select **Configure connector**, then **Connector endpoints**, add the endpoints or patterns and save. The admin center lists the HTTP connector as supporting endpoint filtering.

There is a side effect. Child flows share an internal dependency with the HTTP connector, so the group you choose for HTTP can affect whether child flows run. Learn recommends that, if you do not want HTTP in Business in shared environments such as the default environment, you put it in Non-Business or block it. Then create dedicated environments for makers who need HTTP, and restrict the maker list so you can unblock child flows for them.

For Copilot Studio, Learn describes the result of a block. Agents that use the HTTP request node cannot be published, an error banner with a **Details** button appears, and on the **Channels** page you expand the error link and select **Download**. The details file has one row per violation. A violation also occurs if the HTTP connector sits in a different data group than the other connectors in the policy, or if it is not blocked but an endpoint is denied.

## Step 4: Know what the policy cannot do

- **Unblockable connectors.** Classic data policies cannot block connectors such as SharePoint, Teams, Dataverse and Copilot Studio. They can only be classified as Business or Non-Business.
- **Action control.** You can allow or block single actions of blockable connectors under **Configure connectors** > **Connector actions**. This does not work for custom connectors or unblockable connectors. Triggers can also be allowed or blocked, but for now only through PowerShell.
- **Advanced connector policies.** Learn describes a strict allowlist model that can restrict certified connectors, including the unblockable ones. Custom connectors and HTTP connectors are not yet supported, so Learn says to keep using classic data policies (and connector endpoint filtering for HTTP). Virtual connectors are not supported and will not be added.
- **Set Host URL.** Policy evaluation happens before Set Host URL, which can redirect a custom connector to another REST API. Microsoft advises building and using custom connectors only from trusted parties.
- **Name versus pattern.** If a connector was added by name to a tenant-level policy through PowerShell, the name classification overrides the URL patterns. Microsoft recommends host URL patterns only for tenant-level policies.
- **Old apps.** Data policies are not enforced for custom connectors in apps last published before October 2020.
- **Visibility.** Environment admins see only the custom connectors they own or that were shared with them.

## Suggested order of work (my own sequence)

1. Decide the default group. Learn advises keeping Non-Business.
2. Create a tenant-level policy with allow patterns for the hosts you trust and a final Blocked wildcard.
3. Block or filter the HTTP connector in shared environments, and keep a dedicated environment for exceptions.
4. Test with a real flow or agent and read the violation details.

## What the pages do not cover

The pages I read do not explain the HTTP with Microsoft Entra ID connector, do not give a limit for the number of URL patterns, and do not say what the policy does to existing Power Automate cloud flows that use HTTP. Check those points in a test environment.

## Related

- [Power Platform](https://www.m365.fm/entity/power-platform/)
- [Managed Environments](https://www.m365.fm/entity/managed-environments/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)

## Sources

- [Custom connector parity - Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/dlp-custom-connector-parity)
- [Connector classification - Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)
- [Connector action control - Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/connector-action-control)
- [Configure data policies for agents - Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention)
- [Managed environments overview - Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview)
- [Data policies for managed environments - Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-data-policies)
