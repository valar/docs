# Permissions

The permission system controls access to Valar resources using namespace-based ACLs. Permissions are organized by namespace (`service`, `kv`) and evaluated hierarchically — a permission on `myproject` also applies to `myproject/myservice`. See [Permission management](advanced-topics/managing-permissions.md) for a full explanation of the evaluation model.

## List permissions

`GET /v2/projects/{project}/permissions?namespace={namespace}&prefix={prefix}`

Returns all permissions matching the given namespace and prefix. Both query parameters are required.

```bash
$ curl "https://api.valar.dev/v2/projects/myproject/permissions?namespace=service&prefix=myproject" \
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

The `namespace` must be one of `legacy`, `service`, or `kv`. The `prefix` filters by resource path — use `myproject` to see all permissions in a project, or `myproject/myservice` to narrow down to a specific service.

> **Important**: You need `manage` permission on the path to list its permissions.

## Update a permission

`POST /v2/projects/{project}/permissions`

Sets a permission rule for a specific path, user, and action. The `state` field controls the outcome: `allow` grants access, `forbid` denies it, and `unset` removes any explicit rule (falling back to the inherited default).

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/permissions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": {"namespace": "service", "items": ["myproject", "myservice"]},
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

The `modified` field indicates whether the permission was actually changed. If the rule already matched the requested state, `modified` is `false`.

Actions are: `read`, `write`, `invoke`, and `manage`. User types are `human` and `service`. See [Permission management](advanced-topics/managing-permissions.md) for details on user matching (e.g. `anonymous`, `authenticated`, exact user).

## Check a permission

`POST /v2/projects/{project}/permissions?mode=check`

Tests whether a specific user would be allowed to perform an action, without changing anything. Useful for debugging permission configurations.

```bash
$ curl -X POST "https://api.valar.dev/v2/projects/myproject/permissions?mode=check" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": {"namespace": "service", "items": ["myproject", "myservice"]},
    "user": {"type": "human", "identifier": ["anonymous"]},
    "action": "invoke"
  }'
```

```json
{
  "allowed": false
}
```
