---
title: "Fix Entra Cloud Sync Agent Timeouts: A Network and Certificate Checklist"
summary: "The Entra Cloud Sync agent installs fine but never syncs and the portal shows HybridIdentityServiceAgentTimeout? Work through DNS, firewall rules, TLS inspection and certificate trust in this order."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [entra-cloud-sync, entra-connect]
keypoints:
  - "In the reported cases, HybridIdentityServiceAgentTimeout meant a connection problem between agent and cloud service, not a broken agent. Learn ties agent timeouts to failed connections."
  - "Check DNS first, then outbound TCP 443 to *.msappproxy.net and *.servicebus.windows.net, then port 80 for certificate revocation lists."
  - "Firewall rules must follow the domain names, not fixed IP addresses, and TLS inspection should be bypassed for these flows."
  - "Collect the agent trace and an AADCloudSyncTools log bundle before you open a support case."
faq:
  - q: "What does HybridIdentityServiceAgentTimeout mean in Entra Cloud Sync?"
    a: "It is a status that the Microsoft Entra admin center showed in two 2026 community threads. Microsoft Learn does not describe this status by name. Its troubleshooting page says that an agent timeout is usually caused by the agent being unable to connect to the hybrid identity service. In the community reports the suspected cause was outbound connectivity: name resolution, blocked or inspected traffic to the Azure Service Bus and Application Proxy endpoints, or a certificate chain that could not be validated. Neither thread reported a confirmed root cause."
  - q: "Which ports and URLs does the Entra Cloud Sync agent need?"
    a: "According to Microsoft Learn, the agent needs outbound TCP 443 for all communication with the service and port 80 for certificate revocation list downloads. Public cloud destinations include *.msappproxy.net and *.servicebus.windows.net, plus several Microsoft sign-in and certificate endpoints. Always compare with the current Learn page, because the list can change."
  - q: "Does the Entra Cloud Sync agent work behind TLS inspection?"
    a: "Learn's cloud sync troubleshooting page says to avoid all forms of inline inspection and termination on outbound TLS between Microsoft Entra private network connectors and the Application Proxy cloud services. A community answer applied this to the cloud sync agent and advised excluding the Application Proxy and Service Bus destinations from inspection. If your firewall inspects TLS, test with these destinations excluded."
  - q: "Can I pin the firewall rule to IP addresses?"
    a: "It is not a good idea. The endpoints sit behind wildcard domain names and can change. Use rules that follow the domain names, and test name resolution and TCP 443 from the agent server."
---

The agent installs without an error. The services are running. The server has internet access. Still, the first sync never starts, and the Microsoft Entra admin center shows `HybridIdentityServiceAgentTimeout`.

This pattern appeared in two separate Microsoft community threads in 2026. In both, the agent itself looked fine, and the suspected problem sat between the server and the cloud service. This article turns the shared lessons into a checklist you can follow in order. It is a troubleshooting guide, not an official Microsoft procedure, so confirm each requirement against the current [Microsoft Learn prerequisites for cloud sync](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/how-to-prerequisites).

## What the symptoms look like

The reports showed a mix of these signs:

- In the Entra admin center, the agent status shows `HybridIdentityServiceAgentTimeout`.
- The agent trace folder, `C:\ProgramData\Microsoft\Azure AD Connect Provisioning Agent\Trace`, contains lines such as `Web socket failed to connect`.
- The event log shows that the agent re-registration failed because the trust renewal request to an `msappproxy.net` address timed out.
- The agent updater cannot resolve a name such as `autoupdate.msappproxy.net`.
- The CAPI2 log reports a certificate chain that ends in a root certificate that is not trusted.

One trace line, `Unable to initialize performance counters`, also appeared. In the accepted answer of one thread, this was treated as a side issue. The connection errors were the real clue.

## Step 1: Confirm the agent and services

First rule out the simple cases.

1. In the Microsoft Entra admin center, open **Entra ID**, then **Entra Connect**, then **Cloud sync**, and check that the agent is listed.
2. On the server, open `services.msc` and confirm that **Microsoft Entra Connect Agent Updater** and **Microsoft Entra Provisioning Agent** are running.
3. Check the basics from Microsoft's requirements: a domain-joined server (Windows Server Core is not supported), .NET Framework 4.7.1 or later, and a PowerShell execution policy of `Undefined` or `RemoteSigned`.

If all of this is fine, move on. The agent is not the problem.

## Step 2: Test name resolution

The accepted answer in the first thread points to DNS first, and the reply in the second thread also asks for name resolution tests. Run these from the agent server:

```
nslookup autoupdate.msappproxy.net
nslookup login.microsoftonline.com
nslookup <your-servicebus-namespace>.servicebus.windows.net
```

If `msappproxy.net` names do not resolve, nothing else will work. One poster used domain controllers as DNS servers that had no forwarders and relied on root hints. That setup is a candidate for trouble, so check that your DNS path can resolve public names reliably.

## Step 3: Test TCP 443 to the right destinations

Do not stop at `login.microsoftonline.com`. In one thread, sign-in endpoints and `autoupdate.msappproxy.net` answered on port 443, but `servicebus.windows.net` did not. The agent needs both families of destinations.

From Microsoft Learn, the outbound requirements for the public cloud include:

| Destination | Why |
|---|---|
| `*.msappproxy.net`, `*.servicebus.windows.net` | Communication with the cloud service |
| `*.microsoftonline.com`, `*.microsoft.com`, `*.msappproxy.com`, `*.windowsazure.com` | Communication with the cloud service |
| `login.windows.net`, `login.live.com`, `aadcdn.msauth.net`, `aadcdn.msftauth.net` | Registration |
| `mscrl.microsoft.com:80`, `crl.microsoft.com:80`, `ocsp.msocsp.com:80`, `www.microsoft.com:80` | Certificate checks |

Test the ports with PowerShell:

```powershell
Test-NetConnection autoupdate.msappproxy.net -Port 443
Test-NetConnection <your-servicebus-namespace>.servicebus.windows.net -Port 443
Test-NetConnection crl.microsoft.com -Port 80
```

The service does not run as you. Microsoft notes that if your firewall enforces rules by originating user, you must open the ports for Windows services that run as a network service. A test that works in your interactive admin session can still fail for the service. The reply in the second thread makes the same point: test from the service account context, not only from an admin session.

## Step 4: Write firewall rules by name, not by IP address

Both answers warn against IP-based rules. The endpoints sit behind wildcard names, and the addresses can change.

- Allow TCP 443 to everything that the two wildcard domains resolve to, including CNAME chains.
- Allow port 80 for the certificate revocation list and OCSP hosts.
- A firewall with "no filtering" can still break long-lived WebSocket connections. Check the deny and TLS logs, not just the rule list.

## Step 5: Take these flows out of TLS inspection

Learn's cloud sync troubleshooting page says to avoid all forms of inline inspection and termination on outbound TLS between Microsoft Entra private network connectors and the Application Proxy cloud services. The agent talks to `msappproxy.net` endpoints, and a reply in the September 2026 thread advised excluding `*.msappproxy.net` and `*.servicebus.windows.net` from TLS inspection, certificate substitution, authentication and application proxying. In one thread, the firewall change was planned with inspection bypass for both domains. The poster still reported a failure afterwards, so also continue with the next steps instead of assuming the firewall is the only cause.

## Step 6: Check the certificate chain

A certificate error such as "terminated in a root certificate which is not trusted" can break TLS. The result looks like a web socket failure or a timeout during `RenewTrustCertificate`. Check these points:

1. Open the CAPI2 operational log and look for chain-building errors around the time of the failure.
2. Make sure the server can reach the Windows Update certificate trust list host `ctldl.windowsupdate.com`, so that root certificates can update. This tip comes from a community answer, not from the Learn prerequisites page.
3. Make sure port 80 is open to the CRL and OCSP hosts above.

## Step 7: Check TLS settings and the proxy

Microsoft requires TLS 1.2 on the agent server before installation. On older servers, TLS 1.2 and strong cryptography for .NET must be enabled. The Learn page shows the registry settings, including `SchUseStrongCrypto` for the .NET Framework. Microsoft warns that changing TLS settings affects the entire forest, so plan the change.

If you must use an outbound proxy, Learn describes adding a `defaultProxy` section to `AADConnectProvisioningAgent.exe.config`. Check that the proxy supports at least HTTP 1.1 with chunked encoding. Both posters reported that no proxy was in use. Still confirm that no WinHTTP proxy is set.

## Step 8: Collect evidence

If the checks pass and the agent still times out, collect data before you wait or reinstall:

1. Install the `AADCloudSyncTools` module.
2. Reproduce the failure, then run `Export-AADCloudSyncToolsLogs`. The default capture runs for three minutes.
3. Copy the files from the trace folder.
4. Note the exact UTC time of the timeout.
5. Capture the deny and TLS logs from your firewall for the same time.

Give this package to Microsoft Support. A support case with a UTC timestamp and firewall logs is much easier to work on.

## What happened in the two threads

- In the first thread, an administrator tried proxy settings, firewall log review, TLS changes, a rebuilt certificate store and a repair command. An answer then pointed to DNS and the certificate chain. The poster wrote a script with the suggested checks. All tests passed and the sync then completed. The poster did not find one clear cause and suspected something changed on the cloud side.
- In the second thread, `servicebus.windows.net` failed on TCP 443 while other endpoints worked. The firewall change was prepared, but no final fix was reported.

So treat the checklist as a way to find a network problem, not as a guaranteed cure. If everything passes and the status does not recover after a while, open a support case.

## Related

- [Microsoft Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [Microsoft Learn: Cloud sync prerequisites](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/how-to-prerequisites)
- [Microsoft Learn: Cloud sync troubleshooting](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/how-to-troubleshoot)
- [Microsoft Q&A: Entra Cloud Sync issue (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5854310/entra-cloud-sync-issue)
- [Microsoft Community Hub: Weird issue with Entra Connect Cloud Sync HybridIdentityServiceAgentTimeout (September 2026)](https://techcommunity.microsoft.com/discussions/microsoft-entra/weird-issue-with-entra-connect--cloud-sync-hybrididentityserviceagenttimeout/4552267)
