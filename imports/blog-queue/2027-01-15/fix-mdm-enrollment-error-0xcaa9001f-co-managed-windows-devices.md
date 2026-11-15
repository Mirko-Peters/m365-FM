---
title: "Fix MDM Enrollment Error 0xCAA9001F on Co-Managed Windows Devices"
summary: "Error 0xCAA9001F, Integrated Windows authentication supported only in federation flow, hits hybrid joined, co-managed devices when Configuration Manager has no Cloud Management Azure service or lacks AD and Entra user discovery. Learn the logs, the cause and the fix."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [intune, configuration-manager, co-management]
keypoints:
  - "Learn describes MDM enrollment failing with 0xcaa9001f for Microsoft Entra hybrid joined devices that are co-managed with Configuration Manager."
  - "CoManagementHandler.log shows Integrated Windows authentication supported only in federation flow and a retry in 15 minutes."
  - "The cause is integrated Windows authentication being tried against Entra ID while the verified domain is not federated."
  - "Learn names two situations: no Cloud Management Azure service in Configuration Manager, or AD User Discovery or Entra user Discovery not enabled for the users."
  - "The fix is to configure Azure Services for Cloud Management and enable both discovery methods; BYOD and Group Policy auto-enrollment still work."
faq:
  - q: "Where do I see the error?"
    a: "Microsoft Learn lists three places. In the Configuration Manager client log CoManagementHandler.log under CCM logs, the message MDM enrollment failed with error code 0xcaa9001f. In Event Viewer under DeviceManagement-Enterprise-Diagnostic-Provider Admin, Auto MDM Enroll: Failed with the same code. And in Microsoft Entra ID Operational, an HTTP 400 on the oauth2 token endpoint with AADSTS70002 and AADSTS50155: Device is not authenticated."
  - q: "What is the cause?"
    a: "Integrated Windows authentication is tried by the Configuration Manager client against Microsoft Entra ID while the verified domain is not federated."
  - q: "What are the two situations Learn names?"
    a: "The Cloud Management Azure service is not configured in Configuration Manager, or either AD User Discovery or Microsoft Entra user Discovery is not enabled for the affected users. Learn says both discovery methods must be enabled."
  - q: "What is the fix?"
    a: "Configure Azure Services for Cloud Management in Configuration Manager, and make sure both AD User Discovery and Microsoft Entra user Discovery are enabled for the users."
  - q: "Do other enrollment paths work?"
    a: "Learn notes that bring your own device enrollment and auto-enrollment by using Group Policy work successfully in this situation, which helps separate this problem from a general Intune enrollment outage."
---

Error 0xCAA9001F during MDM enrollment of a co-managed, Microsoft Entra hybrid joined Windows device means the Configuration Manager client tried integrated Windows authentication against Microsoft Entra ID while the verified domain is not federated. Microsoft Learn names two causes: the Cloud Management Azure service is not configured in Configuration Manager, or AD User Discovery or Microsoft Entra user Discovery is not enabled for the affected users. The fix is to configure the Azure service and enable both discovery methods. This guide follows the Learn page for this error and adds context from the Azure Services Wizard page.

## Symptoms

MDM enrollment fails for co-managed Windows devices that are Microsoft Entra hybrid joined and managed by Configuration Manager. Learn lists three places where the error appears.

**Configuration Manager client log.** In `%WinDir%\CCM\logs\CoManagementHandler.log`:

> MDM enrollment failed with error code 0xcaa9001f 'Integrated Windows authentication supported only in federation flow.'. Will retry in 15 minutes...

**Windows Event Viewer, device management log.** Under **Applications and Services Logs** > **Microsoft** > **Windows** > **DeviceManagement-Enterprise-Diagnostic-Provider** > **Admin**, an entry with the system migration task, the impersonation result "An attempt was made to reference a token that does not exist" and **Auto MDM Enroll: Failed (Unknown Win32 Error code: 0xcaa9001f)**.

**Windows Event Viewer, Entra log.** Under **Applications and Services Logs** > **Microsoft** > **Windows** > **Microsoft Entra ID** > **Operational**, an HTTP 400 on a POST to the tenant's `oauth2/token` endpoint on `login.microsoftonline.com`, with the OAuth response error `invalid_grant` and the description `AADSTS70002: Error validating credentials. AADSTS50155: Device is not authenticated.`

Learn adds a note that helps narrow the problem: bring your own device (BYOD) enrollment and auto-enrollment by Group Policy work successfully in the same environment.

## Cause

Integrated Windows authentication is tried by the Configuration Manager client against Microsoft Entra ID while the verified domain is not federated. Learn says this happens in one of two situations:

- The Cloud Management Azure service is not configured in Configuration Manager.
- Either AD User Discovery or Microsoft Entra user Discovery is not enabled for the affected users. Both discovery methods must be enabled.

## Solution

Configure Azure Services for Cloud Management, and make sure both AD User Discovery and Microsoft Entra user Discovery are enabled for the users.

### What the Azure Services Wizard does

Learn's page on the wizard says it simplifies configuring Azure cloud services for Configuration Manager by using Microsoft Entra web app registrations. The **Cloud Management** service lets the site and clients authenticate by using Microsoft Entra ID, which supports scenarios such as Microsoft Entra user Discovery and some cloud management gateway scenarios.

To start it, in the Configuration Manager console go to **Administration** > **Cloud Services** > **Azure Services**, then on the ribbon select **Configure Azure Services**. Give the object a name, choose the service, then pick the Azure environment and the apps.

The wizard uses two Microsoft Entra apps. A web app, also called a server app in Configuration Manager, and a native app, called a client app. For each you can reuse an existing app, import one created in the Azure portal, or create one from the wizard. Points to know from Learn:

- Before you import a web app, an Azure administrator must create it in the Azure portal. Discuss the choice between creating the apps manually and letting Configuration Manager create them with your Microsoft Entra admin first.
- When you create a server app, the **App ID URI** must be unique in your Microsoft Entra tenant. Learn recommends the formats `api://{tenantId}/{string}` or `https://{verifiedCustomerDomain}/{string}` instead of the default.
- The secret key validity period for a created app is 1 year or 2 years, with 1 year as the default.
- If a Conditional Access policy applies to **All Cloud apps**, you must exclude the server application from that policy.
- For an imported app, console notifications do not warn you about an upcoming secret key expiration.
- When the key expires, Configuration Manager cannot authenticate with Microsoft Entra ID and connected Azure services stop working. Renew the key before then.

After the apps, the wizard moves to the **Discovery** page for Cloud Management, which links to the Microsoft Entra user Discovery configuration. Complete the Summary, Progress and Completion pages to finish.

You also need to update application settings so clients can request a Microsoft Entra device token and so the **Reading directory data** permission applies: **Administration** > **Cloud Services** > **Microsoft Entra tenants**, select the tenant, select the web server application, then **Update Application Settings** and confirm with **Yes**.

Learn notes that, starting with Configuration Manager 2409, Azure services use Microsoft Graph, and that signing in to renew the secret key requires consent for the Graph `Directory.Read.All` permission. The Cloud Application Administrator role cannot grant that. Use an account with the Global Administrator role or another role that can grant admin consent for Microsoft Graph permissions, such as Privileged Role Administrator.

## Verify the fix

This section is my advice, not a Microsoft statement.

1. Confirm in the console that the Cloud Management service exists under **Azure Services** and that both discovery methods list the affected users.
2. On an affected device, watch `CoManagementHandler.log`. The failing entry says it retries in 15 minutes, so the next attempt tells you whether the change worked without a reboot.
3. Check the Entra Operational log for the 400 and AADSTS70002 or AADSTS50155 messages. If they are gone and enrollment completes, you are done.
4. If the error persists, verify that the affected devices are in the right collection for co-management and that the users appear in discovery results. Learn's page does not say more than the two situations above, so collect the logs before asking Microsoft support.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Configuration Manager](https://www.m365.fm/entity/configuration-manager/)
- [Co-management](https://www.m365.fm/entity/co-management/)

## Sources

- [MDM enrollment error 0xcaa9001f for co-managed Windows devices - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/mdm-enrollment-error-0xcaa9001f)
- [Configure Azure services - Configuration Manager (Microsoft Learn)](https://learn.microsoft.com/intune/configmgr/core/servers/deploy/configure/azure-services-wizard)
