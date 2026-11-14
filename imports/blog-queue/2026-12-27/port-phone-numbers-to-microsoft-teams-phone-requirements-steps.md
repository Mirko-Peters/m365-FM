---
title: "Port Phone Numbers to Microsoft Teams Phone: Requirements, Wizard Steps and Order Statuses"
summary: "Transfer existing phone numbers to Teams using Microsoft Learn: required roles, billing telephone number, account PIN, authorized user, number input rules, port types, e-signature, the 72 business hour acknowledgement and every order status."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [teams-phone]
keypoints:
  - "A Teams Telephony Administrator, Teams Communications Administrator or Teams Administrator role is needed. The wizard is under Voice, Phone numbers, Numbers, Port."
  - "The billing telephone number and organization name must match the current provider exactly, and any account freeze must be removed, or the request is rejected after submission."
  - "Ranges are not supported. Enter 10-digit or E.164 numbers (new wizard), or upload a one-column CSV headed PhoneNumber. Each request handles one group of numbers."
  - "The authorized user cannot be updated during the port request. E-signature is the recommended way to sign the letter of authorization."
  - "Microsoft acknowledges the request within 72 business hours. Report problems with ported numbers within the first 24 to 48 hours."
faq:
  - q: "Which role can submit a port order?"
    a: "According to Microsoft Learn, a Teams Telephony Administrator, Teams Communications Administrator or Teams Administrator."
  - q: "Why would a port request be rejected?"
    a: "Learn says a wrong billing telephone number or an account freeze causes rejection after submission. In the status reference, an Exception is usually caused by incorrect letter of authorization data such as the PIN or ZIP code."
  - q: "Can I port a range of numbers?"
    a: "No. Learn says ranges are not supported in manual entry. Use 10-digit or E.164 numbers separated by a comma or semicolon, or a CSV with one column headed PhoneNumber."
  - q: "How long until Microsoft responds?"
    a: "Learn says Microsoft acknowledges the request within 72 business hours and sends daily updates by email. The page does not give a total porting time and refers to port planning for lead times."
  - q: "Where do I track the order?"
    a: "In the Teams admin center under Voice, Phone numbers, Order history. Learn lists the statuses from Draft to Completed, Cancellation requested and Canceled."
---

Porting moves phone numbers you already own from another carrier to Microsoft for Teams. Most failures come from data that does not match the old carrier's records, so preparation matters more than the wizard itself. This guide follows the Microsoft Learn article on submitting a port request, which also contains the order status reference.

## Prerequisites

1. Read the page on planning number ports.
2. Gather the country-specific documents. Learn links per-country guides for 35 countries and regions, including the United States and Puerto Rico and Canada, with the downloadable letter of authorization (LOA) forms.
3. Sign in to the Teams admin center with the Teams Telephony Administrator, Teams Communications Administrator or Teams Administrator role.

## Start the wizard

Go to **Voice**, then **Phone numbers**, select **Numbers**, then **Port**. On the splash screen, choose **US & Canada Preview** for the new wizard, or **All regions (current porting experience)** for the classic one. For US and Canada numbers, select **US & Canada**, then **Start port**. The steps below follow the new US and Canada wizard. The page documents the classic wizard on a separate tab, and its flow differs, as described after the port types.

## Wizard steps (new US and Canada wizard)

1. **Get started:** select the country or region that currently hosts the numbers. The wizard lists the documents needed from the current carrier.
2. **Phone numbers:** enter numbers in 10-digit or E.164 format, separated by a comma or semicolon. Dashes are optional and ranges are not supported. For a CSV, use one column with the header `PhoneNumber`. The wizard groups numbers by account, service provider and type. Each request processes one group, so mixed groups need separate requests. You can save progress and resume from Order history.
3. **Billing telephone number (BTN):** it must exactly match the provider's records, and any account freeze must be removed. It is also called the account telephone number and is usually on a statement.
4. **Account information:** organization name matching the provider's records exactly, account number, and an account PIN if the account has one. The PIN is required for all mobile numbers and differs from a BTN Freeze PIN. Add one authorized user, who cannot be updated during the request, and the service address. After the port completes, Microsoft treats your tenant admins as authorized users.
5. **Documents:** upload the required and recommended documents as PDF files. They are stored in your tenant and shared with Microsoft's Telephone Number Service Center.
6. **Porting details:** an order name and requester contacts. Separate several email addresses with a semicolon.
7. **Authorize and submit:** choose **Sign with e-signature (recommended)**, where the authorized user approves by email and the request is then submitted automatically, or an offline signature where you download, sign and upload the LOA. In edit mode you can change any field except Country or Region, and a changed LOA must be re-signed.
8. **Confirmation:** Microsoft acknowledges the request within 72 business hours. Track it under **Voice**, **Phone numbers**, **Order history**.

## The classic wizard (All regions)

The page describes the classic wizard on its own tab. The flow differs from the new wizard.

- **Get started:** enter the country or region and the numbers. Manual entry takes E.164 format only, and the CSV needs one column headed `PhoneNumber` with E.164 numbers. Ranges are not supported.
- **Manage numbers:** the wizard checks format, country or region and validity. All numbers must validate before you continue. For a failure you do not understand, the page suggests a General Inquiry case with the TNS Service Desk through the Phone Number Service Center portal.
- **Add account information:** order name, BTN in E.164 format, organization name, current provider name, account number and security PIN (required for mobile numbers), requester details, authorized user details, the signing method and the service address. A BTN that is not among the ported numbers makes the request a partial port. The fields shown depend on country and number type.
- **Add number features:** change the number usage if needed. The options named are User, Voice app and Conference, and toll-free numbers default to Voice app.
- **Complete your order:** with paper signature you download the prefilled LOA template, sign it, upload it and select **Submit**. With e-signature the authorized user receives an email after you select **Complete and send e-signature request**.

## Port types

| Type | What happens |
| --- | --- |
| Full port | All numbers tied to the BTN move, including the BTN. The account with the current provider is closed. |
| Partial port, BTN excluded | Only the specified numbers move. The BTN stays with the current provider. |
| Partial port, BTN included | The BTN and the specified numbers move. You may name one unported number as the replacement BTN for the open account. This is optional. |

## Order statuses

| Status | Meaning |
| --- | --- |
| Draft | Started but not validated. New wizard only. |
| Not submitted | Validated. The LOA still needs to be signed and submitted. |
| Manual review | Microsoft support is reviewing the order. |
| Pending operator approval | With the losing provider. The planned port date appears in the order details. |
| Exception | The losing carrier rejected the order, usually because of incorrect LOA data such as the PIN or ZIP code. |
| Approved (FOCAccepted) | Approved to port. Prepare the numbers now. |
| Completed | The numbers are active. |
| Cancellation requested | A cancellation is pending. |
| Canceled | Closed and not ported. A new order does not reuse earlier validations or documents. |

For an Exception, verify the LOA data against your carrier account. Existing cases are updated through the Phone Number Service Center Portal by adding a comment, not by opening a new case.

## Prepare numbers before completion

On an Approved order, Learn says preassignment is not allowed for Direct Routing or Operator Connect numbers. In the US and Canada, existing assignments are kept, and each number needs a Calling Plan license and an emergency calling location before completion. Outside the US and Canada, such numbers transfer as unassigned. For a new number from an external carrier, preassignment is allowed with a Phone System license for the user, a Phone Resource Account license for resource accounts, and a Calling Plan license whose usage location matches the number's country. Toll-free numbers also need a positive Communication Credits balance.

## After the port

Report issues with ported numbers to the Phone Number Service Center within the first 24 to 48 hours. After that, contact Microsoft Support.

## Not covered

The page does not give total porting times, fees or the content of the per-country guides.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)

## Sources

- [Transfer phone numbers to Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/phone-number-calling-plans/transfer-phone-numbers-to-teams)
