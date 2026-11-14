---
title: "How to Create and Edit Skills in Microsoft 365 Copilot"
summary: "Create a Copilot skill from a chat, upload an existing SKILL.md or ZIP, manage skills under Agents and Skills, and control automatic use. Steps from the Microsoft Support page plus the SKILL.md format rules from Microsoft Learn for Copilot Cowork plugins."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [copilot]
keypoints:
  - "A skill is a set of reusable instructions with optional reference files, assets and scripts, and Copilot can use one automatically or you can pick it."
  - "Create one by describing a repeatable workflow in Copilot Chat, opening the offered skill in the skill builder, editing it and saving."
  - "Upload an existing skill as a standalone SKILL.md file or a ZIP with SKILL.md at its root, using Upload skill from the Add dropdown."
  - "To stop automatic use, open Agents and Skills, select the skill and turn off automatic invocation."
  - "The Learn format for Cowork plugins needs a name that matches the folder and a description of 1 to 1024 characters with trigger phrases."
faq:
  - q: "What is a skill in Microsoft Copilot?"
    a: "According to the Microsoft Support page, skills customize Copilot for specific tasks and consistent workflows. Each skill has reusable instructions and can include supporting reference files, assets, scripts and folders. Copilot can use a skill automatically when it is relevant, or you can choose one."
  - q: "How do I create a skill from a chat?"
    a: "Describe the repeatable workflow in Copilot Chat, including the intended outcome, required steps, constraints, expected output format and any source files or data. When Copilot offers to create the skill, open it in the skill builder, review the name, description, instructions, workflow and included files, keep it focused on one clear job and save it."
  - q: "How do I upload a skill I already have?"
    a: "The page says a skill can be a standalone SKILL.md file or a ZIP with SKILL.md at its root plus optional supporting files. In Microsoft Copilot, open Home, right-click Agents, choose More agents, then choose Upload skill from the Add dropdown. Upload the file, review the name and description, and save. Then reopen the skill to check its instructions and files."
  - q: "How do I stop Copilot from using a skill on its own?"
    a: "Open Agents and Skills, select the skill and turn off automatic invocation. The page describes the setting as Let Copilot use this skill automatically. When it is enabled, Copilot can select the skill from a normal conversation."
  - q: "What are the format rules for SKILL.md?"
    a: "The Microsoft Learn page on building Copilot Cowork plugins describes a SKILL.md with YAML frontmatter and a Markdown body. The name field is 1 to 64 characters in kebab-case and must match the folder name, and the description is 1 to 1024 characters and should include trigger phrases. That page covers Cowork plugin packages, so confirm that the same limits apply to skills you upload in Copilot."
---

A Copilot skill is a reusable set of instructions for a task you repeat. You can build one from a chat, or upload a `SKILL.md` file or a ZIP package you already have. This article follows the Microsoft Support page on creating and editing skills, and adds the `SKILL.md` format described on Microsoft Learn for Copilot Cowork plugins. The Support page uses the name Microsoft Copilot.

## What a skill is

The Support page says skills customize Copilot for specific tasks and consistent workflows. Each skill has reusable instructions and can include supporting reference files, assets, scripts and folders. Copilot can use a skill automatically when it is relevant, or you can choose one yourself.

## Requirements

- Access to Microsoft Copilot.
- Permission to open **Agents & Skills**.
- The `SKILL.md` file or a packaged skill ZIP, if you plan to upload one.

## Create a skill from Copilot Chat

1. Describe the repeatable workflow in Chat. Include the intended outcome, the required steps, constraints, the expected output format, and any source files or data.
2. When Copilot offers to create the skill, open it in the skill builder.
3. Review and edit the name, description, instructions, workflow and included files. The page says to keep the skill focused on one clear job.
4. Save the skill.

To update an existing skill, revise it and review the final version before sharing.

## Add an existing skill

A skill can be a standalone `SKILL.md` file or a ZIP that contains `SKILL.md` at its root, with optional supporting files.

1. In Microsoft Copilot, open **Home**.
2. Right-click **Agents** and choose **More agents**.
3. From the **Add** dropdown, choose **Upload skill**.
4. Upload the file or ZIP, review the name and description, and save.
5. Reopen the skill to check its instructions and included files.

## Find and manage skills

Open **Agents & Skills** to find agents, personal skills and installed plugin packages. Skills deployed by your organization, or acquired through Copilot Cowork, may appear there when they are available to you. They may appear only once they are available to you.

## Use a skill

- **Explicit selection.** Pick the skill, or choose it from the Agents and Skills section, and enter your task.
- **Automatic use.** When **Let Copilot use this skill automatically** is enabled, Copilot can select the skill from a normal conversation. To stop that, open Agents & Skills, select the skill and turn off automatic invocation.

For complex, multi-step tasks, the page suggests using skills with Advanced Reasoning, and says to check the current preview limits for skill files, scripts, network access and package installation before relying on it in production.

## The SKILL.md format

The Support page says each skill has a required `SKILL.md` file with its instructions, and that Copilot Chat supports the agentskills.io standard. The field limits below come from the Microsoft Learn page on building plugins for Copilot Cowork, for skills inside plugin packages. Treat them as the Cowork plugin rules. My advice: check whether they match your upload before you depend on them.

A skill is a folder containing a `SKILL.md` file, written as YAML frontmatter plus a Markdown body.

| Field | Constraint on the Learn page |
| --- | --- |
| `name` | 1 to 64 characters, kebab-case, must match the folder name exactly |
| `description` | 1 to 1024 characters, describes when to use the skill and includes trigger phrases |

Other points from that page:

- Kebab-case means lowercase letters, digits and hyphens, with no consecutive, leading or trailing hyphens. Learn calls a name and folder mismatch the most common cause of skill failures.
- Extra files are companion files. A skill can include up to 20, each up to 5 MB, with a total of 10 MB and a 15-second download timeout for all companions.
- Skills load in layers: the name and description at startup, the `SKILL.md` body when the skill triggers, references on demand, and scripts executed instead of loaded into context. The page's target for the body is under 5,000 tokens, about 1,500 to 2,000 words.
- Authoring advice: write a specific description with trigger phrases, structure the body as a numbered workflow, define the output format, keep `SKILL.md` lean and move detail to a `references/` folder, and do not embed secrets.

## Writing a good skill (my advice)

This is my suggestion, not Microsoft guidance:

1. Start from a task you have already done by hand three times. A skill made from a real example is easier to test.
2. Put the expected output in the instructions, such as a table with named columns, so results look the same each time.
3. Write one skill per job. If the description needs the word and, split it.
4. Test the skill by selecting it explicitly first. Turn on automatic use only after it behaves well, and watch for unexpected triggers.
5. When you change a skill that others use, review the final version before you share the update.

## Limits of this article

This article describes only the steps above and makes no claims about further settings, sharing options or numeric limits for skills created in Copilot. The Learn limits quoted apply to Cowork plugin packages.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Create and edit skills with Copilot (Microsoft Support)](https://support.microsoft.com/microsoft-365-copilot/create-edit-skills-copilot)
- [Build plugins for Copilot Cowork (Microsoft Learn)](https://learn.microsoft.com/copilot/cowork/cowork-plugin-development)
