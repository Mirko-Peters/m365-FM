---
title: "What Is Teams Phone? Licenses, Setup Steps and Calling Options"
summary: "What Microsoft Teams Phone is, which licenses users need, how the four PSTN options differ (Calling Plans, Operator Connect, Teams Phone Mobile, Direct Routing) and the setup order for admins."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [teams-phone, pstn, teams-calling-plans, teams-admin-center]
keypoints:
  - "Teams Phone is the cloud telephony solution in Teams. Making and receiving external calls needs Teams Phone licensing for users plus a PSTN connection for the tenant."
  - "A PSTN solution is separate from a Teams Phone license. It provides phone numbers and access to domestic, international and emergency calling."
  - "Four PSTN options exist: Microsoft Calling Plan, Operator Connect, Teams Phone Mobile and Direct Routing with your own session border controller."
  - "Users who need their own number need licensing that includes Teams and the Microsoft 365 Phone System, for example Teams Enterprise plus Teams Phone Standard."
  - "Assign numbers in the Teams admin center under Voice, Phone numbers. Changes can take up to 24 hours."
faq:
  - q: "What is Teams Phone?"
    a: "Microsoft Learn describes Teams Phone as a cloud-based telephony solution that lets users make and receive phone calls inside the Teams app. Users can call from a desktop computer, laptop, mobile device or a dedicated Teams Phone device, and voicemail is available inside Teams."
  - q: "Do I need a separate license for Teams Phone?"
    a: "Yes. Microsoft Learn says each user who uses Teams Phone must be assigned a Teams Phone license, such as Microsoft Teams Phone Standard on top of a prerequisite license. Any Microsoft 365 E5 license that includes the Phone System makes the standalone Teams Phone Standard license unnecessary."
  - q: "Is a Teams Phone license enough to call regular phone numbers?"
    a: "No. According to Microsoft Learn, a PSTN solution is separate from a Teams Phone license. The tenant needs a PSTN connection through a Microsoft Calling Plan, Operator Connect, Teams Phone Mobile or Direct Routing before users can call external numbers."
  - q: "How do I assign a phone number to a user?"
    a: "In the Teams admin center, go to Voice, then Phone numbers, select an unassigned number and Edit, search for the user under Assigned to, choose an emergency location and select Save. Microsoft Learn also names the Set-CsPhoneNumberAssignment PowerShell cmdlet and says enablement can take up to 24 hours."
---
Teams Phone is Microsoft's cloud phone system, a cloud telephony solution for business calling inside Teams. It lets people make and receive phone calls in the Teams app on a computer, mobile device or dedicated Teams Phone device. Using it for external calls takes two things: Teams Phone licenses for users and a connection to the public telephone network (PSTN) for your organization.

## What Teams Phone includes

Microsoft Learn describes a complete calling solution. Teams Phone works with chat, video meetings and file sharing, so the phone functionality in Teams sits next to the rest of your Microsoft 365 apps. Calls can be routed by availability and preferences, voicemail is accessible in Teams and dynamic emergency calling is supported. Microsoft Teams calling between Teams users works for everyone licensed for Teams, so a phone license is about reaching and being reached by outside numbers.

The same overview describes how this looks for users. With Calling Plans, a user can transfer calls, hold calls and forward calls to another number or to voicemail, and can read voicemail transcripts in the Teams app. Calling Plans also include a minute package for outbound calls to domestic and international destinations. With Teams Phone Mobile, the number of a SIM-enabled mobile phone also becomes the user's Teams phone number, so one business number works in the phone's native dialer and on Teams endpoints such as a desk phone, a laptop or a mobile device. Microsoft adds that a user can move an active call from the mobile dialer to the Teams app on the same device without dropping it. Direct Routing, by contrast, lets an organization keep using its existing PSTN infrastructure.

## Licenses

Teams Phone licensing builds on Microsoft 365 licensing. Users who use Teams for calls and need their own phone number need licensing that includes Microsoft Teams and the Microsoft 365 Phone System. Microsoft Learn gives these examples:

- Microsoft Teams Enterprise plus Microsoft 365 E5 (no Teams), which includes the Phone System.
- Microsoft Teams Enterprise plus Microsoft Teams Phone Standard.
- A legacy Microsoft 365 E5, which includes Teams and the Phone System. No extra Teams Phone Standard license is needed.
- Office 365 F3 plus Microsoft Teams Phone Standard for Frontline Workers.

The add-on licenses need prerequisites. Teams Phone Standard requires, among others, Microsoft 365 Business Basic, Standard or Premium, F1, F3, E3 or A3, Microsoft Teams Enterprise or Teams Essentials. Microsoft Teams Phone with Calling Plan is a bundle with a similar prerequisite list. Resource accounts for auto attendants and call queues use a separate Microsoft Teams Phone Resource Account license, which Learn says must not be assigned to other users. Shared devices such as common area phones use the Microsoft Teams Shared Device license.

Licensing alone does not give you numbers. Microsoft Learn says plainly that a PSTN solution is separate from a Teams Phone license and provides phone numbers and access to domestic, international and emergency calling. International calling therefore depends on the PSTN option you choose, not on the license alone, and Teams phone pricing depends on both parts, the license and the PSTN solution.

## The four calling options

Microsoft Learn's PSTN connectivity article compares four models.

| Option | Who provides PSTN | What it needs | Fit, per Microsoft |
|---|---|---|---|
| Microsoft Calling Plan | Microsoft | A Calling Plan license | Fully Microsoft-managed, simplest deployment |
| Operator Connect | A certified operator | A contract with that operator | Working with a participating provider while managing users and numbers in Teams |
| Teams Phone Mobile | A certified mobile operator | A contract with that operator | Mobile-first staff who want one number across Teams and their mobile phone |
| Direct Routing | Any PSTN operator | A certified session border controller (SBC) and a provider contract | Advanced integration, existing infrastructure or maximum flexibility |

Calling Plans are available only in select countries or regions. Teams Phone Mobile supports only user numbers, not Audio Conferencing or voice application numbers. The other three support all number types. You can mix options in one tenant, for example Calling Plans with Shared Calling for everyone and Teams Phone Mobile, Operator Connect or Direct Routing for specific groups. Shared Calling lets users make calls without their own phone number, and needs only a Teams Phone license.

## Setup order for admins

Microsoft's Set up Teams Phone article gives this sequence:

1. **License users.** Assign a Teams Phone license to each user. Users must also be voice enabled. In the Teams admin center, go to **Users**, **Manage users**, select the user and open the **Account** tab and under **Assigned phone number** turn **Enterprise Voice** to **On**, or use the Set-CsPhoneNumberAssignment cmdlet with -EnterpriseVoiceEnabled.
2. **Choose a PSTN option** from the table above.
3. **Get and assign numbers** for users and for services such as auto attendants and call queues.
4. **Set up emergency calling.** Define emergency locations and assign one to each user. How you do this depends on your PSTN option.
5. **Optional:** set up an auto attendant and call queues.
6. **Configure other features** such as voicemail, caller ID, call forwarding and calling policies, which are the everyday calling features users notice.
7. **Manage the deployment,** including devices and call quality.

## Assign a number to a user

In the Teams admin center, select **Voice**, then **Phone numbers**. Select an unassigned number and **Edit**. Under **Assigned to**, search for the user and select **Assign**. Pick an emergency location, decide whether to email the user the number details and select **Save**. The admin needs the Teams Administrator, Teams Communications Administrator or Teams Telephony Administrator role. The number and the user's usage location must be in the same country or region. Learn says enablement can take up to 24 hours.

## Which option should you pick?

Microsoft's PSTN article gives its guidance in the "ideal for" row of the comparison. If you want the simplest deployment and Calling Plans are sold in your country, the Microsoft Calling Plan is the straightforward route. If you already have a carrier in the Operator Connect or Teams Phone Mobile programs, that carrier can manage PSTN calling for you. If you must keep your own carrier and equipment, Direct Routing is the option that connects your session border controllers. Microsoft's guidance steps for all four are to confirm licenses, choose a PSTN option and then configure the chosen solution, including assigning numbers to users.

## Common mistakes

- Buying Teams Phone licenses and expecting numbers to appear without a PSTN option.
- Giving the resource account license to a normal user.
- Forgetting emergency locations.
- Choosing Direct Routing without planning for an SBC.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Public switched telephone network (PSTN)](https://www.m365.fm/entity/pstn/)
- [Teams Calling Plans](https://www.m365.fm/entity/teams-calling-plans/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Overview of Teams Phone](https://learn.microsoft.com/en-us/training/modules/introduction-teams-meetings-calling/3-overview-teams-phone)
- [Microsoft Learn: Teams Phone licensing](https://learn.microsoft.com/microsoftteams/teams-phone-licensing)
- [Microsoft Learn: PSTN connectivity options](https://learn.microsoft.com/en-us/microsoftteams/pstn-connectivity)
- [Microsoft Learn: Set up Teams Phone](https://learn.microsoft.com/microsoftteams/setting-up-your-phone-system)
- [Microsoft Learn: Assign, change or remove a phone number for a user](https://learn.microsoft.com/en-ca/microsoftteams/assign-change-or-remove-a-phone-number-for-a-user)
- [Microsoft Learn: Plan your Teams voice solution](https://learn.microsoft.com/en-us/microsoftteams/cloud-voice-landing-page)
