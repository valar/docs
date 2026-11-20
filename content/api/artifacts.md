# Artifacts

Before submitting a build, you need to upload your source code as a build artifact. The artifact upload returns a key that you pass to the [build submission endpoint](api/builds.md).

## Upload a build artifact

`POST /v2/projects/{project}/services/{service}/artifacts`

Uploads a binary artifact (typically a tarball of your source code) and returns an artifact key. The CLI handles this automatically when you run `valar builds push`, but you can also upload artifacts directly.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/artifacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @source.tar.gz
```

```json
{
  "artifact": "af7b2c..."
}
```

The returned `artifact` key is used as input when [submitting a build](api/builds.md).

> **Important**: The maximum artifact size is 128 MB. Requests exceeding this limit will be rejected.
