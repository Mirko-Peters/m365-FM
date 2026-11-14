---
title: "Power BI PBIP Merge Conflicts: Use TMDL and PBIR to Resolve Git Conflicts Between Desktop and Fabric"
summary: "Why Power BI Desktop project files conflict in Git, how TMDL and PBIR make merges smaller, what to ignore and configure, and how to combine file-level merges with Fabric Git integration conflict options."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [power-bi-project-pbip, tmdl, git, fabric]
keypoints:
  - "A PBIP stores the report and semantic model as plain-text files, so Git can diff and merge them. PBIX cannot be merged this way."
  - "TMDL splits the model into one file per table, role and culture, which Learn says gives a good diff and merge experience."
  - "PBIR stores each page, visual and bookmark as its own JSON file, so conflicts are scoped to individual objects."
  - "Keep cache.abf and localSettings.json out of Git. The default .gitignore does this, and CRLF line endings can cause noisy diffs."
  - "Fabric Git integration conflicts are resolved by Accept incoming changes, Keep current content, revert, or by merging in Git."
faq:
  - q: "Why do PBIP files conflict less than PBIX files?"
    a: "According to Microsoft Learn, a PBIP saves the report and semantic model as individual plain-text files in folders. With TMDL, each table, role and culture has its own file, and with PBIR each page, visual and bookmark has its own JSON file, so edits by different people usually touch different files."
  - q: "Which semantic model format should I use for team development?"
    a: "Learn says definition.pbism version 4.0 or above allows TMSL (model.bim) or TMDL (a definition folder). It describes TMDL as designed for a great source control and co-development experience with git diffs and merge conflicts, while model.bim is a single big JSON file."
  - q: "Which files should stay out of Git?"
    a: "Learn says the default .gitignore excludes .pbi/localSettings.json and .pbi/cache.abf. localSettings.json holds per-user settings and cache.abf is a local data cache. unappliedChanges.json is saved to Git by default, but you can exclude it."
  - q: "What do I do when Fabric shows a conflict on my workspace?"
    a: "The Fabric conflict article lists options. Select Update > Resolve Conflicts and choose Accept incoming changes or Keep current content for each item, use Undo or git revert to return to the last synced state, or check out a new branch, merge in Git and switch the workspace back to the original branch."
---

A Power BI Desktop project (PBIP) turns a report and its semantic model into folders of text files, which is what makes Git workflows practical. Conflicts still happen, mainly when two people edit the same file or when generated files and line endings add noise. This article covers how to reduce conflicts before they occur and how to resolve them, both in Git and with Fabric Git integration. It complements the separate article on Fabric workspace conflicts, which focuses on the workspace side.

## Why PBIP merges better than PBIX

Microsoft Learn says a PBIP saves report and semantic model items as individual plain-text files in folders. Two formats make merges small:

- **TMDL** for the semantic model. In definition.pbism, version 4.0 or above can use TMDL in a definition folder or TMSL in a model.bim file. TMSL is one big JSON file. TMDL has separate files for each table, perspective, role and culture. Learn says the folder structure leads to a great source control and co-development experience with git diffs and merge conflicts.
- **PBIR** for the report. Learn says it is generally available and the default report format. Each page, visual and bookmark is stored as its own JSON file, and merge conflicts are easier to resolve because they are scoped to individual objects. PBIR-Legacy keeps the entire report in one report.json file.

If your project still uses model.bim or PBIR-Legacy, two developers working in different parts of the model or report can still collide in the single file. Moving to TMDL and PBIR is the main prevention step. Note that definition.pbism version 1.0 allows only TMSL, and definition.pbir version 1.0 supports only PBIR-Legacy.

## Folder layout to know

The project contains a SemanticModel folder and a Report folder. Important items:

- definition.pbism in the semantic model folder, and definition.pbir in the report folder.
- A definition folder with TMDL files, or model.bim.
- For PBIR, a definition folder with pages, visuals, bookmarks, report.json and version.json.
- A .pbi folder with localSettings.json, cache.abf, editorSettings.json and unappliedChanges.json.
- A .platform file, which Learn says maintains the connection between the item and Git.

## Set up the repository to avoid noise

1. **Keep local files out of Git.** If no .gitignore exists, Power BI Desktop creates one with **/.pbi/localSettings.json and **/.pbi/cache.abf. Do not remove these. The cache is a local data copy and the settings are per user and per computer.
2. **Decide about unappliedChanges.json.** It holds unapplied Power Query changes. It is saved to Git by default, and Learn says you can exclude it.
3. **Configure line endings.** Power BI Desktop uses CRLF line endings. Learn says to configure Git's autocrlf to avoid noisy diffs.
4. **Use short root paths.** Windows limits paths to 260 characters by default, and PBIR creates deep folder trees.
5. **Do not save the project in OneDrive or SharePoint folders.** Learn says syncing can cause save failures.
6. **Save files as UTF-8 without BOM** when editing outside Desktop.

## Working practices that reduce conflicts

- Give each developer a branch, and in Fabric a separate workspace. Each Fabric workspace connects to a single branch.
- Make small, frequent commits and pull before you start.
- Avoid renaming pages, visuals and bookmarks by hand. PBIR names default to a 20-character identifier. Learn says renaming can break internal and external references.
- Avoid reformatting files outside Desktop. Learn says schemas for report.json, mobileState.json, semanticModelDiagramLayout.json and diagramLayout.json are undocumented, and editing them outside Desktop is not supported. diagramLayout.json cannot be edited externally.

## Resolve a conflict in Git

When Git reports a conflict in a PBIP project:

1. **Identify the file type.** A conflict in a TMDL file, for example a table, is a text conflict inside that table. A conflict in a PBIR visual.json is a conflict inside that one visual.
2. **Resolve in a text editor such as VS Code.** The semantic model article recommends VS Code with the TMDL extension. Save the files.
3. **Open the project in Power BI Desktop.** Learn says Desktop detects external changes and shows an **Apply external changes** banner. If Desktop has unsaved changes, applying external changes overwrites them, so save first.
4. **Read the errors.** For PBIR, blocking errors such as an invalid schema or missing required properties stop the changes from loading and must be fixed first. Non-blocking errors, such as an invalid activePageName, are fixed automatically and you can review the correction before saving.
5. **Commit the merge only after the project opens and renders.**

Single-file formats are harder. For a conflict in model.bim or a PBIR-Legacy report.json, the conflict markers can span large regions. Converting to TMDL and PBIR before the team grows is easier than resolving those conflicts repeatedly.

## Resolve a conflict with Fabric Git integration

Fabric reports a conflict when the same item changed in both the workspace and the Git branch. The status shows **Conflict** and **Commit** is disabled. The conflict article lists these options:

1. **Resolve Conflicts in the UI.** Select **Update**, then **Resolve Conflicts**. Per item, choose **Accept incoming changes** (Git version overwrites the workspace item and workspace changes are lost), **Keep current content** (the status becomes uncommitted changes until you commit) or **Compare and commit changes** for a side-by-side view.
2. **Revert.** **Undo** returns conflicted items to the last synced state, or run git revert in Azure DevOps. Disconnecting and reconnecting overwrites all items, not just conflicted ones, and does not restore the last synced state.
3. **Resolve in Git.** In **Source control**, check out a new branch from the last synced branch ID shown at the bottom, commit your changes there, resolve the conflicts between the branches in Git, merge, then switch the workspace back to the original branch in Fabric.
4. **Manual update.** If items fail to update, use the partial update process.

Accept incoming changes has no recovery in Fabric. By default only workspace Admins can switch a workspace's Git branch, and an Admin can allow Contributors to do it.

The right choice for a PBIP project is usually option 3 for anything the team cares about. A branch merge keeps both sets of file-level changes, while the UI options pick one version per item.

## Deployment note

Learn lists three ways to deploy a PBIP: Fabric Git integration, Fabric APIs and Power BI Desktop publish. Publishing from Desktop deploys metadata and the local data cache. The other two deploy metadata only. Fabric Git integration and the REST APIs export report definitions using PBIR.

## Limits that affect merges

- Sensitivity labels are not supported in PBIP.
- Row-level security role members and incremental refresh partitions cannot be read or set through the Fabric REST API.
- Some PBIR metadata files can contain data values from the model. A filter on Company equal to Contoso persists the value in the file. Review diffs before you push to a shared repository.

## Common mistakes

- Committing cache.abf by removing the ignore rule.
- Editing the same model.bim in two branches.
- Applying external changes in Desktop before saving local work.
- Choosing Accept incoming changes without checking what the workspace held.
- Resolving conflicts in a clone with different line ending settings.

## Related

- [Power BI Desktop project (PBIP)](https://www.m365.fm/entity/power-bi-project-pbip/)
- [Tabular Model Definition Language (TMDL)](https://www.m365.fm/entity/tmdl/)
- [Git](https://www.m365.fm/entity/git/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [Microsoft Learn: Power BI Desktop projects overview](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview)
- [Microsoft Learn: Power BI Desktop project semantic model folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-dataset)
- [Microsoft Learn: Power BI enhanced report format (PBIR)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report)
- [Microsoft Learn: Git integration in Visual Studio Code](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-git)
- [Microsoft Learn: Fabric Git integration conflict resolution](https://learn.microsoft.com/en-us/fabric/cicd/git-integration/conflict-resolution)
