---
title: "Exchange Online and Microsoft Graph Modules Fail Together in One Azure Automation Runbook"
summary: "Each module works alone, but connecting to Exchange Online and Microsoft Graph in the same runbook fails with module load errors. Learn why the versions clash and how to test a pinned runtime environment."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [azure-automation, exchange-online-powershell, microsoft-graph-powershell, managed-identity]
keypoints:
  - "The errors are module load failures, not permission errors. Granting more rights will not fix them."
  - "A confirmed 2024 community fix named the cause: both modules load different System.Text.Json versions into one process, and the module that loads first wins."
  - "A March 2026 thread worked around it with a new PowerShell 7.4 runtime environment and ExchangeOnlineManagement 3.5.0, but the asker had not yet tested the real script."
  - "Learn says ExchangeOnlineManagement 3.10.0 or later needs PowerShell 7.6, while its Automation runtime page lists 5.1 and 7.4. Pin the module and test in the Test pane before you publish."
faq:
  - q: "Why does Connect-MgGraph fail after Connect-ExchangeOnline in the same session?"
    a: "In a 2024 Tech Community thread (not about Azure Automation, on desktop Windows PowerShell 5.1), a community member explained, in the reply marked as the solution, that the Exchange Online and Microsoft Graph modules ship different versions of System.Text.Json.dll. PowerShell loads only one version per process, so the module that loads second can fail. The thread's fix was to use an older Exchange Online module version. Microsoft Learn does not describe this conflict, but its release notes for ExchangeOnlineManagement 3.6.0 mention a fix for a compatibility issue with the Microsoft.Graph module."
  - q: "Can I run the latest ExchangeOnlineManagement module in Azure Automation?"
    a: "Learn says module versions 3.10.0 or later require PowerShell 7.6.0 or later, and that Windows PowerShell 5.1 is not affected. Learn's runtime environment page lists PowerShell 5.1 and 7.4 as the choices. From those two statements it follows that a 7.4 runtime cannot load 3.10.0 or later, but check your own account, because available runtimes change."
  - q: "Do I need Exchange.ManageAsApp and an Exchange role for this?"
    a: "For the managed identity to work at all, yes. Learn requires the Exchange.ManageAsApp API permission and an Entra role such as Exchange Administrator for the identity. Those are authorization steps. A module that cannot load fails before authorization, so they do not fix the errors in this article."
  - q: "Is there a way to avoid the conflict completely?"
    a: "Running the two connections in separate jobs avoids loading both modules into one process. This follows from the cause described in the thread, but the threads did not test it. Splitting the work into two runbooks is a design change, so test the hand-over between them."
---

A test runbook connects to Exchange Online with its managed identity and reads a mailbox. It works. A second test runbook connects to Microsoft Graph with the same identity and reads a user. It works too. Put both in one runbook and it fails.

That is the March 2026 Microsoft Q&A thread this article starts from. It matches an older Tech Community thread from 2024 that did reach a fix confirmed by its asker. This article explains the cause, shows what Microsoft Learn says about versions and runtimes, and gives a test plan. It is a troubleshooting guide, not an official Microsoft procedure.

## Symptoms

The March 2026 asker used a system-assigned managed identity, `Connect-ExchangeOnline -ManagedIdentity -Organization <tenant>.onmicrosoft.com` followed by `Connect-MgGraph -Identity`. ExchangeOnlineManagement version 3.9.2 and several Microsoft.Graph modules were imported. The errors were:

- **Runtime 5.1:** `Connect-MgGraph` was found in the module `Microsoft.Graph.Authentication`, but the module could not be loaded.
- **Runtime 7.2:** `Unable to find type [Microsoft.Exchange.Management.RestApiClient.ExchangeEnvironment]`.

The 2024 thread, on a desktop with Windows PowerShell 5.1, showed `IDX12729: Unable to decode the header ... as Base64Url encoded string` and a "method not found" error that named `System.Text.Json.Utf8JsonReader`. Another poster there saw `Connect-MgGraph: Invalid JWT access token` when `Connect-IPPSSession` was used in the same session.

All of these are load or runtime errors. They are not `Authorization_RequestDenied` or access-denied messages. That difference matters, because an AI-generated answer in the March thread told the asker to grant `Exchange.ManageAsApp` and the Exchange Administrator role. Those are real prerequisites, but they address authorization and cannot fix a module that does not load.

## Why it happens

In the 2024 thread, a reply from a community member (a Silver Contributor, not a Microsoft employee) was marked as the solution. It said both modules load their own copy of `System.Text.Json.dll` into the same PowerShell process. Exchange Online 3.5.1 shipped version 8.0.x and Microsoft.Graph.Authentication used a 6.0.x version. PowerShell keeps only one version of an assembly per process, so whichever module loads first wins and the second one can fail.

The asker in that thread removed the Graph modules before connecting, updated both modules and cleared the MSAL cache. None of that helped. After going back to ExchangeOnlineManagement 3.4.0, the asker wrote that it worked. Other posters reported the same fix. One more poster reported an improvement with 3.6.0, but certificate-based `Connect-IPPSSession` still failed for them. One poster reported that setting `-LogLevel` to `Default` instead of `All` fixed it in their test. Learn does not mention that setting, so treat it as a community report.

A volunteer moderator (an MVP) in the 2026 thread gave a similar explanation. The modules depend on additional binaries that are not aligned between teams, so you may need to mix and match module versions and PowerShell hosts.

Learn does not describe the System.Text.Json conflict. It does list, in the ExchangeOnlineManagement 3.6.0 release notes, an item "Added fix for compatibility issue with the Microsoft.Graph module". It gives no detail.

## Step 1: Confirm which kind of error you have

1. Run each connection alone in a test runbook. If both work alone, you have a clash, not a permission problem.
2. Copy the first error line. Anything about loading a module, a type or a method is a clash. `Forbidden`, `Access denied` or `Authorization_RequestDenied` is a permission problem.
3. For permission problems, follow Learn's managed identity page for Exchange. It needs the `Exchange.ManageAsApp` API permission assigned to the identity and an Entra role such as Exchange Administrator. Learn's note says Security Administrator does not have the needed permissions for those tasks.

## Step 2: See which assembly version each module wants

The 2024 thread suggested checking the loaded assembly version in a fresh session, one module at a time. The thread summary does not show the exact command. The command below is a general .NET check, not from Learn or the thread, so test it on a spare machine. Import one module, then run:

```powershell
(Get-Item -Path "$([System.Text.Json.Utf8JsonReader].Assembly.Location)").VersionInfo
```

Repeat in a new session with the other module. If the versions differ, you have the clash from that thread. Use the same module versions as in the runbook.

## Step 3: Pin versions in a separate runtime environment

The March 2026 asker solved the test case by building a new runtime environment. The thread does not give the clicks. Learn's runtime environment page does:

1. In the Azure portal, open the Automation account. On **Overview**, select **Try Runtime Environment experience** if you are not already in it.
2. Under **Process Automation**, select **Runtime Environments**, then **Create**.
3. On **Basics**, enter a name, choose **PowerShell** as the language and **7.4** as the runtime version. Learn says the language and version cannot be changed later.
4. On **Packages**, the Az package is added by default. Use **Add from gallery** to add ExchangeOnlineManagement at a pinned version and the Microsoft.Graph modules you call. The thread used 3.5.0 for Exchange Online.
5. Select **Create**.
6. Link a copy of your runbook. Under **Runbooks**, select it, then **Update Runtime Environment**.
7. Open the runbook, **Edit in Portal**, choose the new environment, then **Test pane** and **Start**. Publish only if the test passes.

Learn notes that importing a package can take several minutes, that you can add up to 10 packages at a time, and that the Modules blade is replaced by runtime environments in the new experience.

Which version to pin depends on the runtime:

- Learn says ExchangeOnlineManagement 3.10.0 and later need PowerShell 7.6.0 or later because of .NET 10 assembly dependencies. Its runtime page names 5.1 and 7.4 as choices. A 7.4 runtime therefore needs a version older than 3.10.0. This is a conclusion drawn from two Learn pages, not a statement on either, so confirm what your account offers.
- Learn lists problems for 3.7.0 to 3.9.2 on Ubuntu 20.04 and 18.04, and names 3.9.2 as the latest version for some older platforms. Those notes concern desktop platforms, not Automation.
- The March thread's own test used 3.5.0 on 7.4. The asker added a comment that the real script was not yet tested, so no confirmed answer exists for 3.9.x on 7.4.
- Runtime 5.1 did not avoid the clash in the March thread, which failed on 5.1 with 3.9.2.

Test at least two combinations, such as your pinned Exchange version with the newest Graph modules, and with an older Graph version. Learn warns that preview versions of PackageManagement or PowerShellGet might cause connection issues, so use the released ones.

## Step 4: Consider splitting the work

If no combination works, avoid loading both modules in one process. For example, let one runbook do the Exchange part and another do the Graph part, and start the second from the first. This follows from the cause given in the 2024 thread. Neither thread tested it, so build a small proof first.

Also check whether Graph can replace the Exchange cmdlets in your script. Learn's Exchange page makes this point for four Microsoft 365 Group cmdlets, such as `New-UnifiedGroup`, which it says cannot be used with managed identity and where it recommends Graph. For other tasks, do not assume Graph has an equivalent.

## Verify

1. In the Test pane, the job output shows both connections and one result from each service.
2. Run the published runbook through a schedule or a manual start, and check the job streams for warnings about assembly loading.
3. Write down the exact module versions and the runtime. A later gallery update can break a working setup. Pinning protects you only while you do not change the versions.

## Limits

- The 2024 thread is older than the usual window and used desktop Windows PowerShell. It is included because it names the cause and has a confirmed outcome.
- The 2026 thread's solution is a first test, not a verified production fix.
- Learn's Exchange managed identity page still mentions runtime 5.1 and 7.1 (Preview) when you add the module, which differs from the runtime environment page. Use the runtime environment page for current runtimes.
- Learn does not document the clash itself. The cause comes from a community expert.

## Related

- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)

## Sources

- [Microsoft Learn: Exchange Online PowerShell module (versions and requirements)](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2)
- [Microsoft Learn: Use Azure managed identities to connect to Exchange Online PowerShell](https://learn.microsoft.com/en-us/powershell/exchange/connect-exo-powershell-managed-identity)
- [Microsoft Learn: Manage runtime environments in Azure Automation](https://learn.microsoft.com/en-us/azure/automation/manage-runtime-environment)
- [Microsoft Learn: Microsoft Graph PowerShell authentication commands](https://learn.microsoft.com/en-us/powershell/microsoftgraph/authentication-commands?view=graph-powershell-1.0)
- [Microsoft Q&A: Unable to connect to Exchange Online and Graph in same runbook (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5825740/unable-to-connect-to-exchange-online-and-graph-in)
- [Microsoft Community Hub: Exchange online and MGGraph are interfering (2024)](https://techcommunity.microsoft.com/discussions/windowspowershell/exchange-online-and-mggraph-are-interfering/4200893)
