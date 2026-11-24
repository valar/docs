# Inspecting the logs

Use the Valar CLI to check build metadata, follow build output, and stream logs from your running service.

## Inspecting a build

Inspect a build by its full ID or a unique prefix:

```bash
valar build inspect 31e28c4d
```

```text
ID:           31e28c4d-6a7b-47ff-bd42-31b416cab855
Constructor:  golang
CreatedAt:    2020-10-24 23:20:23.628454 +0000 UTC
Status:       done
Flags:        none
Owner:        myuser
```

## Streaming build logs

Follow the log output of the latest build:

```bash
valar build logs -f
```

```text
- Allocating compute resources ...
- Fetching source archive ...
- Executing constructor ...
+ set -e
+ mkdir -p /src
+ mkdir -p /out
...
```

## Streaming service logs

Follow runtime logs from the deployed service:

```bash
valar logs -f
```

```text
2020/10/24 23:21:06 GET /
2020/10/24 23:21:11 GET /hello-world
```

To fetch build or service logs over HTTP, see [Builds](api/builds.md) and [Services](api/services.md) in the API reference.
