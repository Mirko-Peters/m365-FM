---
title: "How to Get Started With the Power Platform CLI (pac) for Solution Work"
summary: "Get started with the Power Platform CLI: install options and OS support, check your install, create an auth profile, switch profiles, enable tab completion and learn what the introduction does not cover about solution commands."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [power-platform-cli, power-platform-solution]
keypoints:
  - "Three install methods exist: the Visual Studio Code extension, the .NET tool and the Windows MSI. You can use more than one on the same computer."
  - "The .NET tool does not enable pac data or the pac package deploy and pac package show commands. You can manage installed versions with the MSI."
  - "Most commands need an auth profile. Create one with pac auth create --environment and switch with pac auth list and pac auth select --index."
  - "Run pac to see the version on the second line. On Linux or macOS, which pac shows whether it is installed."
  - "The introduction names no pac solution commands. Solution command details belong to the command reference, which this guide did not read."
faq:
  - q: "How do I install the Power Platform CLI?"
    a: "Microsoft Learn lists three methods: the Visual Studio Code extension on Windows, Linux and macOS, the .NET tool on Windows, Linux and macOS, and the Windows MSI on Windows only. You can use more than one on the same computer."
  - q: "How do I check that it is installed?"
    a: "On Windows run Get-Command pac | Format-List. On Windows or Linux run pac, and the version appears on the second line, for example Version: 1.30.3."
  - q: "How do I connect to an environment?"
    a: "Run pac auth create --environment with an environment ID, URL, unique name or partial name. Without it you connect to the default environment. Use --deviceCode for environments without interactive sign-in."
  - q: "How do I switch between profiles?"
    a: "Run pac auth list to see profiles and pac auth select --index 2 to pick one."
  - q: "Which commands need Windows?"
    a: "pac data, pac package deploy and pac package show are Windows-only. The .NET tool installs lack them."
---

Install the CLI with the method that matches your workflow, check the version with pac and create an auth profile for an environment. The Learn introduction lists solution packages among the areas the CLI covers but names no solution commands. This guide follows that page and does not invent them.

## What it is

Learn describes PAC CLI as a simple, one-stop developer CLI that lets developers and independent software vendors perform operations in Power Platform for environment lifecycle, authentication, Microsoft Dataverse environments, solution packages, Power Pages and code components.

## Install options

| Method | OS support | Notes from Learn |
| --- | --- | --- |
| Visual Studio Code extension | Windows, Linux, macOS | Commands run in a PowerShell terminal in VS Code. By itself, PAC CLI is available only in the VS Code terminal unless you enable it for CMD and PowerShell terminals on Windows |
| .NET tool | Windows, Linux, macOS | Works in PowerShell, CMD or Bash. Does not enable `pac data` or the `pac package deploy` and `pac package show` commands |
| Windows MSI | Windows only | The page says commands run in a PowerShell terminal within Visual Studio Code on Windows. You can manage installed versions with this method |

You can use more than one method on the same computer. The installation steps for each method are on separate Learn pages, which were not read for this guide. The introduction has no dedicated prerequisites section, and it gives no minimum versions or license requirements.

## Check the installation

- **Windows:** run `Get-Command pac | Format-List`. If it is missing you see that the term pac is not recognized.
- **Linux or macOS:** run `which pac` to see whether it is installed.
- **Windows or Linux:** run `pac`. The version appears on the second line, for example `Version: 1.30.3+g0f0e0b9`.

## Create an authentication profile

Most commands need an auth profile. Learn's example:

```powershell
pac auth create --environment "HR-Dev"
```

- `--environment` accepts an environment ID, URL, unique name or partial name. Without it you connect to the default environment.
- `--deviceCode` is for environments without interactive sign-in. Learn says it is added automatically in GitHub Codespaces.
- To switch profiles, run `pac auth list` and then `pac auth select --index 2`.

## Which commands the page names

The introduction does not list the command groups. It names only a few commands: `pac auth create`, `pac auth list`, `pac auth select`, `pac data`, `pac package deploy`, `pac package show` and `pac complete`. It links to reference pages for `pac auth`, `pac data` and `pac package`. It names no `pac solution` commands and no groups such as pcf, admin, canvas, connection or env.

## Tab completion in PowerShell

Learn gives a script block to add to your `$PROFILE` that calls `pac complete` and registers it with `Register-ArgumentCompleter -Native -CommandName pac`. For bash, zsh, fish and nushell, the page says to use `pac complete` where the .NET documentation uses `dotnet complete`.

## Version and OS notes

- Windows only: `pac data`, `pac package deploy`, `pac package show`.
- The .NET tool lacks those Windows-only commands.
- Managing installed versions is described for the MSI method.
- Available in GCC and GCC High. Supported environments are described under the `--cloud` parameter of `pac auth create`.

## Solution work: what this page gives you

The page lists solution packages among the areas the CLI covers, and nothing more. It does not describe exporting, importing, unpacking or packing solutions, and it gives no example commands for them. My advice: for those, use the command reference for the solution group and the Learn articles on solutions and application lifecycle management, which this guide did not read.

## A first session (my advice)

The sequence below is my own suggestion built on the page.

1. Install with the method that matches your OS and need. On Windows, the MSI gives you version management.
2. Run `pac` and note the version.
3. Create an auth profile for a development environment.
4. Look up the solution command group in the command reference. The introduction does not describe `pac help` or `pac solution help`.
5. Create a second profile for another environment and practice switching.
6. Keep an eye on the version when a command seems missing.

## Typical mistakes (my advice)

- Installing only the VS Code extension and then looking for pac in a normal terminal.
- Using the .NET tool and expecting pac package deploy.
- Running commands against the default environment because `--environment` was omitted.
- Forgetting which profile is selected before running a command.

## What the page does not say

Licensing, minimum versions, per-method installation steps, troubleshooting, code component workflow, and any solution command. The page offers a GitHub discussions link for feedback.

## Related

- [Power Platform CLI](https://www.m365.fm/entity/power-platform-cli/)
- [Power Platform solution](https://www.m365.fm/entity/power-platform-solution/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)
- [Power Platform Tools VS Code extension](https://www.m365.fm/entity/power-platform-tools-vs-code-extension/)

## Sources

- [Install and Configure Microsoft Power Platform CLI (Microsoft Learn)](https://learn.microsoft.com/power-platform/developer/cli/introduction)
