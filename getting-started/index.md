# Getting started

At this point, we assume you have got access to Valar by registering for the invitation list.
If you have not done that already, you should head back to [our website](https://valar.dev) and do that first.

## Obtaining an API token

At some point you will receive credentials for your Valar account. To use the CLI, we require an API token.
Just head to [the cloud console](https://console.valar.dev), sign in and create a new one under the 'API Tokens' section.
Please keep this token secure as it
identifies you uniquely. Any person or program that has access to your token identifies as yourself.


## Installing the CLI

To get started with deploying your first service, you have to install the Valar command line tool. The simplest way to get started is to use `homebrew`.

```bash
$ brew tap valar/tap
$ brew install valar
```

Congratulations, you've installed Valar. Now we just need to configure your CLI to use the API token obtained beforehand.

```bash
valar config --api-endpoint https://api.valar.dev/v2 --api-token [YOUR API TOKEN HERE]
```

If all goes well, you will be now able to deploy your first service.