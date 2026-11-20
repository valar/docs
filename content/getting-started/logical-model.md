# Logical model

Valar has a very simple logical model.

There are **users**, **projects**, **services**, **builds** and **deployments**.

A **user** may be the creator of one or more **projects**.

A **user** may be authorized to
- read (read builds, deployments)
- write (submit new builds, deployments)
- invoke (reach service via HTTP)
- manage (transfer ownership, assign permissions)

**Projects** are the level on which authorization happens.
A project may contain one or more **services**.

A **service** has (almost always) a latest version.
A version of a service is defined by a **deployment**.

**Builds** are created by pushing new code to the API server.
Pushing new code is self-deploying action by default and
creates a new **deployment** after the **build** has finished.
