# Getting started

At this point, we assume you have got access to the Valar Cloud by registering for the invitation list.
If you have not done that already, you should head back to [our website](https://valar.dev) and do that first.

After registering, you will have received an access token for the Valar Cloud. Please keep this token secure as it
identifies you uniquely. Any person or program that has access to your token identifies as yourself.


## Installing the CLI

To get started with deploying your first service, you have to install the Valar command line tool. You can either use the
install script served from our website or build it yourself by pulling [the source from GitHub](https://github.com/valar/cli).

```bash
$ curl -sSL https://cli.valar.dev | bash -
```

You will be asked to enter your password (because we install the binary to `/usr/local/bin`) and your API token.
