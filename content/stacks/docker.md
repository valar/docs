# docker

Build your service from a `Dockerfile` in the top-level directory, matching a local Docker build.

Put your `Dockerfile` in the top-level directory and include an `EXPOSE` instruction for the port your application listens on. Accepted constructor aliases are `docker`, `dockerfile`, and `kaniko`.

```yaml
project: myproject
service: helloworld
build:
  constructor: docker
```

> [!IMPORTANT]
> Services cannot listen on privileged ports below 1024. Make sure your application listens on and exposes port 1024 or higher.
