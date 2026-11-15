---
title: "Set Up Financial Dimensions in Dynamics 365 Finance: Custom and Entity-Backed"
summary: "Create and activate financial dimensions in Dynamics 365 Finance: custom versus entity-backed dimensions, naming rules, format masks, activation, legal entity overrides and the dimension service deprecation notice."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [dynamics-365]
keypoints:
  - "Create dimensions at General ledger > Chart of accounts > Dimensions > Financial dimensions. Choose Custom dimension or an entity in Use values from."
  - "Names must start with a letter or underscore and contain only letters, numbers or underscores. Dimension values can be up to 30 characters."
  - "A dimension cannot be used until it is activated. Learn says the system must be in maintenance mode to activate financial dimensions."
  - "Entity-backed values are created in the source entity, not on the Financial dimension values page. Custom dimensions are always shared across legal entities."
  - "The Financial dimension service is deprecated starting September 11, 2026 with version 10.0.49, in favor of Optimized Financial dimensions."
faq:
  - q: "What is the difference between custom and entity-backed dimensions?"
    a: "According to Microsoft Learn, custom dimensions reflect your own classifications such as a cost center, and you create their values manually. Entity-backed dimensions use values from a system-defined entity such as Projects, Customers or Stores, and the values are maintained in that source entity."
  - q: "Why can I not use my new dimension?"
    a: "Learn says activation is required before you can use a dimension anywhere, including account structures and transactions. Values can be added before activation, but the dimension cannot be used until it is activated."
  - q: "What naming rules apply?"
    a: "Names must start with a letter or underscore, contain only letters, numbers or underscores afterwards, have no spaces or special characters and not use reserved field names such as RecId. Values can be up to 30 characters, and the chart of accounts delimiter should not appear in names, values or main account numbers."
  - q: "Can I limit a dimension value to some legal entities?"
    a: "Yes. Use the Legal entity overrides section to suspend a dimension or main account for specific companies. The page's example suspends department value 300 for DEMF."
  - q: "What is happening to the Financial dimension service?"
    a: "Learn says Microsoft deprecates it starting September 11, 2026 with Dynamics 365 Finance version 10.0.49, in favor of Optimized Financial dimensions. It was an optional performance aid for large journal imports through the Data Management Framework."
---

Financial dimensions tag transactions so that reports can slice the ledger by cost center, project, customer and more. Their values become segments of the ledger account. This guide follows the Microsoft Learn pages on financial dimensions and on defining them in Dynamics 365 Finance.

## Two types of dimension

**Custom dimensions** reflect your own classifications, such as a cost center, fleet identifier or expense purpose. You create and maintain values manually on the **Financial dimension values** page. Learn says custom dimensions are always shared across legal entities.

**Entity-backed dimensions** take values from a system-defined entity selected in **Use values from**, for example Projects, Customers or Stores. You can't create or edit the value or description on the **Financial dimension values** page. Create new values in the source entity, such as the Project page. Entity-backed values don't appear as selectable values until they are used in a transaction, posting profile, journal or similar context. Some are shared across legal entities and others are company-specific.

## Naming and value rules

Names must:

- Start with a letter or underscore.
- Contain only letters, numbers or underscores after the first character.
- Contain no spaces or special characters.
- Not use reserved system field names such as RecId.

An invalid name returns the error that the financial dimension name contains invalid characters. Dimension values have a maximum length of 30 characters. Custom dimensions can use a format mask, where `#` stands for a number and `&` for a letter, so `CC-###` allows CC followed by three numbers. Avoid hidden characters such as hard spaces, which cause lookup failures. Do not use the chart of accounts delimiter, for example a hyphen, in dimension names, values or main account numbers, because it can cause errors when entering ledger accounts or posting.

## Create an entity-backed dimension

1. Go to **General ledger** > **Chart of accounts** > **Dimensions** > **Financial dimensions**.
2. Select **New**.
3. In **Use values from**, select a system-defined entity.
4. Enter a compliant **Dimension name**.
5. Select **Activate**, close the message, then select **Activate** again. You can schedule activation as a batch job.
6. Select **Dimension values** to review values. Company-specific values show the company name.

## Create a custom dimension

1. Select **New**.
2. In **Use values from**, select **Custom dimension**.
3. Enter a compliant **Dimension name**, and optionally a format mask.
4. Select **Activate**, then **Activate** again.
5. On the Action pane, select **Dimension values**, then **New**.
6. Enter a **Dimension value** and a **Description**.

You can add values before activation, but the dimension is not usable until activation.

## Activation

Activation is required before a dimension can be used in account structures or on transactions. It updates the table with the dimension name and removes deleted dimensions. **Activate all** processes all pending additions, renames and deletions at once, and the **Status changes** field shows the result. Learn says the system must be in maintenance mode to activate, and refers to its financial dimension activation page for the conditions that block activation.

## Legal entity overrides

Global dimension values are active for every legal entity that includes the dimension in its account structure. Use **Legal entity overrides** to suspend a dimension or main account for specific companies, assign an owner or limit when it is active. Shared-level overrides can't be more restrictive than legal entity-level overrides. The page's example: values 100, 200 and 300 exist, and to stop DEMF from using 300 you create an override marking 300 as Suspended for DEMF.

## Validation and limits

The **Dimension data validation** page checks whether a ledger account or default dimension combination is structurally valid. Organizations can create up to 20 user-defined financial tags, which are an alternative to dimensions and not a cap on dimensions. Custom dimension values are limited to 30 characters.

## Deprecation notice

Learn says that starting September 11, 2026, Microsoft deprecates the Financial dimension service with Dynamics 365 Finance version 10.0.49, in favor of Optimized Financial dimensions. The service was an optional performance aid for large journal imports through the Data Management Framework. It doesn't apply to Customer, Vendor or Bank account types, and isn't used when derived dimensions are configured.

## Planning tips

These are practical points, not Microsoft statements:

1. Decide dimension names before you create them, because renames and deletes also need activation.
2. Use entity-backed dimensions when the data already lives in an entity, to avoid duplicate maintenance.
3. Plan activation outside business hours, since maintenance mode is required.
4. Document which dimensions are shared and which are company-specific.

## Related

- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Financial dimensions and tags (Microsoft Learn)](https://learn.microsoft.com/dynamics365/finance/general-ledger/financial-dimensions)
- [Define financial dimensions (Microsoft Learn)](https://learn.microsoft.com/dynamics365/finance/general-ledger/tasks/define-financial-dimensions)
