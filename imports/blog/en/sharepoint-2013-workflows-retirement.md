---
title: "SharePoint 2013 workflows are retired: what to do with the old ones"
summary: "SharePoint 2013 workflows retirement is complete in Microsoft 365. Learn how to find the old workflows, sort them and rebuild what matters in Power Automate."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-2013-workflows, power-automate, sharepoint-designer, sharepoint-migration]
keypoints:
  - "Microsoft retired SharePoint 2013 workflows for existing Microsoft 365 tenants on April 2, 2026, with no option to extend, after turning them off for new tenants on April 2, 2024."
  - "Retired workflows no longer run, and existing definitions can only be viewed as raw XML files, so the business process behind each one must be rebuilt or dropped."
  - "The Microsoft 365 Assessment tool and its Power BI Workflow Report show which workflows exist, how recently they ran and how well they can be upgraded."
  - "Power Automate is Microsoft's recommended replacement, but it has no reusable or site workflows, a 30-day run limit and 28 days of run history."
  - "Sort every workflow into retire, replace with a simpler feature such as approvals, or rebuild, and plan the effort per group instead of per workflow."
faq:
  - q: "When were SharePoint 2013 workflows retired?"
    a: "Microsoft turned SharePoint 2013 workflows off for new Microsoft 365 tenants on April 2, 2024, and fully retired them for existing tenants on April 2, 2026. Microsoft stated there is no option to extend the date. SharePoint 2010 workflows had already been retired on November 1, 2020."
  - q: "What happens to my old SharePoint 2013 workflows now?"
    a: "They can no longer run, and users see an error that user-defined workflows have been disabled by the SharePoint administrator. Microsoft says existing workflows can only be viewed as raw XML files. Nothing is rebuilt automatically, so each business process needs a decision to retire or recreate it, usually in Power Automate."
  - q: "How do I find SharePoint 2013 workflows in my tenant?"
    a: "Microsoft recommends the Microsoft 365 Assessment tool. It scans the tenant and, together with its Power BI Workflow Report, lists workflows per site collection and site, shows how recently and how often they ran, names the lists and libraries that use them and gives a Power Automate upgradability score."
---

SharePoint 2013 workflows retirement is complete in Microsoft 365: since April 2, 2026, the old workflows stop working in existing Microsoft 365 tenants, and nothing was migrated automatically. If you are the SharePoint admin who still has a list of them, the task now is to find every workflow, decide which business processes are still needed, and rebuild only those, usually in Power Automate. This article gives you a triage method, the limits you will meet during the rebuild, and a worked example with invented numbers.

## SharePoint 2013 workflows retirement: what changed and when

Microsoft retired the legacy workflow engine in stages. Microsoft's article on the [SharePoint 2013 workflow retirement](https://support.microsoft.com/en-US/SharePoint/platform/sharepoint-2013-workflow-retirement) gives the timeline:

- **November 1, 2020:** SharePoint 2010 workflows were retired.
- **April 2, 2024:** [SharePoint 2013 workflows](https://www.m365.fm/entity/sharepoint-2013-workflows/) were turned off for new tenants, which means newly created Microsoft 365 tenants from April 2024 onward never had them.
- **April 2, 2026:** SharePoint 2013 workflows were removed from existing tenants and fully retired. The article states that there is no option to extend, and this applies to government clouds as well.

Once the feature is off, users see the error "User-defined workflows have been disabled by the SharePoint Administrator." Existing workflow definitions can only be viewed as raw XML files. Microsoft Learn now describes the retirement of existing tenants in the past tense, which matches the date.

SharePoint Designer 2013 still works with on-premises SharePoint Server 2016, 2019 and Subscription Edition for the rest of its client support lifecycle, which ends in July 2026, according to the same article. In other words, SharePoint Designer 2013 reaches its end of support in the same year. It cannot create or run 2013 workflows against SharePoint Online any more. [SharePoint Designer](https://www.m365.fm/entity/sharepoint-designer/) is therefore no longer a tool for your cloud tenant.

## What a retired workflow means for the business

A retired workflow does not disappear from the site. It simply stops starting. The April 2026 date is behind us, and the automation has stopped. That is the dangerous part, because the first sign is often a business process that quietly stops: no approval request, no notification, no copy of the file to the archive.

So the first question is not technical. Ask the business owner of each workflow what happens when it does not run, and who would notice. Some workflows have been silent for years. Others support a business-critical process and have probably already caused complaints. Old workflows that nobody maintains are technical debt, and the retirement has simply called it in. Treat the exercise as a chance to assess your environment honestly.

## Find the workflows

Microsoft's guidance is to use the Microsoft 365 Assessment tool. According to the retirement article, it scans the tenant for SharePoint 2013 workflow usage, and its Power BI Workflow Report shows the workflows per site collection and site, how recently and how often they ran, the lists and libraries that use them, and a Power Automate upgradability score.

Add what the tool cannot know:

- **The owner and the business purpose** of each workflow.
- **Dependencies:** other workflows, flows, apps and reports that read its output.
- **Third-party engines:** Microsoft advises checking any third-party workflow engine for a dependency on SharePoint 2013 workflow. Add-on products such as Nintex Workflow are an example, because the Nintex community states that the deprecation affects Nintex workflows in SharePoint. Ask the vendor what applies to your version.

Microsoft also describes a tenant setting that stops the creation of new 2013 workflows. The PowerShell command is `Set-SPOTenant -StopNew2013Workflows $true`, after you have confirmed that no application still creates them. Microsoft recommends a modern solution instead of re-enabling creation.

## Sort each workflow: retire, replace or rebuild

Treat the inventory as a triage list with three outcomes:

1. **Retire.** The workflow has not run for a long time, or its process no longer exists. Document it, archive the XML view if you need a record, and move on.
2. **Replace with a simpler feature.** Microsoft names Approvals in lists and document libraries as a good choice for basic approval functionality. Many old workflows only ask one person to approve one item.
3. **Rebuild in [Power Automate](https://www.m365.fm/entity/power-automate/).** Microsoft names Power Automate as the recommended successor for workflow orchestration. Move to Power Automate for the workflows whose business processes are still needed and which are too complex for a simple approval. Each existing workflow gets one of the three outcomes, and every new workflow starts as a flow, not as a copy.

Do not rebuild one to one. A new flow is a chance to remove steps nobody understands.

## What changes when you rebuild

Microsoft Learn's guide to [migrating classic workflows to Power Automate flows](https://learn.microsoft.com/sharepoint/dev/business-apps/power-automate/guidance/migrate-from-classic-workflows-to-power-automate-flows) lists differences you must plan for:

- Reusable workflows and site workflows are not available in flows.
- Stages work in Power Automate only with modern permissions.
- A flow has a 30-day lifespan, unlike a SharePoint Designer workflow. The article suggests a re-entrant flow to restart the clock, which may need a Premium license.
- The generic HTTP action is a Premium connector, so use the Send HTTP Request to SharePoint action or a service account for HTTP-heavy flows.
- Run history covers the last 28 days, so write information to a list if you need more.
- Impersonation steps from SharePoint 2010 have no direct equivalent. Use elevated accounts or an app registration.
- Workflows with elevated permissions through an app step are not offered in flows.

The same article says the SharePoint Migration Tool can migrate certain classic workflows to Power Automate, namely SharePoint Server 2010 out-of-the-box workflows and SharePoint Designer 2010 and 2013 workflows. Test it on a copy, because the result still needs a review. In a larger [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) project, add the workflows to the same inventory as the content.

## Example: 46 workflows, three groups

This example uses invented numbers. The assessment finds 46 SharePoint 2013 workflows on 19 sites. After talking to the owners, the admin sorts them like this:

- **21 workflows** have not started an instance for more than a year. They are retired. Documentation takes about 0.25 days each, so 21 × 0.25 = 5.25 days.
- **9 workflows** only route a document for approval. They move to approvals in the library and take about 0.5 days each, which is 4.5 days.
- **12 workflows** send notifications or copy files. They are rebuilt as cloud flows in about 1.5 days each, which is 18 days.
- **4 workflows** are multi-stage processes that run longer than 30 days and use impersonation. Each needs a redesign, a licensing check and a pilot, about 5 days each, which is 20 days.

The total is 21 + 9 + 12 + 4 = 46 workflows and 5.25 + 4.5 + 18 + 20 = 47.75 days, about 48 days of work. The four complex workflows are less than 10 percent of the count but more than 40 percent of the effort, so they decide the timeline. Those figures are planning assumptions, not benchmarks.

## Tell the people involved

Microsoft's [retirement message](https://mc.merill.net/message/MC542767) in the Message Center asked tenants to notify users, workflow developers and site owners, to update training and to prepare the help desk. Even after the date, that advice still applies. Send a short note to every site owner who has a workflow on your list: which workflow it is, that it no longer runs, what you plan to do with it and by when. Give the help desk the same list, so that a call about a missing approval email leads to an answer instead of a ticket loop. Ask owners to confirm in writing that a retired workflow is really not needed, and keep the answers with the inventory.

Think about history as well. Microsoft's article does not describe how to keep workflow history or instance data. If an auditor may ask who approved a contract last year, save what is still visible, for example by exporting the relevant list views, and store it with the inventory.

## Plan the rebuild

- **Start with the business-critical processes**, not the easy ones.
- **Check licensing early.** Some workarounds require Premium licenses, as the Learn article says.
- **Build in a test site** with a copy of the list and a small group of users.
- **Document each flow:** owner, trigger, purpose and the person who monitors it.
- **Agree on monitoring.** Because run history is short, decide who looks at failed runs and how often.

## Common mistakes

- **Assuming the tool migrates everything.** It handles certain workflow types. The rest needs a rebuild.
- **Rebuilding every workflow.** Many are dead, and retiring them is cheaper.
- **Forgetting the owner conversation.** Without the business owner, you do not know what to keep.
- **Ignoring flow limits.** A long-running process may run into the 30-day limit.
- **Skipping documentation.** The new flows will have the same problem in five years if nobody knows what they do.

## How software can help

Microsoft provides the Assessment tool, the Power BI Workflow Report and the migration guidance, and they are enough for most tenants. PowerShell helps with tenant settings and inventories. For the rebuild, Power Automate itself is the main tool, and approvals in lists cover the simple cases. Judge any additional tool by whether it lists workflows with their owners and recent activity, because that is the information the triage needs.

## Next step

Run the assessment or open its report this week, and mark every workflow as retire, replace or rebuild. Take that list to the business owners, because the decisions they make are the real end of the SharePoint 2013 workflows retirement in your tenant.
