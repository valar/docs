# Permissions

The permission system unifies permission management for all Valar components, separated by a concept of namespaces. As of today, there are two of them: `service`, which manages service access and `kv`, which manages access to Valar's integrated key-value store. In these namespaces, users can assign permissions as they see fit. To manage permissions inside a specific path, you'll need to have `manage` permissions within that path.

Let's walk through how to manage permissions for your project. To inspect the permissions in the scope of your project, use `valar auth list`.

```bash
$ valar auth list
PATH              USER             ACTION STATE
service:myproject human:anonymous  invoke allowed
service:myproject human:myuser     invoke allowed
service:myproject human:myuser     manage allowed
service:myproject human:myuser     read   allowed
service:myproject human:myuser     write  allowed
```

The command also takes an optional path parameter (which defaults to `service:myproject`). However, if you want to pre-filter based on a prefix, you could use `service:myproject/myservice`.

To change these permissions, you can opt to either `allow`, `forbid` or `clear` the permissions for a specific path, user and action. While `allow` and `forbid` edit or insert existing permission entries, `clear` removes any specific entry that matches the specified criteria.

```bash
# Forbid anonymous user access to myservice
$ valar auth forbid service:myproject/myservice human:anonymous invoke
modified
```

To check if a specific user can perform an action, you can use `valar auth check`.

```bash
$ valar auth check service:myproject/myservice human:anonymous invoke
forbidden
```

## Evaluation

To understand how permissions are evaluted, you have to view them on a prefix-tree basis. Both paths and users act as prefix matchers, for example any path `myproject` matches `myproject/myservice` and `myproject` but not `otherproject`.

Users can be matched against both `human` and `service` users. For example, if `myservice` would want to access the KV store, it wouth authenticate as `myproject/myservice`. For `service` users, the hierarchical matching applies in the exact same way as described above.

On the other hand, `human` users are not hierarchical in the same way as `service` users, but they use simple subset matching.

- `human:anonymous` matches any `human` user.
- `human:authenticated` matches all except `human:anonymous`.
- `human:myaccount` matches an exact user account with the name `myaccount`.

Exact user matches take priority over `authenticated` matches, while `authenticated` takes priority over `anonymous`.
