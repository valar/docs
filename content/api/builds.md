# Builds

A build takes a source [artifact](api/artifacts.md) and turns it into a runnable image using a constructor from your chosen [stack](stacks/index.md). Builds move through `pending`, `running`, `done`, `failed`, and `expired` statuses. See [Publishing the service](getting-started/publish.md) for the CLI commands.

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/services/{service}/builds` | [List builds](#list-builds) |
| `GET` | `/v2/projects/{project}/services/{service}/builds/{build}` | [List builds by ID prefix](#list-builds) |
| `POST` | `/v2/projects/{project}/services/{service}/builds` | [Submit a build](#submit-a-build) |
| `GET` | `/v2/projects/{project}/services/{service}/builds/{build}/inspect` | [Inspect a build](#inspect-a-build) |
| `GET` | `/v2/projects/{project}/services/{service}/builds/{build}/logs` | [Get build logs](#get-build-logs) |
| `POST` | `/v2/projects/{project}/services/{service}/builds/{build}/abort` | [Abort a build](#abort-a-build) |

## List builds

`GET /v2/projects/{project}/services/{service}/builds`

Returns all builds for a service, newest first.

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/builds \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "done",
    "error": "",
    "createdAt": "2025-06-01T14:20:00Z"
  }
]
```

Append an ID prefix to filter the results:

`GET /v2/projects/{project}/services/{service}/builds/{build}`

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2 \
  -H "Authorization: Bearer $TOKEN"
```

## Submit a build

`POST /v2/projects/{project}/services/{service}/builds`

Starts a new build from an uploaded [artifact](api/artifacts.md). By default, a successful build deploys automatically.

| Field | Description |
|---|---|
| `artifact` | Required. Artifact key returned by [Upload a build artifact](api/artifacts.md). |
| `build.constructor` | Required. Constructor for your [stack](stacks/index.md) (for example, `golang`, `python`, or `docker`). |
| `build.environment` | Optional. Environment variables (`key`, `value`, and optionally `secret: true`) available only during the build. |
| `deployment.skip` | Optional. Set to `true` to build without deploying. |
| `deployment.environment` | Optional. Environment variables set on the deployed service. Encrypt secrets with [Environment](api/environment.md). |

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "artifact": "af7b2c...",
    "build": {
      "constructor": "golang",
      "environment": [
        {"key": "GO_BUILD_FLAGS", "value": "-ldflags=-s"}
      ]
    }
  }'
```

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "status": "pending",
  "createdAt": "2025-06-01T14:25:00Z",
  "deployment": "v13"
}
```

To build without deploying, set `deployment.skip` to `true`:

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "artifact": "af7b2c...",
    "build": {"constructor": "golang"},
    "deployment": {"skip": true}
  }'
```

## Inspect a build

`GET /v2/projects/{project}/services/{service}/builds/{build}/inspect`

Returns details for one build, including its constructor, owner, and flags.

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/inspect \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "constructor": "golang",
  "status": "done",
  "error": "",
  "createdAt": "2025-06-01T14:20:00Z",
  "flags": "",
  "owner": "myuser"
}
```

## Get build logs

`GET /v2/projects/{project}/services/{service}/builds/{build}/logs`

Returns build output as plain text. Pass `follow=true` in the query string to stream logs until the build finishes.

```bash
curl "https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/logs?follow=true" \
  -H "Authorization: Bearer $TOKEN"
```

> [!IMPORTANT]
> The response content type is `text/plain`, not JSON. A `204` response means the build has expired and its logs are no longer available.

## Abort a build

`POST /v2/projects/{project}/services/{service}/builds/{build}/abort`

Cancels a `pending` or `running` build.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/abort \
  -H "Authorization: Bearer $TOKEN"
```

```json
{}
```
