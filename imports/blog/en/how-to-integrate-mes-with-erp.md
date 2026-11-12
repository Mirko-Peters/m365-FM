---
title: "How to Integrate MES with ERP: A View From the Shop Floor"
summary: "How to integrate MES with ERP from the MES side: what the floor needs from ERP, what ERP needs back, how to match master data and which project traps to avoid."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [manufacturing-execution-system, enterprise-resource-planning, sap, isa-95, polaris-designer, polaris-operator, ifakt]
keypoints:
  - "Seen from the MES, the integration has two jobs: receive what to make and with what data, and report back what happened in a form the ERP can post."
  - "Order messages and reference data are different flows: in Microsoft's MES interface, products, bills of materials and routes are retrieved separately through data entities or OData."
  - "Agree on what finished means, how scrap is reported and how corrections work before you build any interface."
  - "Master data needs an owner, an identifier mapping and a regular reconciliation, because the MES inherits every error in ERP routings and times."
  - "Test failures on purpose and decide who sees a failed message, because a quiet queue of rejected confirmations ends in inventory differences."
faq:
  - q: "What data does an MES need from the ERP?"
    a: "It needs released production orders with quantities and dates, plus the reference data that describes how to make the product: items, bills of materials and routings with setup and run times. Often it also needs resource, equipment and personnel information such as qualifications. Reference data and order messages are usually separate flows."
  - q: "What should an MES report back to the ERP?"
    a: "Typically the start of an order, produced and scrapped quantities, material consumption, time per operation and the end of the order. The ERP uses them for inventory, costing and planning. Agree in advance on statuses, scrap reasons and how corrections are posted, so both systems mean the same thing."
  - q: "How long should I run the old process in parallel?"
    a: "Long enough to see a normal range of orders, including rework, scrap and a changeover. In practice that means several weeks on a pilot line. Compare good quantity, scrap, hours and material per order in both systems each day, and switch only when the differences are explained."
---

To integrate MES with ERP, agree on a short list of data objects and messages first, then build them in this order: master data, order release, shop floor feedback and error handling. Seen from the [MES](https://www.m365.fm/entity/manufacturing-execution-system/), the job is simple. Receive what to make, and report what happened. The hard parts are that both systems must mean the same thing by "item", "operation" and "finished", and that someone must own the errors. This article is for plant managers who own the shop floor side of the project.

## What does the MES need from the ERP?

Three things, and they travel differently.

First, orders. The MES needs released production orders with product, quantity, dates and later status changes. In the [Microsoft interface for third-party MES](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/mes-integration), the MES listens for a business event when an order is released or changes status. Other ERP systems use other mechanisms, but the principle holds: the ERP announces, the MES picks up.

Second, reference data. That's the description of how you make the product: items, bills of materials, routes, setup times. The same Microsoft page states that its messages cover shop floor events only and carry no master data. The MES retrieves products, bills of materials and routes from the ERP through data entities or OData. Plan this as a second integration job, because it's the one teams forget.

Third, information about resources. The [ISA-95](https://www.m365.fm/entity/isa-95/) standard names four kinds of information that systems exchange between enterprise and operations level: material, equipment, physical assets, and personnel with their roles and qualifications. If your MES assigns work by skill or by machine capability, it needs the ERP's, or HR's, version of those facts. Be clear about which system is the source.

If you use [SAP](https://www.m365.fm/entity/sap/), Dynamics 365 or any other [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/), the questions are the same. Only the technical names change.

## What does the ERP need back from the MES?

Think of it as confirmations. The Microsoft documentation lists the following processes for its interface: starting an order, reporting produced and scrapped quantities, reporting material consumption, reporting time used for an operation, and ending the order. It uses separate message types for each. An end message needs only the production order number, while a quantity message carries lines that can include the item, the good quantity and an error cause for scrap.

You don't need to copy that model. You do need to decide the following before you build:

- How detailed is a confirmation? Per order, per operation or per shift?
- Can an operator confirm a partial quantity, and what does the ERP do with it?
- How is scrap reported, and which reason codes exist in both systems?
- Is material consumption measured at the station, or does the ERP calculate it from the bill of materials?
- How are mistakes corrected: a reversal, an adjustment or a new confirmation?
- What does "finished" mean, and what does "ended" mean? In Microsoft's production process overview, reporting as finished adds goods to inventory, while ending the order calculates actual cost and blocks further cost postings. Your ERP may draw the line elsewhere.

The last question causes the most arguments. Planning, finance and quality all read the same status, and each one wants something different from it. Settle the definitions in a short meeting with all three before anyone writes an interface.

## How do you match master data between MES and ERP?

Orders are transactions. Master data is the description of your process, and the MES inherits every error in it. A routing that lists a 12-minute operation that takes 20 minutes will look like a performance problem on the floor for as long as nobody corrects it.

Work through these points for the pilot line:

1. Name the owner of each object. A common arrangement is that the ERP owns items, bills of materials and routings, and the MES owns station settings and work instructions. That's a recommendation, not a rule. What matters is that nobody has to guess.
2. Map identifiers. The ERP's work center "WC-110" may be "Press 3" on the floor. ISA-95 even has a part for this: its alias service model defines how equivalent identifiers are associated and mapped, according to [ISA's description of the standard](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard).
3. Compare operations. List the steps in the ERP routing and the steps the operators really perform. Differences show up quickly, such as an inspection or deburring step that exists only on the floor.
4. Check units, calendars and time zones. Pieces versus boxes and local time versus UTC cause quiet errors.
5. Set a change rule. When engineering changes a routing, who tells the MES, how fast does it arrive, and what happens to orders already in progress?
6. Repeat the comparison on a schedule. Master data drifts.

Here is a hypothetical case. An ERP routing has three operations, but operators perform five, because inspection and deburring were added years ago and never entered into the routing. The MES can only report what the routing contains. So the ERP shows operation three as late, while the floor is simply working on steps the ERP doesn't know. Nobody did anything wrong. The data is incomplete. The example is invented, but plants run into this kind of gap all the time.

For file formats, [B2MML](https://members.mesa.org/news/Details/press-release-mesa-announces-version-7-release-of-b2mml-batchml-specifications-55273) is worth knowing. MESA describes it as a set of XML schema definitions that implement ISA-95, used to integrate business systems such as ERP with manufacturing systems such as an MES. Version 7 added a first JSON schema. Using a published schema gives you a common starting vocabulary, though it doesn't remove the need to agree on the meaning of each field.

## How should the interface behave when something goes wrong?

The happy path will work in the demo. Spend your project time on the other paths.

The Microsoft documentation shows how one product behaves, and it's a good prompt for questions to your own vendor. Messages for the same production order are processed in the order received. Messages for different orders might be processed out of order, because batch jobs run in parallel. A failed message is retried up to three times and then marked as failed. A monitoring page lets you review, fix and reprocess failed messages, and an alert can notify an IT admin or a floor manager.

Turn that into four questions for any ERP and MES pair:

- What happens to a confirmation the ERP rejects, for example because the order is already ended?
- Who sees the failure, and how fast?
- Can the shop floor keep working while the ERP is unavailable, and send everything afterwards in the right order?
- Can the same confirmation arrive twice without posting twice?

If nobody owns failed messages, they pile up until someone finds an inventory difference at month end. Name a person, not a team.

## Does the production type change the integration?

Yes. In [an Automation World article on ISA-95 implementation](https://www.automationworld.com/products/control/news/13301218/isa-95-implementation-best-practices-production-models-and-segments), engineer-to-order is called probably the most demanding integration, because the enterprise and control systems must exchange information in near real time. Aerospace is the example: designs drive planning but can change during execution. When a change occurs, execution pauses until planning reflects it, and new operations, such as added inspections, go to the shop floor. The same article warns that different vendor interpretations of the standards can cause interoperability problems.

Two lessons follow. If your products are configured or engineered to order, build the change case into the first pilot, not the last. And test standard-based interfaces with your own data, because "standard" doesn't mean "identical".

## How do you integrate MES with ERP step by step?

Keep the scope small and the checks daily.

1. Pick one line and one product family.
2. Write an interface table with object, sender, receiver, trigger, frequency and owner. A row without an owner is your first risk.
3. Reconcile the master data for that product family, as above.
4. Agree on statuses and on the meaning of finished, scrap and rework.
5. Build orders, start and finish confirmations first. Add material and time afterwards.
6. Test failures on purpose: send a wrong quantity, stop the interface, restart it, send a duplicate.
7. Decide what happens to orders that are already running on the day you go live.
8. Run the new flow next to the old process for several weeks, and compare good quantity, scrap, hours and material per order in both systems every day.
9. Count the extra steps for operators. If confirming in the MES takes longer than the paper form did, find out why before you roll out further.
10. Extend to the next line only when the differences are explained.

## Common mistakes

- Treating master data as a one-time load instead of an ongoing job.
- Designing the interface from the ERP's point of view only, so the MES can't report in the detail the floor works in.
- Using the same status word with different meanings in each system.
- Having no rule for orders in progress at go-live.
- Testing only the happy path.
- Leaving failed messages without an owner.
- Asking operators to enter the same data twice, once in each system.

## Where Polaris fits

If your problem is the loop between the ERP plan and the floor, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production that works with ERP data. The [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) module turns ERP data, bills of materials, process times and resource structures into a product-process-resource knowledge graph. The [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) module brings plans to the shop floor as time-based tasks and feeds progress, delays and disruptions back into planning. Which confirmations your ERP must post for inventory, costing and traceability stays a separate question, so list them before you decide what any tool should cover.

## Related topics to explore

- ISA-95 in plain language: which activities belong to the ERP level and which to the operations level.
- Closed-loop planning: how confirmations from the floor change the next schedule.
- Securing the connection between plant and business networks: accounts, segmentation and patching of interfaces.
- Shop floor reporting without a full MES: what scanning and simple confirmations can cover.

## Next step

Take one product family and write down, in a table, every object that must move between your MES and your ERP, with sender, receiver and owner. If you want to integrate MES with ERP without surprises, bring that table to the first meeting with IT and your vendor.
