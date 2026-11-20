# Builds

A build takes a source [artifact](api/artifacts.md) and turns it into a runnable image using a constructor (the build system for your chosen [stack](stacks/index.md)). Builds progress through statuses: `pending`, `running`, `done`, `failed`, or `expired`.

## List builds

`GET /v2/projects/{project}/services/{service}/builds`

Returns all builds for a service, newest first.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/builds \
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

You can also filter by ID prefix by appending it to the path:

`GET /v2/projects/{project}/services/{service}/builds/{build}`

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2 \
  -H "Authorization: Bearer $TOKEN"
```

## Submit a build

`POST /v2/projects/{project}/services/{service}/builds`

Starts a new build from a previously uploaded [artifact](api/artifacts.md). You must specify the artifact key and the build configuration. By default, a successful build is deployed automatically.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds \
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

The `build.constructor` field selects which stack builds your code (e.g. `golang`, `python`, `docker`). See [Stacks](stacks/index.md) for the full list.

To build without deploying, set `deployment.skip` to `true`:

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "artifact": "af7b2c...",
    "build": {"constructor": "golang"},
    "deployment": {"skip": true}
  }'
```

You can also pass `deployment.environment` to set environment variables for the deployed service, and `build.environment` to set variables available only during the build.

## Inspect a build

`GET /v2/projects/{project}/services/{service}/builds/{build}/inspect`

Returns detailed information about a specific build, including the constructor used, the owner who submitted it, and any flags.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/inspect \
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

Returns the build output as plain text. Set `follow` to `true` to stream logs in real time until the build finishes.

```bash
$ curl "https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/logs?follow=true" \
  -H "Authorization: Bearer $TOKEN"
```

> **Important**: The response is `text/plain`, not JSON. A `204` response means the build has expired and logs are no longer available.

## Abort a build

`POST /v2/projects/{project}/services/{service}/builds/{build}/abort`

Cancels a running build. Only builds in `pending` or `running` status can be aborted.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/builds/a1b2c3d4/abort \
  -H "Authorization: Bearer $TOKEN"
```

```json
{}
```
