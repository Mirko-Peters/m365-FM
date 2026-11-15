---
title: "Use Call Analytics to Troubleshoot Poor Teams Call and Meeting Quality for One User"
summary: "Use Call Analytics in the Teams admin center to troubleshoot one user's poor call or meeting quality: roles, how to open a session, yellow and red indicators, what rates a session as poor, data limits and what the page does not cover."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [teams-admin-center, teams]
keypoints:
  - "Open the Teams admin center, search the user, select Meetings & Calls, pick the call or meeting and use the Advanced tab for session details."
  - "The list covers the last 30 days. Sessions without media sessions do not appear, and phone numbers show only the last four digits."
  - "Yellow marks a minor issue that is unlikely to be the main cause. Red marks a significant issue and the likely main cause."
  - "Learn rates an audio session as poor for call setup errors, a poor audio network, or a non-functioning device based on listed criteria."
  - "The page notes that this experience has been superseded by newer Teams admin center guidance, so check that page too."
faq:
  - q: "Who can use Call Analytics?"
    a: "Microsoft Learn names the Teams Administrator role and the Teams communications support specialist (Tier 1) and engineer (Tier 2) roles. Engineers see detailed call logs that are hidden from specialists, such as device names, IP address and subnet mapping."
  - q: "How do I open it for a user?"
    a: "In the Teams admin center use User Search on the Dashboard, select the user, select Meetings & Calls, select the call or meeting and then the Advanced tab. You can also go to Users, select the user and open Meetings & Calls."
  - q: "What do the yellow and red indicators mean?"
    a: "Yellow is a minor issue outside the normal range that may contribute but is unlikely to be the main cause. Red is a significant issue and the likely main cause of poor quality. Unavailable means QoE data was not received."
  - q: "How far back can I look?"
    a: "The Meetings & Calls list covers the last 30 days. Real-Time Analytics covers scheduled meetings in progress and for 72 hours after they end."
  - q: "Who is missing from the data?"
    a: "Users who enter a lobby but are not admitted, view-only participants in meetings, and live event attendees are not included. In federated meetings an organization that did not organize the meeting sees only its own users."
---

To troubleshoot one user's bad call, search for the user in the Teams admin center, open the call or meeting under Meetings & Calls and read the Advanced tab. Look for red and yellow indicators. This guide follows the Microsoft Learn page on using Call Analytics. The page also says the experience has been superseded by newer Teams admin center guidance on monitoring and troubleshooting meetings and calls, so read that too.

## Roles

- **Teams Administrator.**
- **Teams communications support specialist (Tier 1):** handles basic call-quality problems and escalates meeting issues.
- **Teams communications support engineer (Tier 2):** can see detailed call logs that are hidden from specialists.

Admins can also assign Microsoft Entra roles to support staff. Call Analytics must be set up first, and the page links to a setup article.

## Open Call Analytics for a user

1. Go to the Teams admin center at `admin.teams.microsoft.com` and sign in.
2. On the **Dashboard**, use **User Search** to enter the user's name or SIP address, or select **View users**.
3. Select the user.
4. Select **Meetings & Calls**, then select the call or meeting.
5. Select the **Advanced** tab for session details.

Alternatively go to **Users**, select the user and open the **Meetings & Calls** tab.

## What you see

- **Meetings & Calls list:** all calls and meetings the user organized or took part in over the last 30 days. A session does not appear if no media sessions were generated.
- **Session details (Advanced tab):** per-leg details and media and networking statistics. Each leg is shown, for example one participant to another.
- **Debug view** under Call Details > Advanced: visible to engineers only, with details such as DNS suffix and SSID.
- **Device, network and connectivity information:** Learn lists these as categories of data. Engineers see device names, IP address and subnet mapping on the Advanced tab. Specialists do not.
- **Building, site and tenant data:** shown per call and meeting if uploaded.

## Quality indicators

| Indicator | Meaning on Learn |
| --- | --- |
| Yellow | A minor issue outside the normal range. It may contribute but is unlikely to be the main cause |
| Red | A significant issue and likely the main cause of poor quality |
| Unavailable | QoE data was not received for an audio session, usually from a dropped call or terminated connection |

For audio sessions with QoE data, a session is rated **poor** for these issues:

| Issue | Area | Criteria |
| --- | --- | --- |
| Call setup | Session | Ms-diag error codes 20 to 29, meaning the user could not join |
| Audio network classified poor | Session | Packet loss, jitter, NMOS degradation, round-trip time or concealed ratio |
| Device not functioning | Device | DeviceRenderNotFunctioningEventRatio or DeviceCaptureNotFunctioningEventRatio of 0.005 or higher |

Learn warns that the Advanced Other and Debug data is diagnostic telemetry meant for Microsoft support. Learn does not recommend making judgments based on this data without Microsoft support.

## Limits and gaps in the data

- The list covers 30 days.
- Real-Time Analytics covers scheduled meetings in progress and for 72 hours after they end. After that, use Call Analytics for individual meetings.
- Phone numbers show only the last four digits, and this cannot be changed.
- Users who enter a lobby but are not admitted are not included.
- View-only participants in meetings are not included.
- Live event attendees are not included. Call Analytics is available only to presenters of live events and events optimized for large audiences.
- In federated meetings, an organization that did not organize the meeting sees only its own users.

## What the page does not say

It states no license requirements. It does not describe named Overview, Devices, Network or Connectivity tabs, so do not expect those names from this page. It gives no retention beyond the 30-day list.

## A routine for one user (my advice)

The routine is my own suggestion that builds on the page.

1. Get the date, time and kind of session from the user.
2. Find the session in Meetings & Calls within 30 days.
3. On the Advanced tab, look for red first, then yellow.
4. Check each leg, since the problem may sit on one participant's side.
5. Compare the red item with the poor criteria: setup, network or device.
6. If the cause points to the network, check building and site data and ask the network team. If it points to a device, check the headset or microphone.
7. Escalate to Tier 2 or Microsoft support when you need Debug data.

## Typical mistakes (my advice)

- Looking for a session older than 30 days.
- Treating every yellow item as the cause.
- Reading Debug telemetry without support.
- Expecting lobby-only or view-only participants in the list.

## Related

- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)

## Sources

- [Use Call Analytics to troubleshoot poor call quality (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/use-call-analytics-to-troubleshoot-poor-call-quality)
