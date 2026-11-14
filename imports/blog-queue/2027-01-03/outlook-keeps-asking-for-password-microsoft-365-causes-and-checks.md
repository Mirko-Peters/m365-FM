---
title: "Outlook Keeps Asking for a Password With Microsoft 365: Causes and Checks"
summary: "Checks for repeated Outlook sign-in prompts with Microsoft 365: confirm modern authentication in Exchange Online, then cached credentials, Conditional Access and profile steps, with sources labeled."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [outlook, exchange-online]
keypoints:
  - "Modern authentication has been on by default in Exchange Online, Teams and SharePoint since August 2017, according to Microsoft Learn."
  - "Check the tenant setting with Get-OrganizationConfig and enable it with Set-OrganizationConfig -OAuth2ClientProfileEnabled $true if it is off."
  - "Enabling modern authentication prompts Windows Outlook clients to sign in again, and the sign-in dialog looks very different from basic authentication."
  - "Further steps such as clearing cached credentials and registry keys come from a Microsoft Q&A community answer, not from a Learn article."
  - "The Learn troubleshooting article for this topic could not be read, so this guide separates documented facts from Q&A suggestions."
faq:
  - q: "Why does Outlook keep prompting for a password with Microsoft 365?"
    a: "The Learn page I could read does not list causes of repeated prompts. It documents that Outlook 2013 or later uses modern authentication, which is on by default in Exchange Online since August 2017. A Microsoft Q&A answer adds cached credentials, registry settings, Conditional Access and profile problems as things to check."
  - q: "How do I check whether modern authentication is on for my tenant?"
    a: "Microsoft Learn gives the Exchange Online PowerShell command Get-OrganizationConfig with the OAuth properties. In the Microsoft 365 admin center it is under Settings > Org Settings > Modern Authentication."
  - q: "Will enabling modern authentication sign users out?"
    a: "Learn says enabling it prompts Windows-based Outlook clients to sign in again and that the basic authentication and modern authentication dialogs look very different. Users with multiple accounts in one profile may get an error when connecting."
  - q: "Do the registry keys in forums come from Microsoft?"
    a: "The registry keys EnableADAL and AlwaysUseMSOAuthForAutoDiscover appear in a Microsoft Q&A answer whose author is shown as Anonymous, with no Microsoft staff label on the page. They are not on the Learn modern authentication page, which does not mention registry keys."
  - q: "Where can I see Conditional Access effects?"
    a: "A Q&A answer suggests looking in Microsoft Entra sign-in logs for Interrupted statuses, which can indicate repeating Conditional Access evaluations. This is a suggestion from Q&A, not a Learn statement."
---

If Outlook keeps asking for a password with Microsoft 365, first confirm that modern authentication is on for the tenant, then work through local causes such as cached credentials, network inspection, Conditional Access and a damaged profile. Only the first step is documented in a Microsoft Learn article I could read. The rest comes from a Microsoft Q&A answer, and this guide labels it that way. The Learn troubleshooting article that matches this topic could not be opened during research, so check it directly if you can.

## What Learn documents: modern authentication

The Microsoft Learn page on modern authentication in Exchange Online says:

- It enables features such as MFA, smart cards, certificate-based authentication and non-Microsoft SAML identity providers, and is based on ADAL and OAuth 2.0.
- Windows-based Outlook clients that support it (Outlook 2013 or later) use modern authentication to connect to Exchange Online mailboxes.
- Since August 2017 it is enabled by default in Exchange Online, Microsoft Teams and SharePoint.
- Outlook Mobile, Outlook for Mac 2016 and Exchange ActiveSync in iOS 11 or later always use it.

### Check and enable it

Check the status in Exchange Online PowerShell:

```powershell
Get-OrganizationConfig | Format-Table Name,OAuth* -Auto
```

Enable it if needed:

```powershell
Set-OrganizationConfig -OAuth2ClientProfileEnabled $true
```

Or use the Microsoft 365 admin center: **Settings** > **Org Settings** > **Modern Authentication**, then the option **Turn on modern authentication for Outlook 2013 for Windows and later (recommended)**.

Learn adds that the enable command does not block Outlook 2013 or later from using basic authentication connections. It also says enabling prompts Windows-based Outlook clients to sign in again, the basic and modern sign-in dialogs look very different, and users with multiple accounts in an Outlook profile may get an error when connecting. Enabling or disabling has no effect on IMAP or POP3 clients. The page does not mention registry keys or a propagation time.

## What Q&A suggests: a checklist for persistent prompts

A Microsoft Q&A thread describes classic Outlook for Windows users who get repeated credential prompts after a move to modern authentication although sign-in and MFA succeed. The thread has no accepted answer. One reply is shown as posted by Anonymous, with no Microsoft staff label on the page, and another is labeled as an AI answer. Treat both as suggestions, not documentation.

The anonymous answer's checklist:

1. **Clear cached credentials and reset WAM.** Delete Credential Manager entries that start with `MicrosoftOffice16`, `Outlook` or `ADAL`. In **Settings** > **Accounts** > **Access work or school**, disconnect and reconnect the Microsoft 365 account. Do not do this if that account is the primary Microsoft Entra join account of the device.
2. **Force modern authentication through the registry (HKCU).** `Software\Microsoft\Office\16.0\Common\Identity` with `EnableADAL` set to 1, and `Software\Microsoft\Exchange` with `AlwaysUseMSOAuthForAutoDiscover` set to 1.
3. **Verify tenant readiness.** Run `Get-OrganizationConfig | FL OAuth2ClientProfileEnabled`. It must return True. Confirm users run supported Outlook versions.
4. **Check network and Conditional Access.** VPNs, proxies or SSL inspection can sever OAuth tokens, so temporarily bypass the VPN to test. In Microsoft Entra sign-in logs, look for Interrupted statuses, which can indicate repeating Conditional Access evaluations.
5. **Recreate the Outlook profile** through **Control Panel** > **Mail** > **Show Profiles** if only a few users are affected.

The AI-labeled answer adds deleting the `identitycache` and `oneauth` folders under `C:\Users\<UserName>\AppData\Local\Microsoft`, and mentions legacy settings. The thread itself warns that this answer may be incorrect, so verify before you apply it.

## How to use these checks in order (my advice)

1. **Tenant:** confirm modern authentication is on (documented).
2. **Scope:** is it one user, a group, or everyone? A single user points to the profile or cached credentials. Everyone points to tenant, network or policy.
3. **Web comparison:** if sign-in works in a browser but not in the desktop client, local credentials or network inspection are more likely. This reasoning is general practice and not a Learn statement.
4. **Sign-in logs:** look for Conditional Access interruptions.
5. **Local reset:** clear cached credentials, then recreate the profile.
6. **Registry keys:** apply only after the earlier steps, and test on one device first, because they come from Q&A.

## Typical mistakes (my advice)

- Disabling modern authentication to stop the prompts. Learn says that forces basic authentication connections for Outlook 2013 or later.
- Applying registry keys from forums without checking the source.
- Removing the primary Entra join account while clearing credentials.
- Ignoring multiple accounts in one profile, which Learn lists as a possible connection error after enabling.

## Related

- [Outlook](https://www.m365.fm/entity/outlook/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Enable or disable modern authentication for Outlook in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online)
- [Resolve persistent authentication prompts in Outlook (Microsoft Q&A)](https://learn.microsoft.com/answers/questions/5851642/resolve-persistent-authentication-prompts-in-outlo)
