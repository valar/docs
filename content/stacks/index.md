# Stacks

Valar builds services from source using constructors (also called stacks). Each stack turns your repository into a runnable container image.

## Available stacks

| Stack | Aliases | Summary |
|---|---|---|
| [docker](stacks/docker.md) | `docker`, `dockerfile`, `kaniko` | Builds a container image from a top-level `Dockerfile`. |
| [golang](stacks/golang.md) | `go`, `golang`, `golang-1.17` | Builds a static Go binary on Alpine Linux from the top-level directory. |
| [python](stacks/python.md) | | Installs dependencies from `requirements.txt` and builds a Python service. |
| [node](stacks/node.md) | | Builds and runs a Node.js application. |
| [node-static](stacks/node-static.md) | | Builds a static site with `npm` or `yarn` and serves the output with nginx. |
| [static](stacks/static.md) | | Serves all non-ignored files in the directory over HTTP. |

## Configuring .valar.yml

Select a stack when initializing a service:

```bash
valar init --type <stack> <service>
```

This creates a `.valar.yml` file in your repository root. You can also set or change `build.constructor` directly in `.valar.yml`:

```yaml
project: myproject
service: helloworld
build:
  constructor: golang
  ignore:
    - .valar.yml
    - .git
  environment: []
deployment:
  skip: false
  environment: []
```

| Field | Description |
|---|---|
| `project` | Project that owns the service. |
| `service` | Service name (cannot contain dashes). |
| `build.constructor` | Stack name or alias used to build the service. |
| `build.ignore` | Files and directories excluded when pushing source code. |
| `build.environment` | Environment variables available only during the build. |
| `deployment.skip` | When `true`, builds the service without deploying a new version. |
| `deployment.environment` | Environment variables set for the deployed service. |

> [!IMPORTANT]
> Services cannot listen on privileged ports below 1024. Bind your application to port 1024 or higher (for example, `8080`).

For a walkthrough with Go, see [Creating a new service](getting-started/service-setup.md). To submit builds over HTTP, see [Builds](api/builds.md).
