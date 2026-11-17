---
title: "Setting up Entra Kerberos authentication for FSLogix profile shares"
summary: "Setting up Microsoft Entra Kerberos for an FSLogix profile share on Azure Files takes eight steps: enable it on the storage account, grant admin consent, set share and file permissions, push two client settings, and point FSLogix at the share. This runbook gives the portal paths, values and commands from Microsoft Learn, plus the errors and fixes Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [entra-kerberos-azure-files, azure-files]
keypoints:
  - "This runbook follows one order, assembled from several Learn pages: create the storage account and share, enable Microsoft Entra Kerberos, grant admin consent, exclude the storage app from MFA, set share-level and file-level permissions, configure the clients, set the FSLogix registry values, then test with a new user."
  - "Two client settings are needed on every session host: CloudKerberosTicketRetrievalEnabled = 1 under the Kerberos parameters key, and LoadCredKeyFromProfile = 1 under HKLM\\Software\\Policies\\Microsoft\\AzureADAccount. In Intune use the settings catalog, because OMA-URI does not work on multi-session devices."
  - "Cloud-only users need the kdc_enable_cloud_group_sids tag in the storage app's manifest, and their ACLs are set in the Azure portal (Manage access) or with the RestSetAcls module. icacls and File Explorer do not work for cloud-only identities."
  - "Learn documents these causes: MFA on the storage app (error 1327, enable page), a private link name missing from the app (error 1326), Assignment required switched on (AADSTS50105), and a SupportedEncryptionTypes registry value without AES (troubleshooting page)."
  - "Status differs by page: AVD what's new lists FSLogix support for cloud-only and external identities as generally available in May 2026, while the Microsoft Entra Kerberos concept page still labels its cloud-only sections Preview."
faq:
  - q: "Which role and permissions do FSLogix users need on the share?"
    a: "Learn recommends Storage File Data SMB Share Contributor as the default share-level permission for all authenticated identities, and Storage File Data SMB Share Elevated Contributor for the identities that set Windows ACLs. At file level, Learn's recommended ACLs are CREATOR OWNER with Modify on subfolders and files only, an admin group with Full Control, and the user group with Modify on this folder only. Share-level changes usually take effect within 30 minutes."
  - q: "Can I set the NTFS permissions with icacls when my users are cloud-only?"
    a: "No. The Azure Files file-level permissions page says Windows File Explorer and icacls are not supported for cloud-only identities. Use the Azure portal (Manage access on the file share) or the RestSetAcls PowerShell module, which calls the Azure Files REST API and needs no Active Directory connectivity."
  - q: "Why does the share mount fail with system error 1327 after I enable Entra Kerberos?"
    a: "Entra Kerberos does not support MFA for the file share. If a Conditional Access policy requires MFA for all apps, exclude the Entra application named after the storage account's file endpoint. Learn says that without the exclusion, mounting with net use fails with system error 1327, account restrictions are preventing this user from signing in."
---

To put FSLogix profile containers on Azure Files with Microsoft Entra Kerberos, you enable the feature on the storage account, grant admin consent to the app it creates, set share and file permissions, push two settings to the session hosts, and point FSLogix at the share. Learn says session hosts then need no line of sight to a domain controller. The ticket flow is in the [Entra Kerberos explainer](/entity/entra-kerberos-azure-files/); this runbook gives order, values and checks.

Status: AVD what's new lists FSLogix support for cloud-only and external identities as generally available in May 2026, while the Entra Kerberos concept page still labels its cloud-only sections Preview and lists "No NTFS ACL enforcement; uses Azure RBAC" for them. This runbook follows the Azure Files and FSLogix pages, which apply Windows ACLs.

## Before you start

- **One identity source per storage account.** Entra Kerberos cannot be combined with AD DS or Microsoft Entra Domain Services; Learn says disabling the current source removes identity-based access to all shares immediately.
- **Scope.** Hybrid identities work in the Azure public, US Government and 21Vianet clouds; cloud-only identities only in the public cloud. External identities: FSLogix on AVD only, public cloud only. Cross-tenant access is not supported.
- **Clients.** Session hosts must be [Microsoft Entra joined or hybrid joined](/entity/avd-entra-join/), not AD DS-only. For cloud-only identities Learn recommends at least Windows 11 26H1 with KB5079489 (build 28000.1764), or 25H2 or 24H2 with KB5079391 (26200.8116 and 26100.8116), and lists Windows Server 2025. For hybrid identities it also lists Windows 10 version 2004 or later and Windows Server 2022, all with the latest cumulative updates. Other clients need a cloud trust.
- **Services and SMB.** `WinHttpAutoProxySvc` and `iphlpsvc` must run, and the account's SMB security settings must allow Kerberos.
- **Policies.** If application management policies block symmetric key addition or limit key lifetime, grant the "Storage Resource Provider" service (app ID `a6aa9161-5291-40bb-8c5c-923b567bee3b`) an exception. Learn states the limit as below 366 days (enable page) and 365.5 days (troubleshooting page).

## Step 1: Create the storage account and file share

Create the storage account and an [Azure Files](/entity/azure-files/) share in the same region as the session host VMs, per Learn. UNC path: `\\<storage-account-name>.file.core.windows.net\<file-share-name>`.

## Step 2: Enable Microsoft Entra Kerberos

1. In the Azure portal, open the storage account and select **Classic file shares** under **Data storage**.
2. Next to **Identity-based access**, select the status. Under **Microsoft Entra Kerberos**, select **Set up**, tick **Microsoft Entra Kerberos**.
3. Optional, hybrid only: enter domain name and GUID (`DNSRoot`, `ObjectGUID` from `Get-ADDomain`) to use File Explorer for permissions. Select **Save**.

Scripted: `Set-AzStorageAccount ... -EnableAzureActiveDirectoryKerberosForFile $true`, or `az storage account update ... --enable-files-aadkerb true`.

This creates an Entra application named `[Storage Account] <name>.file.core.windows.net`. If you enabled the feature earlier through manual limited-preview steps, Learn warns the password expires every six months.

## Step 3: Consent, MFA exclusion and group tag

1. In **Microsoft Entra ID**, go to **App registrations** > **All Applications** and open the application above.
2. Under **API permissions**, select **Grant admin consent for [Directory Name]** (openid, profile, User.Read). If the button is disabled, ask a Cloud application administrator (**roles and administrators**).
3. In Conditional Access, exclude the application from policies that require MFA for all apps.
4. Do not select **Assignment required**; Learn lists it as a cause of AADSTS50105.
5. For cloud-only identities, open **Manifest** and add `kdc_enable_cloud_group_sids` to `tags`; authentication fails without it.
6. With a private endpoint, add a matching `privatelink` entry for each of the six existing `identifierUris`.

## Step 4: Share-level permissions

- **Default for all authenticated identities.** **Classic file shares** > **Identity-based access** > **Step 2: Set share-level permissions** > **Enable permissions for all authenticated users and groups**, pick the role, **Save**. The default is None and applies to every share in the account.
- **Per share.** Open the share > **Access Control (IAM)** > **Add a role assignment**.

Learn's FSLogix guidance recommends Storage File Data SMB Share Contributor for all authenticated identities and Elevated Contributor for those who set ACLs. A user gets the higher of default and assigned role; changes usually take effect within 30 minutes.

## Step 5: File and directory permissions

The more restrictive of both layers wins. Learn's recommended ACLs for FSLogix:

| Principal | Access | Applies to |
|---|---|---|
| CREATOR OWNER | Modify | Subfolders and files only |
| Admin group | Full Control | This folder, subfolders and files |
| User group | Modify | This folder only |

- **Cloud-only identities:** in the portal, open the share, select **Browse**, then **Manage access** on the root folder. Use the pencil icon, set Allow or Deny (Deny wins), **Save**. Portal edits to inheritable permissions apply only to future subitems; `Restore-AzFileAclInheritance` (RestSetAcls module) covers existing ones.
- **Hybrid identities:** the portal and RestSetAcls also work. icacls or File Explorer need a Windows device with unimpeded Active Directory connectivity and an admin mount via `net use`; Learn prefers the Storage File Data SMB Admin role over the account key. Hybrid identities must be synced to Entra ID or ACLs are not enforced.

Learn words the hybrid requirement two ways: the enable page's introduction and the concept page require domain controller line of sight, while the enable page's permissions section limits that to icacls and File Explorer, and the file-level page says the portal and RestSetAcls need none. Our reading: use those two.

Learn's cloud-only `Add-AzFileAce ... -InheritanceFlags ObjectInherit,ContainerInherit` example does not show the table's scopes; check the result against it.

## Step 6: Configure the session hosts

1. `CloudKerberosTicketRetrievalEnabled` = 1. Intune: settings catalog, `Kerberos/CloudKerberosTicketRetrievalEnabled` (OMA-URI fails on multi-session). Group Policy: set **Enabled** for `Administrative Templates > System > Kerberos > Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`. Registry, from an elevated command prompt:

```
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1
```

2. `LoadCredKeyFromProfile` = 1, so the profile can load on many VMs. Learn gives only the registry command for it, with no Intune method.

```
reg add HKLM\Software\Policies\Microsoft\AzureADAccount /v LoadCredKeyFromProfile /t REG_DWORD /d 1
```

A policy refresh or reboot applies changes. Once the first setting is on, clients cannot reach storage accounts using on-premises AD DS integration without `Kerberos/HostToRealm` mappings (uppercase realm names). Learn's FSLogix pages carry an April 2026 notice that default Kerberos encryption changes from RC4 to AES-SHA1. The FSLogix blog post it links to covers Active Directory-integrated SMB shares and does not mention Entra Kerberos; Entra Kerberos tickets always use AES-256.

## Step 7: Point FSLogix at the share

[FSLogix](/entity/fslogix/) is pre-installed on session hosts created with the Azure Virtual Desktop service. In `HKLM\SOFTWARE\FSLogix\Profiles` set `Enabled` to 1 (DWORD) and `VHDLocations` to the UNC path from Step 1. Learn's profile container page recommends `DeleteLocalProfileWhenVHDShouldApply` = 1, `FlipFlopProfileDirectoryName` = 1 and `VolumeType` = `VHDX`. The first permanently deletes a matching local profile.

## Step 8: Test

1. Sign in with a new account that has share access and an application group assignment on the host pool.
2. In the Azure portal, open the storage account > **Classic file shares** > your share and confirm a folder named `<user SID>_<username>`; with `FlipFlopProfileDirectoryName` = 1 the order is reversed.
3. If the mount fails, install AzFilesHybrid (0.3.0 or later), sign in with `Connect-AzAccount` as a user with owner permission on the storage account, and run:

```
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

It runs ten checks; `-Filter` takes a comma-separated list.

## Errors documented on Learn

| Symptom | Cause (per Learn) | Fix |
|---|---|---|
| System error 5, access denied | Share-level permissions incorrect, or other causes | Recheck Step 4 first |
| System error 1327 on `net use` | MFA Conditional Access applies to the storage app | Exclude the app |
| Error 1326 with private endpoint | Private link FQDN not in the app | Add `privatelink` entries to `identifierUris` |
| AADSTS50105 | Assignment required is on | Turn it off |
| BadRequest from Microsoft Graph when enabling | Policy on the Storage Resource Provider app blocks passwords or limits lifetime, or an app exists from preview steps | Add the policy exception, or remove the old application |
| Intermittent failures after VPN, Wi-Fi change or resume | Cached KDC proxy configuration cleared | Sign out and in, or set the KDC proxy policy below |
| Mount fails, AES-related | `SupportedEncryptionTypes` registry value excludes AES; Entra Kerberos always uses AES-256 | See the AES note |
| Cloud-only user fails | Missing `kdc_enable_cloud_group_sids` tag, or more than 1,010 group SIDs (sign-in log: 140011 KerberosUsersGroupNumberExceeded) | Add the tag; reduce group memberships |

**KDC proxy policy.** Under `Administrative Templates > System > Kerberos > Specify KDC proxy servers for Kerberos clients`, select **Enabled**, **Show**, and add value name `KERBEROS.MICROSOFTONLINE.COM` with value `<https login.microsoftonline.com:443:your_Microsoft_Entra_tenant_id/kerberos />`, keeping the space after https and before the closing slash.

**AES note.** The value is `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters\SupportedEncryptionTypes`; Learn's example 0x7 allows only DES and RC4. If not set deliberately, delete it and reboot. If deliberate, enable AES256_HMAC_SHA1 (AES128 optional) in "Network security: Configure encryption types allowed for Kerberos" and reboot.

**Sessions over about 10 hours.** Learn says access can be lost because Entra ID does not currently support TGT renewal. Mitigations: FSLogix 26.08 (31 August 2026) refreshes the Cloud Kerberos ticket in the background for Microsoft Entra-joined devices; the 10-hour lifetime stays. A cloud trust between AD DS and Entra ID gives renewable AD DS-issued TGTs, but not for cloud-native clients.

## If you manage the hosts with Nerdio

Nerdio documents two approaches; its pages differ from each other and from Learn.

- **Older workaround.** The help-center article "Use Azure Files with Entra ID-joined method for AVD" (dated 9 November 2026) calls it "a workaround until Microsoft fully supports Entra ID with Kerberos". A scripted action puts the storage account key (Key1, as a secure variable) into Credential Manager, sets `LoadCredKeyFromProfile` and disables Credential Guard; the profile settings get `AccessNetworkAsComputerObject` = 1. A note mentions a Microsoft public preview around November 2025 and says Nerdio "is working on implementing the new method natively in a future release"; it does not mention the May 2026 general availability. The script runs when a host VM is created and when it starts, and takes the key from the secure variable `FSLgxSecret`; the page does not cover key rotation. Learn cautions that `AccessNetworkAsComputerObject` is a potential security risk.
- **FSLogix profile option.** Nerdio's FSLogix settings article describes "Configure session hosts registry for Entra ID joined storage", enabling "Entra ID Kerberos functionality and Entra ID account credentials loading". Find it under **Cloud Desktops > Azure Virtual Desktop > Host Pool Profiles > New profile > FSLogix**, FSLogix Profiles storage, **Add**; the default profile is under **System > Settings > Integrations**.

A May 2026 community post describes a scripted action after host pool join that sets the two registry values. It advises a Nerdio FSLogix profile without `AccessNetworkAsComputerObject`. It tells readers to exclude the storage account's enterprise application from MFA policies, adding that the author did not need to; Learn requires the exclusion where MFA applies to all apps. It is a user report. Confirm which method your Nerdio Manager version offers.

## Sources

Retrieved 17 November 2026.

- [Learn: FSLogix profile containers on Azure Files with Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Learn: Enable Entra Kerberos for Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
- [Learn: Change the identity source](https://learn.microsoft.com/en-us/azure/storage/files/change-identity-source)
- [Learn: Share-level permissions](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-assign-share-level-permissions)
- [Learn: Directory and file-level permissions](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-configure-file-level-permissions)
- [Learn: FSLogix SMB storage permissions](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Learn: Troubleshoot identity-based authentication (SMB)](https://learn.microsoft.com/en-us/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication)
- [Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Learn: FSLogix configuration settings](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [Learn: Microsoft Entra Kerberos](https://learn.microsoft.com/en-us/entra/identity/authentication/kerberos)
- [Learn: What's new in AVD](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Learn: FSLogix profile containers in AVD](https://learn.microsoft.com/en-us/azure/virtual-desktop/fslogix-profile-containers)
- [FSLogix blog: Windows Kerberos hardening and RC4](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
- [Nerdio: Azure Files with Entra ID-joined method](https://nmehelp.getnerdio.com/hc/en-us/articles/26124360018445)
- [Nerdio: FSLogix settings and configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/25499417371661)
- [Nerdio community: Entra Kerberos for FSLogix profiles](https://nmehelp.getnerdio.com/hc/en-us/community/posts/46252599277197-Azure-Files-with-Microsoft-Entra-Kerberos-authentication-for-FSLogix-profiles-in-an-Entra-ID-joined-AVD)
