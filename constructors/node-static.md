# Constructor `node-static`

The `node-static` constructor performs a typical static website build using `npm`.
It executes two consecutive instructions, namely

- `npm install`
- `npm run build`

The constructor assumes that the resulting static files are all stored in the `dist/` folder.

The contents of this `dist/` folder are then served via HTTP.

## Future plans

- the `npm run build` should be configurable by a user defined `BUILD_CMD`
- the script output folder should be configurable by the user by defining `DIST_FOLDER`