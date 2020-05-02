# Publishing the service

Since we have everything set up, we can now just push our source code to Valar and let it take care of building, deploying, scaling and monitoring our application.

```bash
$ valar push
b9f6a979-b31f-4aba-ade0-0e9b5c419605
```

This build ID uniquely identifies the submitted source configuration. If you want to look at all builds of the service, you may run `valar builds`.

```bash
$ valar builds
ID                                   Status Created
a725978e-01ba-4c39-87c8-d85d600e503f live   2 days ago
7f38d70b-a509-4c27-b122-3f94e3f21f4d live   8 hours ago
31e28c4d-6a7b-47ff-bd42-31b416cab855 live   1 hour ago
```
