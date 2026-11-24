# Schedules

Schedules send HTTP `POST` requests to a path on your service using a UTC cron schedule. A new schedule first fires at its next matching time. See [Scheduled invocations](advanced-topics/managing-schedules.md) for the CLI commands.

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/services/{service}/schedules` | [List schedules](#list-schedules) |
| `POST` | `/v2/projects/{project}/services/{service}/schedules` | [Create or update a schedule](#create-or-update-a-schedule) |
| `GET` | `/v2/projects/{project}/services/{service}/schedules/{schedule}` | [Get schedule details](#get-schedule-details) |
| `DELETE` | `/v2/projects/{project}/services/{service}/schedules/{schedule}` | [Delete a schedule](#delete-a-schedule) |
| `POST` | `/v2/projects/{project}/services/{service}/schedules/{schedule}/trigger` | [Trigger a schedule manually](#trigger-a-schedule-manually) |

## List schedules

`GET /v2/projects/{project}/services/{service}/schedules`

Returns all schedules for a service.

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/schedules \
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

Creates a schedule or updates an existing one matched by `name`. When updating an existing schedule, only `name` is required; omitted fields keep their current values.

| Field | Description |
|---|---|
| `name` | Schedule name. Required for both creation and updates. |
| `timespec` | Standard cron expression evaluated in UTC. |
| `path` | Request path on your service (for example, `/`). |
| `payload` | Body sent with the HTTP `POST` request. |
| `status` | `enabled` or `disabled`. Set to `disabled` to pause a schedule without deleting it. |

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules \
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

Disable a schedule without deleting it:

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "every10", "status": "disabled"}'
```

## Get schedule details

`GET /v2/projects/{project}/services/{service}/schedules/{schedule}`

Returns a schedule and the result of its most recent invocation.

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10 \
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

Before the first run, `invocation` is `null`.

## Delete a schedule

`DELETE /v2/projects/{project}/services/{service}/schedules/{schedule}`

Permanently deletes a schedule and its invocation history.

```bash
curl -X DELETE https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10 \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```

## Trigger a schedule manually

`POST /v2/projects/{project}/services/{service}/schedules/{schedule}/trigger`

Fires a schedule immediately, ignoring its `timespec`.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/schedules/every10/trigger \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "status": "ok"
}
```
