---
title: "Writing a safe scripted action: parameters, secrets and testing"
summary: "A safe Nerdio scripted action declares its inputs, takes secrets from secure variables, exits with an error when a command fails and is tested on one isolated host before a bulk run. This guide walks through those steps with the options and limits Nerdio and Microsoft Learn document."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-scripted-actions, nerdio-manager-for-enterprise]
keypoints:
  - "Declare inputs instead of hard-coding them: Windows scripts take a param block with attributes such as Mandatory and ValidateSet, runbooks take a Variables comment block with IsRequired and DefaultValue."
  - "Keep secrets in Nerdio secure variables (stored in Azure Key Vault, referenced as $SecureVars.Name) and limit each to the scripted actions that need it."
  - "Make failures visible: for runbooks, Nerdio says a failing command can leave a job at Complete, so make errors exit the script; we suggest the same check for native programs. For Windows scripts, read output through the task's script logs. Never restart the VM inside the script."
  - "Test in layers: directly on an isolated development host, then through Nerdio on one VM, then in bulk with a small group size and a failure threshold."
  - "Running a copy of a runbook in the Azure Automation Test pane performs real actions, so use non-production resources."
faq:
  - q: "Where should a password or API key for a scripted action live?"
    a: "In a Nerdio secure variable. Nerdio stores these values in Azure Key Vault, names must be 1 to 20 alphanumeric characters, and the script reads the value as $SecureVars.Variable_Name. Selecting 'Pass variable to specified scripted actions only' limits it to the actions you choose; if cleared, every scripted action receives it."
  - q: "Why does a failed runbook show Complete in Nerdio Manager?"
    a: "Nerdio's troubleshooting page says a runbook script that meets no fatal error can end as Complete although a command failed. Its considerations page advises that commands which error should exit the script, so the job reports Fail. In PowerShell, setting $ErrorActionPreference to Stop escalates non-terminating errors to script-terminating errors, which is our suggested way to follow the advice for cmdlets. A native program such as reg.exe needs its own check of $LASTEXITCODE."
  - q: "Can I test a runbook safely in the Azure Automation Test pane?"
    a: "Only against non-production resources. Learn states that a test runs the Draft version and the runbook still performs its actions. Nerdio's troubleshooting page says its Automation account runs a specialized runbook that copies the code from Nerdio Manager, so our recommendation is to paste the script into a separate test runbook and supply the variables by hand."
---

A safe scripted action declares its inputs, reads secrets from Nerdio secure variables, exits with an error when a command fails and has run on one isolated host before it touches a pool. This guide takes those steps in order for [Nerdio scripted actions](/entity/nerdio-scripted-actions/) in [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/). It assumes you know what Windows scripts and Azure runbooks are; the companion article "Nerdio scripted actions explained" covers that.

## 1. Start from the documented structure

Nerdio's guide to generating scripts describes the shape of a scripted action. The first line is a comment with a description, written as `#description: ...`. The next line can optionally carry tags, such as `#tags: Nerdio, Preview`. In Nerdio's full example, a `<# Variables: { ... } #>` block with a description and an IsRequired flag per variable follows, then the body. Nerdio documents that block in its runbook variables page, and its ChatGPT guide also uses it in a Windows script. To stay inside the format, clone a default script; Nerdio locks the defaults.

## 2. Declare parameters

For Windows scripts, Nerdio's usage page maps PowerShell parameter types to controls in the run dialog: `bool` and `switch` become checkboxes, numeric types number inputs, `char` and `string` text inputs and `string[]` a multi-select. Supported attributes are `DisplayName`, `Description`, `Parameter`, `Mandatory`, `HelpMessage`, `ParameterSetName` (currently only for Nerdio Manager built-in parameters) and `ValidateSet`, which turns a `string` into a single-select. Parameters can alternatively be defined in JSON with `DisplayName`, `Description`, `IsRequired`, `Type` and `OptionsSet`.

Under "Custom Windows Scripted Actions Options", Nerdio's usage page names Individual and Individual with restart as the only execution modes, no use in Windows Scripted Actions Groups and no support on Cloud PCs. A separate section says Windows scripts get a basic PowerShell syntax check when you save them. The Groups page, in contrast, offers default parameters for groups, and Nerdio does not say outright what "custom" covers, so test a parameterized script in a group before relying on it.

Here is one illustrative script that uses only attributes from Nerdio's list (confirm it in a test run before you rely on it):

```powershell
#description: Example, apply a setting on a test host
param(
  [ComponentModel.DisplayName('Environment')]
  [Parameter(Mandatory = $true, HelpMessage = "Environment to configure")]
  [ValidateSet("Test", "Production")]
  [string]$Environment,

  [switch]$DryRun,

  [Parameter(ParameterSetName = "NME_PARAMETER")]
  [string]$AzureVMName,

  [Parameter(ParameterSetName = "NME_PARAMETER")]
  [object]$SecureVars
)
$ErrorActionPreference = 'Stop'
Write-Output "Start: $AzureVMName ($Environment)"
if ($DryRun) {
  Write-Output "Dry run: would set the policy for $Environment"
} else {
  reg add HKLM\SOFTWARE\Policies\Contoso /v Environment /t REG_SZ /d $Environment /f
  if ($LASTEXITCODE -ne 0) { throw "reg add failed with exit code $LASTEXITCODE" }
}
# read a secret as $SecureVars.ApiToken, never print it
Write-Output "Done: $AzureVMName"
```

The last two parameters show a rule that is easy to miss. Once a script has a param block, Nerdio says the built-in variables it uses must be declared with the proper name and type ("string" for most, "object" for `$SecureVars`) and `ParameterSetName = "NME_PARAMETER"`. They are then hidden in the UI and passed automatically; without a param block, they are passed as before. Nerdio's only example, `$AzureRegionName`, omits `Mandatory`; the `$SecureVars` line follows that pattern, which is our reading.

For runbooks, inputs live in the `<# Variables:` block, one JSON entry per variable with a description, `IsRequired` (true or false) and an optional `DefaultValue`:

```powershell
<# Variables:
{
  "TargetTag": {
    "Description": "Only touch VMs that carry this tag value",
    "IsRequired": true,
    "DefaultValue": "pilot"
  }
}
#>
```

The `TargetTag` entry is an illustration, not a Nerdio sample. Nerdio's runbook variables page shows the block and the prompt but no code that reads a value; the Windows script in its ChatGPT guide declares `VNetName` and reads it with `Get-Variable -Name "VNetName" -ValueOnly`. Nerdio prompts for these variables when you start the runbook with **Run now** from the action menu; a Parameters section then shows each default and description. Edit the block under **Endpoints > Automation > Scripted Actions > Azure runbooks**, select the action, then **Edit**.

## 3. Keep secrets out of the script

Do not paste a password or token into the script text or into a parameter default. Nerdio describes secure variables as a way to pass sensitive information to a scripted action "without passing it via clear text", and stores the values in Azure Key Vault. To create one:

1. Open **System > Settings > Nerdio**.
2. In the Secure variables area, add a variable with a **Name** of 1 to 20 alphanumeric characters and a **Value**.
3. Decide whether **Allow usage within shell apps** applies.
4. Select **Pass variable to specified scripted actions only** and pick the actions in the drop-down. If you clear it, the variable goes to all scripted actions.
5. Select OK, then read the value in the script as `$SecureVars.Variable_Name`.

The chosen variables appear in the Secure Variables column of each selected action in the Azure runbooks window. Nerdio's release notes list granular RBAC for secure variables (Read Only, Manage and Show Secret) in 8.1.0, a Public Preview build of 21 July 2026. The GA builds 8.1.1 to 8.1.3 and 8.2.1 to 8.2.3 (current: 8.2.3, 13 November 2026) do not repeat the entry, so compare your installed version.

Do not print a secret: runbook output appears in the task details, and Windows script output lands in the VM logs. If you pass AD credentials in the run dialog, the script receives `$ADUsername` and `$ADPassword`; enable that only for scripts that need it. If you call the Custom Script Extension yourself, Learn says secrets belong in `protectedSettings`, because public settings are sent in clear text to the VM.

## 4. Make failures visible

For Azure runbooks, Nerdio's guidance has two parts. Use `Write-Output` for progress: it appears in the task details, as does `Write-Error` output, while `Write-Verbose` does not. And have commands that error exit the script, so the job reports Fail instead of Complete. For Windows scripts, Nerdio says `Write-Output` is saved to the VM logs only; open the task details and select Request Custom PowerShell Scripts logs to retrieve it.

Nerdio does not name a mechanism for exiting. We suggest `$ErrorActionPreference = 'Stop'`, as in the example above. In PowerShell it defaults to `Continue`, while `Stop` escalates non-terminating errors to script-terminating errors (Learn). That covers cmdlet errors, not native programs. Learn lists `$PSNativeCommandUseErrorActionPreference`, default `$false`, as the setting that makes a native command with a non-zero exit code issue an error. Nerdio's sample script calls `reg add`, so check `$LASTEXITCODE` after native commands and `throw`, as Learn's robocopy example does. Test this with one deliberately failing run.

Never restart the machine in the script. Nerdio states that the Custom Script extension fails if the script restarts the computer. Split the work, use **Individual with restart**, or use the restart option in the run dialog.

## 5. Test in layers

1. **Directly on an isolated development host.** Nerdio recommends running the script on a dedicated development session host or Azure VM before it goes through Nerdio Manager. This confirms that the PowerShell works and gives quicker results.
2. **Runbooks in an Automation account.** Learn says the Test pane runs the Draft version and that the actions it performs are completed: "you should only test runbooks on non-production resources". Nerdio's troubleshooting page says its Automation account runs a specialized runbook that copies the code from Nerdio Manager, so our recommendation is to paste the script into a separate test runbook and supply by hand the values Nerdio would fill in.
3. **Through Nerdio on one VM.** Use **Hosts > Run script** on a test host pool, or **Run script** on a desktop image. Nerdio lists scenarios to check for Windows scripts, among them hosts individually and in bulk, desktop image runs and host pool **Settings > Scripted Actions**.
4. **In bulk, with brakes.** Nerdio's bulk dialog offers **Process hosts in groups of** and **Number of failures before aborting** but gives no values. Our recommendation for the first live run: a small group size and a threshold of 1 or 2. Use **Exclude not running hosts** in scheduled runs so stopped machines are not started.

If a runbook job shows Complete although something looks wrong, Nerdio's troubleshooting page points to the associated Automation account: view the log whose timestamp matches the Nerdio Manager task log. For a task with status Error, open **Endpoints > Automation > Scripted Actions > Azure Runbooks**, find it in the Scripted Actions Tasks section and select **Details**.

## 6. Control what it can touch and who trusts it

A runbook runs as the Nerdio Manager service principal, and that principal still needs permissions on whatever the script changes. Our recommendation: before you attach a new script to a trigger, list the resources it changes and confirm the principal's permissions cover only those.

Nerdio's script signing is documented as **Public Preview**. A certificate with Digital Signature key usage and the code signing EKU (1.3.6.1.5.5.7.3.3) lets Nerdio sign scripts so they comply with your PowerShell execution policies. Check these requirements first:

- The `Artifacts:Mode` app service setting must be Local or Offline. Otherwise Nerdio ignores the signing settings and scripts are not signed.
- Nerdio's main service principal needs Key Vault permissions, including Secret Get, and Certificate Get and List for linking.
- The certificate must be installed on the VMs; Nerdio's scripted-action method imports it into Trusted Root and Trusted Publishers.
- Signing is enabled per host pool (**Properties > Certificates**) or per desktop image (**Manage certificates**).
- For Windows 365 scripts, **Enforce script signature check** requires a trusted publisher signature.

## 7. Keep the runtime healthy

Module errors such as "does not have an implementation" often point to an outdated Az module. Nerdio says to upgrade the module tied to the failing command, update dependencies such as Az.Accounts if needed (release 8.1.0 notes that Az.Accounts 5.3.2 or later broke existing runbooks and scripted actions, and that Nerdio Manager can now restrict module versions), use **Browse gallery** in the Automation account, and not use the **Update Az Modules** button, which it says does not update to the latest versions. With a hybrid worker, update modules on the worker VM instead. Nerdio Manager also has its own module management (**System > Settings > Nerdio**, Azure Runbooks Scripted Actions section, Module versions), and the 8.0 release notes list an "Update Azure Runbook Modules" setting, so check which method your version offers. After any module change, repeat the test chain: the test host and one test runbook.

## Pre-flight checklist

- Description line present; tags and a Variables block only if you use them (Nerdio documents the Variables block for runbook inputs).
- Inputs declared; built-ins declared if a param block exists.
- Secrets only through `$SecureVars`, limited to named actions.
- Errors exit the script (check `$LASTEXITCODE` after native commands), progress with `Write-Output`, no secret in output.
- No restart inside the script.
- Run on a development host, then through Nerdio on one VM, then in bulk with a failure threshold.

## Related

- [Nerdio scripted actions](/entity/nerdio-scripted-actions/)
- [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/)
- [Azure Key Vault](/entity/azure-key-vault/)
- [Azure Automation](/entity/azure-automation/)
- [PowerShell](/entity/powershell/)

## Sources

- [Nerdio Help: Windows Scripted Actions: Usage, Supported Features, and Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368713741-Windows-Scripted-Actions-Usage-Supported-Features-and-Considerations)
- [Nerdio Help: Scripted Actions: Azure runbooks variables integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124313271053-Scripted-Actions-Azure-runbooks-variables-integration)
- [Nerdio Help: Scripted Actions Global Secure Variables](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302368909)
- [Nerdio Help: Scripted actions for Azure Runbooks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302308109)
- [Nerdio Help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio Help: Considerations for Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124352596749-Considerations-for-Scripted-Actions)
- [Nerdio Help: Troubleshoot Scripts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124334376717)
- [Nerdio Help: Run Bulk Host Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124337068045-Run-Bulk-Host-Scripted-Actions)
- [Nerdio Help: Generate Scripted Actions with ChatGPT](https://nmehelp.getnerdio.com/hc/en-us/articles/26124343795597-Generate-Scripted-Actions-with-ChatGPT)
- [Nerdio Help: Overview of Scripts Signing](https://nmehelp.getnerdio.com/hc/en-us/articles/34054435685261-Overview-of-Scripts-Signing)
- [Nerdio Help: Script repositories integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385380877)
- [Nerdio Help: Scripted Actions for Windows 365](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302435469-Scripted-Actions-for-Windows-365)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677)
- [Learn: Test a runbook in Azure Automation](https://learn.microsoft.com/en-us/azure/automation/manage-runbooks)
- [Learn: Custom Script Extension for Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows)
- [Learn: about_Preference_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)
