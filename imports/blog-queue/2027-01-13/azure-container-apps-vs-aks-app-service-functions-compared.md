---
title: "Azure Container Apps vs AKS vs App Service vs Functions: Which Container Option Fits"
summary: "Compare Azure Container Apps, AKS, App Service, Azure Functions, Container Instances and Azure Red Hat OpenShift as Microsoft Learn describes them, with a decision path for common workloads."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [azure-container-apps, azure-kubernetes-service, azure-app-service, azure-functions]
keypoints:
  - "Learn says there is no perfect solution for every use case, and its guidance is a starting point for finding the best fit."
  - "Azure Container Apps runs serverless microservices and jobs, and does not give direct access to the Kubernetes APIs."
  - "Choose AKS when you need Kubernetes API and control plane access, or to run any Kubernetes workload."
  - "App Service is Learn's ideal option for web apps, and Azure Functions for FaaS-style event-driven functions."
  - "Container Instances is a lower-level building block with no built-in scale or load balancing; OpenShift suits teams already using it."
faq:
  - q: "When should I use Azure Container Apps instead of AKS?"
    a: "Microsoft Learn says Container Apps does not provide direct access to the underlying Kubernetes APIs. If you need access to the Kubernetes APIs and control plane, use Azure Kubernetes Service. If you want Kubernetes-style apps without needing all native Kubernetes APIs and cluster management, Container Apps provides a fully managed experience."
  - q: "Is App Service or Container Apps better for a web app?"
    a: "Learn describes App Service as fully managed hosting for web applications including websites and web APIs, deployable as code or containers, and calls it an ideal option when building web apps. Container Apps is described as optimized for general purpose containers, especially apps that span many microservices."
  - q: "How does Azure Functions differ from Container Apps?"
    a: "Learn says Azure Functions is a serverless Functions-as-a-Service solution optimized for event-driven apps using the functions programming model. It shares many scale and event characteristics with Container Apps but is optimized for ephemeral functions deployed as code or containers."
  - q: "What is the difference between AKS Standard and AKS Automatic?"
    a: "According to Learn, with AKS Standard the cluster resides in your subscription and you manage configuration and operations. With AKS Automatic, Azure preconfigures and manages common operational tasks such as node management, scaling, security defaults and upgrades."
  - q: "When do Azure Container Instances make sense?"
    a: "Learn calls Container Instances a lower-level building block that provides a single pod of Hyper-V isolated containers on demand. Concepts like scale, load balancing and certificates are not provided, so it fits when you need a less opinionated building block."
---

My short reading of the Learn text, not a Microsoft recommendation: use **App Service** for web apps, **Azure Functions** for event-driven functions, **Container Apps** for container microservices and jobs without cluster management, and **AKS** when you need direct Kubernetes API access. Microsoft Learn frames its comparison as general guidance and states that there is no perfect solution for every use case and every team. Treat this as a starting point.

The first two columns of the table below follow Learn. The **Pick it when** column is my condensed reading.

## Quick comparison

| Option | What Learn says it is | Pick it when |
| --- | --- | --- |
| Azure Container Apps | Serverless microservices and jobs based on containers | You build container microservices or event-driven apps and do not need Kubernetes APIs |
| Azure App Service | Fully managed hosting for websites and web APIs, from code or containers | You are building a web app |
| Azure Container Instances | A single pod of Hyper-V isolated containers on demand | You need a low-level building block |
| Azure Kubernetes Service | Fully managed Kubernetes platform, Standard or Automatic | You need Kubernetes API access or must run any Kubernetes workload |
| Azure Functions | Serverless Functions-as-a-Service | You build event-driven, ephemeral functions |
| Azure Red Hat OpenShift | Red Hat and Microsoft jointly engineered OpenShift | Your organization already uses OpenShift |

## Azure Container Apps

Learn says Container Apps is optimized to run general purpose containers, especially applications that span many microservices. Distinctive features it lists:

- It is powered by Kubernetes and open-source technologies such as Dapr, KEDA and envoy.
- It supports Kubernetes-style apps and microservices, with features like service discovery and traffic splitting.
- It supports event-driven architectures with scale based on traffic or on event sources such as queues, including scale to zero.
- It supports on-demand, scheduled and event-driven jobs.
- It can run Azure Functions for event-driven scenarios, using triggers, bindings and automatic scaling.

The boundary matters. Container Apps does not provide direct access to the underlying Kubernetes APIs. If you need the Kubernetes APIs and control plane, Learn says to use AKS. If you want Kubernetes-style applications without direct access to all the native APIs and cluster management, Container Apps gives a fully managed experience, and Learn says many teams prefer to start container microservices there.

## Azure App Service

App Service provides fully managed hosting for web applications, including websites and web APIs. You can deploy using code or containers. Learn says it is optimized for web applications and integrated with other Azure services including Container Apps and Azure Functions. For building web apps, Learn calls it an ideal option.

## Azure Container Instances

Learn describes ACI as a lower-level building block compared with Container Apps. Concepts like scale, load balancing and certificates are not provided with ACI containers. To scale to five instances, you create five distinct container instances. Container Apps adds application concepts on top of containers, such as certificates, revisions, scale and environments.

Learn adds that users often use ACI through other services. For example, AKS can layer orchestration and scale on top of ACI through virtual nodes. ACI is the ideal option if you need a less opinionated building block that does not align with what Container Apps optimizes for.

## Azure Kubernetes Service

AKS is a fully managed Kubernetes platform with two experience models:

- **AKS Standard.** The cluster resides in your subscription, and you manage cluster configuration and operations.
- **AKS Automatic.** Azure preconfigures and manages common operational tasks such as node management, scaling, security defaults and upgrades, for a more hands-off, production-ready experience.

AKS supports direct access to the Kubernetes API and can run any Kubernetes workload.

## Azure Functions

Functions is a serverless FaaS solution optimized for event-driven applications using the functions programming model. Learn says it shares many scale and event integration characteristics with Container Apps, but is optimized for ephemeral functions deployed as code or containers. The programming model gives productivity benefits when you trigger functions on events and bind to data sources. The Functions programming model is also available as a base container image, which makes it portable to other container-based platforms and lets teams reuse code as requirements change.

## Azure Red Hat OpenShift

Azure Red Hat OpenShift is an integrated product that Red Hat and Microsoft jointly engineer, operate and support. Teams can choose their own registry, networking, storage and CI/CD solutions, or use the built-in OpenShift solutions for source code management, builds, deployments, scaling and health management. Learn names it the ideal option if your team or organization is already using OpenShift.

## A decision path

The path below is my reading of the Learn text, not a Microsoft flowchart.

1. Is it a website or web API? Start with App Service.
2. Is it a short function triggered by an event or a data binding? Start with Azure Functions.
3. Is it a set of container microservices or jobs, and you want scale to zero and no cluster to manage? Start with Container Apps.
4. Do you need the Kubernetes API, custom control plane access or any Kubernetes workload? Choose AKS, and decide between Standard and Automatic by how much operations work you want to own.
5. Do you only need to run a container with no orchestration concepts? Look at Container Instances.
6. Does your organization run OpenShift? Look at Azure Red Hat OpenShift.

## What the comparison page does not decide

The Learn page gives positioning, not prices, limits or performance numbers. Quotas, regional availability and pricing are on each service's own pages and are not covered here. My advice, not a Microsoft statement: check them before committing, especially scale limits and networking requirements.

## Related

- [Azure Container Apps](https://www.m365.fm/entity/azure-container-apps/)
- [Azure Kubernetes Service](https://www.m365.fm/entity/azure-kubernetes-service/)
- [Azure App Service](https://www.m365.fm/entity/azure-app-service/)
- [Azure Functions](https://www.m365.fm/entity/azure-functions/)

## Sources

- [Comparing Container Apps with other Azure container options (Microsoft Learn)](https://learn.microsoft.com/azure/container-apps/compare-options)
