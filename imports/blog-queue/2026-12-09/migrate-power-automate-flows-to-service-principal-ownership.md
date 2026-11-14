---
title: "Migrate Power Automate Flows From Personal Connections to a Service Principal: Step by Step"
summary: "Move business-critical Power Automate flows off personal accounts: put them in solutions, create an application user, share connections, change the owner and sort out licensing. Covers connection references and limits, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [power-automate, service-principal, connection-references]
keypoints:
  - "Only solution-aware flows can have their owner changed. Non-solution flows must be added to a solution first, which needs Dataverse."
  - "Create an application user for the Entra app registration, share the connections with it, then set it as the flow's Owner under Details > Edit."
  - "Share the flow's connections with the application user so it can run the flow. Connector support for service principals varies, so check each connector first."
  - "A service principal application user cannot hold a user license. Learn lists pay-as-you-go, associating the flow to an app, a Process license or a flow group."
  - "Learn's ALM guidance says that in production environments, service principals should own all flows."
faq:
  - q: "Can I change the owner of any cloud flow?"
    a: "No. Microsoft Learn says the flow must be solution-aware. For a non-solution flow, the owner is part of the flow identity and cannot be changed in place. With Dataverse, add the flow to a solution first. Without Dataverse, create a new flow by export and import, Save as or Send a copy."
  - q: "Can a service principal be a co-owner of a flow?"
    a: "No. Microsoft Learn states that you cannot make a service principal application user a co-owner, and it will not appear in the Owners edit dialog. It can be set as the Owner by using Details, Edit and replacing the Owner."
  - q: "What must be shared before the service principal can run the flow?"
    a: "Learn says you need to share the flow's connections with the service principal application user for it to run the flow successfully. On the Connections page you select the connection, choose Share, enter the user and give Can use permission."
  - q: "How long does a change of owner take to apply to licensing?"
    a: "For scheduled or automated flows, Learn says the flow runs under the license and request limits of the new owner, and the change can take up to seven days to become effective. Editing and saving the flow makes it take effect immediately."
---

To move a Power Automate flow from a personal account to a service principal, the flow has to be in a solution. Then you create an application user for the Entra app registration, share the flow's connections with that user, change the flow's owner and fix licensing. Microsoft's guidance is that critical or long-running flows should be owned by a service principal so they keep running when people leave. The steps below follow Microsoft Learn.

## Why move at all

Learn's guidance on flow ownership says flows can be owned by a service principal or a user account. Service principals are not tied to individuals, so flows continue to run when employees leave, permissions can be limited to what is needed, and the audit trail is clearer. User accounts are easier to set up and fit flows that need human interaction or a user's own context. The best practice stated is: use a service principal for critical or long-running flows, and a user account for user-specific or interactive ones. The solution-aware flows page adds that in production environments, service principals should own all flows.

## Step 1: Put the flows in a solution

Learn says the owner of a flow can only be changed when it is solution-aware. The owner is part of the identity of a non-solution flow.

- With Dataverse, add the existing cloud flow into a solution.
- Without Dataverse, create a new non-solution flow by export and import, Save as or Send a copy.

Solutions also bring connection references. Learn describes a connection reference as a solution component that points to a connection, so you can change the connection by editing the reference instead of every action. If a flow outside a solution is added to an unmanaged solution, exported and imported, its connections are replaced with connection references. In a solution, the flow checker shows a **Use connection references** warning with an action that removes connections so references can be created.

## Step 2: Create the application user

Learn's steps in the Power Platform admin center:

1. Go to **Environments**, select the environment, then **Settings** > **Users + permissions** > **Application users**.
2. Select **New app user**, then **Add an app** and pick the Entra app registration.
3. Choose a **Business Unit** and enter an **Email address**.
4. Select the security roles for the user and save.
5. Select **Create**.

Only app registrations appear in the list, not enterprise applications. An environment can have one application user per registered application. Assign custom roles that cover only what the flows need. A Microsoft Tech Community blog on service principals, which is not official documentation, recommends avoiding System Administrator and using separate service principals per solution area.

## Step 3: Share the connections

Learn says you must share the flow's connections with the application user for it to run the flow. A connection reference's connection can be shared manually:

1. In Power Apps, select the environment and then **Connections**.
2. Select the connection and choose **Share**.
3. Enter the service principal user and select **Can use**.
4. Select **Save**.

Learn's connection reference page notes that OAuth connections can only be explicitly shared with a user representing a service principal. It also says that the user who turns on a flow must own or have permission to use all its connections. If the user lacks permission for one, you can see a `ConnectionAuthorizationFailed` error.

Whether a connector can run under a service principal depends on the connector. The Tech Community blog says Dataverse is the only standard connector with native service principal sign-in, and that connectors such as SharePoint, Outlook and Teams often need a user context. Treat that as a community claim and check the connector's documentation before you migrate flows that depend on it. Learn's pipelines documentation does mention service principal connections for connectors that support them, including custom connectors.

## Step 4: Change the owner

1. Sign in to Power Automate. Select **My flows** or find the flow in its solution.
2. Open the flow and, in the **Details** section, select **Edit**.
3. Replace the **Owner** with the service principal application user.
4. Turn the flow on so it is ready to run.
5. Adjust licensing.

The person making the change needs to be an owner or co-owner who is an admin or has a role with the `prvChangeOwnerIdOfWorkflow` privilege. Learn says that after an ownership change, the original and new owner become co-owners for user owners, but a service principal cannot be a co-owner.

## Step 5: Deal with licensing

Learn explains that a service principal application user is a non-interactive user and cannot have a user license. It is subject to non-licensed user limits. Documented options are:

- Pay-as-you-go.
- Associating the flow to an app.
- A Power Automate Process license.
- Sharing a Process license across multiple flows with a flow group.

For scheduled or automated flows, the flow runs under the new owner's license and request limits. The change can take up to seven days to take effect, or immediately if you edit and save the flow. The Tech Community post gives price figures, but it says they are approximate, so confirm costs with Microsoft.

## Step 6: Plan for the future

- Use environment variables and connection references so deployments do not depend on personal connections. Learn's ALM guidance says to deploy only managed solutions to test and production.
- Pipelines can deploy with service principals, so makers do not need elevated rights in target environments.
- A service principal's client secret or certificate has an expiry date. The Tech Community post says only that credential has an expiration and recommends a vault with alerts. The pages read do not describe a rotation procedure.
- Connection reference ownership cannot be transferred from the Solutions area in Power Apps.

## Common problems

1. **Flow turns off or fails after the switch.** Check that connections were shared and are valid. Learn describes "Invalid Connection" as an underlying connection in a bad state.
2. **Service principal missing from the Owners dialog.** This is expected for co-owners. Use the Owner field instead.
3. **Premium features warning.** For user owners without a premium license, Learn describes a 30-day grace period before the flow is turned off.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Service principal](https://www.m365.fm/entity/service-principal/)
- [Connection references](https://www.m365.fm/entity/connection-references/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)

## Sources

- [Microsoft Learn: Change the owner of a cloud flow](https://learn.microsoft.com/en-us/power-automate/change-cloud-flow-owner)
- [Microsoft Learn: Understand access to flows](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/understand-access-to-flows)
- [Microsoft Learn: Understand the benefits of solution-aware flows](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/understand-benefits-solution-aware-flows)
- [Microsoft Learn: Create connection references](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference)
- [Microsoft Learn: Manage application users](https://learn.microsoft.com/en-us/power-platform/admin/manage-application-users)
- [Microsoft Learn: Pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)
- [Microsoft Tech Community: Service principals in Microsoft Power Platform](https://techcommunity.microsoft.com/blog/microsoftmissioncriticalblog/service-principals-in-microsoft-power-platform/4516482)
