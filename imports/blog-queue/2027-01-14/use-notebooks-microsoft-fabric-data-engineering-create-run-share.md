---
title: "How to Use Notebooks in Microsoft Fabric for Data Engineering: Create, Run and Share"
summary: "Create or import a Fabric notebook, connect a default lakehouse, use resources, save, share and version it. Learn which identity runs a notebook interactively, from a pipeline or on a schedule, because that decides data access."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [fabric-notebooks, fabric-lakehouse, fabric]
keypoints:
  - "A Fabric notebook is the primary code item for Apache Spark jobs and machine learning experiments, used by data engineers and data scientists."
  - "The identity differs by trigger: you for interactive runs, the pipeline's last modified user for pipeline activities, and the schedule's creator or last updater for scheduled runs."
  - "Pinning a default lakehouse mounts it to the runtime working directory; restart the session after pinning or renaming one."
  - "Notebook resource folders allow 500 MB in total, 100 MB per file and up to 100 files and folders."
  - "Version history is in preview, with system checkpoints every 5 minutes that expire after 1 year."
faq:
  - q: "What is a Fabric notebook?"
    a: "Microsoft Learn calls it a primary code item for developing Apache Spark jobs and machine learning experiments, a web-based interactive surface for data scientists and data engineers. Data engineers write code for ingestion, preparation and transformation there."
  - q: "Which identity runs my notebook?"
    a: "It depends on the trigger. An interactive run uses your security context. A pipeline activity runs under the identity of the pipeline's last modified user, not the pipeline owner or the notebook owner. A scheduled run uses the user who created or last updated the schedule."
  - q: "How do I read and write the default lakehouse?"
    a: "Pin a lakehouse as the default in the Lakehouse explorer. Learn says the default is mounted to the runtime working directory, so you can read and write with a local path. You must restart the session after pinning a new lakehouse or renaming the default lakehouse."
  - q: "What are the limits for notebook resources?"
    a: "For both the built-in folder and the environment folder, Learn gives a maximum of 500 MB of resource storage, a single file size up to 100 MB, and up to 100 file or folder instances in total. The file editor has a 1 MB file size limit and does not support xlsx and parquet files."
  - q: "How does notebook version history work?"
    a: "It is a preview feature. You can create manual checkpoints, and the system creates checkpoints automatically every 5 minutes based on editing time. A diff view compares a checkpoint with the live version, and system checkpoints expire after 1 year."
---

A Fabric notebook is the primary code item for developing Apache Spark jobs and machine learning experiments. You create or import one from the workspace, attach a lakehouse, write code in cells, and share it with permissions. The main thing to plan for as a data engineer is the security context: the identity that runs the notebook depends on whether you run it by hand, from a pipeline or on a schedule. This guide follows the Microsoft Learn page on how to use notebooks.

## What a notebook is for

Learn describes it as a web-based interactive surface where data engineers write code for data ingestion, preparation and transformation, and data scientists build machine learning solutions. It lists these abilities: start with zero set-up effort, analyze raw formats (CSV, txt, JSON) and processed formats (parquet, Delta Lake) with Spark, use built-in visualization, and use Copilot for code generation, refactoring and validation.

## Know which identity runs the notebook

Learn names three ways to trigger a run, each with its own security context:

| Trigger | Runs as |
| --- | --- |
| Interactive run through the UI or REST API | You, the current user |
| Pipeline activity from a Fabric Data Factory pipeline | The pipeline's last modified user, not the pipeline owner or notebook owner |
| Scheduler | The user who created or last updated the schedule |

The identity affects data access permissions, API call authorization and resource availability. Learn's practices:

- Before running a notebook manually, check who last modified it and review the version history for changes to code you did not write. A warning message shows when a notebook is first created.
- Before adding a notebook to a pipeline, verify who last modified the pipeline. If that identity lacks permissions, have the appropriate user edit the pipeline so the last modified identity changes.
- Before creating or updating a schedule, make sure that user has the permissions for every operation in the notebook.
- Separate workspaces into dev, test and prod stages, and limit production to trusted users.

For automation, the Job Scheduler API runs notebooks on demand with parameterized execution, session configuration, environment and runtime selection, and a target lakehouse. You can monitor and cancel job instances, and runs return an exit value that pipelines and external schedulers can read. The Items REST API and the Job Scheduler API support service principal authentication, but Learn notes some downstream services, such as SQL analytics endpoints, do not support service principals and need a user principal.

## Create, import, export and save

- **Create.** From the Data Engineering homepage, the workspace **New** option or the **Create Hub**. Learn also links creation from a lakehouse, from Visual Studio Code and through the Items REST API.
- **Import.** From the workspace toolbar. Fabric recognizes Jupyter `.ipynb` files and source files such as `.py`, `.scala` and `.sql`, and creates notebook items.
- **Export.** To other standard formats from the notebook.
- **Save.** A notebook saves automatically after you open and edit it. **Save a copy** clones it in the current or another workspace. For manual saving, switch to the **Manual** save option, which gives a local branch of the notebook item, then use **Save** or Ctrl+S. The option is also under **Edit** > **Save options** > **Manual**.

## Connect lakehouses

You can add a new or existing lakehouse from the Lakehouse explorer and pin one as the default. The default is mounted to the runtime working directory, so you can read and write with a local path. You must restart the session after pinning a new lakehouse or renaming the default lakehouse.

The **X** icon beside a lakehouse name removes it from the notebook tab, and the lakehouse item still exists in the workspace. Right-click a file such as `.csv`, `.parquet` or `.txt` and you can load it with the Spark or Pandas API, which inserts a new code cell below the focus cell.

## Use notebook resources

The resource explorer gives a Unix-like file system for small files such as code modules, semantic models and images.

- **Built-in folder:** unique to each notebook, reachable with relative paths such as `builtin/YourData.txt`. `notebookutils.nbResPath` helps compose the full path. Learn recommends it for data used in the current notebook.
- **Environment folder:** shared across notebooks attached to the same environment, accessible with the relative path `/env`.
- **Limits:** 500 MB of resource storage for each folder type, 100 MB per file, up to 100 files and folders in total.
- **Scope:** resource files and libraries installed inline (`%pip install` or `install.packages()`) are scoped to the current notebook session and are not affected by environment publishing.
- **High concurrency sessions:** reading and writing with a relative path does not work there.

Learn describes two environment library publishing modes. Quick mode installs libraries at session start for fast iteration. Full mode creates a stable, reproducible snapshot, which Learn recommends for consistent versions across collaborators, scheduled runs or pipeline jobs.

The file editor opens files from the resource folders. It supports types such as CSV, TXT, HTML, YML, PY and SQL, has a 1 MB size limit, does not support `.xlsx` and `.parquet`, and does not autosave, so save with the button or Ctrl+S.

## Collaborate and share

Opening a notebook enters co-editing mode, with edits saved automatically. You see other users' profile, cursor and run output. Cell-level comments are supported, including tagging a user, which triggers an email notification.

To share, select **Share** on the toolbar, choose who can view, pick **Share**, **Edit** or **Run** permissions, select **Apply**, then send or copy the link. To change permissions later, use **Workspace item list** > **More options** > **Manage permissions**.

### Modes

Four modes map to permissions: **Develop** (read, execute and write), **Run only** (read and execute), **Edit** (read and write, cannot run) and **View** (read). Permissions limit which modes are available but do not select one automatically.

## Version history (preview)

Learn marks version history as a preview feature. You can create manual versions, and the system creates a checkpoint automatically every 5 minutes of editing time. Versions can come from direct edits, Git synchronization, deployment pipeline activity or VS Code publishing, and the source is labeled. The diff view compares a checkpoint with the live version, including cell content, output and metadata. You can restore a checkpoint or save it as a copy. System checkpoints expire after 1 year. A known limitation: when several people edit and one restores a checkpoint, use **View changes** and keep the **Saved version** to finish the restore.

## Copilot in notebooks

Learn says Copilot is aware of the workspace, attached lakehouse schemas, tables and files, the notebook structure and runtime state. When a cell or Spark job fails, **Fix with Copilot** appears below the failed cell with an error summary, root cause analysis and recommended fixes, and it can apply changes with an approval diff. The `/fix` and `/optimize` commands exist in the chat.

## A working setup

This section is my advice, not a Microsoft statement.

1. Pin one default lakehouse per notebook and restart the session once, so that paths stay predictable.
2. Treat the pipeline's last modified user as part of the notebook's access design. Give that account the least rights that work.
3. Use Full mode environments for anything scheduled, and Quick mode while experimenting.
4. Keep large data in the lakehouse, not in resources, given the 500 MB limit.
5. Before running someone else's notebook, open version history and read the latest diff.

## Related

- [Fabric notebooks](https://www.m365.fm/entity/fabric-notebooks/)
- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [How to use notebooks - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/data-engineering/how-to-use-notebook)
