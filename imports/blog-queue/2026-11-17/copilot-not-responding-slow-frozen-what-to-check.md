---
title: "Copilot Not Responding, Slow or Frozen: What to Check"
summary: "Microsoft 365 Copilot opens but never answers, stays on processing or feels slow? Work through the checks Microsoft documents: license, WebSocket access, proxy timeouts, cookies and the connectivity tests."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [copilot, copilot-chat, microsoft-365-apps]
keypoints:
  - "When Copilot Chat opens but never answers, Microsoft names blocked WebSocket Secure traffic, TLS inspection and aggressive proxy timeouts as the common network causes."
  - "Allow the whole *.cloud.microsoft domain. Microsoft does not support allowing only selected URLs inside it."
  - "WSS must work to *.office.com, *.cloud.microsoft and copilot.cloud.microsoft."
  - "The Copilot connectivity test and the Microsoft 365 network connectivity test show whether WebSocket and latency are the problem."
  - "The Microsoft pages read here do not document a 'High traffic' message for Microsoft 365 Copilot. Treat it as a symptom and check license and network first."
faq:
  - q: "Why is Copilot not responding even though it opens?"
    a: "According to Microsoft Learn's requirements page, failures of this kind are commonly caused by a network perimeter that blocks WebSocket Secure (WSS), by TLS inspection that interferes with the connection, or by a proxy with aggressive connection timeouts. The page asks you to verify WSS to *.office.com, *.cloud.microsoft and copilot.cloud.microsoft."
  - q: "Does Microsoft document a 'High traffic' message for Copilot?"
    a: "The Microsoft Learn and Microsoft Support pages read for this article do not describe a message with that exact wording for Microsoft 365 Copilot. They describe messages such as 'Something went wrong. Let's try again.' and license errors. If you see a busy or traffic message, note the exact text and time and include it in a support request."
  - q: "What latency makes Copilot feel slow?"
    a: "Microsoft Learn's page on the Microsoft 365 network connectivity test says that average latency to Copilot endpoints above 250 ms may cause a slower Copilot experience. The test also checks HTTP connectivity and WebSocket enablement."
  - q: "Could a license problem look like a frozen Copilot?"
    a: "Yes, in some cases. Microsoft Learn lists a newly assigned license that has not propagated, a mix of personal and work accounts, device-based licensing and an unsupported update channel among the causes of Copilot not working in Microsoft 365 apps. Check the license before you change network settings."
  - q: "Who should run the network checks?"
    a: "Usually the people who manage the proxy, firewall or secure web gateway. The causes Microsoft names (blocked WSS, TLS inspection, proxy timeouts) sit in the network path and not on the user's device. This is an inference from the listed causes, not a statement on the requirements page."
---

Copilot that opens but never answers is usually a network or license problem, not a broken app. Microsoft's requirements page names three common network causes: blocked WebSocket Secure (WSS) traffic, TLS inspection that interferes with the connection, and proxies with aggressive timeouts. Check the license first, then the network, then run Microsoft's connectivity tests to confirm.

One note on the wording in the title. The Microsoft pages read for this article do not describe a "High traffic" message for Microsoft 365 Copilot. Messages that Microsoft does document include "Something went wrong. Let's try again." and the license error "Couldn't update license" with error code 29. This guide therefore treats "slow", "frozen" and "busy" as symptoms and follows the causes Microsoft lists. For the license and button side of the problem, the existing checklist on Copilot not working in Microsoft 365 apps covers that ground.

## Step 1: Rule out the account and license

Microsoft Learn lists these causes of Copilot not working in Microsoft 365 apps, in this order:

1. A newly assigned license that has not propagated yet.
2. Being signed in with both a personal account and a work or school account.
3. Internet connectivity that does not meet the network requirements.
4. A recent Office reset or update that affected activation.
5. Device-based licensing, which Copilot does not support for Microsoft 365 Apps.
6. Semi-Annual Enterprise Channel. Current Channel or Monthly Enterprise Channel is required.
7. Privacy settings that block connected experiences.

Copilot Chat needs an eligible Microsoft 365 subscription and no Copilot license. Copilot in Word, Excel, PowerPoint and Outlook needs a Copilot license plus a qualifying base license. All users need a work or school account in Microsoft Entra ID. Admins can validate a user with the Copilot License Details diagnostic that Microsoft links from the requirements page.

## Step 2: Try the web and a clean session

A community answer in a Microsoft Q&A thread about an unresponsive Copilot suggests signing in at office.com to confirm access, then clearing the browser cache or trying a private window. That is a community suggestion, not Microsoft documentation, but it is a cheap test. If Copilot works in a private window and not in the normal one, the problem sits in the browser profile and not in the tenant.

## Step 3: Check the network path

This is where most "opens but does not answer" cases end up. According to the Learn requirements page:

- Allow the worldwide Microsoft 365 URLs and IP address ranges and the Microsoft Copilot endpoints.
- Allow the entire `*.cloud.microsoft` domain. Microsoft states that allowing only selected application URLs inside that domain is not supported.
- If you block `copilot.cloud.microsoft` to prevent personal Microsoft account sign-in, the requirements page suggests using tenant restrictions instead.
- Verify full WSS connectivity from user devices to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft`.
- Look for TLS inspection and proxy timeouts that cut the connection.

A real-world example from Microsoft Q&A shows how this looks. An administrator reported that Copilot Chat opened but responses stayed in a processing state on the corporate network only, while Copilot in Excel worked. The asker found that response traffic went to `substrate.svc.cloud.microsoft`, which the corporate proxy configuration did not classify. Adding that host to the client proxy bypass restored Copilot. A Microsoft Q&A moderator said they could not officially confirm backend endpoints or network requirements and recommended a support ticket. Treat this as one reported case, not as a documented requirement.

## Step 4: Run the connectivity tests

Microsoft provides two relevant tools.

**Copilot connectivity troubleshooter (client).** On Windows, open the Get Help app, search for "Copilot connectivity troubleshooter" and follow the steps. Microsoft says it checks for firewall rules and other things that could block the connection. See the separate guide on running it and reading the results.

**Microsoft 365 network connectivity test (network).** Open `connectivity.m365.cloud.microsoft`, sign in and select **Run test**. Microsoft documents three Copilot tests: **Microsoft Copilot HTTP Connectivity**, **Microsoft Copilot Web Socket Enablement** and **Microsoft Copilot Latency**. A passing WebSocket test shows a green tick and a blocked connection shows a warning. Latency above 250 ms may cause a slower Copilot experience, and Microsoft says to make sure WebSocket support is enabled.

## Step 5: Check cookies and browser

For Word, Excel and PowerPoint on the web, third-party cookies must be enabled for Copilot to work. When a user opens a link in a Copilot Chat response, Copilot checks it with Safe Links, which needs third-party cookies for `*.safelinks.protection.outlook.com`. If those are blocked, users see "Unable to verify link". Microsoft lists Edge, Chrome, Firefox and Safari as supported browsers for Microsoft 365 web experiences.

## Step 6: Check the client side for desktop apps

Microsoft's requirements page lists these for desktop apps:

- The Office Feature Updates task must run on schedule and reach the network resources Copilot needs.
- On Windows, Windows 11 version 22H2 or later and EdgeUpdate version 1.3.253.25 or later.
- Privacy controls for connected experiences can affect Copilot features, so review them.

## What to collect before you open a ticket

In the Q&A thread, a Microsoft moderator recommended a support request in the Microsoft 365 admin center under **Support** > **Help & support**. The thread suggests collecting:

- The exact message and the time it appeared.
- Whether the problem occurs on every network or only the corporate one.
- Results of the Copilot connectivity tests.
- Whether only some apps are affected. In the case above, Excel worked while Word and Chat did not.
- Which proxy or firewall sits in the path and whether it inspects TLS.

## What the sources do not say

The pages read here do not give a fixed waiting time for new licenses, do not describe a service-health check as a step, and do not define a "High traffic" message for Microsoft 365 Copilot. If a source elsewhere states an exact number or message text, check it against Microsoft Learn before relying on it.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-requirements)
- [Microsoft Learn: Copilot is missing, disabled, or doesn't work correctly](https://learn.microsoft.com/en-us/office/troubleshoot/copilot/copilot-missing-disabled-not-work-correctly)
- [Microsoft Learn: Microsoft 365 network connectivity test tool](https://learn.microsoft.com/en-us/microsoft-365/enterprise/office-365-network-mac-perf-onboarding-tool)
- [Microsoft Support: Copilot troubleshooters](https://support.microsoft.com/en-us/support/get-help/copilot-troubleshooters)
- [Microsoft Q&A: Microsoft 365 Copilot Chat / Word Copilot does not generate responses from corporate network](https://learn.microsoft.com/en-us/answers/questions/5933657/microsoft-365-copilot-chat-word-copilot-does-not-g)
- [Microsoft Q&A: M365 Copilot is not responding](https://learn.microsoft.com/en-us/answers/questions/5794354/m365-copilot-is-not-responding)
