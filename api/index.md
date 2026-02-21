# API Reference

The Valar API is a REST API that lets you manage projects, services, builds, deployments, domains, and more. All endpoints live under a single base URL.

**Base URL:** `https://api.valar.dev/v2`

## Authentication

All requests (except version check) require a Bearer token in the `Authorization` header.

```bash
$ curl https://api.valar.dev/v2/users/info \
  -H "Authorization: Bearer $TOKEN"
```

You can generate a token via `valar auth login`. See [Setting up the client](getting-started/cli-setup.md) for details.

## Errors

Error responses return a JSON object with a single `error` field. For 4xx errors, the message describes the problem (e.g. `"service not found"`). For 5xx errors, the message is always `"internal error"`.

```json
{
  "error": "service not found"
}
```

## Get API version

`GET /v2/`

Returns the current API version. This endpoint does not require authentication.

```bash
$ curl https://api.valar.dev/v2/
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
$ curl https://api.valar.dev/v2/users/info \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "name": "myuser",
  "projects": ["myproject"]
}
```
