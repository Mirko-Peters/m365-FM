---
title: "Debug SAML Single Sign-On Problems With an Enterprise Application in Entra ID"
summary: "Find and fix SAML SSO errors for Microsoft Entra enterprise applications using Microsoft Learn: the Test single sign-on page, the My Apps Secure Sign-in Extension, errors on the company sign-in page versus the application page and what to check in the SAML request and response."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [entra-id, saml]
keypoints:
  - "Install the My Apps Secure Sign-in Extension for Chrome or Edge. It collects the SAML request and response needed to resolve issues."
  - "Test under Entra ID, Enterprise apps, All applications, Single sign-on, SAML, then Test single sign-on. The role needed is at least Cloud Application Administrator."
  - "An error on the company sign-in page needs the error message and the SAML request. Check Destination, Issuer and AssertionConsumerServiceURL."
  - "An error on the application page means Entra ID issued a token but the app did not accept it. Review NameID, claims and the signing certificate in the SAML response."
  - "A Fix it button appears only when the error is caused by a misconfiguration in Entra ID. Without the button the issue is not an Entra ID misconfiguration."
faq:
  - q: "How do I start testing SAML sign-on?"
    a: "According to Microsoft Learn, sign in to the Entra admin center as at least a Cloud Application Administrator, go to Enterprise apps, All applications, select the app, then Single sign-on, SAML and Test single sign-on. If Test is greyed out, save the required attributes in Basic SAML Configuration first."
  - q: "What do I need to debug an error on the company sign-in page?"
    a: "The error message and the SAML request. With the extension, select Download the SAML request on the Test single sign-on page. Without it, copy the error message and use Get resolution guidance."
  - q: "What should I check in the SAML request?"
    a: "That Destination matches the SAML Single Sign-on Service URL from Entra ID, that Issuer matches the identifier configured for the application, and that AssertionConsumerServiceURL is where the application expects the token."
  - q: "What if the error appears on the application page?"
    a: "Entra ID issued a token the application did not accept. Check the app's gallery integration guide, then review the NameID value and format, the claims issued and the signing certificate in the SAML response, and ask the vendor what the response is missing."
  - q: "What is the Fix it button?"
    a: "It updates the Entra ID configuration automatically when the guidance finds a fixable misconfiguration. If it does not appear, Learn says the issue is not caused by an Entra ID misconfiguration."
---

SAML single sign-on failures show up in two places: on the company sign-in page before the application is reached, or on the application's own page after a successful sign-in. Microsoft Learn splits debugging along that line. This guide follows its article.

## Before you begin

Microsoft recommends installing the **My Apps Secure Sign-in Extension**, available for Chrome and Microsoft Edge. It collects the SAML request and SAML response you need. Without it, the article shows how to proceed, and a tool such as Fiddler can capture the values.

## Test SAML single sign-on

1. Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator.
2. Go to **Entra ID**, **Enterprise apps**, **All applications**.
3. Select the application and then **Single sign-on**.
4. Select **SAML** on the Select a single sign-on method pane.
5. Open **Test single sign-on**. If the Test button is greyed out, fill in and save the required attributes in **Basic SAML Configuration** first.
6. Sign in to the target application as the current user or a different user.

If sign-in succeeds, Entra ID issued a SAML response token and the application used it. If you see an error, use the matching section below.

## Error on the company sign-in page

This error appears before the application is reached. You need the error message and the SAML request.

**With the extension:**

1. The extension redirects you back to the Test single sign-on page.
2. Select **Download the SAML request**.
3. Review the resolution guidance, which is based on the error and the request values.
4. If a **Fix it** button appears, select it to update the Entra ID configuration automatically. If it does not appear, the issue is not an Entra ID misconfiguration.

**Without the extension:**

1. Copy the error message from the bottom-right corner. It includes a CorrelationID, a timestamp and a statement of the root cause. Learn calls the CorrelationID and timestamp important for a Microsoft support case.
2. Paste it into the text box above **Get resolution guidance** on the Test single sign-on page and select it.
3. Check that the **Destination** in the SAML request matches the **SAML Single Sign-on Service URL** from Entra ID.
4. Check that the **Issuer** matches the identifier configured for the application. Entra ID uses it to find the application in your directory.
5. Check that **AssertionConsumerServiceURL** is where the application expects the SAML token. It can be set in Entra ID and is optional if the request already contains it.

## Error on the application page

Here sign-in succeeds but the application shows an error, which means Entra ID issued a token the application did not accept.

1. If the application is in the Microsoft Entra Gallery, confirm that you completed every step of its integration guide.
2. Get the SAML response by selecting **Download the SAML response** with the extension, or by capturing it with Fiddler.
3. Review the user's unique identifier (the NameID value and format), the claims issued in the token and the certificate used to sign the token.
4. Use the linked article on errors on an application's page after signing in.
5. If sign-in still fails, ask the application vendor what the SAML response is missing.

## Limitations on the page

- There are no code samples. The request and response come from the extension or a tool such as Fiddler.
- Without the extension the resolution guidance might need information from the SAML request or response, and Learn says you might need a tool such as Fiddler to retrieve it.

## A short triage order

This order is a suggestion based on the article, not a Microsoft procedure.

1. Run Test single sign-on first, to see which side fails.
2. If the error is on the company page, compare Destination, Issuer and AssertionConsumerServiceURL.
3. If it is on the application page, compare NameID, claims and the certificate.
4. Keep the CorrelationID and timestamp for support.

## What to collect for a support case

The article says the CorrelationID and the timestamp from the error message are important for a support case with Microsoft, because they help the engineers identify the problem and give an accurate resolution. The error message also contains a statement identifying the root cause. My advice, not from the page: keep the downloaded SAML request or response together with the error message and the time of the failed attempt, so the case has everything in one place.

## Other help on the page

The page links a short video on troubleshooting SAML SSO with Microsoft Entra ID, a list of SaaS application integration tutorials for gallery apps, and the Single Sign-on SAML protocol article for details on the SAML response. If no resolution is shown for a sign-in error in the extension flow, Learn asks you to use the feedback textbox to tell Microsoft.

## Not covered

The page does not list specific error codes or fixes for individual applications. It links separate articles for those.

## Related

- [Entra ID](https://www.m365.fm/entity/entra-id/)
- [SAML](https://www.m365.fm/entity/saml/)

## Sources

- [Debug SAML-based single sign-on to applications (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/debug-saml-sso-issues)
