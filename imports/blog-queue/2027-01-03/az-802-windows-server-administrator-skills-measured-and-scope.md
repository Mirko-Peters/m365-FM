---
title: "AZ-802 Administering Windows Server: Skills Measured, Audience and What Microsoft Says About Older Exams"
summary: "AZ-802 Administering Windows Server: audience, the seven skills areas with weights from the study guide, and what the Learn pages do and do not say about replacing earlier exams."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [az-802, windows-server]
keypoints:
  - "AZ-802 Administering Windows Server counts toward the Microsoft Certified: Windows Server Administrator Associate certification."
  - "The study guide lists seven skills areas. AD DS is largest at 20-25%, followed by storage and monitoring at 15-20% each."
  - "The Learn exam page lists related exams as none and does not say whether AZ-802 replaces AZ-800 or AZ-801."
  - "Candidates are expected to know Windows Admin Center, Hyper-V, PowerShell, Azure Arc, Azure Monitor, Azure Update Manager and Defender for Cloud."
  - "This article covers the outline only. It has no exam questions, and a score of 700 or greater is required to pass."
faq:
  - q: "Does AZ-802 replace AZ-800 and AZ-801?"
    a: "The Microsoft Learn exam page and study guide read for this article do not say. The exam page lists related exams as none and neither page mentions AZ-800 or AZ-801 or any retirement date. Check the Microsoft Learn certification pages for your current path before you schedule."
  - q: "What are the AZ-802 skills areas and weights?"
    a: "According to the study guide: Deploy and manage AD DS (20-25%), Manage Windows Server instances and workloads in a hybrid environment (10-15%), Manage virtual machines (10-15%), Implement and manage on-premises and hybrid networking (10-15%), Manage storage and file services (15-20%), Secure Windows Server infrastructure (10-15%) and Monitor and troubleshoot Windows Server environments (15-20%)."
  - q: "Which certification does AZ-802 count toward?"
    a: "The exam page says it is part of the requirements for Microsoft Certified: Windows Server Administrator Associate."
  - q: "What is the passing score?"
    a: "The study guide states that a score of 700 or greater is required to pass."
  - q: "How is the exam described for preparation?"
    a: "The exam page names the study guide, the exam sandbox and the course Administer Windows Server (AZ-802T00). The exam is offered in English, according to the page."
---

AZ-802, Administering Windows Server, is for administrators who deploy, implement, manage and troubleshoot Windows Server workloads on-premises, in the cloud or in hybrid setups. It counts toward the Microsoft Certified: Windows Server Administrator Associate certification. The study guide, last updated on 2026-10-19 according to its page, splits the exam into seven areas. The title of this topic asks what it replaces. The Learn pages I read do not answer that, and this article says so openly. It covers the outline only and has no exam questions.

## Who the exam is for

Microsoft Learn describes candidates who deploy, implement, manage and troubleshoot Windows Server as a workload in on-premises, cloud or hybrid environments. They administer identity, security, management, compute, networking, storage and monitoring, and collaborate with architects, administrators and engineers. Learn expects familiarity with Active Directory Domain Services and experience with Windows Admin Center, Hyper-V, PowerShell, Azure Arc, Azure Monitor, Azure Update Manager and Microsoft Defender for Cloud.

## What the pages say about older exams

The exam page lists related exams as none. It does not mention AZ-800 or AZ-801 and gives no retirement date. The study guide has no note about replacing or retiring other exams. So this article makes no claim about replacement. If you hold an older Windows Server Hybrid Administrator credential or plan around retirement dates, check your Microsoft Learn profile and the certification pages, because the pages I read are silent.

## Skills at a glance

| Area | Weight |
| --- | --- |
| Deploy and manage AD DS | 20-25% |
| Manage Windows Server instances and workloads in a hybrid environment | 10-15% |
| Manage virtual machines | 10-15% |
| Implement and manage on-premises and hybrid networking | 10-15% |
| Manage storage and file services | 15-20% |
| Secure Windows Server infrastructure | 10-15% |
| Monitor and troubleshoot Windows Server environments | 15-20% |

## Area details

### Deploy and manage AD DS (20-25%)

Domain controllers locally and in Azure, RODCs and their account security, FSMO roles, domain and forest trusts, sites and replication, users and groups across domains and forests, service accounts, and Group Policy including preferences.

### Hybrid management (10-15%)

Windows Admin Center on-premises and in the Azure portal, PowerShell remoting including double-hop and JEA, SSH and remote desktop, Azure Arc-enabled servers, VM extensions on non-Azure machines, Azure Update Manager and Azure Automation runbooks.

### Virtual machines (10-15%)

Hyper-V topics such as Enhanced Session Mode, PowerShell Direct, nested virtualization, checkpoints, high availability, virtual switches, NIC teaming and Hyper-V Replica. For Azure VMs: storage, resizing and scale sets, availability sets and zones, JIT access and Azure Bastion, and network configuration.

### Networking (10-15%)

DNS integration with AD DS, zones and records, forwarding, hybrid DNS, DNS policies and DNSSEC, plus the DHCP role, scopes, reservations and DHCP high availability, and IP troubleshooting in hybrid environments.

### Storage and file services (15-20%)

Azure Files and Azure File Sync, migrating DFS and file shares to Azure Files, FSRM, DFS, SMB over QUIC, Storage Spaces and Storage Spaces Direct, Storage Replica, Data Deduplication, SMB Direct, Storage QoS, NTFS and ReFS, iSCSI, and BitLocker with encrypted volume recovery.

### Security (10-15%)

OS security such as exploit protection, Application Control, Credential Guard, Defender SmartScreen, OSConfig security baselines, Windows LAPS, Defender for Servers and Windows Firewall. AD DS security such as password policies, Microsoft Entra Password Protection for AD DS, Protected Users, domain controller hardening, delegation and authentication protocols.

### Monitoring and troubleshooting (15-20%)

Performance Monitor, data collector sets, Windows Admin Center monitoring and alerts, System Insights, event logs, Azure Monitor data collection rules and VM Insights. Troubleshooting covers connectivity, name resolution, Windows Update, the Time service, performance, extensions, disk encryption and storage. For AD: restoring objects from the Recycle Bin, Directory Services Restore Mode, SYSVOL recovery, replication, Kerberos and secure channel trust.

## A study plan built on the weights

1. **Weeks 1-2:** AD DS and Group Policy in a lab forest. This is the biggest single area.
2. **Week 3:** hybrid management with Windows Admin Center, Azure Arc and Azure Update Manager.
3. **Week 4:** Hyper-V and Azure VM topics.
4. **Week 5:** DNS and DHCP, including hybrid DNS.
5. **Weeks 6-7:** storage, Azure File Sync, SMB and Storage Spaces Direct.
6. **Week 8:** security baselines, LAPS and AD hardening.
7. **Week 9:** monitoring and troubleshooting, with AD recovery drills.

The week counts are a suggestion, not a Microsoft recommendation.

## Logistics from the exam page

The exam is in English. The page lists no price and says it depends on the country or region where the exam is proctored. It points to the study guide, the exam sandbox and the course AZ-802T00.

## Related

- [AZ-802](https://www.m365.fm/entity/az-802/)
- [Windows Server](https://www.m365.fm/entity/windows-server/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Exam AZ-802: Administering Windows Server (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/exams/az-802/)
- [Study guide for Exam AZ-802 (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-802)
