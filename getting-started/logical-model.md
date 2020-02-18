# Logical model

Valar has a very simple logical model.

There are **users**, **projects**, **services** and **tasks**.

A **user** may be the creator of one or more **projects**.

A **user** may be authorized to *read*, *write* or *invoke* a project.

**Projects** are the level on which authorization happens.
A project may contain one or more **services**.

A **service** has (almost always) a latest version.
New versions of a service are deployed by a **task**.

**Tasks** are created by pushing new code to the API server.