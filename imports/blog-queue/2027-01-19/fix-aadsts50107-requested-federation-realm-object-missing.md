---
title: "Fix AADSTS50107: The Requested Federation Realm Object Does Not Exist"
summary: "AADSTS50107 appears when a sign-in request names a federation realm that Microsoft Entra ID cannot match. Learn gives a SAML cause, a third-party identity provider sending the wrong IssuerURI, and an archived AD FS case with several federated domains. Steps and PowerShell notes follow."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [entra-id, saml, single-sign-on]
keypoints:
  - "The reference describes AADSTS50107 as a malformed login request that could not be matched with an existing authentication endpoint or instance."
  - "Learn's SAML article names one cause: a third-party identity provider returns the wrong IssuerURI in the SAML Issuer element."
  - "Resolution 1 is for the identity provider team to correct the IssuerURI; resolution 2 is to change the IssuerUri of the federated domain to match the realm in the error."
  - "WSFED federation needs only the IssuerUri parameter, while SAMLP also needs the preferred authentication protocol set to samlp."
  - "An archived article covers AD FS with several top-level domains where the issuance transform rule was not updated after adding child domains."
faq:
  - q: "What does AADSTS50107 mean?"
    a: "The reference says the requested federation realm object does not exist, and describes an application error: the login request was malformed and could not be matched with an existing authentication endpoint or instance."
  - q: "What is the usual cause with a third-party identity provider?"
    a: "Learn says the identity provider returns the wrong IssuerURI in the SAML Issuer element, so Entra cannot match the realm with the federated domain."
  - q: "How do I fix the IssuerUri on the Microsoft side?"
    a: "Learn shows changing the IssuerUri of the federated domain, with Set-MsolDomainFederationSettings, to match the realm in the error. The MSOnline module is deprecated, so check the Microsoft Graph PowerShell equivalent."
  - q: "Does the protocol matter?"
    a: "Yes. Learn says to check the PreferredAuthenticationProtocol. For WSFED you use only the IssuerUri parameter, and for SAMLP you must also set the preferred authentication protocol to samlp."
  - q: "What about AD FS with multiple domains?"
    a: "An archived Learn article says the error can appear when several top-level domains federate to the same AD FS and the issuance transform rule is missing or was not updated after adding child domains. It points to the Microsoft Entra RPT Claim Rules generator."
---

AADSTS50107 means the sign-in request named a federation realm that Microsoft Entra ID has no matching object for. The error reference calls it an application error: the login request was malformed and could not be matched with an existing authentication endpoint or instance. In federated setups, Learn describes two causes: a third-party SAML identity provider that sends the wrong IssuerURI, and an AD FS farm whose claim rules were not updated for several domains. This article covers both, and notes where the PowerShell instructions are outdated.

## Which realm is in the error

The error message contains the realm name that was requested. Everything in the fix comes back to comparing that realm with the IssuerUri configured for your federated domain. For AD FS the realm looks like `http://<AD FS host>/adfs/services/trust`, as the archived article shows.

## Case 1: wrong IssuerURI from a third-party identity provider

Learn's article on this error says the cause is that the third-party identity provider returns the wrong IssuerURI in the SAML Issuer element. Two resolutions are described.

### Resolution 1: correct it at the identity provider

The team that manages the identity provider corrects the IssuerURI so it matches what Entra expects for the federated domain.

### Resolution 2: change the IssuerUri in Entra

Change the IssuerUri of the federated domain so it matches the realm in the error. Learn shows the MSOnline command `Set-MsolDomainFederationSettings` with the domain name and the new IssuerUri. Then check the PreferredAuthenticationProtocol of the domain:

- For WSFED, use only the `-IssuerUri` parameter.
- For SAMLP, use `-IssuerUri` and also set `-PreferredAuthenticationProtocol samlp`.

### A caution about the module

The article notes the deprecation of the MSOnline and Azure AD PowerShell modules and recommends Microsoft Graph PowerShell. The dates in that note, including 30 March 2024, have passed, so do not start new work on the old modules without checking whether the commands still run in your tenant. I did not read the Graph PowerShell federation documentation, so I give no replacement command here.

## Case 2: several federated domains on one AD FS

An archived Learn article on signing in to Microsoft 365 from multiple federated domains describes this case. It applies when you federate several top-level domains with the same AD FS. The cause is that the issuance transform rule is missing, or was not updated after child domains were added.

The solution in the article:

1. Use the Microsoft Entra RPT Claim Rules generator, the tool referenced on adfshelp.microsoft.com.
2. Export your domains with `Get-MsolDomain`, then generate the update script with the tool.
3. Run the script on the primary AD FS server. The script creates a backup text file of the existing rules.
4. To restore, use `Set-AdfsRelyingPartyTrust` with the backup.

The article is archived, so use it as background and confirm that the tool and the cmdlets match your environment.

## How to tell which case you are in

This section is my advice, not a Microsoft statement.

- **Third-party identity provider, one federated domain:** start with Case 1 and compare the Issuer value in the SAML response with the domain's IssuerUri.
- **AD FS with two or more domains or a recent child domain:** start with Case 2.
- **Only some users fail:** note their UPN suffixes. A suffix that belongs to a domain with different settings is a strong lead.
- **It worked before and broke after a change:** ask what changed at the identity provider or AD FS, and compare with the last known configuration.

## A repair order

This section is my advice, not a Microsoft statement.

1. **Copy the realm from the message.** Keep the exact text, as one character off is the whole problem.
2. **Read the current federation settings** for the domain and record the IssuerUri and the preferred protocol.
3. **Compare.** If they differ from the realm in the error, you have the mismatch.
4. **Decide who changes it.** Changing the identity provider affects its other relying parties, so involve its owner. Changing Entra affects all users of the domain.
5. **Make one change and test with a single user.** Use a private browser session.
6. **Keep a record.** Save the old values before changing, so you can roll back.
7. **Check the protocol.** If the realm is right and sign-in still fails, look at WSFED or SAMLP.

## What to collect before you change anything

This section is my advice, not a Microsoft statement.

Gather the full error message with the realm, the domain the user signs in with, the time of the failure and the correlation details shown on the error page. Add the identity provider's name, the protocol in use and the current federation settings of the domain. If you plan to use the AD FS claim rules tool, also export the list of domains and keep a copy of the existing rules. Having these items in a ticket lets the identity provider team and the Entra admins work from the same facts, and it makes a rollback straightforward if a change does not help.

## What I did not read

I read the SAML troubleshooting article and the archived multi-domain article. The first page opened without a clear title in the text I received, so I cite its title from the page header. I did not read the Entra federation configuration documentation or the AD FS troubleshooting pages.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [SAML](https://www.m365.fm/entity/saml/)
- [Single sign-on](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [Authentication fails with an error stating 'The requested federation realm object ... does not exist' (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/mfa/authentication-fails-with-error)
- [You can't sign in to Microsoft 365 from multiple federated domains (Microsoft Learn)](https://learn.microsoft.com/previous-versions/troubleshoot/microsoft-365/enterprise/cant-sign-in-office-365-multiple-domain-federation)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
