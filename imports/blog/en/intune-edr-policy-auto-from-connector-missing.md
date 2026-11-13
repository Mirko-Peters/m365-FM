---
title: "Intune EDR Policy: What To Do When 'Auto from Connector' Is Missing"
summary: "The Intune and Defender for Endpoint connection looks on, but you cannot create an EDR policy with 'Auto from connector'? Check the connection, roles and licenses first, then use the onboarding package as a fallback."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, microsoft-defender-for-endpoint, endpoint-detection-and-response]
keypoints:
  - "'Auto from connector' only appears when the Intune connection to Defender for Endpoint is active. The status can take up to 15 minutes to update."
  - "Check the Defender portal toggle, the connection status in Intune, the admin roles and the licenses before you change anything else."
  - "If you cannot use the connector, create an EDR policy with the 'Onboard' package type and paste the onboarding package from the Defender portal."
  - "Microsoft Learn still lists 'Auto from connector' as the recommended option, so do not treat the workaround as the new standard."
faq:
  - q: "Why is 'Auto from connector' missing in my Intune EDR policy?"
    a: "According to Microsoft Learn, the option appears only when the Defender connection is active. Typical reasons are that the connection does not show as connected under Connectors and tokens, that it was enabled less than 15 minutes ago, or that the admin account lacks the required permissions."
  - q: "How do I onboard Windows devices to Defender for Endpoint without the connector?"
    a: "Download the onboarding package for Mobile Device Management / Microsoft Intune in the Defender portal, then create an EDR policy in Intune, set the package type to Onboard, paste the contents of the package, and assign the policy to a device group."
  - q: "Is 'Auto from connector' deprecated?"
    a: "A community member claimed this in a 2025 thread. The current Microsoft Learn pages for the EDR policy and the Defender integration, last updated in 2026, still describe it as the recommended option. Check the live pages before you decide."
  - q: "How long until devices show up in the Defender portal?"
    a: "Microsoft Learn says devices should appear under Device inventory in the Defender portal after about 15 to 30 minutes."
---

You turned on the connection between Intune and Microsoft Defender for Endpoint. The toggle stays on. Still, when you create an endpoint detection and response (EDR) policy, "Auto from connector" is not offered, and "Deploy preconfigured policy" is greyed out.

A Microsoft Community Hub thread from November 2025 describes exactly this. An administrator with a Microsoft 365 E5 tenant saw a warning that no Intune license was found, even though the connection looked established. Four people took part. The answer that was marked as the solution used a different route. This article shows both routes and explains when each one fits. It is a troubleshooting guide based on community reports and Microsoft Learn, so check the live pages for your tenant.

## What the connector does

When the connection between Intune and Defender for Endpoint is active, Intune can fetch the current onboarding package from Defender. In an EDR policy this is the package type **Auto from connector**. Microsoft Learn marks it as the recommended option. It is shown only when the connection is configured successfully.

The other package type is **Onboard**. You paste the contents of an onboarding package yourself. Learn lists it for cases where the connection is not available, for multiple or air-gapped tenants, or for strict change control.

## Step 1: Check the connection in both portals

1. In the Intune admin center, open **Endpoint security**, then **Microsoft Defender for Endpoint**. Look at **Connection status**.
2. If it says **Unavailable**, open the Defender portal from that page. Go to **System**, then **Settings**, then **Endpoints**, then **General**, then **Advanced features**. Turn **Intune connection** on and select **Save preferences**.
3. Go back to Intune. The status should change to **Enabled**. Microsoft says this can take up to 15 minutes, so wait before you troubleshoot further.
4. Also check **Tenant administration**, then **Connectors and tokens**, then **Microsoft Defender for Endpoint**. It should show as connected.

In the thread, a second contributor asked the same two questions that most people skip: does the signed-in account have the license, and is Intune the MDM authority under **Tenant administration**, **Tenant status**? The author confirmed both. So if those are fine, continue.

## Step 2: Save the settings on the Intune side

A contributor in the thread suggested these steps. They match the Learn page:

- In **Endpoint security**, **Microsoft Defender for Endpoint** in Intune, save the settings so that the status changes from available to enabled.
- Turn on **Connect Windows devices to Defender for Endpoint** for compliance policy evaluation if you use it.
- If devices are not enrolled in Intune, turn on **Allow Microsoft Defender for Endpoint to enforce Endpoint Security Configurations**. This extends management to unenrolled devices.

Select **Save** after the changes.

## Step 3: Check roles and licenses

Microsoft Learn lists these prerequisites for EDR policies:

- **Licenses:** Microsoft Intune Plan 1, plus Defender for Endpoint Plan 1, Microsoft 365 E5, A5 or G5 (which includes Defender for Endpoint Plan 2), or standalone Microsoft Defender XDR.
- **Intune role:** Endpoint Security Manager, or a custom role with create, read, update and delete rights on Endpoint security.
- **Defender service connection:** The Microsoft Entra Security Administrator role, or a custom role with the listed application and service principal permissions.

A missing permission is one of the three reasons Learn gives for a missing "Auto from connector" option. In the thread, the license warning appeared although the toggle worked. The thread does not say whether the warning went away or was only bypassed, so do not assume it is harmless. Check the license assignment.

## Step 4: Use the quick policy if it is available

If the connection is active, the fastest route is the preconfigured policy:

1. Go to **Endpoint security**, then **Endpoint detection and response**, then the **EDR Onboarding Status** tab.
2. Select **Deploy preconfigured policy**.
3. Choose platform **Windows** and profile **Endpoint detection and response**, name the policy, and create it.

Per Learn, this uses the latest onboarding package and deploys to all applicable devices. Think about the scope before you click, because it is a Windows-only quick deployment that targets everything.

## Step 5: Fallback with the onboarding package

If the connector option stays missing, this was the route marked as the solution in the thread:

1. In the Defender portal, go to **Settings**, then **Endpoints**, then **Device management**, then **Onboarding**.
2. Select the operating system, and for the deployment method choose **Mobile Device Management / Microsoft Intune**.
3. Select **Download package**, and open the downloaded zip.
4. Open the onboarding file and copy its content.
5. In Intune, go to **Endpoint security**, then **Endpoint detection and response**, then **Create Policy**. Choose **Windows** and **Endpoint detection and response**.
6. Set the package type to **Onboard** and paste the content into the onboarding field.
7. Assign the policy to a device group, then create it.

The original poster reported that this "worked like charm." Statistics took some time to update.

Keep two limits in mind. First, a pasted package is a static copy. With **Auto from connector**, Intune retrieves the latest package for you. With **Onboard**, you are responsible for updating the policy if the package changes. Second, offboarding packages expire seven days after download, and devices reject expired packages. Download them fresh when you need them.

## Step 6: Verify the result

- Wait 15 to 30 minutes, then look for the devices under **Endpoints**, **Device inventory** in the Defender portal.
- In Intune, check the **EDR Onboarding Status** tab. You need read access to Microsoft Defender Advanced Threat Protection in Intune role-based access control to see it.
- Look at the policy assignment status for individual devices if some do not appear.

## Is "Auto from connector" deprecated?

In the thread, the contributor who gave the accepted answer said the Microsoft article was outdated and that "Auto from connector" is deprecated. The thread does not link a Microsoft announcement. At the time of writing, the Microsoft Learn pages for the [EDR policy](https://learn.microsoft.com/mem/intune/protect/endpoint-security-edr-policy) and the [Defender integration](https://learn.microsoft.com/en-us/intune/intune-service/protect/microsoft-defender-integrate), updated in 2026, still call it the recommended option. So treat the onboarding package as a fallback for blocked or special setups, and check the live pages again before you build a standard around either route.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Endpoint detection and response](https://www.m365.fm/entity/endpoint-detection-and-response/)

## Sources

- [Microsoft Learn: Endpoint detection and response policy for endpoint security in Intune](https://learn.microsoft.com/mem/intune/protect/endpoint-security-edr-policy)
- [Microsoft Learn: Configure Microsoft Defender for Endpoint with Intune and onboard devices](https://learn.microsoft.com/en-us/intune/intune-service/protect/microsoft-defender-integrate)
- [Microsoft Community Hub: Intune Connection Issues in Defender for Endpoint (November 2025)](https://techcommunity.microsoft.com/discussions/microsoft-intune/intune-connection-issues-in-defender-for-endpoint/4473209)
