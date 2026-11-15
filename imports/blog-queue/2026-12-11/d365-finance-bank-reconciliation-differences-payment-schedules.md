---
title: "Dynamics 365 Finance Bank Reconciliation Differences and Payment Schedule Checks"
summary: "Find why bank reconciliation does not match in Dynamics 365 Finance: statement validation, overlap, time zones, penny differences, reversals and debit/credit flips, plus how payment schedules are defined."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [d365-finance-operations, dynamics-365]
keypoints:
  - "Validate the statement first. Opening balance, closing balance, overlap, line dates and currency are checked before reconciliation."
  - "Statements can overlap only at a single point in time. Time zone mismatches on import can shift date-time values."
  - "Small differences match only within the Allowed penny difference set on the bank account. The correction posts when the worksheet is marked reconciled."
  - "Marking a worksheet reconciled is not reversible. Unmatch lines before that step."
  - "The Learn pages I read do not explain how a payment schedule is applied to invoices, so verify payment schedule behavior in your own environment."
faq:
  - q: "What does Finance check when I validate a bank statement?"
    a: "Microsoft Learn lists that the statement matches the bank account and currency, the opening balance equals the previous closing balance, dates do not overlap another statement, line dates fall between the from and to dates, and opening balance plus line amounts equals the ending balance."
  - q: "Why do imported dates look different from the bank file?"
    a: "Learn says date-time values in the import file can differ from values in Finance, and recommends entering a Time zone preference on the Configure data sources page. The default assumes UTC. Learn advises avoiding changes to the time zone preference for bank accounts that already have imported statements."
  - q: "How are small differences handled?"
    a: "A single statement line and a single bank transaction can match if the difference is within the Allowed penny difference on the bank account. The amount appears as the correction amount and posts to the main account on the bank transaction type when the reconciliation is marked as reconciled. Corrections are not supported for check or deposit document types."
  - q: "Debits import as credits. What do I change?"
    a: "The troubleshooting article says to change the relevant XSLT template, for example GetAmountCreditDebitIndicator for BAI2, GetCreditDebit for ISO 20022 and GetCreditDebitIndicator for MT940. It also notes that statements from several banks must use the same debit and credit approach or separate transformations."
  - q: "What is a payment schedule in Finance?"
    a: "Microsoft Learn describes a payment schedule as a way to accept customer payments in installments with a set number, amount and due date. Allocation can be Total, Fixed amount, Fixed quantity or Specified. The path is Accounts receivable, Payment setup, Payment schedules."
---

Most bank reconciliation differences in Dynamics 365 Finance come from the statement import or from matching, not from the ledger. Work through the process in order: validate the statement, check overlap and time zones, review matching and reversals, then handle penny differences and unmatched lines. Payment schedules are a separate setup, and Microsoft's pages say little about how they feed reconciliation.

## Step 1: Validate the statement

On the **Bank statements** page, select **Validate**. Microsoft Learn lists what is checked:

- The statement matches the bank account, and its currency matches the account currency.
- The opening balance equals the previous statement's closing balance.
- The statement dates do not overlap another statement for the same account.
- Line dates fall between the from-date and the to-date.
- Opening balance plus line amounts equals the ending balance.

Validation must pass before you reconcile. Duplicates are detected by the combination of AccountNo, StatementID, FromDate and ToDate. Learn also says the process flow depends on the **Modern bank reconciliation** feature. With it on, **Validate** and **Confirm** are on the bank statement header and improved matching rules exist, and some of what the page describes applies only with it off. Check which setting your environment uses.

If the statement fails, compare the failing item with the file, not with the ledger.

## Step 2: Find import problems

When an import fails or returns wrong values, the troubleshooting article covers the following points. I list them in the order of its sections, and the order as a sequence is my own arrangement:

1. Open **Data management** job history and the job's execution details. The error rarely names the exact field.
2. Check overlap. Imported statements can overlap only at one point in time, for example one ending at 12:00 AM on a date and the next starting at the same time.
3. Compare the bank file layout with the Finance layout and sample file.
4. Check time zones. Per the import setup page, enter a **Time zone preference** under the **Data management** workspace > **Configure data sources** > the data format > **Regional settings** FastTab. It applies to all imports that use that source data format. The default assumes UTC.
5. Identify which XSLT transformation applies (BAI2, ISO 20022 or MT940) and fix the field mapping there.

Note that the troubleshooting and import setup pages carry a note that this legacy import functionality "will be deprecated September 2022" and that new users should use electronic reporting. The main reconciliation page describes import through electronic reporting. Check which path your system uses.

## Step 3: Review matching

Open **Bank reconciliation**, select **New**, choose the account, then open the **Worksheet**. Each account can have only one open reconciliation. The cut-off date controls which statement lines and bank transactions appear.

- Use **Run matching rules** or match manually. One-to-one, many-to-one and many-to-many matches are supported.
- Matches must respect the allowed date differences and transaction type mapping on **Cash and bank management parameters**.
- Use **Mark as new** for bank-initiated items such as interest and fees. Post them later from the **Bank statement** page.
- Two statement lines reverse each other if the amounts are opposite and one is marked as a reversal.

## Step 4: Handle small and remaining differences

A single statement line and a single bank transaction can match if the difference is within the **Allowed penny difference** on the bank account. The correction posts to the main account on the bank transaction type when you mark the reconciliation as reconciled. Corrections are not supported for the **Check** or **Deposit** document types.

You can mark a worksheet as reconciled with unmatched lines. They roll forward to the next worksheet. Marking as reconciled is not reversible, and the reconciliation becomes read-only. If a match is wrong, select the matched line and **Unmatch** before you finish.

## Step 5: Fix debit and credit flips

If debits import as credits, adjust the credit/debit template in the transformation: `GetAmountCreditDebitIndicator` (BAI2), `GetCreditDebit` (ISO 20022) or `GetCreditDebitIndicator` (MT940). The troubleshooting page spells some file names inconsistently (for example "xlst" and "Reconcilation"), so verify the exact names in your installation. The setup page lists the resource files as BAI2XML-to-Reconciliation.xslt, ISO20022XML-to-Reconciliation.xslt and MT940XML-to-Reconciliation.xslt. If several banks use different conventions, use separate transformations.

## Payment schedules: what the pages cover

A payment schedule lets customers pay in installments with set amounts and due dates. The path is **Accounts receivable** > **Payment setup** > **Payment schedules**. The allocation options are:

| Allocation | Meaning |
|---|---|
| Total | The total outstanding amount is due |
| Fixed amount | A fixed amount is due on each payment date |
| Fixed quantity | The total is divided into a fixed number of payments |
| Specified | Specified amounts on specified dates, defined on **Payment lines** |

For **Specified**, set **Payment per** (Days, Months or Years), then use **Quantity**, **Amount in transaction currency** and the **Percentage/Amount** list. For fixed schedules, the **Minimum** amount overrides calculated payment amounts. Payment days, schedules, terms of payment and cash discounts are shared between accounts payable and accounts receivable within a legal entity.

When due dates look inconsistent, compare the **Terms of payment** setup (payment method, payment day, payment calendar) with the schedule. The customer payment terms page says a payment schedule can be used within terms of payment, so both can affect due dates.

## Quick checklist before month-end

1. Every statement shows **Validated** and none overlaps beyond a single point in time.
2. The time zone preference matches the bank file and was not changed after statements were imported.
3. Reversals are either marked on the statement lines or cleared by a matching rule.
4. The allowed penny difference on each bank account reflects your tolerance.
5. Bank-initiated items are marked as new and posted once from the **Bank statement** page. Posting can be completed only once per statement.
6. Nobody marks a worksheet as reconciled until the unmatched list has been reviewed.

## What I could not confirm

The Learn training unit on payment schedules does not state whether Specified lines must total 100 percent, how schedules are applied to sales orders or invoices, or how installments post or match to payments. No page I read links payment schedules directly to bank reconciliation mismatches. Test a sample invoice in a non-production environment before you change setup.

## Related

- [Dynamics 365 Finance and Operations](https://www.m365.fm/entity/d365-finance-operations/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Reconcile bank statements with advanced bank reconciliation](https://learn.microsoft.com/en-us/dynamics365/finance/cash-bank-management/reconcile-bank-statements-advanced-bank-reconciliation)
- [Troubleshoot bank statement file import](https://learn.microsoft.com/en-us/dynamics365/finance/cash-bank-management/import-bank-statement-file-failed-incorrect-results)
- [Set up the advanced bank reconciliation import process](https://learn.microsoft.com/en-us/dynamics365/finance/cash-bank-management/set-up-advanced-bank-reconciliation-import-process)
- [Payment schedule (Microsoft Learn training unit)](https://learn.microsoft.com/en-us/training/modules/configure-accounts-receivable-dyn365-finance/2-payment-schedule)
- [Establish customer payment terms](https://learn.microsoft.com/en-us/dynamics365/finance/general-ledger/tasks/establish-customer-payment-terms)
