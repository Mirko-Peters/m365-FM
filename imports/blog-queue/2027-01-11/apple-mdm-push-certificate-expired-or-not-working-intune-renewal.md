---
title: "Apple MDM Push Certificate Expired or Not Working in Intune: Renewal Steps"
summary: "Create and renew the Apple MDM push certificate in Intune: the Apple ID rule, the 365-day validity and 30-day grace period, the renewal steps in the Apple Push Certificates Portal, changing the Apple ID and what the page leaves out about expiry."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [intune]
keypoints:
  - "The Apple MDM push certificate is valid for 365 days. After it expires there is a 30-day grace period to renew it."
  - "Renew with the same Apple account that created the certificate. Use a company Apple ID with a mailbox monitored by more than one person."
  - "Renewal path: Devices > Device onboarding > Enrollment > Apple tab > Apple MDM Push Certificate. Download the CSR, renew in the Apple portal, then upload the new certificate."
  - "Renewal is complete when the certificate status is active in both the admin center and the Apple Push Certificates portal."
  - "The page does not say what happens to devices after the grace period and gives no recovery steps for a wrong Apple ID or a lost certificate file."
faq:
  - q: "How long is the certificate valid?"
    a: "365 days. After it expires there is a 30-day grace period to renew it. The page says certificates must be renewed annually."
  - q: "Which Apple ID must I use to renew?"
    a: "The same Apple account that created the certificate. The page recommends a company email address as the Apple ID, with a mailbox monitored by more than one person, and warns against a personal Apple ID."
  - q: "How do I renew?"
    a: "In the Intune admin center open Apple MDM Push Certificate, download your CSR, open the Apple Push Certificates Portal, select Renew on the certificate, choose the new CSR, enter a unique note, upload, download the certificate and upload it in the admin center."
  - q: "How do I know the renewal worked?"
    a: "The certificate status appears active in both the admin center and the Apple Push Certificates portal."
  - q: "What if I need to change the Apple ID?"
    a: "Sign in to the Apple Push Certificates Portal with the new Apple ID, download the certificate file again and upload it to Intune with the new Apple ID, using steps 4 and 5 of the creation procedure."
---

Apple devices in Intune depend on the Apple MDM push certificate. If it expires, management of enrolled iOS, iPadOS and macOS devices is at risk. This guide follows the Microsoft Learn page Get an Apple MDM Push Certificate for Intune. Learn says the certificate enables devices to enroll with the Intune Company Portal app or Apple bulk enrollment methods such as Apple Business, Apple School Manager and Apple Configurator. The page covers creation and renewal. It does not describe what exactly fails after expiry.

## Validity and the Apple ID rule

- The certificate is valid for 365 days.
- After it expires there is a 30-day grace period to renew it.
- Renew with the same Apple account you used to create it.
- The page recommends a company email address as the Apple ID, with a mailbox monitored by more than one person, such as a distribution list. Avoid a personal Apple ID.

## Create a certificate

The admin center path is **Devices** > **Device onboarding** > **Enrollment** > **Apple** tab > **Apple MDM Push Certificate**. Use an Intune-supported web browser.

1. Select **I agree** to give Microsoft permission to send user and device information to Apple.
2. Select **Download your CSR** and save the file.
3. Select **Create your MDM push Certificate**. In the Apple Push Certificates Portal sign in with your organization's Apple ID, select **Create a Certificate**, accept the terms, upload the CSR and select **Download** to save the .pem file.
4. Back in the admin center, enter the Apple ID you used. The page says it is needed to remind you when to renew.
5. Select the folder icon, choose the .pem file and select **Upload**.

## Renew a certificate

1. Open the same admin center path and select **Download your CSR**.
2. Select **Create your MDM push Certificate** to open the Apple portal.
3. Find the certificate and select **Renew**.
4. Select **Choose File** and pick the new CSR.
5. Enter a unique note for the certificate.
6. Select **Upload**, then **Download** on the confirmation screen.
7. Return to the admin center and upload the certificate file.

Renewal is complete when the certificate status is active in both the admin center and the Apple Push Certificates portal.

## Match a certificate to a device

Check the subject ID in the certificate details. On an enrolled iOS or iPadOS device, go to **Settings** > **General** > **Device Management** > **Management Profile** > **More Details** > **Management Profile**. The Topic value contains the GUID.

## Change the Apple ID

If you later change the Apple ID of the certificate, sign in to the Apple Push Certificates Portal with the new Apple ID, download the certificate file again and upload it to Intune together with the new Apple ID, using steps 4 and 5 above.

## Managed Apple ID

If you plan to federate Microsoft Entra accounts with Apple to use Managed Apple ID, contact Apple to have the existing APNS certificate migrated to the new Managed Apple ID.

## What the page does not say

- What happens to enrolled devices or new enrollments during or after the grace period.
- How to recover if the wrong Apple ID was used for renewal.
- What to do if the .pem file is lost or the grace period has passed.
- Apple ID roles and Intune permissions.
- A troubleshooting section. The page contains only creation and renewal steps.

## A renewal routine

This routine is my advice, built on the page.

1. Record which Apple ID created the certificate and who can sign in to it.
2. Set a reminder well before the 365 days end.
3. Renew with the same Apple ID, not a new one.
4. Check the status in both portals.
5. If the certificate has already expired, act within the 30-day grace period.

## Typical mistakes (my advice)

- Renewing with a different Apple ID.
- Using a personal Apple ID that only one person can reach.
- Creating a new certificate when a renewal was needed. The page describes renewal with the existing one.
- Assuming the page explains recovery after the grace period.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Admin center path | Devices > Device onboarding > Enrollment > Apple tab > Apple MDM Push Certificate |
| Apple portal | Apple Push Certificates Portal |
| Validity | 365 days |
| Grace period | 30 days |
| Renewal rule | Same Apple ID as the one that created it |
| Completion check | Status active in both portals |

## Why the Apple ID matters (my reading)

The page says the certificate is associated with the Apple ID used to create it, and that the admin center asks for the Apple ID to remind you when to renew. My reading, not stated on the page: if the person who owns a personal Apple ID leaves, nobody else may be able to renew the certificate. The page itself only recommends a company address with a mailbox that more than one person monitors, such as a distribution list, and says to avoid a personal Apple ID.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)

## Sources

- [Get an Apple MDM Push Certificate for Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-enrollment/apple/create-mdm-push-certificate)
