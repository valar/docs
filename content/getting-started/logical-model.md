# Logical model

Valar organizes resources into a five-level hierarchy: users, projects, services, builds, and deployments. Projects own services, and each service runs versions created by builds and deployments.

## Resources

| Resource | Role |
|---|---|
| **User** | An account that creates projects and holds permissions on resources. |
| **Project** | A group of one or more services, and the root level for authorization. |
| **Service** | An HTTP application inside a project, normally serving its latest deployed version. |
| **Build** | A runnable image produced from source code pushed to the API server. |
| **Deployment** | A numbered version of a service created from a completed build. |

By default, pushing source code starts a build and deploys the new version. You can skip automatic deployment in `.valar.yml` or through the [Builds API](api/builds.md).

## Permissions

Authorization works on paths starting at the project level across namespaces (`service` for services and `kv` for the key-value store). Each rule grants or forbids one of four actions:

| Action | Grants |
|---|---|
| `read` | Viewing builds and deployments. |
| `write` | Submitting new builds and deployments. |
| `invoke` | Calling a service over HTTP. |
| `manage` | Transferring ownership and assigning permissions. |

See [Permission management](advanced-topics/managing-permissions.md) for evaluation rules and CLI commands.
