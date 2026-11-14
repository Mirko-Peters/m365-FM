---
title: "GitHub Copilot Instructions, Skills, MCP and Custom Agents: Setup Guide"
summary: "Set up GitHub Copilot customization in the order Microsoft documents it: instruction files, prompt files, agent skills, MCP servers and custom agents, with file paths, settings and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [github-copilot, mcp, agent-skill, github-copilot-agent-mode]
keypoints:
  - "Instruction files shape how Copilot answers: .github/copilot-instructions.md applies repository-wide, and .instructions.md files with applyTo apply to matching paths."
  - "Skills are folders with a SKILL.md file that Copilot loads per task, and Visual Studio needs version 18.5 or later for them."
  - "MCP servers add tools. Visual Studio disables tools by default, asks before running them and can re-prompt when a server changes."
  - "Custom agents are .agent.md files with a persona and an explicit tool list. Always list tools, because omitting the field grants all of them."
  - "The Microsoft Learn pages read for this article do not describe hooks for GitHub Copilot in Visual Studio or VS Code."
faq:
  - q: "What is the difference between instructions, skills and custom agents?"
    a: "According to the Visual Studio blog and Microsoft Learn, custom instructions are always active and suit coding style and general preferences. Skills are activated per task when the model judges them relevant and suit workflows and multi-step procedures. Custom agents define a persona and a tool set that you select in the agent picker."
  - q: "Where do I put the instruction file for a repository?"
    a: "Microsoft Learn says to create .github/copilot-instructions.md in the repository for repository-wide instructions. Path-specific files go in .github/instructions/ and end in .instructions.md. In Visual Studio you must also enable custom instructions under Tools, Options, GitHub, Copilot."
  - q: "Where are agent skills stored?"
    a: "Microsoft Learn lists .github/skills/, .claude/skills/ and .agents/skills/ for workspace skills, and ~/.copilot/skills/, ~/.claude/skills/ and ~/.agents/skills/ for personal skills. Each skill is a subdirectory with a required SKILL.md file."
  - q: "Are MCP tools allowed to run automatically?"
    a: "No. Microsoft Learn says tools from a newly added MCP server are disabled by default and must be enabled manually. Copilot also asks before running a tool, and you can approve it for the session, the solution or all future calls."
  - q: "Does GitHub Copilot support hooks?"
    a: "The Microsoft Learn and Visual Studio blog pages read for this article make no statement about hooks for GitHub Copilot in Visual Studio. Learn documents hooks, in preview, for GitHub Copilot agents in Copilot Studio, which is a different product. Check GitHub's own documentation before relying on hooks in your editor."
---
GitHub Copilot is customized in layers, and Microsoft's documentation covers five of them clearly: instruction files, prompt files, agent skills, MCP servers and custom agents. Add them in that order. Start with a short repository instruction file, add a skill for each repeated workflow, connect MCP servers for outside tools, and create custom agents for distinct roles. This guide uses the Microsoft Learn pages for Visual Studio and the Visual Studio Code training module. Hooks are not documented in the pages I could read, and that is stated below.

## Layer 1: Instruction files

Instruction files for [GitHub Copilot](https://www.m365.fm/entity/github-copilot/) embed team conventions in the repository, so Copilot Chat applies them without repeating the context in every prompt. Microsoft Learn lists these types:

| File | Scope | Location |
|---|---|---|
| `copilot-instructions.md` | Whole repository, always on | `.github/copilot-instructions.md` |
| `*.instructions.md` | Matching paths | `.github/instructions/` |
| `AGENTS.md` or `CLAUDE.md` | Always on, shared across AI agents | Workspace root (Visual Studio Code module) |
| Organization instructions | All repositories in a GitHub organization | Set by an organization owner |

A path-specific file starts with YAML front matter. `applyTo` holds a glob such as `**/*.cs`. `description` is optional and is used for matching, and `name` is a display name.

### Enable and verify

1. In Visual Studio, select **Tools** > **Options** > **GitHub** > **Copilot** and select **Enable custom instructions to be loaded from .github/copilot-instructions.md files and added to requests**.
2. Create the file in the repository's `.github` folder.
3. In Visual Studio Code, Learn mentions the `/init` command in Copilot Chat to generate a starter file.
4. Ask a question and open the **References** list of the response. Learn says Copilot lists the instruction file there when it uses it.

The Learn page on Visual Studio also mentions a user-level file at `%USERPROFILE%/copilot-instructions.md`. Repository instructions still apply next to it.

### Writing guidance and limits

Microsoft's advice is to keep instructions short, one rule per line, and to explain the reason behind rules. Focus on rules that linters do not enforce, and split backend and frontend rules into path-specific files. Instructions do not affect inline autocomplete, large unfocused files dilute results, and instructions guide Copilot but do not enforce behavior.

## Layer 2: Prompt files

Prompt files are reusable requests. Store them as `.github/prompts/<name>.prompt.md`. Typing `/` in chat invokes them, and `/savePrompt` saves a prompt from the current conversation. In Visual Studio Code, Learn says a file named `generate-tests.prompt.md` becomes the `/generate-tests` command.

## Layer 3: Agent skills

Agent skills are reusable instruction sets for specific tasks, such as running a build pipeline or following team standards. Visual Studio needs version 18.5 or later and a GitHub Copilot subscription. Copilot discovers skills in agent mode and activates one when it judges it relevant. The chat shows when a skill is applied.

Create a folder per skill:

```text
.github/skills/github-issues/
  SKILL.md        required
  scripts/        optional
  references/     optional
  assets/         optional
```

`SKILL.md` needs a `name` (lowercase letters, numbers and hyphens, matching the folder name, up to 64 characters) and a `description` (up to 1,024 characters) that says what the skill does and when to use it. Keep the file under 500 lines and move detail to `references/`.

Workspace skills can live in `.github/skills/`, `.claude/skills/` or `.agents/skills/`. Personal skills live in `~/.copilot/skills/`, `~/.claude/skills/` or `~/.agents/skills/`. Built-in .NET and Azure skills are disabled by default. Enable them from the **Tools** icon in Copilot Chat under **Built-in**. The skills panel is available only in Visual Studio 2026 Insiders.

## Layer 4: MCP servers

MCP servers give agent mode extra tools. The [Model Context Protocol](https://www.m365.fm/entity/mcp/) support in Visual Studio requires Visual Studio 2026, or Visual Studio 2022 version 17.14 or later, according to Learn. Ways to add a server include:

- In chat, switch to **Agent** mode, select **Tools**, select **+**, choose **Add custom MCP server**, and enter the name and either a URL or a command with arguments.
- From **Extensions** > **MCP Registries...**.
- With a `.mcp.json` file, for example in the solution folder for source control. Learn shows a `servers` object with an entry for the GitHub MCP server URL.

Behavior to expect:

- Tools are disabled by default. Enable them yourself.
- Copilot asks before running a tool. Use the **Allow** dropdown to approve for the session, the solution or all future invocations.
- When a server's tool list changes, Visual Studio resets earlier tool permissions and fetches the list again.
- In Visual Studio 2026 version 18.7 and later, a trust dialog appears when a server's configuration or capabilities change.
- If an administrator disables agent mode in the GitHub Copilot policy, MCP servers are unavailable. An organization allow list can block servers.

## Layer 5: Custom agents

A custom agent is a Markdown file ending in `.agent.md`. Repository agents live in `.github/agents/`. In Visual Studio, user-level agents default to `%USERPROFILE%\.github\agents`, and organization-level agents appear automatically for repositories in the organization. Visual Studio needs version 18.4 or later.

The front matter supports `description` (required in Visual Studio), `name`, `model` and `tools`. The Visual Studio Code module adds `agents`, `handoffs` and `mcp-servers`. A Learn example keeps a security reviewer read-only with `tools: ['search', 'read']`.

Select the agent in the agent picker, or type `@` and its name. Then open the **Tools** panel to confirm the expected tools are enabled.

Microsoft's best practices:

- List `tools` explicitly. Omitting the field grants all available tools.
- Give each agent one focused role and clear limits.
- Use `handoffs` to chain agents, for example a planner that hands off to an implementer.
- Check tool names in your editor, because names differ between GitHub Copilot platforms.

## What about hooks?

The Microsoft pages I read for Visual Studio and the Visual Studio Code module do not describe hooks for GitHub Copilot. I also could not read the Visual Studio Code documentation page on hooks, so this article does not describe them. Learn does document hooks, in preview, for GitHub Copilot agents in Copilot Studio. They run a workflow when an event occurs, such as a tool being called, and Learn says hooks should not be your only safeguard for critical rules. That is a different product. Verify hooks against GitHub's documentation before use.

## Common mistakes

- Using instructions for task procedures. Skills fit procedures, because they load only when relevant.
- Leaving `tools` out of an agent file, which grants every tool.
- Copying a community agent without checking its tool names in Visual Studio.
- Enabling every MCP tool at once. Enable only what the task needs.

## Related

- [GitHub Copilot](https://www.m365.fm/entity/github-copilot/)
- [GitHub Copilot agent mode](https://www.m365.fm/entity/github-copilot-agent-mode/)
- [Model Context Protocol (MCP)](https://www.m365.fm/entity/mcp/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)

## Sources

- [Customize GitHub Copilot responses using instruction files (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/configure-customize-github-copilot-visual-studio-code/3-customize-copilot-responses-instruction-files)
- [Create custom GitHub Copilot agents in Visual Studio Code (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/configure-customize-github-copilot-visual-studio-code/4-create-custom-github-copilot-agents)
- [Use Agent Skills with GitHub Copilot in Visual Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills?view=visualstudio)
- [Use GitHub Copilot agents in Visual Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-specialized-agents?view=visualstudio)
- [Use MCP servers in Visual Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers)
- [Customize Copilot Chat with instructions and prompt files in Visual Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-chat-context)
- [Agent Skills in Visual Studio (Visual Studio Blog)](https://devblogs.microsoft.com/visualstudio/agent-skills-in-visual-studio/)
- [Hooks in Copilot Studio, preview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/hooks-overview)
