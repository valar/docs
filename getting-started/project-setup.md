# Setting up the project

To get started with a simple service, we recommend starting with a simple Go web application. This is also our primary support target
besides static pages. A simple compatible Go web app would be

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

> **Important**: We do not allow software to run on privileged ports, meaning everything below 1024 is restricted by our system.

Create a file called `main.go` and paste the contents into it. If you happen to have Go installed, you may test it using `go run main.go` and check out the output of `curl http://localhost:8080/hello-world`.

## Configuring our service

Every user is allocated one project by default. The project name is the nickname of the user. So if your nickname happens to be `markus`, your default project will be called `markus`. To tell Valar about our little Go web app, we have to run an initialization command.

```bash
$ valar init --type=go --project=markus helloworld
```

> **Important**: While nicknames may contain dashes, services are not allowed.
