---
title: "Pass-Through Authentication Not Working in Entra Connect: Agent and Sign-In Troubleshooting"
summary: "Troubleshoot Microsoft Entra pass-through authentication: check feature and agent status, map AADSTS8000x and sign-in error codes to fixes, run the on-premises logon troubleshooter, and collect agent logs, following Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [entra-connect, entra-id]
keypoints:
  - "First check that the feature shows Enabled and every Authentication Agent shows Active, on the Microsoft Entra Connect page in the Microsoft Entra admin center."
  - "Learn warns not to disable the feature or uninstall agents without a cloud-only Hybrid Identity Administrator account to fall back on."
  - "Invalid username or password errors can come from an on-premises UPN that differs from the cloud UPN. Invoke-PassthroughAuthOnPremLogonTroubleshooter tests the agent."
  - "Sign-in error codes 80001 to 80014 map to causes such as no agent, Active Directory unreachable, timeout, or decryption problems."
  - "Agent logs sit in the Event Viewer under AzureAdConnect, AuthenticationAgent and in a Trace folder under ProgramData."
faq:
  - q: "How do I check whether pass-through authentication is healthy?"
    a: "Per Microsoft Learn, make sure the feature is still Enabled on your tenant and that each Authentication Agent shows Active, not Inactive. You find both on the Microsoft Entra Connect page of the Microsoft Entra admin center."
  - q: "What do AADSTS80001 and AADSTS80002 mean?"
    a: "Learn lists AADSTS80001 as unable to connect to Active Directory, where agent servers must be in the same AD forest as the users and able to connect to Active Directory. AADSTS80002 is a timeout connecting to Active Directory, so check that Active Directory is available and responding to the agents."
  - q: "Users get an invalid username or password error. What should I test?"
    a: "Learn says this can happen when the on-premises UPN differs from the cloud UPN. Create a test account, import the PassthroughAuthPSModule on the agent machine, run Invoke-PassthroughAuthOnPremLogonTroubleshooter and sign in with the test credentials. If you get the same error, the agent works and the on-premises UPN may be non-routable."
  - q: "Where do I find the agent logs?"
    a: "Learn names the Microsoft Entra Connect logs at ProgramData AADConnect trace logs for installation errors, the Event Viewer path Application and Service Logs, Microsoft, AzureAdConnect, AuthenticationAgent, Admin for agent errors, and detailed trace logs under ProgramData Microsoft Azure AD Connect Authentication Agent Trace for sign-in failures."
  - q: "Does pass-through authentication load balance requests across agents?"
    a: "No. Learn states that it provides high availability using multiple Authentication Agents and not load balancing, so agents may receive unequal numbers of requests, and a specific agent might receive no traffic at all."
---

When pass-through authentication (PTA) stops working, start with the status of the feature and of each Authentication Agent. Then map the error code the user or the sign-in log shows to the causes that Microsoft Learn lists: no agent, Active Directory unreachable, a UPN mismatch, a timeout or a decryption problem. Collect the agent logs if the codes do not explain it.

## A warning before you change anything

Learn says that if users cannot sign in with pass-through authentication, you should not disable the feature or uninstall Authentication Agents without a cloud-only Hybrid Identity Administrator account to fall back on. Also, before you uninstall Microsoft Entra Connect on a tenant with PTA enabled, make sure the setup is highly available. Learn quotes the warning that users will not be able to sign in unless other Authentication Agents run on other servers.

## Step 1: Check feature and agent status

On the **Microsoft Entra Connect** page of the Microsoft Entra admin center, confirm that pass-through authentication is **Enabled** and that every Authentication Agent shows **Active**, not **Inactive**.

## Step 2: Read the error code

Users may see one of these errors on the sign-in screen:

| Error | Meaning | Learn's resolution |
| --- | --- | --- |
| AADSTS80001 | Unable to connect to Active Directory | Agent servers must be members of the same AD forest as the users and able to connect to Active Directory |
| AADSTS80002 | Timeout connecting to Active Directory | Check that Active Directory is available and responding to the agents |
| AADSTS80004 | The username passed to the agent was not valid | Make sure the user signs in with the right username |
| AADSTS80005 | Validation hit an unpredictable WebException | Transient. Retry, and contact Microsoft support if it persists |
| AADSTS80007 | Error communicating with Active Directory | Check the agent logs and verify that Active Directory works |

With a Microsoft Entra ID P1 or P2 license, you can also use the sign-in report. Go to **Microsoft Entra ID** > **Sign-ins**, select a user's sign-in and read the **Sign-in error code** field:

| Code | Reason | Resolution |
| --- | --- | --- |
| 50144 | User's Active Directory password has expired | Reset the password in on-premises Active Directory |
| 80001 | No Authentication Agent available | Install and register an agent |
| 80002 | Password validation request timed out | Check that Active Directory is reachable from the agent |
| 80003 | Invalid response received by the agent | If reproducible across users, check the Active Directory configuration |
| 80004 | Incorrect UPN in the sign-in request | Ask the user to use the correct username |
| 80005 | Agent error | Transient, try again later |
| 80007 | Agent cannot connect to Active Directory | Check reachability |
| 80010, 80011 | Agent cannot decrypt the password or retrieve the key | If reproducible, install and register a new agent and uninstall the current one |
| 80014 | Validation response exceeded the maximum time | Open a support ticket with the error code, correlation ID and timestamp |

## Step 3: Invalid username or password

Learn says this can happen when a user's on-premises UPN differs from the cloud UPN. To test that the agent itself works:

1. Create a test account.
2. On the agent machine, import the module:
   `Import-Module "C:\Program Files\Microsoft Azure AD Connect Authentication Agent\Modules\PassthroughAuthPSModule\PassthroughAuthPSModule.psd1"`
3. Run `Invoke-PassthroughAuthOnPremLogonTroubleshooter`.
4. When prompted, enter the same username and password that are used to sign in at login.microsoftonline.com.

If you get the same error, the agent works correctly and the issue may be a non-routable on-premises UPN. Learn points to alternate login ID for that. It also says that if the Microsoft Entra Connect server is not domain joined, a prerequisite, the invalid username or password issue occurs.

## Step 4: Check the Logon To restriction

Agents validate credentials by calling the Win32 LogonUser API. If you limited workstation logon access with the Logon To setting in Active Directory, add the servers that host Authentication Agents to the list. Without that, your users cannot sign in to Microsoft Entra ID.

## Installation, registration and enabling problems

- **Blocked ports.** For failed registration or failed enabling, make sure the server can communicate with the service URLs and ports that Learn lists in the pass-through authentication quick start.
- **Token or account authorization errors.** Use a cloud-only Hybrid Identity Administrator account for Entra Connect or agent installation, registration and for enabling the feature. Learn names a known issue with MFA-enabled Hybrid Identity Administrator accounts and a workaround of turning off MFA temporarily, only to complete the operation.
- **No agent available when enabling.** You need at least one active agent. Install Entra Connect or a standalone agent.
- **Unexpected error during installation or registration.** Collect agent logs and contact Microsoft Support.

## Collect logs

| Where | What it shows |
| --- | --- |
| `%ProgramData%\AADConnect\trace-*.log` | Entra Connect installation errors |
| Event Viewer, Application and Service Logs\Microsoft\AzureAdConnect\AuthenticationAgent\Admin | Authentication Agent errors |
| `%ProgramData%\Microsoft\Azure AD Connect Authentication Agent\Trace\` | Reasons for specific sign-in failures |

Learn adds that the Session log can be enabled for detailed analytics, but must not run during normal operations, and its contents become visible only after you disable it again. A trace entry shows a reason number, for example 1328. You can decode it with `Net helpmsg 1328`.

If audit logging is enabled, the security log of the PTA server also has information. Learn gives an event query filtered on the agent service executable. Performance Monitor counters on each agent server (PTA authentications, failed authentications, successful authentications and authentication errors) help too.

## Do not expect even traffic

Learn states that PTA provides high availability with multiple agents, not load balancing. It is normal that a specific agent receives no traffic at all.

## A short checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Check agent status in the admin center.
2. Pull the error code from the sign-in report and use the table above.
3. For credential errors, run the troubleshooter with a test account before blaming the agent.
4. Compare on-premises and cloud UPNs for the affected users.
5. Keep at least two agents on separate servers.

## Related

- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Microsoft Entra Connect: Troubleshoot Pass-through Authentication (Microsoft Learn)](https://learn.microsoft.com/entra/identity/hybrid/connect/tshoot-connect-pass-through-authentication)
