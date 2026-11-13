---
title: "Windows 365: Virtual Network Deployment Fails with a Policy Violation"
summary: "Creating the Azure virtual network for a Windows 365 network connection fails with a policy violation even though you are Owner. Find the denying Azure Policy assignment and pick a region it allows."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [windows-365, intune, azure-policy, azure-virtual-network]
keypoints:
  - "The words 'template deployment failed because of policy violation' point to Azure Policy, not to Intune, licensing or your Azure role."
  - "Azure Policy is an explicit deny system: having permission to create a resource does not override it, and a deny can only be lifted by changing the assignment that causes it."
  - "In the thread, the subscription view showed no assignments while the deny came from an assignment on a management group, so check the parent scopes too."
  - "The virtual network must be in a Windows 365 supported region and the same region as the Cloud PCs. If the policy is a location restriction, as in the thread, deploying to an allowed region is one way out."
faq:
  - q: "Why does the deployment fail when I am Owner of the subscription?"
    a: "Microsoft Learn says that even if an individual has access to perform an action, Azure Policy still blocks the create or update when the result is a non-compliant resource, and that the only way to allow a denied resource is to modify the denying assignment. In practice that means editing the assignment, for example its scope or its exclusions, or, if it is a location restriction, deploying to a location it allows."
  - q: "Does the Windows 365 network connection health check look at Azure Policy?"
    a: "Yes, in part. The Azure tenant readiness check on Microsoft Learn verifies that the subscription is enabled and ready for use and that no Azure policy restrictions block the creation of Windows 365 resources. It is a check of the network connection, so it does not replace reading the error of the failed virtual network deployment."
  - q: "Does the virtual network have to be in the same region as the Cloud PCs?"
    a: "Microsoft Learn says the virtual network must be in the same region as the Cloud PCs. The Azure virtual network readiness check also verifies that the region is supported by Windows 365."
  - q: "Do I need an Azure virtual network at all?"
    a: "Only if you want the Cloud PCs on your own network. Windows 365 also offers a Microsoft-hosted network. In the thread, a responder said it needs no Azure subscription or virtual network of your own and suggested it for a proof of concept that does not need internal resources. Confirm the details on the current Windows 365 deployment pages."
---

You want Windows 365 Cloud PCs on your own network. The first step is an Azure virtual network and subnet, followed by an Azure network connection (ANC) in the Intune admin center. The virtual network deployment fails in the Azure portal. The message says the template deployment failed because of a policy violation.

A Microsoft Q&A thread from September 2026 shows this in a tenant created for a proof of concept. The asker was Owner of the subscription, found no policy assignments on the subscription's policy page, and suspected that a trial tenant could not use network connections. The policy event that the asker posted showed a deny assignment that blocks resource creation in West Europe, assigned on a management group. This article explains how to find that kind of block and what to do about it. It is not an official Microsoft procedure. The thread has one main responder, the answer was accepted, but the asker never confirmed that a deployment or the network connection worked afterwards, so read it as a worked example, with Microsoft Learn as the authority.

## Symptoms

- The virtual network deployment in Azure fails with a validation error that mentions a policy violation.
- In the thread, a virtual network deployment to another region (Central India) worked.
- Owner or Contributor rights on the subscription make no difference.
- In the thread, the subscription's **Policy** page showed zero assignments.

## What the message means

Microsoft Learn describes Azure Policy as an explicit deny system. If any assignment results in a resource being denied, the only way to allow the resource is to modify the denying assignment. Learn also says that even if an individual has access to perform an action, Azure Policy still blocks the create or update when the result is a non-compliant resource. The way out is to change the denying assignment, not to add more permissions.

Assignments are inherited. Learn says all child resources inherit an assignment, and an assignment can sit on a management group, a subscription, a resource group or a resource. So a deny can come from above the subscription.

## Step 1: Read the real error

1. In the Azure portal, open the resource group you deployed to, then **Deployments**, and select the failed deployment.
2. Open the deployment details and the failed operation. Copy the error code, the message and the inner error text. Remove IDs before you share them.
3. Look for the policy assignment name and the policy definition name in the details or in the activity log. The Learn page on the error `RequestDisallowedByPolicy` says that the error message and the activity log show the error code, the policy assignment and the policy definition, and that the name of each is the last segment of its `id`.

In the thread, the details showed a definition that denied resource creation in West Europe, assigned at management group scope.

## Step 2: Check all scopes

1. Open **Policy** in the Azure portal, then **Assignments**.
2. Change the scope filter and look at the subscription, the resource group and the management groups above them.
3. Find the assignment named in the error. Check its definition, its effect, the allowed or denied locations, and whether it has exclusions.

In the thread, the subscription page showed zero assignments, but the policy event posted by the asker showed that the denying assignment sat on a management group. The responder said that the zero view does not prove that no policy applies. Learn says that all child resources inherit an assignment, but it does not describe this portal view or explain why the subscription view was empty, so verify it in your tenant.

The thread's advice was also not to create an exemption or turn off the policy until you know why it exists. Learn describes exclusions (the `notScopes` property on the assignment, typically used to permanently bypass evaluation for a broad scope) and exemptions (a child object that can be set to expire with `expiresOn`, and resources show as Exempted in compliance reports). Whoever owns governance should make that decision.

## Step 3: Pick a region that works

Windows 365 has its own rules for the network:

- The virtual network must be in the same region as the Cloud PCs, and in a region that Windows 365 supports. The health check named "Azure virtual network readiness" verifies the supported region.
- The subnet needs free IP addresses. For disaster recovery purposes, Learn says to make sure that at least 50% of the IP addresses in the subnet are available.

If the denying assignment is a location restriction, as in the thread, deploy the virtual network in a region the policy allows, as long as that region is also a good one for your users and Windows 365 supports it. In the thread, the asker reported that a virtual network in Central India deployed without problems. The thread does not say whether the network connection was created afterwards.

If you must use the blocked region, ask the owner of the policy to change the assignment: widen the allowed locations, or add an exclusion for the resource group that will hold the Windows 365 resources.

## Step 4: Create the network connection

After the virtual network exists:

1. In the **Microsoft Intune admin center**, go to **Devices**, **Provision Cloud PCs**, **Azure network connection**, then **Create**.
2. Choose **Microsoft Entra Join** or **Hybrid Microsoft Entra Join**.
3. Enter a unique name, then pick the subscription, resource group, virtual network and subnet. Learn recommends a new resource group for the connection.
4. For a hybrid join, enter the domain details and a join account in UPN format.
5. Select **Create**.

Learn says connecting the ANC gives the Windows 365 service three roles: Reader on the subscription, Windows 365 Network Interface Contributor on the resource group, and Windows 365 Network User on the virtual network. To create the first connection, Learn says you need the Subscription Owner or User Administrator role in the subscription that holds the virtual network (Learn's wording; it does not use the Azure role name User Access Administrator), and later connections only need the Subscription Reader role. You also need the Intune Administrator or Windows 365 Administrator role. The thread's responder listed the same three roles.

## Step 5: Read the health check result

Learn says to wait for the health checks to complete before you assign the ANC to a provisioning policy, and that an ANC in a failed state cannot be used. Checks run once every one to six hours, and the full check can take up to 30 minutes. To rerun a check after a fix, go to **Devices**, **Windows 365** (under Provisioning), **Azure network connection**, select the connection, then **Retry**.

Three checks matter here:

- **Azure tenant readiness**: subscription enabled and ready, and no Azure policy that blocks creation of Windows 365 resources.
- **Azure virtual network readiness**: the network is in a supported region.
- **First-party app permissions** on subscription, resource group and virtual network.

For a failed check, Learn tells you to select **View details**, fix the underlying issue and retry the health check.

## Is the trial tenant the problem?

The asker in the thread wondered about the trial. The responder wrote that an ANC with a customer-managed network is supported if the Azure subscription and the Windows 365 setup meet the requirements, and that the tenant's home geography does not by itself explain the failure. Learn says an Azure subscription is required when you pick a virtual network. Check that you have a working Azure subscription with the right roles.

## Option: use a Microsoft-hosted network

If the Cloud PCs do not need to reach internal resources, the thread's responder suggested the Microsoft-hosted network. The Learn network requirements page also refers to Microsoft-hosted network deployments and says that Microsoft manages the underlying connectivity for that model. It does not say whether an Azure subscription is needed, so read the Windows 365 deployment pages before choosing it.

## Verification

- The virtual network deployment succeeds in the allowed region.
- The ANC passes the first health check and can be assigned to a provisioning policy.
- A test Cloud PC provisions and gets an address from the subnet.

## Limits

- This guide covers a policy deny. It does not cover hybrid join problems, DNS or file share issues on Cloud PCs. Those need their own checks.
- The thread had no final confirmation. The fix (use an allowed region if the policy is a location restriction, or change the policy) follows from the Learn statement that only a change to the denying assignment lifts a deny, and from the policy event posted in the thread. Whether the network connection then works was not reported.
- The Learn page on creating an ANC says nothing about supported regions. Use the current Windows 365 documentation for the list.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Microsoft Learn: Create an Azure network connection for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/create-azure-network-connection)
- [Microsoft Learn: Azure network connection health checks in Windows 365](https://learn.microsoft.com/en-us/troubleshoot/windows-365/health-checks)
- [Microsoft Learn: Azure network connections in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/azure-network-connections)
- [Microsoft Learn: Troubleshoot the RequestDisallowedByPolicy error](https://learn.microsoft.com/en-us/azure/azure-resource-manager/troubleshooting/error-policy-requestdisallowedbypolicy)
- [Microsoft Learn: Windows 365 network requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/requirements-network)
- [Microsoft Learn: What is Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Microsoft Learn: Azure Policy scope](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope)
- [Microsoft Q&A: Unable to deploy virtual network for M365 Cloud PC in trial tenant (September 2026)](https://learn.microsoft.com/en-us/answers/questions/6008822/unable-to-deploye-virtual-network-for-m365-cloud-p)
