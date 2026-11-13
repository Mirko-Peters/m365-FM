---
title: "SPMT and Migration Manager Errors: An Endpoint, Disk Space and Scan Checklist"
summary: "SPMT reports missing disk space, or the Migration Manager agent says Connected but cannot scan? Check the required endpoints, the local working folder, the target storage and the agent settings in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, sharepoint-migration, tenant-to-tenant-migration]
keypoints:
  - "Allow the full endpoint lists from Microsoft Learn, including api.office.com for SPMT and the scan endpoints for Migration Manager, by host name and not by IP address."
  - "A firewall that rejects an entry with https:// in it may need just the host name in an FQDN object, as reported in a thread that marked this as the solution."
  - "SPMT disk space errors that Learn documents point to the local working folder, so check free space on the migration computer first, then the storage of the target site."
  - "'Cannot scan' with a connected agent had no confirmed fix in the threads. One asker had a support case that Microsoft treated as a known issue."
  - "Keep the failure report, the exact error code and the time (UTC) ready, because most threads ended with 'open a support case'."
faq:
  - q: "Is api.office.com still required for the SharePoint Migration Tool?"
    a: "The SPMT prerequisites page on Microsoft Learn (last updated August 2026) still lists https://api.office.com as an endpoint for Microsoft 365 APIs for content move and validation. A reply marked as the solution in a community thread says the same and advises allowing it by FQDN over TCP 443."
  - q: "What does 'There isn't enough disk space in the target site collection' mean in SPMT?"
    a: "The Learn SPMT troubleshooting page lists disk space errors for the local working folder (for example error 0x02040012, temporary storage too low) but does not list that exact target-site wording. In the thread, one reply blamed the local temp storage and another suggested checking the destination site and tenant storage. Check both."
  - q: "Why does the Migration Manager agent show Connected but Cannot scan?"
    a: "Learn does not list a 'Cannot scan' item in its Migration Manager troubleshooting page. It does list the scan endpoints the agent must reach. In one 2026 thread the asker saw failed SSL requests to Microsoft migration endpoints and had a support case that was described as a known issue, so the cause may be on the service side."
  - q: "Which folder do I need to keep closed during an SPMT migration?"
    a: "Learn mentions the SPMT working folder %appdata%\\Microsoft\\MigrationToolStorage. Several errors on the Learn troubleshooting page say that its files and folders must stay closed while a migration runs."
---

A file share or on-premises SharePoint migration runs well for weeks. Then a library fails with a disk space message, a firewall refuses an endpoint, or the Migration Manager agent stays "Connected" and refuses to scan. Four Microsoft community threads from late 2025 to late 2026 show these cases. Only one of them has a reply marked as the solution, so this article combines them with the current Learn pages. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- **Endpoint:** The firewall of an SPMT computer rejects `https://api.office.com` as an invalid entry. The poster had read that the API was deprecated, yet the SPMT prerequisites page still lists it (August 2026).
- **Disk space:** A migration from SharePoint 2019 to SharePoint Online fails for two libraries with "There isn't enough disk space in the target site collection" and "Not all the items in the package have been migrated". The poster says the destination has plenty of space (August 2026).
- **Cannot scan:** A Migration Manager agent shows Connected but "Cannot scan". Migrations had worked until mid-September. Reinstalling the agent did not help, and the asker saw failed SSL requests to the Microsoft migration endpoints (October 2026).
- **Certificate sign-in:** After reinstalling the agent with certificate-based authentication, **Add Source Path** on the scan tab is greyed out and the agent log repeats `token_not_found` (November 2025).

## Step 1: Check the endpoints

Both tools only make outbound HTTPS calls. According to Learn, the Migration Manager agent sends requests to the endpoints and never receives calls from them.

For SPMT, the Learn prerequisites page lists, among others:

- Authentication: `login.microsoftonline.com`, `login.windows.net`, `aadcdn.msftauth.net`, `aadcdn.msauth.net`, `secure.aadcdn.microsoftonline-p.com`
- Content move and validation APIs: `api.office.com` and `graph.windows.net`
- Azure migration queues and storage: `*.queue.core.windows.net` and `*.blob.core.windows.net`
- Destination: `*.sharepoint.com`
- Graph for tenant and site information: `graph.microsoft.com`

For Migration Manager, the Learn prerequisites page adds scan-related endpoints, for example `api.mmp.svc.cloud.microsoft`, `odyssey.mmp.svc.cloud.microsoft`, `api.prod.migrations.microsoft.com`, `odyssey.prod.migrations.microsoft.com` and several SignalR hosts. Always copy the current list from the page, because it changes. The page also mentions a SignalR host that is not in its table, so read the text around the table.

The reply marked as the solution in the `api.office.com` thread gives this advice:

1. Do not treat the firewall's rejection as proof that the endpoint is unneeded.
2. Allow the host name over TCP 443 from the migration computer, and use DNS-based rules, not IP addresses.
3. If the firewall field rejects the entry, enter only the host name in an FQDN object. The `https://` prefix may be what the field refuses. This part is advice from the thread, not from Learn.
4. Test name resolution and an outbound TLS connection from the migration computer, then run the scan again.

A quick test from the migration computer:

```powershell
Test-NetConnection api.office.com -Port 443
Test-NetConnection odyssey.prod.migrations.microsoft.com -Port 443
```

A wildcard such as `*.blob.core.windows.net` cannot be tested as written. Test a real host name from your tenant instead. A reply in the "Cannot scan" thread also asks you to rule out proxy, firewall, SSL inspection or certificate changes between the agent and these hosts. I did not see SSL inspection mentioned on the two prerequisites pages, so treat that point as a community suggestion.

## Step 2: Check free space on the migration computer

For SPMT, Learn's troubleshooting page documents these errors:

- "Scan File Failure: Not enough disk space to pack the file": the disk space for the migration working folder is too small for the size of the source file. Enlarge the working folder and try again.
- Error 0x02040012: the temporary storage on the local computer is too low, because SPMT caches the package in the working folder. Expand the temporary storage and retry.

Learn recommends 150 GB of free local storage for the computer that runs SPMT, in both the recommended and the minimum hardware profile. Check the system drive and the drive of your working folder. The working folder `%appdata%\Microsoft\MigrationToolStorage` is mentioned on the troubleshooting page, and several errors there say its files and folders must stay closed during a migration.

In the SharePoint 2019 thread, a reply from a community member with an MVP title said the message most likely points to local temporary storage, not to SharePoint Online limits. The Learn page lists the local errors above, and it does not list the exact "target site collection" wording. So the local check is the best-supported first step.

## Step 3: Check the target site and tenant storage

Another reply in the same thread said the second message, "Not all the items in the package have been migrated", is probably a side effect of the first error. It suggested checking the storage limit of the destination site (in the SharePoint admin center under **Active sites**), the total tenant storage, and old versions and recycle bin content. That reply and the other one were not marked as a solution, and the poster did not report a result.

If the target is full, the companion article on SharePoint storage that stays full after deleting files explains what counts against the quota and how to read the numbers. The short version: reports can lag by up to 48 hours, and in Manual storage mode each site has its own limit.

For the "not all items migrated" part, the Learn troubleshooting page lists error 0x01710009 ("Errors or time-out for Server Processing the file: Not all the items in the package are migrated") and a second variant that says to restart the migration. For missing dependencies on list items (error 0x01410010), check `FailureSummaryReport.csv` and make sure the dependencies are in the migration scope. The thread also suggests retrying one failed library in smaller batches, then running an incremental migration to catch missing items. That is a community suggestion.

## Step 4: Check the Migration Manager agent

Learn's Migration Manager troubleshooting page covers a few agent cases that are not "Cannot scan" but look similar:

- **Agent disconnected:** possible causes include network health on the agent computer, a password change or similar critical change to the tenant admin account (all agents must then be reinstalled), a failed auto-upgrade, and token expiry.
- **Scan stays Queued:** only agents in the **Default** agent group can be scheduled. If no agent is in that group, change the agent's group to **Default**.
- **Failure to submit a job (0x01610002):** the page recommends antivirus exceptions for `microsoft.sharepoint.migration.clientservice.exe` and `microsoft.sharepoint.migration.mthost.exe`.

In the "Cannot scan" thread, one reply listed Microsoft's agent setup steps and asked whether all shares or only some are affected. An automatically generated answer in the same thread suggested editing an agent configuration file. Such answers are not evidence, and I found nothing like it in the Learn pages, so do not apply that change without a statement from Microsoft. The asker wrote that Microsoft Support treated the case as a known issue under investigation. If your symptoms match, go to support early.

## Step 5: Certificate sign-in for the agent

The certificate thread has no confirmed fix. A Microsoft staff reply pointed to a missing or incomplete certificate configuration file as the reason for `token_not_found`, and asked to check the app permissions. The asker then reported that endpoint tests and the admin URL were fine, and the problem stayed. The thread ended with advice to contact support. I could not confirm the file format or permissions in the Learn pages I read, so use the official Migration Manager setup page for certificate authentication and do not rely on the thread.

## Step 6: Collect evidence

Learn names these log locations for Migration Manager: `%AppData%\Microsoft\SPMigration\Logs` for failed tasks, and the `Migration\MigrationTool[tenant_site]` folder under `%AppData%\Microsoft\SPMigration\Logs` for the task report of a completed task (or under your custom working folder). Sort the subfolders by modified time and open the one closest to the task start. The SPMT page does not list its own log folders, so open the failed task and choose **View report** (as one reply suggests). Note the first failed item, the error code, the correlation ID and the time in UTC, and add the destination site URL.

## Limits and open points

- Only the endpoint question has a marked solution, and even there the asker wrote no confirmation.
- The disk space, "Cannot scan" and certificate threads are unresolved. Treat the steps for them as a checklist for narrowing the problem.
- The Migration Manager prerequisites page shows a visible update date of July 2025. Compare it with what the portal asks for today.

## Related

- [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/)
- [Tenant-to-tenant migration](https://www.m365.fm/entity/tenant-to-tenant-migration/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: SPMT prerequisites and required endpoints](https://learn.microsoft.com/en-us/sharepointmigration/spmt-prerequisites)
- [Microsoft Learn: Troubleshooting common SPMT issues](https://learn.microsoft.com/en-us/sharepointmigration/troubleshooting-common-spmt-issues)
- [Microsoft Learn: Migration Manager prerequisites and endpoints](https://learn.microsoft.com/en-us/sharepointmigration/mm-prerequisites)
- [Microsoft Learn: Troubleshoot Migration Manager file migrations](https://learn.microsoft.com/en-us/sharepointmigration/mm-troubleshoot)
- [Microsoft Community Hub: SharePoint Migration Tool issue (August 2026)](https://techcommunity.microsoft.com/discussions/sharepoint_general/sharepoint-migration-tool-issue/4548708)
- [Microsoft Community Hub: SPMT Error help (August 2026)](https://techcommunity.microsoft.com/discussions/microsoft-365/spmt-error-help/4544772)
- [Microsoft Q&A: Microsoft 365 Migration - Cannot Scan (October 2026)](https://learn.microsoft.com/en-gb/answers/questions/6027735/microsoft-365-migration-cannot-scan)
- [Microsoft Q&A: Migration Manager (Certificate Authentication) Add Source Path greyed out (November 2025)](https://learn.microsoft.com/en-sg/answers/questions/5608599/sharepoint-migration-manager-certificate-authentic)
