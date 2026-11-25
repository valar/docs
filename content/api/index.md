# API reference

The Valar REST API manages projects, services, builds, deployments, domains, permissions, and schedules.

**Base URL:** `https://api.valar.dev/v2`

## Resources

| Resource | Path | Summary |
|---|---|---|
| [Services](api/services.md) | `/v2/projects/{project}/services/{service}` | List services and read runtime logs. |
| [Artifacts](api/artifacts.md) | `/v2/projects/{project}/services/{service}/artifacts` | Upload source tarballs for builds. |
| [Builds](api/builds.md) | `/v2/projects/{project}/services/{service}/builds` | Submit, inspect, abort, and stream logs for builds. |
| [Deployments](api/deployments.md) | `/v2/projects/{project}/services/{service}/deploys` | List, create, and roll back deployments. |
| [Environment](api/environment.md) | `/v2/projects/{project}/environment/encrypt` | Encrypt secret environment variables. |
| [Domains](api/domains.md) | `/v2/projects/{project}/domains` | Register, verify, link, and remove custom domains. |
| [Permissions](api/permissions.md) | `/v2/projects/{project}/permissions` | List, update, and check namespace ACLs. |
| [Schedules](api/schedules.md) | `/v2/projects/{project}/services/{service}/schedules` | Manage and trigger cron schedules. |

## Authentication

Every endpoint except the version check requires a Bearer token in the `Authorization` header:

```bash
curl https://api.valar.dev/v2/users/info \
  -H "Authorization: Bearer $TOKEN"
```

Create a token in the [Valar console](https://console.valar.dev) under **API Tokens**. See [Setting up the client](getting-started/cli-setup.md) for setup details.

## Errors

Failed requests return a JSON object with a single `error` field. For 4xx responses, the message describes the problem (for example, `"service not found"`). For 5xx responses, the message is always `"internal error"`.

```json
{
  "error": "service not found"
}
```

## Get API version

`GET /v2/`

Returns the current API version. No authentication is required.

```bash
curl https://api.valar.dev/v2/
```

```json
{
  "version": "v2"
}
```

## Get current user info

`GET /v2/users/info`

Returns your username and the projects you own.

```bash
curl https://api.valar.dev/v2/users/info \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "name": "myuser",
  "projects": ["myproject"]
}
```
