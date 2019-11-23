# Constructor `golang`

> Aliases are `go`, `golang`, `golang-1.13`.

The `golang` constructor executes a static binary build. It only supports Alpine Linux environments. It always builds from the top-level directory submitted to Valar.

## Future plans

- assets that should be stored in the same folder as the service executable are user-defined using the environment variable `ASSETS`