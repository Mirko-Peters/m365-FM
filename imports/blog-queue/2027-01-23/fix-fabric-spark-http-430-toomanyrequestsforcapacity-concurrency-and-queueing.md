---
title: "Fabric Spark Jobs Queued or Throttled With HTTP 430: Concurrency Limits and Queueing"
summary: "HTTP 430 TooManyRequestsForCapacity means a Fabric Spark job was submitted while capacity was fully used. How core-based admission, bursting and the per-SKU queue limits work, which jobs queue and which fail, the 24 hour queue expiry and how to free capacity, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [fabric, fabric-capacity, apache-spark]
keypoints:
  - "The error TooManyRequestsForCapacity, HTTP 430, appears when a notebook or lakehouse job is submitted while Spark capacity is fully used."
  - "Learn's remedies in the message: cancel an active Spark job in the Monitoring hub, choose a larger capacity SKU, or try again later."
  - "Queueing is FIFO and retries automatically for pipeline, scheduler and Spark job definition jobs. It does not apply to interactive notebook jobs or jobs sent through the notebook public API."
  - "Queued jobs expire after 24 hours. If the capacity is throttled, new Spark jobs are rejected instead of queued."
  - "One capacity unit equals two Spark VCores. Bursting allows up to 3 times the purchased VCores, and job-level bursting can be disabled to protect other jobs."
faq:
  - q: "What does HTTP 430 TooManyRequestsForCapacity mean in Fabric?"
    a: "Microsoft Learn shows the message that the Spark job cannot be run because you have hit a Spark compute or API rate limit. It occurs when a notebook or lakehouse job, such as Load to Table, is submitted while capacity is fully used. The message suggests canceling an active Spark job through the Monitoring hub, choosing a larger capacity SKU or trying again later."
  - q: "Which jobs are queued and which are rejected?"
    a: "With queueing enabled, jobs triggered from pipelines, the scheduler and Spark job definitions are queued and retried automatically. Queueing does not apply to interactive notebook jobs or to notebook jobs submitted through the notebook public API. If the Fabric capacity is in a throttled state, new Spark jobs are rejected instead of queued."
  - q: "How long does a job stay in the queue?"
    a: "Queue expiration is 24 hours from the job submission time. After that the job is removed from the queue and must be resubmitted manually. Queueing is first in, first out and queued jobs are retried automatically when capacity becomes available."
  - q: "How many Spark VCores does my capacity have?"
    a: "One capacity unit maps to two Spark VCores. Learn's table lists, for example, F2 with 4 VCores, F64 with 128 and F128 with 256, and maximum VCores with burst factor of 20, 384 and 768. The queue limit equals 64 for F64 and 128 for F128. The trial capacity has 128 VCores, no extra burst and no queue."
  - q: "How can I stop one job from using all capacity?"
    a: "Capacity admins can disable job-level bursting under OneLake catalog, Govern, Capacities, then the capacity settings, Data Engineering or Science settings, Open Spark Compute, Disable job-level bursting. Then a single job is capped, for example at the base 128 VCores for F64, leaving headroom for other jobs. Learn suggests this for multi-tenant or high-concurrency environments."
---

An HTTP 430 on a Fabric Spark job is a capacity message, not a code defect. Microsoft Learn explains how Spark in Fabric admits jobs, which ones are queued, and which numbers apply per SKU. This article uses that page to explain the error and to list the levers you have.

## The error

When a notebook or a lakehouse job (for example **Load to Table**) is submitted while capacity is fully used, Fabric returns:

```
[TooManyRequestsForCapacity] HTTP Response code 430: This Spark job can't be run because you have hit a Spark compute or API rate limit. To run this Spark job, cancel an active Spark job through the Monitoring hub, or choose a larger capacity SKU or try again later.
```

The three suggestions in the message are the three levers: free capacity by canceling, buy more capacity, or wait.

## How admission works

- Fabric allocates compute through capacity. For Spark, one capacity unit equals two Spark VCores.
- Spark VCores are shared across Spark items in the workspaces of that capacity, including notebooks, Spark job definitions and lakehouse jobs.
- Spark uses core-based throttling and queueing. Admission depends on available Spark VCores, not an arbitrary per-job count limit. By default it uses optimistic admission control, which admits jobs using their minimum core requirements.
- Queueing is first in, first out, and queued jobs are retried automatically when capacity is available.

## What gets queued

| Job source | Behavior |
| --- | --- |
| Pipelines, scheduler, Spark job definitions (queueing enabled) | Queued and retried automatically |
| Interactive notebook jobs | Not queued |
| Notebook jobs through the notebook public API | Not queued |
| Any new Spark job while the capacity is throttled | Rejected, not queued |

Queue expiration is 24 hours from submission. After that the job leaves the queue and you must resubmit it.

## Bursting

Fabric capacities support bursting, up to 3 times the purchased Spark VCores. Learn's example: an F64 has 128 Spark VCores and a burst maximum of 384. A pool configured with up to 384 VCores lets a single job use all of them, for example Medium nodes of 8 VCores times 48 maximum nodes. Pool configuration decides the maximum cores one job can use, not only the base SKU allocation.

## Limits per SKU

A sample from the page's table:

| SKU | Spark VCores | Max with burst | Queue limit |
| --- | --- | --- | --- |
| F2 | 4 | 20 | 4 |
| F8 | 16 | 48 | 8 |
| F32 | 64 | 192 | 32 |
| F64 | 128 | 384 | 64 |
| F128 | 256 | 768 | 128 |
| F256 | 512 | 1536 | 256 |
| Trial capacity | 128 | 128 | Not available |
| FTL4 | 8 | 16 | 16 |

The page lists the other SKUs from F4 up to F8192 as well. For FTL4 it recommends a small compute pool and high concurrency session sharing. The table applies to Spark on Fabric capacity. With autoscale billing, Spark jobs run separately from Fabric capacity, they do not use bursting or smoothing, and total Spark VCores are two times the maximum capacity units set in the autoscale settings.

Example from the page: on an F64, either three 128-VCore jobs run concurrently, or one 384-VCore job.

## Control job-level bursting

Capacity admins can switch this in **OneLake catalog** > **Govern** > **Capacities**:

1. On **Manage capacities**, find the capacity.
2. Select **More options** > **Settings** next to its name.
3. Open **Data Engineering/Science settings** > **Open Spark Compute**.
4. Use **Disable job-level bursting**.

With it disabled, no single job can use all available capacity including burst cores. For an F64, a job could be capped at the base 128 VCores, which leaves headroom for others. Learn calls this useful for multi-tenant or high-concurrency environments and mixed workloads where fairness matters more than one job's speed. With bursting enabled, which is the default, a large batch notebook can use all 384 VCores when nothing else runs.

## Fixing the error

1. Open the **Monitoring hub** and look at active Spark jobs. Cancel what is not needed.
2. Check whether the job came from a source that queues. If it is interactive or uses the notebook API, resubmit later.
3. Check the capacity state. If it is throttled, new Spark jobs are rejected until it recovers.
4. If this happens regularly, compare the Spark VCores and burst numbers with your job pool settings, or consider a larger SKU.
5. For fairness between teams, consider disabling job-level bursting.

## Practical notes (my advice)

This is my suggestion, not Microsoft guidance:

1. Check pool settings first. A pool that asks for many nodes can use a large share of the capacity.
2. Schedule heavy batch jobs outside business hours, so interactive work gets cores.
3. Expect jobs in the queue to run late rather than never, and set alerts for jobs that expire after 24 hours.
4. Watch the queue limit of your SKU. When the queue is full, a new job faces the same rate limit.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)
- [Apache Spark](https://www.m365.fm/entity/apache-spark/)

## Sources

- [Concurrency limits and queueing in Apache Spark for Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/data-engineering/spark-job-concurrency-and-queueing)
