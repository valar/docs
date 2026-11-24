# Setting up the client

Valar builds and runs serverless containers from source. Access is currently invite-only through an existing user. Returning users can go directly to [Stacks](stacks/index.md) or the [API reference](api/index.md).

## Obtaining an API token

The CLI authenticates with an API token. Sign in to the [Valar console](https://console.valar.dev) and create one under **API Tokens**.

> [!WARNING]
> Keep your API token private. Anyone who has it has full access to your account.

For CI, create a project-scoped token with `valar token create` after setting up the CLI. See [Deploying from GitHub Actions](advanced-topics/github-actions.md) for an example.

## Installing the CLI

Install the Valar CLI with Homebrew:

```bash
brew tap valar/tap
brew install valar
```

## Configuring access

The CLI stores global settings in **endpoints** and **contexts**. An endpoint holds an API URL and token; a context pairs an endpoint with a default project so you can switch between projects.

Register the Valar endpoint with your token, add a context for your default project, and activate it:

```bash
# Register the API endpoint
valar config endpoint set valar --url https://api.valar.dev/v2 --token <api-token>

# Create a context for your default project
valar config context set <username> --endpoint valar --project <username>

# Activate the context
valar config context use <username>
```
