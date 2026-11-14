---
title: "Business Central intercompany consolidation eliminations: what you can automate"
summary: "What Microsoft documents for consolidating multiple companies in Business Central, which parts are automated through intercompany posting and the consolidation API, and why eliminations stay a manual journal step."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [dynamics-365-business-central, dynamics-365, dynamics-365-financial-reporting]
keypoints:
  - "Microsoft Learn calls eliminating repeated transactions across companies a manual process: enter general journal lines, preview with the G/L Consolidation Eliminations report, then post."
  - "Intercompany posting automates the matching documents and journal lines in partner companies, so fewer eliminations are needed later."
  - "Consolidated data can be imported from the database, through a free API across environments, or from an XML file. The API needs G/L entry access."
  - "Chart of accounts mapping uses Consol. Debit Acc. and Consol. Credit Acc. on each business unit's G/L accounts. Dimensions map through Consolidation Code."
  - "The Learn pages I read do not describe a setting that creates elimination entries automatically, so do not promise one."
faq:
  - q: "Does Business Central eliminate intercompany transactions automatically during consolidation?"
    a: "The Learn page on consolidating financial data describes eliminations as a manual process. You find the transactions that need adjusting, enter general journal lines, preview the effect with the G/L Consolidation Eliminations report and post. The pages I read do not describe an automatic elimination setting."
  - q: "What does intercompany posting automate?"
    a: "Learn says that when you assign an intercompany partner code to a customer or vendor, orders and invoices between the companies produce corresponding documents in the partner company. The partner can post them without re-entering data. With 2022 release wave 1 a company can also create received intercompany general journal transactions automatically."
  - q: "How do I move data between business units in different environments?"
    a: "Set Default Data Import to API on the business unit, with the endpoint taken from the Consolidation Setup page of the business unit company. Learn says the API option requires the user to have G/L entry access, which the D365 Basic and D365 Read permission sets provide."
  - q: "How do I consolidate a partially owned company?"
    a: "On the business unit card, enter the percentage in Consolidation %. Learn gives the example that at 70 percent, $70 of a $100 invoice is included."
  - q: "Is there a limit on the four-column trial balance?"
    a: "Learn says that if you have four business units or fewer, you can also use the Consolidated Trial Balance (4) report, ID 18. The page does not state an error or hard block for more units, so treat the four-unit limit as a layout limit and test it."
---

Business Central can automate much of the intercompany work that creates eliminations, and it can automate how business unit data reaches the consolidated company. The elimination itself is described by Microsoft Learn as a manual process. This article separates the two so you know where automation helps and where a person still posts a journal.

## How the pieces fit

Microsoft's consolidation model has two roles. Each subsidiary is a business unit. The consolidated company is where the data is combined, and Learn says it has no live business data of its own and uses its own chart of accounts.

Intercompany posting works earlier in the chain. It creates matching documents between companies so that both sides record the same transaction. Consolidation then combines the results, and eliminations remove what repeats.

## Step 1: Reduce eliminations with intercompany posting

Learn says that you set up intercompany partners, an intercompany chart of accounts and intercompany dimensions. In receivables and payables you assign an intercompany partner code to any customer or vendor. From then on, orders and invoices between these companies produce corresponding documents in the partner company, and the intercompany functionality creates general journal lines that balance the books of both.

How sending works, per the documents-and-journals page:

- Posting an intercompany document or journal line creates a corresponding line in your intercompany outbox.
- You transfer the outbox line to your partner, who posts the matching transaction without re-entering data.
- Sales and purchase orders and return orders can be sent before posting. Invoices and credit memos can be sent only after posting.
- In **Intercompany General Journals**, the **IC Partner G/L Acc. No.** field must be filled on lines with an account.
- With 2022 release wave 1, a company can automatically create received intercompany transactions that partners posted in intercompany general journals. The page does not name the setting.

Learn lists a restriction: purchase invoices are not submitted to partners through intercompany. Sales invoices sent through intercompany are created as purchase invoices in the receiving company. I did not find documentation of the inbox and outbox accept workflow, so read the page on managing the intercompany inbox and outbox.

## Step 2: Set up business units and mapping

In the consolidated company, open **Business Units**, choose **New**, and complete the **General** and **G/L Accounts** FastTabs. Learn warns to comply with GAAP rules when you set **Starting Date** and **Ending Date**.

On each business unit's G/L account card, the **Consolidation** FastTab holds:

- **Consol. Debit Acc.** and **Consol. Credit Acc.**, the accounts in the consolidated company. If blank, Business Central assumes the same account numbers.
- **Consol. Translation Method**, which sets the exchange rate method for the account.
- **Exclude from Consolidation**, to leave an account out.

Dimensions map through the **Consolidation Code** field. If it is blank, the original dimension value is used.

Partial ownership uses **Consolidation %** on the business unit card. To exclude a company, clear **Consolidate**.

## Step 3: Automate the data transfer

Set **Default Data Import** on the business unit's **Data Import** FastTab:

| Option | Use when |
|---|---|
| Database | Companies are in the same environment |
| API | Companies are in different environments |
| File Format | You export an XML file and share it manually |

Learn describes the API as free and says it works across environments, for example when business units are in different Azure geographies. The endpoint comes from the business unit company's **Consolidation Setup** page, in the **Current environment's API Endpoint** field. Learn says the API option requires G/L entry access, and the D365 Basic and D365 Read permission sets provide it.

For exchange rates, the **Currency Exchange Rate Table** field on the business unit card sets whether the business unit's or the consolidated company's rates are used. Learn lists average, closing, historical, composite and equity rates, with typical use for each.

## Step 4: Run, test and eliminate

Before the run, use **Test Database** or **Test File** on **Business Units**. Learn says Business Central checks for differences such as account numbers or dimension codes. Then choose **Consolidate**, or start the **Run Consolidation** batch job from the **Business Units** list, as the two Learn pages describe it.

Then the manual part, per Learn:

1. Identify transactions that need adjusting and enter general journal lines to eliminate them.
2. Run the **G/L Consolidation Eliminations** report (ID 16). It shows a tentative trial balance and compares consolidated-company entries with the journal eliminations.
3. Post the adjusting transactions.

The **Intercompany Transactions** report (ID 512) helps you review intercompany sales, purchase and journal entries to find what to eliminate.

## What the documentation does not say

The pages I read do not describe how to configure automatic eliminations, a dedicated elimination entry type, or dimension-based eliminations. If you want to automate step 4, that would be a custom solution or a partner product, which I cannot assess from Microsoft's pages. Define the elimination journal pattern first, and check whether it repeats every period.

## Typical mistakes

- Putting transactions into the consolidated company. Learn says the simple Company Consolidation guide is for a consolidated company that should not contain transactions.
- Skipping the test step and finding unmapped accounts after the run.
- Using the four-column trial balance with more than four business units, which Learn does not describe as supported.
- Forgetting the average-rate setup for income statement accounts when currencies differ.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)
- [Dynamics 365 financial reporting](https://www.m365.fm/entity/dynamics-365-financial-reporting/)

## Sources

- [Consolidating financial data from multiple companies](https://learn.microsoft.com/en-us/dynamics365/business-central/finance-consolidated-company-reporting)
- [Set up company consolidation](https://learn.microsoft.com/en-us/dynamics365/business-central/finance-consolidated-company-reporting-setup)
- [Managing intercompany transactions](https://learn.microsoft.com/en-us/dynamics365/business-central/intercompany-manage)
- [Work with intercompany documents and journals](https://learn.microsoft.com/en-us/dynamics365/business-central/intercompany-how-work-documents-journals)
