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
  - "The .NET tool does not enable pac data or the pac package deploy and pac package show commands. Only the MSI lets you manage installed versions."
  - "Most commands need an auth profile. Create one with pac auth create --environment and switch with pac auth list and pac auth select --index."
  - "Run pac to see the version on the second line, and pac help to list all supported commands."
  - "The introduction names pac solution only as a next step. Solution command details are in the command reference, which was not read here."
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

Install the CLI with the method that matches your workflow, create an auth profile for an environment and run pac help to see what is available. Solution work then uses the pac solution group. This guide follows the Microsoft Learn introduction to the Power Platform CLI. The introduction does not cover solution commands in detail, and this guide does not invent them.

## What it is

Learn describes PAC CLI as a simple, one-stop developer CLI that lets developers and independent software vendors perform operations in Power Platform for environment lifecycle, authentication, Microsoft Dataverse environments, solution packages, Power Pages and code components.

## Install options

| Method | OS support | Notes from Learn |
| --- | --- | --- |
| Visual Studio Code extension | Windows, Linux, macOS | Commands run in a PowerShell terminal in VS Code. By itself, PAC CLI is available only in the VS Code terminal unless you enable it for CMD and PowerShell terminals on Windows |
| .NET tool | Windows, Linux, macOS | Works in PowerShell, CMD or Bash. Does not enable `pac data` or the `pac package deploy` and `pac package show` commands |
| Windows MSI | Windows only | Works in a PowerShell terminal. The only method that lets you manage installed versions |

You can use more than one method on the same computer. The installation steps for each method are on separate Learn pages, which were not read for this guide. The introduction has no dedicated prerequisites section, and it gives no minimum versions or license requirements.

## Check the installation

- **Windows:** run `Get-Command pac | Format-List`. If it is missing you see that the term pac is not recognized.
- **Windows or Linux:** run `pac`. The version appears on the second line, for example `Version: 1.30.3+g0f0e0b9`.

## Create an authentication profile

Most commands need an auth profile. Learn's example:

```powershell
pac auth create --environment "HR-Dev"
```

- `--environment` accepts an environment ID, URL, unique name or partial name. Without it you connect to the default environment.
- `--deviceCode` is for environments without interactive sign-in. Learn says it is added automatically in GitHub Codespaces.
- To switch profiles, run `pac auth list` and then `pac auth select --index 2`.

## See what commands exist

`pac help` lists all supported commands. The full list of command groups is in the Command Groups reference that Learn links. The introduction itself names only a few: `pac auth`, `pac data`, `pac package`, `pac complete` and `pac solution help` in its next steps. It does not name groups such as pcf, admin, canvas, connection or env.

## Tab completion in PowerShell

Learn gives a script block to add to your `$PROFILE` that calls `pac complete` and registers it with `Register-ArgumentCompleter -Native -CommandName pac`. For bash, zsh, fish and nushell, the page says to use `pac complete` where the .NET documentation uses `dotnet complete`.

## Version and OS notes

- Windows only: `pac data`, `pac package deploy`, `pac package show`.
- The .NET tool lacks those Windows-only commands.
- Only the MSI supports managing installed versions.
- Available in GCC and GCC High. Supported environments are described under the `--cloud` parameter of `pac auth create`.

## Solution work: what this page gives you

The page points to `pac solution help` as the next step. It does not describe exporting, importing, unpacking or packing solutions, and it does not give example commands for them. For those, use the command reference for the solution group and the Learn articles on solutions and application lifecycle management.

## A first session

The sequence below is practical advice built on the page.

1. Install with the method that matches your OS and need. On Windows, the MSI gives you version management.
2. Run `pac` and note the version.
3. Create an auth profile for a development environment.
4. Run `pac help` and `pac solution help` to read what the solution group offers.
5. Create a second profile for another environment and practice switching.
6. Keep an eye on the version when a command seems missing.

## Typical mistakes

- Installing only the VS Code extension and then looking for pac in a normal terminal.
- Using the .NET tool and expecting pac package deploy.
- Running commands against the default environment because `--environment` was omitted.
- Forgetting which profile is selected before running a command.

## What the page does not say

Licensing, minimum versions, per-method installation steps, troubleshooting, code component workflow, and any solution command. Learn links a separate troubleshooting page for the CLI.

## Related

- [Power Platform CLI](https://www.m365.fm/entity/power-platform-cli/)
- [Power Platform solution](https://www.m365.fm/entity/power-platform-solution/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)
- [Power Platform Tools VS Code extension](https://www.m365.fm/entity/power-platform-tools-vs-code-extension/)

## Sources

- [What is Microsoft Power Platform CLI (Microsoft Learn)](https://learn.microsoft.com/power-platform/developer/cli/introduction)
