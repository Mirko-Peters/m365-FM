---
title: "Microsoft Fabric Apps: What They Are and How to Use Them"
summary: "Fabric Apps (preview) lets developers build data-driven apps on Microsoft Fabric with TypeScript. This guide covers what the feature is, the admin switch, how to create and deploy an app, permissions and current limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [microsoft-fabric-apps, fabric, fabric-capacity, fabric-tenant-settings]
keypoints:
  - "Fabric Apps is a preview feature built on the Rayfin SDK. Developers define data models in TypeScript and Fabric generates the database, GraphQL API, authentication and hosting."
  - "A tenant admin must first enable Fabric Apps (preview) under Tenant settings in the Fabric admin portal, for the whole organization or for specific security groups."
  - "The workspace needs Fabric capacity assigned. Fabric Apps services consume capacity units from it."
  - "After deployment, sign-in is Fabric SSO through Microsoft Entra ID only. Email and password work only for local development."
  - "Microsoft lists limits such as no many-to-many relations, no composite keys, no ALM and no private link support, so check them before you commit to a design."
faq:
  - q: "Are Fabric Apps generally available?"
    a: "No. Microsoft Learn marks Fabric Apps as a preview feature and says it is not available in all regions yet. The pages read for this article do not describe a general availability date."
  - q: "Who can create a Fabric app?"
    a: "According to Microsoft Learn, you need Contributor or Admin permissions in a Fabric workspace that has Fabric capacity, and a tenant admin must have enabled the Fabric Apps (preview) tenant setting. Node.js 20 or later is required for local development."
  - q: "Which sign-in methods do deployed Fabric Apps support?"
    a: "Microsoft Learn says deployed apps use Fabric SSO, which is Microsoft Entra single sign-on, exclusively. Email and password sign-in is available for local development only, and you cannot deploy without authentication enabled."
  - q: "Can a Fabric app use an existing database?"
    a: "No. The Microsoft Learn FAQ says Fabric Apps manages the schema from your TypeScript models and cannot point at a database with a predefined schema. To reach an existing lakehouse, warehouse or SQL database in Fabric, you add a connector."
  - q: "Do the Microsoft pages explain pricing for Fabric Apps?"
    a: "They do not. The FAQ lists pricing, regions and admin settings as not covered. The overview only states that the workspace needs Fabric capacity and that Fabric Apps services consume capacity units from it."
---

Fabric Apps is a Microsoft Fabric feature, currently in preview, for building data-driven applications. Developers write data models in TypeScript, and Fabric generates the database schema, GraphQL APIs, sign-in and hosting. It is aimed at developers, not at report authors, and it is separate from Power BI apps.

## What Fabric Apps does

Microsoft Learn describes Fabric Apps as built on the Rayfin SDK. You decorate TypeScript classes, for example with `@entity()`, `@text()` or `@uuid()`. From that model Fabric produces:

- database tables, with a SQL database in Fabric as the managed store
- a GraphQL endpoint at `/api/graphql` on the app backend URL
- row-level authorization rules through `@role` decorators
- type-safe client methods
- static hosting for the frontend

The app runs as a managed service with child items for app hosting, the database, GraphQL APIs and authentication. Fabric manages hosting, networking and scaling.

Other documented capabilities include typed connectors to a lakehouse, warehouse, SQL database in Fabric or semantic model, and typed file storage with access policies.

## Where it fits

Microsoft names these as good fits: rapid prototyping, internal tools and dashboards, data exploration with Fabric connectors, and AI or agent apps that need persistent state. It names these as possibly poor fits: apps that need complex multi-step transactions or stored procedures, and apps that need custom authentication providers.

## Step 1: Enable the tenant setting

This is an admin task, and it must happen before users can create the item.

1. Sign in to the Fabric admin portal.
2. Open **Tenant settings**.
3. Under **Fabric Apps (preview)**, set the toggle to **Enabled**.
4. Choose the entire organization or specific security groups.
5. Select **Apply**.

Changes may take a few minutes to propagate.

## Step 2: Prepare the workspace

The workspace must have Fabric capacity assigned. Choose a capacity when you create the workspace. To create an app you need Contributor or Admin permissions in it. For local work, install Node.js 20 or later.

## Step 3: Create the app item

1. In the left navigation, select **Workspaces** and open your workspace.
2. Select **New item**, search for **App**, and select it.
3. Enter a name and select **Create**.

The portal then shows a command to download a project locally. It has this shape:

`npm create @microsoft/rayfin@latest -- "<appitemname>" --template todoapp --workspace <workspacename>`

## Step 4: Develop and deploy

Edit the project, or work with GitHub Copilot, then test against the Fabric backend with `npm run dev`. Deploy with `npx rayfin up`. To deploy to another workspace, add `--workspace <workspacename>`. Confirm the backend with `npx rayfin up status`.

Microsoft states that the first deployment takes about 2 to 5 minutes, and a static-content-only redeploy about 30 to 60 seconds. To roll back, check out the earlier git commit and run `npx rayfin up` again.

## What you see in the Fabric portal

After `rayfin up`, the app item shows child items that Fabric created from your `rayfin.yml` configuration:

- **SQL database in Fabric:** the managed database. In the portal you can view it, run queries in the query editor and copy the connection string, but it is read-only there.
- **Authentication:** Fabric-brokered sign-in through Microsoft Entra ID. You can view the authenticated users in the SQL database.
- **Static Content:** the built frontend assets (HTML, CSS and JavaScript), served from a Fabric Apps hosting URL. Access can be protected or anonymous, depending on the `assetAccess` setting.

The item properties show an **App Backend URL** for all backend services and an **App URL** for the hosted frontend.

## Authentication and permissions

Local development supports Microsoft Entra SSO and email and password. After deployment, only Fabric SSO works, and you cannot deploy without authentication enabled.

Item permissions are separate from workspace roles:

| Permission | Allows |
|---|---|
| Run and interact | Open and use the app and call its backend APIs. All workspace members get it by default. |
| Edit (Write) | Deploy, change schema, update settings, manage child services |
| Reshare | Grant others access. Requires the admin role on the workspace. |

A Fabric administrator can temporarily block other users from loading an app, while the owner can still open it.

Security stays partly with you. Microsoft says to keep secrets out of code and frontend assets, and that your code decides what signed-in users see and do.

## Limits to check first

The FAQ lists these current limitations:

- no many-to-many relationships and no composite primary keys (every entity needs a single UUID field named `id`)
- no custom authentication providers
- no multi-environment management out of the box
- no workspace outbound access protection
- no tenant-level or workspace-level private links
- no application lifecycle management (ALM)
- `count()` is not available on the fluent GraphQL client

Data models also need TypeScript decorators. The frontend can be any framework that makes HTTP requests.

## Typical problems

Microsoft names a missing production build as the most common cause of build errors, so run `npm run build` first. For capacity or permission errors, confirm the workspace has capacity and that you can create or change items in it. For schema errors, review changes since the last successful deployment. Do not edit the SQL database by hand, because manual changes can create conflicts and break the app. Make schema changes in code and apply them with `npx rayfin up db apply`.

## Related

- [Microsoft Fabric Apps](https://www.m365.fm/entity/microsoft-fabric-apps/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)
- [Fabric tenant settings](https://www.m365.fm/entity/fabric-tenant-settings/)

## Sources

- [Fabric Apps overview (preview)](https://learn.microsoft.com/en-us/fabric/apps/overview)
- [Create your first Fabric Apps project](https://learn.microsoft.com/en-us/fabric/apps/create-app)
- [Fabric Apps FAQ](https://learn.microsoft.com/en-au/fabric/apps/faq)
