# node-static

Builds a static website with `npm` or `yarn` and serves the output with nginx.

The build runs the install command, then the build command, and serves the output directory with nginx.

```yaml
project: myproject
service: helloworld
build:
  constructor: node-static
  ignore:
    - .valar.yml
    - .git
    - node_modules
    - dist
```

## Build environment variables

Set these build environment variables to change the defaults:

| Variable | Default | Description |
|---|---|---|
| `PACKAGE_MANAGER` | `npm` | Package manager to use (`npm` or `yarn`). |
| `INSTALL_CMD` | `npm install` | Command that installs dependencies. |
| `BUILD_CMD` | `npm run build` | Command that builds the static files. |
| `DIST_FOLDER` | `dist/` | Directory containing the generated static files served by nginx. |

To pass build environment variables over HTTP, see [Builds](api/builds.md).
