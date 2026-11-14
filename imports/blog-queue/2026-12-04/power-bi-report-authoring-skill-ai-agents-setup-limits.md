---
title: "Power BI Report Authoring Skill: How AI Agents Build Reports, Setup and Limits"
summary: "What Microsoft documents about the Power BI report authoring skill and the semantic model skill: what each does, how to install them, which clients are supported, and the limits that apply."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [power-bi, power-bi-project-pbip, agent-skill, mcp]
keypoints:
  - "The Power BI Report skill (powerbi-report-cli) plans, designs, authors, validates and manages reports in PBIR format inside PBIP projects and in Fabric workspaces."
  - "DAX and semantic model work belong to the separate semantic-model-authoring skill and the Power BI Authoring MCP server, which Learn marks as preview."
  - "Install the powerbi-authoring plugin from Skills for Fabric. Microsoft names GitHub Copilot CLI as the primary target and lists compatibility shims for Claude Code and others."
  - "Visuals bind to existing model fields only. In auto mode the agent assumes all permissions are enabled, so Learn recommends interactive mode for production reports."
  - "Commit a source-control baseline before the agent makes substantial changes, because local PBIR files are the source of truth."
faq:
  - q: "What is the Power BI report authoring skill?"
    a: "Microsoft Learn describes the Power BI Report skill, identified as powerbi-report-cli, as one AI-agent skill for planning, designing, authoring, validating and managing Power BI reports. It works with PBIR report definitions inside PBIP projects and with reports hosted in Microsoft Fabric."
  - q: "Can the skill write DAX?"
    a: "Not the report skill. Learn says the report skill covers the report layer only and that tables, relationships, measures and DAX go to the Power BI MCP servers. The semantic-model-authoring skill covers DAX measures and DAX performance, and Learn says that feature is in preview."
  - q: "Which AI clients are supported?"
    a: "The Power BI agentic overview on Microsoft Learn says GitHub Copilot CLI is the primary target. It lists compatibility shims for VS Code Copilot, Claude Code, Cursor, Codex and Jules, and Windsurf, created by the install scripts. The semantic model skill page names GitHub Copilot as the client."
  - q: "Do I need Power BI Desktop?"
    a: "It is optional. According to Learn, the agent uses Power BI Desktop for preview if it is installed and otherwise falls back to a headless browser flow. The Power BI Desktop Bridge is a local server inside Desktop that lets tools reload a model or capture screenshots."
  - q: "Is this safe for production reports?"
    a: "Learn recommends interactive mode for production reports, because the agent assumes all permissions are enabled in auto mode. It also advises committing a source-control baseline before substantial changes and saving any manual Desktop edits before asking the agent to edit."
---

The Power BI Report skill lets an AI coding agent plan, build, check and publish Power BI reports from plain-language prompts. It is not a switch inside the Power BI service. You install it into your agent, and it edits local report files. Here is what Microsoft documents about setup, scope and limits.

## What is in the toolkit

Microsoft Learn describes Power BI agentic development as a set of agent skills plus tools.

**Skills**

- `powerbi-report-cli` (the Power BI Report skill): creates, edits and validates PBIR report definitions in PBIP projects, produces design briefs, and publishes and manages reports in Fabric workspaces.
- `semantic-model-authoring`: creates, edits, deploys and manages semantic models, including DAX measures, relationships, refresh and DAX performance.

**Tools**

- The **Power BI Authoring MCP server**, a local server that inspects schemas, runs DAX and edits semantic models in Power BI Desktop or Fabric. The plugin registers it automatically.
- The **Power BI Desktop Bridge**, a local server inside the Power BI Desktop process that lets external tools talk to a running Desktop instance, for example to reload a model or capture screenshots.

Both skills ship in the `powerbi-authoring` plugin in the Skills for Fabric marketplace.

## What the report skill does

The default flow has five stages, each optional: **Plan, Design, Author, Validate, Manage**. Documented capabilities include:

- Plan a report from an existing semantic model.
- Create design briefs, and critique or modernize existing reports.
- Create or change pages, visuals, slicers, filters, bookmarks, formatting and themes in PBIR.
- Replace legacy visuals and restore field bindings.
- Diagnose empty visuals, error icons and incorrect role bindings.
- Validate PBIR and capture rendered screenshots.
- Publish, download, update, list or delete reports in Fabric workspaces.

Example prompts from the page: plan an executive sales report from a semantic model, add KPI cards, a clustered column chart and a date slicer to the overview page, validate the PBIR files and fix structural errors, publish the report to a named workspace.

## Install

Requirements on the overview page: GitHub Copilot CLI and Node.js 18 or later, which the MCP server needs. The documented commands for GitHub Copilot CLI are:

```
copilot plugin marketplace add microsoft/skills-for-fabric
copilot plugin install powerbi-authoring@fabric-collection
```

Then start Copilot and run `/skills` to confirm that skills such as `semantic-model-authoring` appear. For VS Code, search for the `powerbi-authoring` plugin in the agent customizations editor.

Supported clients, per Learn: GitHub Copilot CLI is the primary target, with compatibility shims for VS Code Copilot, Claude Code, Cursor, Codex and Jules, and Windsurf.

## Project requirements

For local report authoring the report skill page lists:

1. Use **PBIP projects with the PBIR report format**.
2. Optionally install **Power BI Desktop** for preview. Without it the skill uses a headless browser.
3. Commit a source-control baseline before substantial agent changes.

Local PBIR files on disk are the source of truth. Save any manual Desktop changes before asking the agent to edit.

## Where DAX fits

If you want the agent to write measures, you need the semantic model side. Learn says the semantic-model-authoring skill is in preview and expects a model open in Power BI Desktop, a PBIP project on disk, or a model in a Fabric workspace. The MCP server is strongly recommended but not a hard dependency. Without it, the skill falls back to editing TMDL files for PBIP, or to REST calls for a Fabric workspace. Authoring against Desktop with neither a PBIP project nor the MCP server isn't supported.

For model changes in the AI readiness workflow, the agent presents findings grouped by severity and applies only the fixes you approve.

## Limits and cautions

| Topic | What Learn says |
|---|---|
| Scope | Report layer only. No workspace administration, deployment pipeline administration, capacity management or semantic-model permissions |
| Dependencies | Visuals must bind to existing fields and measures. Create missing ones with the modeling tools first |
| Legacy visuals | Avoid Q&A, Bing Maps and filled maps, which are scheduled for deprecation |
| Validation | Structural validation does not replace visual verification. Check rendered output after meaningful changes |
| Permissions | In auto mode the agent assumes all permissions are enabled. Interactive mode is recommended for production |
| Skill loading | The agent may miss a skill. An explicit slash command is the documented workaround |

The report skill page does not state a preview or general availability status, and it gives no Fabric licensing details. The agentic overview does not state a status or security guidance either. Only the semantic model skill page says preview. Check the Skills for Fabric repository for the current state.

## Practical order of work

1. Get the semantic model right first, including the measures the report needs.
2. Convert or create a PBIP project with PBIR reports and commit it.
3. Ask for a plan before asking for visuals, then approve it.
4. Run validation and a rendered preview after each batch of changes.
5. Review the diff before publishing to a shared Fabric workspace.

## Common mistakes

- Asking the report skill to write a measure. It routes model work to the MCP servers.
- Editing in Desktop and in the agent at the same time without saving.
- Publishing straight from auto mode.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI project (PBIP)](https://www.m365.fm/entity/power-bi-project-pbip/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)
- [MCP](https://www.m365.fm/entity/mcp/)

## Sources

- [Power BI report authoring skill overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview)
- [Power BI agentic overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-agentic-overview)
- [Semantic model authoring skill overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/semantic-model-authoring-skill-overview)
