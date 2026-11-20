# Environment

Environment variables are passed to your service at deploy time. Sensitive values (API keys, database passwords) should be encrypted before including them in build or deployment requests.

## Encrypt an environment variable

`POST /v2/projects/{project}/environment/encrypt`

Encrypts a plaintext value so it can be safely stored and passed to builds or deployments. The encrypted value is scoped to the project — it cannot be decrypted by other projects.

```bash
$ curl -X POST https://api.valar.dev/v2/projects/myproject/environment/encrypt \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "DATABASE_URL", "value": "postgres://user:pass@host/db"}'
```

```json
{
  "key": "DATABASE_URL",
  "value": "encrypted:v2:...",
  "secret": true
}
```

The response object can be used directly in the `environment` arrays of the [build submission](api/builds.md) and [deployment creation](api/deployments.md) endpoints. The `secret` field is set to `true` to indicate that the value is encrypted.
