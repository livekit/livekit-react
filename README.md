# livekit-react packages

Checkout the docs under https://docs.livekit.io and the READMEs inside the [packages](#packages).

## Packages

- [@livekit/react-core](./packages/core/) provides a minimal set of helpers sans any additional dependencies
- [@livekit/react-components](./packages/components/) includes everything from react-core plus pre-built and styled components.

## Example apps

- [livekit-react-example](./example/)

## Development Setup

This repo uses lerna for managing and publishing packages and turborepo as a taskrunner.
To get startet run

```sh
yarn install
yarn bootstrap
```

To start a dev server that watches all packages and opens the example app run

```sh
yarn start
```
