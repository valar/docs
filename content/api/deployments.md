# Deployments

A deployment makes a completed [build](api/builds.md) live and increments the service version. Builds deploy automatically unless you skip deployment; you can also deploy or roll back manually.

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/services/{service}/deploys` | [List deployments](#list-deployments) |
| `POST` | `/v2/projects/{project}/services/{service}/deploys` | [Create a deployment](#create-a-deployment) |
| `POST` | `/v2/projects/{project}/services/{service}/deploys/rollback` | [Rollback a deployment](#rollback-a-deployment) |

## List deployments

`GET /v2/projects/{project}/services/{service}/deploys`

Returns all deployments for a service.

```bash
curl https://api.valar.dev/v2/projects/myproject/services/web/deploys \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "version": 12,
    "createdAt": "2025-06-01T14:22:00Z",
    "error": "",
    "status": "done",
    "build": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
]
```

## Create a deployment

`POST /v2/projects/{project}/services/{service}/deploys`

Deploys a specific build. Use this to deploy a build submitted with `deployment.skip` set to `true`, or to redeploy an earlier build.

- `build`: Required. ID of the build to deploy.
- `environment`: Optional. Array of `{key, value}` objects. Include `secret: true` for values encrypted through [Environment](api/environment.md).

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/deploys \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "build": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "environment": [
      {"key": "APP_ENV", "value": "production"}
    ]
  }'
```

```json
{
  "version": 13,
  "createdAt": "2025-06-01T15:00:00Z",
  "error": "",
  "status": "pending",
  "build": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Rollback a deployment

`POST /v2/projects/{project}/services/{service}/deploys/rollback`

Creates a new deployment using the build from an earlier version.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/deploys/rollback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"version": 11}'
```

```json
{
  "version": 14,
  "createdAt": "2025-06-01T15:10:00Z",
  "error": "",
  "status": "pending",
  "build": "prev-build-id"
}
```

> [!IMPORTANT]
> Rollback creates a new deployment version and does not revert the version counter. Pass the target version you want to roll back to in the `version` field.
