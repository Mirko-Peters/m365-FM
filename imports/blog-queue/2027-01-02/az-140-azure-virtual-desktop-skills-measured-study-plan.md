---
title: "AZ-140 Azure Virtual Desktop Specialty: Skills Measured and Study Plan"
summary: "AZ-140 Configuring and Operating Microsoft Azure Virtual Desktop: skills measured as of July 20, 2026 with weights, what changed, audience profile and a study plan built on the outline."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [az-140, azure-virtual-desktop]
keypoints:
  - "The study guide lists skills measured as of July 20, 2026 in four areas weighted 40-45%, 15-20%, 20-25% and 10-15%."
  - "Infrastructure is the largest area at 40-45%: networking, storage for FSLogix, host pools, session hosts and images."
  - "The July 2026 outline names RDP Multipath, Azure Local administrators in the audience and Trusted Launch and confidential VMs for session hosts."
  - "Identity and security covers Entra Conditional Access, Microsoft Entra single sign-on, Defender for Cloud, Defender for Endpoint and App Control for Business."
  - "This article covers the outline only. It contains no exam questions, and a score of 700 or greater is required to pass."
faq:
  - q: "What are the AZ-140 skills measured areas and weights?"
    a: "According to the Microsoft Learn study guide, as of July 20, 2026: Plan and implement an Azure Virtual Desktop infrastructure (40-45%), Plan and implement identity and security (15-20%), Plan and implement user environments and apps (20-25%) and Monitor and maintain an Azure Virtual Desktop infrastructure (10-15%)."
  - q: "What changed on July 20, 2026?"
    a: "The change log on the study guide marks the audience profile, Plan and implement identity integration, Plan and implement security, Plan and implement FSLogix, Plan and implement user experience and client settings, and Install and configure apps on a session host as minor changes."
  - q: "Who is the exam written for?"
    a: "Microsoft Learn describes a server or desktop administrator with subject matter expertise in designing, implementing, managing and maintaining Azure Virtual Desktop experiences and remote apps for any device."
  - q: "What score is needed to pass?"
    a: "The study guide links to the exam scoring page and states that a score of 700 or greater is required to pass."
  - q: "Are practice resources available?"
    a: "Yes. The study guide links to a free Practice Assessment, the exam sandbox, learning paths and instructor-led courses, and FSLogix configuration examples."
---

AZ-140, Configuring and Operating Microsoft Azure Virtual Desktop, measures whether you can design, implement, manage and maintain Azure Virtual Desktop. The skills measured on Microsoft Learn are dated July 20, 2026 and fall into four areas. Infrastructure carries the most weight at 40-45%. This article walks through the outline and builds a study plan from it. It covers the outline only and has no exam questions.

## Who the exam is for

Learn describes a server or desktop administrator with subject matter expertise in designing, implementing, managing and maintaining Azure Virtual Desktop experiences and remote apps for any device. You work closely with Azure administrators, Azure architects, Microsoft 365 administrators, Azure security engineers and Azure Local administrators. Learn expects experience with Azure compute, networking, identity, storage and resiliency, and the use of the Azure portal, templates, scripting and command-line tools.

## Skills at a glance

| Area | Weight |
| --- | --- |
| Plan and implement an Azure Virtual Desktop infrastructure | 40-45% |
| Plan and implement identity and security | 15-20% |
| Plan and implement user environments and apps | 20-25% |
| Monitor and maintain an Azure Virtual Desktop infrastructure | 10-15% |

Learn notes that the bullets illustrate how skills are assessed, that related topics may be covered, and that commonly used preview features can appear on the exam.

## Area 1: Infrastructure (40-45%)

- **Networking:** capacity and speed assessment, session host network design, RDP Shortpath, RDP Multipath and quality of service policies, Azure Private Link, and connectivity monitoring.
- **Storage for user data:** planning, FSLogix storage, storage accounts, file shares and Azure NetApp Files.
- **Plan host pools and session hosts:** resource groups, subscriptions and management groups, OS choice, licensing model, host pool architecture, performance and VM capacity.
- **Implement host pools and session hosts:** the Azure portal, automation with PowerShell, Azure CLI, ARM templates and Bicep, host pool settings, and licensing including Windows client access and RDS CAL requirements for Windows Server.
- **Session host images:** manual images, Azure VM Image Builder, modification, lifecycle management, updates, custom images and Azure Compute Gallery.

## Area 2: Identity and security (15-20%)

- **Identity integration:** choosing among AD DS, Microsoft Entra ID and Microsoft Entra Domain Services, session host requirements, Azure RBAC, Conditional Access, authentication options including passwordless, smart card and MFA, rights on session hosts and Microsoft Entra single sign-on.
- **Security:** Microsoft Defender for Cloud, Defender Antivirus, Defender for Endpoint including onboarding and scanning, network security with UDRs, NSGs and Azure Firewall, Azure Bastion or just-in-time access, Windows threat protection such as App Control for Business and Controlled Folder Access, and Azure confidential VMs and Trusted Launch.

## Area 3: User environments and apps (20-25%)

- **FSLogix:** configuration recommendations, Profile Containers, ODFC containers, Cloud Cache and application masking.
- **User experience and client settings:** choosing and deploying a client, device and multimedia redirection, printing and Universal Print, settings through Intune or Group Policy, RDP properties, session timeouts, Start VM on Connect and personal desktop assignment.
- **Apps on a session host:** deployment methods, application groups, RemoteApp, Microsoft 365 Apps, OneDrive including multisession, Teams including the Remote Desktop WebRTC Redirector Service, browsers, and App attach with application packages.

## Area 4: Monitor and maintain (10-15%)

- **Monitoring:** log collection, Azure Monitor, customizing Azure Monitor workbooks for Azure Virtual Desktop Insights, capacity and performance, autoscaling and managing active sessions.
- **Updates, backup and disaster recovery:** update strategy, disaster recovery, multi-region planning, backup strategy, and backup and restore for FSLogix profiles, personal desktops and images.

## What changed on July 20, 2026

Every changed row in the change log is labelled minor: the audience profile, identity integration, security, FSLogix, user experience and client settings, and apps on a session host. The top-level labels for identity and security and for user environments and apps read no change. My suggestion: if you studied from the older outline, review those six items first.

## A study plan built on the weights

1. **Weeks 1-3: infrastructure.** Build a host pool in a test subscription. Practice networking, FSLogix storage on Azure Files, and image creation with Azure VM Image Builder.
2. **Week 4: identity and security.** Configure Conditional Access and Microsoft Entra single sign-on for a host pool, and review Defender settings on session hosts.
3. **Weeks 5-6: user environments.** Configure FSLogix profile containers and Cloud Cache, publish a RemoteApp and try App attach.
4. **Week 7: monitoring and recovery.** Set up Azure Virtual Desktop Insights, autoscaling and a backup plan.
5. **Final days:** take the free practice assessment and try the exam sandbox. The page says the new Practice Assessment experience on AI Skills Navigator is closer to the exam experience, and that the legacy Practice Assessment on Learn is no longer updated.

This plan is my advice, built on the weights. The week counts are a suggestion, not a Microsoft recommendation.

## Resources named by Microsoft

The study guide points to learning paths and instructor-led courses on the exam page, the Azure and Azure Virtual Desktop documentation, FSLogix configuration examples, Microsoft Q&A, Azure Community Support, Microsoft Learn on the Tech Community and videos. It also says associate, expert and specialty certifications expire annually and can be renewed with a free online assessment.

## Related

- [AZ-140](https://www.m365.fm/entity/az-140/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Study guide for Exam AZ-140: Configuring and Operating Microsoft Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-140)
