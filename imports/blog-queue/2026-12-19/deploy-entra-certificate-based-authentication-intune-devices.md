---
title: "Deploy Entra Certificate-Based Authentication to Intune-Managed Devices for Passwordless Sign-In"
summary: "The documented building blocks for Entra certificate-based authentication on Intune devices: PKI or Cloud PKI, trusted and SCEP profiles, Entra CA trust store, binding policies, and the limits Microsoft states, including passwords staying available."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [microsoft-entra, intune, x509-certificate, cloud-pki]
keypoints:
  - "The chain has two sides: Intune delivers a client authentication certificate to each device, and Microsoft Entra CBA trusts the issuing CAs and maps the certificate to a user."
  - "Deploy the trusted certificate profile before the SCEP or PKCS profile, to the same groups. Each profile supports a single platform."
  - "In Entra, upload the CAs with a CRL URL, enable CBA for a group and not for All users, then set the authentication binding and username binding policies."
  - "Only multifactor CBA satisfies the built-in MFA, Passwordless MFA and Phishing-resistant MFA authentication strengths. Single-factor CBA satisfies none."
  - "Learn says the password method cannot be turned off, so a password prompt can still appear. CBA is not supported for web sign-in at the Windows lock screen."
faq:
  - q: "Do I need an on-premises PKI for Entra CBA with Intune?"
    a: "Learn says you must configure your own PKI and provision certificates to users and devices, since PKI setup is out of scope for CBA. Intune can deliver certificates by SCEP, PKCS or imported PKCS, and Microsoft Cloud PKI is a cloud service that removes the need for an on-premises CA, NDES and the Intune Certificate Connector."
  - q: "Which Intune profile delivers a certificate usable for authentication?"
    a: "Learn's comparison lists PKCS#12 and SCEP as usable for authentication, and PKCS imported certificates as usable for S/MIME signing and encryption only. The SCEP profile article says the certificate usually requires client authentication as extended key usage."
  - q: "Why does the user still see a password option?"
    a: "Learn states that password as an authentication method cannot be turned off, and the option to sign in with a password appears even when CBA is available to the user."
  - q: "Does CBA count as phishing-resistant?"
    a: "Learn's authentication strengths table shows multifactor CBA in the MFA, Passwordless MFA and Phishing-resistant MFA strengths. Single-factor CBA is not in any of them. The default protection level in the CBA authentication binding policy is single-factor."
  - q: "What happens if the CRL URL is missing?"
    a: "Learn says that without a CRL, Microsoft Entra ID does not perform CRL checking, revocation of user certificates does not work, and authentication is not blocked. Only one CRL distribution point per trusted CA is supported, and it must be an HTTP URL."
---

Entra certificate-based authentication (CBA) with Intune-managed devices has two halves. Intune puts a client authentication certificate on each device. Microsoft Entra ID trusts the issuing certificate authority and maps the certificate to a user at sign-in. Microsoft Learn documents each half separately. This article connects them and notes where the documentation says something different from what people often assume.

## What Microsoft says CBA is

Learn describes CBA as letting users authenticate directly with X.509 certificates in Microsoft Entra ID for application and browser sign-in, without federated AD FS. Learn says to use it to adopt phishing-resistant authentication. It calls CBA a free feature that needs no paid Entra ID edition. Other parts do need licenses: the PKI file upload needs Entra ID P1 or P2, Conditional Access and so authentication strengths need P1, and MFA through CBA needs a licensed edition and blocking legacy authentication.

Supported scenarios include browser sign-in on all platforms, Office mobile apps on iOS and Android, and Office native apps on Windows. Learn lists the web sign-in option at the Windows lock or sign-in screen as not supported.

## Step 1: Choose how certificates are issued

Learn says you must run your own PKI. Two documented paths for Intune devices:

- **Existing CA with SCEP or PKCS.** Intune supports SCEP, PKCS and imported PKCS. With a Microsoft CA, SCEP needs an NDES server and the Certificate Connector for Microsoft Intune. PKCS needs the connector. With a third-party CA, SCEP does not need the connector, and PKCS is supported only with the DigiCert PKI Platform.
- **Microsoft Cloud PKI.** A cloud service that automates the certificate lifecycle for enrolled devices without on-premises servers. It needs a subscription in addition to Intune Plan 1 or Plan 2, available with the Intune Suite or as a standalone capability. Learn lists up to three CAs per tenant, SCEP issuance, and an Intune-hosted CRL with seven days validity that is refreshed every 3.5 days. It supports Android, iOS/iPadOS, macOS and Windows.

For authentication, Learn's usage table lists SCEP and PKCS#12 as usable. PKCS imported certificates are listed for S/MIME only.

## Step 2: Deploy trust and certificates with Intune

Order matters. Learn says to deploy the trusted root certificate profile first, to the same users and devices that receive the SCEP or PKCS profile. Each profile supports a single platform, so create one per platform.

To create the SCEP profile, go to **Devices** > **Manage devices** > **Configuration** > **Create**, choose the platform and **SCEP certificate**, then fill in the settings. Settings that matter here:

- **Root Certificate:** the trusted certificate profile. With a multi-level PKI, select the top-level trusted root profile that validates the issuing CA.
- **Certificate type:** user certificates can contain user and device attributes. Device certificates contain only device attributes. Learn suggests Device for user-less devices or for Windows devices, and says that on Windows the certificate then goes into the Local Computer store. It also says to select the user deployment channel in profiles with user certificates. That a user certificate is the natural fit for CBA user sign-in is my inference, because Learn does not describe this CBA scenario.
- **Subject alternative name:** attributes include email address, UPN, DNS and URI. Learn's example sets the UPN in the SAN for a user certificate. The `{{OnPremisesSecurityIdentifier}}` variable is supported with the URI attribute on macOS, iOS and Windows user certificates. The page presents it for the strong mapping requirements of Active Directory domain controllers (KB5014754), not for Entra CBA username binding, so do not assume it fills `certificateUserIds` (my caution).
- **Extended key usage:** the certificate usually requires client authentication. The page does not state an OID value.
- **Key size, hash algorithm, validity:** up to 24 months of validity, planned at five days or more, and a renewal threshold as a percentage of lifetime.
- **Key storage provider (Windows):** options are TPM KSP if present otherwise Software KSP, TPM KSP otherwise fail, Windows Hello for Business otherwise fail, and Software KSP.

Assign the profile to groups and select **Create**. The Learn page notes that the deployment channel cannot be edited after you deploy the profile.

With Cloud PKI, the steps are to create the root and issuing CAs, create and assign trusted certificate profiles for both, and create and assign the SCEP profiles. The page does not give admin center menu paths for these.

## Step 3: Trust the CAs in Entra

Learn's steps for the Entra side, which needs the Privileged Authentication Administrator role for the trust store:

1. Go to **Entra ID** > **Identity Secure Score** > **Public key infrastructure**, as written on the page, and select **Create PKI**.
2. Select **Add certificate authority** and upload each root and intermediate CA. Enter the internet-facing CRL URL. You can also upload a `.p7b` file with its SHA-256 checksum, which can take up to 30 minutes, and which needs Entra ID P1 or P2.
3. Review the **Issuer hints** flag. Learn is not consistent here: the upload steps say the flag is off by default, while the issuer hints section says the subject names of all CAs in the trust store are sent as hints by default. Learn recommends setting it to true only for CAs that issue user certificates.

Limits and warnings:

- The trust store supports up to 250 CAs, 8 KB per CA object and a 2 MB PKI file.
- Each CA needs a CRL reachable from an internet-facing URL. Without it, revocation does not work and authentication is not blocked. Only one HTTP CRL distribution point per CA is supported, and OCSP and LDAP URLs are not supported.

## Step 4: Enable CBA for a group

Create a group first. Learn warns not to include **All users**, only groups of users who have valid certificates. Sign in with at least the Authentication Policy Administrator role.

1. Go to **Entra ID** > **Authentication methods** > **Certificate-based authentication**.
2. Under **Enable and Target**, select **Enable**, acknowledge, and choose your group.
3. Save.

Learn says the network team should allow the certificate authentication endpoint for your cloud in addition to `login.microsoftonline.com`, and turn off TLS inspection on it. The page names `*.certauth.login.microsoftonline.com`, and `*.certauth.login.microsoftonline.us` for US Government, in its TLS 1.3 note.

## Step 5: Set the binding policies

**Authentication binding.** In the admin center, go to **Entra ID** > **Authentication methods** > **Policies**, open **Certificate-based authentication** and select **Configure**. The page words the step in between slightly differently in two places. The default protection level is single-factor and the default affinity is low. My advice, not a Learn statement: for passwordless-style access with strong claims, set the default to multifactor or add rules by certificate issuer, policy OID or both. Learn offers both options. A policy OID rule takes precedence over an issuer rule. Enter the policy OID as an object identifier, for example `2.5.29.32.0`. The text "All Issuance Policies" is invalid. Be careful with **Required Affinity Binding**: Learn warns that changing it without correct values on the user objects can lock out the whole tenant.

**Username binding.** The default maps Principal Name to `userPrincipalName`. Other bindings map to `certificateUserIds`, with values such as `IssuerAndSerialNumber`. The first binding has the highest priority. Learn says the Issuer, Subject and Serial number values must be in the reverse order of their format in the certificate, and that Issuer and Subject values must not contain spaces.

The same settings can be made with Microsoft Graph and the `Policy.ReadWrite.AuthenticationMethod` permission. Learn's two samples (Graph Explorer and PowerShell) differ in binding order and default mode, so check the values before you use them. The Graph Explorer sample also targets `all_users`, although Learn warns against enabling CBA for All users.

## Step 6: Check what "passwordless" really means here

- **Authentication strengths.** Multifactor CBA is in the MFA, Passwordless MFA and Phishing-resistant MFA built-in strengths. Single-factor CBA is in none. If a Conditional Access policy requires one of those strengths, a certificate that maps to single-factor will not satisfy it.
- **Password remains.** Learn says password cannot be turned off as an authentication method, and the password option still appears.
- **Windows Hello for Business.** It is compatible with CBA in Edge and Chrome, but not in nonbrowser scenarios such as Office 365 apps. Learn suggests the **Sign in Windows Hello or security key** option where available.

## Test plan (my suggestion)

1. Pick a pilot group and one device per platform.
2. Confirm the trusted and SCEP profiles arrive, and the certificate appears in the right store.
3. Check the CRL URL from outside the network.
4. Sign in to a browser app, then an Office app, and compare the strength shown in the sign-in logs.
5. Revoke the test certificate and verify that sign-in is blocked after the CRL updates.

## Related

- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)
- [Microsoft Cloud PKI](https://www.m365.fm/entity/cloud-pki/)

## Sources

- [Microsoft Entra CBA Overview - Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-certificate-based-authentication)
- [Set Up Microsoft Entra CBA - Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-certificate-based-authentication)
- [Overview of Conditional Access Authentication Strengths - Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths)
- [Types of certificate that are supported by Microsoft Intune](https://learn.microsoft.com/en-us/intune/fundamentals/certificates/overview)
- [Use SCEP certificate profiles with Microsoft Intune](https://learn.microsoft.com/en-us/intune/device-configuration/certificates/scep-profiles)
- [Microsoft Cloud PKI for Microsoft Intune](https://learn.microsoft.com/en-us/intune/cloud-pki/)
