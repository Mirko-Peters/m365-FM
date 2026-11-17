---
title: "Troubleshooting Azure Virtual Desktop connection failures: a checklist"
summary: "When a user cannot connect to Azure Virtual Desktop, first find the stage that fails: sign-in, feed, launch or transport. This checklist follows those stages from the client and network side, with the Learn-documented fixes for each and the diagnostics queries that show where a connection stopped."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, avd-agent]
keypoints:
  - "Sort the failure by stage before you change anything: no sign-in, signed in but no resources, resource visible but launch fails, or connected but unstable. Each stage has a different owner and a different fix."
  - "An empty feed is usually an assignment problem: the user is not assigned to an application group, the application group is not in a workspace, or the user comes from a distribution group. Learn says distribution groups are not supported."
  - "On Microsoft Entra joined session hosts, launch errors about credentials or 'account is configured to prevent you from using this device' point to the Virtual Machine User Login role or to a Conditional Access policy. With AD DS-joined hosts, look elsewhere first."
  - "TCP-based reverse connect always starts first and UDP (RDP Shortpath) is tried afterwards. Blocked UDP or a proxy as the only path leaves users on TCP, which is slower but still connects."
  - "Connections that never reach the Azure Virtual Desktop service do not appear in the diagnostics tables. If diagnostics were enabled before the attempt and WVDConnections shows nothing for a user who got as far as starting a resource, look at the client network, the proxy and the sign-in."
faq:
  - q: "Where do I see whether a failed connection reached Azure Virtual Desktop at all?"
    a: "In Log Analytics. Learn says connections that do not reach Azure Virtual Desktop do not show up in diagnostics results, because the diagnostics role service is part of the service. Query WVDConnections for the user's UPN. If there is a Started row for the attempt, the request reached the service. If there is none, check first that the diagnostic setting was enabled before the attempt, because data appears only after enabling and can take a few hours. If it was, and the user got as far as starting a resource, look at the client network, the proxy and the sign-in."
  - q: "What do the states Started, Connected and Completed mean?"
    a: "Learn describes them as the intermediate states for connection activities: Started when a user selects an app or desktop in the client, Connected when the user successfully connects to the VM that hosts it, and Completed when the user or the server disconnects the session. A Started row without a Connected row for the same CorrelationId suggests, by our reading of those states, that the connection did not reach the host."
  - q: "Does blocking UDP stop users from connecting?"
    a: "No. Learn says RDP starts with a TCP-based reverse connect transport and then tries UDP. If a firewall blocks UDP, RDP Shortpath fails and the connection falls back to TCP. Users get lower responsiveness, not a failed connection. A proxy configured as the only path also forces RDP over TCP."
---

A connection to Azure Virtual Desktop fails at one of four stages: sign-in, feed, launch or transport. Find the stage first, then fix the layer that owns it. This checklist covers the client, identity and network side of the problem. For a host that is running but shows Unavailable, use the article "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist". Problems inside the agent and side-by-side stack belong in a separate article about the [Azure Virtual Desktop agent](/entity/avd-agent/).

The Learn page on the Remote Desktop client for Windows is archived under "previous versions" and the successor client is [Windows App](/entity/windows-app/), so treat its client-specific steps as dated.

## Start with scope and status

Learn's troubleshooting overview says to check the Azure status page and Azure Service Health before anything else. Then answer three scoping questions (our own structure, not a Learn list):

1. One user, a group, or everyone?
2. One client (Windows App, web, a specific device) or all clients?
3. One network (home, office, VPN) or all networks?

Windows App's basic troubleshooting page adds the cheap tests: confirm internet access, update to the latest Windows App, and try Windows App in a web browser. Learn lists the browser test as one basic step and draws no conclusion from it. Our reading: if the web client works and the installed client does not, that points to the installed client or the device (network, proxy or TLS settings included), not to the account. For Azure Virtual Desktop it also points to the Azure Virtual Desktop Experience Estimator to check the round trip time from the user's location to the service. For Windows 365 and Dev Box it names the **Inspect connection** and **Troubleshoot & repair** actions, which this checklist does not cover.

## Where does the failure sit?

| Stage | What the user sees | First place to look |
|---|---|---|
| Sign-in | Error from AD FS or Entra ID, blocked by Conditional Access | Entra sign-in logs, Conditional Access, federation settings |
| Feed | Signed in, no icons, or "administrator has not yet configured any resources" | Application group assignment, workspace, group type |
| Launch | Credentials rejected, "account is configured to prevent you from using this device", "administrator may have ended your session" | VM sign-in role and MFA policy (Entra joined hosts), Remote Desktop Services policy |
| Transport | Connects slowly, drops, poor graphics | Proxy, UDP and Shortpath, client network |

## Stage 1: sign-in

Learn names two documented causes in this stage.

**Conditional Access.** The service connection page describes an error where the user is subject to a Conditional Access policy that blocks access to a Microsoft Entra resource, either at sign-in to Windows App or when connecting to a resource. It gives two reasons:

- The user signs in to Windows App in a web browser but lacks access to both the Azure Virtual Desktop and the Windows 365 apps through Conditional Access. Learn notes that Windows App authenticates against both apps even if the user has no Cloud PC.
- The user signs in to a resource with Microsoft Entra-based [single sign-on](/entity/avd-single-sign-on/) but lacks access to the Windows Cloud Login app.

Check the user's sign-in identity in the Entra sign-in logs, then follow Learn's page on enforcing multifactor authentication for Azure Virtual Desktop with [Conditional Access](/entity/conditional-access/).

**AD FS.** For federated domains, Windows App sign-in can fail with the AD FS event `MSIS7102: Requested Authentication Method is not supported on the STS`. Learn's cause is that Windows App sends `prompt=login`, and if the federated domain's `PromptLoginBehavior` is unset, Entra ID can turn that into a password authentication request that AD FS does not support. The documented resolution for supported AD FS versions is `PromptLoginBehavior = nativeSupport`.

## Stage 2: signed in, but no resources

Learn has a section for a user who can start the client and authenticate but sees nothing. Work through it in this order:

1. Confirm the user is assigned to application groups. Learn uses `Get-AzRoleAssignment -SignInName <userupn>`.
2. Confirm the user signs in with the right account. In the client, sign out of any other account first. The archived client page adds that, with the web client, you can use an InPrivate browser window to try a different account.
3. Check the application group is associated with a workspace.
4. If the user gets access through a group, check that it is a Microsoft Entra security group. Learn says Azure Virtual Desktop does not support distribution groups.
5. If the subscription was moved to another Microsoft Entra tenant, the service loses the assignments, because they are still tied to the old tenant. Reassign the users to their application groups. If a CSP created the subscription and transferred it, re-register the resource provider: in the Azure portal, open **Subscription**, select your subscription, select **Resource provider**, select **Microsoft.DesktopVirtualization** and select **Re-register**.

The Windows App message "It appears that your system administrator has not yet configured any resources for ..." means exactly that, according to Learn: nothing is configured for this user. It is an administrator task.

## Stage 3: the resource starts but the sign-in to the VM fails

These messages come from the Remote Desktop client page and appear after the user selects a desktop or app. The first two relate to Microsoft Entra joined session hosts: Learn's page on those hosts says users need the **Virtual Machine User Login** role in host pools without a session host configuration, and that the extra role assignment is not required for host pools that use one. If your hosts are AD DS-joined, skip the role and MFA checks and start with the Remote Desktop Services policy or the client-device causes below.

- **"Your account is configured to prevent you from using this device."** Learn says to make sure the user has the **Virtual Machine User Login** role on the VMs.
- **"The user name or password is incorrect"** when the credentials are right. Check two things: the Virtual Machine User Login role on the VM or resource group for each user, and whether your Conditional Access policy excludes MFA requirements for the **Azure Windows VM sign-in** cloud application. Learn says VM sign-ins do not support per-user enabled or enforced Microsoft Entra MFA. If sign-in logs are in Log Analytics, Learn shows a query on `AADNonInteractiveUserSignInLogs` filtered by `AppId == "372140e0-b3b7-4226-8ef9-d57986796201"` that lists the MFA result and the Conditional Access policies that applied.
- **"Your administrator may have ended your session."** Learn links this to the policy **Allow users to connect remotely using Remote Desktop Services** being disabled. Enable it under **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Connections**, in Group Policy or in the Intune settings catalog.
- **Authentication problems on the client device.** Learn lists an N edition of Windows without the Media Feature Pack, and a device where TLS 1.2 is not enabled. For the second case it gives registry values under `SCHANNEL\Protocols\TLS 1.2\Client` and `Server` (`Enabled` = 1, `DisabledByDefault` = 0) and `SystemDefaultTlsVersions` and `SchUseStrongCrypto` = 1 under the .NET Framework key.

For Microsoft Entra joined hosts, Learn points to a separate troubleshooting page for connections to Entra joined VMs, which this article does not repeat. Learn also says that if the client PC is not Entra joined, hybrid joined or registered to the same tenant, the host pool needs the custom RDP property `targetisaadjoined:i:1`, which limits sign-in to user name and password; the web, Android, macOS and iOS clients need it too.

## Stage 4: the transport

Every connection starts as a TCP-based reverse connect transport through the Azure Virtual Desktop gateway. The client and host then try [RDP Shortpath](/entity/rdp-shortpath/), a UDP transport. If UDP works, the TCP path is dropped. If not, TCP stays. So blocked UDP rarely causes a failed connection, but it explains poor responsiveness.

Check these in order:

1. **Client endpoints.** Learn requires end-user devices to reach, among others, `*.wvd.microsoft.com`, `*.service.windows.cloud.microsoft`, `*.windows.cloud.microsoft`, `*.windows.static.microsoft`, `login.microsoftonline.com`, `graph.microsoft.com`, `windows.cloud.microsoft` and `windows365.microsoft.com` on TCP 443. It says blocking them is not supported.
2. **Proxy.** Learn recommends bypassing proxies for Azure Virtual Desktop traffic. It warns that most proxies are not built for long-running WebSocket connections, that SSL inspection can make the agent stop working, and that components on the session host do not support proxies that require authentication, so the connection fails. A proxy as the only path forces RDP over TCP. Windows App on Windows and the web client support proxies; the Android client does not. If a proxy is involved, Learn's support advice is to configure a bypass and reproduce the issue.
3. **UDP for public networks.** Allow outbound UDP 3478 to `51.5.0.0/16` for the TURN relay. For direct STUN connections, the default range is UDP 49152 to 65535. Learn says a firewall that blocks UDP makes Shortpath fail and the connection fall back to TCP, and that the TURN relay is chosen by client location, so a client far from a relay region may fall back to TCP.
4. **Managed networks.** For ExpressRoute or VPN, the session host needs a UDP listener, port 3390 by default.
5. **Network design.** Learn's recommendations include avoiding force tunneling, double NAT or carrier-grade NAT, cloud packet inspection and TCP-based VPNs.

## Read the diagnostics

With the diagnostic settings sent to Log Analytics (host pool, workspace and application group each need their own setting), Learn's queries answer where a connection stopped:

```kusto
WVDConnections
| where UserName == "userupn"
| take 100
| sort by TimeGenerated asc, CorrelationId
```

```kusto
WVDErrors
| where UserName == "userupn"
| take 100
```

A connection row moves through Started, Connected and Completed. A Started row with no Connected row for the same `CorrelationId` suggests the user never reached the VM (our reading of the documented states, not a Learn statement; the user may also have cancelled). Check `WVDErrors` and `WVDCheckpoints` for the same `CorrelationId`. In `WVDErrors`, `ServiceError` equal to `false` marks an issue an administrator can fix, and `true` means escalate to Microsoft with the CorrelationId. Diagnostics start only after you enable the setting and can take a few hours to appear. Learn also says that client information can be missing from `WVDConnections` and `WVDCheckpoints` even when the connection completed.

For the client itself, the Remote Desktop client page gives the log folder `%temp%\DiagOutputDir\RdClientAutoTrace` (ETL files, convertible with `tracerpt`) and a reset with `msrdcw.exe /reset`, which restores the client's default settings and unsubscribes the user from all workspaces. For Windows App, Learn suggests repairing the app in Windows or reinstalling it on other platforms. [Azure Virtual Desktop Insights](/entity/avd-insights/) is the dashboard that Learn's troubleshooting overview names for finding issues quickly.

## Escalation order

1. Status page and Service Health.
2. Scope: user, client, network.
3. Stage 1 to 4 above, in order.
4. Diagnostics: WVDConnections and WVDErrors with the CorrelationId.
5. If the connection reaches the VM but the host is Unavailable or the agent fails, move to the session host and agent articles.
6. Open an Azure support case with the CorrelationId (the identifier Learn names for escalation). Our suggestion: add the time of the attempt in UTC.

## Sources

- [Microsoft Learn: Troubleshoot Azure Virtual Desktop service connection](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-service-connection)
- [Microsoft Learn: Azure Virtual Desktop troubleshooting overview](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-overview)
- [Microsoft Learn: Troubleshoot the Remote Desktop client for Windows (archived)](https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/troubleshoot-client-windows)
- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Basic troubleshooting for Windows App](https://learn.microsoft.com/en-us/windows-app/troubleshoot-basic)
- [Microsoft Learn: Azure Virtual Desktop diagnostics log analytics](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: RDP Shortpath](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-shortpath)
- [Microsoft Learn: Proxy server guidelines for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/proxy-server-support)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
