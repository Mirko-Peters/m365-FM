---
title: "How to Create a OneLake Shortcut to Reuse Data Without Copying It"
summary: "Create a same-tenant OneLake shortcut in a Fabric lakehouse or KQL database, choose pass-through or delegated identity, and know the limits, deletion behavior and table rules Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [onelake, onelake-shortcuts, fabric-lakehouse]
keypoints:
  - "A shortcut is an object in OneLake that points to another storage location, so you reuse the data without copying it."
  - "In a lakehouse, shortcuts in the Tables folder are allowed only at the top level, while the Files folder has no such restriction."
  - "Choose a connection method: Pass-through uses each user's identity, Delegated identity uses a configured connection."
  - "You can select up to 50 subfolders when creating shortcuts, and deleting a shortcut leaves the target data unchanged."
  - "Documented limits include 100,000 shortcuts per item, 10 shortcuts per OneLake path and no % or + characters in names."
faq:
  - q: "What is a OneLake shortcut?"
    a: "According to Microsoft Learn, shortcuts are objects in OneLake that point to other storage locations, internal or external. They appear as folders and behave like symbolic links. A shortcut is an independent object from its target: deleting the shortcut leaves the target unaffected, but moving, renaming or deleting the target path can break the shortcut."
  - q: "Do I need a lakehouse to create a shortcut?"
    a: "The Learn how-to for same-tenant shortcuts lists as prerequisite a lakehouse or a KQL database in OneLake. It says you can create a test lakehouse if you do not have one, and that shortcuts can be created in lakehouses and KQL databases."
  - q: "What is the difference between pass-through and delegated identity?"
    a: "Learn describes Pass-through, the default, as using each user's own identity to access the target data. Delegated identity uses a configured connection identity instead. A delegated connection can use an organizational account or a service principal."
  - q: "What happens to the source data if I delete a shortcut?"
    a: "Learn says shortcuts do not support cascading deletes. Deleting a shortcut deletes only the shortcut object. However, if you delete a file or folder inside a shortcut and you have delete permission in the target, you also delete it in the target."
  - q: "What are the main limits?"
    a: "The overview page lists up to 100,000 shortcuts per Fabric item, up to 10 shortcuts per OneLake path, a maximum of 5 direct shortcuts to shortcut links, no percent or plus characters in names or paths, and no non-Latin characters. Shortcuts in the Tables folder can only be created at the top level."
---

A OneLake shortcut lets a lakehouse or KQL database use data that lives somewhere else in OneLake without copying it. You create it from the item's Explorer pane, pick the source, choose how access is authorized, and select the folders to link. Microsoft Learn describes shortcuts as objects that point to other storage locations and behave like symbolic links. This guide covers the same-tenant case, where the target is another Fabric item in your tenant.

## What you need first

The Learn how-to lists one prerequisite: a lakehouse or KQL database in OneLake. If you have neither, it suggests creating a test lakehouse.

Know the folder rules for a lakehouse, which has two top-level folders:

- **Tables** is for structured datasets. You can create shortcuts only at the top level. OneLake does not support shortcuts in subdirectories of Tables. If the target holds data in a supported table format such as Delta, the lakehouse synchronizes table metadata and recognizes the folder as a table.
- **Files** is for unstructured or semi-structured data. There are no restrictions on where you create shortcuts, and no table discovery happens there.

Learn adds a naming note: the Delta format does not support tables with spaces in the name, so OneLake does not recognize a shortcut with a space in its name as a Delta table.

## Create the shortcut

1. Open your lakehouse or KQL database.
2. Right-click a directory in the **Explorer** pane.
3. Create a new shortcut:
   - In a lakehouse, select **New shortcut**, **New table shortcut** or **New schema shortcut**, depending on your lakehouse settings.
   - In a KQL database, select **+** > **New** > **OneLake shortcut**.
4. Under **Internal sources**, select **Microsoft OneLake**.
5. Select the data source to connect to and select **Next**. If the data is in a different Fabric tenant, Learn points to a separate cross-tenant shortcut article.
6. Select a **Connection method**.
7. Expand **Files** or **Tables** to see the subfolders. Subfolders in Tables that contain valid Delta or Iceberg tables get a table icon. Files or unrecognized folders in the tables section get a folder icon.
8. Select one or more subfolders and select **Next**. You can select up to 50 subfolders when creating shortcuts.
9. Review the selected locations. Use the edit action to change the default shortcut name, or the delete action to remove a selection. Select **Create**.

The lakehouse refreshes automatically, and the shortcut appears under the selected directory. In its properties, the **Shortcut Type** parameter shows that the item is a shortcut.

## Choose the connection method

- **Pass-through** (default): each user's own identity is used to access the target data. The overview page says OneLake uses the calling user's identity for internal shortcuts, and that user must have permission in the target location.
- **Delegated identity**: a configured connection identity is used instead of each user's identity. After you select it, select **Connect** and configure the connection. Pick an **Existing connection** or create a **New connection**. For a new one, confirm or enter the OneLake path, a connection name, and the authentication kind: **Organizational account** (sign in) or **Service principal** (tenant ID, application or client ID and client secret).

Learn adds an important warning on the overview page. When users reach shortcuts through Power BI semantic models using Direct Lake over SQL, or T-SQL engines in Delegated identity mode, the calling user's identity is not passed to the target. The calling item's owner's identity is passed instead. To avoid this, Learn says to use semantic models in Direct Lake over OneLake mode or T-SQL in User identity mode.

## What you can point at

Internal shortcuts can reference these items, according to Learn: KQL databases, lakehouses, mirrored Azure Databricks catalogs, mirrored databases, semantic models, SQL databases and warehouses. The shortcut can point to a folder in the same item, to another item in the same workspace or to an item in a different workspace. The item types do not need to match. For example, a lakehouse can have a shortcut to data in a warehouse.

## Deleting and breaking shortcuts

- Delete a shortcut and only the shortcut object goes away. The target data stays.
- Move, rename or delete the target path and the shortcut can break.
- Delete a file or folder inside a shortcut, with delete permission in the target, and you delete it in the target too. Learn illustrates this with an ADLS Gen2 example: deleting the shortcut keeps the Foo\Bar directories, deleting `MyShortcut\Foo\Bar` removes Bar from the account.

## Documented limits

- Up to 100,000 shortcuts per Fabric item.
- Up to 10 shortcuts per OneLake path.
- A maximum of 5 direct shortcuts to shortcut links.
- Shortcut names, parent paths and target paths cannot contain `%` or `+`.
- Non-Latin characters are not supported.
- Schema shortcuts can only be created in schema-enabled lakehouses.
- It might take up to a minute for the Table API to recognize new shortcuts.
- Lineage for shortcuts to warehouses and semantic models is not currently available.

## Use the shortcut

Learn says any Fabric or non-Fabric service that can access data in OneLake can use shortcuts, which appear as another folder in the lake. Spark notebooks can read them with relative paths, and a Delta shortcut in Tables can be read as a managed table. The SQL analytics endpoint of the lakehouse reads shortcuts in Tables. In a KQL database, shortcuts are treated as external tables and queried with the `external_table` function.

## My practical checklist

This is my advice. Before sharing a shortcut widely, test with a user who has only the access you intend to give. With pass-through that user needs permission in the target. With delegated identity, remember that access is granted through the connection. Then check what happens when someone renames the source folder.

## Related

- [OneLake](https://www.m365.fm/entity/onelake/)
- [OneLake shortcuts](https://www.m365.fm/entity/onelake-shortcuts/)
- [Fabric lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)

## Sources

- [Create a same-tenant OneLake shortcut - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/onelake/shortcuts/create-onelake-shortcut)
- [Unify Data Sources With OneLake Shortcuts - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/onelake/onelake-shortcuts)
