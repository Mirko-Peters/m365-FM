---
title: "SCEP vs PKCS vs Intune Cloud PKI: Choosing How to Deliver Device Certificates"
summary: "Compare SCEP, PKCS and imported PKCS certificate profiles in Intune and see where Microsoft Cloud PKI fits, using two Microsoft Learn pages: what each profile does, infrastructure requirements, platform support, Cloud PKI licensing, CA types, limits and what Learn does not compare."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [intune]
keypoints:
  - "SCEP gives a unique certificate per request and PKCS one per device. A PKCS imported certificate deploys one certificate to many devices and users, for S/MIME."
  - "With a Microsoft CA, SCEP needs an NDES server and the Intune Certificate Connector, and PKCS needs the connector. Third-party CA SCEP does not need the connector."
  - "Microsoft Cloud PKI is a cloud service that replaces an on-premises CA, NDES and the Intune certificate connector, and it issues certificates through SCEP."
  - "Cloud PKI needs a subscription in addition to Intune Plan 1 or 2, and allows a maximum of 3 CAs per tenant."
  - "The Cloud PKI page does not compare SCEP and PKCS or mention PKCS certificate profiles, and the certificate profiles page does not mention Cloud PKI."
faq:
  - q: "What is the difference between SCEP and PKCS?"
    a: "According to Microsoft Learn, SCEP deploys a request template and each certificate is unique and tied to the requesting user or device, including userless devices. PKCS deploys a request template with a certificate type of user or device, and user-type certificates always need user affinity."
  - q: "When do I use a PKCS imported certificate?"
    a: "When you must deploy the same certificate, exported from a source such as an email server, to multiple recipients, for example S/MIME signing and encryption."
  - q: "What does Cloud PKI replace?"
    a: "Learn says it replaces an on-premises certificate authority, NDES and the Intune certificate connector, and it issues certificates to Intune-managed devices on Android, iOS and iPadOS, macOS and Windows."
  - q: "Does Cloud PKI support PKCS profiles?"
    a: "The Learn page describes SCEP certificate profiles and trust certificate profiles. It does not mention PKCS certificate profiles."
  - q: "What are the Cloud PKI limits?"
    a: "A maximum of 3 CAs per tenant, counting Cloud PKI root, Cloud PKI issuing and BYOCA issuing CAs. Trial CAs keep software-backed keys after purchase."
---

Intune can deliver certificates through several profile types, and Microsoft Cloud PKI is a separate way to run the certificate authority. This guide combines two Microsoft Learn pages. Learn does not recommend one option over another, and neither page compares them against the other, so the comparison below is built from what each page says.

## The profile types

- **Trusted certificate:** deploys the public root or intermediate CA certificate to establish trust. Learn says other certificate profiles require it.
- **SCEP certificate:** deploys a certificate request template. Each certificate is unique and tied to the user or device that requests it. It can provision certificates on kiosk or userless devices.
- **PKCS certificate:** the profile specifies a user or device certificate type. User-type certificates always require user affinity. Device-type certificates do not.
- **PKCS imported certificate:** deploys the same certificate, exported from a source such as an email server, to many recipients. Learn says SCEP and PKCS cannot do this, because SCEP creates a unique certificate per request and PKCS a different one per user.

## Infrastructure with a Microsoft CA

| Profile | Requirement stated by Learn |
| --- | --- |
| SCEP | An NDES server set up for Intune, and the Certificate Connector for Microsoft Intune |
| PKCS | The Certificate Connector for Microsoft Intune |
| PKCS imported | The connector, plus exporting certificates from the CA and importing them, for example with the PFXImport PowerShell project |

With a third-party CA, SCEP does not require the Intune connector, but needs integration with a supported partner and an Entra application that delegates SCEP challenge validation to Intune. Learn lists PKCS only with the DigiCert PKI Platform for third-party CAs.

## Uses

Learn's use case table marks PKCS#12 (PFX) and SCEP for authentication and S/MIME signing, and PKCS imported certificates for S/MIME signing and encryption. Each profile supports one platform, so Android and iOS need separate profiles. Platform support in the page's table covers Android variants, iOS and iPadOS, macOS and Windows, with some gaps, for example PKCS imported certificates are not marked for Android AOSP.

## Where Cloud PKI fits

Microsoft Cloud PKI is a cloud-based service that automates certificate lifecycle management for Intune-managed devices with no on-premises servers, connectors or hardware. Learn says it replaces an on-premises certificate authority, NDES and the Intune certificate connector.

- **CA types:** Cloud PKI root CA, Cloud PKI issuing CA and BYOCA, which anchors an Intune issuing CA to a private CA such as Active Directory Certificate Services. Creating a root and issuing CA in the cloud gives a two-tier hierarchy.
- **Protocol:** the page describes a cloud registration authority supporting SCEP for each issuing CA, and SCEP certificate profiles for Android, iOS and iPadOS, macOS and Windows. The device generates the private key and it never leaves the device.
- **Licensing:** a subscription in addition to Intune Plan 1 or 2. The meta description says it is available with the Intune Suite or as a standalone capability. It is available in GCC High but not in DoD.
- **Keys:** RSA 2048, 3072 or 4096, with SHA-256, SHA-384 or SHA-512. Licensed CAs use Azure Managed HSM keys, and trial CAs use software-backed keys that cannot be converted after purchase.
- **Limit:** a maximum of 3 CAs per tenant.
- **Revocation:** the CRL is valid 7 days and refreshed every 3.5 days and on each revocation.

## How to think about the choice

This section is a suggestion, not Microsoft guidance. If you run NDES and the connector today, the question is whether to keep that stack or move issuance to Cloud PKI, which uses SCEP. If you need PKCS or imported PFX certificates, the Cloud PKI page does not say that they are supported, so those scenarios remain with your existing CA until Learn says otherwise.

## Trusted certificate first

Learn says to deploy the trusted root certificate from your CA with a trusted certificate profile before you deploy SCEP or PKCS profiles, to the same devices and users that receive the certificate profiles. The page names SCEP and PKCS in that sentence and SCEP, PKCS and imported PKCS in its sentence about deploying to the same devices and users. Cloud PKI uses the same idea with trust certificate profiles for its root and issuing CAs.

## Not covered

Neither page compares the options on security strength or cost. The Cloud PKI page gives no leaf certificate validity periods or prices, and only a high-level list of setup actions rather than step-by-step instructions. The certificate profiles page never mentions Cloud PKI.

## Related

- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Types of certificate that are supported by Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/fundamentals/certificates/overview)
- [Microsoft Cloud PKI for Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/cloud-pki/)
