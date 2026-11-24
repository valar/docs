# Environment

Valar passes environment variables to your service at deploy time. Encrypt sensitive values such as API keys and database passwords before sending them in build or deployment requests.

## Encrypt an environment variable

`POST /v2/projects/{project}/environment/encrypt`

Encrypts a plaintext value so you can store it safely and pass it to builds or deployments. The encrypted value is scoped to the project and cannot be decrypted by other projects.

```bash
curl -X POST https://api.valar.dev/v2/projects/myproject/environment/encrypt \
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

Pass the returned object in the `environment` array of [Builds](api/builds.md) or [Deployments](api/deployments.md) requests. The `secret` field is set to `true` to mark the value as encrypted.
