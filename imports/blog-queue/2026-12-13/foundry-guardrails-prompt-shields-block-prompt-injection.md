---
title: "Microsoft Foundry Guardrails: Configure Prompt Shields to Block Direct Prompt Injection Attacks"
summary: "How to create a guardrail in Microsoft Foundry (formerly Azure AI Foundry), add the user prompt attack control, assign it to models and agents, test it, and what Prompt Shields do and do not detect."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [azure-ai-foundry, azure-ai-content-safety, prompt-injection, ai-guardrails]
keypoints:
  - "Direct prompt injection is the user prompt attack control, powered by Prompt Shields, and it is enabled by default in Foundry."
  - "Create a guardrail under Build > Guardrails > Create Guardrail, add a control, then assign it to models or agents."
  - "User prompt attacks can only be scanned at the user input intervention point."
  - "Prompt Shields do not judge whether content is harmful or accurate, and a no attack result does not mean the input is benign."
  - "Guardrail processing adds about 50 to 100 ms of latency per intervention point, so test before you assign it in production."
faq:
  - q: "Is direct prompt injection the same as a user prompt attack?"
    a: "Microsoft Learn describes user prompt attacks as direct input that tries to circumvent or alter system instructions. This is what most people call direct prompt injection or jailbreak. Document attacks are the indirect form, hidden in documents, emails or web pages."
  - q: "Is Prompt Shields protection on by default?"
    a: "According to the Prompt Shields article, user prompt attack detection is enabled by default in Foundry, while document attack detection is off by default and must be enabled."
  - q: "Can I edit the default guardrail?"
    a: "No. Learn says Microsoft default guardrails such as Default.V2 cannot be edited. To change behavior, create a custom guardrail. When you remove a custom guardrail from a model or agent, it falls back to the Microsoft Default guardrail."
  - q: "Do Prompt Shields work in every language?"
    a: "Learn says they are multilingual but primarily trained and evaluated on English, and performance varies for non-English content. It advises testing prompts and documents separately with representative attacks and benign content in every language your application uses."
---

Direct prompt injection means a user types instructions meant to override the system prompt or the model's rules. In Microsoft Foundry (the product Learn now names Microsoft Foundry, formerly Azure AI Foundry), the control against it is called **user prompt attack** and is powered by **Prompt Shields**, part of Azure AI Content Safety. This article shows how to configure it with guardrails and what to expect.

## What Prompt Shields detect

The Prompt Shields article describes two kinds of input:

| | User prompt attacks | Document attacks (indirect) |
|---|---|---|
| Source | Direct input from a user, model or other source | Instructions embedded in documents, emails or web pages |
| Goal | Circumvent or alter system instructions | Gain unauthorized access or control |
| Foundry default | Enabled by default | Off by default |

User prompt attack subtypes named by Learn: attempts to change system rules, embedding a conversation mockup to confuse the model, role-play with a system persona without limitations, and encoding attacks such as ciphers or character transformations.

The limit matters just as much. Learn says Prompt Shields do not determine whether content is harmful, accurate, grounded, policy-compliant or aligned with the app's task. A result of no attack does not mean the input is benign. Prompt Shields are one layer, not a complete safety design.

## Prerequisites

From the guardrails article:

- An Azure subscription, a Microsoft Foundry project and at least one model deployment.
- The **Foundry Account Owner** role or higher on the Azure AI resource. Learn notes that these roles were renamed recently. The previous names were Azure AI Account Owner, Azure AI Owner and Azure AI User.

## Step 1: Create a guardrail

1. Go to ai.azure.com and open your project.
2. Select **Build** in the top right menu.
3. Select **Guardrails** in the left navigation.
4. Select **Create Guardrail**. The wizard starts at **Step 1: Add Controls**.

## Step 2: Add the user prompt attack control

1. Select a risk from the dropdown. Choose **User prompt attack**.
2. Choose the intervention point and one action. Learn says user input attacks can be scanned only at the user input intervention point.
3. Select **Add control**. The control appears in the table on the right.

The actions the page names are **Annotate and block**, and annotation mode, where controls report results without filtering. In annotation mode a response includes detected and filtered values, so you can see attacks without stopping them. This is useful for a trial period. Learn recommends switching from block to annotate when you are investigating false positives.

Optionally add **Indirect attacks** (the document attack control) if your app feeds retrieved content to the model. In the Prompt Shields article, document attacks also have a Spotlighting option, which is in preview. Spotlighting encodes document content in base-64 so the model treats it as lower trust. It is off by default, can increase token cost, can push large documents over input limits and works only for models used through the Chat Completions API.

Learn also says that core-harm blocking levels do not change Prompt Shields sensitivity. Configure user prompt attack and document attack detection separately from hate, sexual, violence and self-harm controls.

## Step 3: Assign the guardrail

1. Select **Next** to reach **Step 2** and choose **Add agents**, **Add models** or both.
2. Select the targets and **Save**.
3. Select **Next**, review the controls on **Step 3**, name the guardrail and select **Create**.

Removing a guardrail from a model or agent reassigns it to the Microsoft Default guardrail. For agents, the agent's guardrail overrides the model's guardrail.

To assign it to an existing deployment later, use **Build** > **Guardrails**, select the guardrail and edit assignments, or open the model or agent in **Build**, find the Guardrails section in the playground and select **Manage** > **Assign a new guardrail**. The change takes effect immediately.

## Step 4: Test the guardrail

1. In **Build** > **Guardrails**, select the guardrail row.
2. Select **Try in Playground**. If the button is missing, assign the guardrail to a model or agent first.
3. Send typical attack prompts from the subtypes above, such as a request to ignore earlier rules or a role-play setup.
4. When a control with **Annotate and block** triggers, the chat shows the detected risk and the intervention point.

Learn advises testing on a non-production model or agent, because assigning a guardrail changes safety behavior immediately. Also test benign prompts that look similar to attacks, for example a customer asking the bot to explain its own rules, to see false positives.

## Check the response

For a model call, the response carries prompt_filter_results with content_filter_results. For a user prompt attack the field is named jailbreak, with filtered and detected values. detected true with filtered false means the attack was seen but not blocked, which matches annotation mode.

## Calling it from code

Guardrails are RAI policies in Azure Resource Manager. Learn lists the operations RAI Policies Create Or Update and Deployments Create Or Update, with the raiPolicyName property to assign a guardrail to a deployment. A request can override the deployment guardrail with the x-policy-id header. If the named policy does not exist, the API returns InvalidContentFilterPolicy. Request-time overrides do not apply to image input, where the default guardrail is used.

The standalone Azure AI Content Safety API analyzes one userPrompt and up to five documents and reports attackDetected. It does not block or route content, so your application decides what to do.

## Performance and limits

- Guardrail processing adds about 50 to 100 ms of latency per intervention point.
- Default guardrails cannot be edited, and some controls cannot be deleted. Violence, hate, sexual and self-harm controls on user inputs and outputs cannot be deleted. Overriding is the only way to edit those.
- Document attack scanning for agent tool responses is in preview and limited to supported tools.
- The Prompt Shields article does not list supported regions or quotas. Check the Azure AI Content Safety region availability.

## Common mistakes

- Assuming the default guardrail covers document attacks. It does not unless enabled.
- Forgetting that the agent's guardrail overrides the model's guardrail.
- Testing only English attacks for a multilingual app.
- Blocking from day one without an annotate trial and then missing false positives.
- Treating Prompt Shields as a substitute for least-privilege tool access.

## Related

- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Azure AI Content Safety](https://www.m365.fm/entity/azure-ai-content-safety/)
- [Prompt injection](https://www.m365.fm/entity/prompt-injection/)
- [AI guardrails](https://www.m365.fm/entity/ai-guardrails/)

## Sources

- [Microsoft Learn: Prompt Shields in Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)
- [Microsoft Learn: Create and assign guardrails in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/guardrails/how-to-create-guardrails)
