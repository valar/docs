# Deployments

A deployment takes a completed [build](api/builds.md) and makes it live. Each deployment increments the service version. Builds are deployed automatically unless you opt out, but you can also deploy or rollback manually.

## List deployments

`GET /v2/projects/{project}/services/{service}/deploys`

Returns all deployments for a service.

```bash
$ curl https://api.valar.dev/v2/projects/myproject/services/web/deploys \
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

Deploys a specific build. Use this when you submitted a build with `deployment.skip` set to `true` and want to deploy it later, or to redeploy an earlier build.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/deploys \
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

The `environment` array is optional. Each entry has a `key` and `value`, and optionally `secret: true` for encrypted values (see [Environment](api/environment.md)).

## Rollback a deployment

`POST /v2/projects/{project}/services/{service}/deploys/rollback`

Rolls back to a previous deployment by version number. This creates a new deployment that uses the same build as the specified version.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/deploys/rollback \
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

> **Important**: Rollback creates a *new* deployment version — it does not revert the version counter. The `version` field in the request body refers to the version you want to roll back *to*.
