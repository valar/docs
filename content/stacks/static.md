# static

Serves every non-ignored file in the directory over HTTP.

List any files or directories you do not want published under `build.ignore` in `.valar.yml` (see [Stacks](stacks/index.md#configuring-valaryml)).

```yaml
project: myproject
service: helloworld
build:
  constructor: static
  ignore:
    - .valar.yml
    - .git
```
