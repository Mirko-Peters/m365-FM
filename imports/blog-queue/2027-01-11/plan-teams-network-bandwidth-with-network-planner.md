---
title: "How to Plan Teams Network Bandwidth With Network Planner"
summary: "Use Network Planner in the Teams admin center: required roles, personas, creating a network plan with sites, WAN and egress settings, generating a bandwidth report, and what the Learn page does not cover such as subnets, formulas and licensing."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [teams-admin-center, teams]
keypoints:
  - "Network Planner is under Planning > Network planner in the Teams admin center. It needs Global Administrator, Teams Administrator or Teams Communications Administrator."
  - "Three recommended personas exist: office workers, remote workers and Teams Rooms System. You can add up to three custom personas."
  - "Create a network plan, add sites with the number of network users, WAN and internet egress details, then start a report and select Generate report."
  - "You must enter WAN and internet capacity values to get specific bandwidth recommendations in a report."
  - "The page has no subnet steps, no bandwidth formulas or per-activity values, no licensing statement and does not name Teams Phone."
faq:
  - q: "Where is Network Planner?"
    a: "In the Teams admin center under Planning > Network planner."
  - q: "Which roles can use it?"
    a: "Global Administrator, Teams Administrator or Teams Communications Administrator."
  - q: "What are personas?"
    a: "Microsoft recommends three: office workers, remote workers and Teams Rooms System, based on typical Teams usage. You can create up to three custom personas on the Personas tab."
  - q: "How do I get a bandwidth report?"
    a: "On the Reports tab select Start a report, distribute users across personas for each site and select Generate report. With the recommended personas the distribution is automatic: 80 percent office workers and 20 percent remote workers."
  - q: "Does the page explain how bandwidth is calculated?"
    a: "No. It says the report shows calculations for each permitted activity and an overall view with recommendations, but it gives no per-user values or formulas."
---

Network Planner helps you work out the network requirements for Teams across your locations. You describe your sites and Teams usage, and it calculates what the network needs for Teams and cloud voice. This guide follows the Microsoft Learn page Use the Network planner for Microsoft Teams.

## Where it is and who can use it

Network Planner is in the Teams admin center under **Planning** > **Network planner**. The roles are Global Administrator, Teams Administrator or Teams Communications Administrator.

## Personas

- Microsoft recommends three personas: office workers, remote workers and Teams Rooms System. They are based on Teams best-use scenarios and typical usage patterns.
- You can create up to three custom personas.
- To create one, go to the **Personas** tab, select **+ Custom persona**, enter a name and description in the **New custom persona** pane, select the permissions the persona uses and select **Save**.

## Build a network plan

1. On the **Network Plan** tab select **Add a network plan** and enter a name and description.
2. Select the plan name.
3. Add sites that represent your network, such as a building or office. Sites might be connected by a WAN to share internet or PSTN connections. For best results create sites with local connections before sites that connect remotely to the internet or PSTN.
4. For each site enter:
   - Name and description.
   - **Network settings**: the number of network users at the site. This is required.
   - Network details: whether WAN is enabled, WAN capacity, internet egress (Local or Remote) and PSTN egress (none, local or remote).
5. Select **Save**.

You must enter WAN and internet capacity values to get specific bandwidth recommendations in a report.

## Create a report

1. On the **Reports** tab select **Start a report**.
2. For each site, distribute users across the available personas. With the recommended personas the distribution is automatic: 80 percent office workers and 20 percent remote workers.
3. Select **Generate report**. The report includes a table of calculations showing bandwidth requirements for each permitted activity, and an overall view of bandwidth needs with recommendations.
4. Select **Save**. The report appears in the reports list.

## Example material

The page links to a how-to PowerPoint deck in English only.

## What the page does not say

- How to add subnets. The page does not mention them.
- Per-user or per-activity bandwidth values or formulas.
- Licensing requirements.
- What the calculation includes. The page says Network Planner calculates requirements for Teams and cloud voice, but it does not name Teams Phone or break down the traffic types.

## A planning outline

This outline is my advice, built on the page.

1. List your sites and how each connects to the internet and the PSTN.
2. Gather user counts and WAN and internet capacity for each site.
3. Create local sites first, then remote ones.
4. Generate a report with the default personas, then adjust the persona split if your usage differs.
5. Compare the recommendations with your actual link capacity.

## Typical mistakes (my advice)

- Leaving WAN and internet capacity empty and expecting specific recommendations.
- Entering remote sites before the local sites they depend on.
- Treating the 80 and 20 percent default split as a measurement of your own users.
- Expecting subnet-level planning from this page.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Location | Teams admin center > Planning > Network planner |
| Roles | Global Administrator, Teams Administrator, Teams Communications Administrator |
| Recommended personas | Office workers, remote workers, Teams Rooms System |
| Custom personas | Up to three |
| Default user split | 80 percent office workers, 20 percent remote workers |
| Required site input | Number of network users |

## What to collect before you start

For each site, gather the number of network users, whether the site has a WAN and its capacity, whether internet egress is local or remote, and whether PSTN egress is none, local or remote. The page says WAN and internet capacity values are needed for specific bandwidth recommendations. Without them the report cannot give specific numbers.

## Reports are saved

When you select Save at the end of a report, the page says it is available on the reports list for later viewing. My note, not stated on the page: this should let you keep several reports for the same plan, for example with different persona splits, and compare them later.

## Related

- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams](https://www.m365.fm/entity/teams/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Use the Network planner for Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/network-planner)
