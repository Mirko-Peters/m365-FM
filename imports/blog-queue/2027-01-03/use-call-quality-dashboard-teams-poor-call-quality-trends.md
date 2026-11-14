---
title: "How to Use Call Quality Dashboard to Find Poor Teams Call Quality Trends"
summary: "What the Call Quality Dashboard (CQD) shows for Microsoft Teams, how to open it, how building data helps isolate problems, report types, data latency and what the overview page does not specify."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [teams-admin-center]
keypoints:
  - "CQD shows call and meeting quality at an org-wide level for Microsoft Teams and Skype for Business Server."
  - "Open it at cqd.teams.cloud.microsoft. The overview page does not state which roles can view it."
  - "Call records are typically available within 30 minutes of call end through the near-real-time data feed."
  - "Uploading building or endpoint information in the Teams admin center enables location-enhanced reports."
  - "The overview does not define poor call classification or list dimensions and measures. It links a separate CQD data and reports article."
faq:
  - q: "What is the Call Quality Dashboard?"
    a: "According to Microsoft Learn, CQD shows call and meeting quality at an org-wide level for Microsoft Teams and Skype for Business Server. It helps Teams admins, Skype for Business admins and network engineers monitor quality and optimize network performance."
  - q: "How current is the data?"
    a: "Learn says the near-real-time data feed makes call records typically available within 30 minutes of call end."
  - q: "How do I tell whether a problem affects one user or a location?"
    a: "Learn says an admin can upload building or endpoint information in the Teams admin center to turn on building- or endpoint-specific views. The views help determine whether a call quality problem is isolated to one user or affects a larger group."
  - q: "Who can open CQD?"
    a: "The overview page I read does not state the required roles for viewing. It says only that uploading building or endpoint information needs an admin in the Teams admin center."
  - q: "How does CQD decide a call is poor?"
    a: "The overview page does not describe poor call classification. The page links a separate CQD data and reports article, which this article did not read."
---

The Call Quality Dashboard, or CQD, shows how calls and meetings perform across the whole organization for Microsoft Teams and Skype for Business Server. You use it to spot trends, then narrow them down by location with building data. The Microsoft Learn overview explains what CQD is and what feeds it. It leaves several details to other pages, and this article marks them.

## What CQD is for

Learn says CQD helps Teams admins, Skype for Business admins and network engineers monitor call quality and optimize network performance. It reports on overall call quality, server-client streams, client-client streams and voice quality SLA. It is org-wide, so it suits trend questions such as which networks or locations show repeated problems. Learn says CQD captures both the individual call experience and the overall quality of calls, so overall patterns can become apparent to network engineers.

## Open it

The URL on Learn is `https://cqd.teams.cloud.microsoft`. The page does not describe the sign-in steps or the roles needed to view CQD. If you cannot open it, check with your tenant admin about role assignments and read the role requirements in the Teams documentation.

## How fresh the data is

The near-real-time data feed makes call records typically available within **30 minutes** of call end, according to Learn. Use that when you check whether a fix has changed the trend, but allow time for enough calls to accumulate. The page does not state other latency figures.

## Report types named on the page

- **Call quality metric reports** for overall call quality, server-client streams, client-client streams and voice quality SLA.
- **Location-Enhanced Reports**, which need building and endpoint data.
- **Custom Detailed Reports**, where you create your own reports. Learn's What's New list says a new user experience for custom Detailed Reports started rolling out in September 2026.

The page does not name summary or trending report templates, so this article does not either.

## Add building data to find where problems cluster

Without location data, CQD shows that quality is poor but not always where. An admin uploads building or endpoint information in the Teams admin center. This turns on building- or endpoint-specific views that help determine whether a call quality problem is isolated to one user or affects a larger group. Learn adds that since July 2026, public IP values are supported in building metadata files.

A practical way to use it, which is a suggestion and not a Microsoft procedure:

1. Upload building data that maps subnets or public IPs to sites.
2. Open a Location-Enhanced Report and compare sites.
3. If one site stands out, look at that site's network path. If poor calls spread across all sites, look at shared factors such as the internet edge or a common client version.
4. Repeat after each network change.

## Columns and fields the page names

The page lists columns used in detailed data, including Meeting Id, Thread Id, First and Second UPN, First and Second Public IP, transport protocol, user agent category, feedback rating, whether a call was throttled and whether the hardware encoder or decoder was blocked. These hint at what you can slice by. The page does not give the full list of dimensions and measures.

## Power BI query templates

Learn links a zip file of Power BI query templates for CQD. The overview does not describe how they work. It links the article Use Power BI to analyze CQD data, which I did not read.

## Privacy

Data that contains end-user identifiable information is managed under Microsoft 365 data retention and deletion policies, according to Learn.

## What the overview does not tell you

- Which roles may view CQD.
- How CQD classifies a call as poor.
- The full list of dimensions and measures.
- Any report or query limits.

For these, read the linked CQD data and reports article and the Teams role documentation, and check your tenant. This article does not guess.

## Typical mistakes (my advice)

- Judging a fix after a few minutes. Wait for enough calls to arrive.
- Skipping building data and then seeing only org-wide averages.
- Assuming a fixed definition of poor call without checking the CQD documentation.

## Related

- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)

## Sources

- [What is Call Quality Dashboard (CQD)? (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/cqd-what-is-call-quality-dashboard)
