# node-static

The `node-static` constructor performs a typical static website build using `npm` or `yarn`.
You may choose between `yarn` or `npm` by setting the `PACKAGE_MANAGER` environment variable respectively.

It executes two consecutive instructions, namely

- `npm install` (configurable via `INSTALL_CMD`)
- `npm run build` (configurable via `BUILD_CMD`)

The constructor assumes that the resulting static files are all stored in the `dist/` (configurable via `DIST_FOLDER`) folder.

The contents of the `DIST_FOLDER` are then served via nginx.