---
title: "Windows Server 2016 End of Support on January 12, 2027: Options and Migration Paths"
summary: "Windows Server 2016 left support on January 12, 2027. What the lifecycle pages say about the dates and the related components, what end of support means, the upgrade target in Microsoft's blog, and how Extended Security Updates work in general."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [windows-server, extended-security-updates, windows-server-update-services]
keypoints:
  - "Windows Server 2016 reached end of support on January 12, 2027. The lifecycle product page lists the extended end as 1/13/2027 6:59:59 AM PT, which is the same cutoff written in Pacific Time."
  - "The Learn 2027 page lists related items with the same date, such as IIS 10 on Server 2016, Hyper-V Server 2016, WSUS for Server 2016, .NET Framework 4.6.2 and Windows Defender for Server 2016."
  - "After end of support there are no new security updates, no non-security updates, no assisted support options and no online technical content updates."
  - "The Windows IT Pro Blog names Windows Server 2025 as the upgrade target and describes ESU as a temporary option. ESU details for Server 2016 were still pending in that post."
  - "The ESU FAQ describes ESU as a last resort paid option for up to three years, with critical and important security updates only. Its table did not list Server 2016."
faq:
  - q: "When did Windows Server 2016 support end?"
    a: "On January 12, 2027, according to the Learn page on products ending support in 2027 and the Windows IT Pro Blog. The lifecycle product page for Windows Server 2016 shows an extended end date of 1/13/2027 6:59:59 AM in Pacific Time, which is the same cutoff expressed in another form. Mainstream support ended on 1/12/2022. In either form the date has passed."
  - q: "What stopped on that date?"
    a: "The Learn page says upon end of support there are no new security updates, no non-security updates, no free or paid assisted support options and no online technical content updates. The blog says devices receive a final monthly security update on the date."
  - q: "Which other components are affected?"
    a: "The Learn 2027 page lists, with the same January 12, 2027 date, Hyper-V Server 2016, IIS 10 on Windows Server 2016, Windows Defender for Windows Server 2016, WSUS for Windows Server 2016, Windows Storage Server 2016, Windows Azure Pack on Windows Server 2016, HPC Pack 2016 and .NET Framework 4.6.2."
  - q: "What is the upgrade path?"
    a: "The Windows IT Pro Blog names an upgrade to Windows Server 2025 for Windows Server 2016. The lifecycle pages do not describe upgrade paths, so check the Windows Server upgrade documentation for supported paths and application compatibility."
  - q: "Can I buy Extended Security Updates for Server 2016?"
    a: "The Learn ESU FAQ describes the program generally: a last resort paid option for up to three years, with critical and important security updates only and no new features or general support. Its availability table lists Windows Server 2012/R2 and Windows 10, not Windows Server 2016. The blog said pricing and availability for Server 2016 were expected later, so check the current ESU page of Microsoft before you plan around it."
---

Windows Server 2016 passed its end of support on January 12, 2027. For anyone who still runs it, the planning is no longer about a deadline ahead but about the servers that are running without updates today. This article collects what the Microsoft Learn pages and a Microsoft blog post say about the date, the related components, the upgrade target and the Extended Security Updates program, and it says clearly what they do not cover. My own advice is marked.

## The date

Pages differ slightly:

- The Learn page on products ending support in 2027 lists Windows Server 2016 with an end of support date of **January 12, 2027**, under the Fixed Policy.
- The Windows IT Pro Blog post on Windows Server 2016 and the Windows 10 2016 LTSB gives January 12, 2027 as well.
- The lifecycle product page for Windows Server 2016 shows a start date of 10/15/2016, a mainstream end date of 1/12/2022 and an extended end date of **1/13/2027 6:59:59 AM**, with dates shown in Pacific Time. It lists the editions Datacenter, Essentials, MultiPoint Premium and Standard.

The product page and the other two describe the same cutoff in different forms. For planning, treat support as ended on January 12, 2027. That was a short time ago, so the question now is how fast servers move, not whether to move.

## What end of support means

The Learn page says that upon end of support there are no new security updates, no non-security updates, no free or paid assisted support options, and no online technical content updates. The blog adds that devices receive a final monthly security update on the end date.

The product page also notes that containers released with Windows Server 2016 follow the same lifecycle dates.

## Related components with the same date

The Learn 2027 page lists these items with the date January 12, 2027:

- Hyper-V Server 2016
- IIS 10 on Windows Server 2016
- Windows Defender for Windows Server 2016
- Windows Server Update Services (WSUS) for Windows Server 2016
- Windows Storage Server 2016
- Windows Azure Pack on Windows Server 2016
- HPC Pack 2016
- .NET Framework 4.6.2
- System Center Configuration Manager (LTSB 1606), as listed on the page

The page also says HPC Pack 2016 retires in Azure on the same date. Other products from the 2016 generation, such as System Center 2016 products and BizTalk Server 2016, are listed with an earlier date of January 11, 2027. If you run those on top of Server 2016, include them in your inventory. The page itself does not describe upgrade paths, ESU availability or pricing.

## Upgrade target

The Windows IT Pro Blog post names Windows Server 2025 as the upgrade target for Windows Server 2016. The post is from February 2026 and was updated in October 2026, and I did not find newer Microsoft guidance on the page. For supported upgrade paths and application compatibility, use the Windows Server upgrade documentation.

## Extended Security Updates

The Learn ESU FAQ describes the program in general terms:

- It is a last resort paid option for customers who need to run certain legacy products past the end of support. It is a temporary bridge, not a long-term solution.
- It includes critical and important security updates, as defined by the Microsoft Security Response Center, up to three years after the end of extended support.
- It does not extend the lifecycle. It excludes new features, non-security updates requested by customers, and design change requests.
- Technical support is not included. Support for ESU is limited to ESU activation, installation, and problems caused by a security update.
- ESUs for Year 2 and Year 3 require the prior years. Late enrollment means paying for the missed periods.

For Windows Server outside Azure, the FAQ describes two licensing routes: Azure Arc-enabled servers, which it recommends for flexibility, or ESU licenses through commercial licensing. Eligibility requires active Software Assurance, active subscription licenses, or license-included service from a SPLA partner. In Azure, the FAQ says ESUs are free for virtual machines in Azure.

Important limits of what I can tell you:

- The FAQ availability table lists Windows Server 2012/R2 and Windows 10. It does not list Windows Server 2016, and the specific rules, such as pricing and the Azure terms, are written for the products in that table.
- The blog says ESU for Server 2016 is a temporary option if upgrades cannot finish by the end date, and that pricing and availability were expected in the following months. I could not find the final terms.

So for Server 2016, confirm the current ESU terms with Microsoft or your partner before you plan around them. I do not state prices or Azure terms for Server 2016 here.

## Work plan for the servers you still have (my advice)

This is my suggestion, not guidance from the pages:

1. **Inventory.** List every Windows Server 2016 machine, including Hyper-V hosts, IIS servers, WSUS servers and servers with .NET Framework 4.6.2, since they share the date.
2. **Sort by exposure.** Servers that face the internet or hold sensitive data go first. Isolated test machines can wait.
3. **Choose a target per workload.** Upgrade to Windows Server 2025 where the application supports it, rebuild where it is cleaner, or move the workload to a managed service.
4. **Check ESU as a bridge only.** If a workload cannot move yet, ask about the current ESU terms. The FAQ calls it a last resort, so give it an end date.
5. **Reduce risk while you wait.** Limit what the old servers can reach and who can reach them. The pages do not name specific controls, so this is general practice.
6. **Test before the cutover.** Validate the application on the target version, then decommission the old server and remove it from monitoring and update tooling.
7. **Check dependent tools.** If you run WSUS or Configuration Manager on Server 2016, note that those components have the same date.

## Related

- [Windows Server](https://www.m365.fm/entity/windows-server/)
- [Extended Security Updates (ESU)](https://www.m365.fm/entity/extended-security-updates/)
- [Windows Server Update Services (WSUS)](https://www.m365.fm/entity/windows-server-update-services/)

## Sources

- [Windows Server 2016 (Microsoft Learn)](https://learn.microsoft.com/lifecycle/products/windows-server-2016)
- [Ending Support in 2027 (Microsoft Learn)](https://learn.microsoft.com/lifecycle/end-of-support/end-of-support-2027)
- [Product Lifecycle FAQ - Extended Security Updates (Microsoft Learn)](https://learn.microsoft.com/lifecycle/faq/extended-security-updates)
- [Plan for Windows Server 2016 and Windows 10 2016 LTSB end of support (Windows IT Pro Blog)](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/plan-for-windows-server-2016-and-windows-10-2016-ltsb-end-of/ba-p/4496136)
