# Publishing the service

Push the directory containing `.valar.yml` to build your source code and deploy a new version of the service.

```bash
valar build push --wait
```

```text
31e28c4d-6a7b-47ff-bd42-31b416cab855
...
Build has succeeded.
Deployed version 3.
```

The first line is the build ID. With `--wait`, the CLI streams the build log and waits until the new version is live (usually about 30 seconds after the build finishes). It exits non-zero if the build or deployment fails. Without `--wait`, it returns right after printing the build ID.

## Listing builds

List all builds for the current service:

```bash
valar build list
```

```text
ID                                   STATUS CREATED
a725978e-01ba-4c39-87c8-d85d600e503f done   2 days ago
7f38d70b-a509-4c27-b122-3f94e3f21f4d done   8 hours ago
31e28c4d-6a7b-47ff-bd42-31b416cab855 done   1 hour ago
```

## Reaching your service

Print the URLs serving your application:

```bash
valar service url
```

```text
https://myproject-helloworld.valar.app
```

Custom domains appear first, followed by the service's default domain. See [Custom domains](advanced-topics/custom-domains.md) to attach your own domain.

Send a request to verify the live service:

```bash
curl -sSL https://myproject-helloworld.valar.app
```

```text
Hello, you've requested: /
```

> [!TIP]
> To deploy on every push to your repository, see [Deploying from GitHub Actions](advanced-topics/github-actions.md).

To submit or manage builds over HTTP, see the [Builds API](api/builds.md).
