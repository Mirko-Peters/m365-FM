---
title: "Fix SSPR Password Writeback Failures: SSPR_0029, Silent Failures and Missing Events"
summary: "Cloud password resets succeed but never reach on-premises AD, or SSPR_0029 appears? Check licensing, connectivity, the connector account, SAM restrictions and the sync engine that owns writeback."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [self-service-password-reset, password-writeback, entra-connect, entra-cloud-sync]
keypoints:
  - "SSPR_0029 has three documented causes: a synchronized admin in a protected group, missing AD permissions for the connector account, or a restriction on remote SAM calls."
  - "Writeback uses outbound HTTPS (443) to an Azure Service Bus relay, so firewall, proxy and idle time-out problems are the most common failure point."
  - "Check the Application event log on the sync server: PasswordResetService events (31xxx, 32xxx, 33xxx) and ADSync events tell you which layer failed."
  - "If Entra Connect Sync and Cloud Sync both cover the same domain, Cloud Sync handles all writeback for that domain."
faq:
  - q: "What does SSPR_0029 mean?"
    a: "It is the error users see with the text that the organization has not properly set up the on-premises configuration for password reset. In the threads it appeared after the cloud steps, including MFA, had worked. Microsoft Learn lists three causes: the user is a synchronized admin in a protected AD group (by design, no fix), the AD DS connector account lacks permissions, or a policy restricts remote calls to the SAM database. Learn names events 33004 and 6329 in the Application log on the Entra Connect server for the SAM restriction, and lists 33004 as a permission error too."
  - q: "Why can a synced admin change a password in the cloud but not reset a forgotten one?"
    a: "Microsoft Learn says the on-premises service account that handles writeback cannot change passwords for users in protected groups. Those administrators can change their password in the cloud, but they cannot use writeback to reset a forgotten password."
  - q: "Which ports and URLs does password writeback need?"
    a: "According to the Learn troubleshooting page, Entra Connect version 1.1.443.0 and higher needs outbound HTTPS to *.passwordreset.microsoftonline.com and *.servicebus.windows.net in the public cloud. Learn's concept page says password writeback needs no inbound firewall rules and that all communication is outbound over port 443. Compare with the current pages, because endpoints can change."
  - q: "Do I need Entra ID P1 for password writeback?"
    a: "The Learn tutorial lists Microsoft Entra ID P1 (or a trial) as a prerequisite, together with the Hybrid Identity Administrator role to configure it."
---

A user resets a password in the cloud, the page says it worked, and then the old password still works on-premises. Or the reset ends with `SSPR_0029`. Password writeback fails in ways that give very little to work with, and in several recent Microsoft Q&A threads the person asking got no confirmed answer.

This article uses those threads as scenarios and Microsoft Learn as the source for every fix. It is a checklist, not an official Microsoft procedure.

## What the threads looked like

Five Microsoft Q&A threads from August 2025 to August 2026 show the pattern:

- A tenant on Entra Connect Sync 2.5.76.0 got `SSPR_0029` even though writeback was enabled, the wizard had been toggled off and on, and outbound 443 was open. There was no `PasswordResetService` source in the event viewer. One volunteer answered with a link to another thread. No fix was confirmed.
- An administrator saw writeback enabled in settings, but the Entra Connect gather report showed it as off. A reinstall repaired sync but not the cloud password change. The thread ends without a confirmed fix.
- In another tenant, the admin center showed a banner saying it could not connect to the on-premises writeback client. The "write back passwords" setting would not stay saved. A second Connect server behaved the same. Only an automated answer was posted.
- A newly synced account failed with `SSPR_0029` after a correct MFA step. The only reply was an automated answer.
- An administrator decommissioned a Cloud Sync agent, and the old agent stayed listed as inactive. They suspected it blocked writeback. Nobody answered whether that is true.

None of these threads has a confirmed solution. The documented checks below let you answer the open questions yourself.

## Step 1: Confirm the basics

According to the Learn tutorial for enabling writeback:

1. You need Microsoft Entra ID P1 or a trial licence.
2. You need the Hybrid Identity Administrator role to configure it.
3. In the Microsoft Entra admin center, go to **Entra ID** > **Password reset** > **On-premises integration** and confirm that **Write back passwords to your on-premises directory** is checked.
4. In the Entra Connect wizard, **Password writeback** must be selected on the **Optional features** page.

Then compare your case with the scenarios Learn lists as unsupported. The ones that surprise people:

- An admin reset from the Microsoft 365 admin center is not supported for writeback. An admin reset from the Microsoft Entra admin center is supported for users that are federated or password-hash synchronized.
- Self-service resets with PowerShell version 1 or 2, or an end user using the Graph API, are not supported.
- SSPR with writeback is not supported while staged rollout is enabled for a security group. Learn says it may work in some cases but cannot be guaranteed.

## Step 2: Find out which engine owns writeback

Entra Connect Sync and Cloud Sync can both do password writeback. Learn says that when both cover the same domain, the Cloud Sync agent processes all writeback operations for users from that domain.

So if you run both, do not assume the Connect server is the one doing the work. In the Entra admin center, the checkbox **Write back passwords with Microsoft Entra Connect cloud sync** only appears when Cloud Sync agents are detected. Check which engine you meant to use for each domain, and make the other engine stop covering it.

The stale-agent question from one thread is not answered by Learn. I found no Learn statement that an inactive agent disables writeback. Treat that as unknown, and check that at least one active agent covers the domain.

## Step 3: Test the connection to the relay

Learn calls this the most common failure point: wrong firewall or proxy ports, or idle time-outs. Learn's concept page says writeback needs no inbound firewall rules and communicates outbound over port 443. For the public cloud, allow `*.passwordreset.microsoftonline.com` and `*.servicebus.windows.net`.

To find your service bus namespace:

1. Open the **Application** log in Event Viewer on the Entra Connect server.
2. Find event **31034** or **31019**. Learn says to identify the name of the service bus listener from these events.
3. Test it from the server:

```powershell
Test-NetConnection -ComputerName <namespace>.servicebus.windows.net -Port 443
```

Learn also asks you to check TLS 1.2 and .NET Framework 4.8 or later on the sync server.

Two related events are worth knowing. Event **32002** means the token provider could not get a security token, which Learn links to outbound rules blocking the Service Bus endpoint. Event **32011** means onboarding could not reach the service, and Learn lists TCP 443 and TCP 9350-9354 for that case.

## Step 4: Read the right event log

The Application log on the Entra Connect server has two relevant sources: **PasswordResetService** and **ADSync**. If you see no `PasswordResetService` events at all during a reset, the request is probably not reaching the sync server. Go back to steps 1 to 3.

Learn's list helps you place the failure:

| Event | Meaning according to Learn |
|---|---|
| 31002 | Password written back successfully |
| 31003 | Write failed: policy violation, missing permission, or protected group |
| 32009 | Hybrid Administrator token failed: wrong password or a federated account |
| 33004 | The connector account lacks reset permission on the object; can also happen if `AdminCount` is 1 |
| 33008 | Password violates the on-premises policy |
| 6329 (ADSync) | Password breaks domain age, history, complexity or filter rules, or `PASSWD_CANT_CHANGE` is set |

Learn's description of event 6329 says that if a password was changed within the minimum password age, it cannot be changed again until that age is reached. For testing purposes, Learn says to set the minimum age to 0. Do not change the policy in production only to make a test pass.

## Step 5: Work through SSPR_0029

The dedicated Learn article for `SSPR_0029` lists three causes.

**Cause 1: a synchronized admin in a protected group.** This is by design and has no solution. These admins can change a password in the cloud but cannot reset a forgotten one with writeback. Test with a normal user before you go further.

**Cause 2: the connector account lacks permissions.** To find the account:

Learn's access-rights article describes it like this:

1. On the Entra Connect server, open **Synchronization Service** and select the **Connectors** tab.
2. Select the Active Directory connector and open its **Properties**.
3. Select **Connect to Active Directory Forest** and copy the **User name**.

The tutorial lists the needed permissions: **Reset password**, **Change password**, write access to `lockoutTime` and `pwdLastSet`, and the extended right **Unexpire Password** on the domain root. To test, Learn's access-rights article describes opening Active Directory Users and Computers, turning on **View** > **Advanced Features**, opening a user's **Properties** > **Security** > **Advanced** > **Effective Permissions**, selecting the `MSOL_` account, and comparing the result with the required permissions listed in that article. Changes can take an hour or longer to replicate, and Learn warns that disabled inheritance on the account can stop writeback.

The SSPR_0029 article adds a workaround for the permissions cause: password writeback depends on the legacy `NetUserGetInfo` API, so Learn recommends deploying Entra Connect on a member server instead of a domain controller. Otherwise, configure the AD connector to **Only use preferred domain controllers** and add the preferred domain controllers in the **Configure Preferred DCs** dialog box.

**Cause 3: remote SAM calls are restricted.** The policy **Network access: Restrict clients allowed to make remote calls to SAM** may be applied by a domain GPO or local policy. Learn describes how to check:

```
gpresult /h C:\Temp\GPreport.htm
```

```powershell
Get-ItemProperty -Path HKLM:\System\CurrentControlSet\Control\Lsa -Name RestrictRemoteSam
```

Learn gives two solutions. Solution 1 keeps the policy and adds the `MSOL_` connector account with **Remote Access** set to **Allow**, then runs `gpupdate /force`. Solution 2 removes the policy and deletes the registry value. Learn warns that the value is re-created on the next policy refresh if the domain GPO setting stays in place, and that the error then returns. Removing the policy loosens a hardening setting, so solution 1 is the more conservative choice (my assessment, not Learn's).

## Step 6: Re-enable writeback and update

Learn's connectivity checklist ends with these steps, in this order:

1. Restart the **Azure AD Sync** service in `services.msc`.
2. Run the Entra Connect wizard, clear **Password writeback** on **Optional features**, finish with **Configure**, then run the wizard again and select it.
3. Install the latest Entra Connect release as an in-place upgrade. Back up any custom sync rules first.

The Learn pages I used do not mention a gather report, and the thread where it said writeback was off never explained the difference. Use the event log and a real reset test as proof.

## Step 7: Verify

1. Reset a test password for a normal synced user through the SSPR portal.
2. Watch for event 31001 followed by 31002 in the Application log.
3. Sign in on-premises with the new password.

If all checks pass and the Entra admin center still cannot save the writeback setting, collect what Learn asks for in a support case: the exact time and time zone, the user type, a zipped Application log from the sync server, and the support code shown on the error.

## Limits of this article

- The threads did not confirm any fix. The steps come from Learn.
- The Learn troubleshooting page shows a "Last updated" date of March 2025. Check current wording before you change production settings.

## Related

- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)
- [Password writeback](https://www.m365.fm/entity/password-writeback/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Microsoft Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)

## Sources

- [Microsoft Learn: Troubleshoot password writeback](https://learn.microsoft.com/en-us/entra/identity/authentication/troubleshoot-sspr-writeback)
- [Microsoft Learn: Tutorial, enable password writeback](https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-sspr-writeback)
- [Microsoft Learn: How password writeback works](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-writeback)
- [Microsoft Learn: Password writeback access rights and permissions](https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/user-prov-sync/password-writeback-access-rights-permissions)
- [Microsoft Learn: SSPR_0029 error](https://learn.microsoft.com/en-us/troubleshoot/azure/entra/entra-id/user-prov-sync/password-writeback-error-code-sspr-0029)
- [Microsoft Q&A: SSPR writeback, no PasswordResetService logs and SSPR_0029 (August 2025)](https://learn.microsoft.com/en-us/answers/questions/5533889/sspr-writeback-no-passwordresetservice-logs-and-er)
- [Microsoft Q&A: Trouble with write back access in a hybrid AD setup (November 2025)](https://learn.microsoft.com/en-us/answers/questions/5608943/trouble-with-write-back-access-in-a-hybrid-ad-set)
- [Microsoft Q&A: SSPR password reset not working (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5804578/sspr-pass-reset-not-working-ms-365-premium-account)
- [Microsoft Q&A: Password reset on-premises integration, writeback issues (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5988843/password-reset-on-premises-integration-writeback-i)
- [Microsoft Q&A: Suspected stale Entra Cloud Sync agent blocking SSPR password writeback (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5979212/suspected-stale-entra-cloud-sync-agent-blocking-ss)
