---
title: "GitHub Copilot CLI: Getting Started with Instructions, Custom Agents and Skills"
summary: "How to install and customize GitHub Copilot CLI: install options, login, custom instruction files, custom agents in .agent.md files, skills with SKILL.md, plus MCP, hooks and plugins as GitHub documents them."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [github-copilot-cli, github-copilot, mcp]
keypoints:
  - "Copilot CLI needs an active Copilot plan. Via an organization, the Copilot CLI policy must be enabled. Windows needs PowerShell v6 or higher."
  - "Install with npm (Node.js 22 or later), WinGet, Homebrew, an install script or a direct download, then sign in with /login."
  - "Custom instructions come from files such as .github/copilot-instructions.md, AGENTS.md and path-specific .instructions.md files."
  - "A custom agent is an .agent.md file in .github/agents or ~/.copilot/agents. It runs as a subagent with its own context window."
  - "A skill is a folder with a SKILL.md file. GitHub notes that pre-approving shell or bash in allowed-tools removes the confirmation step for terminal commands and advises omitting them when in doubt."
faq:
  - q: "How do I install GitHub Copilot CLI?"
    a: "GitHub Docs lists npm install -g @github/copilot (Node.js 22 or later), winget install GitHub.Copilot on Windows, brew install --cask copilot-cli on macOS and Linux, an install script for macOS and Linux, and a direct download. You need an active Copilot subscription, and on Windows PowerShell v6 or higher."
  - q: "How do I sign in?"
    a: "GitHub Docs says that on first launch, if you aren't logged in, you are prompted to use the /login slash command. Alternatively, export a fine-grained personal access token with the Copilot Requests permission as COPILOT_GITHUB_TOKEN, GH_TOKEN or GITHUB_TOKEN."
  - q: "Where do custom instructions go?"
    a: "GitHub Docs lists user-level files under $HOME/.copilot and repository files such as .github/copilot-instructions.md, .github/instructions/**/*.instructions.md, AGENTS.md, CLAUDE.md and GEMINI.md. Applicable files are combined, and there is no general precedence order, so avoid conflicting instructions."
  - q: "How do I create and run a custom agent?"
    a: "Per GitHub Docs, enter /agent in interactive mode and select Create new agent, choose Project or User location and define it. Project agents live in .github/agents, user agents in ~/.copilot/agents. Run one with /agent or with copilot --agent <name> --prompt followed by your prompt."
  - q: "What is the difference between a skill and a custom agent?"
    a: "GitHub Docs describes skills as folders of instructions, scripts and resources that Copilot loads for specialized tasks. Custom agents define expertise and behavior for a type of task and run as subagents with their own context window and a limitable toolset."
---
GitHub Copilot CLI brings Copilot into the terminal. Out of the box it works without configuration, but GitHub's documentation lists several ways to shape it: custom instructions, custom agents, skills, MCP servers, hooks and plugins. This article covers installation, sign-in and the three customization layers most people start with.

## Requirements and installation

GitHub Docs says Copilot CLI is available with all Copilot plans. You need an active Copilot subscription. If you get Copilot through an organization, the organization must enable the Copilot CLI policy. On Windows you need PowerShell v6 or higher.

Install methods listed by GitHub:

- **npm (all platforms):** `npm install -g @github/copilot`, which needs Node.js 22 or later.
- **WinGet (Windows):** `winget install GitHub.Copilot`
- **Homebrew (macOS and Linux):** `brew install --cask copilot-cli`
- **Install script (macOS and Linux):** `curl -fsSL https://gh.io/copilot-install | bash`
- **Direct download** of the executable from the `copilot-cli` repository.

Prerelease builds use `@github/copilot@prerelease` (npm), `GitHub.Copilot.Prerelease` (WinGet) or `copilot-cli@prerelease` (Homebrew).

## Sign in

On first launch, if you are not logged in, you are prompted to use the `/login` slash command. For automation, use a fine-grained personal access token with the **Copilot Requests** permission. The token must be user-owned. Export it as `COPILOT_GITHUB_TOKEN`, `GH_TOKEN` or `GITHUB_TOKEN`. GitHub lists them in that order of precedence.

## Layer 1: Custom instructions

Instructions are added to your prompt whenever you ask a question or assign work, so you don't repeat coding standards in each session. Supported locations:

- User level: `$HOME/.copilot/copilot-instructions.md` and `$HOME/.copilot/instructions/**/*.instructions.md`
- Repository: `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md` and `GEMINI.md`
- Extra directories listed in `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`

Rules to remember: applicable files are combined and identical duplicates are removed. There is no general precedence order, so avoid conflicting instructions. Path-specific files use `applyTo` with glob patterns and are included only when the pattern matches a file Copilot is working with. Use `/instructions` to list discovered files and to enable or disable them. Edits do not affect active sessions. Resume with `copilot --continue` or start a new session with `/new`.

## Layer 2: Custom agents

A custom agent defines expertise and behavior for a type of task. It runs as a subagent with its own context window, so it does not clutter the main agent's context. By default a custom agent can use every tool. If you restrict its access, a `tools` specification is added to the agent file. GitHub's example profile is a security reviewer.

- **File:** a Markdown file with the `.agent.md` extension.
- **Project agents:** `.github/agents/`. **User agents:** `~/.copilot/agents/`. If names clash, the home directory version is used.
- **Create:** enter `/agent`, select **Create new agent**, choose Project or User, then let Copilot generate the profile or write it yourself. You also choose the tools the agent can access. Restart the CLI to load the new agent.
- **Run:** `/agent`, an explicit request such as "Use the security-auditor agent on /src/app", inference from the agent's description, or `copilot --agent <name> --prompt "..."`.

## Layer 3: Skills

Skills are folders of instructions, scripts and resources that Copilot loads for specialized tasks.

- **Locations:** project skills in `.github/skills`, `.claude/skills` or `.agents/skills`. Personal skills in `~/.copilot/skills` or `~/.agents/skills`.
- **Structure:** a subdirectory per skill with a file named exactly `SKILL.md`. Frontmatter needs `name` and `description`. `license` and `allowed-tools` are optional.
- **Safety:** GitHub says that pre-approving `shell` or `bash` in `allowed-tools` removes the confirmation step for running terminal commands, and advises: when in doubt, omit `shell` and `bash` from `allowed-tools`.
- **Manage:** `/skills list`, `/skills info`, `/skills reload` and `copilot skill list`. Request a skill by name with a slash, such as `/frontend-design`.

## Other options

GitHub's overview also lists **MCP servers** for external tools and data, **hooks** that run your own shell commands at key points during a session, and **plugins**, described as distributable packages that extend the CLI. The overview page gives no file formats for these. Follow the linked pages for each.

## Which layer for which job

- Standing rules for a repository: instructions.
- A specialist role with limited tools: custom agent.
- A repeatable workflow with scripts: skill.
- Access to a database or issue tracker: MCP server.

GitHub's overview does not include a decision guide, so this mapping is a reading of its descriptions.

## Common mistakes (own checklist)

- Writing conflicting instruction files and expecting one to win.
- Forgetting to restart the CLI after creating an agent.
- Pre-approving shell tools for a skill from an unknown source.
- Expecting instruction edits to apply to a running session.

## Related

- [GitHub Copilot CLI](https://www.m365.fm/entity/github-copilot-cli/)
- [GitHub Copilot](https://www.m365.fm/entity/github-copilot/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)

## Sources

- [Install GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)
- [Overview of customizing GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview)
- [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [Creating and using custom agents for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
- [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
