# python

Installs dependencies from `requirements.txt` and builds a Python service.

```yaml
project: myproject
service: helloworld
build:
  constructor: python
```

Use the [docker](stacks/docker.md) stack if you need a custom Python setup or extra build steps.
