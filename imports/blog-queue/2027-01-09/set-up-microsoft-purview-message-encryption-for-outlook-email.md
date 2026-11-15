---
title: "How to Set Up Microsoft Purview Message Encryption for Outlook Email"
summary: "Set up Microsoft Purview Message Encryption: the Azure Rights Management prerequisite, checking IRM configuration with PowerShell, testing with Test-IRMConfiguration, fixing missing RMS templates, and updating mail flow rules to encrypt."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [purview, exchange-online]
keypoints:
  - "The only prerequisite is that the Azure Rights Management service is activated in the tenant. If it is, Microsoft 365 activates message encryption automatically."
  - "Verify with Get-IRMConfiguration that AzureRMSLicensingEnabled is True, then test with Test-IRMConfiguration. A pass ends with OVERALL RESULT: PASS."
  - "If the test fails with Failed to acquire RMS templates, set the licensing location from Get-AipServiceConfiguration and turn on internal licensing."
  - "Mail flow rules decide when messages are encrypted. Update existing rules to Apply Office 365 Message Encryption and rights protection, or users keep the old HTML attachment format."
  - "AD RMS is not compatible. Migrate to Azure Rights Management first. The page does not cover user-side Outlook options or name licenses."
faq:
  - q: "What do I need before I can use message encryption?"
    a: "Microsoft Learn says the only prerequisite is that the Azure Rights Management service is activated in your tenant. It is activated automatically for most eligible plans, and then message encryption is activated automatically."
  - q: "How do I check the configuration?"
    a: "Connect to Exchange Online PowerShell and run Get-IRMConfiguration. AzureRMSLicensingEnabled should be True. Then run Test-IRMConfiguration with a sender and recipient from your tenant and look for OVERALL RESULT: PASS."
  - q: "What if the test says Failed to acquire RMS templates?"
    a: "Learn shows connecting to the AIPService module, reading the licensing URL from Get-AipServiceConfiguration, setting it with Set-IRMConfiguration -LicensingLocation, and turning on -InternalLicensingEnabled, then retesting."
  - q: "How do I make mail encrypt?"
    a: "Use mail flow rules. In the Exchange admin center under Mail flow > Rules, choose Modify the message security, Apply Office 365 Message Encryption and rights protection, and Encrypt from the RMS template list."
  - q: "Does it work with AD RMS?"
    a: "No. Learn says if you use AD RMS with Exchange Online you need to migrate to Azure Rights Management first. Message encryption is not compatible with AD RMS."
---

Microsoft Purview Message Encryption lets users send encrypted mail to anyone, including people on Outlook.com and Gmail. For most tenants there is little to configure: the Azure Rights Management service must be active, you verify it, and mail flow rules decide what gets encrypted. This guide follows the Microsoft Learn page on setting up message encryption.

## What it is

Message encryption uses the protection features of the Azure Rights Management service, the encryption technology used by Microsoft Purview Information Protection. Users can exchange encrypted messages with other Microsoft 365 organizations and with third parties using Outlook.com, Gmail and other services.

## Prerequisites

- The Azure Rights Management service must be activated in the tenant. If it is, Microsoft 365 activates message encryption automatically. The service is also activated automatically for most eligible plans. If it is not, the page says you can activate it manually and links to the steps.
- If you use AD RMS with Exchange Online, migrate to Azure Rights Management first. Message encryption is not compatible with AD RMS.
- Microsoft-managed root keys are the default and recommended for most organizations. If you need your own key, the page links to the bring-your-own-key guide before setup.
- Roles: the page recommends roles with the fewest permissions and uses Compliance Administrator as an example account. It does not say which role each step needs.
- Licensing: the page refers to the message encryption FAQ and the Microsoft Purview service description. It names no license.

## Verify in Exchange Online PowerShell

1. Connect to Exchange Online PowerShell.
2. Run `Get-IRMConfiguration`. `AzureRMSLicensingEnabled` should be `$True`.
3. If it is not, set it with `Set-IRMConfiguration`. The page describes this in prose and shows no exact command, but the parameter is `-AzureRMSLicensingEnabled $True`.

## Test the configuration

```powershell
Test-IRMConfiguration -Sender securityadmin@contoso.com -Recipient securityadmin@contoso.com
```

Sender and recipient can be any user in your tenant. A pass shows each check as PASS, covering RMS templates acquired, encryption verified, decryption verified and IRM verified, and ends with OVERALL RESULT: PASS.

**If the test fails with Failed to acquire RMS templates**, connect to the AIPService module and run:

```powershell
$RMSConfig = Get-AipServiceConfiguration
$LicenseUri = $RMSConfig.LicensingIntranetDistributionPointUrl
Set-IRMConfiguration -LicensingLocation $LicenseUri
Set-IRMConfiguration -InternalLicensingEnabled $true
```

Then run the test again.

## Apply encryption with mail flow rules

Mail flow rules decide when messages are encrypted and when encryption is removed. For new deployments, create new rules. For existing rules, update them. Otherwise users keep receiving encrypted mail in the previous HTML attachment format.

To update a rule in the Exchange admin center under **Mail flow** > **Rules**, for each rule under **Do the following**:

1. Select **Modify the message security**.
2. Select **Apply Office 365 Message Encryption and rights protection**.
3. Select **Encrypt** from the RMS template list.
4. Select **Save**, then **OK**.

Steps for creating a rule are on a linked page.

## What the page does not say

- How users encrypt a message in Outlook. Those options are not on this page.
- Which licenses include the feature.
- Manual activation steps and connection commands.
- Which role runs each cmdlet or edits mail flow rules.
- The page uses Get-AipServiceConfiguration for troubleshooting and does not mention Get-AadrmConfiguration.

## A setup routine

This routine is practical advice built on the page.

1. Confirm the Azure Rights Management service is active.
2. Run Get-IRMConfiguration and Test-IRMConfiguration.
3. Fix template problems with the AIPService steps if the test fails.
4. Update or create mail flow rules.
5. Send a test message to an external address and check how it arrives.

## Typical mistakes

- Leaving old mail flow rules unchanged and keeping the old HTML attachment format.
- Using AD RMS and expecting message encryption to work.
- Running only Get-IRMConfiguration and skipping the test.
- Forgetting that the page names no license requirement, which you must check separately.

## Quick reference

| Step | Tool | Expected result |
| --- | --- | --- |
| Check status | Get-IRMConfiguration | AzureRMSLicensingEnabled is True |
| Test | Test-IRMConfiguration | OVERALL RESULT: PASS |
| Fix templates | Set-IRMConfiguration with the licensing location | Test passes on the second run |
| Encrypt mail | Mail flow rule in the Exchange admin center | Encrypt action with the RMS template |

## Why old rules need an update

The page states that existing rules which still use the previous setup keep producing the HTML attachment format. The new capabilities apply when the rule uses the action Apply Office 365 Message Encryption and rights protection. So after you verify the service, review each rule that encrypts mail and change its action.

## Related

- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)

## Sources

- [Set up Microsoft Purview Message Encryption (Microsoft Learn)](https://learn.microsoft.com/purview/set-up-new-message-encryption-capabilities)
