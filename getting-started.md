# Getting Started


At this point, we assume you have got access to the Valar Cloud by registering for the invitation list.
If you have not done that already, you should head back to [our website](https://valar.dev) and do that first.

After registering, you will have received an access token for the Valar Cloud. Please keep this token secure as it
identifies you uniquely. Any person or program that has access to your token identifies as yourself.

## Installing the CLI

To get started with deploying your first service, you have to install the Valar command line tool. You can either use the
install script served from our website or build it yourself by pulling [the source from GitHub](https://github.com/valar/cli).

```bash
$ curl -sSL https://cli.valar.dev | bash -
```

You will be asked to enter your password (because we install the binary to `/usr/local/bin`) and your API token.

## Building the service

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

## Publishing our service

Since we have everything set up, we can now just push our source code to Valar and let it take care of building, deploying, scaling and monitoring our application.

```bash
$ valar push
b9f6a979-b31f-4aba-ade0-0e9b5c419605
```

This build ID uniquely identifies the submitted source configuration. If you want to look at all builds of the service, you may run `valar task`.

```bash
$ valar task
ID                                   Status Created
a725978e-01ba-4c39-87c8-d85d600e503f live   2 days ago
7f38d70b-a509-4c27-b122-3f94e3f21f4d live   8 hours ago
31e28c4d-6a7b-47ff-bd42-31b416cab855 live   1 hour ago
```

To inspect a specific build, including build logs and more, you can use `valar task inspect`.
```bash
$ valar task inspect 31e28c4d
ID:       31e28c4d-6a7b-47ff-bd42-31b416cab855
Label:    valar/homepage
Created:  2019-11-22 21:46:33.741182215 +0100 CET
Status:   live
Domain:   valar-homepage.valar.dev
```

You can also stream the build logs directly to your local machine using a single command.
```bash
$ valar task logs --follow 31e28c4d
Logs:
+ mkdir -p /src
+ tar -xzvf src.tar.gz -C /src
./
.dockerignore
LICENSE
README.md
babel.config.js
package-lock.json
...
```

Similar to the logs, you can also follow the logs of the running service instance.
```
$ valar logs --follow
2020/02/16 20:25:06 GET /
2020/02/16 20:25:11 GET /hello
```

**Congratulations, you learned the basics of deploying a service to Valar.**
