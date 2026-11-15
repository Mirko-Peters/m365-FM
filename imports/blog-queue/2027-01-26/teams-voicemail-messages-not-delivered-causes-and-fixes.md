---
title: "Teams Voicemail Messages Not Delivered: Causes and Fixes"
summary: "Two symptoms from the Learn page: voicemail not delivered anywhere, or delivered to Outlook but missing in Teams. Mail flow rules, third-party mail systems, OpenDomainRoutingEnabled, the Teams Voicemail test, access rules, the message class and MFCMAPI."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [teams, teams-phone, exchange-online, mail-flow-rule, spf]
keypoints:
  - "Symptom 1 is voicemail not delivered in Outlook, Skype for Business or Teams. Check Exchange mail flow rules first, for example a rule that marks mail with MP3 attachments as spam."
  - "Third-party email systems such as Gmail are not supported. The FROM address of voicemail is not RFC compliant, so filter on the P1 sender address instead."
  - "If OpenDomainRoutingEnabled is True, the Content-Class header changes to unauthenticatedVoice-CA and Teams cannot identify the voicemail. Microsoft Support changes it to False."
  - "Symptom 2 is voicemail in Outlook but not in Teams. Run the Teams Voicemail test in the Remote Connectivity Analyzer, then check client access and web access rules and mail flow rules."
  - "For on-premises mailboxes the voicemail shows in Outlook but cannot be viewed or played in Teams. The message class must be IPM.Note.Microsoft.Voicemail.UM."
faq:
  - q: "Why are voicemail messages not delivered at all?"
    a: "The Learn page tells you to check Exchange mail flow rules and third-party email systems. A rule can mark mail with MP3 attachments as spam, so voicemails are filtered before they reach the Inbox. Voicemail notifications with SPF failures are delivered to Exchange, but rules that analyze SPF failures can stop them reaching the mailbox."
  - q: "Do third-party mail systems work?"
    a: "The page says third-party email systems are not supported. The main issue is that the FROM address of PSTN voicemail is formatted in a way that is not RFC compliant, while the clients filter on that field. The fix on the page is to set the mail protection filter of the third-party system to use the P1 sender address."
  - q: "What is OpenDomainRoutingEnabled?"
    a: "A legacy setting used for anti-spam detection before the built-in security features for cloud mailboxes. Check it with Get-TransportConfig | fl OpenDomainRoutingEnabled. If it is True, the Content-Class header changes from Voice-CA to unauthenticatedVoice-CA and Teams cannot process the message as voicemail. The page says to submit a support request to change it to False."
  - q: "Voicemail is in Outlook but not in Teams. What do I check?"
    a: "Run the Teams Voicemail test in the Microsoft Remote Connectivity Analyzer. Then check that no Exchange Client Access Rules or Exchange Web Access Policies block access, check the connector and message class for on-premises Exchange, and check mail flow rules and third-party filters that change headers."
  - q: "Why can a user with an on-premises mailbox not see voicemail in Teams?"
    a: "The page says Teams users with on-premises Exchange mailboxes can use voicemail with Teams and receive messages in Outlook, but the messages are not available to view or play in the Teams client. Voicemail protected by Rights Management Services is also not viewable in Teams, only in Outlook, and plays only in Outlook on the web."
---

Voicemail problems in Teams come in two forms: the message never arrives, or it arrives in Outlook and never shows up in Teams. The Microsoft Learn page on this topic separates the two as Symptom 1 and Symptom 2. This article follows it, with the commands as the page gives them. Own advice is marked.

## Symptom 1: Voicemails are not delivered anywhere

The page describes voicemails that are not delivered in Outlook clients, the Skype for Business client or the Teams client. It asks you to check Exchange mail flow rules (transport rules) and whether you use a third-party email system, such as Gmail.

### Exchange mail flow rules

Mail flow rules can affect the delivery of voicemail messages. The page says the Cloud Voice Mail service now supports mail flow rules. Its example: a rule that marks mail with MP3 attachments as spam. Such a rule filters voicemails out before they reach the Inbox. Check whether rules like that are enabled and change them.

Another case from the page: voicemail notifications with SPF failures are delivered to Exchange, but mail flow rules that analyze SPF failures can prevent delivery to the user's mailbox, and then the message is not available on any endpoint.

### Third-party email systems

The page says third-party email systems are not supported, and links its article on setting up Phone System voicemail. The main issue it names is the **FROM** address, which is formatted for PSTN calls in a way that is not RFC compliant, while Skype for Business and Teams clients filter messages by the formatting of that field. The fix on the page is to change the mail protection filter of the third-party system to use the P1 sender address, which is formatted correctly, and let these messages through.

### OpenDomainRoutingEnabled

In a remote Exchange PowerShell session, check the setting in the Exchange Online transport configuration:

```powershell
Get-TransportConfig | fl OpenDomainRoutingEnabled
```

If the value is **True**, the `Content-Class` header of voicemail messages changes from `Voice-CA` to `unauthenticatedVoice-CA`. That prevents the correct message class from being defined, so Teams cannot identify and process the messages as voicemail. The page says to submit a support request to Microsoft Support to update the setting to **False** in your tenant configuration. It describes the setting as a legacy one, used for anti-spam detection before the built-in security features for all cloud mailboxes.

### Workaround from the page

Add the cloud service IP addresses listed in the Microsoft 365 URLs and IP address ranges article, under Skype for Business Online and Microsoft Teams, to an SPF record. Alternatively, create a transport rule that bypasses spam filtering for Cloud Voicemail coming from those addresses.

## Symptom 2: Delivered to email, missing in Teams

The page describes voicemails that reach email clients such as Outlook but do not appear in the Teams or Skype for Business client.

### Start with the Teams Voicemail test

Open the Microsoft Remote Connectivity Analyzer for Teams and select **Teams Voicemail** to run the test. If the test shows no errors, but Teams still does not retrieve some or all voicemails that arrive in email, continue below. The page's example: Teams retrieves voicemail from internal callers but not from external PSTN callers, because of Exchange mail flow rules.

### Access rules

- Make sure no **Exchange Client Access Rules** block access.
- Make sure no **Exchange Web Access Policies** block access.

### Exchange email connector and message class

The page says a change made in October 2018 requires one more step when you configure Exchange on-premises support: the email item class is stripped when the message is delivered through SMTP, unless the connector is set up correctly. Skype for Business and Teams show voicemails only if the class is correct. To appear in Teams, the message class must be `IPM.Note.Microsoft.Voicemail.UM`.

Two notes from the page:

- Teams users with on-premises Exchange mailboxes can use voicemail with Teams and receive messages in Outlook, but the messages are not available to view or play in the Teams client.
- Voicemail protected by Rights Management Services is not viewable in Teams. It is viewable in Outlook, but it plays only in Outlook on the web, and transcriptions can be read only in Outlook or Outlook on the web.

### Mail flow rules and header changes

If headers are changed, the messages are not available in the voicemail folder that Teams and Skype for Business use to retrieve them. If voicemail is visible in Outlook but not in Teams, the page says the problem is likely caused by changes to the message content that keep the message out of the voicemail folder.

To investigate, use MFCMAPI from GitHub to look at the contents of the user's **Voice Mail** folder:

1. Open MFCMAPI. The bit version must match the bit version of Outlook.
2. Open the user's mailbox from the Quick Start menu.
3. Expand `Root Container\Finder`.

The page notes that third-party spam or antivirus filtering can also change voicemail headers and keep voicemails out of the folder.

## Summary table

| What you see | Check first |
| --- | --- |
| No voicemail anywhere | Mail flow rules, SPF handling, third-party mail system |
| Content-Class header shows unauthenticatedVoice-CA | OpenDomainRoutingEnabled, support request |
| Outlook yes, Teams no | Teams Voicemail test, access rules, message class, header changes |
| On-premises mailbox | Voicemail not available to view or play in Teams |
| RMS-protected voicemail | Outlook and Outlook on the web only |

## Checking order (my advice)

This is my suggestion, not the order of the page:

1. Decide which symptom you have. Check one affected user's Outlook first. That alone splits the two cases.
2. Look at mail flow rules that act on attachments, headers or SPF results, and compare their last change date with the first failure.
3. Run the OpenDomainRoutingEnabled check. It takes one command, and a True value explains the problem without any other test.
4. Run the Teams Voicemail test before you change anything on the mailbox side.
5. For the Outlook-yes, Teams-no case, compare a working voicemail and a missing one in MFCMAPI, and look at the headers and class.
6. Change one rule at a time and test with a new call, since old messages stay as they are.

## What the page does not cover

The page does not describe voicemail settings for users, greeting setup, or Teams Phone licensing. The Set up Phone System voicemail article that the page links is a starting point for those (my advice).

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Mail flow rule](https://www.m365.fm/entity/mail-flow-rule/)
- [Sender Policy Framework (SPF)](https://www.m365.fm/entity/spf/)

## Sources

- [Voicemail Messages Aren't Delivered in Teams or Skype for Business Client (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/phone-system/voicemails-not-delivered)
