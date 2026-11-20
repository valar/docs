# Services

Services are the deployable units within a project. Each service has a name, a current version, and one or more domains it is reachable on.

## List services

`GET /v2/projects/{project}/services/{service}`

Lists services whose name matches a given prefix. Pass an empty `service` segment to list all services in the project.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/ \
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

To filter by prefix, include the beginning of the service name:

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web \
  -H "Authorization: Bearer $TOKEN"
```

## Get service logs

`GET /v2/projects/{project}/services/{service}/logs`

Retrieves runtime logs for a deployed service. The response is plain text, not JSON.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/logs \
  -H "Authorization: Bearer $TOKEN"
```

Set `follow` to `true` to stream logs in real time (the connection stays open until you close it). Use `seek` to start reading from the `start` or `end` of the log, and `skip` to skip a number of lines.

```bash
$ curl "https://api.valar.dev/v2/projects/myproject/services/web/logs?follow=true&seek=end" \
  -H "Authorization: Bearer $TOKEN"
```

> **Important**: The response content type is `text/plain`, not JSON. Each line is a log entry.

See also: [Inspecting the logs](getting-started/inspection.md)
