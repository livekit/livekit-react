# livekit-react packages

> **Warning**
> The packages in this repo have been deprecated in favor of [livekit/components-js](https://github.com/livekit/components-js) > [@livekit/components-react](https://www.npmjs.com/package/@livekit/components-react) are completely redesigned both visually and conceptually.
> More components, more hooks, tree-shakable, easier to handle!

Checkout the docs under https://docs.livekit.io.

## Packages

- [@livekit/react-core](./packages/core/) provides a minimal set of helpers sans any additional dependencies
- [@livekit/react-components](./packages/components/) includes everything from react-core plus pre-built and styled components.

## Example apps

- [livekit-react-example](./example/)

## Development Setup

This repo uses changesets for managing and publishing packages and turborepo as a taskrunner.
To get started run

```sh
yarn install
```

To start a dev server that watches all packages and opens the example app run

```sh
yarn start
```
