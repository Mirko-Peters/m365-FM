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
    a: "It is the message users see when the cloud side accepts the new password but the on-premises part of password writeback fails. Microsoft Learn lists three causes: the user is a synchronized admin in a protected AD group (by design, no fix), the AD DS connector account lacks permissions, or a policy restricts remote calls to the SAM database. Events 33004 and 6329 in the Application log on the Entra Connect server point to the last two."
  - q: "Why can a synced admin change a password in the cloud but not reset a forgotten one?"
    a: "Microsoft Learn says the on-premises service account that handles writeback cannot change passwords for users in protected groups. Those administrators can change their password in the cloud, but they cannot use writeback to reset a forgotten password."
  - q: "Which ports and URLs does password writeback need?"
    a: "According to the Learn troubleshooting page, Entra Connect version 1.1.443.0 and higher needs outbound HTTPS on port 443 to *.passwordreset.microsoftonline.com and *.servicebus.windows.net in the public cloud. No inbound rules are needed. Compare with the current page, because endpoints can change."
  - q: "Do I need Entra ID P1 for password writeback?"
    a: "The Learn tutorial lists Microsoft Entra ID P1 (or a trial) as a prerequisite, together with the Hybrid Identity Administrator role to configure it."
---

A user resets a password in the cloud, the page says it worked, and then the old password still works on-premises. Or the reset ends with `SSPR_0029`. Password writeback fails in ways that give very little to work with, and in several recent Microsoft Q&A threads the person asking got no confirmed answer.

This article uses those threads as scenarios and the current Microsoft Learn pages as the source for every fix. It is a troubleshooting checklist, not an official Microsoft procedure. Where the threads and Learn differ, Learn wins.

## What the threads looked like

Five Microsoft Q&A threads from August 2025 to August 2026 show the pattern:

- A tenant on Entra Connect Sync 2.5.76.0 got `SSPR_0029` even though writeback was enabled, the wizard had been toggled off and on, and outbound 443 was open. There was no `PasswordResetService` source in the event viewer. One volunteer answered with a link to another thread. No fix was confirmed.
- An administrator saw writeback enabled in settings, but the Entra Connect gather report showed it as off. A reinstall repaired sync but not the cloud password change. The thread ends without a confirmed fix.
- In another tenant, the admin center showed a banner saying it could not connect to the on-premises writeback client. The "write back passwords" setting would not stay saved. A second Connect server behaved the same. Only an automated answer was posted.
- A newly synced account failed with `SSPR_0029` after a correct MFA step. The only reply was an automated answer.
- An administrator decommissioned a Cloud Sync agent, and the old agent stayed listed as inactive. They suspected it blocked writeback. Nobody answered whether that is true.

None of these threads has a confirmed solution. What they share is a set of questions you can answer yourself, in order, using documented checks.

## Step 1: Confirm the basics

According to the Learn tutorial for enabling writeback:

1. You need Microsoft Entra ID P1 or a trial licence.
2. You need the Hybrid Identity Administrator role to configure it.
3. In the Microsoft Entra admin center, go to **Entra ID** > **Password reset** > **On-premises integration** and confirm that **Write back passwords to your on-premises directory** is checked.
4. In the Entra Connect wizard, **Password writeback** must be selected on the **Optional features** page.

Then compare your case with the scenarios Learn lists as unsupported. The ones that surprise people:

- An admin reset from the Microsoft 365 admin center is not supported for writeback. An admin reset from the Microsoft Entra admin center or Microsoft Graph is supported for users that are federated or password-hash synchronized.
- Self-service resets with PowerShell version 1 or 2, or an end user using the Graph API, are not supported.
- SSPR with writeback is not supported while staged rollout is enabled for a security group. Learn says it may work in some cases but cannot be guaranteed.

## Step 2: Find out which engine owns writeback

Entra Connect Sync and Cloud Sync can both do password writeback. Learn says that when both cover the same domain, the Cloud Sync agent processes all writeback operations for users from that domain.

So if you run both, do not assume the Connect server is the one doing the work. In the Entra admin center, the checkbox **Write back passwords with Microsoft Entra Connect cloud sync** only appears when Cloud Sync agents are detected. Check which engine you meant to use for each domain, and make the other engine stop covering it.

The stale-agent question from one thread is not answered by Learn. I found no Learn statement that an inactive agent disables writeback. Treat that as unknown, and check that at least one active agent covers the domain.

## Step 3: Test the connection to the relay

Learn calls this the most common failure point: wrong firewall or proxy ports, or idle time-outs. Writeback needs only outbound HTTPS on 443 and no inbound rules. For the public cloud, allow `*.passwordreset.microsoftonline.com` and `*.servicebus.windows.net`.

To find your service bus namespace:

1. Open the **Application** log in Event Viewer on the Entra Connect server.
2. Find event **31034** or **31019**. The message names the namespace.
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

Learn also notes that on-premises password policy is evaluated before writeback succeeds. Set the **Minimum password age** policy to **0** if users need to change or reset more than once a day.

## Step 5: Work through SSPR_0029

The dedicated Learn article for `SSPR_0029` lists three causes.

**Cause 1: a synchronized admin in a protected group.** This is by design and has no solution. These admins can change a password in the cloud but cannot reset a forgotten one with writeback. Test with a normal user before you go further.

**Cause 2: the connector account lacks permissions.** To find the account:

1. On the Entra Connect server, open **Synchronization Service** and select **Connectors**.
2. Open the properties of the Active Directory Domain Services connector.
3. Select **Connect to Active Directory Forest** and note the **User name**.

The tutorial lists the needed permissions: **Reset password**, **Change password**, write access to `lockoutTime` and `pwdLastSet`, and the extended right **Unexpire Password** on the domain root. To test, open the target user's **Properties** > **Security** > **Advanced** > **Effective Access**, select the sync account, and confirm **Reset password** is checked. Changes can take an hour or longer to replicate, and Learn warns that disabled inheritance on the account can stop writeback.

If Connect runs on a domain controller and permissions cannot be resolved, Learn suggests either moving it to a member server or enabling **Only use preferred domain controllers** on the AD connector and adding a different domain controller than the local one.

**Cause 3: remote SAM calls are restricted.** The policy **Network access: Restrict clients allowed to make remote calls to SAM** may be applied by a domain GPO or local policy. Learn describes how to check:

```
gpresult /h C:\Temp\GPreport.htm
```

```powershell
Get-ItemProperty -Path HKLM:\System\CurrentControlSet\Control\Lsa -Name RestrictRemoteSam
```

The preferred fix in Learn is to keep the policy and add the `MSOL_` connector account with **Remote Access** set to **Allow**, then run `gpupdate /force`. The alternative is to remove the policy and delete the registry value. Learn warns that the value comes back on the next policy refresh if the domain GPO stays in place. Because removing the policy loosens a hardening setting for the whole machine, the first option is the safer one.

## Step 6: Re-enable writeback and update

Learn's connectivity checklist ends with these steps, in this order:

1. Restart the **Azure AD Sync** service in `services.msc`.
2. Run the Entra Connect wizard, clear **Password writeback** on **Optional features**, finish with **Configure**, then run the wizard again and select it.
3. Install the latest Entra Connect release as an in-place upgrade. Back up any custom sync rules first.

The Learn pages I used do not mention a gather report. In the thread where the report said writeback was off while the wizard said on, no one explained the difference. Use the event log and a real reset test as your proof instead.

## Step 7: Verify

1. Reset a test password for a normal synced user at the SSPR portal, `aka.ms/sspr`.
2. Watch for event 31001 followed by 31002 in the Application log.
3. Sign in on-premises with the new password.

If all checks pass and the Entra admin center still cannot save the writeback setting, collect what Learn asks for in a support case: the exact time and time zone, the user type, a zipped Application log from the sync server, and the support code shown on the error.

## Limits of this article

- The threads did not confirm any fix. The steps come from Learn.
- The Learn troubleshooting page footer shows March 2025. Check current wording before you change production settings.
- The admin center banner about the writeback client is not described on the Learn pages I used.

## Related

- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)
- [Password writeback](https://www.m365.fm/entity/password-writeback/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Microsoft Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)

## Sources

- [Microsoft Learn: Troubleshoot password writeback](https://learn.microsoft.com/en-us/entra/identity/authentication/troubleshoot-sspr-writeback)
- [Microsoft Learn: Tutorial, enable password writeback](https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-sspr-writeback)
- [Microsoft Learn: How password writeback works](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-writeback)
- [Microsoft Learn: SSPR_0029 error](https://learn.microsoft.com/en-us/troubleshoot/azure/entra/entra-id/user-prov-sync/password-writeback-error-code-sspr-0029)
- [Microsoft Q&A: SSPR writeback, no PasswordResetService logs and SSPR_0029 (August 2025)](https://learn.microsoft.com/en-us/answers/questions/5533889/sspr-writeback-no-passwordresetservice-logs-and-er)
- [Microsoft Q&A: Trouble with write back access in a hybrid AD setup (November 2025)](https://learn.microsoft.com/en-us/answers/questions/5608943/trouble-with-write-back-access-in-a-hybrid-ad-set)
- [Microsoft Q&A: SSPR password reset not working (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5804578/sspr-pass-reset-not-working-ms-365-premium-account)
- [Microsoft Q&A: Password reset on-premises integration, writeback issues (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5988843/password-reset-on-premises-integration-writeback-i)
- [Microsoft Q&A: Suspected stale Entra Cloud Sync agent blocking SSPR password writeback (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5979212/suspected-stale-entra-cloud-sync-agent-blocking-ss)
