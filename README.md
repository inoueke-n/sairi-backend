# sairi-backend

A server module to store and load collected edit history.
For overview, please see the repository: [inoueke-n/sairi-common](https://github.com/inoueke-n/sairi-common).
*This is a snapshot for experiment in lab. If you want to use in some other environment, you should implement an authentication system to keep edit history confidential.*

## Requirement

* Node.js
  * for running API server
* MySQL server
  * for storing edit history index
* NextCloud server
  * storage for edit history

## Settings (Before build)

*note: currently these settings are not read from environment variable so you have to write in source code before the build process.*

* `src/credentials.ts`
  * Generate public/private rsa key pair and store to this file. The public key should also be registered with the client plugin.
* `src/lib/indexstorage/db/index.ts`
  * Set up MySQL server and write an authentication information to this file.
* `src/lib/filestorage/nextcloud/client.ts`
  * Set up [Nextcloud](https://nextcloud.com/) server, create a user, then write an authentication information to this file.

## Build and run

### Build

```sh
npm install
npm run build
```

### Run

```sh
node dist/index.js
```

#### (development: using ts-node)

```sh
npm run api
```

### Docker

(WIP. see `Dockerfile` and `docker-compose.yml`)

## Recording History

API endpoint is `/send/`.
Used by plugin and language server:

* [VS Code](https://github.com/inoueke-n/sairi-plugin-for-vscode)
* [Eclipse](https://github.com/inoueke-n/sairi-plugin-for-eclipse)

## Getting History

*note: currently we have no authentication system to getting history. This endpoint should be hidden by proxy server.*

API endpoint is `/history/`.
(implementation is in `src/api/router/history.ts`).
For example, you can retrieve one's whole edit history by `/history/USER/`.
