---
title: "Build a Custom Connector From an OpenAPI Definition in Power Platform"
summary: "Import an OpenAPI 2.0 file to create a custom connector for Power Automate, Power Apps or Logic Apps: requirements, import steps, the General, Security and Definition tabs, testing and gaps in the Learn tutorial."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [custom-connectors, power-automate]
keypoints:
  - "The definition must be OpenAPI 2.0 (formerly Swagger) and under 1 MB. The article says OpenAPI 3.0 definitions are not supported."
  - "In Power Automate or Power Apps, use Solutions, then New > Automation > Custom connector, then Import an OpenAPI file."
  - "Client credentials in OAuth security definitions are not supported. If there are several security definitions, the top one is used."
  - "The tutorial example uses an API key in a header. The parameter name and location must match what the API expects."
  - "Testing is available only in Power Automate and Power Apps, not in Logic Apps. Check the Validation area before you save."
faq:
  - q: "Which OpenAPI version can I import?"
    a: "According to Microsoft Learn, OpenAPI 2.0, formerly Swagger. The article says OpenAPI 3.0 definitions are not supported."
  - q: "How big can the definition be?"
    a: "Learn says the definition must be less than 1 MB."
  - q: "Where do I start in Power Automate?"
    a: "In a solution, select New > Automation > Custom connector, then Import an OpenAPI file, enter a name, choose the file and select Continue."
  - q: "Which authentication does the tutorial cover?"
    a: "Only API key. Learn says several authentication options exist but the tutorial covers API key. Client credentials in OAuth security definitions are not supported."
  - q: "Can I test in Logic Apps?"
    a: "No. Learn says testing is available only in Power Automate and Power Apps."
---

To create a custom connector from an OpenAPI definition, import an OpenAPI 2.0 file in a Power Automate or Power Apps solution, review the General, Security and Definition tabs, create the connector and test it. This guide follows the Microsoft Learn tutorial.

## Requirements

- **Format:** OpenAPI 2.0, formerly Swagger. OpenAPI 3.0 definitions are not supported.
- **Size:** the definition must be less than 1 MB.
- **Security definitions:** if there are several, the connector uses the top one. Client credentials in OAuth security definitions are not supported.
- **Subscription:** Azure for Logic Apps, or Power Automate or Power Apps.

## Import the definition

**Power Automate or Power Apps**

1. Sign in to Power Apps or Power Automate.
2. Select **Solutions**, then open or create a solution.
3. Select **New** > **Automation** > **Custom connector**.
4. Select **Import an OpenAPI file**, enter a name, choose the file and select **Continue**.

**Logic Apps:** in the Azure portal open your custom connector, select **Logic Apps Connector**, then **Edit**, and under **General** select **Upload an OpenAPI file**.

The article does not describe importing from a URL.

## The wizard tabs

- **General:** shows values imported from the definition, such as title, description, `host`, `basePath` and `schemes`. The connector builds the call URL from host and base path. Select **Create connector** at the top.
- **Security:** shows the authentication type. The tutorial example is an API key in a header, and the parameter name and location must match what the API expects.
- **Definition:** lists actions and triggers. The example has one action and no triggers. Here you edit the selected operation, the request and the response, and see the **Validation** list.

In the Definition tab, **Visibility** can be `none` (normal), `advanced` (under an extra menu), `internal` (hidden from users) or `important` (shown first). Check **Validation** for detected issues before you save. Select **Update connector** in the upper-right corner to save changes.

## Test the connector

Testing is available only in Power Automate and Power Apps. After you create an API-key connector, wait a few minutes before testing. Create a connection with the API key, refresh the **Test** page, enter a value for the input and select **Test operation**. In the tutorial the response contains a sentiment score between 0 and 1.

## The tutorial example

The tutorial uses a Cognitive Services Text Analytics API with an API key. The imported definition has a security definition of type `apiKey` placed in a header named `Ocp-Apim-Subscription-Key`. The single action sends a POST request to `/text/analytics/v2.0/sentiment` and returns `id` and `score` fields. In the request body you can change field descriptions, for example the description of `id`. The response lists only a 200 status. The label for the key appears when a user first creates a connection, and you can edit it.

## After the import

Once the connector exists, the tutorial creates a connection with the API key on the Test page and tests the operation. After that, the article only links to other pages for using the connector in Power Automate, Power Apps, Logic Apps and Copilot Studio, and for sharing and certifying it. My advice: read the Validation list again after every change to the definition.

## Download the definition

You can download the OpenAPI definition the service uses internally, from the custom connector in Logic Apps or from the custom connector list in Power Automate or Power Apps.

## Troubleshooting checklist

This list is a suggestion built from the requirements above, not a Microsoft procedure.

1. Confirm the file is OpenAPI 2.0 and under 1 MB.
2. Check the security definition. Only the top one is used, and OAuth client credentials are not supported.
3. Read the **Validation** list on the Definition tab.
4. Wait a few minutes after creating an API-key connector, then test again.

## Not covered by the tutorial

The article does not describe licensing, permissions or who can create and share connectors. It also does not explain authentication types other than API key, triggers, webhooks, the `x-ms-*` extensions, SOAP APIs, on-premises connectivity or the exact time before a new connector is ready. It mentions several of these only briefly and links to other pages.

## Related

- [Custom connectors](https://www.m365.fm/entity/custom-connectors/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)

## Sources

- [Create a custom connector from an OpenAPI definition (Microsoft Learn)](https://learn.microsoft.com/connectors/custom-connectors/define-openapi-definition)
