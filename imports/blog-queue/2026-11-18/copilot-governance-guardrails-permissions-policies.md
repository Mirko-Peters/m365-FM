---
title: "Copilot Governance and Guardrails: Permissions, Policies and Adoption"
summary: "How to govern Microsoft 365 Copilot with the controls Microsoft documents: existing permissions, oversharing fixes, Restricted Content Discovery, Purview DLP, the security dashboard and measurement, in a practical order."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [copilot-governance, copilot, purview, sharepoint-advanced-management]
keypoints:
  - "Copilot only surfaces organizational data that the user already has at least view permission for. Permissions are the first guardrail, so oversharing becomes a Copilot problem."
  - "Microsoft groups Copilot controls into three pillars: security and governance, management controls, and measurement and reporting."
  - "Restricted Content Discovery limits what org-wide search and Copilot find on a SharePoint site, but it does not change permissions or remove content from the index."
  - "Purview DLP has a Copilot policy location that can block labeled files and emails, or block prompts containing sensitive information types, from being processed."
  - "The Copilot security dashboard sits in the Microsoft 365 admin center. Global Reader can view it, and changes need the AI Administrator role."
faq:
  - q: "Does Copilot bypass SharePoint permissions?"
    a: "No. Microsoft Learn says Copilot only surfaces organizational data to which individual users have at least view permissions, and that it uses the same underlying access controls as other Microsoft 365 services. That is why overshared content can show up in answers for people who already technically had access."
  - q: "What does Restricted Content Discovery do?"
    a: "According to Microsoft Learn, it is a site-level setting that keeps a SharePoint site's content out of organization-wide search and Copilot responses. It does not change permissions, does not remove content from the search index and is not supported for OneDrive sites. Large sites may take more than a week to update."
  - q: "Can DLP stop Copilot from using sensitive content?"
    a: "Yes, within limits. Microsoft Learn describes a Purview DLP policy location for Copilot that can exclude files and emails with chosen sensitivity labels from processing and block prompts that contain chosen sensitive information types. It cannot scan the contents of files uploaded into a prompt."
  - q: "Who can see and change the Copilot security dashboard?"
    a: "Microsoft Learn says the dashboard is under Copilot, Overview, Security in the Microsoft 365 admin center. Viewing requires the Global Reader role, and making changes requires the AI Administrator role."
  - q: "How do you measure Copilot adoption?"
    a: "Microsoft's Copilot controls framework assigns measurement and reporting, covering readiness and adoption, productivity impact and business value, primarily to Copilot Analytics. The overview page does not name specific adoption metrics."
---

Copilot governance starts with a simple fact from Microsoft: Copilot only shows organizational data that the person asking already has permission to view. So the guardrails are your existing permissions, plus the extra controls Microsoft adds on top. A workable order is to fix oversharing, add targeted restrictions, apply DLP, control agents and network access, then measure.

## How Microsoft frames the controls

Microsoft's overview describes "Copilot controls" as an integrated framework for Microsoft Copilot, Copilot Chat, prebuilt agents and agents built in Copilot Studio. It has three pillars:

1. **Security and governance:** data security, AI security, compliance and privacy.
2. **Management controls:** licensing and metering, agent lifecycle and customization.
3. **Measurement and reporting:** readiness and adoption, productivity impact and business value, mainly through Copilot Analytics.

The page does not use the name "Copilot Control System" in its text, so expect both labels in the wild.

## Step 1: Understand what permissions already allow

Microsoft Learn states that Copilot accesses content through Microsoft Graph and presents only data each user can access, using the same controls as other Microsoft 365 services. It extends to access you grant outside your organization, such as shared channels in Teams. Data encrypted by Microsoft Purview Information Protection stays subject to usage rights, whether applied by sensitivity labels or by Information Rights Management.

The consequence is direct. Microsoft says overshared or poorly governed content can affect Copilot results and increase risk. Its deployment blueprint organizes the work into three themes: remediate oversharing, set up guardrails and meet regulations. The listed admin actions are to identify high-risk sites and files, apply interim access restrictions if needed, fix access issues, and continuously enforce guardrails. SharePoint Advanced Management is included with the Copilot license.

## Step 2: Add a temporary brake with Restricted Content Discovery

Microsoft describes Restricted Content Discovery as a temporary governance control that buys time to right-size access while the Copilot rollout continues.

To turn it on for a site:

1. In the SharePoint admin center, expand **Sites** and select **Active sites**.
2. Select the site and open the **Settings** tab.
3. Turn on **Restrict content from Microsoft Copilot** and select **Save**.

PowerShell: `Set-SPOSite -Identity <site-url> -RestrictContentOrgWideSearch $true`.

Know the limits:

- It affects discoverability, not access. People with permission can still open the content directly.
- It does not remove content from the search index, and Purview features such as eDiscovery continue to work.
- It is not supported for OneDrive sites.
- It does not affect searches started from within the site or work on a document the user already has open.
- For sites with more than 500,000 items, an update can take more than a week.
- Overuse can reduce the completeness of search and Copilot answers.

You need a Copilot license and SharePoint Advanced Management for this setting.

## Step 3: Apply Purview DLP for Copilot

Purview offers a policy location for Microsoft Copilot, Copilot Chat and Copilot Cowork. Documented capabilities:

| Condition | What it does |
|---|---|
| Sensitivity labels | Copilot does not process labeled files or emails, although the item could still appear in citations |
| Sensitive information types in a prompt | Copilot does not respond, or does not use web search for that prompt |
| Email from external senders | Excludes that email from processing (preview) |

Watch for these limits from the page: the label and SIT conditions cannot be in the same rule, DLP only checks text typed into the prompt and not uploaded files, label checks in Word, Excel and PowerPoint happen when the file opens, and policy changes can take up to four hours. The policy location is only available in the Custom policy template.

## Step 4: Control agents, web grounding and network access

- Microsoft says users can only use agents that their admin allows and that they installed or were assigned.
- Web search grounding is managed with the **Allow web search in Copilot** policy, which applies to Copilot Chat across licenses.
- For network and access, allow `*.cloud.microsoft` and the Copilot endpoints and check that proxies, Conditional Access and tenant restrictions are not blocking the app. Do not block `copilot.cloud.microsoft` to stop personal account access. Microsoft says to use tenant restrictions for that instead.

## Step 5: Monitor and measure

The Copilot security dashboard is in the Microsoft 365 admin center under **Copilot** > **Overview** > **Security**. Global Reader can view it, and the AI Administrator role is needed for changes. It supports managing data oversharing and DLP-based remediation. The separate Microsoft Security Dashboard for AI is in public preview and covers Copilot, Copilot Studio agents and third-party AI.

For adoption, use Copilot Analytics, which Microsoft names as the main source for readiness, adoption and impact reporting.

## A short starting checklist

1. List the SharePoint sites with broad access and decide which need a fix first.
2. Use Restricted Content Discovery only on the sites you cannot fix quickly, and set a date to remove it.
3. Create a DLP policy for the Copilot location, preferably in simulation mode first. Microsoft lists simulation mode as available.
4. Review which agents are allowed.
5. Check the security dashboard and agree who holds the AI Administrator role.

## Common mistakes

- Treating Copilot as the risk instead of existing permissions.
- Using Restricted Content Discovery as a permanent fix when Microsoft calls it temporary.
- Expecting DLP to inspect uploaded files.
- Restricting so many sites that answers become thin.

## Related

- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Copilot controls overview](https://learn.microsoft.com/en-us/copilot/microsoft-365/copilot-control-system/overview)
- [Microsoft 365 Copilot privacy and permissions](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy)
- [Copilot security and data protection](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
- [Secure and governed data foundation blueprint](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-blueprint-oversharing)
- [Restricted Content Discovery](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery)
- [Purview DLP for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about)
- [Copilot architecture and grounding](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture)
