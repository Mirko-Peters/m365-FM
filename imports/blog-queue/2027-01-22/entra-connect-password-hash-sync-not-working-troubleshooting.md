---
title: "Microsoft Entra Connect Password Hash Sync Not Working: Troubleshooting Steps"
summary: "Troubleshoot password hash synchronization in Entra Connect Sync: choose the wizard task or Invoke-ADSyncDiagnostics by version, split no passwords synchronized from one object, read the heartbeat Event ID 654, check AD DS permissions and the password sync log statuses."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [entra-connect, password-hash-synchronization, entra-id]
keypoints:
  - "Pick the tool by version: the wizard troubleshooting task from 1.1.614.0, the Invoke-ADSyncDiagnostics cmdlet from 1.1.524.0, manual steps for older versions."
  - "Split the problem: no passwords synchronize at all, or one object does not synchronize. Each has its own checks."
  - "A healthy channel logs a heartbeat, Event ID 654, every 30 minutes in the Application log. The task looks for one within the past three hours."
  - "The AD DS connector account needs Replicate Directory Changes and Replicate Directory Changes All at the root of every domain. A server in staging mode synchronizes no passwords."
  - "Temporary passwords, set by Change password at next logon, need version 2.0.3.0 or higher and the ForcePasswordChangeOnLogon feature."
faq:
  - q: "Which troubleshooting tool should I use?"
    a: "Microsoft Learn says to use the troubleshooting task in the Entra Connect wizard for version 1.1.614.0 or later. For version 1.1.524.0 or later there is the Invoke-ADSyncDiagnostics cmdlet. Older versions use the manual steps. The wizard path is Additional Tasks, Troubleshoot, Launch, then Troubleshoot password hash synchronization."
  - q: "How do I check one user that does not sync passwords?"
    a: "With the diagnostic cmdlet, import the ADSyncDiagnostics module and run Invoke-ADSyncDiagnostics with the PasswordSync switch, the AD connector name and the user's distinguished name. Learn says the task examines the object in the connector space, the metaverse and the Entra connector space, checks the sync rules and shows the result of the last attempt, which Entra Connect keeps for seven days by default."
  - q: "What is the heartbeat event?"
    a: "Each on-premises Active Directory connector has its own password hash synchronization channel. When the channel is active but no password changes are pending, Event ID 654 is logged in the Windows Application event log every 30 minutes. The cmdlet checks for heartbeat events from each connector within the past three hours and returns an error if there are none."
  - q: "Why does a user with Change password at next logon not sync?"
    a: "In the manual steps, Learn says temporary passwords are not synchronized and the user must sign in and change the password. In the log the status FilteredByTarget means the password is set to User must change password at next logon. To synchronize temporary passwords you need Entra Connect version 2.0.3.0 or higher with the ForcePasswordChangeOnLogon feature enabled."
  - q: "Can I force a full password sync?"
    a: "Learn provides a script that sets the Microsoft.Synchronize.ForceFullPasswordSync parameter on the AD connector and then disables and re-enables password sync. It says to run it only once, and that if you need to run it again, something else is the problem, in which case you should contact Microsoft support."
---

When password hash synchronization (PHS) stops working, start by deciding whether no passwords synchronize or only one user's. The Microsoft Learn troubleshooting page then offers a tool depending on your Entra Connect version. This article follows that page, in a shorter form, and keeps the version numbers it gives.

## Pick the tool

| Entra Connect version | Tool |
| --- | --- |
| 1.1.614.0 or later | Troubleshooting task in the wizard |
| 1.1.524.0 or later | `Invoke-ADSyncDiagnostics` cmdlet |
| Older | Manual steps |

## No passwords are synchronized

### With the wizard task

1. Open PowerShell as administrator on the Entra Connect server and run `Set-ExecutionPolicy RemoteSigned` or `Unrestricted`.
2. Start the Entra Connect wizard and go to **Additional Tasks** > **Troubleshoot** > **Next**.
3. Select **Launch** to open the troubleshooting menu in PowerShell.
4. Choose **Troubleshoot password hash synchronization**, then **Password hash synchronization does not work at all**.

The task checks that the feature is enabled for the tenant and that the server is not in staging mode. For every AD connector it checks that PHS is enabled, looks for heartbeat events in the Application log and, for each domain, checks that the domain is reachable and that the AD DS account has the right username, password and permissions.

### With the cmdlet

Run PowerShell as administrator, set the execution policy, then:

```powershell
Import-Module ADSyncDiagnostics
Invoke-ADSyncDiagnostics -PasswordSync
```

### What the results mean

- **Feature not enabled.** Enable PHS in the wizard.
- **Server in staging mode.** PHS is temporarily disabled. A server in staging mode does not synchronize passwords.
- **No heartbeat.** The channel logs Event ID 654 every 30 minutes when no changes are pending. The task looks within the past three hours.
- **Wrong permissions or credentials on the AD DS account.** Fix the account.

### Manual steps for older versions

Learn's manual list, in order:

1. Is the server in staging mode?
2. Run the script from the page to read the PHS configuration (it uses `Get-ADSyncAADCompanyFeature` and `Get-ADSyncAADPasswordSyncConfiguration`, and looks for Event ID 654 in the last three hours).
3. If the feature or the channel is disabled, run the wizard, choose **Customize synchronization options**, clear password sync, finish, then run the wizard again and enable it. Run the script again to verify.
4. Look in the event log for source Directory synchronization, IDs 0, 611, 652 and 655. They point to a connectivity problem, and the message names the forest.
5. If there is no heartbeat or nothing else worked, run the full password sync script, only once.
6. Continue with the one-object steps.

### Connectivity and AD DS permissions

The AD DS connector account must be able to read password hashes in all domains. Express settings configure the permissions automatically, and custom installations need manual assignment. To find the account, open **Synchronization Service Manager**, go to **Connectors**, select the forest connector, open **Properties** and **Connect to Active Directory Forest**. In Active Directory Users and Computers, verify that the account has these two permissions at the root of all domains in the forest:

- Replicate Directory Changes
- Replicate Directory Changes All

If the Connect server cannot reach all domain controllers, configure **Only use preferred domain controller** and list the domain controllers for each domain. Restart the **Microsoft Entra ID Sync** (ADSync) service to apply the change.

## One object does not synchronize

### With the cmdlet

```powershell
Import-Module ADSyncDiagnostics
Invoke-ADSyncDiagnostics -PasswordSync -ADConnectorName <Name-of-AD-Connector> -DistinguishedName <DN-of-AD-object>
```

The wizard equivalent is the sub menu entry **Password isn't synchronized for a specific user account**. It examines the object in the AD connector space, the metaverse and the Entra connector space, checks that sync rules with PHS enabled apply, and shows the result of the last attempt. Learn says the results are kept for seven days by default.

Results you can see:

- **Object not exported to Entra ID.** There is no corresponding object in the tenant.
- **Temporary password.** Older versions cannot synchronize a password marked **Change password at next logon**. You need version 2.0.3.0 or higher and the ForcePasswordChangeOnLogon feature enabled.
- **No history available.** No results exist for the object.

### Manual check

1. In Active Directory Users and Computers, check that **User must change password at next logon** is cleared. Temporary passwords are not synchronized.
2. In Synchronization Service Manager, search the AD connector space by DN, open the object, and select **Log** to see the password sync details of the past week. An empty log means Entra Connect cannot read the password hash, so go to the connectivity checks.
3. On the **Lineage** tab, at least one sync rule in the **PasswordSync** column must be True. The default rule is named In from AD - User AccountEnabled.
4. In the metaverse object properties, check that there is no **cloudFiltered** attribute and that domainFQDN and domainNetBios look right.
5. On the **Connectors** tab, see connectors to both AD and Entra ID. The Entra connector object needs an outbound rule with PasswordSync True. The default is Out to Microsoft Entra ID - User Join.

### Password sync log status values

| Status | Meaning |
| --- | --- |
| Success | Synchronized |
| FilteredByTarget | Password is set to change at next logon, not synchronized |
| NoTargetConnection | No object in the metaverse or the Entra connector space |
| SourceConnectorNotPresent | No object in the AD connector space |
| TargetNotExportedToDirectory | The Entra connector space object is not yet exported |
| MissingAttribute | Attributes needed by Microsoft Entra Domain Services, such as the Kerberos hash, are not available |
| RetryRequestedByTarget | Those attributes were missing earlier, a resync is attempted |
| Error, Unknown | Unknown service error, or a failure processing a batch |

## Event Viewer

PHS writes many Application log events. Learn advises increasing the Application log size, otherwise PHS events may be overwritten. A few IDs from its table: 611 error during PHS for a domain, 652 error during a PHS operation, 654 end of a PHS ping (the heartbeat), 655 error during a PHS ping, 617 to 623 full sync progress for forest and domains.

## Full sync of all passwords

Learn provides a script that sets `Microsoft.Synchronize.ForceFullPasswordSync` on the AD connector, then disables and enables password sync with `Set-ADSyncAADPasswordSyncConfiguration`. It says to run it only once, since needing it again means another problem exists, and to contact Microsoft support in that case. Connector names are case-sensitive in that script.

## Order of work (my advice)

This is my suggestion, not Microsoft guidance:

1. Check staging mode first. It is quick and a classic cause after a server migration.
2. Run the diagnostic for the whole channel before looking at single users.
3. For one user, check the Change password at next logon flag before you open the connector space.
4. Raise the Application log size before you start collecting events.

## Related

- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Password hash synchronization (PHS)](https://www.m365.fm/entity/password-hash-synchronization/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Troubleshoot password hash synchronization with Microsoft Entra Connect Sync (Microsoft Learn)](https://learn.microsoft.com/entra/identity/hybrid/connect/tshoot-connect-password-hash-synchronization)
