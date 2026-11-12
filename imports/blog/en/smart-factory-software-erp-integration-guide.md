---
title: "Smart Factory Software ERP Integration: A Plant Manager's Guide"
summary: "Smart factory software ERP integration comes down to which data moves, in which direction and how fast. A plain guide for plant managers with a checklist."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [industry-4-0, enterprise-resource-planning, manufacturing-execution-system, isa-95, dynamics-365-supply-chain-management, polaris-designer, polaris-operator, ifakt]
keypoints:
  - "Smart factory software ERP integration is a data agreement first: which objects move, in which direction, how often and who owns them."
  - "ISA-95 gives plant and IT teams shared terms: ERP sits at the business planning level, manufacturing operations software at the level below it."
  - "Orders usually flow from ERP down to the floor; started, finished and scrapped quantities, material use and time flow back up."
  - "Reference data such as bills of materials and routings is a separate flow from order messages, and often the weaker link."
  - "Start with one line and one order flow, test error handling on purpose, and compare plan against actual before you add more."
faq:
  - q: "What does ERP integration with smart factory software mean?"
    a: "It means the planning system and the shop floor software exchange data on a defined schedule and in a defined format. Orders and master data go down to the floor. Progress, quantities, material use and time come back to the ERP. The integration works when both sides agree on the meaning of each status."
  - q: "Do I need a MES to connect my shop floor to ERP?"
    a: "Not always. A MES is the usual layer between the ERP and the machines, because it records work against orders. Small plants sometimes capture progress with simpler shop floor tools or scanning and post it to the ERP directly. Decide by the detail you need to report, not by the label."
  - q: "How real-time does ERP integration need to be?"
    a: "It depends on the decision. ISA-95 treats real-time differently by level: seconds after a shop floor event at the operations level, but daily or within hours after a shift at the business level. Ask what each decision needs, then pay for that speed and no more."
---

Smart factory software ERP integration means your planning system and your shop floor software exchange data in a defined way: orders and master data go down to the floor, and progress, quantities, material use and time come back. The hard part isn't the connector. It's agreeing on what moves, in which direction, how often and who owns each data object. This guide is for plant managers who have to sponsor such a project and want to ask better questions of IT and vendors.

## What does ERP integration with smart factory software cover?

Start with a shared picture of the layers. The ISA-95 standard, also known as IEC 62264, is described by [ISA](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard) as an international standard set for integrating business and logistics systems with manufacturing control systems. It uses a five-level model based on the Purdue Reference Model, and it gives manufacturing and IT staff common terms for integration projects.

The [OPC Foundation's summary of ISA-95](https://reference.opcfoundation.org/specs/OPC-10030/4.2.3) puts the levels this way:

- **Levels 0 to 2** cover the physical process, sensors and actuators, and automation and control on PLCs.
- **Level 3** is manufacturing operations management. It works over seconds to days and includes scheduling, work tracking, quality and inventory functions.
- **Level 4** is business planning and logistics, working over days to months, typically in an [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/).

The standard is mainly about the information exchange between levels 3 and 4. For that exchange it names four kinds of information: material, equipment, physical assets, and personnel with their roles and qualifications. That's a handy checklist. If your project plan doesn't say how each of the four gets from one side to the other, something is missing.

Level 3 is where a [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) normally lives. When people talk about [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) or a smart factory, they mostly mean that the data between these levels flows more often and with less retyping. The word "smart" adds no new magic. Good integration is the same discipline as before, applied more consistently.

## Which data should flow in which direction?

Think of two flows: orders going down and feedback coming up, plus a third flow for master data.

Microsoft documents a concrete example. Its [integration of Dynamics 365 Supply Chain Management with third-party manufacturing execution systems](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/mes-integration) is meant for companies that use an external MES instead of the native shop floor functions. It covers these processes:

1. **Release of a production order** and later status changes go from the ERP to the MES. The MES listens for a business event.
2. **Start of the order** is reported from the MES to the ERP.
3. **Produced and scrapped quantities** go back to the ERP.
4. **Material consumption** goes back, so inventory stays right for planning and sales.
5. **Time used for an operation** goes back as well.
6. **End of the order** goes back as the final status, after which no more quantities are expected.

The page also states a limit that matters in practice. Reference data such as products, bills of materials, routes and setup times isn't pushed by those messages. You retrieve it separately, through data entities. So you have two integration jobs, not one, and the second is easy to forget.

You don't have to use Dynamics 365 to learn from this list. Whatever ERP and shop floor tools you run, write the same table: object, sender, receiver, trigger, frequency and owner. If a row has no owner, you've found your first risk.

### Why is master data the weak link?

Orders are transactions. Routings, bills of materials and times are the description of how you make the product, and the shop floor tool inherits every error in them. A routing that lists a 12-minute operation that takes 20 minutes will look like a performance problem on the floor forever. Decide who corrects master data when the shop floor reports something that contradicts it, and how fast that correction reaches the ERP.

## How fast does the data need to move?

"Real-time" is the most overused word in this field, so make it a number.

ISA-95 itself treats it per level. In the OPC summary, real-time at level 3 means seconds after a shop floor event, and at level 4 it means daily or within hours after a shift. Those are very different promises, and they cost different amounts.

Ask for each flow what decision it supports:

- A supervisor who reassigns people when a job runs late needs minutes.
- A planner who reschedules tomorrow's orders needs the status by the end of the shift.
- A controller who closes cost on an order can wait for the order to end.

Pay for speed where a decision needs it. Everywhere else, a scheduled transfer is simpler to run and easier to repair.

Also ask how messages behave when something goes wrong. In the Microsoft documentation, messages for one production order are processed in the order they arrive, messages for different orders may be processed out of order because jobs run in parallel, and a failed message is retried three times before it's marked as failed. There's a monitoring page for incoming messages. You don't need those exact details for your own system, but you do need the same answers: ordering, retries, a place where failures show up, and a named person who looks at them.

## How do you connect the systems?

There are four common patterns, and most plants end up with a mix.

- **A prebuilt connector** between a specific ERP and a specific MES. Fastest to start, limited to what the connector covers.
- **Interfaces through APIs or a message layer.** More flexible, and you own the mapping and the testing.
- **File or spreadsheet transfer.** Unglamorous and often fine for slow-moving data such as master data or weekly capacity.
- **Manual entry as a fallback.** Keep it for outages, and don't plan on it.

When you compare offers, ask these questions:

1. Which objects and directions does the interface cover, and which does it not? A good vendor answers the second part without being pushed.
2. How are errors reported, who sees them and what happens to the message?
3. What is the required ERP version, license or setting? The Microsoft page, for example, lists a license key as a prerequisite for its integration. Such details decide timelines.
4. Can the shop floor tool keep working when the ERP is down, and catch up afterwards?
5. Who maintains the mapping when you add a product family or a new work center?

Dynamics 365 Supply Chain Management also offers its own shop floor registration, where workers register time and item consumption on production jobs from a job list per resource. If your [ERP](https://www.m365.fm/entity/dynamics-365-supply-chain-management/) already covers your reporting needs on the floor, a separate MES may not be needed. Check what you must record before you decide.

## What about security?

Connecting the floor to business systems creates a new path into equipment that was once isolated. NIST's [Guide to Operational Technology Security](https://www.nist.gov/publications/guide-operational-technology-ot-security), SP 800-82 revision 3, covers typical OT topologies, common threats and vulnerabilities, and countermeasures, while accounting for the performance, reliability and safety needs of OT. Read it, or ask your security team to, before the design is final.

A few practical rules follow without any specific product in mind:

- Decide which connections are allowed between business systems and machine networks, and write them down.
- Give every integration its own account with only the rights it needs.
- Plan how patches and changes reach the integration layer without stopping production.
- Include the shop floor interfaces in your incident plan.

## How should you run the project?

Keep it small and measurable.

1. **Pick one line and one order flow.** Not the whole plant.
2. **List the data objects** for orders, material, time and quantities, with a sender, a receiver and an owner for each.
3. **Clean the master data** for that line first: routings, bills of materials, work centers.
4. **Agree on the statuses.** "Started", "finished" and "ended" must mean the same thing on both sides.
5. **Test failures on purpose.** Send a wrong quantity, stop the interface, restart it and see what happens.
6. **Run it in parallel** for a few weeks with the old process still in place.
7. **Compare plan and actual.** Check whether the numbers the ERP receives match the floor.
8. **Then extend** to the next line.

## Common mistakes

- **Buying the connector before defining the data.** The connector moves whatever you give it, including wrong data.
- **Ignoring master data.** Order messages work fine and the floor still disagrees with the plan.
- **Asking for real-time everywhere.** It raises cost and adds failure points for decisions that don't need it.
- **No owner for errors.** Failed messages pile up until someone finds an inventory mismatch.
- **Treating security as a later phase.** It's much cheaper in the design than after go-live.
- **Skipping the people on the floor.** If operators find the new reporting slower than paper, they will work around it.

## Where Polaris fits

If your main gap is between the ERP plan and what happens on the floor, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, with data from ERP, Excel and shop floor sources. The [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) module turns ERP data, bills of materials, process times and resource structures into a product-process-resource knowledge graph. The [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) module brings optimized plans to the floor as time-based tasks and feeds progress, delays and disruptions back into planning. Test any such tool against your own order flow before you decide.

## Related topics to explore

- **OT security for connected plants.** How to segment machine networks and who reviews access to the integration layer.
- **Change management for shop floor reporting.** How to introduce new reporting steps without losing the operators.
- **Plan versus actual.** Which few measures show whether the ERP plan still matches the floor.
- **Live production monitoring.** What a supervisor needs on screen, and what a manager needs in a daily report.
- **Predictive maintenance data.** Which machine data is worth collecting before you plan any prediction.

## Next step

Smart factory software ERP integration gets easier once the data agreement is on paper. Take one production line this week, fill in the table of objects, senders, receivers and owners, and bring it to your next meeting with IT.
