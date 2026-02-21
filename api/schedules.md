# Schedules

Schedules let you trigger your service automatically on a cron-based timer. Each schedule sends an HTTP request to a path on your service at the specified interval. See [Scheduled invocations](advanced-topics/managing-schedules.md) for a walkthrough using the CLI.

## List schedules

`GET /v2/projects/{project}/services/{service}/schedules`

Returns all schedules configured for a service.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/schedules \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "name": "every10",
    "timespec": "*/10 * * * *",
    "path": "/",
    "payload": "",
    "serviceID": "a1b2c3",
    "serviceLabel": "web",
    "status": "enabled"
  }
]
```

## Create or update a schedule

`POST /v2/projects/{project}/services/{service}/schedules`

Creates a new schedule or updates an existing one (matched by `name`). The `timespec` is a standard cron expression.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "every10",
    "timespec": "*/10 * * * *",
    "path": "/",
    "payload": "ping"
  }'
```

```json
{
  "status": "ok"
}
```

When updating an existing schedule, only the `name` field is required — all other fields are optional and will keep their current values if omitted.

To disable a schedule without deleting it, set `status` to `disabled`:

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "every10", "status": "disabled"}'
```

## Get schedule details

`GET /v2/projects/{project}/services/{service}/schedules/{schedule}`

Returns detailed information about a schedule, including the result of its most recent invocation.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10 \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "schedule": {
    "name": "every10",
    "timespec": "*/10 * * * *",
    "path": "/",
    "payload": "",
    "serviceID": "a1b2c3",
    "serviceLabel": "web",
    "status": "enabled"
  },
  "invocation": {
    "id": "inv-abc123",
    "startTime": "2025-06-01T14:30:00Z",
    "endTime": "2025-06-01T14:30:01Z",
    "status": "done",
    "triggeredBy": "cron"
  }
}
```

The `invocation` field is `null` if the schedule has never been triggered.

## Delete a schedule

`DELETE /v2/projects/{project}/services/{service}/schedules/{schedule}`

Permanently removes a schedule and its invocation history.

```bash
$ curl -X DELETE https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10 \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```

## Trigger a schedule manually

`POST /v2/projects/{project}/services/{service}/schedules/{schedule}/trigger`

Fires a schedule immediately, regardless of its timespec. Useful for testing.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10/trigger \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```
