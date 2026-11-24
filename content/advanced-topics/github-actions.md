# Deploying from GitHub Actions

The [Valar action](https://github.com/valar/action) builds and deploys a service from a GitHub Actions workflow. It waits until the new version is live, fails the job if the build or the deployment fails, and reports the service's URL. It can also deploy a preview of every pull request.

## Setting it up

1. Make sure the repository has a `.valar.yml`, as described in [Creating a new service](getting-started/service-setup.md).
2. Create an API token that can only read and deploy in this project, and add it to the repository as a secret named `VALAR_TOKEN` (*Settings > Secrets and variables > Actions*). In the [console](https://console.valar.dev), pick the project and the `read` and `deploy` scopes; with the CLI, run:

   ```bash
   valar token create --project <project> --scopes read,deploy github-deploy
   ```

   The token expires after 90 days unless you choose another lifetime (`--ttl`, up to 365 days). The job log warns from 14 days before it expires.
3. Add the workflow below as `.github/workflows/valar.yml`.

```yaml
name: Deploy
on:
  push:
    branches: [main]

concurrency:
  group: valar-deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ steps.valar.outputs.url }}
    steps:
      - uses: actions/checkout@v7
      - id: valar
        uses: valar/action@v3
        with:
          token: ${{ secrets.VALAR_TOKEN }}
```

Every push to `main` now builds and deploys the service. The build log appears in the job log, and the URL in the job summary and, through the `production` environment, on the commit. The `concurrency` group lets one deploy finish before the next one starts.

> [!TIP]
> To run exactly the action code you reviewed, pin it to a commit: `uses: valar/action@<commit sha> # v3.0.0`.

## Inputs and outputs

| Input | Default | Description |
|---|---|---|
| `token` | | API token, from a secret. |
| `endpoint` | `https://api.valar.dev/v2` | API of a self-hosted Valar installation. |
| `project`, `service` | from `.valar.yml` | Project and service to deploy. |
| `workdir` | `.` | Directory to push; `.valar.yml` is looked up from here upwards. |
| `wait` | `true` | Wait for the build and deployment. With `false` the step ends once the build is submitted. |
| `deploy` | `true` | With `false`, only build. |
| `preview` | `false` | Deploy pull request previews. |
| `timeout` | `30m` | How long to wait for the build and deployment together. |

The action sets the outputs `build-id`, `service` and `url`.

## Checking that pull requests build

Set `deploy: false` in a workflow that runs on `pull_request` to build every pull request without deploying it.

## Previews of pull requests

With `preview: true`, a `pull_request` run deploys to the service `<service>pr<number>`, such as `webpr42`, and comments its URL on the pull request. When the pull request closes, the preview is disabled; when it reopens, it is enabled and deployed again.

```yaml
name: Preview
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

concurrency:
  group: valar-preview-${{ github.event.pull_request.number }}

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        if: github.event.action != 'closed'
      - uses: valar/action@v3
        with:
          token: ${{ secrets.VALAR_TOKEN }}
          project: acme
          service: web
          preview: true
```

* Name the project and service in the inputs: a closed pull request's run has no checkout to read `.valar.yml` from.
* Pull requests from forks get no preview, since their runs cannot read secrets. Never use `pull_request_target` for previews: it would deploy a fork's code with your token.
* Disabled previews stop running and answer `503`. Services can't be deleted yet, so previews stay in `valar service list`.

> [!WARNING]
> Anyone who can push a branch to the repository can deploy a preview with the token, which can deploy every service of the project. Keep previews in a project of their own if that matters.

## Without the action

The CLI reads `VALAR_TOKEN`, `VALAR_ENDPOINT` and `VALAR_PROJECT` from the environment, so any CI system can deploy with it:

```bash
VALAR_TOKEN=... valar build push --wait
valar service url
```
