# Services

Services are HTTP applications inside a project, each with a name, a current version, and one or more domains. For CLI log commands, see [Inspecting the logs](getting-started/inspection.md).

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/services/{service}` | [List services](#list-services) |
| `GET` | `/v2/projects/{project}/services/{service}/logs` | [Get service logs](#get-service-logs) |

## List services

`GET /v2/projects/{project}/services/{service}`

Lists services whose names match a prefix. End the path with a trailing slash (an empty `{service}` segment) to list every service in the project:

```bash
curl https://api.valar.dev/v2/projects/myproject/services/ \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "id": "a1b2c3",
    "name": "web",
    "version": 12,
    "createdAt": "2025-01-10T08:30:00Z",
    "deployedAt": "2025-06-01T14:22:00Z",
    "domains": ["myproject-web.valar.app"]
  }
]
```

Append a prefix after the slash to filter by service name:

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web \
  -H "Authorization: Bearer $TOKEN"
```

## Get service logs

`GET /v2/projects/{project}/services/{service}/logs`

Returns runtime logs for a deployed service.

| Parameter | Description |
|---|---|
| `follow` | Set to `true` to stream logs in real time until you close the connection. |
| `seek` | Position to start reading from: `start` or `end`. |
| `skip` | Number of lines to skip. |

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/logs \
  -H "Authorization: Bearer $TOKEN"
```

Stream only new log lines:

```bash
curl "https://api.valar.dev/v2/projects/myproject/services/web/logs?follow=true&seek=end" \
  -H "Authorization: Bearer $TOKEN"
```

> [!IMPORTANT]
> The response content type is `text/plain`, not JSON. Each line is one log entry.
