---
title: "Automated Investigation and Response in Defender XDR: How It Works and What Microsoft Documents About Automation Levels"
summary: "How automated investigation and response (AIR) works in Microsoft Defender XDR: verdicts, remediation actions, pending approvals in the Action center, and what the Learn overview does not say about levels."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [defender, microsoft-defender-for-endpoint]
keypoints:
  - "AIR in Defender XDR mimics the steps a Tier 1 or Tier 2 analyst would take to investigate and remediate threats."
  - "Each piece of evidence gets a verdict: Malicious, Suspicious or No threats found. Remediation actions are then identified."
  - "Depending on configuration, remediation actions are taken automatically or only after the security operations team approves them."
  - "Pending and completed actions are listed in the Action center. View pending actions opens it from the homepage card."
  - "The overview page does not name specific automation levels or give configuration steps. It links to a separate configuration article."
faq:
  - q: "What is automated investigation and response?"
    a: "According to Microsoft Learn, AIR is a capability in Microsoft Defender XDR, also called self-healing, that acts like a virtual analyst. It investigates alerts and takes or recommends remediation across devices, email and content, and identities."
  - q: "What verdicts does an investigation assign?"
    a: "Microsoft Learn says the investigation assigns a verdict to each piece of evidence: Malicious, Suspicious or No threats found. Remediation actions are identified for malicious or suspicious entities."
  - q: "Where do I approve pending remediation actions?"
    a: "Learn says all actions, pending or completed, are listed in the Action center. The Automated investigation and response card on the Defender portal homepage has a View pending actions link that opens it."
  - q: "What are the automation levels?"
    a: "The Learn overview page I read does not name specific automation levels. It says only that, depending on configuration, remediation actions are either taken automatically or taken only upon approval. The page points to a separate configuration article for configuring AIR, which this article did not read."
  - q: "Does every alert start an investigation?"
    a: "No. Learn notes that not every alert triggers an automated investigation, and not every investigation results in automated remediation. Both depend on how AIR is configured for your organization."
---

Automated investigation and response, or AIR, is the part of Microsoft Defender XDR that investigates alerts like a virtual analyst and either remediates or recommends remediation. Whether it acts on its own or waits for approval depends on how it is configured. The Learn overview explains the flow but does not list the automation level names, so this article covers what is documented and points to the part you must check in your own portal.

## What AIR does

Microsoft Learn describes AIR as the self-healing capability of Defender XDR. It mimics what a Tier 1 or Tier 2 security operations analyst would do. It works across devices, email and content, and identities. In each investigation it:

1. Determines whether a threat requires action.
2. Takes, or recommends, the necessary remediation.
3. Determines whether and what other investigations should occur.
4. Repeats the process for other alerts.

## How an investigation runs

- An alert creates an incident, which can start an automated investigation.
- The investigation assigns a verdict to each piece of evidence: **Malicious**, **Suspicious** or **No threats found**.
- For malicious or suspicious entities, remediation actions are identified. Learn gives examples: sending a file to quarantine, stopping a process, isolating a device and blocking a URL.
- Related alerts that arise during the investigation are added until it completes.
- If an affected entity appears elsewhere, the investigation expands its scope to include it and repeats the process.

Learn ties the entity types to the services involved:

| Entity | Service |
| --- | --- |
| Devices | Defender for Endpoint |
| On-premises Active Directory users, behavior and activities | Defender for Identity |
| Email content, including messages with files and URLs | Defender for Office 365 |

## Two limits Microsoft states

Not every alert triggers an automated investigation, and not every investigation results in automated remediation. Both depend on how AIR is configured for your organization.

## Automatic or approval-based remediation

The overview says that depending on configuration, remediation actions are either taken automatically or taken only upon approval by the security operations team. It does not name individual automation levels and does not say which actions require approval. The page links to the article *Configure automated investigation and response capabilities in Microsoft Defender XDR* as the place to configure AIR. I did not read that article, so this guide does not describe level names or how to change them.

My advice: check the current state in your own tenant. Open the Action center and look at whether actions arrive as pending or already completed. That is a practical hint about how your organization is configured, not something the page states.

## Find pending actions

1. Open the Microsoft Defender portal at security.microsoft.com.
2. On the homepage, find the **Automated investigation & response** card. It shows the number of available remediation actions, an overview of alerts and the required approval time for each alert.
3. Select **View pending actions** to open the **Action center**.
4. Review each pending action and approve or handle it there.

All actions, pending or completed, appear in the Action center.

## View an investigation

Go to **Incidents**, select an incident, then open the **Investigations** tab. Learn points to a separate article for details and results of an automated investigation.

## How to run your approval process (my advice)

The documentation leaves the operating model to you, so decide it explicitly:

1. Decide who watches the Action center and how often. The card shows the required approval time per alert, so use it to set a response expectation.
2. Agree what a verdict of Suspicious means for your team. Learn lists it as a verdict that can lead to remediation, so reviewers must decide quickly whether to approve.
3. Record approved and rejected actions in your incident notes so repeat patterns are visible.
4. Review the configuration after incidents. If actions stay pending for too long, revisit the configuration article.

These are practical suggestions, not Microsoft recommendations.

## Typical mistakes (my advice)

- Assuming AIR remediates everything automatically. The page says it depends on configuration.
- Not checking the Action center, so pending actions wait.
- Assuming every alert opens an investigation.
- Treating this overview as the configuration guide. It is not.

## Related

- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Automated investigation and response in Microsoft Defender XDR (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/m365d-autoir)
