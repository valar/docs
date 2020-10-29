# Inspecting the logs

To inspect a specific build, including build logs and more, you can use `valar builds inspect`.
```bash
$ valar builds inspect 31e28c4d
ID:           31e28c4d-6a7b-47ff-bd42-31b416cab855
Constructor:  golang
CreatedAt:    2020-10-24 23:20:23.628454 +0000 UTC
Status:       done
Flags:        none
Owner:        admin
```

You can also stream the build logs directly to your local machine using a single command.
```bash
$ valar builds logs --follow 31e28c4d
- Allocating compute resources ...
- Fetching source archive ...
- Executing constructor ...
+ set -e
+ mkdir -p /src
+ mkdir -p /out
+ tar -xzf /src.tar.gz -C /src
+ cd /src
+ CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -tags netgo -ldflags '-w -extldflags "-static"' -o /out/function
...
```

Similar to the logs, you can also follow the logs of the running service instance.
```
$ valar logs --follow
2020/02/16 20:25:06 GET /
2020/02/16 20:25:11 GET /hello
```

The default domain allocated for a service is `[project]-[service].valar.dev`. But be careful, this may change in the future.

**Congratulations, you learned the basics of deploying a service to Valar.**
