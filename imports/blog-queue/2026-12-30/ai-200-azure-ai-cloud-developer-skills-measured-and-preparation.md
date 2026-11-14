---
title: "AI-200 Azure AI Cloud Developer: Skills Measured, Exam Facts and What Learn Says About AZ-204"
summary: "The AI-200 exam for the Azure AI Cloud Developer Associate certification from Microsoft Learn: audience, four domains with weightings and subtopics, 120 minute duration, languages, preparation resources, renewal, and the fact that the pages say nothing about replacing AZ-204. No questions."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [ai-200, az-204]
keypoints:
  - "AI-200, Developing AI Cloud Solutions on Azure, leads to the Microsoft Certified: Azure AI Cloud Developer Associate certification. A score of 700 or greater is required."
  - "The Learn pages do not say that it replaces AZ-204 or any other exam, and they state no retirement. The study guide only links AZ-204 for training."
  - "Domains: containerized solutions 20 to 25 percent, data management services 25 to 30 percent, connect to and consume Azure services 20 to 25 percent, secure, monitor and troubleshoot 20 to 25 percent."
  - "The exam is 120 minutes, proctored, scheduled through Pearson VUE, and offered in English and twelve other languages."
  - "The study guide has no explicit skills-measured-as-of date and no change log. Page timestamps are 2026-10-30 and 2026-11-05."
faq:
  - q: "Does AI-200 replace AZ-204?"
    a: "According to Microsoft Learn, neither the exam study guide nor the certification page says so. The study guide only links the AZ-204 page for training, and states no retirement."
  - q: "What is the passing score?"
    a: "700 or greater, according to the study guide."
  - q: "How long is the exam?"
    a: "The certification page lists 120 minutes. It is proctored and scheduled through Pearson VUE."
  - q: "What does the exam focus on?"
    a: "Implementing AI solutions on Azure with an emphasis on back-end services: containers, Cosmos DB, PostgreSQL and Managed Redis with vector search, Service Bus, Event Grid, Functions, Key Vault, App Configuration, OpenTelemetry and KQL."
  - q: "How do I renew it?"
    a: "The study guide says associate certifications expire annually and can be renewed by passing a free online assessment on Microsoft Learn."
---

AI-200 is the exam for the Microsoft Certified: Azure AI Cloud Developer Associate certification. This article outlines the Microsoft Learn study guide and certification page, skills only, with no exam questions. The topic was requested with the question what it replaces. The Learn pages I read give no answer to that, and I will not invent one.

## Replacement and status

The study guide makes no statement about replacing AZ-204 or any other exam and says nothing about retirement. Its training link points to the AZ-204 exam page, which Learn does not describe as a replacement. The certification page does not name a predecessor or successor either, and gives no availability or retirement status. Its Last Updated field reads 10/07/2026, and the study guide shows 2026-10-30. The study guide has no explicit skills-measured-as-of date and no change log.

## Audience profile

Candidates contribute to all phases of implementing AI solutions on Azure, with an emphasis on back-end services and components, and support requirements gathering, design, development, deployment, security and monitoring. Proficiency is expected in Azure SDKs and third-party SDKs used in Azure, data management services, monitoring and troubleshooting, messaging and eventing, vector databases, Python and containerized applications.

## Skills measured

**Develop containerized solutions on Azure (20 to 25 percent)**
- Container hosting: build, store and version images with Azure Container Registry, use Registry Tasks, deploy to App Service with environment variables and secrets.
- Orchestration: deploy to Azure Container Apps with revisions, event-driven scaling with KEDA, deploy to AKS with manifests, and monitor and troubleshoot AKS and Container Apps.

**Develop AI solutions by using Azure data management services (25 to 30 percent)**
- Azure Cosmos DB for NoSQL: SDK queries, tune RU consumption with indexing and consistency, store embeddings and run vector similarity search, change feed processor.
- Azure Database for PostgreSQL: SDK access, schema and indexing, pgvector latency, compute and storage for vector workloads, similarity search and retrieval-augmented generation with metadata filters, connection optimization.
- Azure Managed Redis: caching, expiration and invalidation, vector indexing.

**Connect to and consume Azure services (20 to 25 percent)**
- Service Bus queues, topics and subscriptions with dead-letter handling, and Event Grid with filters, custom events and retries.
- Azure Functions: serverless APIs, triggers, bindings, configure and deploy function apps.

**Secure, monitor and troubleshoot Azure solutions (20 to 25 percent)**
- Key Vault secrets with rotation and retrieval, and Azure App Configuration.
- OpenTelemetry tracing and KQL queries for logs and metrics.

The ranges do not sum to exactly 100 percent. The bullets illustrate how a skill is assessed, and related topics may also appear.

## Exam facts from the certification page

- 120 minutes, proctored, possibly with interactive components, scheduled through Pearson VUE.
- Languages: English, Arabic (Saudi Arabia), Chinese (Simplified and Traditional), French, German, Indonesian, Italian, Japanese, Korean, Portuguese (Brazil), Russian and Spanish.
- Price varies by country or region, and no amount is listed. Learn advises registering with a personal Microsoft account.
- A failed candidate can retake after 24 hours, with later waiting periods varying.

## Preparation

The study guide lists a Practice Assessment on AI Skills Navigator, an exam sandbox, an exam prep video, Azure documentation for the services above, Microsoft Q&A and community resources. Associate certifications expire annually and renew through a free online assessment.

## A study order suggestion

This section is a suggestion, not Microsoft guidance. The data management domain carries the most weight and includes vector search in three services, so compare the vector features of Cosmos DB, PostgreSQL and Managed Redis side by side.

## Documentation Learn lists

The study guide links Azure documentation for Container Registry, Container Instances, App Service, Azure Functions, Cosmos DB, Blob Storage, Microsoft Entra ID, Key Vault, Azure Cache for Redis, API Management, Event Hubs, Event Grid, Service Bus and Queue Storage. Some of these, such as Blob Storage and Event Hubs, do not appear in the skills bullets above, so treat the list as general reading, not as a map of exam topics. Localized exams arrive about eight weeks after the English version, and you can request an extra 30 minutes if your language is not available.

## Not covered

The pages do not give the number of questions, question types, delivery options beyond Pearson VUE, or how percentage ranges translate into question counts.

## Related

- [AI-200](https://www.m365.fm/entity/ai-200/)
- [AZ-204](https://www.m365.fm/entity/az-204/)

## Sources

- [Study guide for Exam AI-200](https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-200)
- [Microsoft Certified: Azure AI Cloud Developer Associate](https://learn.microsoft.com/credentials/certifications/azure-ai-cloud-developer-associate/)
