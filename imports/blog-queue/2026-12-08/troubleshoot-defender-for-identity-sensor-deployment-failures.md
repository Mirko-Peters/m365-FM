---
title: "Troubleshoot Defender for Identity sensor deployment and domain controller connection failures"
summary: "A checklist for Microsoft Defender for Identity sensors that fail to install, start or report: gMSA permissions, proxy and certificates, event log access, directory service credentials and health alerts."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [defender-for-identity, defender]
keypoints:
  - "Start with prerequisites: outbound TCP 443 to the workspace sensor API under atp.azure.com, two cores, 6 GB RAM, High Performance power plan and clocks within five minutes."
  - "Many start-up failures trace back to the group managed service account. Check which principals may retrieve its password, then purge the Kerberos ticket or reboot."
  - "A proxy that answers 401 or 403 instead of 407 can show up as a licensing error. SSL inspection is not supported."
  - "Health issues name the cause: sensor stopped communicating, service failed to start, directory services credentials incorrect, or a domain controller unreachable."
  - "Microsoft recommends sensor v3.x for Windows Server 2019 and later. The v2.x pages cover Windows Server 2016 and earlier plus non-domain-controller servers."
faq:
  - q: "What are the basic requirements for a Defender for Identity sensor?"
    a: "The v2.x prerequisites page on Microsoft Learn lists two cores, 6 GB of RAM and 6 GB of disk space (10 GB recommended), the High Performance power option, and servers synchronized to within five minutes of each other. It also requires outbound TCP 443 to the workspace sensor API under atp.azure.com and a user with the Security administrator role."
  - q: "Why does the sensor service fail to start?"
    a: "Learn's known-issues page lists several causes. A common one is that the domain controller lacks the right to retrieve the gMSA password. Check PrincipalsAllowedToRetrieveManagedPassword, add the domain controller or a security group, then reboot or run klist -li 0x3e7 purge. Other causes include missing Log on as a service rights and an event log DACL that blocks the sensor."
  - q: "Why do I get a licensing error behind a proxy?"
    a: "According to Learn, if the proxy returns 401 or 403 instead of 407, the sensor can misread it as a licensing problem and report LicenseInvalid. The fix is to make sure the sensor can reach *.atp.azure.com through the proxy without authentication. The prerequisites page also says SSL inspection is not supported."
  - q: "What does 'A domain controller is unreachable by a sensor' mean?"
    a: "The health issues page says the sensor has limited functionality due to connectivity problems to the configured domain controller. Make sure the domain controllers are up, that the sensor can open LDAP connections to them, and that a Directory Service account is configured for every deployed forest."
  - q: "Which sensor version should I deploy?"
    a: "The v2.x prerequisites page says that for domain controllers running Windows Server 2019 or later, Microsoft recommends deploying sensor v3.x instead. The v2.x page covers Windows Server 2016 and earlier, plus AD FS, AD CS and Microsoft Entra Connect servers that are not domain controllers."
---

When a Defender for Identity sensor will not install, start or report, check in this order: prerequisites and network access, the service account, certificates and proxy, event log permissions, and then the health issues in the Defender portal. Each step below follows entries in Microsoft's known-issues and health pages.

## Step 1: Check the prerequisites

From the v2.x prerequisites page on Microsoft Learn:

- A user with the **Security administrator** role.
- Two cores, 6 GB of RAM and 6 GB of disk space (10 GB recommended), on top of what the OS and domain controller services use.
- The **High Performance** power option.
- For VMs, no Dynamic Memory on Hyper-V, and reserved memory on VMware. Disable Large Send Offload on VMware.
- Servers synchronized to within five minutes of each other.
- Outbound **TCP 443** to `https://<workspace-name>sensorapi.atp.azure.com`, through a proxy, ExpressRoute or the AzureAdvancedThreatProtection service tag. SSL inspection is not supported.
- For Windows Server 2019, the cumulative update KB4487044 or newer.

Microsoft recommends sensor v3.x for domain controllers on Windows Server 2019 and later. Run `Test-MdiReadiness.ps1` from the Defender for Identity GitHub repository, or find it in the Defender portal under **Identities** > **Tools** (preview), to check readiness.

## Step 2: Installation errors

| Symptom | Cause (per Learn) | Fix |
|---|---|---|
| Error 0x80070643, failed to install MSI | Installer cannot reach the cloud service | Allow `*.atp.azure.com`, or pass `ProxyUrl` to setup |
| "ApplyInternal failed two way SSL connection" | `SystemDefaultTlsVersions` or `SchUseStrongCrypto` not set to 1, possibly with SSL inspection | Set both to 1 under both .NET Framework registry paths |
| Unexpected token '"/quiet"' in PowerShell | Missing `./` prefix | Run `./"Azure ATP sensor Setup.exe" /quiet ...` |
| Unauthorized operation on Server 2019 with KB5009557 or hardened EventLog permissions | Permission restrictions | Run setup with `psexec -s -i`, or as a scheduled task under LocalSystem |
| NTE_BAD_ALGID certificate error | A certificate client blocks self-signed certificate creation | Uninstall the client, install the sensor, reinstall the client |

Installation logs are in the installing user's temp directory.

## Step 3: Sensor service will not start

**gMSA password retrieval.** A log line saying the sensor failed to retrieve the group managed service account password usually means the domain controller lacks rights.

```powershell
Get-ADServiceAccount mdiSvc01 -Properties PrincipalsAllowedToRetrieveManagedPassword
Set-ADServiceAccount mdiSvc01 -PrincipalsAllowedToRetrieveManagedPassword $group
```

Learn recommends a security group that contains the domain controllers and the Entra Connect, AD FS and AD CS servers. If the account was already added, reboot or run `klist -li 0x3e7 purge` from an administrator prompt. A second cause is Secure Time Seeding setting `PasswordLastSet` to a future date. Learn suggests creating a new gMSA as an interim fix and opening a support request.

**Other start-up causes from Learn:**

- Access to the registry key `Global` denied. Add the gMSA to **Performance Log Users**.
- Service stuck in Starting with an access-denied error for Lsa. `NT Service\All Services` needs the right to log on as a service.
- If **Log on as a service** is set by policy on the domain controller, the gMSA needs it too.

**Event logs.** If you see few or no alerts but no health issue, and the log says the handle is invalid, a DACL may block Local Service from the Security log. Learn gives the entry to append and the check `wevtutil.exe gl security`.

## Step 4: Proxy and certificate failures

- **LicenseInvalid at registration.** A proxy answering 401 or 403 instead of 407 is read as a licensing error. Let the sensor reach `*.atp.azure.com` without proxy authentication.
- **"The sensor failed to connect to service."** Required trusted root certificates may be missing. Learn names the DigiCert Global Root G2 for commercial clouds and gives a check and an `Import-Certificate` command. Use the thumbprints from the page itself.
- **Port 443 or localhost blocked.** Learn lists a communication error that is fixed by unblocking localhost and TCP 443.

## Step 5: Read the health issues

The Defender portal lists health issues. The most relevant ones:

| Health issue | Meaning | Resolution |
|---|---|---|
| Sensor stopped communicating | No communication for the default 5 minutes | Check routers and firewalls between sensor and cloud service |
| Sensor service failed to start | Not started for at least 30 minutes | Read the sensor logs |
| Directory services user credentials are incorrect | LDAP queries from the sensor fail | Verify username, password and domain, or the gMSA setup |
| A domain controller is unreachable by a sensor | Limited functionality due to connectivity | Check domain controllers and LDAP access, and a Directory Service account per forest |
| Some network traffic could not be analyzed | More traffic than the sensor can process | Add processors and memory, and check LSO and TSO on VMware |

Several auditing health issues are validated once a day. For v3 sensors, alerts can persist after manual auditing setup. Learn says to enable **Automatic Windows auditing configuration** under **Settings** > **Advanced features**.

## Common mistakes

- Skipping the gMSA group membership and rebooting nothing afterwards.
- Allowing the proxy only for the installer and not for the running service.
- Deploying v2.x on a Server 2019 or later domain controller when v3.x is recommended.
- Ignoring clock drift between servers.

## Related

- [Defender for Identity](https://www.m365.fm/entity/defender-for-identity/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Defender for Identity known issues and troubleshooting](https://learn.microsoft.com/en-us/defender-for-identity/troubleshooting-known-issues)
- [Defender for Identity health issues](https://learn.microsoft.com/en-us/defender-for-identity/health-alerts)
- [Sensor v2.x prerequisites](https://learn.microsoft.com/en-us/defender-for-identity/deploy/prerequisites-sensor-version-2)
- [Defender for Identity prerequisites](https://learn.microsoft.com/en-us/defender-for-identity/deploy/prerequisites)
