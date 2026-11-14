---
title: "Deploy From GitHub Actions to Azure With Workload Identity Federation, No Secrets"
summary: "Use workload identity federation so GitHub Actions can sign in to Azure without a stored secret: how the token exchange works, what must match in the federated credential, the GitHub secrets, a sample workflow and the gaps in the Learn pages."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [entra-workload-id]
keypoints:
  - "Workload identity federation lets a workload exchange a token from an external identity provider such as GitHub for a Microsoft access token, with no secret to manage."
  - "The federated credential's issuer, subject and audience must case-sensitively match the values in the token the external provider sends."
  - "The workflow needs permissions id-token: write and the azure/login action with client-id, tenant-id and subscription-id from GitHub secrets."
  - "The audience input defaults to api://AzureADTokenExchange for public clouds. Other clouds need a different value."
  - "Only the first 100 signing keys from an external IdP are stored. Microsoft Entra ID-issued tokens cannot be used for federated flows."
faq:
  - q: "How does workload identity federation work?"
    a: "According to Microsoft Learn, the workload gets a token from the external identity provider, sends it to the Microsoft identity platform, which checks the trust relationship and validates the token against the issuer's OIDC URL, and then issues an access token for Entra-protected resources."
  - q: "Where is the trust configured?"
    a: "As a federated identity credential on a user-assigned managed identity or on an app registration."
  - q: "What must match for GitHub?"
    a: "Learn says the issuer, subject and audience of the federated credential must case-sensitively match the values in the token GitHub sends. The overview does not list the exact values, so use the linked setup articles."
  - q: "Which values do I store in GitHub?"
    a: "Learn shows secrets named AZURE_CLIENT_ID, AZURE_SUBSCRIPTION_ID and AZURE_TENANT_ID under Settings > Secrets and variables > Actions. For public repositories it recommends environment secrets."
  - q: "What permission does the workflow need?"
    a: "permissions: id-token: write, so that the job can fetch an OIDC token. The sample uses azure/login@v2."
---

Workload identity federation lets a GitHub Actions workflow sign in to Azure without a stored client secret or certificate. Microsoft Entra ID trusts tokens from GitHub, and the workflow exchanges one for an Azure access token. This guide follows the Microsoft Learn overview and the page on Azure login with OpenID Connect.

## How it works

Learn describes six steps:

1. The external workload requests a token from the external identity provider.
2. The provider issues a token.
3. The workload sends it to the Microsoft identity platform and requests an access token.
4. The platform checks the trust relationship and validates the token against the provider's OIDC issuer URL.
5. If the checks pass, it issues an access token.
6. The workload uses it to reach Entra-protected resources.

The trust is a federated identity credential, set on a user-assigned managed identity or on an app registration. The page says this removes the burden of managing credentials and the risk of leaked secrets or expired certificates.

## What must match

For GitHub Actions, the issuer, subject and audience of the federated credential must case-sensitively match the corresponding values in the token the provider sends. The overview does not list the exact values for GitHub. Use the linked articles on creating a trust with an app registration or a user-assigned managed identity, and GitHub's own OIDC guide for Azure.

## Setup outline

1. **Create the identity.** Either a Microsoft Entra application with a service principal, or a user-assigned managed identity. Copy the Client ID, Subscription ID and Directory (tenant) ID.
2. **Assign an appropriate role** to the service principal or identity. The page does not say which role or scope.
3. **Configure the federated identity credential** on the application or identity, trusting tokens issued by GitHub Actions for your repository.
4. **Create GitHub secrets.** In the repository go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret** and add `AZURE_CLIENT_ID`, `AZURE_SUBSCRIPTION_ID` and `AZURE_TENANT_ID`. For public repositories, Learn recommends environment secrets.

## Sample workflow

The page's Azure CLI sample:

```yaml
name: Run Azure CLI Login with OpenID Connect
on: [push]

jobs:
  test:
    permissions:
      id-token: write # Require write permission to Fetch an OIDC token.

    runs-on: ubuntu-latest
    steps:
    - name: Azure CLI Login
      uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
          az account show
```

Other inputs from the page: `audience` defaults to `api://AzureADTokenExchange` for public clouds, and non-public clouds need a different value such as `api://AzureADTokenExchangeUSGov`. `environment` accepts `AzureUSGovernment`, `AzureChinaCloud`, `AzureGermanCloud` or `AzureStack` and defaults to `AzureCloud`. Setting `enable-AzPSSession: true` lets later steps use `azure/powershell@v2`.

## Caveats from the overview

- Matching of issuer, subject and audience is case-sensitive.
- Microsoft Entra ID-issued tokens cannot be used for federated identity flows.
- Only the first 100 signing keys are stored when downloaded from the external provider's OIDC endpoint, so a provider exposing more may cause errors.

## Other supported scenarios

The overview lists workloads on any Kubernetes cluster, GitHub Actions, Azure compute platforms using app identities, Google Cloud, AWS, SPIFFE and SPIRE, other non-Azure platforms through the client credentials flow, and Azure Pipelines service connections.

## Why secrets are still used

This section is my reading, not a statement from the pages. The Learn page calls the three values the credentials of the application or identity and recommends GitHub secrets rather than passing the values directly to the workflow. The values are the client ID, subscription ID and tenant ID, so no client secret or certificate is stored in GitHub. The trust itself comes from the federated identity credential in Microsoft Entra ID. For public repositories, Learn recommends environment secrets instead of repository secrets.

## Before the first run (my advice)

1. Confirm the identity exists and has a role on the target scope.
2. Confirm the federated credential trusts your repository, with values that match the GitHub token exactly.
3. Confirm the three secrets exist and the workflow job has `id-token: write`.
4. Run a harmless step such as `az account show` before adding deployment steps.

## Troubleshooting order

This order is a suggestion, not from the pages. If login fails, check the three secrets first, then the `id-token: write` permission, then that the federated credential values match the token exactly, including case.

## Not covered

The pages do not give the federated credential field values for each trigger such as branch, environment or pull request, the roles to assign, step-by-step portal or CLI commands, a limit on federated credentials per application, or troubleshooting and hardening guidance. They link to other articles for these.

## Related

- [Entra Workload ID](https://www.m365.fm/entity/entra-workload-id/)

## Sources

- [Workload Identity Federation (Microsoft Learn)](https://learn.microsoft.com/entra/workload-id/workload-identity-federation)
- [Authenticate to Azure from GitHub Actions by OpenID Connect (Microsoft Learn)](https://learn.microsoft.com/azure/developer/github/connect-from-azure-openid-connect)
