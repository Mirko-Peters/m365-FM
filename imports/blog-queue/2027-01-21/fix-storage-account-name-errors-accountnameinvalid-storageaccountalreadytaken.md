---
title: "Fix Storage Account Name Errors: AccountNameInvalid, StorageAccountAlreadyTaken and Related Deployment Codes"
summary: "Four error codes can appear when a Bicep or ARM template deploys a storage account with a bad or duplicate name. What each one means, the naming rules, the uniqueString fix with its 11-character prefix limit, and the deleted-account case, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [azure-storage-account, bicep, arm-template]
keypoints:
  - "A storage account name must be 3 to 24 characters, lowercase letters and numbers only, and globally unique across Azure."
  - "Learn lists four codes: AccountNameInvalid, InvalidResourceLocation, StorageAccountInAnotherResourceGroup and StorageAccountAlreadyTaken."
  - "Build a unique name from a prefix plus uniqueString. The function returns 13 characters, so the prefix must be 11 characters or less."
  - "A recently deleted account can block creation from a different subscription and tenant, as protection against subdomain takeover."
  - "For the deleted-account case, Learn says to create a support request with the account name and the approximate time of the failure."
faq:
  - q: "What are the rules for a storage account name?"
    a: "Microsoft Learn says the name must be between 3 and 24 characters long, use only lowercase letters and numbers, and be globally unique across Azure. Storage account names cannot be duplicated in Azure, so a name that exists in any subscription or tenant is taken."
  - q: "What does AccountNameInvalid mean?"
    a: "The name includes prohibited characters, such as an uppercase letter or a special character like an exclamation point. The example message on the Learn page says the name must be between 3 and 24 characters in length and use numbers and lower-case letters only."
  - q: "What do InvalidResourceLocation and StorageAccountInAnotherResourceGroup mean?"
    a: "InvalidResourceLocation appears when you deploy an account with the same name and in the same resource group as an existing one, but in a different location. StorageAccountInAnotherResourceGroup appears when you use the same name and location as an existing account, but in a different resource group in your subscription."
  - q: "How do I generate a name that stays unique?"
    a: "Concatenate a prefix or suffix with the value of the uniqueString function, for example the string storage plus uniqueString of the resource group ID. Learn notes that uniqueString returns 13 characters, so a prefix must be 11 characters or less to stay within 24."
  - q: "Why does deployment fail for a name I know is free?"
    a: "Learn names a second cause: the account was recently deleted. If the create request comes from a different subscription and tenant than where the account used to be, it is denied for security reasons. Learn points to guidance on preventing dangling DNS entries and says to open a support request for new account creation failures."
---

When a Bicep file or ARM template creates a storage account and the name is wrong, the deployment returns one of four error codes. Microsoft Learn names two main causes: the name breaks the format rules or duplicates an existing name, and the account was deleted recently. This article goes through each code, the naming rules and the documented fixes.

## The naming rules

The Learn page gives these criteria:

- Length between 3 and 24 characters, with only lowercase letters and numbers.
- Globally unique across Azure. A name cannot be duplicated anywhere in Azure.

The second rule is the one that surprises people: the existing account can be in your subscription, your tenant or anywhere else in Azure.

## Which error means what

| Code | Learn's description | What to check |
| --- | --- | --- |
| AccountNameInvalid | The name has prohibited characters, such as an uppercase letter or an exclamation point | Length and characters |
| InvalidResourceLocation | Same name and same resource group as an existing account, but a different location | Pick a different name, or deploy to the original location |
| StorageAccountInAnotherResourceGroup | Same name and location as an existing account, but a different resource group in your subscription | Name already used in your subscription |
| StorageAccountAlreadyTaken | Same name as a storage account that already exists in Azure | Global uniqueness |

For InvalidResourceLocation, Learn says the error shows that the account already exists and cannot be created in the new location, and that you should select a different name.

### Sample messages

The page shows the text for each code. The first one reads: *S!torageckrexph7isnoc is not a valid storage account name. Storage account name must be between 3 and 24 characters in length and use numbers and lower-case letters only.* The last reads: *The storage account named storageckrexph7isnoc is already taken.*

## Fix 1: Generate a unique name

Learn's solution for a duplicate or invalid name is to build the name from a prefix or suffix plus the `uniqueString` function. In Bicep you use string interpolation:

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
}
```

In an ARM template you use `concat` with `uniqueString`:

```json
"name": "[concat('storage', uniqueString(resourceGroup().id))]"
```

The code above follows the page's examples. The API version in the Bicep sample is the one the page shows, and the page's sample is only an excerpt, so your resource also needs its other properties.

### Watch the 24-character limit

The `uniqueString` function returns 13 characters. If you add a prefix or suffix, Learn says to use a value of 11 characters or less so the total does not exceed 24. The page limits a prefix parameter like this:

```bicep
@description('The prefix value for the storage account name.')
@maxLength(11)
param storageNamePrefix string = 'storage'
```

Then you join it with the unique value:

```bicep
name: '${storageNamePrefix}${uniqueString(resourceGroup().id)}'
```

The JSON version uses a `maxLength` of 11 on the parameter and `concat(parameters('storageNamePrefix'), uniquestring(resourceGroup().id))` for the name.

## Fix 2: The account was recently deleted

If the account was deleted recently and a request to create it comes from a different subscription and tenant than where it was before, the request is denied for security. Learn ties this to the guidance on preventing dangling DNS entries and avoiding subdomain takeover.

The resolution on the page:

1. Create a support request.
2. Choose **Create new storage account** as the problem type.
3. Choose **Failure(s) during new account creation** as the problem subtype.
4. Include the storage account name and the approximate time when creation failed.

## A check order (my advice)

This order is my suggestion, not from the Learn page:

1. Read the code first. AccountNameInvalid is purely about format, so fix that before anything else.
2. Count the characters of the final name after parameter substitution. A prefix that looks short can push the total over 24 when a suffix or environment tag is added later.
3. For the other three codes, search for the name in your own subscriptions to separate your own accounts from foreign ones. A match in your subscription points to InvalidResourceLocation or StorageAccountInAnotherResourceGroup. No match points to StorageAccountAlreadyTaken or the deleted-account case.
4. Use the resource group ID as the `uniqueString` seed only if you want the name to be stable for that resource group. Learn's examples use it, and a different seed gives a different name.
5. If the name is free and not yours but you still get the error, think about a recently deleted account and prepare the support request details.

## Limits of this page

The Learn page does not say how long the deleted-account restriction lasts, and it does not list the other places a storage name must be valid. I do not state a duration here.

## Related

- [Azure Storage account](https://www.m365.fm/entity/azure-storage-account/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [ARM template](https://www.m365.fm/entity/arm-template/)

## Sources

- [Resolve errors for storage account names (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-storage-account-name)
