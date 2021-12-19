# Publishing the service

Since we have everything set up, we can now just push our source code to Valar and let it take care of building, deploying, scaling and monitoring our application.

```bash
$ valar push
b9f6a979-b31f-4aba-ade0-0e9b5c419605
```

This build ID uniquely identifies the submitted source configuration. If you want to look at all builds of the service, you may run `valar builds`.

```bash
$ valar builds
ID                                   STATUS CREATED
a725978e-01ba-4c39-87c8-d85d600e503f done   2 days ago
7f38d70b-a509-4c27-b122-3f94e3f21f4d done   8 hours ago
31e28c4d-6a7b-47ff-bd42-31b416cab855 done   1 hour ago
```

Now, you probably want to reach the service now! After a finished build a deployment is scheduled (which usually takes around 30 seconds or less). If you want to know where your service is running, type `valar list`.

```
NAME       VERSION CREATED      LAST DEPLOYED DOMAINS
hello      3       2 days ago   1 hour ago    valar-hello.valar.app
```

Run `curl -sSL [your app].valar.app` to test it out yourself.