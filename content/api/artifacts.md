# Artifacts

Upload your source code as an artifact first. The endpoint returns an artifact key to pass when you [submit a build](api/builds.md).

## Upload a build artifact

`POST /v2/projects/{project}/services/{service}/artifacts`

Uploads a binary artifact (usually a tarball of your source code) and returns an artifact key. The CLI runs this step automatically during `valar build push`, or you can upload artifacts directly.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/services/web/artifacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @source.tar.gz
```

```json
{
  "artifact": "af7b2c..."
}
```

Pass the returned `artifact` key to the [build submission endpoint](api/builds.md).

> [!IMPORTANT]
> The maximum artifact size is 128 MB. Larger requests are rejected.
