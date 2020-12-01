# Constructor `golang`

> Aliases are `go`, `golang`, `golang-1.13`.

The `golang` constructor executes a static binary build. It only supports Alpine Linux environments. It always builds from the top-level directory submitted to Valar.

## Including assets
Assets can be included using an extra file called `.valar.assets`. This file should list all files and directories that are needed in the runtime environment.
A possible file may look like

```bash
$ cat .valar.assets
templates
assets
```
