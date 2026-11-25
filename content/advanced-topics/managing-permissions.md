# Permission management

Valar organizes access control by namespace: `service` for services and `kv` for the integrated key-value store (the HTTP API also accepts `legacy`). You need `manage` permission on a path to inspect or change its rules.

## Listing permissions

List the permissions in your current project with `valar auth list`:

```bash
valar auth list
```

```text
PATH              USER             ACTION STATE
service:myproject human:anonymous  invoke allowed
service:myproject human:myuser     invoke allowed
service:myproject human:myuser     manage allowed
service:myproject human:myuser     read   allowed
service:myproject human:myuser     write  allowed
```

By default, the command lists rules under `service:myproject`. Pass a path prefix such as `service:myproject/helloworld` to filter the output.

## Changing permissions

Use `allow`, `forbid`, or `clear` to update permissions for a path, user, and action:

- `allow` and `forbid` add a new rule or update an existing one.
- `clear` removes an exact matching rule so access falls back to inherited rules.

For example, to forbid anonymous users from invoking `helloworld`:

```bash
valar auth forbid service:myproject/helloworld human:anonymous invoke
```

```text
modified
```

## Checking permissions

Check whether a user is allowed an action on a path with `valar auth check`:

```bash
valar auth check service:myproject/helloworld human:anonymous invoke
```

```text
forbidden
```

## Evaluation

Permissions use a prefix tree. Both paths and `service` users match by prefix: `myproject` matches `myproject` and `myproject/helloworld`, but not `otherproject`.

Rules can match `human` or `service` users. When `helloworld` accesses the key-value store, it authenticates as `service:myproject/helloworld`, and `service` users follow the same prefix-matching rules as paths.

`human` users are not hierarchical; they use subset matching:

- `human:anonymous` matches any `human` user.
- `human:authenticated` matches all `human` users except `human:anonymous`.
- `human:myuser` matches only the exact account `myuser`.

Exact user matches (`human:myuser`) take priority over `human:authenticated`, and `human:authenticated` takes priority over `human:anonymous`.

To manage permissions over HTTP, see [Permissions](api/permissions.md) (the API uses `unset` where the CLI uses `clear`).
