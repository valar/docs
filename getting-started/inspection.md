# Inspecting the logs

To inspect a specific build, including build logs and more, you can use `valar task inspect`.
```bash
$ valar task inspect 31e28c4d
ID:       31e28c4d-6a7b-47ff-bd42-31b416cab855
Label:    valar/homepage
Created:  2019-11-22 21:46:33.741182215 +0100 CET
Status:   live
Domain:   valar-homepage.valar.dev
```

You can also stream the build logs directly to your local machine using a single command.
```bash
$ valar task logs --follow 31e28c4d
Logs:
+ mkdir -p /src
+ tar -xzvf src.tar.gz -C /src
./
.dockerignore
LICENSE
README.md
babel.config.js
package-lock.json
...
```

Similar to the logs, you can also follow the logs of the running service instance.
```
$ valar logs --follow
2020/02/16 20:25:06 GET /
2020/02/16 20:25:11 GET /hello
```

**Congratulations, you learned the basics of deploying a service to Valar.**