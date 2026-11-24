# Permissions

Valar controls access with path-based permission rules organized by namespace: a rule on `myproject` also applies to `myproject/web`. See [Permission management](advanced-topics/managing-permissions.md) for the evaluation rules and CLI commands.

## Endpoints

| Method | Path | Action |
|---|---|---|
| `GET` | `/v2/projects/{project}/permissions` | [List permissions](#list-permissions) |
| `POST` | `/v2/projects/{project}/permissions` | [Update a permission](#update-a-permission) |
| `POST` | `/v2/projects/{project}/permissions?mode=check` | [Check a permission](#check-a-permission) |

## List permissions

`GET /v2/projects/{project}/permissions?namespace={namespace}&prefix={prefix}`

Returns all permission rules matching a namespace and path prefix. Both query parameters are required.

| Parameter | Description |
|---|---|
| `namespace` | Required. One of `legacy`, `service`, or `kv`. |
| `prefix` | Required. Resource path prefix, such as `myproject` for a project or `myproject/web` for one service. |

```bash
curl "https://api.valar.dev/v2/projects/myproject/permissions?namespace=service&prefix=myproject" \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "path": {"namespace": "service", "items": ["myproject"]},
    "user": {"type": "human", "identifier": ["myuser"]},
    "action": "write",
    "state": "allow"
  },
  {
    "path": {"namespace": "service", "items": ["myproject"]},
    "user": {"type": "human", "identifier": ["anonymous"]},
    "action": "invoke",
    "state": "allow"
  }
]
```

> [!IMPORTANT]
> You need `manage` permission on the path to list its permissions.

## Update a permission

`POST /v2/projects/{project}/permissions`

Sets a permission rule for a path, user, and action.

| Field | Description |
|---|---|
| `path` | Target resource with `namespace` (`legacy`, `service`, or `kv`) and `items` path segments. |
| `user` | Subject with `type` (`human` or `service`) and `identifier` segments. |
| `action` | One of `read`, `write`, `invoke`, or `manage`. |
| `state` | `allow` grants access, `forbid` denies it, and `unset` removes an explicit rule so inherited rules apply (the CLI uses `clear` for `unset`). |

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/permissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": {"namespace": "service", "items": ["myproject", "web"]},
    "user": {"type": "human", "identifier": ["anonymous"]},
    "action": "invoke",
    "state": "forbid"
  }'
```

```json
{
  "modified": true
}
```

The `modified` boolean reports whether the rule changed. If the rule already had the requested state, `modified` is `false`. See [Permission management](advanced-topics/managing-permissions.md) for user matching (`anonymous`, `authenticated`, and exact usernames).

## Check a permission

`POST /v2/projects/{project}/permissions?mode=check`

Checks whether a user is allowed an action without changing any rules.

```bash
curl -X POST "https://api.valar.dev/v2/projects/myproject/permissions?mode=check" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": {"namespace": "service", "items": ["myproject", "web"]},
    "user": {"type": "human", "identifier": ["anonymous"]},
    "action": "invoke"
  }'
```

```json
{
  "allowed": false
}
```
