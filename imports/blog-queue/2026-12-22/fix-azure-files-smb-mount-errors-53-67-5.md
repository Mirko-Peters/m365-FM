---
title: "Fix Azure Files SMB Mount Errors: System Error 53, 67, 5 and 1326"
summary: "Troubleshoot Azure Files SMB mount failures: causes and fixes for system errors 53, 67 and 5 as Microsoft Learn lists them, plus what the page says about the incorrect user name or password message."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [azure-files]
keypoints:
  - "System error 53 or 67 can occur when outbound port 445 to an Azure Files datacenter is blocked. Test it with Test-NetConnection or the AzFileDiagnostics tool."
  - "Azure Files supports only NTLMv2, so LmCompatibilityLevel under HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa must not be below the default of 3."
  - "Error 67 can also mean the share name does not exist or contains a typo."
  - "System error 5 (Access is denied) comes from unencrypted connections, storage account network rules, or wrong share-level permissions."
  - "The Learn page has no numeric error 1326. It documents the incorrect user name or password message only after a customer-initiated failover."
faq:
  - q: "What causes system error 53 when mounting an Azure file share?"
    a: "Microsoft Learn says system error 53 or 67 can occur if port 445 outbound communication to an Azure Files datacenter is blocked. A second listed cause is NTLMv1 being enabled, because Azure Files supports only NTLMv2."
  - q: "How do I test whether port 445 is blocked?"
    a: "Learn suggests the AzFileDiagnostics tool or the PowerShell command Test-NetConnection against the storage account file endpoint on port 445. TcpTestSucceeded : True in the output means the port is reachable from that client."
  - q: "What does system error 67 mean?"
    a: "It reads The network name cannot be found. Besides the blocked port and NTLM causes it shares with error 53, Learn says error 67 can occur when the storage account and SMB endpoint are reachable but the share name does not exist or has a typo."
  - q: "What does system error 1326 mean for Azure Files?"
    a: "The Learn page I read does not list a numeric error 1326. It only has a section on the message The user name or password is incorrect after a customer-initiated failover of a geo-redundant account, where clients must unmount and remount the share."
  - q: "Why do I get Access is denied (system error 5)?"
    a: "Learn lists three causes: an unencrypted connection when secure transfer is required, virtual network or firewall rules on the storage account that do not allow the client, and incorrect share-level permissions with identity-based authentication."
---

Most Azure Files mount failures come down to the network path, the authentication protocol or access rules on the storage account. This guide follows the order and wording of Microsoft's SMB connectivity troubleshooting page. One caveat up front: the page covers system errors 53, 67 and 5. It does not document system error 1326 as a numeric code, and this article says so rather than guessing at a cause.

## Quick triage

| Message | Learn lists these causes |
| --- | --- |
| System error 53: The network path was not found | Port 445 blocked, NTLMv1 enabled |
| System error 67: The network name cannot be found | Port 445 blocked, NTLMv1 enabled, share name wrong |
| System error 5: Access is denied | Unencrypted channel, VNET or firewall rules, share-level permissions |
| The user name or password is incorrect | After a customer-initiated failover, remount the share |

## System error 53 or 67: port 445 blocked

Learn says these errors can occur if outbound communication on port 445 to an Azure Files datacenter is blocked. Check from the client that fails.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "<rg>" -Name "<storage-account>"
Test-NetConnection -ComputerName ([System.Uri]::new($storageAccount.Context.FileEndPoint).Host) -Port 445
```

If the output shows `TcpTestSucceeded : True`, the port is open from that client. The page warns that the returned IP address is not guaranteed to stay the same, so do not hard-code it in scripts or firewall rules.

If the port is blocked, Learn lists these options:

1. Use Azure File Sync as a QUIC endpoint. It uses port 443 instead of 445, and Learn notes Windows Server 2022 Azure Edition supports QUIC.
2. Use a VPN or Azure ExpressRoute, and expose Azure Files on your internal network through private endpoints.
3. Ask your IT department or ISP to open port 445 outbound to Azure IP ranges.
4. Use REST-based tools such as Storage Explorer or PowerShell. REST access works over port 443.

## System error 53 or 67: NTLMv1

Azure Files supports only NTLMv2 authentication. Learn tells you to check the registry value `LmCompatibilityLevel` under `HKLM\SYSTEM\CurrentControlSet\Control\Lsa` and to make sure it is not below 3. The fix is to revert it to the default value of 3.

## System error 67 only: wrong share name

Learn says error 67 can occur when the storage account exists and the SMB endpoint is reachable, but the share path cannot be resolved. Check the share name for extra or missing characters or a bad copy from the Azure portal, then retry.

## System error 5: Access is denied

### Unencrypted communication

Learn says connections are blocked if the channel is not encrypted and the attempt does not come from the same datacenter. If **Secure transfer required** or **Require encryption in transit for SMB** is enabled, unencrypted connections inside the same datacenter are blocked too. Windows 8, Windows Server 2012 and later negotiate SMB 3.x, which supports encryption.

Options from the page:

- Connect from a client that supports SMB encryption.
- Connect from a VM in the same datacenter as the storage account.
- If the client cannot encrypt, disable both **Secure transfer required** and **Require encryption in transit for SMB** on the storage account. This lowers protection, so treat it as a last resort.

### Virtual network or firewall rules

Traffic is denied if VNET and firewall rules are configured on the storage account and the client IP address or virtual network is not allow-listed. Verify the rules. To test whether they are the cause, Learn says you can temporarily change the setting to **Allow access from all networks**, then restore your restrictions.

### Share-level permissions

With identity-based authentication, wrong share-level permissions also produce Access is denied. Validate them following the Azure Files section on assigning share-level permissions.

## About error 1326

Error 1326 is the Windows message The user name or password is incorrect. The Learn SMB connectivity page has no numeric 1326 section. It has one related heading: after a customer-initiated failover on geo-redundant storage accounts, the failover does not retain file handles and leases, so clients must unmount and remount the shares.

For other 1326 cases, such as a wrong storage account key or identity-based authentication problems, the pages I read do not give steps. Use the Azure Files identity-based authentication troubleshooting pages for those, and do not assume the cause from the number alone.

## Suggested order of checks

1. Run `Test-NetConnection` on port 445 from the failing client.
2. Confirm the share name character by character.
3. Check `LmCompatibilityLevel` is 3 or higher on the client.
4. Check the storage account network settings and **Secure transfer required**.
5. For Access is denied, check share-level permissions for the signed-in identity.
6. After a failover, unmount and remount.

## Related

- [Azure Files](https://www.m365.fm/entity/azure-files/)

## Sources

- [Troubleshoot Azure Files SMB connectivity and access](https://learn.microsoft.com/troubleshoot/azure/azure-storage/files/connectivity/files-troubleshoot-smb-connectivity)
