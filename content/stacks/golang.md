# golang

Compiles a static Go binary from the top-level directory. It only supports Alpine Linux.

Accepted constructor aliases are `go`, `golang`, and `golang-1.17`.

```yaml
project: myproject
service: helloworld
build:
  constructor: golang
```

Set `GO_BUILD_FLAGS` in `build.environment` to pass extra flags to `go build` (for example, `-ldflags=-s`). To pass build environment variables over HTTP, see [Builds](api/builds.md).

For a complete Go example, see [Creating a new service](getting-started/service-setup.md).
