---
title: "Graph Connector Agent Will Not Register: Check Permissions and App Credentials"
summary: "Graph connector agent installed, but registration fails with insufficient permissions or invalid application credentials? Check roles, application permissions, admin consent and the secret."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-connectors, microsoft-graph-permissions, app-registration, admin-consent]
keypoints:
  - "Microsoft Learn says the agent app needs Microsoft Graph application permissions, not delegated ones, plus admin consent that shows as Granted."
  - "Always required: ExternalConnection.ReadWrite.OwnedBy and either ExternalItem.ReadWrite.OwnedBy or ExternalItem.ReadWrite.All. File share, SQL, Oracle, Confluence DC and GitHub server connectors also need Directory.Read.All."
  - "The Name field of the agent accepts only alphanumeric characters, so spaces in the name are a simple way to fail."
  - "If registration works but crawls fail later, the Errors tab of the connection shows codes such as 1015, 1016 and 1019 that point to missing permissions or bad credentials."
faq:
  - q: "Which permissions does the Graph connector agent app need?"
    a: "According to Microsoft Learn, all of them are Microsoft Graph application permissions. ExternalConnection.ReadWrite.OwnedBy is always required. ExternalItem.ReadWrite.OwnedBy or ExternalItem.ReadWrite.All is always required. Directory.Read.All is required for the Confluence DC, GitHub server, File share, MS SQL and Oracle SQL connectors. Grant admin consent afterwards and check that the status is Granted."
  - q: "Do I need to install the Graph connector agent on every user's computer?"
    a: "No. Learn says to install it on a computer on the same network as the data source, and that it does not need to run on the data source host itself. In a community thread, a Microsoft staff member described it as a central service, so users do not install anything."
  - q: "Where do I find the agent logs?"
    a: "Microsoft Learn lists the GcaHostService logs under the service profile folder, for example C:\\Windows\\ServiceProfiles\\GcaHostService\\AppData\\Local\\Microsoft\\GraphConnectorAgent\\HostService\\logs on most supported Windows versions. One community answer named C:\\ProgramData\\Microsoft\\GraphConnectorAgent\\Logs instead. Learn does not list that folder, so check the Learn path first."
  - q: "Which admin role do I need to sign in to the agent?"
    a: "Learn says the minimum required privilege for the sign-in account is AI administrator. Its prerequisites table also names Search administrator or Copilot admin for the installation and Azure App admin or Azure admin for the app registration. A community answer listed other roles, so treat Learn as the reference."
---

You installed the Microsoft Graph connector agent on a server. The services run. Then you try to register it, and the configuration app refuses: either "insufficient permissions" or "invalid application credentials".

Both messages came up in Microsoft Q&A threads in late 2025. This article collects what Microsoft Learn says about the app registration and combines it with what the two threads reported. It is a troubleshooting checklist, not an official Microsoft procedure, so compare each step with the current [Microsoft Graph connector agent page](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/connector-agent). Learn now uses the name Microsoft 365 Copilot connectors for the feature. The agent page still says "Microsoft Graph connector agent", and the error page also uses "Microsoft 365 Copilot connector agent", so expect both names.

## What the two threads reported

**Thread 1 (September 2025).** An administrator set up the agent next to a SQL Server instance (SQL Server 2022 Express on Windows Server 2025). Registration failed with an insufficient permissions error, even though the server could reach the Azure, Entra and Power Apps portals. A Microsoft staff member said the Entra app was missing Graph permissions and listed `ExternalItem.ReadWrite.OwnedBy` and `Directory.Read.All`, plus admin consent. The asker later wrote that removing the delegated permissions and adding the same permissions as application permissions fixed it. That is the asker's own report. The page labels this post "recommended by moderator", but no Microsoft staff member explained the root cause, and the post does not say whether admin consent was granted in the process. Adding an Entra role (Cloud Application Administrator) to the signing-in account did not change the error.

**Thread 2 (December 2025).** An administrator installed the agent for a file share. Sign-in worked, but the agent name, application ID and client secret produced "invalid application credentials". A Microsoft staff member listed four application permissions, admin consent, a check for typos and spaces, network access and the log folder. The asker answered that it was working, but did not say which step made the difference. So the cause stays unknown.

Thread 2 also contains an AI-generated answer. We did not use it as evidence.

## Step 1: Check the account you sign in with

Learn says that for the agent sign-in, the minimum required privilege on the account is AI administrator. Its prerequisites table also lists Search administrator or Copilot admin for installing the agent, and Azure App admin or Azure admin for registering the app in Entra ID.

One of the community answers named other roles (Global Administrator, Application Administrator, Search Administrator). That list is not on the Learn page. Use the Learn roles first. In thread 1, adding Cloud Application Administrator did not help, so an extra role is not a cure by itself.

## Step 2: Make sure the app uses application permissions

In the Azure portal, open **Microsoft Entra ID**, then **App registrations**, and open the app you created for the agent. Under **API permissions**, check the type of each entry. Learn tells you to pick **Microsoft Graph** and then **Application permissions**, and the page does not mention delegated permissions for this app.

The table on the Learn page says:

| Permission | When it is required |
|---|---|
| `ExternalItem.ReadWrite.OwnedBy` or `ExternalItem.ReadWrite.All` | Always |
| `ExternalConnection.ReadWrite.OwnedBy` | Always |
| `Directory.Read.All` | Confluence DC, GitHub server, File share, MS SQL and Oracle SQL connectors |

Thread 1 mentions SQL Server and thread 2 a file share, and both source types are in the `Directory.Read.All` row. If your list shows a delegated entry, remove it and add the application version.

## Step 3: Grant admin consent and read the status

Adding a permission does not activate it. On the same page, select **Grant admin consent for [TenantName]**, confirm with **Yes**, and check that the status of every permission reads **Granted**. A permission that shows no consent will not take effect, so check this before anything else.

## Step 4: Check the application ID and the secret

Learn offers two ways to authenticate: a client secret or a certificate.

For a client secret:

1. In the app, go to **Certificates and secrets** and create a new client secret with an expiry period.
2. Copy and save the generated value at once. In thread 2, the staff member pointed out that the secret is displayed only when you create it. If you did not save it, create a new one.
3. Enter the secret and the **Application (client) ID** in the agent.
4. Keep the agent **Name** simple. Learn says the field accepts alphanumeric characters and no blank spaces.

For a certificate, Learn has its own section. As far as we could see, it asks you to upload the `.cer` file to the app, copy the thumbprint, place the certificate in the local machine store on the agent computer, and give the `NT Service\GcaHostService` account access to its private key (without using **Check Names**). Follow that section step by step.

## Step 5: Check the agent service

Two errors on the Learn page have nothing to do with permissions:

- If you see "Sign-in failed, please select the sign-in button to try again" after the browser sign-in worked, open `services.msc` and check that **GcaHostService** is running. Start it manually if needed.
- If the service does not start and reports "The service didn't start due to a logon failure", check that the virtual account `NT Service\GcaHostService` has the "Log on as a service" right. If the option to add accounts is greyed out in the local policy, an administrator or a group policy is blocking it.

If you use a Government cloud, Learn also asks you to check that the values in `appsettings.json` (`Authority.CloudInstanceUrl`, `Scopes` and `GcsBaseUrl`) all belong to the same cloud, and to restart the config app after saving.

## Step 6: Check the network path

The agent needs outbound access over port 443. For the commercial cloud, Learn lists `*.events.data.microsoft.com`, `*.office.com`, `https://login.microsoftonline.com`, `https://gcs.office.com/` and `https://graph.microsoft.com/`. The Microsoft staff member in thread 2 mentioned `login.microsoftonline.com` and `graph.microsoft.com` as well.

Learn also says proxy authentication is not supported. If your proxy needs authentication, let the agent bypass it. Learn gives a test for an agent that shows as offline:

```
tnc gcs.office.com -Port 443
```

It should return `TcpTestSucceeded : True`. Use the GCC or GCC High host names from the Learn page if you are in those clouds.

## Step 7: Read the logs

Learn lists the GcaHostService logs under the service profile. On Windows versions other than Windows Server 2016, the folder is `C:\Windows\ServiceProfiles\GcaHostService\AppData\Local\Microsoft\GraphConnectorAgent\HostService\logs`. The Learn page asks you to send the two latest log files when you contact Microsoft Support.

The Microsoft staff member in thread 2 named `C:\ProgramData\Microsoft\GraphConnectorAgent\Logs`. This is reported in the thread and is not listed on the Learn page. If one folder is empty, look in the other.

## Step 8: Use the error codes after registration

Sometimes registration works and the problems start during crawling. In the Microsoft 365 admin center, go to **Connectors**, then **Your connections** (Learn's connector management page writes the full path as **Copilot**, **Connectors**, **Your Connections**), select the connection and open the **Error** tab. Microsoft Learn's connector error page lists codes that match the problems in this article:

| Code | Meaning according to Learn |
|---|---|
| 1015 | The Entra app does not have `ExternalItem.ReadWrite.OwnedBy` |
| 1016 | The Entra app does not have `Directory.Read.All` |
| 1019 | App credentials are invalid or expired |
| 1011 | The connector agent is not reachable or is offline |
| 1018 | The account has no interactive sign-in right on the agent computer |

For 1015 and 1016, grant the missing permission and give consent. For 1019, update the credentials with **Edit** on the connection.

## What the threads did not settle

- Neither thread proves which single step was the root cause. In thread 1, application instead of delegated permissions was the reported change. In thread 2, the asker only wrote that it worked.
- Learn does not describe the "invalid application credentials" text from thread 2. The checks above come from the Learn app registration steps, not from a documented meaning of that message.
- The agent does not need to be installed on user devices. Learn's FAQ says to install it on a computer on the same network as the data source. Learn also recommends no more than three connections per agent.

If all checks pass and registration still fails, collect the two latest log files and open a support case.

## Related

- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [App registration](https://www.m365.fm/entity/app-registration/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)

## Sources

- [Microsoft Learn: Microsoft Graph connector agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/connector-agent)
- [Microsoft Learn: Microsoft Graph connector agent FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/connector-agent-frequently-asked-questions)
- [Microsoft Learn: Monitor connector errors](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/error-responses)
- [Microsoft Q&A: The Graph connector agent has failed to register due to insufficient permissions (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5560935/the-graph-connector-agent-has-failed-to-register-d)
- [Microsoft Q&A: How to configure the Graph connector agent (December 2025)](https://learn.microsoft.com/en-us/answers/questions/5655367/how-to-configure-the-graph-connector-agent)
