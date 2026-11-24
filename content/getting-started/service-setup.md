# Creating a new service

Every Valar service handles HTTP traffic from a directory of source code. Create a Go service named `helloworld` in a new directory to deploy your first application.

Save this HTTP server as `main.go`:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        log.Println(r.Method, r.URL.Path)
        fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path)
    })

    http.ListenAndServe(":8080", nil)
}
```

> [!IMPORTANT]
> Valar blocks privileged ports below 1024. Configure your service to listen on port 1024 or higher, such as `:8080`.

If Go is installed locally, start the server and send a test request from a second terminal:

```bash
go run main.go
```

```bash
curl http://localhost:8080/hello-world
```

```text
Hello, you've requested: /hello-world
```

## Configuring the service

Initialize the directory for Valar using the [golang](stacks/golang.md) stack:

```bash
valar init --type go helloworld
```

Pass a different value to `--type` for other runtimes listed in [Stacks](stacks/index.md).

> [!IMPORTANT]
> Service names cannot contain dashes (`-`).

## The .valar.yml file

Running `valar init` creates a `.valar.yml` file in your repository root. It defines the project, service name, build settings, and deployment options:

```yaml
project: myproject
service: helloworld
build:
  constructor: golang
  ignore:
    - .valar.yml
    - .git
  environment: []
deployment:
  skip: false
  environment: []
```

Use `build.ignore` to exclude files such as `.git` from the uploaded source archive, and set `deployment.skip` to `true` to build without deploying. See [Stacks](stacks/index.md) for stack options and `.valar.yml` fields.
