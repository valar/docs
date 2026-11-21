# Publishing the service

Since we have everything set up, we can now push our source code to Valar and let it take care of building, deploying, scaling and monitoring our application.

```bash
$ valar build push --wait
b9f6a979-b31f-4aba-ade0-0e9b5c419605
...
Build has succeeded.
Deployed version 3.
```

The first line is the build ID, which uniquely identifies the submitted source. With `--wait`, the CLI then streams the build log, waits until the new version is deployed (usually around 30 seconds after the build), and exits with an error if the build or the deployment fails. Without `--wait`, it returns right after printing the build ID.

If you want to look at all builds of the service, run `valar build list`.

```bash
$ valar build list
ID                                   STATUS CREATED
a725978e-01ba-4c39-87c8-d85d600e503f done   2 days ago
7f38d70b-a509-4c27-b122-3f94e3f21f4d done   8 hours ago
31e28c4d-6a7b-47ff-bd42-31b416cab855 done   1 hour ago
```

To find out where your service is running, run `valar service url`. It prints linked custom domains first, then the service's own domains.

```bash
$ valar service url
https://valar-hello.valar.app
```

Run `curl -sSL https://valar-hello.valar.app` to test it out yourself.

> [!TIP]
> To deploy on every push to your repository, see [Deploying from GitHub Actions](../advanced-topics/github-actions.md).
