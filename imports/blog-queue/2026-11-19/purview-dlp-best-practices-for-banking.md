---
title: "Microsoft Purview DLP Policies and Best Practices for Banks and Financial Data"
summary: "How to plan, design, simulate and enforce Microsoft Purview DLP policies for financial data, using Microsoft's own guidance: stakeholders, templates, leakage tolerance, simulation mode and alerts."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [purview, dlp, dlp-simulation-mode]
keypoints:
  - "Microsoft's DLP guidance is not specific to banking. It treats planning as a design exercise built on risk, impact and rollout."
  - "Involve compliance, risk, legal, security, data owners and IT. Write a one-sentence intent statement for each policy before you configure it."
  - "Start from a financial template, such as PCI DSS or a country Financial Data template, and define the confidence level and instance count as your leakage tolerance."
  - "Roll out in stages: keep it off, simulation mode, simulation with policy tips on a pilot group, then turn it on."
  - "DLP alerts stay in the Purview DLP dashboard for 30 days and in the Defender portal for six months. Exchange DLP scans only new email."
faq:
  - q: "What is DLP in Microsoft Purview?"
    a: "According to Microsoft Learn, data loss prevention helps prevent users from inappropriately sharing sensitive data with people who shouldn't have it. Policies identify, monitor and protect sensitive information such as credit card numbers in Exchange, SharePoint, OneDrive, Teams, Office apps, devices and other locations."
  - q: "Which DLP template fits financial data?"
    a: "Microsoft Learn lists several financial templates, among them PCI DSS, which detects credit card numbers, and Financial Data templates for Australia, Canada, France, Germany, Israel, Japan and Saudi Arabia. Each lists its sensitive information types, for example SWIFT Code and bank account numbers. The part of the page I read did not show the U.S. templates."
  - q: "How do I test a DLP policy without blocking users?"
    a: "Microsoft Learn describes simulation mode. On the last step of the policy wizard, select Run the policy in simulation mode. Actions in the policy aren't applied during simulation. You can optionally show policy tips and have the policy turn on automatically if it isn't edited within fifteen days."
  - q: "How long does a DLP policy take to work?"
    a: "Microsoft Learn says policies generally take effect about one hour after they are turned on. Simulation results are kept for 30 days."
  - q: "Does DLP scan old email?"
    a: "Microsoft Learn says that in Exchange only new email messages are scanned, and DLP does not scan or match existing mailbox or archive items. In SharePoint and OneDrive it scans existing and new items."
---
Microsoft does not publish a banking-specific DLP guide. What it does publish is a planning and deployment method that fits regulated organizations: plan with the right stakeholders, design each policy from a written intent statement, test in simulation mode, then enforce in stages. This article follows that method and applies it to financial data. The pages I read do not map DLP to specific banking regulations, so check legal requirements with your compliance team.

## What DLP covers

Microsoft Learn says DLP policies identify, monitor and automatically protect sensitive information across enterprise applications and devices, and in inline web traffic. Locations include Exchange, SharePoint, OneDrive, Teams chat and channel messages, Word, Excel and PowerPoint, Windows 10 and 11 devices and the three most recent macOS versions, and non-Microsoft cloud apps. Detection goes beyond keywords. It uses primary and secondary matches in proximity, regular expressions, internal function validation and machine learning.

A policy has five parts: what to monitor, administrative scoping, where to monitor, the conditions and the action. Conditions and actions live in a rule. Actions vary by location, from blocking external access and showing a tip to restricting copy to a USB drive.

## Step 1: Plan with the right people

Microsoft's planning page lists stakeholders to include: regulatory and compliance officers, the chief risk officer, legal officers, security and compliance officers, business owners of the data, business users and IT. Stakeholders identify the applicable regulations and standards, the categories of sensitive items, the business processes that use them, the risky behavior to limit and the review process for policy matches.

The page names four sensitive information categories: Financial, Medical and health, Privacy and Custom. It also frames the questions to answer: which laws and standards apply, what must be protected, how to scope policies, where the data lives and what your tolerance for leakage is. For a bank, the Learn page uses a fictional Contoso Bank as a highly regulated example. The advice there is to understand the regulations, use the Purview Information Protection stack together with sensitivity labels, deploy in simulation mode, train users and refine.

## Step 2: Design each policy

Microsoft's design guidance says a documented design reaches the goal faster than trial and error. Summarize each policy in one intent statement. The Learn example is a fictitious U.S. organization that wants to detect Office documents with HIPAA health information in OneDrive and SharePoint, protect against sharing in Teams, and restrict sharing with unauthorized third parties. Then map the statement to settings:

| Statement part | Configuration |
|---|---|
| What to detect | Template and sensitive information types |
| Match threshold | Confidence level and instance count, called leakage tolerance |
| Where | Locations, with include and exclude scoping |
| What to do | Restrict access, notify, alert, allow override |

The location you choose decides which sensitive information types, labels and actions are available. The rule builder supports AND, OR and NOT with nested groups, and exceptions are replaced by NOT conditions inside groups. In Office desktop apps, users see policy tips only for rules that use the **Content contains sensitive information** condition.

## Step 3: Choose a financial template

Microsoft Learn lists financial templates, each with its sensitive information types:

| Template | Detects |
|---|---|
| PCI DSS | Credit card number |
| Australia Financial Data | SWIFT code, tax file number, bank account number, credit card number |
| Canada Financial Data | Credit card number, bank account number |
| France and Germany Financial Data | Credit card number, EU debit card number |
| Saudi Arabia Financial Data | Credit card number, SWIFT code, IBAN |

The page also lists Israel and Japan templates. I read only the first part of that long page, so the U.S. financial templates are not covered here. In the part of the page I read, each template rule applies only when content is shared with people outside the organization. Low-count rules use 1 to 9 instances and send a notification. High-count rules use 10 to 500 instances and can block access, allow override, require a business justification and send an incident report.

## Step 4: Deploy in stages

Microsoft Learn describes the policy states: **Keep it off**, **Run the policy in simulation mode**, **Run the policy in simulation mode and show policy tips**, and **Turn it on right away**. The recommended path:

1. Create the policy with **Keep it off** until sign-off.
2. Switch to simulation mode and gather data. The scope can be broad.
3. Tune the policy.
4. Switch to simulation with policy tips and narrow the scope to a pilot group.
5. Collect user feedback and alert data, tune and fix issues.
6. Turn it on, then monitor alerts and Activity explorer.

Microsoft's deployment page describes the actions this way: **Allow** is only available for policies scoped to the Devices location, **Audit only** is the least impactful option for other locations, **Block with override** lets users override with a reason, and **Block** always blocks. For Exchange Online and SharePoint, overrides are configured in the user notification section. Microsoft's training says to balance protection with productivity: decide when to warn instead of block and when overrides should be allowed, since DLP works best when it guides behavior.

## Simulation mode in detail

To simulate, select **Run the policy in simulation mode** on the last step, choose **Turn it on right away** or **Keep it off** for afterwards, and optionally show policy tips or turn the policy on if it isn't edited within fifteen days. Your account needs the Information Protection admin role.

To review results, sign in to the Microsoft Purview portal, go to **Data Loss Prevention** > **Policies**, select a policy marked **In simulation** and choose **View simulation**. The tabs are **Simulation overview**, **Items for review** and **Alerts**. Limits to remember:

- Results are kept for 30 days.
- For SharePoint and OneDrive, **Items for review** shows up to 100 matched items per site per policy rule.
- Exchange, Teams and devices are scanned in real time. SharePoint and OneDrive are scanned on upload and for existing content.

## Alerts and monitoring

DLP can raise alerts when an activity meets a rule, if incident reports are configured. Alerts are available in the Microsoft Purview DLP alerts dashboard for 30 days and in the Microsoft Defender portal for six months. Activity explorer shows the last 30 days of DLP information. All monitored activity is also recorded in the Microsoft 365 audit log.

## Checklist

1. Name stakeholders and the regulations that apply.
2. Write one intent statement per policy.
3. Pick a template and set confidence and instance counts on purpose.
4. Run in simulation without tips, then with tips on a pilot group.
5. Review items, alerts and false positives before enforcement.
6. Train users, then turn the policy on.
7. Review the strategy regularly.

## Common mistakes

- Enforcing before simulation, so business processes break.
- Expecting DLP to match old Exchange mail.
- Choosing a location that doesn't support the labels or actions you need.
- Leaving threshold and instance counts at defaults without a decision.
- Treating the first policy as final instead of tuning it.

## Related

- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Data loss prevention (DLP)](https://www.m365.fm/entity/dlp/)
- [DLP simulation mode](https://www.m365.fm/entity/dlp-simulation-mode/)
- [Endpoint DLP](https://www.m365.fm/entity/endpoint-dlp/)

## Sources

- [Microsoft Learn: Learn about data loss prevention](https://learn.microsoft.com/purview/dlp-learn-about-dlp)
- [Microsoft Learn: Plan for data loss prevention (DLP)](https://learn.microsoft.com/en-us/purview/dlp-overview-plan-for-dlp)
- [Microsoft Learn: Design a DLP policy](https://learn.microsoft.com/en-us/purview/dlp-policy-design)
- [Microsoft Learn: Create and deploy data loss prevention policies](https://learn.microsoft.com/en-us/purview/dlp-create-deploy-policy)
- [Microsoft Learn: Get started with the data loss prevention simulation mode](https://learn.microsoft.com/en-us/purview/dlp-simulation-mode-get-started)
- [Microsoft Learn: What the DLP policy templates include](https://learn.microsoft.com/purview/dlp-policy-templates-include)
- [Microsoft Learn: Plan and design DLP policies (training)](https://learn.microsoft.com/en-us/training/modules/purview-data-loss-prevention-understand-plan/plan-design-policies)
