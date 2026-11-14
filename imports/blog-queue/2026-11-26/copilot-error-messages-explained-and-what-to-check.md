---
title: "Copilot Error Messages Explained: 'Sorry, I Wasn't Able to Respond' and More"
summary: "What common Copilot error messages mean and what to check first: license errors, network and WebSocket blocks, service incidents, Excel file states. Marks which fixes Microsoft documents and which are forum advice."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [copilot, copilot-chat, copilot-governance]
keypoints:
  - "Learn ties 'Couldn't update license', 'Error code: 29' and 'Something went wrong. Let's try again.' to license timing, account mix, network, device licensing, update channel and privacy settings."
  - "'Sorry, I wasn't able to respond to that' has no official explanation in the Learn pages read for this article. Forum cases point to office networks, so check network rules first."
  - "Microsoft's requirements page names three network causes: blocked WebSocket Secure traffic, TLS inspection that interferes, and aggressive proxy timeouts."
  - "A generic 'Something went wrong' can be a service incident. Check Service Health in the Microsoft 365 admin center before changing anything locally."
  - "Excel can refuse edits for file reasons: a file checked out in SharePoint, an unsupported format such as Strict Open XML, or calculation not set to Automatic."
faq:
  - q: "What does 'Sorry, I wasn't able to respond to that' mean in Copilot?"
    a: "The Microsoft Learn pages read for this article do not explain this message. A Microsoft Q&A thread from June 2026 reports it on managed devices on an office network only, with Try again working. The only reply was labeled as an AI answer, so treat its network suggestions as unverified. Microsoft's requirements page does document that blocked WebSocket traffic, interfering TLS inspection or short proxy timeouts can break Copilot."
  - q: "What does 'Couldn't update license' with Error code 29 mean?"
    a: "Microsoft Learn lists it with 'Something went wrong. Let's try again.' as symptoms of Copilot being missing, disabled or not working in Microsoft 365 apps. Listed causes are a newly assigned license, a personal and work account conflict, connectivity, a recent Office reset or update, device-based licensing, Semi-Annual Enterprise Channel and privacy settings for connected experiences."
  - q: "How do I know whether a Copilot error is a Microsoft outage?"
    a: "In a Microsoft Q&A thread, a moderator tied a Copilot Chat 'Something went wrong' error to an incident tracked in the Microsoft 365 admin center Service Health. The advice was to have the admin check Health > Service Health and report the issue there. If an incident exists, local troubleshooting will not fix it."
  - q: "Why does Copilot work in Excel but fail in Word or Copilot Chat on the office network?"
    a: "A June 2026 Microsoft Q&A thread describes exactly this. A moderator suspected WebSocket Secure handling by proxies and firewalls and suggested exempting the Copilot endpoints from inspection. The poster reported that bypassing the proxy for one hostname fixed it, but Microsoft did not confirm a root cause. Open a support ticket for an authoritative answer."
  - q: "Where can I test my network for Copilot?"
    a: "Microsoft's requirements page points to a connectivity test for the Copilot app at connectivity.m365.cloud.microsoft/copilot, and to the broader Microsoft 365 connectivity test tool. It also says to allow the whole *.cloud.microsoft domain, because allowing only selected URLs inside it is not supported."
---

Copilot errors fall into four groups: license and account problems, network problems, service incidents and file problems. The message wording is a weak guide. A generic line such as "Something went wrong" can come from any of them. This article lists the messages people report, what Microsoft documents for each, and which advice only comes from forum threads.

The pages read for this article include no official Microsoft catalog of Copilot error texts. Everything below comes from Microsoft Learn and Support pages, plus Microsoft Q&A and Tech Community threads that are marked as such. A separate checklist covers a missing Copilot button. This one focuses on errors that appear after Copilot loads.

## Quick map of messages

| Message | Most likely group | Best source |
|---|---|---|
| Couldn't update license, Error code: 29 | License or account | Microsoft Learn |
| Something went wrong. Let's try again. | License, account or network | Microsoft Learn |
| Sorry, I wasn't able to respond to that. | Network (reported) | Q&A thread only |
| I'm sorry, I'm having trouble responding to requests right now. | Unclear | Q&A thread only |
| Something went wrong (Copilot Chat) | Service incident (reported) | Q&A moderator |
| Failed to fetch document context due to an internal error | Excel file or service | Tech Community thread |
| Unable to verify link | Browser cookies | Microsoft Learn |

## License and account errors

Microsoft Learn lists these symptoms for Copilot in Microsoft 365 apps: the button missing or grayed out, "Couldn't update license", "Error code: 29", "Something went wrong. Let's try again." and "You can continue using Microsoft 365 and try again. If issues persist, please contact Microsoft support."

The causes, in Microsoft's order:

1. A newly assigned license that has not propagated yet.
2. A licensing or account conflict, such as being signed in with both a personal and a work or school account.
3. Internet connectivity that does not meet the network requirements.
4. A recent Office reset or update that affected activation.
5. Device-based licensing, which Copilot does not support. A user-based license is needed.
6. Semi-Annual Enterprise Channel. Current Channel or Monthly Enterprise Channel is required.
7. Privacy settings that block connected experiences.

The resolution Microsoft gives is to follow its missing-button article, then ask the admin to confirm that the license supports Copilot and that no policy blocks it. The Learn page is archived, so check the current requirements page too.

## Network errors

The Microsoft Copilot requirements page says Copilot integrations can fail in three situations: a network perimeter blocks WebSocket Secure (WSS), a device performs TLS inspection that interferes with the connection, or a proxy enforces aggressive timeouts. What to verify:

- Full WSS connectivity from user devices to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft`.
- The whole `*.cloud.microsoft` domain is allowed. Microsoft does not support allowing only selected URLs inside it.
- URL filtering, proxy rules, firewall rules, tenant restrictions, Conditional Access and app control do not block `copilot.cloud.microsoft`.
- For Word, Excel and PowerPoint for the web, third-party cookies are enabled. If they are blocked for `*.safelinks.protection.outlook.com`, users see "Unable to verify link".

Microsoft's endpoint allow list for the Copilot app also names `config.edge.skype.com` and several sign-in hosts such as `login.microsoftonline.com` and `substrate.office.com`. The page says the list is not exhaustive.

### What the forum threads add

Two Microsoft Q&A threads from June 2026 describe network cases. They are not official guidance.

- "Sorry, I wasn't able to respond to that. Is there something else I can help with?" appeared mostly on first use, on managed devices, only on the office LAN or Wi-Fi, and Try again worked. The only answer was labeled as an AI answer and suggested allowing the Microsoft 365 endpoints and `config.edge.skype.com`. Nobody confirmed a fix.
- In another thread, Copilot worked in Excel but not in Word, Loop or Copilot Chat from the corporate network. A moderator suspected WSS handling and suggested exempting the endpoints from inspection and proxy authentication, with long timeouts for persistent connections. The poster later bypassed the proxy for `substrate.svc.cloud.microsoft` and it worked. The moderator said they could not officially confirm that endpoint and recommended a support ticket.

Treat both as leads for your network team, not as settings to copy.

## Service incidents

For a different "Something went wrong" thread, a moderator linked the error to an ongoing Copilot Chat incident listed in Service Health. Some users could not submit prompts, others saw a good answer replaced by the error. The advice was to have an admin open **Health** > **Service Health** in the Microsoft 365 admin center, monitor the incident and report the issue there. A user later reported the error returning in September 2026, with no resolution recorded.

If many users fail at the same time across networks, check Service Health first.

## Excel-specific errors

Microsoft's Copilot in Excel FAQ describes an "unsupported file state" error. Causes it names:

- A file checked out in SharePoint. Check it in, then close and reopen it, or use Excel for the web.
- A site that requires check-out. Copilot in Excel on Windows or Mac will not work for those files, while Excel for the web does.
- An unsupported format such as Strict Open XML Spreadsheet. Save as Excel Workbook (.xlsx).
- Calculation Options not set to Automatic. The FAQ says Copilot editing works only in Automatic.

A Tech Community thread from a paid Microsoft 365 user reports "Failed to fetch document context due to an internal error" for more than five days, with Copilot saying tasks were done while the workbook stayed unchanged. The only reply was from an MVP, who suggested a modern format (.xlsx, .xlsb or .xlsm) stored in OneDrive or SharePoint with AutoSave on. The Excel FAQ page read for this article does not state an AutoSave requirement, so treat that as unverified. No Microsoft staff answered.

## A sensible order

1. Click Try again once, then restart the app.
2. Check Service Health or ask the admin to.
3. Check the license, account type, update channel and privacy settings.
4. Test on another network, such as a phone hotspot. If it works there, involve the network team.
5. For Excel, check file state, format and calculation mode.
6. Collect the exact message, time, account, build and network, then open a support request.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Learn: Copilot is missing, disabled, or doesn't work correctly (archived)](https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/copilot/copilot-missing-disabled-not-work-correctly)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/copilot/plan/microsoft-copilot-requirements)
- [Microsoft Learn: Add Copilot endpoints to your allow list](https://learn.microsoft.com/en-us/copilot/plan/add-copilot-endpoints-allowlist)
- [Microsoft Support: Frequently asked questions about Copilot in Excel](https://support.microsoft.com/office/7a13758f-d61e-4a56-8440-f2c9a07802ec)
- [Microsoft Q&A: Copilot Chat throws error or does not generate response](https://learn.microsoft.com/en-us/answers/questions/5920683/copilot-chat-throws-error-or-does-not-generate-res)
- [Microsoft Q&A: Copilot Chat and Word Copilot do not respond from the corporate network](https://learn.microsoft.com/en-us/answers/questions/5933657/microsoft-365-copilot-chat-word-copilot-does-not-g)
- [Microsoft Q&A: Copilot returning error something went wrong](https://learn.microsoft.com/en-us/answers/questions/5921177/copilot-returning-error-something-went-wrong)
- [Microsoft Q&A: Copilot issue](https://learn.microsoft.com/en-us/answers/questions/5875624/copilot-issue)
- [Microsoft Tech Community: Copilot Excel error, failed to fetch document context](https://techcommunity.microsoft.com/discussions/bingchatenterprise/copilot-excel-error-failed-to-fetch-document-context---cannot-use-paid-service/4520369)
