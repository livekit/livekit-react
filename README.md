# livekit-react packages

> LiveKit Components are here! Completely redesigned both visually and conceptually. More components, more hooks, smaller build size, easier to handle! Give them a try [here](https://github.com/livekit/components-js).
> LiveKit Components will soon replace this library as our React component library

Checkout the docs under https://docs.livekit.io and the READMEs inside the [packages](#packages).

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
