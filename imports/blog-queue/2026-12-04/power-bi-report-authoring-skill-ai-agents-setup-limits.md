---
title: "Power BI Report Authoring Skill: How AI Agents Build Reports, Setup and Limits"
summary: "What Microsoft Learn documents about the Power BI Report Authoring skill for AI agents: what it does, how the powerbi-authoring plugin is installed, which clients it targets and the limits Microsoft lists."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [power-bi, power-bi-project-pbip, agent-skill, mcp]
keypoints:
  - "The Power BI Report Authoring skill (power-bi-report-authoring) creates, edits and validates PBIR report definitions in PBIP projects. Learn marks it as preview."
  - "Tables, columns, measures and DAX are not report-layer work. Learn sends them to the Power BI Modeling MCP server, and the semantic-model-authoring skill is also in preview."
  - "Install the powerbi-authoring plugin from the Skills for Fabric marketplace. GitHub Copilot CLI is the primary target, with compatibility shims for Claude Code and others."
  - "The skill works only with PBIP files. The PBIR files on disk are the source of truth, so save Desktop changes and commit a baseline before the agent edits."
  - "Learn advises avoiding Q&A, Bing maps and filled maps in agent prompts, because those visuals will be deprecated soon."
faq:
  - q: "What is the Power BI Report Authoring skill?"
    a: "Microsoft Learn describes it as an AI-agent skill, identified as power-bi-report-authoring, for natural-language authoring, modification and validation of Power BI report definitions in the PBIR format used by PBIP project files. The page marks the feature as preview."
  - q: "Can the skill write DAX?"
    a: "No. Learn says to use it for the report layer (pages, visuals, filters, slicers, formatting, themes). For tables, columns, measures and DAX it points to the Power BI Modeling MCP server. The separate semantic-model-authoring skill covers DAX measures and DAX performance, and its Learn page also says it is in preview."
  - q: "Which AI clients are supported?"
    a: "The Power BI agentic overview says Skills for Fabric is optimized for GitHub Copilot CLI and provides compatibility shims for VS Code Copilot, Claude Code, Cursor, Codex/Jules and Windsurf. The install scripts configure the compatibility files automatically."
  - q: "How does the agent check what it built?"
    a: "The report skill page describes a flow of editing PBIR files, running validate-report to catch structural problems, and then using the Power BI Desktop bridge to reload Desktop and capture screenshots. Learn does not state whether Desktop is optional."
  - q: "What should I do before letting the agent edit a report?"
    a: "Learn says to commit a baseline before the agent modifies PBIR files so you can revert, and to save manual changes in Power BI Desktop first. Unsaved Desktop changes are not included, because the agent reads the version from the PBIR files."
---

The Power BI Report Authoring skill lets an AI coding agent create, change and check Power BI report definitions from plain-language prompts. It is not a switch inside the Power BI service. Microsoft describes Power BI agentic development as a curated bundle that you install into your agent. Here is what Microsoft Learn documents about the skill, its setup and its limits.

## What the toolkit consists of

The Power BI agentic overview describes two building blocks:

- **Agent skills.** Folders of instructions, scripts and resources that an agent loads on demand. They cover semantic model authoring and report authoring.
- **Tools.** MCP servers and CLI bridges that let the agent inspect schemas, run DAX, edit semantic models, validate reports and drive Power BI Desktop, for example to reload a model or capture screenshots.

Learn puts it this way: skills tell the agent what to do, tools let it do it.

The overview lists these skills:

| Skill | What Learn says it does |
|---|---|
| `semantic-model-authoring` | Create, edit, deploy and manage semantic models, including DAX measures, relationships, refresh and DAX performance |
| `power-bi-report-authoring` | Create, edit and validate reports in the PBIR format used by PBIP files |
| `power-bi-report-design` | Produce a structured design brief for reports in PBIR |
| `power-bi-report-planner` | A guided workflow to define, plan and build a new report from an existing semantic model |
| `power-bi-report-management` | Get, publish and manage reports in Microsoft Fabric workspaces |

The tools listed are a local Power BI MCP server, which the plugin registers automatically, and the Power BI Desktop Bridge, a local server inside the Power BI Desktop process that lets external tools talk to a running Desktop instance. The Learn pages use different names for the MCP server (Power BI MCP server, Modeling MCP server, Authoring MCP server), so check which one your plugin version registers.

## What the report authoring skill does

The report skill page marks the feature as preview. It describes the skill as enabling natural-language authoring, modification and validation of report definitions in PBIR. It is distributed in the `powerbi-authoring` plugin of the Skills for Fabric marketplace.

Learn lists these use cases:

- Create a new report from an existing semantic model.
- Modify an existing report, or modernize it with better designs.
- Add a page with a clustered column chart, KPI cards and a date slicer bound to an existing semantic model.
- Re-theme a report with a dark theme, including `dataColors`, `textClasses` and `visualStyles`.
- Convert legacy `card` or matrix visuals to `cardVisual` and `pivotTable` visuals and reapply selector-based formatting.
- Diagnose a visual that renders as an error icon or empty frame and fix the underlying `queryState` or role bindings.

The page says to choose this skill for the report layer: pages, visuals, filters, slicers, formatting and themes. For tables, columns, measures and DAX it points to the Power BI Modeling MCP server, and for data querying and insights to the remote Power BI MCP server.

## Companion skills and the typical flow

For greenfield builds, redesigns or "make this look professional" requests, Learn suggests pairing the report skill with the design skill, which produces a design brief that becomes the input to report authoring. For guided end-to-end creation it points to the planner skill, which calls the report skill for PBIR file mechanics and the report management skill for Fabric publishing. All three ship in the same plugin and are designed to be installed together.

The page describes a typical flow:

1. Use the Modeling MCP server to make sure the semantic model has the tables, columns and measures the report needs.
2. Use the report authoring skill to edit PBIR files.
3. Use `validate-report` to catch structural problems.
4. Use the Power BI Desktop bridge to reload Desktop and capture screenshots.
5. Delegate review to an independent design-reviewer pass and iterate until validation and visual checks pass.

You can also start at step 2 with existing PBIP files.

## Install

Requirements on the overview page are GitHub Copilot CLI and Node.js 18 or later, which Learn says is needed to install the Power BI Modeling MCP server. The documented commands for GitHub Copilot CLI are:

```
copilot plugin marketplace add microsoft/skills-for-fabric
copilot plugin install powerbi-authoring@fabric-collection
```

Then start GitHub Copilot and run `/skills` to confirm that skills such as `semantic-model-authoring` appear. For VS Code, Learn points to the agent customizations editor and says to search for the `powerbi-authoring` plugin.

On clients, Learn says Skills for Fabric is optimized for GitHub Copilot CLI and provides compatibility shims for VS Code Copilot, Claude Code, Cursor, Codex/Jules and Windsurf. The install scripts configure the appropriate files automatically.

## Where DAX fits

If you want the agent to write measures, you need the semantic model side. The semantic-model-authoring page says that skill is in preview and needs one of three things: Power BI Desktop with a model open, a PBIP project on disk, or a semantic model in a Fabric workspace. The Power BI Authoring MCP server is not a hard dependency but is strongly recommended, because the skill routes authoring operations to it first. Without it, the skill falls back to editing TMDL files for PBIP or to REST `getDefinition` and `updateDefinition` calls for a Fabric workspace. Authoring against Desktop with neither a PBIP project nor the MCP server is not supported. In that case the agent stops and asks you to register the MCP server or save the model as PBIP.

## Considerations Learn lists

- **Support.** The report skill works only with PBIP files.
- **Source control.** Commit a baseline before you allow the agent to modify PBIR files so you can revert changes.
- **Source of truth.** The PBIR file is the source of truth. If you have unsaved changes in Power BI Desktop and ask the agent to iterate, it fetches the version from PBIR and does not include your unsaved changes.
- **Legacy visuals.** Q&A, Bing maps and filled maps will be deprecated soon, so Learn recommends not prompting the agent to create them.

If the agent does not load a skill, the semantic model page suggests invoking it with an explicit slash command, for example `/semantic-model-authoring` followed by your prompt, and restarting GitHub Copilot CLI so new MCP configuration is picked up. Running `/mcp show` confirms whether the Power BI MCP server appears and works.

## What the Learn pages do not say

The pages read do not describe an auto mode or interactive mode, a list of what the skill cannot do in the Fabric service, licensing requirements, or a general availability date. They also do not say whether Power BI Desktop is optional for previews. Treat anything beyond the points above as unverified and test in a copy of your project.

## Practical order of work

1. Get the semantic model right first, including the measures the report needs.
2. Create or convert a PBIP project with PBIR reports and commit it.
3. Make a change, validate it, and check the rendered result before the next change.
4. Review the diff in source control before you publish or share the report.

These steps are a cautious order of work built on the documented flow, not a Microsoft checklist.

## Common mistakes

- Asking the report skill to write a measure. Learn routes model work to the MCP server and the semantic model skill.
- Editing in Desktop and in the agent at the same time without saving, so the agent works from stale PBIR files.
- Asking for Q&A, Bing maps or filled maps visuals.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI project (PBIP)](https://www.m365.fm/entity/power-bi-project-pbip/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)
- [MCP](https://www.m365.fm/entity/mcp/)

## Sources

- [Power BI Report Authoring skill (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview)
- [Power BI Agentic Overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-agentic-overview)
- [Power BI Semantic Model Authoring skill (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/agentic/semantic-model-authoring-skill-overview)
