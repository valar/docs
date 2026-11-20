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
$ valar builds logs -f
- Allocating compute resources ...
- Fetching source archive ...
- Executing constructor ...
+ set -e
+ mkdir -p /src
+ mkdir -p /out
...
```

Similar to the logs, you can also follow the logs of the running service instance.
```
$ valar logs -f
2020/02/16 20:25:06 GET /
2020/02/16 20:25:11 GET /hello
```

**Congratulations, you learned the basics of deploying a service to Valar.**
