---
title: "Power Automate On-Premises Data Gateway: Timeout and Concurrency Bottlenecks to Check"
summary: "A troubleshooting guide for slow or failing Power Automate flows that use the on-premises data gateway: documented payload and request limits, cluster and throttling settings, scaling signals and performance logs."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [power-automate, on-premises-data-gateway]
keypoints:
  - "Learn documents a 2-MB payload limit for gateway writes, a 2-MB request limit and an 8-MB compressed response limit for reads, and a 2048-character GET URL limit."
  - "Flow limits apply too: outbound synchronous requests time out at 120 seconds, and Apply to each concurrency defaults to 1 with a maximum of 50."
  - "Microsoft suggests considering scale-out when CPU stays above 80 percent, free memory dips below 20 percent, free disk drops below 5 GB or more than 40 queries run at once on a node."
  - "A cluster supports up to 10 members. Keep members on the same gateway version and remove or disable offline members."
  - "Gateway performance logging is on by default and records the query type, including Power Automate, with durations, spooling times and system counters."
faq:
  - q: "What size limits does the on-premises data gateway have for Power Automate?"
    a: "Microsoft Learn says Logic Apps, Power Apps and Power Automate support read and write operations through the gateway, with a 2-MB payload limit for write operations, a 2-MB request limit and an 8-MB compressed data response limit for reads, and a 2048-character limit for the GET request URL."
  - q: "Is there a gateway timeout of 120 seconds for flows?"
    a: "The Power Automate limits page lists 120 seconds, or 2 minutes, for outbound synchronous and inbound requests, but it does not tie that value to the gateway. The gateway page I read does not state a request timeout, so treat 120 seconds as the general flow limit and measure your own queries."
  - q: "How many gateways should be in a cluster?"
    a: "Learn recommends at least two gateways per cluster for business-critical use, and says a cluster supports up to 10 members. Members should run the same gateway version, because different versions could cause unexpected failures."
  - q: "How can I see what the gateway is spending time on?"
    a: "Performance monitoring, a public preview feature for standard mode gateways, writes a Query Execution Report and a System Counter Aggregation Report by default. The QueryType attribute can show Power Automate, and attributes such as QueryExecutionDuration and DataProcessingDuration help locate slow queries."
---

When a flow that calls an on-premises source gets slow or starts failing, the gateway is a natural suspect, but not always the cause. Limits come from three places: the flow platform, the gateway's payload rules, and the machine or cluster the gateway runs on. This guide separates them so you can check each with evidence.

One caveat up front: the Learn pages I read document gateway limits and monitoring in detail, but they do not publish a gateway-specific request timeout for Power Automate. Where a number is a general flow limit, the text says so.

## Check 1: Payload and request limits

The gateway page lists these for Logic Apps, Power Apps and Power Automate:

- A 2-MB payload limit for write operations.
- A 2-MB request limit and an 8-MB compressed data response limit for read operations.
- A 2048-character limit on the URL of a GET request.
- A maximum of 1,000 data sources on each enterprise or personal gateway cluster.

If a flow action fails only for large inserts or large reads, compare the payload against these. The usual fix is to batch writes, page reads and select fewer columns.

## Check 2: Flow-level limits

The Power Automate limits page covers the platform side:

| Limit | Value |
|---|---|
| Outbound synchronous request timeout | 120 seconds |
| Inbound request timeout | 120 seconds |
| Outbound asynchronous request | Configurable up to 30 days |
| Apply to each concurrency | Default 1, configurable from 1 to 50 |
| Apply to each array items | 5,000 for Low, 100,000 for others |
| Run duration | 30 days |
| Consistently throttled flows | Turned off after 14 days |

The page does not link the 120-second values to the gateway, and it notes that some connector operations make asynchronous calls or listen for webhooks, so those can run longer. Raising Apply to each concurrency sends more parallel requests to the gateway, which helps only if the gateway and the source can take them. If you raise it and see more failures, lower it again.

## Check 3: Version and cluster health

From the gateway troubleshooting page:

- Microsoft releases an update monthly and actively supports only the last six releases.
- Keep gateway versions in a cluster in sync. A member with a lower version might be unable to run a query that is routed to it, which causes failures.
- If the gateway shows as offline or unreachable, confirm the required FQDNs and ports are allowed, check proxy settings and logs, and if only ports 80 and 443 are open, enable HTTPS mode.
- Credentials are cached on the gateway for hours. Learn gives an example where edited credentials were not used for roughly five hours.

The cluster page adds:

- A cluster supports up to 10 members, and the service always uses the primary gateway unless it is unavailable.
- Recommended: disable or remove an offline member, because queries might be tried on it first and hurt performance.
- With **Distribute requests across all active gateways in this cluster** enabled, selection is random by default. For the disabled state, the same page says both that the cluster uses round-robin distribution and that requests route to the primary unless it is offline, so test which behavior you see.

## Check 4: CPU, memory and concurrency throttling

The gateway can reject requests when a node is over a limit. Learn describes settings in `Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config`:

| Setting | Default |
|---|---|
| `CPUUtilizationPercentageThreshold` | 0, disabled |
| `MemoryUtilizationPercentageThreshold` | 0, disabled |
| `ResourceUtilizationAggregationTimeInMinutes` | 5 |

Concurrency throttling is enabled by default. If a randomly chosen member is at or over a limit, another is chosen. If all are, the request fails with a message that the CPU, memory or concurrency limit set by the gateway admin was exceeded. Learn's troubleshooting page also lists a concurrency limit of 30 in the context of the error "There are too many refreshes occurring concurrently", which is worded for refreshes. Check whether the same ceiling applies to your flow traffic by watching the gateway's logs when the problem occurs.

## Check 5: Sizing signals

The plan, scale and maintain page gives scale-out signals for a node:

- CPU above 80 percent for extended periods. Short spikes under 5 minutes are not abnormal.
- Available memory regularly below 20 percent.
- Free disk space frequently below 5 GB.
- More than 40 queries running at the same time on a single node.

Scale out before scaling up, since scaling out also adds cluster bandwidth. Scale up when a single query needs more memory or CPU than one node has, because a query runs on only one gateway server. Run at least two gateways per cluster, split clusters by business unit, and isolate long-running work in a dedicated cluster. Test updates on a development cluster for at least 24 hours before production.

## Check 6: Read the gateway performance logs

Performance logging is on by default for standard mode gateways, and it is a public preview feature. Files are written to the configured `ReportFilePath`. The Query Execution Report includes:

- `QueryExecutionDuration` and `DataProcessingDuration`
- `SpoolingDiskWritingDuration` and `SpoolingDiskReadingDuration`
- `DataReadingAndSerializationDuration`
- `QueryType`, which can show Power Automate
- `Success` and `ErrorMessage`

The System Counter Aggregation Report adds `SystemCPUPercent`, `SystemMEMUsedPercent`, `GatewayCPUPercent` and `GatewayMEMKb`. Learn's page does not prescribe a method. A reasonable reading follows the field meanings: a long execution with short processing points outside the data pipeline, high spooling times point to disk, and high reading and serialization time points to the source. Microsoft publishes a Power BI template to visualize the logs. Antivirus should exclude the log and Spooler directories.

Performance monitoring does not capture network bandwidth or latency, so use other tools for those. Microsoft also says it does not investigate poor performance caused by an overloaded gateway.

## Check 7: Test the source directly

Learn says that if a refresh from Power BI Desktop on the gateway computer fails, a refresh through the gateway is highly unlikely to succeed. Apply the same idea to flows: run the same query from the gateway machine with the same account first. To collect logs, open the gateway app, select **Diagnostics**, then **Export logs**.

## Order of work

1. Compare payload sizes with the 2-MB and 8-MB limits.
2. Review Apply to each concurrency and how often the flow triggers.
3. Confirm all cluster members are online and on the same version.
4. Check the throttling settings and error text.
5. Look at CPU, memory, disk and concurrent queries against the scale-out signals.
6. Read the Query Execution Report for the slow queries.
7. Reproduce the query directly on the gateway machine.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)

## Sources

- [Microsoft Learn: On-premises data gateway considerations and limitations](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-onprem)
- [Microsoft Learn: Troubleshoot the on-premises data gateway](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-tshoot)
- [Microsoft Learn: Plan, scale and maintain a business-critical gateway solution](https://learn.microsoft.com/en-us/data-integration/gateway/plan-scale-maintain)
- [Microsoft Learn: Gateway high-availability clusters and load balancing](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-high-availability-clusters)
- [Microsoft Learn: Gateway performance monitoring](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-performance)
- [Microsoft Learn: Power Automate limits and configuration](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
