---
title: "Teams Phone Survivable Branch Appliance (SBA): Requirements, PowerShell Setup and Known Limits During Outages"
summary: "How the Direct Routing Survivable Branch Appliance keeps PSTN calling working in a branch when the internet link fails: prerequisites, the four configuration steps with PowerShell, supported clients, available call features and the known limits including emergency calls."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [teams-phone, teams, app-registration]
keypoints:
  - "A Survivable Branch Appliance is code from Microsoft that SBC vendors embed in their firmware or ship separately. You get it from your SBC vendor, and the SBC must use Media Bypass."
  - "Configuration is PowerShell only: create the SBA and a branch survivability policy, grant it to users, and register one Entra application. The Teams admin center does not support it yet."
  - "SBA mode works on Teams for Windows, macOS and Teams Phones, only on a physical machine. Virtual machines and web clients are not supported."
  - "Emergency calls are limited in SBA mode: location is not shared, and Emergency Call Routing Policies are not supported, so emergency dial strings need a matching route."
  - "With Continuous Access Evaluation tokens the SBA works for only about 30 minutes. Learn names disabling CAE for the tenant as an alternative."
faq:
  - q: "Does the SBA work for Calling Plans or Operator Connect?"
    a: "The Learn page describes the SBA for customer sites that use Direct Routing to connect to Teams Phone, with an SBC providing PSTN connectivity. It does not describe Calling Plans or Operator Connect for the SBA."
  - q: "What do users see during an outage?"
    a: "The Teams client switches to the SBA automatically and ongoing calls continue. The only UI indicator is a banner that informs users of the switch to Appliance mode. If the banner is not there, the user is not in SBA mode and calling will not work."
  - q: "Which Teams clients support SBA mode?"
    a: "Learn lists Teams for Windows desktop, Teams for macOS desktop and Teams Phones. SBA mode activates only on desktop clients on a physical machine, and VMs and web clients are not supported."
  - q: "Which ports must be open?"
    a: "Learn lists ports 3443, 4444 and 8443 for the SBA server to Teams clients, 5061 (or the port configured on the SBC) to the SBC, UDP 123 to the NTP server and 443 to Microsoft 365. TLS 1.2 must be enabled on the SBA VM operating system."
  - q: "Can users make emergency calls in SBA mode?"
    a: "Users can still make emergency calls, but location information is not shared. Learn also says the SBA does not support Emergency Call Routing Policies, and emergency dial strings are sent without a plus sign, so a matching pattern must exist in the regular voice routing policy."
---

A Survivable Branch Appliance (SBA) lets Teams users in a branch keep making and receiving PSTN calls through the local Session Border Controller (SBC) when the branch loses its internet connection but the local network still works. Microsoft Learn documents the requirements, four configuration steps in PowerShell and a list of known limits. This article follows that page. It applies to Direct Routing, and the page does not describe any other calling model for the SBA.

## What the SBA is

The SBA is distributable code from Microsoft. SBC vendors embed it in their firmware or distribute it separately to run on a VM or hardware. Learn says to contact your SBC vendor for the latest SBC firmware with the embedded SBA. Vendor documentation links on the page cover AudioCodes, Ribbon, Oracle and TE-Systems.

## Prerequisites

- The SBC is configured for Media Bypass, so the Teams client in the branch can have media flowing directly with the SBC.
- TLS 1.2 is enabled on the SBA VM operating system.
- Firewall allows ports 3443, 4444 and 8443 (SBA server to Teams client), port 5061 or the SBC's configured port (SBA server to SBC), UDP port 123 (NTP) and port 443 (Microsoft 365).
- Azure IP ranges and service tags for the public cloud are defined according to the Learn guidelines.

## How it works

- During an internet outage, the Teams client automatically switches to the SBA and ongoing calls continue without interruption. The user does not need to act.
- The client needs two conditions: the user has the branch survivability policy for an SBA that is up, and the device has lost internet but is still connected to the SBA.
- After the switch, a banner is shown. It is the only UI indicator. No banner means no SBA mode and no calling.
- When the client detects that the internet is back and outgoing calls are finished, it falls back to normal operation. The SBA uploads Call Data Records to the cloud and call history is updated for the tenant administrator.
- SBA mode activates only on desktop clients on a physical machine. VMs and web clients are not supported at the moment. Supported clients are Teams for Windows, Teams for macOS and Teams Phones.

Available calling functionality in offline mode, from the page: making and receiving PSTN calls through the local SBA and SBC, hold and resume, blind transfer, call forwarding and unanswered call forwarding to a single number or Teams user, redirecting incoming PSTN calls for a call queue or auto attendant number to a local agent or an alternative queue or auto attendant number, VoIP fallback to PSTN, and VoIP calls between local users registered behind the same SBA.

## Configure the SBA

Learn says to use Teams PowerShell cmdlets for all configuration, because the Teams admin center does not yet support the feature. The steps:

1. **Create the SBAs** with `New-CsTeamsSurvivableBranchAppliance`. Parameters are `Identity`, `Fqdn`, `Site` (the TenantNetworkSite), and `Description`. Example from the page: `New-CsTeamsSurvivableBranchAppliance -Fqdn sba1.contoso.com -Description "SBA 1"`.
2. **Create the branch survivability policy** with `New-CsTeamsSurvivableBranchAppliancePolicy`, using `Identity` and `BranchApplianceFqdns`. The policy can contain one or more SBAs. Add or remove SBAs with `Set-CsTeamsSurvivableBranchAppliancePolicy` and `@{add=...}` or `@{remove=...}`.
3. **Assign the policy to users** with `Grant-CsTeamsSurvivableBranchAppliancePolicy -PolicyName <name> -Identity <user>`. Grant the `$Null` policy to remove it.
4. **Register an application for the SBA in Microsoft Entra ID.** You need one application for all SBAs in your tenant, and you need its Application (client) ID and client secret.

Settings Learn lists for the application:

- Name of your choice, supported account types set to the organizational directory only.
- Web redirect URI `https://login.microsoftonline.com/common/oauth2/nativeclient`.
- Implicit grant tokens for access tokens and ID tokens.
- API permission **Skype and Teams Tenant Admin Access** > **Application permissions** > `application_access_custom_sba_appliance`.
- Client secret with any description and expiration. Copy it immediately after creating it.

The author's note: a client secret has an expiry that you choose, so put the expiry date in your operations calendar. Learn does not discuss rotation.

## Known issues and limits

From the Learn page:

- The SBA supports expired client authentication tokens for up to seven days from token expiration.
- The client can reconnect to the SBA with locally cached authentication information, even after a Teams restart or reboot, if the information was cached before the outage and is still within the supported period.
- The client cannot validate itself with an SBA it has not connected to within the last 24 hours.
- Unsupported in SBA mode: switching the Teams client to another tenant, sharing location during an emergency call, Emergency Call Routing Policies, and reverse number lookup against Microsoft Entra contacts (a dialed number is still processed and routed over PSTN).
- Emergency calls: users can still call, but location is not shared. EMER dial strings bypass normalization and are sent without a plus sign. If the regular voice routing policy has no pattern that matches them, emergency calls through the SBA fail.
- If the tenant uses Continuous Access Evaluation tokens, the SBA is operational for only about 30 minutes. An alternative is to disable CAE for the tenant.
- New SBAs might take time before they can be used in policies, and a policy assignment might take time to appear in `Get-CsOnlineUser`.
- Report issues to your SBC vendor's support and mention the configured SBA.

## What the documentation does not say

The page does not provide SBC-specific steps, sizing, or a test procedure for simulating an outage. It also does not say how many users an SBA supports. For testing, the author suggests disconnecting a pilot branch from the internet during a maintenance window and checking for the banner, an inbound call and an outbound call. Check the emergency number routing in particular, because of the pattern requirement above.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [App registration](https://www.m365.fm/entity/app-registration/)

## Sources

- [Direct Routing SBA, Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-survivable-branch-appliance)
