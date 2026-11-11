---
title: "How long does a SharePoint migration take? How to estimate it"
summary: "How long does a SharePoint migration take? Estimate it from data size, file mix, throttling and project phases, using Microsoft's published throughput figures."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, migration-wave, sharepoint]
keypoints:
  - "Transfer time is only one part of a migration, because assessment, remediation, pilot, cut-over and user onboarding often take longer than the copy itself."
  - "Microsoft's throughput estimates are about 10 TB a day for large light files, 1 TB a day for typical Office files and 250 GB a day for many small files, and they are maximums, not guarantees."
  - "The most common bottleneck is reading the source, so disk, memory, antivirus and network at the source usually decide the pace."
  - "Throttling cannot be turned off, is stricter for background apps on weekday daytime hours, and allows higher throughput in the evening and at weekends."
  - "Plan with a safety factor, run a pilot to measure your own rate, and divide the work into waves so that each wave teaches the next."
faq:
  - q: "How long does it take to migrate 1 TB to SharePoint?"
    a: "Microsoft's estimated maximums are about 1 TB a day for typical Office files and about 250 GB a day for many small files, so one terabyte can take from a day to four days of transfer at best. Real projects add scanning, retries and throttling, so plan more time and measure your own rate in a pilot."
  - q: "Can I turn off throttling to speed up a migration?"
    a: "No. Microsoft states that throttling cannot be turned off, not even through a support ticket. Limits are stricter for background apps during weekday business hours, and throughput is higher in the evenings and at weekends. Schedule large transfers for those times and use parallel tasks against different site collections."
  - q: "Is there a tool that estimates migration time?"
    a: "Microsoft offers a Migration Time Estimator in the SharePoint admin center for cloud migrations from Google Drive, Dropbox, Box and Egnyte. It needs the number of drives, the data size and optionally the file count, and gives a preliminary estimate. For file shares, estimate with your own pilot measurements."
---

How long does a SharePoint migration take? The transfer of the files can take days or weeks, but the whole project usually takes weeks to months, because assessment, clean-up, a pilot, the cut-over and user onboarding add up to more than the copy. This guide is for the migration lead who has to give a date. It explains what drives the speed, which numbers Microsoft publishes, how throttling works, and how to turn a data inventory into a schedule with a safety margin.

## How long does a SharePoint migration take? Two clocks to estimate

A migration has two clocks. The first is the transfer clock: how long the tools need to scan, package, upload and import your data into [SharePoint](https://www.m365.fm/entity/sharepoint/). The second is the project clock: everything people must do around the transfer.

Microsoft's [file share migration guide](https://learn.microsoft.com/en-us/sharepointmigration/fileshare-to-odsp-migration-guide) describes five phases: planning, assessing and remediating, preparing OneDrive and SharePoint, migrating, and onboarding users. Only the fourth is a transfer. A [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) with a short transfer can still take months if the remediation list is long or the owners decide slowly. In practice, migration planning and the decisions of owners often take more time than the copy. Microsoft Learn lists the phases for the same reason.

Give two estimates: one for the transfer in days and one for the project in weeks. People confuse the two, and the second one is the one that matters for the business.

## What decides the transfer speed

Microsoft's article on [migration speed](https://learn.microsoft.com/en-us/sharepointmigration/sharepoint-online-and-onedrive-migration-speed) names the factors:

- **Reading the source is the typical bottleneck.** Disk speed, memory, antivirus scanning and the network between the source and the migration agent decide the pace.
- **File size and count.** Larger files and larger volumes reach higher speeds. Files migrate faster than list items.
- **Packaging.** The tools build packages of at least 250 files per transfer, with a transfer size of at least 100 MB and under 250 MB per package.
- **Parallelism.** You can run parallel tasks against different site collections. Do not queue more than 5,000 jobs at once, and note that more tasks than ten times the agent count do not add speed.

The [Migration Manager performance page](https://learn.microsoft.com/en-us/sharepointmigration/mm-performance) groups the checks into four areas: source read speed, the speed of the migration computer, connectivity to Microsoft 365 and Azure, and following the published guidance. It recommends testing to find the real bottleneck instead of guessing, and running the agent on a fast disk and a fast network connection.

## Throughput figures and throttling

Microsoft publishes estimated maximum throughput for three kinds of content, and states that they are estimates, not guarantees:

- **Light:** large files such as ISO images and video, up to about 10 TB a day.
- **Medium:** Office files of about 1.5 MB and list items, up to about 1 TB a day.
- **Heavy:** many small files of about 50 KB, and list items with many columns, up to about 250 GB a day.

Throttling limits the pace. The same article says that limits for background applications are stricter on weekday daytime hours and that evenings and weekends allow higher throughput. Throttling cannot be turned off, and a support ticket does not change it. If the service is too busy, you may see an HTTP 503 error with the message that the server is too busy. For more than 100 TB, Microsoft describes a special process.

The practical lesson: schedule big transfers for nights and weekends, use parallel tasks across site collections, and expect your effective rate to be lower than the maximum.

## The source changes the timeline

The type of source matters as much as the volume. Microsoft's Migration Manager covers sources such as Box, Dropbox, Google Workspace, Egnyte and file shares, while the SharePoint Migration Tool (SPMT) covers on-premises SharePoint Server 2010, 2013 and 2016, including classic workflows and classic pages. A file share is mostly a copy job. A SharePoint Server environment adds mapping of sites, document libraries, columns and permissions, and custom workflows that must be rebuilt, because Microsoft says classic SharePoint Server workflows should become Power Automate flows. Count the workflows and customizations separately, because they usually take longer than the content. If you plan to migrate to SharePoint Online from an old SharePoint 2013 farm, add time for a clean-up of the sites you no longer need before the first copy.

## Can a migration run without downtime?

Mostly yes, if you plan it that way. Microsoft's pages stress that the content is copied and that the source files are not deleted, so you can run an initial copy while people keep working and then run incremental passes to catch changes. The short outage is the cut-over, when users stop writing to the source and you run the final delta. Microsoft's file share guide recommends a single cut-over for all users, which avoids duplicate copies. Plan this window with the business, and keep it outside month-end and other peaks.

## Use the estimator carefully

Microsoft's [Migration Time Estimator](https://learn.microsoft.com/en-us/sharepointmigration/mm-time-estimator) in the SharePoint admin center asks for the number of drives or users, the total data size in GB and, optionally, the file count. The page says it applies to cloud migrations from Google Drive, Dropbox, Box and Egnyte, calls the result preliminary, and lists reasons why it can be wrong: network conditions, large average file size, source rate limits, file-level permissions, peak hours, costly transfers and SharePoint job processing. It does not publish the formula.

For a file share, build your own estimate from a data inventory and a pilot. The same applies to a file server or a SharePoint Server farm: the estimate of the transfer duration is only as good as your inventory.

## Build your own estimate

1. **Inventory the data** by size and file mix: total size, file count, average file size and the share of small files.
2. **Split it into light, medium and heavy** groups, using Microsoft's categories.
3. **Divide each group by its maximum rate** to get a best-case transfer time.
4. **Apply a safety factor.** Because the rates are maximums, and real tenants see throttling and scan time, plan with half of them at first, which doubles the time. Replace the factor with your measured rate after the pilot.
5. **Add the project phases** around the transfer: migration planning, remediation, a pilot, the cut-over and onboarding to support user adoption. Best practice is to show the business a range, not a single date.
6. **Divide the work into waves.** A [migration wave](https://www.m365.fm/entity/migration-wave/) is a batch that moves together, so that each wave's lessons carry into the next.

## Example: 6 TB file share

This example uses invented numbers. The migration lead has 6 TB in total: 2 TB of large media and installers (light), 3 TB of Office documents (medium) and 1 TB of small files (heavy).

- **Light:** 2 TB ÷ 10 TB per day = 0.2 days.
- **Medium:** 3 TB ÷ 1 TB per day = 3 days.
- **Heavy:** 1 TB = 1,000 GB ÷ 250 GB per day = 4 days.
- **Best case:** 0.2 + 3 + 4 = 7.2 days.
- **With a safety factor of 2:** 7.2 × 2 = 14.4 days, so about 15 working days, which is 3 weeks.

The project clock adds the phases: 2 weeks for assessment and remediation, 1 week for the pilot, 3 weeks for the transfer in waves, 1 week for the final delta copy and cut-over, and 2 weeks for onboarding and support. That makes 2 + 1 + 3 + 1 + 2 = 9 weeks.

If someone asks how long 1 TB takes, the answer depends on the mix: about one day if it is all typical Office files, about four days if it is all small files, and a fraction of a day if it is large media. Note what dominates: the 1 TB of small files needs more time than the 3 TB of Office files. The file mix matters more than the total size. The safety factor of 2 and the phase durations are planning assumptions, not Microsoft figures.

## Where schedules slip

- **Remediation.** Files with long paths, invalid names or blocked types need decisions from owners.
- **Permissions.** Mapping and reviewing access takes longer than copying it.
- **Source reads.** A slow file server or aggressive antivirus slows every wave, and a folder with millions of tiny items is slower than the same volume in large files.
- **Business calendar.** Month-end, audits and holidays limit the cut-over windows.
- **Users.** People who ignore the announcements create work after the cut-over.

## Common mistakes

- **Promising a date from the total size alone.** The mix of file sizes changes the result by days.
- **Planning at the maximum rate.** Microsoft's figures are upper estimates, not commitments.
- **Forgetting the project clock.** The copy is the smaller part of the work.
- **Skipping the pilot.** Without a measured rate, your estimate is a guess.
- **Ignoring errors and data loss checks.** Migration errors and failed items need time, and a successful migration project compares item counts and samples before it closes.
- **Starting every wave at the same time.** Parallel tasks help only when the source and agent can keep up.

## How software can help

Microsoft's tools show scan results and reports, and the Migration Time Estimator helps for supported cloud sources. A spreadsheet with size, file count and file mix per share is usually enough to compute your own estimate. Judge any additional tool by whether it reports the transfer rate per task and the failed items, because those numbers let you correct the plan after each wave.

## Next step

Export the size, file count and file mix of your largest share, and run a one-day pilot to measure your real rate. Then you can give the business an honest answer to how long does a SharePoint migration take in your case.
